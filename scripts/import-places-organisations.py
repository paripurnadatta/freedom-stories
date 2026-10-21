"""
One-time import of the old project's 167 places and 47 organisations as subjects,
and the links between them and the people and events already here.

Usage:
  python3 scripts/import-places-organisations.py /path/to/freedom-fighter-timeline

Existing subject files are never overwritten; links are only added, never removed.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

OLD = Path(sys.argv[1] if len(sys.argv) > 1 else "../freedom-fighter-timeline")
SUBJECTS = Path(__file__).resolve().parent.parent / "src" / "content" / "subjects"


def fix(s):
    if isinstance(s, str) and any(m in s for m in ("â", "Ã", "Â")):
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


def slugify(name):
    s = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower() or "untitled"


q = lambda s: json.dumps("" if s is None else str(s), ensure_ascii=False)

tables = deep_fix(json.load(open(OLD / "Indian_Freedom_Struggle_Timeline_Production_748.json", encoding="utf-8")))["tables"]

# Map old ids to the slugs already used here.
slug_of = {}
for f in SUBJECTS.glob("*.md"):
    m = re.search(r"^id: (\S+)", f.read_text(encoding="utf-8"), re.M)
    if m:
        slug_of[m.group(1)] = f.stem
used = set(slug_of.values())


def new_slug(name, suffix):
    s = slugify(name)
    if s in used:
        s = f"{s}-{suffix}"
    used.add(s)
    return s


for p in tables["Places"]:
    slug_of[p["place_id"]] = new_slug(p["canonical_name"], "place")
for o in tables["Organizations"]:
    slug_of[o["organization_id"]] = new_slug(o["canonical_name"], "organisation")

links = {}
def link(a, b):
    if a in slug_of and b in slug_of:
        links.setdefault(a, []).append(slug_of[b])
        links.setdefault(b, []).append(slug_of[a])

for r in tables["Person_Organization"]:
    link(r["person_id"], r["organization_id"])
for r in tables["Person_Place"]:
    link(r["person_id"], r["place_id"])
for e in tables["Events"]:
    if e.get("place_id"):
        link(e["event_id"], e["place_id"])

sources = {s["source_id"]: s for s in tables["Sources"]}


def source_block(rec):
    out, seen = [], set()
    for sid in rec.get("source_ids") or []:
        s = sources.get(sid)
        if s and s.get("url") and s["url"] not in seen:
            seen.add(s["url"])
            out.append(s)
    if rec.get("primary_source_url") and rec["primary_source_url"] not in seen:
        out.append({"title": rec["primary_source_url"], "url": rec["primary_source_url"]})
    if not out:
        return "sources: []"
    lines = ["sources:"]
    for s in out:
        lines += [f"  - title: {q(s.get('title') or s['url'])}", f"    url: {q(s['url'])}"]
        if s.get("publisher"):
            lines.append(f"    publisher: {q(s['publisher'])}")
    return "\n".join(lines)


def related_block(rec_id):
    rel = list(dict.fromkeys(links.get(rec_id, [])))
    return "related: []" if not rel else "related:\n" + "\n".join(f"  - {q(r)}" for r in rel)


NOTE = "<!--\n  Imported from the old project. Research notes go below; they never appear on the site.\n-->\n"
created = 0

for p in tables["Places"]:
    path = SUBJECTS / f"{slug_of[p['place_id']]}.md"
    if path.exists():
        continue
    front = "\n".join([
        f"id: {p['place_id']}", "kind: place",
        f"name: {q(p['canonical_name'])}",
        f"summary: {q('')}",
        "year: 1857",
        f"region: {q(p.get('modern_state_country') or p.get('historical_region') or '')}",
        f"placeType: {q(p.get('place_type') or '')}",
        related_block(p["place_id"]), source_block(p),
    ])
    path.write_text(f"---\n{front}\n---\n\n{NOTE}", encoding="utf-8")
    created += 1

for o in tables["Organizations"]:
    path = SUBJECTS / f"{slug_of[o['organization_id']]}.md"
    if path.exists():
        continue
    front = "\n".join([
        f"id: {o['organization_id']}", "kind: organisation",
        f"name: {q(o['canonical_name'])}",
        f"summary: {q(o.get('description') or '')}",
        f"year: {o.get('founded_year') or 1900}",
        f"region: {q(o.get('region') or '')}",
        f"founded: {q(o.get('founded_year') or '')}",
        f"ended: {q(o.get('dissolved_year') or '')}",
        f"aliases: {q(o.get('aliases') or '')}",
        related_block(o["organization_id"]), source_block(o),
    ])
    path.write_text(f"---\n{front}\n---\n\n{NOTE}", encoding="utf-8")
    created += 1

# Add the new links to existing people and events.
updated = 0
for old_id, new_links in links.items():
    if old_id not in slug_of:
        continue
    path = SUBJECTS / f"{slug_of[old_id]}.md"
    raw = path.read_text(encoding="utf-8")
    front, body = raw.split("\n---\n", 1)
    m = re.search(r"^related:(?: \[\])?\n?((?:  - .*\n?)*)", front + "\n", re.M)
    current = re.findall(r'^  - "?([^"\n]+)"?', m.group(1), re.M) if m else []
    add = [s for s in dict.fromkeys(new_links) if s not in current]
    if not add or not m:
        continue
    merged = current + add
    block = "related:\n" + "\n".join(f"  - {q(s)}" for s in merged) + "\n"
    front = (front + "\n")[: m.start()] + block + (front + "\n")[m.end():]
    path.write_text(front.rstrip("\n") + "\n---\n" + body, encoding="utf-8")
    updated += 1

print(f"Created {created} place and organisation files; added links to {updated} existing subjects.")
