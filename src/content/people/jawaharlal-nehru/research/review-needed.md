# Nehru — action list for Claude's editorial review

**22 October 2026 · This work is ChatGPT research only; no story is written or approved.**
**Files:** `chatgpt-report-2026-10-22.md`, `checked.md`, `pictures.md`, `illustrations/prompts.txt`, and an updated `index.md`. Proposed: **15 story angles, 8 FLAGSHIP / 7 SHORT; zero `story:` entries**. Claude must open source URLs again, write fresh child-friendly prose, and decide final lengths from evidence.

## Source-level caveats that must reach the stories
1. **Chronology of independence demand:** Madras Congress **1927**, Calcutta 1928, Lahore **December 1929**, countrywide pledge on **26 January 1930**, legal independence **15 August 1947**. The [PMO biography](https://www.pmindia.gov.in/en/former_pm/shri-jawaharlal-nehru/) unusually gives “Madras Congress 1926”. Read [Nehru's dated 1928 account](https://nehruarchive.in/documents/statement-on-the-independence-resolution-27-january-1928-e92wy) and annotate discrepancy.
2. **Anand Bhawan vs Swaraj Bhawan:** two distinct buildings. [Prayagraj district](https://prayagraj.nic.in/tourist-place/anand-bhawan/) uses the 1920s and 1930s broadly; [UP government page](https://www.nri.up.gov.in/article/en/swaraj-bhawan) dates gifting of the earlier house **1930**. Need historical property records for precise year.
3. **Nehru's 1928 letters and 1933 diary:** the early letters were between a father in Allahabad and daughter in Mussoorie, as the [actual first letter says](https://collections.paperlanterns.ink/nehru-father-daughter-letters/nehru-001-the-book-of-nature/). The [1933 diary](https://nehruarchive.in/documents/prison-diary-with-letters-1-jan-aug-30-1933-kw19q) refers to a **separate** 176-letter series. Some Selected Works editorial wording reverses the 1928 locations; check originals.
4. **Kamala:** research must give her own organising work fair space; no guessed speeches, prison episodes or deathbed conversations. Marriage and death are well dated by [JNMF](https://www.jnmf.in/chrono.html). Confirm any individual actions from Kamala-specific archival sources.
5. **Bose and Gandhi disagreements:** Nehru's printed letters/statements show **Nehru's position**, not each rival's. See [letter to Gandhi](https://nehruarchive.in/documents/to-mahatma-gandhi-11-january-1928-pg2zy), [Bose election statement](https://nehruarchive.in/documents/the-re-election-of-subhas-bose-22-february-1939-2vopje). Find Gandhi's and Bose's own responses before portraying both perspectives.
6. **Quit India wartime balance:** [Nehru's 1942 words](https://nehruarchive.in/documents/offer-of-cooperation-8-august-1942-op58n) offer cooperation from a free India; do not mislabel him as indifferent to Axis aggression or pretend all British wartime fears were fabricated.
7. **Discovery vs autobiography:** autobiography chiefly 1934–35, published 1936; Discovery written **April–September 1944**, published 1946. Fellow prisoners were present according to his own foreword; no false four-year solitary-writing story. [Discovery primary author preface reproduced here](https://perpustakaan.kemlu.go.id/index.php?id=1105&keywords=&p=show_detail).
8. **Partition:** highest-risk fairness issue. The [3 June](https://nehruarchive.in/documents/on-the-british-statement-of-3-june-1947-3-june-1947-7ye2v5) and [15 June](https://nehruarchive.in/documents/the-unavoidability-of-partition-15-june-1947-pgdewj) texts explain Nehru's choices, but **do not by themselves establish Gandhi's, Patel's, the Muslim League's or Jinnah's positions**. For a publication-ready account open independent voices on all sides and explain migration/deaths gently.
9. **1947 onwards** should remain a short coda, not a second biography after independence.

## Unverified quotes — do not place as dialogue in any finished story
**UNVERIFIED:** conversations between Nehru and childhood tutors, private statements to Motilal or Kamala without an original letter/diary, Kamala's last words, imaginary reply by Indira, Bose's words reported solely by Nehru, supposed prisoner conversations, and unsourced exchanges from 15 August 1947. The primary Nehru speech/letter excerpts are marked in the report; they are verified as website **transcriptions**, not checked against physical handwritten originals.

## Unavailable pages (never use as evidence unless opened independently)
- Nehru Portal site pages at `nehruportal.nic.in` (early life, houses, marriage, daughter letters, wartime imprisonment) timed out.
- Oxford Academic biography chapter `https://academic.oup.com/book/1958/chapter-abstract/141775769` redirected to an unavailable resource.
- Smithsonian Discovery catalogue `https://www.si.edu/object/discovery-india-jawaharlal-nehru%3Asiris_sil_17920` returned 404.
- Indian Express Church Road Congress premises article `https://indianexpress.com/article/opinion/columns/church-road-to-kotla-road-allahabad-to-delhi-a-125-year-journey-of-congresss-party-offices-9786226/lite/` gated the text.

## Media decisions and painting needs
- `pictures.md` records **10** Commons photos or archival files with per-file creator/date/licence and caution labels. All are **references only**, none downloaded. Their free-use claims should be rechecked immediately before actual site import.
- **7 symbolic image prompts** (slugs matching proposed angles) in `illustrations/prompts.txt`, 16:6, 2400×900, no flags, readable letters, violence or made-up human likeness.
- Real historic portraits/1942 rally/1947 assembly documents are preferred over generated substitutes. Treat modern photos of Anand Bhawan and Ahmednagar Fort as modern.
- No image binaries, `media.json` or existing paintings changed.

## Build validation status — IMPORTANT
- **`npm install`: NOT RUN.** A full private Git repository checkout was not accessible to the container through native Git; authenticated GitHub connector reads/writes were available instead.
- **`npm run check`: NOT RUN. `npm run build`: NOT RUN.** Neither may be described as passing. Claude or local/CI must run both and resolve any errors *before merging*.
- Checked in isolation: exactly 15 proposed angle entries, full dates, no `story:` lines; all added paths are within `src/content/people/jawaharlal-nehru/`. Did not edit site code, existing stories, other subjects or `main`.
- Check for future repository changes once again immediately before merge; main is independently updated by Claude.
