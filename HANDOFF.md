# HANDOFF.md: notes from the previous Claude session (updated 27 October 2026)

Read CLAUDE.md first (the rulebook), then this file. This file is working memory, not rules. If it
disagrees with CLAUDE.md, CLAUDE.md wins.

## Owner's workflow now (decided 27 October 2026)

Opencode does the research and puts the files in the repo. Claude writes every story from sources
Claude opens itself. The owner generates the paintings. Work one subject at a time, in the order below.
Do not start work the owner has not asked for: he has twice said "don't start working now".
Report once per subject, in plain words (what was added, left out, which paintings are needed).

## Branches (check with `git branch -a`)

- `main`: the published site. On 27 October `local-work` was merged into it (fast-forward), so the Anushilan Samiti,
  Servants of India Society, Swaraj Party and Home Rule League rewrites are on `main`. Keep working on `local-work`.
- `local-work`: current working branch, pushed to GitHub. Holds the Anushilan Samiti, Servants of India
  Society and Swaraj Party rewrites. Commit only `git add src` (plus .gitignore). Commit trailers:
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and the `Claude-Session:` line from the reminder.
- `origin/chatgpt-work`: 10 commits ahead of `main`, 0 behind, touches only `src/content/events/`.
  Holds 24 ChatGPT-written stories (Champaran, Kheda, Bardoli, Dandi March, 6 each, paintings placed) and
  research plus pictures only (NO stories) for Jallianwala Bagh (10 pictures) and Quit India (16 pictures).
  A normal merge into `local-work` is safe. Before merging, ask the owner about his 12 uncommitted edited
  Champaran/Kheda story files on his own computer.
- Others (`review-chatgpt`, `chatgpt-research`, `redesign`, `search-upgrade`, `subject-folders`,
  `dynamic-home`): untouched, ignore.

## Done in the 24-27 October rewrite (all passed `node scripts/check-stories.mjs`)

| Subject | Stories | Flagships | Notes |
|---|---|---|---|
| Anushilan Samiti | 6 | 2 | each source disagreement is in a "Two versions" note and in research/checked.md |
| Servants of India Society | 6 | 2 | research/checked.md NOT yet updated for the rewrite |
| Swaraj Party | 7 | 2 | checked.md updated 27 Oct; 4 stories need paintings |
| Home Rule League | 7 | 2 | rewritten 27 Oct from fresh sources; checked.md lists 9 disagreements; 4 stories need paintings |

CLAUDE.md progress table lists all four (added 27 October).

## Open work, in this order

1. ~~Home Rule League~~: done 27 October (7 stories, 2 flagships; old 7 deleted; captions fixed; flag drawing added).
2. ~~The 24 ChatGPT stories~~ (Champaran, Kheda, Bardoli, Dandi): done 27 October, all rewritten fresh.
3. ~~Jallianwala Bagh~~: done 27 October (6 stories, 2 flagships; prompts rewritten to match; Hunter report
   text, Hansard and Wikipedia opened; the Tribune article would not open, so nothing rests on it).
   **Quit India** is next: 6 stories (2 flagships) from `research/` plus pictures on `chatgpt-work`. Read the
   report, check every claim, look at every picture, redo the painting prompts to match the new stories.
4. Merge `chatgpt-work` into `local-work`, run `npm run check` and `npm run build`, update the CLAUDE.md
   table, merge to `main`, push, then tell the owner: "git pull, then npm run dev, then open
   http://localhost:4321".
5. Older items: a second flagship each for Rajguru and Velu Nachiyar; Chauri Chaura, Malabar and Partition of
   Bengal event pages have no stories; more depth for Nehru, Ambedkar, Azad.

`npm run check` and `npm run build` both pass again (27 October, 319 stories). Filter check output with
`node scripts/check-stories.mjs 2>&1 | grep <subject>`.

## Paintings waiting for the owner

17 for the rewritten subjects, in each subject's `illustrations/prompts.txt`: Home Rule League 4 (the-judge-who-wrote-to-america,
two-papers-from-madras, the-college-that-became-national, the-league-gets-a-new-name),
Swaraj Party 4 (the-mayor-of-calcutta, the-pact-that-congress-refused, the-passport-that-went-to-the-wrong-brother,
the-party-that-won-and-would-not-rule), Anushilan Samiti 5 (the-trial-that-watched-all-of-india,
a-newspaper-called-jugantar, the-night-a-bomb-fell-on-the-wrong-carriage, the-teacher-in-dhaka,
the-book-that-was-a-bomb), Servants of India Society 4 (books-that-travelled, the-engineer-who-became-bapa,
the-man-who-raised-the-money-himself, what-gokhale-asked-for-at-the-end). Older: the 53 prompts from 23 October.
When paintings arrive: put each in its subject's `illustrations/`, run `node scripts/place-illustrations.mjs`,
look at every image, tell the owner which to redo and why.

## Lessons from the rewrite (practical)

- Routine per subject: fetch Wikipedia plus one or two independent sources, list real disagreements, write
  each story from a short list of sourced facts, audit every sentence against the page, run the check,
  rewrite index.md (summary, dates, related, sources, angles), update research/checked.md, commit.
- Fetching with curl and the User-Agent `FreedomStoriesBot/1.0 (paripurna.dutta@gmail.com)` works for Wikipedia
  (use `?action=raw` or the page HTML), Banglapedia (`en.banglapedia.org/index.php/<Title>`, titles are exact:
  `Das,_Chitta_Ranjan`), GKToday, franpritchett.com, and mkgandhi.org (pictorial biography pages end `.htm`,
  for example `biography/reaction.htm`). Britannica is blocked. The Commons API is blocked, but File: pages and
  `Special:FilePath/<name>?width=500` work (960 only if the original is wider). Wait 2-3 seconds between calls.
- Use either the story's `image:` front matter (top of the story and card) or an inline `<figure class="plate">`,
  not both for the same picture.
- Source disagreements found are listed in each subject's research/checked.md. Do not state a figure that only
  appears on a page you could not open (for example the Gaya vote count).
- A flagship needs 900+ words not counting notes. Add sourced facts (dates, names, what happened next), never
  scenery. Average sentence under 15 words; quotes over 30 words must be split around the quote.
- `about:` slugs must exist (`ls src/content/*/`). Vithalbhai Patel, Tagore, Salimullah and others have no folder.

## Saving tokens (owner asked, 27 October 2026)

Start a fresh chat for each subject. Ask Opencode to leave a short facts sheet (about 1,500 words: dated facts,
source link for each, exact quotes, list of disagreements) in `research/`, and read that instead of whole pages;
still open the original for quotes, numbers and disputed claims. Keep the check output to one subject. Report
once at the end of a subject.

## Still waiting on the owner

Hosting location (accounts and quiz plan), list of future subjects (for the picture-library script), the real
domain for `astro.config.mjs` and `public/robots.txt` (still example.com), and the older optional items
(downloader licence parse; hide two Cursetjee prints on the Congress page).

---

# Older notes (23 October 2026)

The eight subjects finished on 22 and 23 October (Indian National Congress, HSRA with HRA, Indian National Army,
Ghadar Party, Khudai Khidmatgar, Revolt of 1857, Swadeshi Movement, Non-Cooperation and Khilafat) are done: do not redo them.

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

Indian National Congress now has a `media.json` built by hand from the owner's zip (22 pictures, `foundIn: "owner-zip"`, local files in its `archive/`). Do not run `fetch-media.mjs --refresh` on it: that would overwrite the local pictures. Unchecked in the captions: the roles of Kali Charan Banerjee, J. N. Ghoshal, Ranjit Pandit, Yogendra Vidyabhushan and the Cursetjees (the Cursetjee prints may not belong on a Congress page).

Library pass on 23 October 2026: `archive-library/indian-independence-movement/` (99 pictures from Commons) was sorted. About 20 were placed (gallery items with `foundIn: "owner-library"` in Ghadar Party, INA, Tilak, Bhagat Singh, Gandhi, Quit India, Independence of India, Khudiram Bose and Revolt of 1857; plates in the Ali brothers and Qissa Khwani stories). The rest stay in the library: relevant but no subject page yet, or modern, or licence doubts. Not placed on purpose: Kishan Singh's portrait (date and photographer unknown), Beato-era gore (blowing from guns), book scans (Bipin Chandra), the Constitution artwork (artist alive until 2007).

## Wishlist pictures placed (23 October 2026)
The owner sent wishlist-pictures.zip (198 pictures chosen from the 1,951-picture sub-category index). All were viewed.
- **Placed (gallery items, `foundIn: "owner-library"`, in each subject's `archive/` and `media.json`)**: 52 gallery entries across Revolt of 1857, Ghadar Party, HSRA, HRA, Kakori, Swadeshi (Bande Mataram 1907), Rowlatt, Civil Disobedience (Vedaranyam), Congress (1929 session), Nehru, Bose, Sukhdev, Bismil, Lahiri, Vohra. Pictures already in a gallery were skipped.
- **Not placed**: about 40 modern Aga Khan Palace photos and plaques; Gandhi film slides and the Harijan covers (licence not confirmed); hangings and battle scenes; colourised or watermarked portraits; tiny 1916 Ghadar trial portraits; people with no subject page yet (Chapekar brothers, Sarala Devi, Bhulabhai Desai, Kanailal Dutta, Suhasini Ganguly, Hari Kishan, Vanchi Iyer, Obaidullah Sindhi).
- `media.json` files touched were rewritten with `json.dump(indent=1)`, so the git diff is large but only the added items are new.
- Not yet used as story plates; a pass could add the best ones (Kakori group, Bande Mataram 1907, Ghadar handbills) inside stories.

## Paintings, Remaining5.1 batch (23 October 2026)
Placed 25 paintings plus home-hero (the home page now shows the painted hero). Still waiting: INA four-brigades-and-a-motto and the-exile-and-the-bakery (redo), and Khudai Khidmatgar the-vote-the-red-shirts-did-not-cast (redo: a sign reads "POLLING"; prompt tightened).
Noted but kept: babarra-12-august-1948 shows a red cloth and sandals on the road (aftermath, no body); the-days-the-city-burned shows the Gateway of India, which was not finished until 1924 (story is Nov 1921); gulab-kaur-and-the-bangles has a blank face; small plain pennants in a-grave-in-jalalabad and the-water-pitchers-of-takkar; the-doctor-from-utmanzai shows a red cross and a poster with a face.
