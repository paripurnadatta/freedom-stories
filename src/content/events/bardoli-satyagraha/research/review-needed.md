# Review before main

- Six stories: two flagships and four shorts. Review on chatgpt-work before merging.
- Specific incidents often rest on one participant account; the second source supplies context, not independent corroboration. The stories label this where needed.
- Six paintings are prompted but not generated. One credited archival photograph is supplied; it is not presented as a photograph of a different scene.
- No undocumented dialogue is quoted. Future research angles remain private and unwritten.
- Validation on 25 October 2026: npm run check passed for all 317 published stories and 1,141 subjects. npm run build passed, including Pagefind. The 24 new story routes, four event hubs, source links and local image references were checked in the output. Research files and the supplied PDF are absent from the public build.

## 27 October 2026: fact sheet added

- `research/fact-sheet.md` is the writing brief for this subject from now on. It is built from the
  full text of Mahadev Desai's *The Story of Bardoli* (1929), opened on 27 October 2026, and every
  quotation carries a page reference. Where it differs from `chatgpt-report-2026-10-25.md`, the
  fact sheet is the corrected version.
- The old report had no dates. The sheet has them: 4 February, 6 February, 12 February, 15 February,
  3–4 August and 6 August 1928.
- One correction to the record: the peasants paid the **old** assessment; the year's revenue was not
  cancelled. Wikipedia says otherwise and the sheet flags it as a "Two versions" point.
- The six stories in `stories/` were written before the fact sheet existed. Rewrite them from the
  sheet; do not treat the old story text as a source.
- `npm run check` fails on two Champaran flagship stories (808 and 795 words, minimum 900), not on
  anything in this subject. It failed before this fact sheet was added. Left alone, because stories
  are yours to write. `astro build` and Pagefind pass (589 pages, 472 indexed).
