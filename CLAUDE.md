# Vera Lane Cosmetics - Shopify Theme

## Store
- Shopify store ID: `1cw77g-ef`
- Live URL: https://veralanecosmetics.com
- Dev server command: `shopify theme dev --store 1cw77g-ef`

## Git Workflow
- Always create a new branch from `main` before making changes
- Never commit directly to `main`
- At the start of every session, pull latest `main` and create a new branch (e.g. `advertorials-march20`)
- Push branches to `origin` for preview via Shopify GitHub integration

## Theme Architecture
- **Default layout** (`layout/theme.liquid`): Includes header and footer — used for standard pages
- **Landing page layout** (`layout/theme.vl-landing.liquid`): No header/footer — used for advertorials and landing pages
- Landing page templates should set `"layout": "theme.vl-landing"` in their JSON
- Custom landing page sections are prefixed with `vl-` (e.g., `vl-lp-header`, `vl-editorial-hero`)
- Blissy-style listicle sections are prefixed with `bl-` (e.g., `bl-hero`, `bl-reason-item`)

## Templates
- `page.vl-advertorial.json` — Advertorial template (uses `theme.vl-landing`)
- `page.lp-li-1.json` — "5 Signs" listicle landing page (uses `theme.vl-landing`)
- `page.lp-why-every-foundation-looks-wrong.json` — "Why Every Foundation Looks Wrong"
- `page.lp-5-things-dermatologists-foundation-after-40.json` — "5 Things Dermatologists"
- `page.vl-alp-lp*.json` — Amazon landing page variants
- `page.vl-product-lp.json` — Product-focused landing page

## Key Products
- Color Changing Foundation (handle: `color-changing-foundation`)

## Deployment Workflow — STRICT RULES

**NEVER run `shopify theme push` to deploy changes to the live theme.** The Shopify store pulls from GitHub automatically. Direct pushes bypass the GitHub integration and cause the live theme to drift out of sync with the repository.

The correct deployment workflow is:
1. Make all changes locally on a feature branch
2. Commit and push the branch to GitHub (`git push origin <branch>`)
3. Create a PR and merge into `main`
4. Shopify automatically pulls the updated theme from `main` via GitHub integration
5. Create Shopify pages via Admin API only after the theme has been deployed through GitHub

**`shopify theme push` is ONLY permitted for:**
- Emergency hotfixes that the user explicitly authorises
- Never as part of the standard development workflow

**`shopify theme dev` is fine** for local preview/testing.

## Multi-Language / Localization — IMPORTANT
The store serves **three non-English markets — Polish (`pl`), Czech (`cs`),
Slovenian (`sl`)** — via **Shopify Markets + the Translations API** (not separate
templates/pages). Translated copy is registered against Shopify *translatable
resources*, so `{{ block.settings.x }}` / product fields render localized
**automatically** per locale — section & theme settings need **no `| t` filter**
(that filter is only for `locales/*.json` UI strings).

**RULE: any time you add or change user-facing content on the site, check whether a
non-English version exists and update/add the translation too.** An English-only
change silently leaves PL/CS/SL showing English (or stale) copy — this is the most
common localization bug here. (Known existing gap: the `vl-message-match-hero`
`?v=` variants were English-only until translated case-by-case.)

Workflow when you add/edit PDP content (e.g. a new message-match hero variant):
1. **Deploy the English change first** via GitHub merge — Shopify must re-scan the
   theme so new section settings become translatable resources before they can be
   translated.
2. Add the new English string + `pl`/`cs`/`sl` to
   [scripts/content/pdp-translations.json](scripts/content/pdp-translations.json).
   The matcher is **case-sensitive**: the `en` value must mirror the stored source
   exactly (HTML stripped + whitespace collapsed only — see `norm()` in the script).
3. Run `node scripts/build-pdp-translations.js` (`--dry-run` first; `--only=theme`
   or `--only=product` to scope; `--enable-languages` to (re)publish locales).
   Registers via the Admin API — **no theme redeploy needed** once the resource exists.
4. Verify: query `translatableResource(resourceId).translations(locale:)`, or load
   `/products/<handle>` on a localized domain/path.

Needs `SHOPIFY_ACCESS_TOKEN` in `.env` with `read/write_translations` +
`read/write_locales` scopes. `pdp-translations.json` + `build-pdp-translations.js`
are local tooling (not part of the deployed theme).

## Landing Page URL Convention — IMPORTANT
All landing pages (advertorials, listicles, reviews, etc.) MUST use URLs starting with `/lp-`. The `/lp-` prefix is used by the store to trigger specific popups and tracking.

- Template naming: `page.lp-<article-title>.json`
- Content JSON slug: `lp-<article-title>`
- Shopify page handle: `lp-<article-title>`
- Example: `page.lp-vera-lane-foundation-review.json` → URL becomes `/pages/lp-vera-lane-foundation-review`

Never create a landing page without the `lp-` prefix.

## Landing Page Generator Workflow
1. Write content JSON in `scripts/content/<slug>.json` (hero, 5 reasons, product card)
2. Run `node scripts/create-landing-page.js scripts/content/<file>.json` to generate template
3. Generate images via fal.ai and save to `assets/`
4. Commit all files and push branch to GitHub
5. Create PR → merge into `main` → Shopify pulls automatically
6. Create page via Shopify Admin API (token in `.env` as `SHOPIFY_ACCESS_TOKEN`)
   - `POST /admin/api/2024-01/pages.json` with `template_suffix` matching template filename
   - Store: `1cw77g-ef`, scopes: `read_content,write_content,read_themes,write_themes`

### Image Generation — PREFERRED: product-accurate generator (`scripts/image-gen/`)
- For any image where the **product is visible**, use `scripts/image-gen/` — it
  conditions on the real packshot via GPT Image 2's `/edit` endpoint so the bottle,
  cap, label, and (critically) the **white formula** render accurately instead of
  being invented. See `scripts/image-gen/README.md`.
- Two paths, set per prompt: `needs_product_images: true` → `gpt-image-2/edit` +
  real reference; `false` → `gpt-image-2` text-to-image + auto "do NOT show product".
- Canonical packshot: `scripts/image-gen/product-images/` (uploaded once per run).
  Brand spec / prompt modifier: `scripts/image-gen/brand-dna.md`.
- Run: `FAL_KEY=… node scripts/image-gen/engine.js --prompts scripts/image-gen/prompts/<set>.json`
  (`--dry-run` to preview routing, `--quality medium` for cheap test passes).
- Always `Authorization: Key $FAL_KEY`; always the **queue** endpoint
  (`queue.fal.run`) with polling — the sync endpoint times out ~60s.

### Image Generation — legacy text-to-image (Nano Banana 2)
- Older one-off scripts (e.g. `scripts/generate-lp-li-2-images.js`) use
  `fal-ai/nano-banana-2` (queue endpoint, text-to-image, no product reference).
  Fine for pure lifestyle/scene images; do NOT use it for product shots — it
  invents a wrong bottle. Prefer the product-accurate generator above.
- Resolution must be uppercase: `"0.5K"`, `"1K"`, `"2K"`, `"4K"` (not lowercase).
- Generated images go in `assets/` as JPG, referenced via `image_asset` / `bg_image_asset`.

### Image Naming Convention
- Hero: `lp-<short-slug>-hero.jpg`
- Reasons: `lp-<short-slug>-reason-1.jpg` through `reason-5.jpg`
- Aspect ratios: hero `16:9`, reasons `3:4`

### Section Asset Image Support
- `bl-hero.liquid`: uses `bg_image_asset` (text setting) as fallback to `bg_image` (image picker)
- `bl-reason-item.liquid`: uses `image_asset` (text setting) as fallback to `image` (image picker)
- Product card still uses `shopify://shop_images/` reference for existing product images

## Shopify CLI
- Dev server (local preview): `shopify theme dev --store 1cw77g-ef`
- Live theme ID: `187071955222` (`main-vera-lane/main`, role=main) — verify with `GET /admin/api/2024-01/themes.json` and pick `role==="main"`; IDs change when the GitHub-connected theme is re-linked. (`185429229846` is now the unpublished `main-manual` copy — do not use.)
- **DO NOT use `shopify theme push` to deploy** — deploy via GitHub merge only (see Deployment Workflow above)
