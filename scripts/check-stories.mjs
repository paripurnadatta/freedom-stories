// The one quality check. Runs before every build (`npm run check`).
// Every published story must pass. Subject files are checked for broken links,
// and every picture a story points to must exist.
import { existsSync, readFileSync, readdirSync } from "node:fs";

// Windows can check files out with CRLF line endings; read everything as LF.
const readText = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
import { join } from "node:path";

const CONTENT = "src/content";
const KINDS = ["people", "events", "places", "organisations"];
const IMAGE = /\.(webp|png|jpe?g)$/i;

// Every subject folder: src/content/<kind>/<slug>/
const folders = KINDS.flatMap((k) =>
  existsSync(join(CONTENT, k)) ? readdirSync(join(CONTENT, k)).map((slug) => ({ kind: k, slug, dir: join(CONTENT, k, slug) })) : [],
);
const subjectIds = new Set(folders.map((f) => f.slug));
const storyFiles = folders.flatMap((f) => {
  const dir = join(f.dir, "stories");
  return existsSync(dir) ? readdirSync(dir).filter((n) => n.endsWith(".md")).map((n) => ({ folder: f, name: n, path: join(dir, n) })) : [];
});
const storyIds = new Set(storyFiles.map((s) => s.name.replace(/\.md$/, "")));

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

// ---- subjects: files in place, links pointing somewhere real -------------
for (const f of folders) {
  const where = `${f.kind}/${f.slug}`;
  const index = join(f.dir, "index.md");
  if (!existsSync(index)) { say(where, "has no index.md"); continue; }
  const parts = split(readText(index));
  if (!parts) { say(where, "index.md is missing the facts block at the top"); continue; }
  for (const id of list(parts.front, "related")) {
    if (!subjectIds.has(id)) say(where, `related link to a subject that doesn't exist: ${id}`);
  }
  for (const m of parts.front.matchAll(/^\s+story:\s*"?([^"\n]+)"?\s*$/gm)) {
    if (!storyIds.has(m[1].trim())) say(where, `angle points to a story that doesn't exist: ${m[1].trim()}`);
  }
}

// Pictures a page points to (/files/...) must exist in the subject folders.
const missingFile = (raw) =>
  [...raw.matchAll(/["(](\/files\/[^"')\s]+)/g)].map((m) => m[1]).filter((p) => !existsSync(join(CONTENT, decodeURIComponent(p.slice(7)))));

// ---- stories ------------------------------------------------------------
let published = 0;
for (const story of storyFiles) {
  const where = `${story.folder.kind}/${story.folder.slug}/stories/${story.name}`;
  const raw = readText(story.path);
  const parts = split(raw);
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
  else if (about[0] !== story.folder.slug) say(where, `is mainly about ${about[0]}, so it belongs in that subject's stories folder`);
  for (const p of missingFile(raw)) say(where, `points to a picture that isn't there: ${p}`);
  for (const id of about) if (!subjectIds.has(id)) say(where, `is about a subject that doesn't exist: ${id}`);

  const sources = front.match(/^\s+url:\s*"(.+?)"/gm) ?? [];
  if (sources.length < 2) say(where, `needs at least 2 sources (has ${sources.length})`);

  if (/Research notes/.test(body)) say(where, "still contains research notes");
  if (/\[(?:TODO|TK|citation needed)\]/i.test(body)) say(where, "contains a placeholder");

  // Count only the story's own words: not comments, headings, pictures or margin notes.
  const prose = body
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<figure[\s\S]*?<\/figure>/g, "")
    .replace(/<aside[\s\S]*?<\/aside>/g, "")
    .replace(/^#.*$/gm, "");
  const words = prose.split(/\s+/).filter(Boolean).length;
  if (MIN_WORDS[type] && words < MIN_WORDS[type]) say(where, `is short for a ${type} story (${words} words; aim for ${MIN_WORDS[type]}+)`);

  // Class 5 reading level: short sentences on average, no very long ones.
  // List items and line breaks end a sentence too.
  const sentences = prose.replace(/^\s*[-*]\s+/gm, "").split(/(?<=[.!?:])["”']?\s+|\n+/).map((x) => x.trim()).filter((x) => /[a-z]/i.test(x));
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

// Illustrations: entries in each prompts.txt whose image hasn't arrived yet.
let waiting = 0;
for (const f of folders) {
  const prompts = join(f.dir, "illustrations", "prompts.txt");
  if (!existsSync(prompts)) continue;
  const have = readdirSync(join(f.dir, "illustrations")).filter((n) => IMAGE.test(n)).map((n) => n.replace(IMAGE, ""));
  for (const m of readText(prompts).matchAll(/^FILE NAME:\s*(\S+)/gm)) if (!have.includes(m[1])) waiting++;
}

const planned = folders
  .map((f) => (existsSync(join(f.dir, "index.md")) ? readText(join(f.dir, "index.md")) : ""))
  .reduce((n, raw) => n + (raw.match(/^\s+hook:/gm)?.length ?? 0) - (raw.match(/^\s+story:/gm)?.length ?? 0), 0);
console.log(`All ${published} published stories pass. ${subjectIds.size} subjects, ${planned} planned stories waiting, ${waiting} illustrations waiting.`);
