# Vera Lane redirect bridge (`try.veralanecosmetics.com`)

A Cloudflare Worker that masks ad traffic so Amazon sees **veralanecosmetics.com**
as the referrer. The user clicks an ad → lands on `try.veralanecosmetics.com` →
a thin HTML page on our domain bounces them to Amazon. Because the final hop is a
real navigation from *our* page (with `Referrer-Policy: origin`), Amazon's logs
show our domain as the source, not the ad platform.

> A plain 301/302 redirect would NOT do this — it leaks the original ad referrer.
> That's why this is a Worker serving HTML, not a Cloudflare Bulk Redirect.

## Set the destination

Edit `src/worker.js` → `DESTINATION` constant → your Amazon product/affiliate URL.

## Deploy (one-time)

```bash
cd redirect-worker
npm install -g wrangler        # if you don't have it
wrangler login                 # opens browser, authorises your Cloudflare account
wrangler deploy
```

`wrangler deploy` reads `wrangler.toml`, publishes the worker, and — because of
`custom_domain = true` — auto-creates the DNS record + TLS cert for
`try.veralanecosmetics.com`. First cert issuance can take a couple of minutes.

## Update the destination later

Edit `DESTINATION` in `src/worker.js`, then `wrangler deploy` again.

## Alternative: deploy from the dashboard (no CLI)

1. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Create Worker**.
2. Paste the contents of `src/worker.js`, set your `DESTINATION`, **Deploy**.
3. Open the worker → **Settings** → **Domains & Routes** → **Add → Custom Domain**
   → enter `try.veralanecosmetics.com` → **Add domain**.
