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

Disputed or family-told details stay in the story, but say so in the text.

## The quality check

`scripts/check-stories.mjs` is the only check. For every published story it confirms: a title and subtitle, at least two web sources, related links that point to real stories, sensible dates, no leftover research notes or placeholders, a reasonable length, and none of the hollow phrases on its banned list.

## Where things came from

`scripts/import-old-roster.py` did the one-time import from the old `freedom-fighter-timeline` repo. It isn't needed again.
