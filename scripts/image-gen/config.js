// Central config for the product-accurate image generator.
//
// Two things drive accuracy (see scripts/image-gen/README.md):
//   1. Product shots are conditioned on a REAL product image (the /edit endpoint).
//   2. Every prompt is anchored with the brand "prompt modifier" + a precise
//      product-match clause that pins the true physical attributes.
//
// This file is the single place to update the canonical product reference(s)
// and the product spec. The human-readable brand spec lives in brand-dna.md;
// the prompt modifier is read from there at runtime (with the fallback below).

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Canonical product references
// ---------------------------------------------------------------------------
// The canonical packshot lives in product-images/ (a clean, isolated, true-white
// shot of the Tone Adapting Foundation) and is uploaded to FAL once per run, then
// prepended to every product shot so the model composites the real bottle instead
// of inventing one. 1-3 references is the sweet spot — add an angled/3-4 shot to
// product-images/ if you want a second reference.
const LOCAL_PRODUCT_IMAGES_DIR = path.join(__dirname, 'product-images');

// PUBLIC, directly-reachable packshot URLs. Normally empty (the canonical
// reference comes from product-images/ above). Use this only for a hosted
// fallback or extra references. Reachable fallback on the Shopify CDN:
//   https://cdn.shopify.com/s/files/1/0956/7705/5254/files/3_7ab1d15e-f568-40a5-8fa8-fa44461674e4.png?v=1773760736
const PRODUCT_REFERENCES = [];

const PRODUCT_NAME = 'Vera Lane Tone Adapting Foundation';

// ---------------------------------------------------------------------------
// Product-match clause (auto-prepended to every needs_product_images:true shot)
// ---------------------------------------------------------------------------
// Restates the product precisely AND negates the model's recurring mistakes
// (the white formula is the #1 thing models get wrong — they default to beige).
const PRODUCT_MATCH_CLAUSE =
  `Use the attached image(s) as the exact product reference and match the ` +
  `${PRODUCT_NAME} precisely: a tall rectangular frosted-glass bottle with a ` +
  `matte black square flat-top pump cap; a thin elegant serif "VERA LANE" ` +
  `wordmark across the upper-middle of the bottle; bold sans-serif "TONE ADAPTING ` +
  `FOUNDATION" in the lower third with "ADAPTS TO YOUR SKIN TONE INSTANTLY" ` +
  `beneath it. CRITICAL: the formula inside is PURE WHITE cream (NOT beige, NOT ` +
  `tan, NOT skin-coloured). Do not alter the label text, cap shape, or bottle ` +
  `proportions, and do not add any other logos or branding.`;

// Explicit negative for lifestyle/no-product shots (auto-appended when
// needs_product_images:false) — stops the model sneaking in a mangled bottle.
const NO_PRODUCT_CLAUSE =
  'Do NOT include the product, the bottle, any logo, label, or branding in this image.';

// ---------------------------------------------------------------------------
// Prompt modifier — read from brand-dna.md "IMAGE GENERATION PROMPT MODIFIER"
// ---------------------------------------------------------------------------
const FALLBACK_MODIFIER =
  'Vera Lane: modern clean-beauty foundation brand. Soft diffused natural ' +
  'daylight, warm neutral palette (creams, soft beige, warm taupe), gentle ' +
  'contrast, photorealistic skin with real texture (no plastic AI look), ' +
  'editorial magazine-quality composition with generous negative space, ' +
  '50mm shallow depth of field. Premium, warm, trustworthy, effortless.';

function getPromptModifier() {
  try {
    const md = fs.readFileSync(path.join(__dirname, 'brand-dna.md'), 'utf8');
    // Grab everything under the "IMAGE GENERATION PROMPT MODIFIER" heading,
    // up to the next heading or EOF, stripping markdown blockquote/heading marks.
    const m = md.match(/#+\s*IMAGE GENERATION PROMPT MODIFIER[^\n]*\n([\s\S]*?)(?:\n#+\s|\n*$)/i);
    if (m && m[1]) {
      const text = m[1]
        .split('\n')
        .map((l) => l.replace(/^\s*>?\s?/, '').trim())
        .filter(Boolean)
        .join(' ')
        .trim();
      if (text.length > 20) return text;
    }
  } catch (_) {
    /* fall through to fallback */
  }
  return FALLBACK_MODIFIER;
}

module.exports = {
  PRODUCT_REFERENCES,
  LOCAL_PRODUCT_IMAGES_DIR,
  PRODUCT_NAME,
  PRODUCT_MATCH_CLAUSE,
  NO_PRODUCT_CLAUSE,
  getPromptModifier,
};
