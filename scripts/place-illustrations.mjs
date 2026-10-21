// Prepares paintings dropped into a subject's illustrations/ folder.
//
// Save each painting with the FILE NAME given in that folder's prompts.txt
// (any of .png, .jpg, .jpeg or .webp). This script converts it to a web-sized
// .webp next to the original and removes the original. The site then shows it
// automatically: no other edits are needed.
//
// Usage:
//   node scripts/place-illustrations.mjs              every subject
//   node scripts/place-illustrations.mjs bhagat-singh one subject
import { existsSync, readdirSync, readFileSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { allSubjects, CONTENT } from "./lib/subjects.mjs";

const only = process.argv.slice(2);
const MAX_WIDTH = { "home-hero": 2560 };
const folders = [...allSubjects(), { slug: "home", dir: join(CONTENT, "home") }];

let placed = 0;
for (const s of folders) {
  if (only.length && !only.includes(s.slug)) continue;
  const dir = join(s.dir, "illustrations");
  if (!existsSync(dir)) continue;
  const expected = existsSync(join(dir, "prompts.txt"))
    ? [...readFileSync(join(dir, "prompts.txt"), "utf8").matchAll(/^FILE NAME:\s*(\S+)/gm)].map((m) => m[1])
    : [];
  for (const file of readdirSync(dir)) {
    const m = file.match(/^(.+)\.(png|jpe?g|webp)$/i);
    if (!m) continue;
    const [, name, ext] = m;
    const out = join(dir, `${name}.webp`);
    const isWebp = ext.toLowerCase() === "webp";
    if (isWebp && statSync(join(dir, file)).size < 600_000) continue; // already prepared
    if (expected.length && !expected.includes(name)) console.warn(`  ${s.slug}: "${file}" doesn't match any FILE NAME in prompts.txt`);
    const input = readFileSync(join(dir, file));
    await sharp(input).resize({ width: MAX_WIDTH[name] ?? 1800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out + ".tmp");
    if (!isWebp) unlinkSync(join(dir, file));
    const { renameSync } = await import("node:fs");
    renameSync(out + ".tmp", out);
    console.log(`  ${s.slug}: ${name}.webp ready (${Math.round(statSync(out).size / 1024)} KB)`);
    placed++;
  }
}
console.log(placed ? `Placed ${placed} illustration(s).` : "No new illustrations found.");
