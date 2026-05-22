# TODO: regenerate the 4 foundation PDP testimonial images

## Why

The 4 `testimonial_card` blocks in `lumen_before_after_section` on
`templates/product.foundation.json` (Linda 62, Michelle 57, Diane 54,
Amanda 47) use images whose filenames pattern-match to stock libraries or
design tools — `woman-13.jpg`, `Untitled_design_68.png`, sequenced uploads,
CleanShot screenshot exports. For the 45+ audience these read as fake and
erode trust.

PR #77 added a "Verified Buyer" badge to each card as an immediate
compliance gesture. The next step is to replace the photos with something
that looks closer to an authentic customer portrait.

## Plan when picking this back up

1. Decide creative direction:
   - Lifestyle natural-light portraits of women 47–62 in real-looking
     settings (kitchen window, bathroom mirror, sofa) — consistent
     warm-tone editorial vibe across all four.
   - Real skin, fine lines visible, no retouching prompts.
   - Square 1:1 (will be cropped to circular avatar by the section CSS) at
     1024×1024.

2. Use fal.ai `openai/gpt-image-2` (`square_hd`, `quality: high`,
   `output_format: jpeg`). Same workflow as the MMH images from PR #71 —
   see `/tmp/fal_submit_1x1.py` for a working submit script template.

3. Prompts (one per persona, tuned to each card's name + age):
   - **Linda, 62** — gentle smile, soft kitchen morning light, gray-blonde
     bob, ceramic mug on the counter beside her, navy sweater, real skin
     texture with crow's-feet, no retouching.
   - **Michelle, 57** — quietly confident at her home vanity, soft side
     light, auburn shoulder-length hair, cream linen shirt, holds a small
     white foundation bottle in her hand, real skin with sun freckles,
     no retouching.
   - **Diane, 54** — bathroom with natural overhead light, gentle
     half-smile while looking just off camera, short silver-grey hair,
     cotton t-shirt, slight redness on cheeks (rosacea-friendly framing),
     no retouching.
   - **Amanda, 47** — late afternoon golden hour at a window, brunette
     shoulder-length hair, soft grey cardigan, looks like a self-shot
     iPhone selfie but slightly composed, real skin with fine lines, no
     retouching.

4. Save as `assets/testimonial-foundation-{linda|michelle|diane|amanda}.jpg`
   and rewire each card's `image_single` in `templates/product.foundation.json`.

5. Drop the now-orphan `shopify://shop_images/` references (verify they
   aren't used on any other PDP first via `grep` across templates).

6. Ship as a single PR. Keep the Verified Buyer badge in place — combined
   they give the strongest trust signal.

## Open questions to resolve before generating

- Are any of the 4 current photos actually real customers? If even one
  is, keep that one and only regenerate the others.
- Brand style guide for portraiture (if any) — match it.
- Whether to also link each card to the corresponding written review in
  the `vl_review_cards_section` for verifiability.
