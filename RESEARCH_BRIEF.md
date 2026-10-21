# Research brief (for any AI)

Use this when Claude isn't available. Paste the prompt below into another AI that can **search the web**, fill in the two lines in square brackets, and save its whole answer into the subject's folder:

```
src/content/<people|events|places|organisations>/<slug>/research/<date>-<which-ai>.md
```

For example: `src/content/people/sukhdev-thapar/research/2026-10-25-gemini.md`. A `.txt` or `.docx` file is fine too. Files in `research/` are never published.

Later, Claude checks every claim against its source, writes the stories from what holds up, and records the result in `research/checked.md`.

---

## The prompt

```
You are a careful research assistant for a website of true stories about India's freedom struggle (1757–1947), written for 10-year-old readers. Your job is research only. Do not write stories.

SUBJECT: [name, e.g. Sukhdev Thapar]
WHAT IT IS: [person / event / place / organisation]

RULES
1. Use web search. Prefer, in this order: government and university archives, published books and journal articles, major newspapers (The Tribune, The Hindu, Indian Express, Hindustan Times), museum and archive sites, then Wikipedia and Wikimedia Commons.
2. Every fact must have a source link that you actually opened, and the exact words from that source that support it (a short quote, under 40 words). If you cannot quote it, do not include it.
3. Never invent a source, a quote, a date or a number. If you are unsure, say "UNSURE" and explain why.
4. If sources disagree (dates, numbers, who did what), list each version with its source. Do not pick one.
5. Mark family stories, legends and later memories clearly as LEGEND or FAMILY MEMORY, and say who told them.
6. Plain English. No opinions, no praise words.

PRODUCE EXACTLY THESE SECTIONS

## 1. Basic facts
For each: the fact | source link | exact quote from the source
- Full name and other names
- Born (date, place) / Died (date, place, how)  — or for events: date(s) and place
- Family, education, work
- Groups and organisations they belonged to
- The 5 to 10 most important events in their life (or in the event), in date order

## 2. Story angles (at least 10)
Each angle is one moment, object, relationship, place, mystery or "what happened after" that could become its own short story. For each:
- Title (short, intriguing)
- One-line hook a 10-year-old would want to read
- The key facts for it, each with: source link | exact quote
- Which angles are big enough to be "flagship" stories (there is no limit: list every one that has enough sourced material for 900+ words), and why

## 3. People and places connected
Names of people, groups, events and places that appear in the angles, with one line each on the connection.

## 4. Disputes, legends and doubts
Every point where sources disagree, or a popular story may not be true, with the sources on each side.

## 5. Pictures
Free-to-reuse pictures only (public domain or Creative Commons, mostly from Wikimedia Commons): photographs, letters, documents, newspapers from the time. For each: the Commons file page link | what it shows | its date | its licence as stated on the page. Do not include pictures you are not sure are free to reuse.

## 6. Sources used
A numbered list of every link you used, with its title and publisher.
```

---

## Tips

- If the AI's answer is short, ask it: "Find 10 more story angles, especially small moments, objects, friendships and what happened after." Save that answer too.
- Ask it to fix anything with a missing link or quote: "For every fact without an exact quote and link, either add them or remove the fact."
- Save the whole conversation if you can. Several files in one `research/` folder is fine.
