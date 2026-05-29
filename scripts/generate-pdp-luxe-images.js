#!/usr/bin/env node
// Generates the imagery referenced by templates/product.pdp-luxe-clone.json
// via fal-ai/nano-banana-2. Saves JPGs into assets/.

const fs = require('fs');
const path = require('path');

const FAL_KEY = process.env.FAL_KEY;
if (!FAL_KEY) {
  console.error('FAL_KEY env var is required.');
  process.exit(1);
}

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

const SUBMIT_URL = 'https://queue.fal.run/fal-ai/nano-banana-2';

const JOBS = [
  // 3-step glow
  {
    file: 'pdp-luxe-step-1.jpg',
    aspect: '4:5',
    prompt:
      'Close-up beauty shot of a woman in her late 40s holding a luxury foundation bottle, freshly washed dewy skin, soft natural daylight from large window, cream/beige backdrop, hyper-realistic skin texture, photorealistic, high-end skincare advertisement aesthetic.',
  },
  {
    file: 'pdp-luxe-step-2.jpg',
    aspect: '4:5',
    prompt:
      'Beauty close-up of a 50-year-old woman dotting cream-colored foundation onto her cheek, five small dots visible across face. Soft natural light, neutral cream background, photorealistic skin, premium skincare advertorial.',
  },
  {
    file: 'pdp-luxe-step-3.jpg',
    aspect: '4:5',
    prompt:
      'Beauty close-up of a 50-year-old woman blending foundation into her cheek with her fingertips, smooth even skin tone, soft luminous finish, natural daylight, cream backdrop, photorealistic, premium beauty editorial.',
  },
  // before/after
  {
    file: 'pdp-luxe-before-after.jpg',
    aspect: '4:5',
    prompt:
      'Side-by-side before-and-after beauty portrait of the same woman in her early 50s. Left half: bare skin with visible texture, redness, and uneven tone. Right half: same face after foundation, smooth even tone, dewy radiant skin, lit-from-within finish. Studio lighting, beige background, hyper-realistic, premium skincare editorial. Single split image, seamless transition down centre.',
  },
  // hero / feature product shot
  {
    file: 'pdp-luxe-feature-product.jpg',
    aspect: '4:5',
    prompt:
      'Cinematic beauty portrait of an elegant woman in her early 50s holding a sleek luxury foundation bottle near her face, looking at camera. Foundation bottle is frosted glass with minimal black label, vertical orientation. Soft warm light, cream and beige tonal palette, premium beauty advertisement aesthetic, photorealistic skin and product.',
  },
  // science / dermatologists
  {
    file: 'pdp-luxe-science.jpg',
    aspect: '4:3',
    prompt:
      'Three dermatologists / cosmetic chemists (two women, one man, diverse) in white lab coats standing together in a bright modern skincare laboratory. The middle one holds up a frosted-glass foundation bottle with a black cap, looking confidently at camera. Soft natural light, clinical-but-warm aesthetic, photorealistic, premium skincare brand campaign.',
  },
  // UGC tiles
  {
    file: 'pdp-luxe-ugc-1.jpg',
    aspect: '3:4',
    prompt:
      'Selfie-style phone photo of a smiling 47-year-old woman holding a luxury foundation bottle next to her face in her bathroom mirror, natural overhead light, casual home setting, candid UGC style, slightly imperfect framing, photorealistic.',
  },
  {
    file: 'pdp-luxe-ugc-2.jpg',
    aspect: '3:4',
    prompt:
      'Phone-camera UGC photo of a 53-year-old woman applying foundation with a brush, looking at her reflection in a vanity mirror. Soft warm bathroom light, casual home setting, candid lifestyle aesthetic, photorealistic skin.',
  },
  {
    file: 'pdp-luxe-ugc-3.jpg',
    aspect: '3:4',
    prompt:
      'UGC-style phone selfie of a 49-year-old woman with a fresh dewy makeup look smiling at camera in soft window light, holding a frosted-glass foundation bottle. Natural environment (bedroom or sunlit window), authentic lifestyle, photorealistic.',
  },
  {
    file: 'pdp-luxe-ugc-4.jpg',
    aspect: '3:4',
    prompt:
      'Casual phone-camera UGC photo of a 58-year-old woman after applying foundation, glowing healthy skin, kitchen morning light setting, candid lifestyle aesthetic, photorealistic skin with natural texture.',
  },
];

async function submit(prompt, aspect) {
  const res = await fetch(SUBMIT_URL, {
    method: 'POST',
    headers: { Authorization: `Key ${FAL_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, aspect_ratio: aspect, output_format: 'jpeg', resolution: '2K', num_images: 1 }),
  });
  if (!res.ok) throw new Error(`Submit ${res.status}: ${(await res.text()).slice(0, 400)}`);
  return res.json();
}

async function waitForResult(statusUrl, responseUrl) {
  const start = Date.now();
  while (Date.now() - start < 5 * 60 * 1000) {
    await new Promise((r) => setTimeout(r, 3000));
    const s = await (await fetch(statusUrl, { headers: { Authorization: `Key ${FAL_KEY}` } })).json();
    if (s.status === 'COMPLETED') return (await fetch(responseUrl, { headers: { Authorization: `Key ${FAL_KEY}` } })).json();
    if (s.status === 'FAILED' || s.status === 'ERROR') throw new Error(`Gen failed: ${JSON.stringify(s)}`);
  }
  throw new Error('Timeout');
}

async function downloadTo(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status} ${url}`);
  fs.writeFileSync(filepath, Buffer.from(await res.arrayBuffer()));
}

async function runOne(job) {
  const dest = path.join(ASSETS_DIR, job.file);
  if (fs.existsSync(dest)) {
    console.log(`[skip] ${job.file}`);
    return;
  }
  console.log(`[submit] ${job.file}`);
  const { status_url, response_url, request_id } = await submit(job.prompt, job.aspect);
  console.log(`  request=${request_id}`);
  const result = await waitForResult(status_url, response_url);
  const imageUrl = result?.images?.[0]?.url;
  if (!imageUrl) throw new Error(`no image: ${JSON.stringify(result).slice(0, 300)}`);
  await downloadTo(imageUrl, dest);
  console.log(`[done] ${job.file}`);
}

(async () => {
  const concurrency = 3;
  const queue = [...JOBS];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const job = queue.shift();
      try { await runOne(job); } catch (e) { console.error(`[error] ${job.file}: ${e.message}`); }
    }
  });
  await Promise.all(workers);
  console.log('All done.');
})();
