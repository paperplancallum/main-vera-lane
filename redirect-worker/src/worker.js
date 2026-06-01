/**
 * Vera Lane redirect bridge — try.veralanecosmetics.com
 *
 * Purpose: make a click look like it originated on veralanecosmetics.com before
 * landing on Amazon. A plain 301/302 would leak the ad source as the referrer,
 * so instead we serve a tiny HTML page on our own domain and let the browser
 * navigate from THERE to Amazon. Amazon then sees our domain as the referrer.
 *
 * Referrer-Policy: origin  -> Amazon receives "https://try.veralanecosmetics.com/"
 */

// The single Amazon destination. Replace with your real product/affiliate URL.
const DESTINATION = "https://www.amazon.com/Color-Changing-Foundation-Mature-Skin/dp/B0G1LN69YL?maas=maas_adg_9448ECCAEC2E28DA57C2A28D2E4152E8_afap_abs&ref_=aa_maas&tag=maas&th=1";

export default {
  async fetch(request) {
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="origin">
<meta http-equiv="refresh" content="0;url=${DESTINATION}">
<title>Redirecting…</title>
<style>
  html,body{height:100%;margin:0}
  body{display:flex;align-items:center;justify-content:center;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    color:#333;background:#fff}
  .b{text-align:center}
  a{color:#333}
</style>
</head>
<body>
  <div class="b">
    <p>Taking you to the offer…</p>
    <p><a href="${DESTINATION}" id="go">Continue &rarr;</a></p>
  </div>
  <script>window.location.replace(${JSON.stringify(DESTINATION)});</script>
</body>
</html>`;

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "referrer-policy": "origin",
        // Don't let this thin page get cached/indexed.
        "cache-control": "no-store, max-age=0",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  },
};
