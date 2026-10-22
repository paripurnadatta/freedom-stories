# CLAUDE.md: how we work on The Struggle for Freedom

Read this first in every session. It is the project's rulebook. The details live in
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
   invent a face for someone with no known photo; no flag or Ashoka Chakra; no readable
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
age, right number of children...), and has no flag, readable text or violence. Tell him
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
| Bhagat Singh | 16 | 1 prompt waiting |
| Chandrashekhar Azad | 9 | done |
| Subhas Chandra Bose | 13 | done |
| Mahatma Gandhi | 19 | done |
| Ashfaqulla Khan | 6 (2 flagship) | 2 prompts waiting |
| Batukeshwar Dutt | 6 (2 flagship) | done |
| Ram Prasad Bismil | 6 (2 flagship) | 1 prompt waiting |
| Sukhdev Thapar | 6 (2 flagship) | done |
| Kakori train action (event) | 6 (2 flagship) | 4 prompts waiting |
| Kamala Nehru | 6 (2 flagship) | 5 prompts waiting |
| B. R. Ambedkar | 14 (4 flagship, 10 short) | 12 prompts waiting |
| Jawaharlal Nehru | 13 (5 flagship, 8 short) | 12 prompts waiting |
| Rani Lakshmibai | 7 (2 flagship) | no prompts yet |
| Shivaram Rajguru | 6 (2 flagship) | 2 prompts waiting |
| Durga Bhabhi | 6 (2 flagship) | 5 prompts waiting |
| Rajendra Lahiri | 6 (2 flagship) | 4 prompts waiting |
| Roshan Singh | 6 (2 flagship) | 4 prompts waiting |

Suggested next: more Nehru (two houses, Kamala, Brussels and Moscow, prison letters: sources not yet opened), more Ambedkar (Kalaram temple, Daulatabad, his own account of the Poona fast), Azad and Ashfaqulla (need outside research); more flagships for the four new subjects if sources allow.
