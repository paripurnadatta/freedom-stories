"""
One-time import from the old freedom-fighter-timeline repo.

Turns the 748-person / 178-event dataset (plus the enrichment overlay)
into one subject file per person or event under src/content/subjects/.
A subject file holds the facts and the old research notes. Stories about
the subject live separately in src/content/stories/.

Usage:
  python3 scripts/import-old-roster.py /path/to/freedom-fighter-timeline

Run it once. Existing subject files are left alone unless you pass --force.
"""
import json
import re
import sys
import unicodedata
from collections import defaultdict
from pathlib import Path

_args = [a for a in sys.argv[1:] if not a.startswith("--")]
OLD = Path(_args[0] if _args else "../freedom-fighter-timeline")
FORCE = "--force" in sys.argv
OUT = Path(__file__).resolve().parent.parent / "src" / "content" / "subjects"
OUT.mkdir(parents=True, exist_ok=True)


def fix(s):
    """Repair text that was double-encoded (e.g. 'â€“' instead of '–')."""
    if not isinstance(s, str):
        return s
    if any(m in s for m in ("â", "Ã", "Â")):
        try:
            return s.encode("cp1252").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            pass
    return s


def deep_fix(x):
    if isinstance(x, dict):
        return {k: deep_fix(v) for k, v in x.items()}
    if isinstance(x, list):
        return [deep_fix(v) for v in x]
    return fix(x)


def pick(d, *keys, default=""):
    """Old batches named the same field differently; take the first present."""
    for k in keys:
        v = d.get(k)
        if v not in (None, "", []):
            return v
    return default


def subj(d):
    return pick(d, "subject_id", "person_id")


def as_text(v):
    if isinstance(v, dict):
        return str(pick(v, "display", "value", default=""))
    if isinstance(v, list):
        return ", ".join(as_text(x) for x in v)
    return "" if v is None else str(v)


def slugify(name):
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s or "untitled"


def q(s):
    """YAML-safe double-quoted string."""
    return json.dumps("" if s is None else str(s), ensure_ascii=False)


base = deep_fix(json.load(open(OLD / "Indian_Freedom_Struggle_Timeline_Production_748.json", encoding="utf-8")))["tables"]
enr = deep_fix(json.load(open(OLD / "Indian_Freedom_Struggle_Enrichment_v1.json", encoding="utf-8")))

people, events = base["People"], base["Events"]
src_old = {s["source_id"]: s for s in base["Sources"]}
src_sup = {s.get("supplemental_source_id") or s.get("source_id"): s for s in enr["SupplementalSources"]}

# ---- stable slugs ---------------------------------------------------------
slug_of, used = {}, set()
for rec, key, name_key in [(p, "person_id", "canonical_name") for p in people] + \
                          [(e, "event_id", "event_name") for e in events]:
    s = slugify(rec[name_key])
    base_s, n = s, 2
    while s in used:
        s = f"{base_s}-{n}"
        n += 1
    used.add(s)
    slug_of[rec[key]] = s

# ---- gather links and notes per subject ----------------------------------
related = defaultdict(list)
for r in base["Relationships"]:
    pid, eid = r.get("person_id"), r.get("event_id")
    if pid in slug_of and eid in slug_of:
        related[pid].append(slug_of[eid])
        related[eid].append(slug_of[pid])
for r in enr["EntityRelationships"]:
    a, b = r["from_id"], r["to_id"]
    if a in slug_of and b in slug_of:
        related[a].append(slug_of[b])
        related[b].append(slug_of[a])

portraits = {}
_pp = OLD / "src" / "data" / "person_portraits.generated.json"
if _pp.exists():
    for img in deep_fix(json.load(open(_pp, encoding="utf-8")))["portraits"]:
        portraits.setdefault(img["person_id"], img)

profile = {p["person_id"]: p for p in enr["PersonProfiles"]}
for pid, prof in profile.items():
    if pick(prof, "research_summary"):
        prof.setdefault("summary_note", as_text(prof["research_summary"]))
narr, chron, evid, geo = (defaultdict(list) for _ in range(4))
for table, bucket in [("NarrativeSections", narr), ("ChronologyEntries", chron),
                      ("Evidence", evid), ("HistoricalGeography", geo)]:
    for row in enr[table]:
        if subj(row):
            bucket[subj(row)].append(row)


def sources_for(rec_id, rec):
    out, seen = [], set()

    def add(title, url, publisher=None):
        if not url or url in seen or "Special:Search" in url:
            return
        seen.add(url)
        out.append({"title": title or url, "url": url, "publisher": publisher})

    ids = list(profile.get(rec_id, {}).get("key_source_ids", []))
    for ev in evid.get(rec_id, []):
        ids.append(ev.get("source_id"))
        ids += ev.get("source_ids") or []
    ids += rec.get("source_ids") or []
    for sid in ids:
        s = src_sup.get(sid) or src_old.get(sid)
        if s:
            add(s.get("title"), s.get("url"), s.get("publisher"))
    add(None, rec.get("primary_source_url"))
    return out


def dates(p):
    born = p.get("birth_date") or p.get("birth_year")
    died = p.get("death_date") or p.get("death_year")
    return (str(born) if born else ""), (str(died) if died else "")


def notes_block(rec_id, fallback):
    lines = ["<!--",
             "  Research carried over from the old project. It never appears on the site.",
             "  Stories about this subject go in src/content/stories/.",
             "-->", "", "## Research notes", ""]
    if fallback:
        lines += [fallback, ""]
    for n in sorted(narr.get(rec_id, []), key=lambda x: x.get("sort_order", 0)):
        body = as_text(pick(n, "body_markdown", "text", "content"))
        if body:
            title = n.get("title") or str(n.get("section_type", "Note")).replace("_", " ").capitalize()
            lines += [f"### {title}", "", body, ""]
    if chron.get(rec_id):
        lines += ["### Chronology", ""]
        for c in chron[rec_id]:
            when = as_text(pick(c, "start", "date", "date_or_range"))
            what = pick(c, "title", "event", "label")
            more = pick(c, "summary", "notes")
            lines.append(f"- **{when}**: {what}. {more}".rstrip(" ."))
        lines.append("")
    if evid.get(rec_id):
        lines += ["### Evidence claims", ""]
        for ev in evid[rec_id]:
            claim = as_text(pick(ev, "claim_summary", "statement", "claim", "fact_value"))
            if claim:
                lines.append(f"- {claim} ({ev.get('confidence', '?')} confidence)")
        lines.append("")
    if geo.get(rec_id):
        lines += ["### Places", ""]
        for g in geo[rec_id]:
            lines.append(f"- {pick(g, 'place', 'location_name')}: {pick(g, 'role', 'historical_context', 'timeframe')}")
        lines.append("")
    return "\n".join(lines)


def yaml_list(key, items):
    if not items:
        return f"{key}: []"
    return f"{key}:\n" + "\n".join(f"  - {q(i)}" for i in items)


def yaml_sources(items):
    if not items:
        return "sources: []"
    out = ["sources:"]
    for s in items:
        out.append(f"  - title: {q(s['title'])}")
        out.append(f"    url: {q(s['url'])}")
        if s.get("publisher"):
            out.append(f"    publisher: {q(s['publisher'])}")
    return "\n".join(out)


def yaml_image(img):
    if not img or not img.get("url"):
        return None
    out = ["image:", f"  src: {q(img['url'])}", f"  alt: {q(img.get('alt_text') or img.get('caption') or '')}"]
    for key, src_key in [("caption", "caption"), ("credit", "credit"), ("license", "license"), ("sourceUrl", "original_source_url")]:
        if img.get(src_key):
            out.append(f"  {key}: {q(img[src_key])}")
    return "\n".join(out)


def write(slug, front, body):
    path = OUT / f"{slug}.md"
    if path.exists() and not FORCE:
        return False
    path.write_text("---\n" + front + "\n---\n\n" + body + "\n", encoding="utf-8")
    return True


written = 0
for p in people:
    pid = p["person_id"]
    born, died = dates(p)
    prof = profile.get(pid, {})
    places = sorted({as_text(pick(g, "place", "location_name")) for g in geo.get(pid, [])} - {""})
    rel = [s for s in dict.fromkeys(related.get(pid, [])) if s != slug_of[pid]]
    front = "\n".join([
        f"id: {pid}",
        "kind: person",
        f"name: {q(p['canonical_name'])}",
        f"summary: {q(pick(prof, 'headline', 'dek') or p.get('notable_for') or '')}",
        f"born: {q(born)}",
        f"died: {q(died)}",
        f"year: {p.get('active_from') or p.get('birth_year') or 1857}",
        f"region: {q(p.get('region') or '')}",
        f"role: {q(p.get('primary_role') or '')}",
        yaml_list("places", places),
        yaml_list("related", rel),
        yaml_sources(sources_for(pid, p)),
        *([yaml_image(portraits.get(pid))] if yaml_image(portraits.get(pid)) else []),
    ])
    written += write(slug_of[pid], front, notes_block(pid, p.get("notable_for")))

for e in events:
    eid = e["event_id"]
    year = int(str(e.get("start_date") or "1857")[:4])
    rel = [s for s in dict.fromkeys(related.get(eid, [])) if s != slug_of[eid]]
    front = "\n".join([
        f"id: {eid}",
        "kind: event",
        f"name: {q(e['event_name'])}",
        f"summary: {q(e.get('description') or '')}",
        f"date: {q(e.get('start_date') or '')}",
        f"endDate: {q(e.get('end_date') or '')}",
        f"year: {year}",
        f"region: {q(e.get('region') or e.get('location') or '')}",
        yaml_list("places", [e["location"]] if e.get("location") else []),
        yaml_list("related", rel),
        yaml_sources(sources_for(eid, e)),
    ])
    written += write(slug_of[eid], front, notes_block(eid, e.get("description")))

print(f"Wrote {written} subject files to {OUT}")
