// Downloads every Wikimedia portrait used in subjects and stories into public/portraits/
// and points the file at the local copy. Wikimedia throttles direct links to original
// files, so the site keeps its own 640px copies. The credit and sourceUrl stay as they are.
//
// Usage: node scripts/fetch-portraits.mjs        (safe to re-run; skips files already local)
// Then shrink new files to 640px WebP: python3 scripts/shrink-portraits.py
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIRS = ["src/content/subjects", "src/content/stories"];
const OUT = "public/portraits";
const WIDTH = 640;
const UA = "FreedomStories/1.0 (https://github.com/paripurnadatta/freedom-stories)";
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Find the Commons file name from the image's sourceUrl or its upload.wikimedia.org path. */
function commonsName(src, sourceUrl) {
  const fromPage = sourceUrl?.match(/\/wiki\/File:([^?#]+)/)?.[1];
  if (fromPage) return decodeURIComponent(fromPage);
  const fromUpload = src.match(/upload\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/)?.[1];
  if (fromUpload) return decodeURIComponent(fromUpload);
  const fromRedirect = src.match(/Special:(?:Redirect\/file|FilePath)\/([^?#]+)/)?.[1];
  return fromRedirect ? decodeURIComponent(fromRedirect) : null;
}

async function download(name, dest) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name.replace(/ /g, "_"))}?width=${WIDTH}`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
    if (res.ok && (res.headers.get("content-type") ?? "").startsWith("image/")) {
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      return true;
    }
    if (res.status === 429 || res.status >= 500) { await sleep(2000 * attempt); continue; }
    console.warn(`  ${res.status} for ${name}`);
    return false;
  }
  return false;
}

let done = 0, skipped = 0, failed = 0;
for (const dir of DIRS) {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const path = join(dir, file);
    const raw = readFileSync(path, "utf8");
    const m = raw.match(/^image:\n  src: "(https?:\/\/[^"]+)"/m);
    if (!m) { skipped++; continue; }
    const src = m[1];
    const sourceUrl = raw.match(/^  sourceUrl: "([^"]+)"/m)?.[1];
    const name = commonsName(src, sourceUrl);
    if (!name) { console.warn(`  ${file}: not a Wikimedia image, left as is`); skipped++; continue; }

    const ext = (name.match(/\.(jpe?g|png|webp|gif)$/i)?.[1] ?? "jpg").toLowerCase().replace("jpeg", "jpg");
    const slug = file.replace(/\.md$/, "");
    const local = `/portraits/${slug}.${ext === "gif" ? "png" : ext}`;
    const dest = join("public", local);

    if (!existsSync(dest)) {
      if (!(await download(name, dest))) { failed++; console.warn(`  failed: ${file}`); continue; }
      await sleep(250);
    }
    writeFileSync(path, raw.replace(`  src: "${src}"`, `  src: "${local}"`));
    done++;
    if (done % 25 === 0) console.log(`  ${done} portraits saved...`);
  }
}
console.log(`Portraits: ${done} local, ${failed} failed, ${skipped} without a remote image.`);
