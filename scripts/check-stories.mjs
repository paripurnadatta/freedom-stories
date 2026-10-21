// The one quality check. Runs before every build (`npm run check`).
// Drafts are skipped; every published story must pass.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "src/content/stories";
const files = readdirSync(DIR).filter((f) => f.endsWith(".md"));
const slugs = new Set(files.map((f) => f.replace(/\.md$/, "")));

// Hollow phrases that weaken a story. Extend this list as the house style grows.
const BANNED = [
  "stands as a testament", "testament to", "pivotal role", "plays a vital role",
  "rich tapestry", "indelible mark", "it is important to note", "it's important to note",
  "in conclusion", "in summary", "delve", "unsung hero", "left an indelible",
];

const problems = [];
let published = 0;

for (const file of files) {
  const raw = readFileSync(join(DIR, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { problems.push([file, "missing the facts block at the top"]); continue; }
  const [, front, body] = m;
  if (!/^status:\s*published\s*$/m.test(front)) continue;
  published++;

  const field = (k) => front.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1] ?? "";
  const say = (msg) => problems.push([file, msg]);

  if (!field("title")) say("has no title");
  if (!field("subtitle")) say("has no subtitle");

  const sources = front.match(/^\s+url:\s*"(.+?)"/gm) ?? [];
  if (sources.length < 2) say(`needs at least 2 sources (has ${sources.length})`);
  for (const s of sources) {
    const url = s.match(/"(.+?)"/)[1];
    if (!/^https?:\/\//.test(url)) say(`source is not a web link: ${url}`);
  }

  const related = [...front.matchAll(/^related:\n((?:\s+-\s.*\n?)*)/gm)][0]?.[1] ?? "";
  for (const r of related.matchAll(/-\s+"?([^"\n]+)"?/g)) {
    if (!slugs.has(r[1].trim())) say(`links to a story that doesn't exist: ${r[1].trim()}`);
  }

  const born = Number(field("born").match(/\d{4}/)?.[0]);
  const died = Number(field("died").match(/\d{4}/)?.[0]);
  if (born && died && died < born) say(`died (${died}) is before born (${born})`);

  if (/Research notes/.test(body)) say("still contains the draft research notes");
  if (/\[(?:TODO|TK|citation needed)\]/i.test(body)) say("contains a placeholder");

  const words = body.replace(/<!--[\s\S]*?-->/g, "").split(/\s+/).filter(Boolean).length;
  if (words < 600) say(`is short for a story (${words} words; aim for 900+)`);

  // Class 5 reading level: keep sentences short on average, and flag very long ones.
  const prose = body.replace(/<!--[\s\S]*?-->/g, "").replace(/^#.*$/gm, "");
  const sentences = prose.split(/(?<=[.!?])["”']?\s+/).map((x) => x.trim()).filter((x) => /[a-z]/i.test(x));
  const lengths = sentences.map((x) => x.split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
  if (avg > 15) say(`sentences average ${avg.toFixed(1)} words; keep it under 15 for Class 5 readers`);
  const longOnes = sentences.filter((x) => x.split(/\s+/).length > 30);
  for (const x of longOnes.slice(0, 3)) say(`very long sentence (${x.split(/\s+/).length} words): "${x.slice(0, 60)}..."`);

  const lower = body.toLowerCase();
  for (const b of BANNED) if (lower.includes(b)) say(`uses the phrase "${b}"`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s) in published stories:\n`);
  for (const [f, msg] of problems) console.error(`  ${f}: ${msg}`);
  console.error("");
  process.exit(1);
}
console.log(`All ${published} published stories pass. ${files.length - published} drafts waiting.`);
