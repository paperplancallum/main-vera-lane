#!/usr/bin/env node
/**
 * Upload localized gallery webp images to Shopify Files (GraphQL staged upload),
 * then print a position/locale -> CDN URL map for the gallery snippet.
 *
 * Requires write_files scope. Source dir hardcoded below.
 */
const fs = require('fs');
const path = require('path');
const env = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const TOKEN = (env.match(/^SHOPIFY_ACCESS_TOKEN=(.*)$/m) || [])[1].trim();
const STORE = '1cw77g-ef';
const SRC = '/Users/callummundine/Desktop/App Development/Static Ad Generator - GPT2/gallery-localization/outputs';
const LOCALES = ['pl', 'cs', 'sl'];
const IMAGES = [2, 3, 4, 5, 6]; // img1 is generic, not localized

const gql = async (q, v) => {
  const r = await fetch(`https://${STORE}.myshopify.com/admin/api/2024-01/graphql.json`, {
    method: 'POST', headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: q, variables: v }),
  });
  return r.json();
};

async function stagedTarget(filename) {
  const d = await gql(`mutation($input:[StagedUploadInput!]!){ stagedUploadsCreate(input:$input){ stagedTargets{ url resourceUrl parameters{ name value } } userErrors{ message } } }`,
    { input: [{ filename, mimeType: 'image/webp', resource: 'FILE', httpMethod: 'POST' }] });
  const t = d.data.stagedUploadsCreate.stagedTargets[0];
  if (!t) throw new Error('no staged target: ' + JSON.stringify(d));
  return t;
}

async function uploadToStaged(target, filePath) {
  const form = new FormData();
  for (const p of target.parameters) form.append(p.name, p.value);
  const buf = fs.readFileSync(filePath);
  form.append('file', new Blob([buf], { type: 'image/webp' }), path.basename(filePath));
  const r = await fetch(target.url, { method: 'POST', body: form });
  if (!r.ok && r.status !== 201 && r.status !== 204) throw new Error('staged upload failed ' + r.status);
}

async function createFile(resourceUrl, filename) {
  const d = await gql(`mutation($files:[FileCreateInput!]!){ fileCreate(files:$files){ files{ id alt fileStatus ... on MediaImage{ image{ url } } } userErrors{ message } } }`,
    { files: [{ originalSource: resourceUrl, contentType: 'IMAGE', filename }] });
  const e = d.data.fileCreate.userErrors;
  if (e.length) throw new Error('fileCreate: ' + e.map(x => x.message).join('; '));
  return d.data.fileCreate.files[0].id;
}

async function resolveUrl(id) {
  // poll until processed
  for (let i = 0; i < 20; i++) {
    const d = await gql(`query($id:ID!){ node(id:$id){ ... on MediaImage{ fileStatus image{ url } } } }`, { id });
    const n = d.data.node;
    if (n && n.image && n.image.url) return n.image.url;
    await new Promise(r => setTimeout(r, 2000));
  }
  return null;
}

(async () => {
  const map = {};
  for (const n of IMAGES) {
    for (const loc of LOCALES) {
      const file = path.join(SRC, `img${n}`, `img${n}-${loc}-web.webp`);
      if (!fs.existsSync(file)) { console.log(`skip (missing): img${n}-${loc}`); continue; }
      const filename = `vl-gallery-img${n}-${loc}.webp`;
      try {
        const t = await stagedTarget(filename);
        await uploadToStaged(t, file);
        const id = await createFile(t.resourceUrl, filename);
        const url = await resolveUrl(id);
        map[`${loc}-${n}`] = url;
        console.log(`✓ ${loc}-${n} -> ${url}`);
      } catch (e) { console.log(`✗ ${loc}-${n}: ${e.message}`); }
    }
  }
  fs.writeFileSync(path.join(__dirname, 'content', 'localized-gallery-urls.json'), JSON.stringify(map, null, 2));
  console.log('\nSaved map to scripts/content/localized-gallery-urls.json');
})().catch(e => { console.error(e.message); process.exit(1); });
