// The one quality check. Runs before every build (`npm run check`).
// Every published story must pass. Subject files are checked for broken links.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SUBJECTS = "src/content/subjects";
const STORIES = "src/content/stories";
const mdFiles = (dir) => readdirSync(dir).filter((f) => f.endsWith(".md"));
const subjectIds = new Set(mdFiles(SUBJECTS).map((f) => f.replace(/\.md$/, "")));
const storyFiles = mdFiles(STORIES);
const storyIds = new Set(storyFiles.map((f) => f.replace(/\.md$/, "")));

const MIN_WORDS = { flagship: 900, short: 350 };

// Hollow phrases that weaken a story. Extend this list as the house style grows.
const BANNED = [
  "stands as a testament", "testament to", "pivotal role", "plays a vital role",
  "rich tapestry", "indelible mark", "it is important to note", "it's important to note",
  "in conclusion", "in summary", "delve", "unsung hero", "left an indelible",
];

const problems = [];
const say = (file, msg) => problems.push([file, msg]);

function split(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  return m ? { front: m[1], body: m[2] } : null;
}
const field = (front, k) => front.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1] ?? "";
const list = (front, k) => {
  const block = front.match(new RegExp(`^${k}:\\n((?:\\s+-\\s.*\\n?)*)`, "m"))?.[1] ?? "";
  return [...block.matchAll(/-\s+"?([^"\n]+?)"?\s*$/gm)].map((m) => m[1].trim());
};

// ---- subjects: links must point somewhere real ---------------------------
for (const file of mdFiles(SUBJECTS)) {
  const parts = split(readFileSync(join(SUBJECTS, file), "utf8"));
  if (!parts) { say(`subjects/${file}`, "missing the facts block at the top"); continue; }
  for (const id of list(parts.front, "related")) {
    if (!subjectIds.has(id)) say(`subjects/${file}`, `related link to a subject that doesn't exist: ${id}`);
  }
  for (const m of parts.front.matchAll(/^\s+story:\s*"?([^"\n]+)"?\s*$/gm)) {
    if (!storyIds.has(m[1].trim())) say(`subjects/${file}`, `angle points to a story that doesn't exist: ${m[1].trim()}`);
  }
}

// ---- stories ------------------------------------------------------------
let published = 0;
for (const file of storyFiles) {
  const where = `stories/${file}`;
  const parts = split(readFileSync(join(STORIES, file), "utf8"));
  if (!parts) { say(where, "missing the facts block at the top"); continue; }
  const { front, body } = parts;
  if (field(front, "status") !== "published") continue;
  published++;

  if (!field(front, "title")) say(where, "has no title");
  if (!field(front, "subtitle")) say(where, "has no subtitle");
  const type = field(front, "type");
  if (!MIN_WORDS[type]) say(where, `type must be flagship or short (found "${type}")`);

  const about = list(front, "about");
  if (about.length === 0) say(where, "doesn't say who it is about (about:)");
  for (const id of about) if (!subjectIds.has(id)) say(where, `is about a subject that doesn't exist: ${id}`);

  const sources = front.match(/^\s+url:\s*"(.+?)"/gm) ?? [];
  if (sources.length < 2) say(where, `needs at least 2 sources (has ${sources.length})`);

  if (/Research notes/.test(body)) say(where, "still contains research notes");
  if (/\[(?:TODO|TK|citation needed)\]/i.test(body)) say(where, "contains a placeholder");

  const prose = body.replace(/<!--[\s\S]*?-->/g, "").replace(/^#.*$/gm, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  if (MIN_WORDS[type] && words < MIN_WORDS[type]) say(where, `is short for a ${type} story (${words} words; aim for ${MIN_WORDS[type]}+)`);

  // Class 5 reading level: short sentences on average, no very long ones.
  const sentences = prose.split(/(?<=[.!?])["”']?\s+/).map((x) => x.trim()).filter((x) => /[a-z]/i.test(x));
  const lengths = sentences.map((x) => x.split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / (lengths.length || 1);
  if (avg > 15) say(where, `sentences average ${avg.toFixed(1)} words; keep it under 15 for Class 5 readers`);
  for (const x of sentences.filter((x) => x.split(/\s+/).length > 30).slice(0, 3)) {
    say(where, `very long sentence (${x.split(/\s+/).length} words): "${x.slice(0, 60)}..."`);
  }

  const lower = body.toLowerCase();
  for (const b of BANNED) if (lower.includes(b)) say(where, `uses the phrase "${b}"`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):\n`);
  for (const [f, msg] of problems) console.error(`  ${f}: ${msg}`);
  console.error("");
  process.exit(1);
}

const planned = mdFiles(SUBJECTS)
  .map((f) => readFileSync(join(SUBJECTS, f), "utf8"))
  .reduce((n, raw) => n + (raw.match(/^\s+hook:/gm)?.length ?? 0) - (raw.match(/^\s+story:/gm)?.length ?? 0), 0);
console.log(`All ${published} published stories pass. ${subjectIds.size} subjects, ${planned} planned stories waiting.`);
