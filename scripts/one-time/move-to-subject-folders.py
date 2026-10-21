"""
One-time move (October 2026): from flat folders to one folder per subject.

Before:
  src/content/subjects/<slug>.md       src/content/media/<slug>.json
  src/content/stories/<story>.md       public/portraits/<slug>.webp
  public/media/<slug>/<file>.webp

After:
  src/content/<kind>/<slug>/index.md
  src/content/<kind>/<slug>/media.json
  src/content/<kind>/<slug>/portrait.webp
  src/content/<kind>/<slug>/archive/<file>.webp
  src/content/<kind>/<slug>/stories/<story>.md     (stories go with their main subject)

Pictures inside subject folders are served at /files/<kind>/<slug>/... (see astro.config.mjs).
Uses `git mv`, so history is kept. Already run; kept for the record.
"""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTENT = ROOT / "src" / "content"
KIND_DIR = {"person": "people", "event": "events", "place": "places", "organisation": "organisations"}


def git_mv(src: Path, dst: Path):
    dst.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "mv", str(src), str(dst)], cwd=ROOT, check=True)


folder = {}  # slug -> Path of the subject folder
for md in sorted((CONTENT / "subjects").glob("*.md")):
    kind = re.search(r"^kind: (\w+)", md.read_text(encoding="utf-8"), re.M).group(1)
    folder[md.stem] = CONTENT / KIND_DIR[kind] / md.stem
    git_mv(md, folder[md.stem] / "index.md")

for js in sorted((CONTENT / "media").glob("*.json")):
    if js.stem in folder:
        git_mv(js, folder[js.stem] / "media.json")

for story in sorted((CONTENT / "stories").glob("*.md")):
    main = re.search(r'^about:\n  - "?([^"\n]+)"?', story.read_text(encoding="utf-8"), re.M).group(1)
    git_mv(story, folder[main] / "stories" / story.name)

rewrites = {}  # old web path -> new web path
for img in sorted((ROOT / "public" / "portraits").glob("*")):
    if img.stem in folder:
        new = folder[img.stem] / f"portrait{img.suffix}"
        git_mv(img, new)
        rewrites[f"/portraits/{img.name}"] = "/files/" + new.relative_to(CONTENT).as_posix()

for sub in sorted((ROOT / "public" / "media").glob("*")):
    if sub.is_dir() and sub.name in folder:
        for img in sorted(sub.glob("*")):
            new = folder[sub.name] / "archive" / img.name
            git_mv(img, new)
            rewrites[f"/media/{sub.name}/{img.name}"] = "/files/" + new.relative_to(CONTENT).as_posix()

# Point every reference at the new places.
changed = 0
for f in list(CONTENT.rglob("*.md")) + list((ROOT / "src").rglob("*.astro")) + list((ROOT / "src").rglob("*.ts")):
    text = f.read_text(encoding="utf-8")
    new = text
    for old, path in rewrites.items():
        new = new.replace(f'"{old}"', f'"{path}"')
    if new != text:
        f.write_text(new, encoding="utf-8")
        changed += 1

print(f"Moved {len(folder)} subjects; rewrote picture paths in {changed} files.")
