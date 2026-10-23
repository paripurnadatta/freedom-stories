// Downloads every picture of one Wikimedia Commons category into a holding library,
// with author, date, licence and the Commons "File:" link for each one.
// Nothing here is published on the site. We pick from it when writing stories.
//
// Usage (PowerShell, from the project folder):
//   node scripts/fetch-category-library.mjs "Category:Indian_independence_movement"
//   node scripts/fetch-category-library.mjs "Category:Cellular_Jail" --into cellular-jail
//   node scripts/fetch-category-library.mjs "Category:Indian_independence_movement" --sub   (also one level of sub-categories)
//   node scripts/fetch-category-library.mjs "Category:Cellular_Jail" --limit 3                (test run)
//
// Result: archive-library/<name>/free/*.webp, archive-library/<name>/check-licence/*.webp
// and archive-library/<name>/index.json. It can be stopped and started again: finished files are skipped.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";

const UA = "FreedomStories/1.0 (https://github.com/paripurnadatta/freedom-stories; paripurna.dutta@gmail.com)";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
const cat = args.find((a) => !a.startsWith("--") && !args[args.indexOf(a) - 1]?.startsWith("--"));
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
if (!cat) { console.log('Give a category, e.g. "Category:Cellular_Jail"'); process.exit(1); }
const limit = Number(opt("--limit")) || Infinity;
const withSub = args.includes("--sub");
const name = opt("--into") || cat.replace(/^Category:/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const out = join(ROOT, "archive-library", name);
for (const d of ["free", "check-licence"]) mkdirSync(join(out, d), { recursive: true });

async function get(url, binary = false) {
  let wait = 5000;
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.status === 404 || r.status === 400) return null;
      if (!r.ok) throw new Error("HTTP " + r.status);
      const data = binary ? Buffer.from(await r.arrayBuffer()) : await r.text();
      await sleep(1500);
      return data;
    } catch {
      await sleep(wait); wait *= 2;
    }
  }
  return null;
}

const unesc = (s) => s.replace(/&#95;/g, "_").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (_, c) => String.fromCodePoint(Number(c))).replace(/&#x([0-9a-f]+);/gi, (_, c) => String.fromCodePoint(parseInt(c, 16)));
const text = (s) => unesc((s || "").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<[^>]+>/g, " ")).replace(/\.mw-parser-output[^}]*\}/g, " ").replace(/[\s\u00a0]+/g, " ").trim();

async function listCategory(title) {
  const files = [], subs = [];
  let url = "https://commons.wikimedia.org/wiki/" + title;
  while (url) {
    const page = await get(url);
    if (!page) break;
    for (const m of page.matchAll(/href="\/wiki\/(File:[^"]+)"/g)) files.push(m[1]);
    for (const m of page.matchAll(/<div class="CategoryTreeItem">[\s\S]*?href="\/wiki\/(Category:[^"]+)"/g)) subs.push(m[1]);
    const next = page.match(/href="([^"]+)"[^>]*>next page/);
    url = next ? "https://commons.wikimedia.org" + unesc(next[1]) : null;
  }
  return { files: [...new Set(files)], subs: [...new Set(subs)] };
}

function classify(lic) {
  const l = lic.toLowerCase();
  if (/non-?commercial|no derivat|-nd\b/.test(l)) return "check";
  if (/public domain|cc0|no restrictions/.test(l)) return "free";
  if (/attribution(-| )?share ?alike|attribution (4\.0|3\.0|2\.)|cc by/.test(l)) return "free";
  if (/government open data licen|godl/.test(l)) return "free";
  return "check";
}

const field = (page, key) => text(page.match(new RegExp(`id="fileinfotpl&#95;${key}"[^>]*>[\\s\\S]*?</td>\\s*<td[^>]*>([\\s\\S]*?)</td>`))?.[1]);

const idxPath = join(out, "index.json");
const index = existsSync(idxPath) ? JSON.parse(readFileSync(idxPath, "utf8")) : {};

let { files, subs } = await listCategory(cat);
let todo = files.map((f) => ({ f, from: cat }));
if (withSub) {
  for (const s of subs) {
    const r = await listCategory(s);
    todo.push(...r.files.map((f) => ({ f, from: s })));
  }
}
const seen = new Set();
todo = todo.filter(({ f }) => (seen.has(f) ? false : seen.add(f)));
console.log(`${todo.length} files to look at${withSub ? ` (category + ${subs.length} sub-categories)` : ""}.`);

let n = 0, got = 0;
for (const { f, from } of todo) {
  n++;
  if (got >= limit) break;
  const fileName = decodeURIComponent(f.slice(5));
  if (index[fileName]?.saved) continue;
  const page = await get("https://commons.wikimedia.org/wiki/" + f);
  if (!page) { console.log(n, "page failed:", fileName); continue; }
  const a = page.indexOf('id="Licensing"'), b = page.indexOf('id="filehistory"');
  const lic = a > 0 ? text(page.slice(a, b > a ? b : a + 6000)).replace(/^id="Licensing">\s*Licensing\s*\[ edit \]\s*/, "").slice(0, 600) : "";
  const pt = text(page);
  const orig = pt.match(/Original file[^(]*\(([\d,]+) × ([\d,]+) pixels/);
  const w = orig ? Number(orig[1].replace(/,/g, "")) : null;
  const status = classify(lic);
  const rec = {
    file: fileName,
    page: "https://commons.wikimedia.org/wiki/" + f,
    foundIn: from,
    description: field(page, "desc").slice(0, 300),
    author: field(page, "aut").slice(0, 200),
    date: field(page, "date").slice(0, 80),
    source: field(page, "src").slice(0, 200),
    licence_text: lic,
    licence_status: status,
    original_size: [w, orig ? Number(orig[2].replace(/,/g, "")) : null],
  };
  const ext = fileName.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "tif", "tiff", "webp"].includes(ext)) {
    const under = fileName.replace(/ /g, "_");
    const md5 = createHash("md5").update(under).digest("hex");
    const base = encodeURIComponent(under).replace(/%2C/g, ",").replace(/%28/g, "(").replace(/%29/g, ")");
    const dir = `${md5[0]}/${md5.slice(0, 2)}`;
    let url = w && w <= 960
      ? `https://upload.wikimedia.org/wikipedia/commons/${dir}/${base}`
      : `https://upload.wikimedia.org/wikipedia/commons/thumb/${dir}/${base}/960px-${base}${/tiff?$/.test(ext) ? ".jpg" : ""}`;
    let data = await get(url, true);
    if (!data) data = await get(`https://commons.wikimedia.org/wiki/Special:FilePath/${base}?width=960`, true);
    if (data) {
      try {
        const slug = fileName.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
        const folder = status === "free" ? "free" : "check-licence";
        const img = sharp(data).rotate().webp({ quality: 82 });
        await img.toFile(join(out, folder, slug + ".webp"));
        const meta = await sharp(join(out, folder, slug + ".webp")).metadata();
        rec.saved = `${folder}/${slug}.webp`;
        rec.saved_size = [meta.width, meta.height];
        got++;
      } catch (e) { rec.saved = null; rec.error = String(e.message).slice(0, 100); }
    } else { rec.saved = null; rec.error = "download failed"; }
  } else { rec.saved = null; rec.error = "not a picture (" + ext + ")"; }
  index[fileName] = rec;
  writeFileSync(idxPath, JSON.stringify(index, null, 1));
  console.log(`${n}/${todo.length}`, status.padEnd(5), rec.saved || rec.error, "-", fileName.slice(0, 50));
}

const all = Object.values(index);
const lines = all.filter((r) => r.saved).map((r) => `${r.saved}\n  ${r.page}\n  Author: ${r.author}\n  Licence: ${r.licence_status}: ${r.licence_text.slice(0, 160)}\n`);
writeFileSync(join(out, "links.txt"), lines.join("\n"));
console.log(`\nDone. ${all.filter((r) => r.saved).length} saved, ${all.filter((r) => !r.saved).length} not saved.\nFolder: archive-library/${name}`);
