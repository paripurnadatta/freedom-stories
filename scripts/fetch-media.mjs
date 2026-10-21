// Collects free-to-reuse media for each subject from Wikimedia Commons and Wikipedia,
// and saves it to src/content/media/<subject>.json for the subject's media section.
//
// Where it looks:
//   1. The subject's Commons category (from Wikidata, property P373), plus its direct subcategories.
//   2. The files used in the subject's English Wikipedia article.
// What it keeps: only files hosted on Commons under public domain, CC0, CC BY or CC BY-SA.
// Wikipedia's local "fair use" files are not on Commons, so they are never included.
//
// Usage:
//   node scripts/fetch-media.mjs bhagat-singh durga-bhabhi   (named subjects)
//   node scripts/fetch-media.mjs --all                        (every subject; slow, resumable)
//   node scripts/fetch-media.mjs --all --refresh              (re-fetch files that already exist)
//
// To hide an item by hand, add its file name to "hidden" in the JSON. Re-runs keep that list.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SUBJECTS = "src/content/subjects";
// MEDIA_OUT lets a long run write somewhere else first, then be copied in when it finishes.
const OUT = process.env.MEDIA_OUT || "src/content/media";
const UA = "FreedomStories/1.0 (https://github.com/paripurnadatta/freedom-stories; paripurna.dutta@gmail.com)";
const PAUSE = 1500; // ms between API calls: Wikimedia asks bots to go slowly
const MAX_ITEMS = 80;
const THUMB = 500;
mkdirSync(OUT, { recursive: true });

const args = process.argv.slice(2);
const refresh = args.includes("--refresh");
const all = args.includes("--all");
const named = args.filter((a) => !a.startsWith("--"));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(base, params) {
  // POST, so long lists of file names never make the address too long.
  const url = base;
  const body = new URLSearchParams({ format: "json", formatversion: "2", ...params });
  for (let attempt = 1; attempt <= 6; attempt++) {
    await sleep(PAUSE);
    const res = await fetch(url, {
      method: "POST",
      headers: { "User-Agent": UA, "Api-User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (res.status === 429 || res.status >= 500) {
      const wait = Number(res.headers.get("retry-after")) * 1000 || 5000 * attempt;
      await sleep(wait);
      continue;
    }
    const text = await res.text();
    try { return JSON.parse(text); }
    catch { await sleep(5000 * attempt); }
  }
  throw new Error(`Gave up after repeated refusals: ${url} ${String(body).slice(0, 80)}`);
}
const commons = (p) => api("https://commons.wikimedia.org/w/api.php", p);
const enwiki = (p) => api("https://en.wikipedia.org/w/api.php", p);
const wikidata = (p) => api("https://www.wikidata.org/w/api.php", p);

const strip = (html = "") =>
  html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, " ").trim();

const FREE = /^(public domain|pd|cc0|cc[- ]by(-sa)?[- ]?\d?(\.\d)?|cc[- ]by(-sa)?$|cc[- ]?by[- ]?sa|attribution|gfdl)/i;
const NOT_FREE = /(nc|nd|non-?commercial|no ?deriv|fair use|non-free)/i;
const JUNK = /(^File:)?(Flag[_ ]of|Commons-logo|Wikisource|Wikiquote|Wiktionary|Symbol[_ ]|Icon|Ambox|Question_book|Edit-clear|Padlock|Nuvola|Crystal_Clear|OOjs|Increase2|Decrease|Steady|Red_pog|Blue_pog|Wikidata|P_vip|Portal|Disambig|Text_document|Folder_Hexagonal|protection|Padlock|Lock-)/i;
// Pronunciation recordings of a name (Lingua Libre etc.), not historical audio.
const PRONUNCIATION = /^(LL-Q\d+|.*pronunciation)/i;

function typeOf(mime = "", name = "") {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("audio/") || /\.(ogg|oga|mp3|wav|flac)$/i.test(name)) return "audio";
  if (mime.startsWith("video/") || /\.(webm|ogv|mp4)$/i.test(name)) return "video";
  if (mime === "application/pdf" || /\.(pdf|djvu)$/i.test(name)) return "document";
  return "other";
}

function readFront(slug) {
  const raw = readFileSync(join(SUBJECTS, `${slug}.md`), "utf8");
  const get = (k) => raw.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1] ?? "";
  return { name: get("name"), wikidata: get("wikidata"), wikipedia: get("wikipedia"), kind: get("kind") };
}

/** Wikidata gives the Commons category and the Wikipedia article. Without a QID we try the article by name. */
async function locate(front) {
  let qid = front.wikidata;
  let article = front.wikipedia;
  let matchedBy = qid ? "wikidata id" : article ? "wikipedia title" : "name search";

  if (!qid) {
    const title = article || front.name;
    const r = await enwiki({ action: "query", titles: title, redirects: "1", prop: "pageprops", ppprop: "wikibase_item|disambiguation" });
    const page = r.query?.pages?.[0];
    if (!page || page.missing || page.pageprops?.disambiguation !== undefined) return { matchedBy: "not found" };
    qid = page.pageprops?.wikibase_item;
    article = page.title;
  }
  if (!qid) return { matchedBy: "not found" };

  const w = await wikidata({ action: "wbgetentities", ids: qid, props: "claims|sitelinks", sitefilter: "enwiki" });
  const entity = w.entities?.[qid];
  const category = entity?.claims?.P373?.[0]?.mainsnak?.datavalue?.value;
  article = article || entity?.sitelinks?.enwiki?.title;
  return { qid, category, article, matchedBy };
}

async function filesInCategory(category) {
  const names = new Set();
  const cats = [`Category:${category}`];
  const sub = await commons({ action: "query", list: "categorymembers", cmtitle: cats[0], cmtype: "subcat", cmlimit: "50" });
  for (const c of sub.query?.categorymembers ?? []) cats.push(c.title);
  for (const cat of cats.slice(0, 15)) {
    const r = await commons({ action: "query", list: "categorymembers", cmtitle: cat, cmtype: "file", cmlimit: "100" });
    for (const f of r.query?.categorymembers ?? []) names.add(f.title);
    if (names.size >= MAX_ITEMS * 2) break;
  }
  return [...names];
}

async function filesInArticle(article) {
  const r = await enwiki({ action: "query", titles: article, prop: "images", imlimit: "100", redirects: "1" });
  return (r.query?.pages?.[0]?.images ?? []).map((i) => i.title);
}

async function describe(titles) {
  const out = [];
  for (let i = 0; i < titles.length; i += 40) {
    const r = await commons({
      action: "query",
      titles: titles.slice(i, i + 40).join("|"),
      prop: "imageinfo",
      iiprop: "url|mime|size|extmetadata",
      iiurlwidth: String(THUMB),
      iiextmetadatafilter: "LicenseShortName|LicenseUrl|Artist|Credit|DateTimeOriginal|ImageDescription|ObjectName|UsageTerms",
    });
    for (const p of r.query?.pages ?? []) {
      const info = p.imageinfo?.[0];
      if (p.missing || !info) continue; // not on Commons (e.g. Wikipedia fair-use files)
      out.push({ title: p.title, info });
    }
  }
  return out;
}

function toItem({ title, info }, foundIn) {
  const m = info.extmetadata ?? {};
  const license = strip(m.LicenseShortName?.value ?? m.UsageTerms?.value ?? "");
  if (!license || NOT_FREE.test(license) || !FREE.test(license)) return null;
  const file = title.replace(/^File:/, "");
  const type = typeOf(info.mime, file);
  if (type === "other") return null;
  if (type === "image" && (info.width < 200 || info.height < 200)) return null;
  return {
    file,
    type,
    title: strip(m.ObjectName?.value) || file.replace(/\.[a-z0-9]+$/i, "").replace(/_/g, " "),
    description: strip(m.ImageDescription?.value).slice(0, 400),
    date: strip(m.DateTimeOriginal?.value).slice(0, 40),
    author: strip(m.Artist?.value).slice(0, 160) || strip(m.Credit?.value).slice(0, 160),
    license,
    licenseUrl: m.LicenseUrl?.value || undefined,
    thumb: info.thumburl || undefined,
    url: info.url,
    page: info.descriptionurl,
    width: info.width,
    height: info.height,
    foundIn,
  };
}

const yearOf = (d) => Number(String(d).match(/\b(1[5-9]\d\d|20\d\d)\b/)?.[1]) || 9999;
/** Earliest plausible year mentioned in the date, title or description. Catches "before 1960" dates on 1930 posters. */
const earliestYear = (item) => {
  const years = [item.date, item.title, item.file, item.description]
    .join(" ")
    .replace(/(\d)o\b/g, "$10") // "193o" typed for "1930"
    .match(/\b(1[6-9]\d\d|20[0-2]\d)\b/g) ?? [];
  return years.length ? Math.min(...years.map(Number)) : 9999;
};

async function collect(slug) {
  const dest = join(OUT, `${slug}.json`);
  const previous = existsSync(dest) ? JSON.parse(readFileSync(dest, "utf8")) : null;
  if (previous && !refresh) return "kept";

  const front = readFront(slug);
  const where = await locate(front);
  const fromArticle = where.article ? await filesInArticle(where.article) : [];
  const fromCategory = where.category ? await filesInCategory(where.category) : [];

  const found = new Map();
  for (const t of fromArticle) if (!JUNK.test(t)) found.set(t, "wikipedia");
  for (const t of fromCategory) if (!JUNK.test(t)) found.set(t, found.has(t) ? "both" : "commons");

  const described = await describe([...found.keys()]);
  // Words from the subject's name, used to keep later photos that are actually about them.
  const nameWords = front.name.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
  const mentionsSubject = (it) => nameWords.some((w) => `${it.file} ${it.title} ${it.description}`.toLowerCase().includes(w));

  const items = described
    .map((d) => toItem(d, found.get(d.title)))
    .filter(Boolean)
    .filter((it) => !(it.type === "audio" && (PRONUNCIATION.test(it.file) || it.file.replace(/\.[a-z0-9]+$/i, "").length < 25)))
    .map((it) => {
      const year = earliestYear(it);
      return { ...it, year: year === 9999 ? null : year, era: year <= 1947 ? "original" : "later" };
    })
    // Originals always stay. Later items stay only if Wikipedia uses them or they name the subject.
    .filter((it) => it.era === "original" || it.foundIn !== "commons" || mentionsSubject(it))
    .sort((a, b) => (a.era === "later") - (b.era === "later") || (a.year ?? 9999) - (b.year ?? 9999))
    .slice(0, MAX_ITEMS);

  writeFileSync(dest, JSON.stringify({
    subject: slug,
    wikidata: where.qid ?? null,
    wikipedia: where.article ?? null,
    commonsCategory: where.category ?? null,
    matchedBy: where.matchedBy,
    fetched: new Date().toISOString().slice(0, 10),
    hidden: previous?.hidden ?? [],
    items,
  }, null, 2) + "\n");
  return `${items.length} items (${where.matchedBy}${where.category ? `, category ${where.category}` : ""})`;
}

const slugs = all
  ? readdirSync(SUBJECTS).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))
  : named;
if (slugs.length === 0) {
  console.log("Name some subjects (e.g. bhagat-singh) or pass --all.");
  process.exit(1);
}
let n = 0;
for (const slug of slugs) {
  n++;
  try {
    console.log(`[${n}/${slugs.length}] ${slug}: ${await collect(slug)}`);
  } catch (e) {
    console.log(`[${n}/${slugs.length}] ${slug}: failed (${e.message.slice(0, 120)}). Re-run to retry.`);
  }
}
