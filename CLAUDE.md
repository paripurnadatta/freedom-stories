# CLAUDE.md: how we work on The Struggle for Freedom

Read this first in every session, then HANDOFF.md (notes and open work from the previous session). It is the project's rulebook. The details live in
README.md (site and folders), ILLUSTRATIONS.md (paintings) and RESEARCH_BRIEF.md
(research from other AIs). If this file and those disagree, this file wins.

## What this site is

A **story site** about India's freedom struggle (1757–1947) for **Class 5 readers**
(about 10 years old). It is not a research database. Every person or event can have
many stories: long **flagship** stories and **short** ones. There is no limit on either.
If a subject has five big stories worth 900+ sourced words each, write five flagships.
The only limit is the sources: never stretch thin material to reach flagship length.

**Minimum standard for every subject (owner's rule, 22 October 2026):** at least **6 stories,
2 of them flagships**, from the very beginning. One story per subject is not enough. We deepen
later, but we do not start thinner than this. If the sources cannot support 6 stories with
2 flagships, do not publish thin ones: leave the subject unpublished and list it for the owner
with what is missing.

The owner (Paripurna) generates the paintings and sometimes sends research from other
AIs. He is not a programmer: explain things in plain words, and give exact commands
when he has to run something on his own computer (Windows, PowerShell).

## Working with the owner

- **Discuss before changing the design or the way the site works.** Show the plan or a
  preview first. He has said "don't start changing anything, first discuss it".
- Writing stories, fixing facts and placing pictures do not need permission.
- Tell him plainly what could not be checked and what was left out.
- After pushing, remind him: `git pull` then `npm run dev` to see it at http://localhost:4321.

## Tell it as a story, not as research notes (owner's rule, 22 October 2026)

Stories must read like a story, not like a report on sources. The owner said so after seeing
pages that went "Britannica says... Wikipedia says... Encyclopedia.com says...".

- Tell events in order, with people doing things in places. Use the sourced details as the scenes.
- Do **not** begin paragraphs with a source's name. Name a source in the text only when it is a
  person's own account ("Kalpana Dutt remembered...", "The court record says...") or a legend
  that must be labelled. Everything else is credited in the Sources tab.
- Disagreements go in **margin notes placed between paragraphs**
  (`<aside class="note"><b>Two versions</b>: ...</aside>`), right after the scene they touch.
  The main text follows one clear line and the note shows the other version. Sources may be named inside notes.
- Avoid "our sources do not say", "we cannot tell", "we have not seen". Say what happened. Put what is unknown
  in one short note or one quiet closing paragraph.
- A subject whose sources only give disputed facts can have one short "mystery" story that opens with the question.
  It is the exception, not the pattern.
- The check script cannot tell a story from a report. Read your draft once as a ten-year-old: is someone doing something?

## The rules for every story

1. **Every fact must come from a source you opened in this session.** Never from memory
   alone. At least 2 sources per story (the check script enforces it). Prefer Wikipedia
   plus a second, independent source (books on nbtindia.gov.in, mkgandhi.org, government
   sites, archives, newspapers).
2. **When sources disagree, say so in the story** with a margin note
   (`<aside class="note"><b>Two versions</b>: ...</aside>`). Never silently pick one.
3. **Legends and later memories are labelled** ("One biography says...", "Gandhi told
   this story himself..."). No invented dialogue, thoughts or details. If you catch
   yourself adding colour (weather, feelings, crowds) that no source gives, cut it.
4. **Class 5 style**: short sentences (average under 15 words, none over 30), simple
   words, explain hard words in a note (`<aside class="note"><b>Word</b>: meaning</aside>`),
   start with a scene or a question, end with "Why it matters" or a quiet closing line.
5. **Gentle with violence and death.** State what happened, no gore, no glory in killing.
   Robberies and deaths are described without praise.
6. **Fair on politics.** When people disagreed (Gandhi and Ambedkar, Gandhi and the
   revolutionaries, Netaji and the Axis powers), give both sides.
7. **No AI-sounding phrases** (the check script bans some: "testament to", "pivotal",
   "delve", "rich tapestry"...). Write like a good children's author.
8. Lengths: flagship 900+ words, short 350+ (figures and notes don't count).

## Who writes what

**Claude writes every story.** Other AI tools (ChatGPT etc.) may only research (see AGENTS.md).
Owner's rule, 22 October 2026: their stories read like research notes, so any story that
comes from their research must be written fresh by Claude, from sources Claude opens itself.
Do not just edit their drafts.

## Making stories for a subject (the routine)

1. **Research.** Read the subject's folder: `src/content/<people|events|places|organisations>/<slug>/`
   (index.md, media.json, any `research/` reports). Search and open sources. List 5–15
   angles. If the owner sent a report from another AI, file it in `research/`, check
   every claim against its source, and write `research/checked.md` (what held up, what
   could not be checked, what was left out).
2. **Write** each story as `stories/<story-slug>.md` in the subject's folder. Copy the
   frontmatter shape from an existing story (e.g.
   `src/content/people/chandrashekhar-azad/stories/the-pistol-in-the-museum.md`).
   `about:` lists the main subject first, then other subjects that appear (use existing
   slugs; check with `ls src/content/*/`). `published:` is today's date.
3. **Pictures from the archive** (real photos and documents): only free licences
   (public domain, CC0, CC BY, CC BY-SA, and, as an exception decided by the owner on
   22 October 2026, Government of India stamps and works under GODL-India) from Wikimedia
   Commons. Download them into
   `archive/` as `.webp` with sharp (see "Wikimedia" below), then use them as the story's
   `image:` or as `<figure class="plate">` inside the story, always with credit, licence
   and a "Where this picture comes from" link.
4. **Painting prompts** for stories with no good real picture: add them to
   `illustrations/prompts.txt` in the house format (copy an existing prompts.txt). Never
   invent a face for someone with no known photo; flags are allowed now (owner, 27 Oct 2026); no readable
   text; no gore. Send the file to the owner.
   The site labels every painting as AI-generated automatically (badge on the picture
   and a caption). Never remove that label.
5. **Update `index.md`**: summary, full dates, `related:`, `sources:`, and `angles:` (each
   written story gets `story: "<slug>"`; unwritten ones are "coming soon" on the site).
6. **Check and build**: `npm run check` then `npm run build`. Both must pass.
7. **Commit and push to `main`.** Then tell the owner what was added, what was left out,
   and which paintings are needed.

## Paintings from the owner

He sends images (often a zip) named with the FILE NAMEs from prompts.txt. Put each in
its subject's `illustrations/` folder and run `node scripts/place-illustrations.mjs`.
Look at every image before publishing: check it matches the story (right people, right
age, right number of children...), and has no readable text or violence (flags are fine). Tell him
which ones should be redone and why.

## Media galleries (Wikimedia)

- `node scripts/fetch-media.mjs <slug>` collects a subject's gallery into `media.json`
  (walks the Commons category tree). Use `--refresh` to redo one. Long runs: set
  `MEDIA_OUT=<scratch folder>` and copy the results in afterwards, keeping `hidden` and
  `originals`.
- In `media.json`, add file names to `hidden` to hide junk, and to `originals` when an
  old photo is wrongly on the "How India remembers" shelf (Commons often dates old
  photos by their upload day).
- Wikimedia refuses hotlinks to `upload.wikimedia.org` originals (HTTP 429). The site
  uses `thumb.wikimedia.org` copies (see `thumbOf` in `src/lib/site.ts`). For pictures
  used in stories, always download a local `.webp` copy instead.
- Go slowly with Wikimedia: POST requests, a pause between calls, the project's
  User-Agent (see scripts). Retry 429s with growing waits.

## Things learned the hard way

- Some news sites are blocked from this environment (Hindustan Times, Times of India,
  Indian Express, sometimes The Wire). Don't build a story on a source you could not
  open; tell the owner, and ask for a PDF of the article if it matters.
- The other AIs' reports are usually good, but check every quote. Never copy their
  sentences into stories.
- Use "HRA" for the group before September 1928 and "HSRA" after.
- Large WebFetch pages sometimes return only metadata; try another source.
- From the cloud workspace the Wikimedia **API** is often refused (HTTP 429), so `fetch-media.mjs`
  can fail. The ordinary web pages still open: a category page (`/wiki/Category:...`) lists files and
  subcategories, and each `File:` page shows licence, author, date and size. Read those instead,
  slowly (one page every 2 seconds or more).
- `thumb.wikimedia.org` only serves its standard widths (250, 330, 500, 960, 1280). A new width gets
  HTTP 429 or 400. Ask for 960 first, then 500. Small originals (under about 800 px) end up at 500 px.
- `fetch-media.mjs` once matched Tilak by name search and missed his whole category. Check
  `matchedBy` and `commonsCategory` in `media.json` after a run; fix the category if it is wrong.
- A gallery can hold the same file twice, once with underscores and once with spaces. Compare names
  with underscores turned into spaces.
- Commons dates many old photos by their upload day. After a fetch, look for `original` items with a
  modern date (campus photos, statues) and move them to `later`; add old photos to `originals`.
- `scripts/check-stories.mjs` is the one quality gate. If it complains about length,
  add **sourced** detail, never filler.

## Where things are

- Stories, facts, pictures: `src/content/<kind>/<slug>/` (index.md, stories/, archive/,
  illustrations/, media.json, research/ which is private and never published).
- Site code: `src/lib/site.ts` (data), `src/components/`, `src/pages/`, `src/styles/global.css`.
- Scripts: `scripts/` (check-stories, fetch-media, fetch-portraits, place-illustrations).

## Progress so far (update this list when you finish a subject)

| Subject | Stories | Paintings |
|---|---|---|
| Bhagat Singh | 16 | done |
| Chandrashekhar Azad | 9 | done |
| Subhas Chandra Bose | 13 | done |
| Mahatma Gandhi | 19 | done |
| Ashfaqulla Khan | 6 (2 flagship) | done |
| Batukeshwar Dutt | 6 (2 flagship) | done |
| Ram Prasad Bismil | 6 (2 flagship) | done |
| Sukhdev Thapar | 6 (2 flagship) | done |
| Kakori train action (event) | 6 (2 flagship) | done |
| Kamala Nehru | 6 (2 flagship) | done |
| B. R. Ambedkar | 14 (4 flagship, 10 short) | done |
| Jawaharlal Nehru | 13 (5 flagship, 8 short) | done |
| Rani Lakshmibai | 7 (2 flagship) | done |
| Bal Gangadhar Tilak | 9 (2 flagship) | done |
| Lala Lajpat Rai | 7 (2 flagship) | done |
| Sarojini Naidu | 7 (2 flagship) | done |
| Shivaram Rajguru | 6 (1 flagship; needs one more) | done |
| Durga Bhabhi | 6 (2 flagship) | done |
| Rajendra Lahiri | 6 (2 flagship) | done |
| Roshan Singh | 6 (2 flagship) | done |
| Surya Sen | 7 (2 flagship) | done |
| Maulana Abul Kalam Azad | 7 (3 flagship) | done |
| Sardar Vallabhbhai Patel | 7 (2 flagship) | done |
| Birsa Munda | 7 (3 flagship) | done |
| Khan Abdul Ghaffar Khan | 7 (3 flagship) | done |
| Rani Velu Nachiyar | 6 (1 flagship; needs one more) | done |
| Dadabhai Naoroji | 7 (2 flagship) | done |
| Subramania Bharati | 7 (2 flagship) | done |
| Udham Singh | 8 (2 flagship) | done |
| Pritilata Waddedar | 6 (2 flagship) | done |
| Indian National Congress (organisation) | 7 (4 flagship) | done |
| HSRA with HRA (organisation) | 6 (2 flagship) | done |
| Indian National Army (organisation) | 6 (2 flagship) | done (owner accepted the chakra flag and the Japanese sign, 23 Oct 2026) |
| Ghadar Party (organisation) | 6 (3 flagship) | done |
| Khudai Khidmatgar (organisation) | 6 (3 flagship) | done (the vote painting keeps a readable "POLLING" sign; owner said fine, 23 Oct 2026) |
| Revolt of 1857 (event) | 7 (3 flagship) | done |
| Swadeshi Movement (event) | 6 (2 flagship) | done |
| Non-Cooperation and Khilafat (event) | 6 (3 flagship) | done |
| Anushilan Samiti (organisation) | 6 (2 flagship) | done (27 Oct; "The book that was a bomb" redone without lettering) |
| Servants of India Society (organisation) | 6 (2 flagship) | done |
| Swaraj Party (organisation) | 7 (2 flagship) | done |
| Home Rule League (organisation) | 7 (2 flagship) | done (27 Oct; "new name" painting redone, lanterns only) |
| Champaran Satyagraha (event) | 6 (2 flagship) | done (rewritten 27 Oct; the "order to leave" painting shows the handing-over at the wrong place, to be checked) |
| Kheda Satyagraha (event) | 6 (2 flagship) | done (rewritten 27 Oct) |
| Bardoli Satyagraha (event) | 6 (2 flagship) | done (rewritten 27 Oct) |
| Dandi March / Salt Satyagraha (event) | 6 (2 flagship) | done (rewritten 27 Oct; check lamp and final paintings against new texts) |
| Jallianwala Bagh massacre (event) | 6 (2 flagship) | done (27 Oct; the "grave error" painting shows a British Union Jack, owner approved) |
| Quit India Movement (event) | 6 (2 flagship) | done (27 Oct; the flag in "Nine August" and "Two Flags" is the 1947 tricolour with the Ashoka Chakra, not the 1942 one with the spinning wheel; owner said keep) |
| Chauri Chaura incident (event) | 6 (2 flagship) | prompts ready, 6 paintings waiting (27 Oct; Opencode researched, Claude wrote) |

Suggested next: more Nehru (two houses, Kamala, Brussels and Moscow, prison letters: sources not yet opened), more Ambedkar (Kalaram temple, Daulatabad, his own account of the Poona fast), Ashfaqulla (needs outside research); more Azad (Dharasana, the sealed pages, his Urdu books: sources not yet opened); a second flagship each for Rajguru and Velu Nachiyar; stories for the Malabar and Partition of Bengal event pages, which have none yet; decide what to do with the older Wikipedia-only story `the-fire-at-chauri-chaura` (overlaps the new six); more flagships for the organisations and events added on 22 and 23 October 2026 if sources allow.
