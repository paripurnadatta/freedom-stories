// Downloads each subject's Wikimedia portrait into its folder as portrait.webp (640px wide)
// and points index.md at it. Wikimedia throttles direct links to original files,
// so the site keeps its own small copy. Credit and sourceUrl stay as they are.
//
// Usage:
//   node scripts/fetch-portraits.mjs              every subject whose image is still a web address
//   node scripts/fetch-portraits.mjs bhagat-singh one subject
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { allSubjects, webPath } from "./lib/subjects.mjs";

const UA = "FreedomStories/1.0 (https://github.com/paripurnadatta/freedom-stories)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const only = process.argv.slice(2);

/** The Commons file name, from the sourceUrl or the upload.wikimedia.org address. */
function commonsName(src, sourceUrl) {
  const fromPage = sourceUrl?.match(/\/wiki\/File:([^?#]+)/)?.[1];
  if (fromPage) return decodeURIComponent(fromPage);
  const fromUpload = src.match(/upload\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/)?.[1];
  if (fromUpload) return decodeURIComponent(fromUpload);
  return src.match(/Special:(?:Redirect\/file|FilePath)\/([^?#]+)/)?.[1] ? decodeURIComponent(src.match(/Special:(?:Redirect\/file|FilePath)\/([^?#]+)/)[1]) : null;
}

let done = 0, failed = 0;
for (const s of allSubjects()) {
  if (only.length && !only.includes(s.slug)) continue;
  const indexPath = join(s.dir, "index.md");
  const raw = readFileSync(indexPath, "utf8");
  const m = raw.match(/^image:\n  src: "(https?:\/\/[^"]+)"/m);
  if (!m) continue;
  const name = commonsName(m[1], raw.match(/^  sourceUrl: "([^"]+)"/m)?.[1]);
  if (!name) { console.warn(`  ${s.slug}: not a Wikimedia picture, left as it is`); continue; }

  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name.replace(/ /g, "_"))}?width=640`;
  let ok = false;
  for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok && (res.headers.get("content-type") ?? "").startsWith("image/")) {
      await sharp(Buffer.from(await res.arrayBuffer())).resize({ width: 640, height: 900, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(s.dir, "portrait.webp"));
      ok = true;
    } else await sleep(3000 * attempt);
  }
  if (!ok) { failed++; console.warn(`  failed: ${s.slug}`); continue; }
  writeFileSync(indexPath, raw.replace(`  src: "${m[1]}"`, `  src: "${webPath(s.dir, "portrait.webp")}"`));
  done++;
  await sleep(800);
}
console.log(`Portraits: ${done} saved, ${failed} failed.`);
