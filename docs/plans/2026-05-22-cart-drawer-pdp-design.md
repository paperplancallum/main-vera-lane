# Cart Drawer on PDP Instead of Checkout Redirect

**Date:** 2026-05-22
**Scope:** Color Changing Foundation product page (`templates/product.foundation.json`)

## Problem

After adding to cart on the Color Changing Foundation PDP, users are redirected straight to `/checkout`. We want the cart drawer to open instead, so users can review their cart, add more items, or continue shopping. The existing upsell modal flow must be preserved.

## Current flow

`templates/product.foundation.json` sets `skip_cart_go_to_checkout: true`. This triggers code in `sections/lumen-pdp-hero.liquid` (around line 2745) that, after add-to-cart, either:
- Shows the upsell modal (`vl-upsell-modal.liquid`) if present
- Otherwise redirects to `/checkout`

The upsell modal itself, in `sections/vl-upsell-modal.liquid`, **always** redirects to `/checkout` on exit:
- Accept → adds upsell item → `/checkout?discount=BRUSH50`
- Decline / X / backdrop / Esc / timer expire → `/checkout`

## Changes

Three exit points all become "open the cart drawer" via the existing `cart:update` event the drawer already listens for.

### 1. `sections/lumen-pdp-hero.liquid` (~line 2767)

Replace the `window.location.href = '/checkout'` fallback (used when no upsell modal exists on the page) with the same `cart:update` dispatch that lives in the `else` branch immediately below it. Refactor to a shared helper so both paths use the same code.

### 2. `sections/vl-upsell-modal.liquid` — `goToCheckout()` (~line 311)

Rename to `closeAndOpenCart()`. Instead of redirecting:
1. Hide the modal
2. Fetch `/cart.js`
3. Dispatch `cart:update` event with the cart payload

Used by: close button, backdrop, "No thanks" decline, Escape key, timer-expiry.

### 3. `sections/vl-upsell-modal.liquid` — accept handler (~line 362)

After successfully adding the upsell item:
1. Background `fetch('/discount/BRUSH50')` to apply the discount code session-side (no navigation)
2. Fetch `/cart.js`
3. Dispatch `cart:update` event

If the discount fetch fails, the drawer still opens — the discount just isn't auto-applied. The user can still apply it at checkout.

### 4. `sections/vl-upsell-modal.liquid` — skip-button copy

Change default "No thanks, continue to checkout" → "No thanks". The old wording becomes inaccurate after this change.

## What stays the same

- `skip_cart_go_to_checkout: true` in the template — required for the upsell modal trigger
- Upsell modal UI, timer, analytics (GA4 + Meta Pixel events)
- Shipping protection auto-add logic
- All other product templates and pages

## Testing

Playwright tests on the Shopify branch-preview URL, covering:
- Add-to-cart → upsell modal → decline → drawer opens (no navigation to `/checkout`)
- Add-to-cart → upsell modal → accept → drawer opens with both items + `BRUSH50` discount visible
- Verify no `window.location` to `/checkout` happens in either path

## Deployment

1. Branch `cart-drawer-pdp-may22` → PR → user-authorized merge to `main`
2. Shopify GitHub integration pulls from `main` automatically
3. NEVER `shopify theme push`
