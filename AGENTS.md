# AGENTS.md: instructions for AI tools other than Claude

This file is for ChatGPT, Codex and any other AI tool working in this repo.
(Claude reads CLAUDE.md directly.)

## Read first

Read these in full before doing anything, in this order:

1. CLAUDE.md (the rulebook; if any file disagrees with it, CLAUDE.md wins)
2. README.md
3. RESEARCH_BRIEF.md
4. ILLUSTRATIONS.md

Then read one finished subject folder (e.g. `src/content/people/ram-prasad-bismil/`) and
one finished flagship story and one short story, to copy the frontmatter and style.

The owner (Paripurna) is not a programmer: use plain words when you report to him.

## Your role: researcher AND writer, working on your own branch

You do the whole routine in CLAUDE.md ("Making stories for a subject"): research, write
stories, add pictures and painting prompts, update `index.md`, run the checks. Claude
reviews your work afterwards, before it goes live.

**Branch rule (important).** Work and push ONLY on the branch `chatgpt-work`
(create it from `main` if it does not exist; start each session by merging the latest
`main` into it). NEVER push to `main`. Claude merges your work into `main` after review.
The site is built from `main`, so this keeps unchecked facts off a children's website.

**What you may change**
- A subject's `research/`, `stories/`, `archive/`, `illustrations/prompts.txt` and `index.md`
  (a new subject folder is fine; copy the shape of an existing `index.md`).
- The `related:` list in another subject's `index.md`, only to link to your new subject.

**What you must NOT change**
- `src/lib`, `src/components`, `src/pages`, `src/styles`, `scripts/`, `package.json`,
  `CLAUDE.md`, `AGENTS.md`, `README.md` (Claude updates the progress table).
- Existing stories by other subjects, existing paintings, or `media.json` files.

## Every story: the rules in CLAUDE.md apply in full

Re-read "The rules for every story" in CLAUDE.md before each story. In short:
- Every fact from a source you actually opened this session, with the URL. 2 or more
  sources per story. Never from memory.
- Where sources disagree, say so in the story with a "Two versions" note.
- Label legends. No invented dialogue, thoughts, weather, feelings or crowds.
- Class 5 style: average sentence under 15 words, none over 30. Hard words explained in notes.
  Start with a scene or question; end with "Why it matters" or a quiet line.
- Gentle with violence and death. Fair on politics. No AI-sounding phrases.
- Flagship 900+ words, short 350+ (notes and figures not counted). If the sourced facts are
  not enough, write fewer or shorter stories. NEVER pad or stretch thin material.
- Blocked sites (Hindustan Times, Times of India, Indian Express, sometimes The Wire):
  do not build on a page you could not open. Record it in `research/checked.md`.
- Use "HRA" before September 1928 and "HSRA" after.
- Pictures: only free licences (public domain, CC0, CC BY, CC BY-SA) from Wikimedia Commons,
  with credit, licence and a "Where this picture comes from" link. No readable text, flags,
  Ashoka Chakra, gore, or invented faces in painting prompts.

## Routine, in order, for each subject

1. Research: write `research/chatgpt-report-<YYYY-MM-DD>.md` (8 to 15 angles, each with
   source URLs, disagreements, and THIN/SHORT/FLAGSHIP size).
2. Check your own report: write `research/checked.md` (what held up, what could not be
   checked, what was left out). Quotes: exact words + URL, or UNVERIFIED. Do not use
   UNVERIFIED quotes in stories.
3. Write stories to `stories/<story-slug>.md`. Only for angles with enough sourced material.
4. Update `index.md` (summary, full dates, `related:`, `sources:`, `angles:`; each written
   story gets `story: "<slug>"`).
5. Painting prompts for stories with no good real picture, in `illustrations/prompts.txt`,
   in the house format (copy an existing prompts.txt).
6. Run `npm install` (first time), then `npm run check` and `npm run build`. Both must pass
   before you commit. If you cannot run them, say so in the commit message and in
   `research/review-needed.md`.
7. Write `research/review-needed.md`: a short list for Claude of anything unsure, any
   source you could not open, any quote UNVERIFIED, any fact with only one source.
8. Commit to `chatgpt-work` with a message starting "[chatgpt]" and push. Do one subject
   per commit, so Claude can review them one at a time.

## Do not

- Do not mark anything as checked by Claude. Claude does that.
- Do not delete or rewrite earlier work to make a check pass. If a story fails the check,
  fix it with more sourced detail, or leave it out and say so.
- Do not skip a step because you are running low on time. Stop and report instead.

## Report to the owner

When you finish a subject, tell him in plain words: what was added, what was left out and
why, which paintings are needed, and the branch name. Remind him that Claude reviews it
before it goes live.
