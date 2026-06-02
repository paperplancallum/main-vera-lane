#!/usr/bin/env node

/**
 * Create the lp-li-3 international advertorial pages (PL / CS / SL) via the
 * Shopify Admin API.
 *
 * PREREQUISITE: the branch lp-li-3-intl-pl-cs-sl must already be merged into
 * `main` and pulled by Shopify, so the template suffixes below exist in the
 * live theme. Running this before the merge creates pages that fall back to the
 * default page template (blank/wrong).
 *
 * Idempotent: if a page with the target handle already exists it is updated
 * (template_suffix re-applied) instead of duplicated.
 *
 * Usage:
 *   node scripts/create-lp-li-3-intl-pages.js          # create/update all 3
 *   node scripts/create-lp-li-3-intl-pages.js --dry-run
 *
 * Env (.env): SHOPIFY_ACCESS_TOKEN
 */

const fs = require('fs');
const path = require('path');

// --- minimal .env loader (no dependency) ---
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}

const STORE = '1cw77g-ef';
const API_VERSION = '2024-01';
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');

if (!TOKEN) {
  console.error('Missing SHOPIFY_ACCESS_TOKEN in .env');
  process.exit(1);
}

const BASE = `https://${STORE}.myshopify.com/admin/api/${API_VERSION}`;
const headers = {
  'X-Shopify-Access-Token': TOKEN,
  'Content-Type': 'application/json',
};

// handle === template_suffix so /pages/<handle> renders page.<suffix>.json
const PAGES = [
  {
    handle: 'lp-li-3-pl',
    title: '10 Powodów, Dla Których Pokolenie Z Pokochało Ten Podkład',
    template_suffix: 'lp-li-3-pl',
  },
  {
    handle: 'lp-li-3-cs',
    title: '10 Důvodů, Proč Generace Z Miluje Tento Make-up',
    template_suffix: 'lp-li-3-cs',
  },
  {
    handle: 'lp-li-3-sl',
    title: '10 Razlogov, Zakaj Generacija Z Obožuje To Podlago',
    template_suffix: 'lp-li-3-sl',
  },
];

async function findByHandle(handle) {
  const res = await fetch(`${BASE}/pages.json?handle=${encodeURIComponent(handle)}`, { headers });
  if (!res.ok) throw new Error(`GET pages (${handle}) → ${res.status} ${await res.text()}`);
  const { pages } = await res.json();
  return pages && pages[0];
}

async function createPage(p) {
  const res = await fetch(`${BASE}/pages.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      page: {
        title: p.title,
        handle: p.handle,
        template_suffix: p.template_suffix,
        body_html: '',
        published: true,
      },
    }),
  });
  if (!res.ok) throw new Error(`POST page (${p.handle}) → ${res.status} ${await res.text()}`);
  return (await res.json()).page;
}

async function updatePage(id, p) {
  const res = await fetch(`${BASE}/pages/${id}.json`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      page: { id, title: p.title, template_suffix: p.template_suffix, published: true },
    }),
  });
  if (!res.ok) throw new Error(`PUT page (${p.handle}) → ${res.status} ${await res.text()}`);
  return (await res.json()).page;
}

(async () => {
  for (const p of PAGES) {
    if (DRY_RUN) {
      console.log(`[dry-run] would ensure /pages/${p.handle} → suffix ${p.template_suffix}`);
      continue;
    }
    const existing = await findByHandle(p.handle);
    const page = existing ? await updatePage(existing.id, p) : await createPage(p);
    console.log(
      `${existing ? '↻ updated' : '✓ created'}  https://veralanecosmetics.com/pages/${page.handle}  (suffix: ${page.template_suffix})`
    );
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
