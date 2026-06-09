#!/usr/bin/env node
/**
 * Generate per-product "rich" PDP templates from the foundation hero.
 *
 * For each product in content/rich-pdp-content.json it clones the foundation's
 * lumen-pdp-hero section (the reusable premium frame: sticky gallery, variant
 * swatches, price, ATC, magazine logos, trust badges), drops the foundation-only
 * blocks (bundles, upsell, UGC), re-points it at the product, and swaps in that
 * product's rating + 3 benefit accordions. Writes templates/product.<slug>.json.
 *
 * Usage: node scripts/build-rich-templates.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const stripComment = (s) => s.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
const foundation = JSON.parse(stripComment(fs.readFileSync(path.join(ROOT, 'templates/product.foundation.json'), 'utf8')));
const baseHero = foundation.sections['lumen_pdp_hero_WWxn3E'];
if (!baseHero) throw new Error('lumen_pdp_hero not found in foundation template');

const DROP_TYPES = new Set(['bundle', 'bundle_option', 'upsell_product', 'ugc_video']);
const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'content/rich-pdp-content.json'), 'utf8'));
const clone = (o) => JSON.parse(JSON.stringify(o));

for (const p of content) {
  const hero = clone(baseHero);

  // 1) Re-point the hero at this product + per-product copy; kill foundation-only modules.
  hero.settings.product = '';                       // blank => bind to the page's own product (robust to handle changes)
  hero.settings.custom_title = '';                 // fall back to the product's own title
  hero.settings.rating_text = p.rating_text;
  hero.settings.intro_text = `<p>${p.intro}</p>`;   // product description under the price
  hero.settings.size_text = p.size || '';           // blank for non-volume products (pencils/sticks)
  // description is a rich-text setting — must be block-level HTML. Mirror the
  // foundation's pattern: a <ul> of the benefits (bold title + plain content).
  hero.settings.description = '<ul>' + p.accordions
    .map((a) => `<li><strong>${a.title}: </strong>${a.content.replace(/<\/?p>/g, '')}</li>`)
    .join('') + '</ul>';
  hero.settings.show_tone_selector = true;          // render real variant swatches
  hero.settings.show_shade_guide = false;           // foundation-only "shade guide" (color-changing copy) — off for other products
  hero.settings.show_ugc = false;
  hero.settings.show_upsell = false;

  // 2) Drop bundle / upsell / UGC blocks (keep description_item, magazine_logo, trust_badge).
  const keptOrder = hero.block_order.filter((id) => !DROP_TYPES.has(hero.blocks[id].type));
  for (const id of Object.keys(hero.blocks)) if (DROP_TYPES.has(hero.blocks[id].type)) delete hero.blocks[id];
  hero.block_order = keptOrder;

  // 3) Swap the 3 description_item accordions (in block_order sequence) with this product's copy.
  const descIds = hero.block_order.filter((id) => hero.blocks[id].type === 'description_item');
  p.accordions.forEach((acc, i) => {
    if (!descIds[i]) return;
    hero.blocks[descIds[i]].settings.title = acc.title;
    hero.blocks[descIds[i]].settings.content = acc.content;
  });

  const tpl = { sections: { main: hero }, order: ['main'] };
  const out = path.join(ROOT, `templates/product.${p.slug}.json`);
  fs.writeFileSync(out, JSON.stringify(tpl, null, 2) + '\n');
  console.log(`✓ ${p.slug} -> ${p.handle}  (${hero.block_order.length} blocks: ${descIds.length} accordions, ${hero.block_order.filter(id=>hero.blocks[id].type==='magazine_logo').length} logos, ${hero.block_order.filter(id=>hero.blocks[id].type==='trust_badge').length} badges)`);
}
console.log('\nDone.');
