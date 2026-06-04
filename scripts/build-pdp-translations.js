#!/usr/bin/env node
/**
 * Build localized PDP (PL/CS/SL) via the Shopify Admin GraphQL API.
 *
 * Requires the app re-authorized with scopes:
 *   read_locales, write_locales, read_translations, write_translations,
 *   read_products, read_markets, write_markets  (+ existing content/theme)
 *
 * What it does:
 *   1. --enable-languages : enable + publish pl, cs, sl on the store
 *   2. (default)          : match English source values from
 *                           scripts/content/pdp-translations.json against the
 *                           product + theme translatable resources, and register
 *                           translations via translationsRegister.
 *
 * Matching: normalized (tags stripped, whitespace collapsed, lowercased) English
 * value → translation. Reports unmatched fields so we can iterate.
 *
 * Usage:
 *   node scripts/build-pdp-translations.js --enable-languages
 *   node scripts/build-pdp-translations.js --dry-run          # match report only
 *   node scripts/build-pdp-translations.js                    # push translations
 *   node scripts/build-pdp-translations.js --only=product     # product fields only
 *   node scripts/build-pdp-translations.js --only=theme       # theme fields only
 */
const fs = require('fs');
const path = require('path');

for (const l of fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const STORE = '1cw77g-ef';
const PRODUCT_HANDLE = 'color-changing-foundation';
const LOCALES = ['pl', 'cs', 'sl'];
const DRY = process.argv.includes('--dry-run');
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').split('=')[1] || 'all';
const ENABLE = process.argv.includes('--enable-languages');

const ENDPOINT = `https://${STORE}.myshopify.com/admin/api/2024-01/graphql.json`;
async function gql(query, variables) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error('GraphQL: ' + JSON.stringify(j.errors));
  return j.data;
}
// NOTE: case-sensitive on purpose — "Tone Adapting Foundation" (title) vs
// "Tone adapting foundation" (body) must NOT collide.
const norm = s => (s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ').trim();

async function enableLanguages() {
  for (const locale of LOCALES) {
    try {
      const d = await gql(`mutation($l:String!){ shopLocaleEnable(locale:$l){ shopLocale{ locale published } userErrors{ message } } }`, { l: locale });
      const e = d.shopLocaleEnable.userErrors;
      if (e.length) console.log(`  ${locale}: ${e.map(x => x.message).join('; ')}`);
      else console.log(`  ${locale}: enabled`);
    } catch (err) { console.log(`  ${locale}: ${err.message}`); }
    try {
      await gql(`mutation($l:String!){ shopLocaleUpdate(locale:$l, shopLocale:{published:true}){ userErrors{ message } } }`, { l: locale });
      console.log(`  ${locale}: published`);
    } catch (err) { console.log(`  ${locale}: publish -> ${err.message}`); }
  }
}

async function getProductId() {
  const d = await gql(`query($q:String!){ products(first:1, query:$q){ edges{ node{ id title } } } }`, { q: `handle:${PRODUCT_HANDLE}` });
  return d.products.edges[0]?.node.id;
}

// Pull translatable fields for a resource id (product) or by type (theme), paginated.
async function fetchTranslatable({ resourceId, resourceType }) {
  const out = [];
  if (resourceId) {
    const d = await gql(`query($id:ID!){ translatableResource(resourceId:$id){ resourceId translatableContent{ key value digest } } }`, { id: resourceId });
    const r = d.translatableResource;
    if (r) r.translatableContent.forEach(c => out.push({ resourceId: r.resourceId, ...c }));
    return out;
  }
  let cursor = null;
  do {
    const d = await gql(`query($t:TranslatableResourceType!,$c:String){ translatableResources(first:100, resourceType:$t, after:$c){ pageInfo{ hasNextPage endCursor } edges{ node{ resourceId translatableContent{ key value digest } } } } }`, { t: resourceType, c: cursor });
    const conn = d.translatableResources;
    conn.edges.forEach(e => e.node.translatableContent.forEach(c => out.push({ resourceId: e.node.resourceId, ...c })));
    cursor = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
  } while (cursor);
  return out;
}

async function registerBatch(entries) {
  // entries: [{resourceId, translations:[{locale,key,value,translatableContentDigest}]}]
  const CHUNK = 100; // translationsRegister max keys per mutation (theme resources)
  let calls = 0;
  for (const e of entries) {
    if (DRY) continue;
    for (let i = 0; i < e.translations.length; i += CHUNK) {
      const tr = e.translations.slice(i, i + CHUNK);
      const d = await gql(`mutation($id:ID!,$tr:[TranslationInput!]!){ translationsRegister(resourceId:$id, translations:$tr){ userErrors{ field message } } }`,
        { id: e.resourceId, tr });
      calls++;
      const errs = d.translationsRegister.userErrors;
      if (errs.length) console.log(`  ! ${e.resourceId.slice(-24)} chunk ${i / CHUNK}: ${errs.slice(0, 3).map(x => x.message).join('; ')}`);
    }
  }
  console.log(`  (${calls} register calls)`);
}

(async () => {
  if (!TOKEN) { console.error('Missing SHOPIFY_ACCESS_TOKEN'); process.exit(1); }

  if (ENABLE) { console.log('Enabling languages...'); await enableLanguages(); return; }

  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'content', 'pdp-translations.json'), 'utf8'));
  // build normalized english -> {pl,cs,sl}
  const map = new Map();
  for (const row of data.entries) {
    const k = norm(row.en);
    if (k) map.set(k, row);
  }
  console.log(`Loaded ${map.size} translation entries.`);

  const targets = [];
  if (ONLY === 'all' || ONLY === 'product') {
    const pid = await getProductId();
    if (!pid) throw new Error('product not found');
    targets.push(...await fetchTranslatable({ resourceId: pid }));
    // product options + option values are separate translatable resource types
    for (const t of ['PRODUCT_OPTION', 'PRODUCT_OPTION_VALUE']) {
      try { targets.push(...await fetchTranslatable({ resourceType: t })); } catch (e) { /* type may not exist on older shops */ }
    }
  }
  if (ONLY === 'all' || ONLY === 'theme') {
    targets.push(...await fetchTranslatable({ resourceType: 'ONLINE_STORE_THEME' }));
    targets.push(...await fetchTranslatable({ resourceType: 'LINK' })); // nav menu items
  }
  console.log(`Fetched ${targets.length} translatable fields.`);

  const byResource = new Map();
  let matched = 0; const unmatched = [];
  for (const f of targets) {
    if (!f.value || !f.digest) continue;
    const row = map.get(norm(f.value));
    if (!row) { unmatched.push(f.value.slice(0, 70)); continue; }
    matched++;
    if (!byResource.has(f.resourceId)) byResource.set(f.resourceId, []);
    for (const loc of LOCALES) {
      if (row[loc]) byResource.get(f.resourceId).push({ locale: loc, key: f.key, value: row[loc], translatableContentDigest: f.digest });
    }
  }
  console.log(`Matched ${matched} fields -> ${byResource.size} resources.`);
  if (unmatched.length) {
    console.log(`Unmatched (${unmatched.length}) — first 25:`);
    [...new Set(unmatched)].slice(0, 25).forEach(u => console.log('   • ' + u));
  }
  if (DRY) { console.log('\n[dry-run] no writes performed.'); return; }

  const entries = [...byResource.entries()].map(([resourceId, translations]) => ({ resourceId, translations }));
  await registerBatch(entries);
  console.log(`Done. Registered translations for ${entries.length} resources across ${LOCALES.join('/')}.`);
})().catch(e => { console.error(e.message); process.exit(1); });
