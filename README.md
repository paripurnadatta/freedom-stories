# Freedom Stories

Stories of India's freedom struggle, 1757 to 1947.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # runs the quality check, then builds the site into dist/
```

## How it works

Every person or event is one file in `src/content/stories/`.

- The block between the `---` lines at the top holds the facts: name, dates, region, places, related stories, sources.
- Everything below it is the story.
- `status: draft` keeps a file off the site. Change it to `status: published` when the story is ready.

All 926 people and events from the old project are already here as drafts. Each draft holds the research notes carried over from the old project, ready to be turned into a story.

## Writing a story

1. Open the draft, e.g. `src/content/stories/sukhdev-thapar.md`.
2. Research, then replace the research notes with the story.
3. Give it a title and a one-line subtitle, check the sources (at least two), and set `status: published`.
4. Run `npm run check`. It tells you in plain words if anything is missing.

### How a story should sound

Write for a Class 5 student, and make them want to keep reading.

- Open with a scene, not a birth date. Put the reader somewhere: a room, a morning, a moment.
- Short sentences (the check keeps the average under 15 words). Plain words.
- Explain every hard word the first time it appears ("lathis, long sticks").
- Ask the questions a curious child would ask, then answer them as the story unfolds.
- Every fact must come from the sources. Disputed or family-told details can stay, but the story says so.

### Optional extras in the facts block

- `image:` a portrait (`src`, `alt`, `caption`, `credit`, `license`, `sourceUrl`). 272 drafts already have one from the old project.
- `quote:` a short line in the person's own words (`text`, `by`), shown in the header and the side panel.

## The quality check

`scripts/check-stories.mjs` is the only check. For every published story it confirms: a title and subtitle, at least two web sources, related links that point to real stories, sensible dates, no leftover research notes or placeholders, a reasonable length, and none of the hollow phrases on its banned list.

## Where things came from

`scripts/import-old-roster.py` did the one-time import from the old `freedom-fighter-timeline` repo. It isn't needed again.
