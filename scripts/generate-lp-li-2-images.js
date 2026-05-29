#!/usr/bin/env node
// One-off image generator for the lp-li-2 advertorial.
// Submits each prompt to fal-ai/nano-banana-2 (queue endpoint), polls until done,
// downloads the result, and writes a JPG to assets/.

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
  {
    file: 'lp-li-2-hero.jpg',
    aspect: '16:9',
    prompt:
      'Close-up editorial beauty portrait of a radiant, confident woman in her early 50s with luminous, dewy skin, soft natural light, neutral cream background, subtle bronze and gold styling, looking serenely past camera. Soft-focus skin with visible natural texture, no plastic AI-look. Cinematic, magazine-cover quality, high-end skincare advertisement aesthetic. Warm tonal palette.',
  },
  {
    file: 'lp-li-2-reason-1.jpg',
    aspect: '3:4',
    prompt:
      'Macro beauty shot of a single drop of liquid foundation blending and adapting on a woman\'s mid-50s skin tone, viewed from above. Tone-adapting pigments visibly shift from cream to a perfect match. Soft natural daylight, hyper-realistic skin texture, premium beauty editorial. Cream background.',
  },
  {
    file: 'lp-li-2-reason-2.jpg',
    aspect: '3:4',
    prompt:
      'Side profile of a woman in her early 50s laughing softly. Skin looks smooth, hydrated, with no foundation settling into fine lines around her eyes or mouth. Soft daylight, beige editorial background, magazine-cover quality, soft skin grain.',
  },
  {
    file: 'lp-li-2-reason-3.jpg',
    aspect: '3:4',
    prompt:
      'Beauty portrait of a woman in her late 40s with luminous, plump, dewy skin and rosy cheeks. Even lighting, glow-from-within finish, soft pink-cream background, premium skincare advertorial.',
  },
  {
    file: 'lp-li-2-reason-4.jpg',
    aspect: '3:4',
    prompt:
      'Half-face close-up of a 50-year-old woman demonstrating a soft-focus blurring effect on skin — pores and fine lines visibly softened on one side. Editorial lighting, neutral linen background, photorealistic skin.',
  },
  {
    file: 'lp-li-2-reason-5.jpg',
    aspect: '3:4',
    prompt:
      'Cinematic side portrait of a confident woman around 52 outdoors at golden hour, skin glowing and protected. Faint warm sunlight, blurred green-and-amber background, premium skincare campaign aesthetic.',
  },
  {
    file: 'lp-li-2-reason-6.jpg',
    aspect: '3:4',
    prompt:
      'Before-and-after style split portrait of a woman around 50 — left side bare skin showing redness and uneven tone, right side after applying tone-adapting foundation: even, firm, luminous. Studio daylight, beige backdrop, photorealistic.',
  },
  {
    file: 'lp-li-2-reason-7.jpg',
    aspect: '3:4',
    prompt:
      'Flat-lay still life of a luxury foundation bottle alongside fresh botanical ingredients — gotu kola leaves, almond shell, niacinamide crystals — on a marble surface, soft natural overhead light, premium clean-beauty editorial.',
  },
  {
    file: 'lp-li-2-reason-8.jpg',
    aspect: '3:4',
    prompt:
      'Three women of different ages (late 30s, mid 50s, early 70s) and different ethnicities photographed together in soft natural light, all with healthy, glowing skin. Editorial neutral background, warm, inclusive campaign style.',
  },
  {
    file: 'lp-li-2-reason-9.jpg',
    aspect: '3:4',
    prompt:
      'Female dermatologist in a clean white lab coat in a modern, well-lit laboratory, examining a luxury foundation bottle thoughtfully. Premium clinical-skincare advertisement aesthetic, soft natural light, photorealistic.',
  },
  {
    file: 'lp-li-2-reason-10.jpg',
    aspect: '3:4',
    prompt:
      'Open shipping box of a luxury foundation product with a small gold guarantee seal card reading "30-Day Promise" laying on top. Soft pastel-cream backdrop, gentle daylight, premium unboxing aesthetic, photorealistic.',
  },
];

async function submit(prompt, aspect) {
  const res = await fetch(SUBMIT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio: aspect,
      output_format: 'jpeg',
      resolution: '2K',
      num_images: 1,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Submit failed (${res.status}): ${txt.slice(0, 500)}`);
  }
  return res.json();
}

async function waitForResult(statusUrl, responseUrl) {
  const start = Date.now();
  while (Date.now() - start < 5 * 60 * 1000) {
    await new Promise((r) => setTimeout(r, 3000));
    const sRes = await fetch(statusUrl, {
      headers: { Authorization: `Key ${FAL_KEY}` },
    });
    const status = await sRes.json();
    if (status.status === 'COMPLETED') {
      const rRes = await fetch(responseUrl, {
        headers: { Authorization: `Key ${FAL_KEY}` },
      });
      return rRes.json();
    }
    if (status.status === 'FAILED' || status.status === 'ERROR') {
      throw new Error(`Generation failed: ${JSON.stringify(status)}`);
    }
  }
  throw new Error('Timeout waiting for image generation');
}

async function downloadTo(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filepath, buf);
}

async function runOne(job) {
  const dest = path.join(ASSETS_DIR, job.file);
  if (fs.existsSync(dest)) {
    console.log(`[skip] ${job.file} already exists`);
    return;
  }
  console.log(`[submit] ${job.file}`);
  const submitRes = await submit(job.prompt, job.aspect);
  const { status_url, response_url, request_id } = submitRes;
  console.log(`  request_id=${request_id}`);
  const result = await waitForResult(status_url, response_url);
  const imageUrl = result?.images?.[0]?.url;
  if (!imageUrl) throw new Error(`No image URL in result: ${JSON.stringify(result).slice(0, 500)}`);
  await downloadTo(imageUrl, dest);
  console.log(`[done] ${job.file}`);
}

(async () => {
  // Run jobs with limited concurrency (3 at a time) to stay polite.
  const concurrency = 3;
  const queue = [...JOBS];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const job = queue.shift();
      try {
        await runOne(job);
      } catch (e) {
        console.error(`[error] ${job.file}: ${e.message}`);
      }
    }
  });
  await Promise.all(workers);
  console.log('All jobs finished.');
})();
