# Product-Accurate Image Generator

Generates **accurate product shots** (the real Tone Adapting Foundation, correct
bottle/cap/label/white formula) and **on-brand lifestyle images** for the website
and ads. Uses OpenAI **GPT Image 2** via the **FAL** queue API.

## The core idea (two paths)

| Image type | Endpoint | References | What the engine auto-adds |
|---|---|---|---|
| **Product shot** (`needs_product_images: true`) | `gpt-image-2/edit` | real packshot attached | brand modifier + "match the product precisely" clause (incl. *white formula, NOT beige*) |
| **Lifestyle / no product** (`needs_product_images: false`) | `gpt-image-2` (text-to-image) | none | brand modifier + "do NOT show the product/logo/branding" |

Route every shot where the bottle is visible through the **edit** path so the model
composites the *real* product instead of inventing a wrong one. That's the single
biggest accuracy win.

## Files

```
scripts/image-gen/
├── engine.js            # the generator (CLI + importable module)
├── config.js            # canonical references + product-match / no-product clauses
├── brand-dna.md         # brand spec; the "PROMPT MODIFIER" section is read at runtime
├── product-images/      # canonical packshot(s) — uploaded once per run, reused
│   └── tone-adapting-foundation-front.webp
├── prompts/example.json # demo prompt set (both paths + chaining)
└── outputs/             # generated images land here (gitignored)
```

## Usage

```bash
export FAL_KEY="your-fal-key"      # required for real runs (not stored in repo)

# Generate everything in a prompt set
node scripts/image-gen/engine.js --prompts scripts/image-gen/prompts/example.json

# Only specific ids
node scripts/image-gen/engine.js --prompts scripts/image-gen/prompts/example.json --ids 1,2

# Faster/cheaper test pass (high = production default)
node scripts/image-gen/engine.js --prompts ... --quality medium

# See routing + assembled prompts without spending anything
node scripts/image-gen/engine.js --prompts ... --dry-run

# Write straight into the theme assets folder instead of outputs/
node scripts/image-gen/engine.js --prompts ... --out assets
```

## Writing a prompt set (`prompts/*.json`)

```json
{
  "prompts": [
    { "id": 1, "name": "hero", "needs_product_images": true,  "aspect_ratio": "4:5",
      "prompt": "Describe ONLY the scene/layout around the product." },
    { "id": 2, "name": "lifestyle", "needs_product_images": false, "aspect_ratio": "9:16",
      "prompt": "Describe the lifestyle scene (model, mood, setting)." }
  ]
}
```

- **Just describe the scene.** The brand modifier, the product-match clause, and the
  no-product negative are injected automatically — don't paste them into prompts.
- `aspect_ratio`: `1:1` `4:5` `5:4` `9:16` `16:9` `4:3` `3:4` `3:2` `2:3` (mapped to explicit pixel sizes).
- `reference_urls`: optional extra hosted references for one prompt.
- `chain_from`: `[id, …]` — reuse earlier outputs as references so multi-format
  sets (e.g. a 4:5 feed + 9:16 story) keep the same model/lighting/styling. A
  chained prompt always uses the edit endpoint. (Chaining only resolves on a real
  run, not in `--dry-run`.)

## Adding / changing the product reference

Drop a clean, isolated packshot (plain background, true colour) into
`product-images/`. 1–3 references is the sweet spot — e.g. a front shot and an
angled 3⁄4 shot. Update `PRODUCT_MATCH_CLAUSE` in `config.js` if packaging changes.

## Tuning accuracy

1. Wrong/garbled product on a product shot → confirm `needs_product_images: true`
   and that `product-images/` has the packshot (dry-run shows the ref count).
2. Product drifts/recolors → tighten `PRODUCT_MATCH_CLAUSE` in `config.js` with the
   specific thing it got wrong (the white formula is the usual culprit).
3. Fake product sneaks into a lifestyle shot → that prompt should be
   `needs_product_images: false` (auto-adds the "do NOT show the product" negative).
4. Off-brand look → tighten the **IMAGE GENERATION PROMPT MODIFIER** in `brand-dna.md`.
5. Jobs hang/fail on high quality → already handled: we use the **queue** endpoint
   with polling (the sync endpoint dies at ~60s).

## Cost (token-metered GPT Image 2)

≈ $0.15–0.25 per high-quality image; a 40-image run ≈ $6–10. `--quality medium`
roughly halves it — use it for test passes, `high` for production.

## Deploying generated images

Generated files are scratch (`outputs/`, gitignored). When you pick winners,
move them into `assets/` with the project naming convention (e.g.
`lp-<slug>-hero.jpg`) and reference them via `image_asset` / `bg_image_asset` in
sections — then commit and deploy via GitHub merge (never `shopify theme push`).
