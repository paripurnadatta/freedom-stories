// Collects free-to-reuse media for each subject from Wikimedia Commons and Wikipedia,
// and saves it to src/content/<kind>/<subject>/media.json for the subject's media section.
//
// Where it looks:
//   1. The subject's Commons category (from Wikidata, property P373) and its subcategories,
//      a few levels deep. Branches that are not about the subject's own time or memory
//      (things named after them, quotations, people associated, ...) are skipped.
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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { allSubjects } from "./lib/subjects.mjs";

const FOLDERS = new Map(allSubjects().map((s) => [s.slug, s.dir]));
// MEDIA_OUT lets a long run write somewhere else first (as <slug>.json), then be copied in when it finishes.
const OUT = process.env.MEDIA_OUT;
const UA = "FreedomStories/1.0 (https://github.com/paripurnadatta/freedom-stories; paripurna.dutta@gmail.com)";
const PAUSE = 1500; // ms between API calls: Wikimedia asks bots to go slowly
const MAX_ITEMS = 3000; // a safety net only: big subjects (Gandhi) have about a thousand
const MAX_DEPTH = 3; // how many levels of subcategories to walk
const MAX_CATS = 400;
// Subcategories that are not about the subject's life or memory.
const SKIP_CAT = /(named after|national parks?|marine|airports?|ports?\b|bridges?|stadiums?|halls?\b|nagar\b|markets?|bhawan|bhavan|ghats?\b|lakes?\b|islands?\b|metro|railway|ships?\b|trains?\b|companies|politicians|elections?|people associated|quotations?|quotes|caps\b|nuclear|gandhism|by location|in popular culture|memes?|streets?|roads?|avenues?|squares?|schools?|colleges?|universit|hospitals?|stations?|buildings named|parks? named|awards?|prizes?|films? about|actors|portrayals|books about|cosplay|logos?)/i;
// Branches whose files are always later than the subject's lifetime.
const LATER_CAT = /(monuments?|memorials?|statues?|busts?|sculptures?|in art|paintings? of|murals?|stamps?|coins?|banknotes?|anniversar|jayanti|museums?|heritage sites?|mausole|samadhi|in media|graffiti|wax)/i;
const THUMB = 500;
if (OUT) mkdirSync(OUT, { recursive: true });

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
  const raw = readFileSync(join(FOLDERS.get(slug), "index.md"), "utf8");
  const get = (k) => raw.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, "m"))?.[1] ?? "";
  const yr = (k) => Number(get(k).match(/\b(1[0-9]\d\d)\b/)?.[1]) || null;
  return { name: get("name"), wikidata: get("wikidata"), wikipedia: get("wikipedia"), kind: get("kind"), lifeYears: [yr("born"), yr("died")].filter(Boolean) };
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

/** Every member of a category, following "continue" pages. */
async function members(cat, cmtype) {
  const out = [];
  let cont = {};
  do {
    const r = await commons({ action: "query", list: "categorymembers", cmtitle: cat, cmtype, cmlimit: "500", ...cont });
    out.push(...(r.query?.categorymembers ?? []).map((m) => m.title));
    cont = r.continue ?? null;
  } while (cont && out.length < MAX_ITEMS);
  return out;
}

/** Walks the category tree. Returns file title -> the category path it was found under. */
async function filesInCategory(category) {
  const files = new Map();
  const seen = new Set();
  let level = [{ cat: `Category:${category}`, path: "" }];
  for (let depth = 0; depth <= MAX_DEPTH && level.length; depth++) {
    const next = [];
    for (const { cat, path } of level) {
      if (seen.has(cat) || seen.size >= MAX_CATS) continue;
      seen.add(cat);
      const here = `${path} / ${cat.replace(/^Category:/, "")}`;
      for (const f of await members(cat, "file")) if (!files.has(f)) files.set(f, here);
      if (files.size >= MAX_ITEMS) return files;
      if (depth < MAX_DEPTH) {
        for (const sub of await members(cat, "subcat")) if (!SKIP_CAT.test(sub)) next.push({ cat: sub, path: here });
      }
    }
    level = next;
  }
  return files;
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

/** Earliest plausible year mentioned in the date, title or description. Catches "before 1960" dates on 1930 posters.
 *  Life-span ranges like "1869-1948" are ignored: they appear on plaques and statues, not just old photos. */
const earliestYear = (item) => {
  const years = [item.date, item.title, item.file, item.description]
    .join(" ")
    .replace(/(\d)o\b/g, "$10") // "193o" typed for "1930"
    .replace(/\b1[6-9]\d\d\s*[-–—]\s*(1[6-9]|20)\d\d\b/g, " ")
    .match(/\b(1[6-9]\d\d|20[0-2]\d)\b/g) ?? [];
  return years.length ? Math.min(...years.map(Number)) : 9999;
};
/** A year in the category path, e.g. "Mohandas K. Gandhi in 1930". */
const pathYear = (path = "") => {
  const ys = path.match(/\b(1[6-9]\d\d|20[0-2]\d)s?\b/g);
  return ys ? Number(ys[ys.length - 1].slice(0, 4)) : null;
};

async function collect(slug) {
  const dest = OUT ? join(OUT, `${slug}.json`) : join(FOLDERS.get(slug), "media.json");
  const previous = existsSync(dest) ? JSON.parse(readFileSync(dest, "utf8")) : null;
  if (previous && !refresh) return "kept";

  const front = readFront(slug);
  const where = await locate(front);
  const fromArticle = where.article ? await filesInArticle(where.article) : [];
  const fromCategory = where.category ? await filesInCategory(where.category) : new Map();

  const found = new Map();
  const pathOf = new Map(fromCategory);
  for (const t of fromArticle) if (!JUNK.test(t)) found.set(t, "wikipedia");
  for (const t of fromCategory.keys()) if (!JUNK.test(t)) found.set(t, found.has(t) ? "both" : "commons");

  const described = await describe([...found.keys()]);
  // Words from the subject's name, used to keep later photos that are actually about them.
  const nameWords = front.name.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3);
  // Relevant if the file itself, or the category it sits in directly, names the subject.
  // (Walking several levels down otherwise drifts: Azad -> Alfred Park -> Allahabad Museum -> its sculptures.)
  const lastCat = (it) => (pathOf.get("File:" + it.file) ?? "").split(" / ").pop();
  const mentionsSubject = (it) => nameWords.some((w) => `${it.file} ${it.title} ${it.description} ${lastCat(it)}`.toLowerCase().includes(w));
  // Years in the text other than the subject's own birth and death years.
  const textYears = (it) => ([it.date, it.title, it.file, it.description].join(" ")
    .replace(/(\d)o\b/g, "$10").replace(/\b1[6-9]\d\d\s*[-–—]\s*(1[6-9]|20)\d\d\b/g, " ")
    .match(/\b(1[6-9]\d\d|20[0-2]\d)\b/g) ?? []).map(Number).filter((y) => !front.lifeYears.includes(y));

  const items = described
    .map((d) => toItem(d, found.get(d.title)))
    .filter(Boolean)
    .filter((it) => !(it.type === "audio" && (PRONUNCIATION.test(it.file) || it.file.replace(/\.[a-z0-9]+$/i, "").length < 25)))
    .map((it) => {
      const path = pathOf.get("File:" + it.file) ?? "";
      const fromPath = pathYear(path);
      const year = fromPath && fromPath < earliestYear(it) ? fromPath : earliestYear(it);
      // A branch like "Monuments and memorials" or "in art" is later, whatever years the text mentions,
      // unless the file's own date says otherwise (Azad Hind stamps of 1943 are originals).
      const ownYear = Number(String(it.date).match(/\b(1[6-9]\d\d|20[0-2]\d)\b/)?.[1]) || null;
      const laterBranch = LATER_CAT.test(path) && !(ownYear && ownYear <= 1947) && !textYears(it).some((y) => y <= 1947);
      const era = laterBranch ? "later" : year <= 1947 ? "original" : "later";
      const shownYear = era === "later" && ownYear && ownYear > 1947 ? ownYear : year === 9999 ? null : year;
      return { ...it, year: shownYear, era };
    })
    // Files from Wikipedia's article always stay. Files from the Commons tree stay only if they,
    // or the category they sit in, name the subject.
    .filter((it) => it.foundIn !== "commons" || mentionsSubject(it))
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
  ? [...FOLDERS.keys()]
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
