#!/usr/bin/env node
/*
 * Migrate landing-page (lp-*) theme assets to Shopify Files (CDN).
 *
 * Why: the GitHub-connected theme exceeds Shopify's 50MB import cap (77MB),
 * almost entirely from lp-* landing-page images in /assets. Moving them to
 * Shopify Files (served from cdn.shopify.com) drops the theme to ~19MB so the
 * GitHub import/sync works again.
 *
 * Reads a newline-separated list of asset paths (default: /tmp/lp_migrate_list.txt),
 * uploads each via stagedUploadsCreate -> GCS POST -> fileCreate, polls until the
 * MediaImage is READY, and records the real returned CDN url.
 *
 * Output map: scripts/lp-files-map.json  { "lp-x.jpg": "https://cdn.shopify.com/..." }
 * Idempotent + resumable: skips filenames already present in the map.
 *
 * Usage:
 *   SHOPIFY_ACCESS_TOKEN=... node scripts/migrate-lp-to-files.js [--list FILE] [--limit N]
 */
const fs = require('fs');
const path = require('path');

const SHOP = '1cw77g-ef.myshopify.com';
const API = `https://${SHOP}/admin/api/2024-01/graphql.json`;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const ROOT = path.resolve(__dirname, '..');
const MAP_PATH = path.join(ROOT, 'scripts', 'lp-files-map.json');

if (!TOKEN) { console.error('Missing SHOPIFY_ACCESS_TOKEN'); process.exit(1); }

const args = process.argv.slice(2);
const listPath = (args.includes('--list') ? args[args.indexOf('--list') + 1] : '/tmp/lp_migrate_list.txt');
const limit = args.includes('--limit') ? parseInt(args[args.indexOf('--limit') + 1], 10) : Infinity;

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gql(query, variables) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error('GraphQL: ' + JSON.stringify(json.errors));
  return json.data;
}

async function stagedTarget(filename, mimeType) {
  const d = await gql(
    `mutation($input:[StagedUploadInput!]!){ stagedUploadsCreate(input:$input){
       stagedTargets{ url resourceUrl parameters{ name value } } userErrors{ message } } }`,
    { input: [{ filename, mimeType, resource: 'FILE', httpMethod: 'POST' }] }
  );
  const e = d.stagedUploadsCreate.userErrors;
  if (e && e.length) throw new Error('staged: ' + JSON.stringify(e));
  return d.stagedUploadsCreate.stagedTargets[0];
}

async function uploadToTarget(target, buf, filename, mimeType) {
  const form = new FormData();
  for (const p of target.parameters) form.append(p.name, p.value);
  form.append('file', new Blob([buf], { type: mimeType }), filename);
  const res = await fetch(target.url, { method: 'POST', body: form });
  if (!(res.status >= 200 && res.status < 300)) {
    throw new Error(`upload HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
}

async function fileCreate(resourceUrl, filename) {
  const d = await gql(
    `mutation($files:[FileCreateInput!]!){ fileCreate(files:$files){
       files{ id fileStatus alt ... on MediaImage { image { url } } } userErrors{ message } } }`,
    { files: [{ originalSource: resourceUrl, contentType: 'IMAGE', alt: filename }] }
  );
  const e = d.fileCreate.userErrors;
  if (e && e.length) throw new Error('fileCreate: ' + JSON.stringify(e));
  return d.fileCreate.files[0];
}

async function pollUrl(id) {
  for (let i = 0; i < 40; i++) {
    const d = await gql(
      `query($id:ID!){ node(id:$id){ ... on MediaImage { fileStatus image { url } } } }`,
      { id }
    );
    const n = d.node;
    if (n && n.fileStatus === 'READY' && n.image && n.image.url) return n.image.url;
    if (n && n.fileStatus === 'FAILED') throw new Error('file FAILED processing');
    await sleep(1500);
  }
  throw new Error('timed out waiting for READY');
}

(async () => {
  const list = fs.readFileSync(listPath, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
  const map = fs.existsSync(MAP_PATH) ? JSON.parse(fs.readFileSync(MAP_PATH, 'utf8')) : {};
  let done = 0, skipped = 0, failed = 0;
  for (const rel of list) {
    if (done >= limit) break;
    const filename = path.basename(rel);
    if (map[filename]) { skipped++; continue; }
    const ext = filename.split('.').pop().toLowerCase();
    const mimeType = MIME[ext] || 'application/octet-stream';
    const abs = path.join(ROOT, rel);
    try {
      const buf = fs.readFileSync(abs);
      const target = await stagedTarget(filename, mimeType);
      await uploadToTarget(target, buf, filename, mimeType);
      const file = await fileCreate(target.resourceUrl, filename);
      const url = file.image && file.image.url ? file.image.url : await pollUrl(file.id);
      map[filename] = url.split('?')[0]; // drop the ?v= cache-buster; stable base url
      fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2) + '\n');
      done++;
      console.log(`[${done}] ${filename} -> ${map[filename]}`);
    } catch (err) {
      failed++;
      console.error(`FAIL ${filename}: ${err.message}`);
    }
  }
  console.log(`\nUploaded ${done}, skipped(existing) ${skipped}, failed ${failed}. Map: ${MAP_PATH} (${Object.keys(map).length} entries)`);
})();
