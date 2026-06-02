#!/usr/bin/env node
/**
 * Accurate product + lifestyle image generator — GPT Image 2 via FAL.
 *
 * Node port of the reference Python engine. Reads a prompts JSON file, uploads
 * the canonical product reference(s) once, and routes each prompt:
 *   needs_product_images: true  -> openai/gpt-image-2/edit  (real product attached)
 *   needs_product_images: false -> openai/gpt-image-2       (text-to-image, no product)
 *
 * The brand prompt modifier, the "match precisely" product clause, and the
 * "do NOT show the product" negative are injected automatically (see config.js),
 * so prompt authors only need to describe the scene.
 *
 * Usage:
 *   FAL_KEY=... node scripts/image-gen/engine.js --prompts scripts/image-gen/prompts/example.json
 *   ... --ids 1,3,5            only those ids
 *   ... --quality medium       faster/cheaper test run (default: high)
 *   ... --dry-run              show routing + assembled prompts, spend nothing
 *   ... --out assets           write outputs to assets/ (default: scripts/image-gen/outputs)
 */

const fs = require('fs');
const path = require('path');
const {
  PRODUCT_REFERENCES,
  LOCAL_PRODUCT_IMAGES_DIR,
  PRODUCT_MATCH_CLAUSE,
  NO_PRODUCT_CLAUSE,
  getPromptModifier,
} = require('./config');

const FAL_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY || '';
const FAL_QUEUE_URL = 'https://queue.fal.run'; // queue endpoint survives long (>60s) high-quality jobs
const FAL_UPLOAD_URL = 'https://fal.run/fal-ai/file-storage/upload';
const T2I_ENDPOINT = 'openai/gpt-image-2';
const EDIT_ENDPOINT = 'openai/gpt-image-2/edit';

const QUEUE_POLL_INTERVAL_MS = 5000;
const QUEUE_JOB_TIMEOUT_MS = 15 * 60 * 1000;
const DEFAULT_QUALITY = 'high';
const DEFAULT_OUTPUT_FORMAT = 'png';

// image_size in pixels (multiples of 16) — pin it explicitly rather than "auto".
const ASPECT_RATIO_TO_SIZE = {
  '1:1': { width: 2048, height: 2048 },
  '4:5': { width: 1664, height: 2080 },
  '5:4': { width: 2080, height: 1664 },
  '9:16': { width: 1440, height: 2560 },
  '16:9': { width: 2560, height: 1440 },
  '4:3': { width: 2240, height: 1680 },
  '3:4': { width: 1680, height: 2240 },
  '3:2': { width: 2304, height: 1536 },
  '2:3': { width: 1536, height: 2304 },
};

const authHeaders = () => ({ Authorization: `Key ${FAL_KEY}`, 'Content-Type': 'application/json' });
const resolveImageSize = (ratio) => ASPECT_RATIO_TO_SIZE[ratio] || ASPECT_RATIO_TO_SIZE['1:1'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Upload a local image to FAL storage; return a hosted URL (base64 data-URI fallback). */
async function uploadImageToFal(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const mime =
    ext === '.png' ? 'image/png'
    : ext === '.webp' ? 'image/webp'
    : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
    : 'application/octet-stream';
  const data = fs.readFileSync(imagePath);
  try {
    const form = new FormData();
    form.append('file', new Blob([data], { type: mime }), path.basename(imagePath));
    const res = await fetch(FAL_UPLOAD_URL, {
      method: 'POST',
      headers: { Authorization: `Key ${FAL_KEY}` }, // let fetch set multipart boundary
      body: form,
    });
    if (res.ok) {
      const j = await res.json();
      const url = j.url || j.file_url || '';
      if (url) return url;
    }
  } catch (_) {
    /* fall through to data-URI */
  }
  // Fallback: inline as a data URI (works on most providers, larger payload).
  return `data:${mime};base64,${data.toString('base64')}`;
}

/** Submit to the FAL queue and poll until COMPLETED. Returns the result JSON. */
async function runGeneration(endpoint, payload) {
  const submit = await fetch(`${FAL_QUEUE_URL}/${endpoint}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!submit.ok) {
    throw new Error(`Submit failed (${submit.status}): ${(await submit.text()).slice(0, 400)}`);
  }
  const { status_url, response_url } = await submit.json();
  if (!status_url || !response_url) throw new Error('No status/response URL in submit response');

  const deadline = Date.now() + QUEUE_JOB_TIMEOUT_MS;
  for (;;) {
    if (Date.now() > deadline) throw new Error(`Job exceeded ${QUEUE_JOB_TIMEOUT_MS / 1000}s`);
    await sleep(QUEUE_POLL_INTERVAL_MS);
    const st = await (await fetch(status_url, { headers: { Authorization: `Key ${FAL_KEY}` } })).json();
    if (st.status === 'COMPLETED') break;
    if (st.status === 'FAILED' || st.status === 'CANCELED' || st.status === 'ERROR') {
      throw new Error(`Job ${st.status}: ${JSON.stringify(st).slice(0, 400)}`);
    }
  }
  const res = await fetch(response_url, { headers: { Authorization: `Key ${FAL_KEY}` } });
  if (!res.ok) throw new Error(`Result fetch failed (${res.status})`);
  return res.json();
}

async function downloadImage(url, savePath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  fs.writeFileSync(savePath, Buffer.from(await res.arrayBuffer()));
}

/** Assemble the final prompt: brand modifier + (product-match | no-product) + scene.
 *  Pass modifier="" (e.g. for raw UGC shots via skip_modifier) to drop the editorial style. */
function assemblePrompt(scene, needsProduct, modifier) {
  const parts = [];
  if (modifier) parts.push(modifier);
  if (needsProduct) parts.push(PRODUCT_MATCH_CLAUSE);
  parts.push(scene);
  if (!needsProduct) parts.push(NO_PRODUCT_CLAUSE);
  return parts.filter(Boolean).join('\n\n');
}

async function generate({ promptsFile, idsFilter, quality, dryRun, outDir }) {
  if (!fs.existsSync(promptsFile)) throw new Error(`Prompts file not found: ${promptsFile}`);
  if (!FAL_KEY && !dryRun) throw new Error("FAL_KEY not set. Run: export FAL_KEY='...'");

  const data = JSON.parse(fs.readFileSync(promptsFile, 'utf8'));
  let prompts = data.prompts || [];
  if (idsFilter) prompts = prompts.filter((p) => idsFilter.includes(p.id));
  if (!prompts.length) throw new Error('No prompts to run (check --ids / prompts file).');

  const modifier = getPromptModifier();

  // Resolve the canonical product references once (hosted URLs + uploaded locals).
  let productImageUrls = [...PRODUCT_REFERENCES];
  const localFiles = fs.existsSync(LOCAL_PRODUCT_IMAGES_DIR)
    ? fs.readdirSync(LOCAL_PRODUCT_IMAGES_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort()
    : [];
  if (dryRun) {
    // Don't upload, but reflect what WOULD be attached so routing is accurate.
    localFiles.forEach((f) => productImageUrls.push(`<local:${f}>`));
  } else {
    for (const f of localFiles) {
      try {
        const url = await uploadImageToFal(path.join(LOCAL_PRODUCT_IMAGES_DIR, f));
        productImageUrls.push(url);
        console.log(`  uploaded reference: ${f}`);
      } catch (e) {
        console.error(`  failed to upload ${f}: ${e.message}`);
      }
    }
  }
  if (!dryRun && !productImageUrls.length) {
    console.warn('  ⚠ No product references resolved — product shots will fall back to text-to-image.');
  }

  fs.mkdirSync(outDir, { recursive: true });
  const resultUrlById = {}; // for output chaining
  let completed = 0;
  let failed = 0;

  for (const p of prompts) {
    const name = p.name || `image-${p.id}`;
    const ratio = p.aspect_ratio || '1:1';
    const needsProduct = p.needs_product_images !== false; // default true
    const idStr = typeof p.id === 'number' ? String(p.id).padStart(2, '0') : `${p.id}`;
    const base = `${idStr}-${name}-${ratio.replace(':', 'x')}`;

    // Chain earlier outputs back in as references for cross-image consistency.
    const chainRefs = (p.chain_from || [])
      .map((cid) => resultUrlById[cid])
      .filter(Boolean);
    const refs = needsProduct
      ? [...productImageUrls, ...(p.reference_urls || []), ...chainRefs]
      : [...(p.reference_urls || []), ...chainRefs];

    const useEdit = refs.length > 0;
    const endpoint = useEdit ? EDIT_ENDPOINT : T2I_ENDPOINT;
    const fullPrompt = assemblePrompt(p.prompt, needsProduct, p.skip_modifier ? '' : modifier);

    console.log(`[${base}] -> ${useEdit ? 'edit+refs' : 't2i'}  (${refs.length} ref${refs.length === 1 ? '' : 's'})`);

    if (dryRun) {
      console.log(`   size=${JSON.stringify(resolveImageSize(ratio))} needs_product=${needsProduct}`);
      console.log(`   prompt: ${fullPrompt.slice(0, 240)}${fullPrompt.length > 240 ? '…' : ''}`);
      continue;
    }

    // Save the assembled prompt next to the image for reproducibility.
    fs.writeFileSync(path.join(outDir, `${base}-prompt.txt`), fullPrompt);

    const payload = {
      prompt: fullPrompt,
      image_size: resolveImageSize(ratio),
      quality,
      num_images: 1,
      output_format: DEFAULT_OUTPUT_FORMAT,
    };
    if (useEdit) payload.image_urls = refs;

    try {
      const result = await runGeneration(endpoint, payload);
      const imageUrl = result?.images?.[0]?.url;
      if (!imageUrl) {
        console.error('   no image returned');
        failed++;
        continue;
      }
      const savePath = path.join(outDir, `${base}.${DEFAULT_OUTPUT_FORMAT}`);
      await downloadImage(imageUrl, savePath);
      resultUrlById[p.id] = imageUrl; // available to later chain_from prompts
      console.log(`   saved ${path.relative(process.cwd(), savePath)}`);
      completed++;
    } catch (e) {
      console.error(`   error: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${completed} ok, ${failed} failed -> ${path.relative(process.cwd(), outDir)}/`);
}

function parseArgs(argv) {
  const args = { quality: DEFAULT_QUALITY, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') args.dryRun = true;
    else if (a === '--prompts') args.promptsFile = argv[++i];
    else if (a === '--ids') args.ids = argv[++i];
    else if (a === '--quality') args.quality = argv[++i];
    else if (a === '--out') args.out = argv[++i];
  }
  return args;
}

if (require.main === module) {
  const a = parseArgs(process.argv.slice(2));
  const promptsFile = a.promptsFile
    ? path.resolve(a.promptsFile)
    : path.join(__dirname, 'prompts', 'example.json');
  const idsFilter = a.ids ? a.ids.split(',').map((x) => Number(x.trim())) : null;
  const outDir = a.out
    ? path.resolve(a.out)
    : path.join(__dirname, 'outputs');
  if (!['low', 'medium', 'high'].includes(a.quality)) {
    console.error("--quality must be one of: low, medium, high");
    process.exit(1);
  }
  generate({ promptsFile, idsFilter, quality: a.quality, dryRun: a.dryRun, outDir }).catch((e) => {
    console.error(`Fatal: ${e.message}`);
    process.exit(1);
  });
}

module.exports = { generate, assemblePrompt, resolveImageSize, ASPECT_RATIO_TO_SIZE };
