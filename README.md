# Freedom Stories

Stories of India's freedom struggle, 1757 to 1947.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # runs the quality check, then builds the site into dist/
```

## How it's organised

Two folders hold everything:

**`src/content/subjects/`**: one file per person or event (926 of them). The facts live here: name, dates, region, places, portrait, a quote, sources, and the list of story angles planned for that subject. Below the facts block are research notes, which never appear on the site.

**`src/content/stories/`**: one file per story. A subject can have many stories:

- **Flagship**: the big story of a life or an event, 900+ words.
- **Short**: one moment, one object, one relationship, 350+ words. It links back to the flagship for the background.

At the top of each story, `about:` lists who it's about. The first name is the main subject; the rest are people and events who appear in it. The story then shows up on every one of their pages.

Pages on the site:

- `/stories/<story>/`: a story.
- `/people/<person>/` and `/events/<event>/`: everything about one subject: the flagship, short stories, stories they appear in, and the stories still to be told. A subject gets a page as soon as one published story features them.

## The work, one subject at a time

1. **Find the angles.** Research the subject and add every story worth telling to `angles:` in their subject file: a title, `flagship` or `short`, and a one-line hook. Put the notes and sources behind each angle in the research notes. See `bhagat-singh.md` for an example with 16 angles.
2. **Write the flagship first.** It sets the facts and the main arc.
3. **Write the short stories**, one at a time. Each one gets its own file in `stories/`.
4. When a story is published, add `story: <file-name>` to its angle so the subject page moves it from "still to be told" to the story list.
5. Run `npm run check`.

### How a story should sound

Write for a Class 5 student, and make them want to keep reading.

- Open with a scene, not a birth date. Put the reader in a room, a morning, a moment.
- Short sentences (the check keeps the average under 15 words). Plain words.
- Explain every hard word the first time it appears ("lathis, long sticks").
- Ask the questions a curious child would ask, then answer them as the story unfolds.
- Every fact must come from the sources. Disputed or family-told details can stay, but the story says so.

## The quality check

`scripts/check-stories.mjs` is the only check. For every published story it confirms: a title and subtitle, a type, real subjects in `about:`, at least two sources, no leftover notes or placeholders, enough words for its type, Class 5 sentence lengths, and none of the hollow phrases on its banned list. It also checks that subject links and angle links point to real files.

## Pictures and papers (media)

Every subject page has a media section built from Wikimedia Commons and Wikipedia. Only free-to-reuse files are collected (public domain, CC0, CC BY, CC BY-SA). Wikipedia's "fair use" images are never included. Each item shows who made it and its licence.

```bash
node scripts/fetch-media.mjs bhagat-singh      # one subject
node scripts/fetch-media.mjs --all             # everyone (slow on purpose; safe to stop and re-run)
```

Results go in `src/content/media/<subject>.json`. Items are sorted into **from their own time** (up to 1947) and **how India remembers them** (later). If something doesn't belong, add its file name to `"hidden"` in that JSON. Re-runs keep your hidden list.

If the collector picks the wrong Wikipedia page for someone with a common name, add `wikidata: "Q..."` or `wikipedia: "Exact Page Title"` to their subject file and re-run with `--refresh`.

To print an original document inside a story, put the picture in `public/media/<subject>/` and add a `<figure class="plate">` block in the story (see the Bhagat Singh flagship).

## Margin notes

Explain a hard word right after the paragraph that uses it:

```html
<aside class="note"><b>Lathi</b>: a long, heavy bamboo stick.</aside>
```

On wide screens it sits in the margin in handwriting; on phones it appears under the paragraph.

## Portraits

Portraits are stored in `public/portraits/` as 640px WebP files, with credit and licence kept in each subject file. To add a new Wikimedia portrait, put its Commons link in the subject's `image:` block, then run:

```bash
node scripts/fetch-portraits.mjs
python3 scripts/shrink-portraits.py
```

## Where things came from

`scripts/import-old-roster.py` did the one-time import from the old `freedom-fighter-timeline` repo. It isn't needed again.
