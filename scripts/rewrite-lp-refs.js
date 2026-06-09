#!/usr/bin/env node
/*
 * Rewrite lp-* image references from bare theme-asset filenames to their
 * Shopify Files CDN URLs (from scripts/lp-files-map.json), so the images can be
 * removed from /assets without breaking landing pages.
 *
 * Only replaces QUOTED occurrences ("lp-x.jpg" in JSON, 'lp-x.jpg' in liquid),
 * so partial-name collisions can't happen. Only filenames present in the map
 * (the 56 migrated images) are touched; pre-existing broken refs are left alone.
 *
 * Usage: node scripts/rewrite-lp-refs.js [--dry]
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');
const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'lp-files-map.json'), 'utf8'));

function listFiles(dir, filter) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isFile() && filter(name)) out.push(p);
  }
  return out;
}

const targets = [
  ...listFiles(path.join(ROOT, 'templates'), (n) => n.endsWith('.json')),
  ...listFiles(path.join(ROOT, 'scripts', 'content'), (n) => n.endsWith('.json')),
];

let totalFiles = 0, totalReps = 0;
for (const file of targets) {
  let txt = fs.readFileSync(file, 'utf8');
  let reps = 0;
  for (const [fn, url] of Object.entries(map)) {
    for (const q of ['"', "'"]) {
      const needle = q + fn + q;
      if (txt.includes(needle)) {
        const count = txt.split(needle).length - 1;
        txt = txt.split(needle).join(q + url + q);
        reps += count;
      }
    }
  }
  if (reps > 0) {
    totalFiles++; totalReps += reps;
    console.log(`${reps.toString().padStart(3)}  ${path.relative(ROOT, file)}`);
    if (!DRY) fs.writeFileSync(file, txt);
  }
}
console.log(`\n${DRY ? '[DRY] ' : ''}${totalReps} replacements across ${totalFiles} files`);
