# Tone Restock Notify Flow — Design

**Date:** 2026-05-23
**Scope addition to:** the shipped tone selector in [sections/lumen-pdp-hero.liquid:2200-2233](sections/lumen-pdp-hero.liquid#L2200-L2233)

## Context

The tone selector (PRs #79 / #80 / #81) renders 3 swatches above ATC for the Tone Adapting Foundation. Out-of-stock variants currently render dimmed at ~45% opacity with a diagonal strikethrough on the circle and `disabled` on the button (see `.lumen-pdp-hero__tone-swatch--unavailable` rules at [sections/lumen-pdp-hero.liquid:451-457](sections/lumen-pdp-hero.liquid#L451-L457)). Customers who want one of those tones today have no path back to us — the dead-end converts to zero email captures.

## Goal

Turn each out-of-stock swatch into a list-building moment: show a clear "back in stock soon" cue and a "Get notified →" link that opens a small modal capturing the customer's email tagged with the requested tone.

Phase 1 (this design): full UI + a stubbed submit. Phase 2 (separate, later): wire the submit to Klaviyo.

## Visual changes to existing OOS swatch

Today's OOS swatch is just the dimmed button. Add two stacked lines directly underneath the tone name, inside the same button container so the layout column stays one swatch wide:

- **"Back in stock soon"** — small muted text (~11px, color `#8a7d70`)
- **"Get notified →"** — same size, underlined link styling, color tied to brand accent (matches existing PDP link tone, e.g. the burgundy used on `.lumen-pdp-hero__variant--selected` accents)

The swatch button itself stays `disabled` for variant selection. The "Get notified →" link is a separate clickable element nested inside the swatch column (rendered as an `<a href="#">` or `<button>` with its own click handler so it stays activatable while the parent button is disabled).

CSS additions live alongside the existing `.lumen-pdp-hero__tone-swatch--unavailable` rules. Keep the diagonal strikethrough on the circle.

## Notify modal

A new modal section dedicated to this flow, mirroring `sections/vl-upsell-modal.liquid` for structure/styling/a11y, but minimal — single field, single CTA.

**Structure**
- Overlay + backdrop (click-to-close) + centered panel
- Close × top-right
- Heading: **"Get notified when [Tone] is back"** — `[Tone]` is interpolated client-side from the data attribute on the link that opened the modal
- Subhead: *"We'll email you the moment it's restocked. No spam."*
- Single email input, `type="email"`, required
- CTA button: **"Notify me"**
- After valid submit: form region replaced by *"You're on the list. We'll be in touch."* Close button remains.

**A11y**
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing at the heading
- Focus moves into the email input when the modal opens
- Esc closes
- Focus returns to the originating "Get notified →" link on close
- Focus is trapped inside the modal while open (cycle tab between fields and close button)

**Where the modal lives**
- One modal markup block at the bottom of the existing `lumen-pdp-hero` section, rendered once regardless of how many OOS swatches exist. The heading text is updated when opened.
- Modal markup, CSS, and JS all scoped to the section to stay consistent with the rest of `lumen-pdp-hero.liquid`.

## Behavior wiring

- Each "Get notified →" link carries `data-tone="Medium"` and `data-variant-id="123456"` (the underlying variant ID is already in scope at render time — see `data-variant-id` on the swatch button at line 2223).
- Click handler: read those attrs → set the modal heading → open the modal.
- Email validation: HTML5 + a tiny JS check (non-empty, includes `@` and `.`). Inline error message under the field for invalid.
- On valid submit (Phase 1):
  - `event.preventDefault()`
  - Swap form for success state
  - `console.log({ event: 'tone-notify-request', email, tone, variantId, productHandle: 'color-changing-foundation', timestamp: Date.now() })`
  - No network call

## Section settings (additions)

In the `lumen-pdp-hero` section schema, add:

- **`oos_label`** — text, default `"Back in stock soon"`
- **`oos_cta_label`** — text, default `"Get notified →"`
- **`notify_modal_heading_template`** — text, default `"Get notified when {tone} is back"` (the `{tone}` token is replaced client-side)
- **`notify_modal_subhead`** — text, default `"We'll email you the moment it's restocked. No spam."`
- **`notify_modal_cta_label`** — text, default `"Notify me"`
- **`notify_modal_success_message`** — text, default `"You're on the list. We'll be in touch."`

All grouped under a new "Restock notify" header in the schema, sitting near the existing tone selector settings.

## Edge cases

- **All variants in stock** — modal markup still renders into the DOM, but no "Get notified" links exist, so it's never opened. No visual or perf cost beyond a few KB of inert HTML/CSS.
- **All variants OOS** — every swatch shows the notify treatment. Modal still works one-at-a-time per click.
- **Customer opens modal, closes, reopens for different tone** — heading updates to the newly-clicked tone. No state carried between opens.
- **Customer submits, then opens for a different tone in the same session** — form resets to empty on each open. Phase 1 has no client-side de-duplication.
- **Variant becomes in-stock between page load and click** — page is stale but the customer still sees OOS UI. Acceptable for Phase 1; revisit if customers complain.
- **JS disabled** — the link does nothing (no fallback). Acceptable trade-off; the rest of the PDP also requires JS.

## Files touched

- `sections/lumen-pdp-hero.liquid` — extend OOS swatch markup with notify link, add modal markup + scoped CSS + open/close/submit JS, extend section schema with new settings
- `templates/product.foundation.json` — no change needed (schema defaults cover Phase 1)
- No new sections, blocks, snippets, or assets

## Out of scope (Phase 2)

- Klaviyo wiring (submit → track event + list subscribe)
- Klaviyo list ID setting in section schema
- SMS field on the modal
- Per-tone copy customization in modal heading beyond name interpolation
- Saving submitted email to localStorage for prefill on re-open
- Analytics events beyond the Klaviyo track call

## Success criteria

- An OOS swatch shows "Back in stock soon" + "Get notified →" beneath the tone name.
- Clicking "Get notified →" opens the modal with the correct tone in the heading.
- Invalid email → inline error, modal stays open.
- Valid email → success state shown; payload logged to console with correct tone and variant ID.
- Closing the modal returns focus to the originating link.
- Esc and backdrop click both close the modal.
- All existing tone selector behavior (selection, ATC, bundle ATC fix from #81) continues to work unchanged.
