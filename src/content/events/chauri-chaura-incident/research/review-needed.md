# Review before main — Chauri Chaura

For Claude. Everything here is research; no stories are written.

## What is ready

- `research/chatgpt-report-2026-10-27.md` — 12 angles, each with source keys, quotations and page
  numbers, plus a list of what the sources cannot support.
- `research/fact-sheet.md` — the writing brief. Six stories: two flagship, four short. Every fact
  carries a source key. "Watch" notes under each story, and a "Do not say" list at the end.
- `research/checked.md` — what held up, what did not, which sites would not open.
- `archive/` — two free-licence pictures, credited in `research/image-credits.md`.
- `illustrations/prompts.txt` — six painting prompts.
- `index.md` — corrected date, fuller summary, related subjects, sources, six angles without
  `story:` links.

## The six recommended stories

| Slug | Size | What it is |
|---|---|---|
| `chauri-chaura-the-beating-at-mundera-bazaar` | SHORT | 1 February, the picketing and the beating of three men |
| `chauri-chaura-the-morning-at-dumri-khurd` | FLAGSHIP | the village, the meetings, the march, who these people were |
| `chauri-chaura-the-thana-on-fire` | SHORT | 4 February afternoon, told gently |
| `chauri-chaura-the-crime-of-gorakhpur` | FLAGSHIP | Gandhi's articles, the Bardoli resolutions, the fast |
| `chauri-chaura-one-hundred-and-seventy` | SHORT | the trial, Malaviya's appeal, the 19 hangings |
| `chauri-chaura-two-memorials` | SHORT | the police memorial, the Shaheed Smarak, the pensions, the centenary |

Four more angles are in the report as reserves: `twenty-three-names`, `almost-everyone-disagreed`,
`the-word-they-used`, `the-case-named-after-abdullah`. `almost-everyone-disagreed` is strong (Nehru
in jail) and can be swapped in for `two-memorials` if you prefer the political argument to the
remembrance story.

## Things I am unsure about

1. **Numbers.** Every count of the crowd, the accused and the policemen has two or more versions.
   The fact sheet gives the ranges and tells the writer to say the counts disagree. Please keep that;
   a single confident number would be wrong.
2. **The dead policemen's number.** 22 died in the fire and one chowkidar died the next day, per The
   Week. Britannica and the district page say 23; Gandhi's first article says 21; Kushwaha says 24.
   The safest sentence is "twenty-two policemen and watchmen died in the fire, and one more died of
   his injuries the next day".
3. **The Chief Justice's compliment** to Malaviya is a memorial biography's memory. It is UNVERIFIED
   as a court record. If a story uses it, paraphrase and attribute; do not quote.
4. **Bose's "national calamity"** is Britannica's quotation, not checked in *The Indian Struggle*.
   Do not use it in quotation marks.
5. **The Sessions Judge's name**, H. E. Holmes, is Wikipedia only. Omit the name or attribute it.
6. **The 1973 minaret's measurements** are Wikipedia citing a Times of India report I could not open.
   Say "a tall minaret" or attribute the figure.
7. **Kushwaha's caste figures** (90 per cent of the accused; 17 of 19 hanged without surnames) are one
   author, reported by a reviewer. Label them if used.
8. **The meeting place at Dumri Khurd** is either a threshing ground or an orchard in the cemetery.
   Both are in the sheet; please keep both and do not choose.
9. **Bhagat Singh and Azad** turning away from Gandhi is single-source. Left out.
10. **Devdas in Gorakhpur** is thin — three short passages in CWMG. Not recommended as a story.

## Sources I could not open

- **pib.gov.in** — both centenary releases returned HTTP 403. Used The Week's report of the same
  speech instead. Nothing rests on PIB.
- **Times of India, Hindustan Times, Indian Express** — not opened, not built on.
- **Shahid Amin, *Event, Metaphor, Memory*** — archive.org copy is lending-only (HTTP 401). Used his
  open essay "Gandhi as Mahatma" and Amin quotations in The Week and The Hindu.
- **The Hindu 2024** — partly behind a subscription wall; the passages used were readable.

## Pictures

- `archive/chauri-chaura-shaheed-smarak.webp` — the Shaheed Smarak, CC BY-SA 3.0, Nitishkumarojha.
- `archive/madan-mohan-malaviya.webp` — Malaviya portrait, public domain, Banaras Hindu University.
- Rejected: the Chauri Chaura railway station sign (readable text, poor quality) and the 1922 Gandhi
  print (an artist's rendering with Hindi text on it).
- There is **no free photograph of the burned thana** and none of the 1922 crowd. The paintings have
  to carry those scenes.

## Paintings needed

Six prompts in `illustrations/prompts.txt`, one per story. All are 16:7.5, 2400 × 1125. Two show a
1922 Congress tricolour with the spinning wheel (the march, and the memorial); the rest have no
flag. No readable text, no gore, no invented faces for the documented dead.

## Validation

Run on 27 October 2026 after the files were written.

- `npm run check` passed: "All 355 published stories pass. 1141 subjects, 27 planned stories
  waiting, 6 illustrations waiting." The 6 waiting illustrations are this subject's prompts; the
  planned stories are the six angles in `index.md`, which have no `story:` links yet because they
  are not written.
- `npm run build` passed: 651 pages built, Pagefind indexed 544 pages. The two archive pictures and
  all subject routes are in the output.
- No story file was written or changed. `stories/` does not exist yet for this subject.
