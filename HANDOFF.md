# HANDOFF.md: notes from the previous Claude session (23 October 2026)

Read CLAUDE.md first (the rulebook), then this file. This file is the working memory of the
session that wrote the eight subjects below. It is notes, not rules. If it disagrees with
CLAUDE.md, CLAUDE.md wins.

## State at handoff

Everything is committed and pushed to `main` (last commit: "Add Non-Cooperation and Khilafat...").
`npm run check` passes (293 stories) and `npm run build` passes.

Finished on 22 and 23 October 2026 (all with index.md, angles and painting prompts):

| Subject | Folder | Stories | Flagships |
|---|---|---|---|
| Indian National Congress | organisations/indian-national-congress | 7 | 4 |
| HSRA with HRA | organisations/hindustan-socialist-republican-association | 6 | 2 |
| Indian National Army | organisations/indian-national-army | 6 | 2 |
| Ghadar Party | organisations/ghadar-party | 6 | 3 |
| Khudai Khidmatgar | organisations/khudai-khidmatgar | 6 | 3 |
| Revolt of 1857 | events/revolt-of-1857 | 7 | 3 |
| Swadeshi Movement | events/swadeshi-movement | 6 | 2 |
| Non-Cooperation and Khilafat | events/non-cooperation-and-khilafat-movement | 6 | 3 |

Do not redo these. Paintings for them are NOT made yet: 53 prompts wait with the owner
(each subject's `illustrations/prompts.txt`; Pritilata 3 and the Home page 1 are older ones).

## Open work (suggested order)

1. A second flagship each for Shivaram Rajguru and Rani Velu Nachiyar (both have 6 stories, 1 flagship).
2. The event pages Chauri Chaura incident, Malabar (Moplah) and Partition of Bengal have no stories of their own.
   Related stories exist under bigger subjects: `the-fire-at-chauri-chaura` (Non-Cooperation folder),
   `a-line-drawn-through-bengal` (Swadeshi folder). Write fresh ones; do not move those.
3. More depth: Nehru, Ambedkar, Azad (see "Suggested next" in CLAUDE.md).
4. `astro.config.mjs` and `public/robots.txt` still use `example.com`. Ask the owner for the real domain.
5. Thin subjects in this batch worth deepening if better sources are found: Swadeshi (only 2 flagships,
   no Surat-split story; Bengal Chemicals/P. C. Ray sources do not mention Swadeshi), Khudai Khidmatgar
   short stories (Takkar rests on one Pashto book for its numbers).

## How the work went (practical lessons)

- Routine per subject: fetch 3-5 sources in parallel, note conflicts, write stories, run `npm run check`,
  fix, write index.md (summary, dates, related, sources, angles), generate prompts, build, add a row to the
  CLAUDE.md progress table, commit, push. One commit per subject.
- `npm run check` is strict on length. A flagship needs 900+ words not counting notes, so after fact-checking
  (which removes colour) most first drafts came in at 700-850. Add sourced facts (numbers, dates, names,
  what happened next). Never pad with unsourced scenery. If a sourced addition is not available, make the
  story a short one instead (this happened with Kotla and Kalaiyar Kovil).
- Sentences over 30 words fail the check. Split them.
- Fact-check every sentence against the fetched page before finishing. Common slips that had to be removed:
  invented weather or feelings, "poorly protected", "bitterly disappointed", guessed dates, definitions from
  memory (for example a rank's place in the army), and claims Wikipedia marks "citation needed".
- Do not begin paragraphs with a source's name. Put "Two versions" notes right after the scene they touch;
  sources may be named inside the notes.
- Gentle with deaths: Takkar, Babarra, Cawnpore, Chauri Chaura and the Bombay riots were all written
  with plain statements, no gore, and casualty counts shown as disputed where they are.
- Poems and song lyrics are not quoted (for example Zafar's epitaph verse).
- Story files live in the folder of the FIRST slug in `about:`. All `about:` slugs must already exist
  (`ls src/content/*/`). Tagore, Salimullah, Prafulla Ray, Shaukat Ali and Hodson have no folders, so they
  are not used as slugs.
- Painting prompts: helper script was a throwaway in the previous session's scratch folder. Copy the shape of
  any existing `illustrations/prompts.txt`: a header, "How to use this file", then numbered blocks with
  TITLE (flagship or short story), FILE NAME (the story slug), shape 16:6, the prompt, and the style block.
  Show people from behind or at a distance. No flag, no Ashoka Chakra, no readable text, no gore.

## Sources that worked, and ones that did not

Worked from the cloud workspace: Wikipedia (most pages), GKToday, Banglapedia, The Friday Times, The News
on Sunday, Dawn, Himal Southasian, The India Forum, Janata Weekly, Indian Culture (indianculture.gov.in),
The Daily Star (Bangladesh), the Swarthmore nonviolent-action database, History Skills, Purono Kolkata,
Leiden's ISIM article (Khudai Khidmatgar).

Failed or unusable: Britannica, Hindustan Times, Times of India, Indian Express, the Wikipedia page
"Queen's Proclamation" (URL not found), "National_Council_of_Education,_Bengal", "Shaukat Ali" (disambiguation:
use "Shaukat_Ali_(politician)"), the archive.org Tendulkar text beyond about 1924. WebFetch summaries
sometimes misreport; they usually flag what the page does NOT say. Treat those flags as "not confirmed" and
drop the claim.

## The owner

Paripurna. Not a programmer; uses Windows and PowerShell. Wants plain words and exact commands.
Wants to be told plainly what could not be checked and what was left out. Always end a push with:
"git pull, then npm run dev, then open http://localhost:4321".
He generates the paintings himself and sends them back (often a zip).

## Commit habit

One commit per subject, message like "Add <Subject>: N stories (M flagship), index and painting prompts",
pushed straight to `main`.


## Picture library (added 23 October 2026)

`scripts/fetch-category-library.mjs` downloads a whole Commons category into `archive-library/<name>/`
(`free/`, `check-licence/`, `index.json`, `links.txt`) with author, licence and File: link. Nothing in it is
published. The owner runs it on his own computer (fast); from the cloud workspace Wikimedia throttles it to
about one picture a minute. We pick from the library when writing stories, then copy the picture into the
subject's `archive/` folder and credit it in the story. Category: `Category:Indian_independence_movement` (110 files, 39 sub-categories).
