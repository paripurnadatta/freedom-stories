# Review before main

- Six stories: two flagships and four shorts. Review on chatgpt-work before merging.
- Specific incidents often rest on one participant account; the second source supplies context, not independent corroboration. The stories label this where needed.
- Six paintings are prompted but not generated. One credited archival photograph is supplied; it is not presented as a photograph of a different scene.
- No undocumented dialogue is quoted. Future research angles remain private and unwritten.
- Validation on 25 October 2026: npm run check passed for all 317 published stories and 1,141 subjects. npm run build passed, including Pagefind. The 24 new story routes, four event hubs, source links and local image references were checked in the output. Research files and the supplied PDF are absent from the public build.

## 27 October 2026: fact sheet added

- `research/fact-sheet.md` is the writing brief for this subject from now on. It is built only from
  sources opened on 27 October 2026: the four march speeches and two letters on
  gandhiashramsevagram.org, the Irwin letter in CWMG XLIII, and the mkgandhi.org chronology. Every
  quotation carries a source key. Where it differs from `chatgpt-report-2026-10-25.md`, the fact
  sheet is the corrected version.
- The old report said "no exact clock time is asserted". The sources do give times: the march
  started at 6.30 a.m. on 12 March, and the salt law was broken at 8.30 a.m. on 6 April 1930.
- Two things to leave out, and the sheet says why: the "five million people at 5,000 meetings"
  figure (single source, not credible) and Bareja's sentence about Bhangis (ugly, not needed).
- The six stories in `stories/` were written before the fact sheet existed. Rewrite them from the
  sheet; do not treat the old story text as a source.
- `npm run check` fails on two Champaran flagship stories (808 and 795 words, minimum 900), not on
  anything in this subject. It failed before this fact sheet was added. Left alone, because stories
  are yours to write. `astro build` and Pagefind pass (589 pages, 472 indexed).
