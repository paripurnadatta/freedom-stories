# The Struggle for Freedom

True stories of India's freedom struggle, 1757 to 1947, for young readers.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321  (search doesn't work in dev)
npm run build      # quality check, then the finished site in dist/, with search
npm run preview    # look at the finished site
```

## Where everything lives

Every person, event, place and organisation has its own folder:

```
src/content/<people|events|places|organisations>/<slug>/
  index.md           facts, research notes and story angles
  media.json         pictures and papers from Wikimedia Commons and Wikipedia
  portrait.webp      the portrait, if there is one
  archive/           historical pictures printed inside stories
  stories/           every story mainly about this subject
  illustrations/     prompts.txt, and the paintings made from it
  research/          notes and other AIs' findings (never published)
```

The home page's painting lives in `src/content/home/illustrations/`.

Pictures in these folders are served at `/files/<kind>/<slug>/...`, for example `/files/people/bhagat-singh/archive/hat-photo-print-1929.webp`.

## Pages

- `/stories/<story>/`: a story
- `/people/<slug>/`, `/events/<slug>/`, `/places/<slug>/`, `/organisations/<slug>/`: a subject's facts, stories, pictures and connections. A subject gets a page once a story features it, or once it has at least four pictures.
- `/people/`, `/events/`, `/places/`, `/organisations/`, `/stories/`: browse
- `/search/`: search everything (built by Pagefind during `npm run build`)

## Making stories for a subject

1. **Find the angles.** Research the subject and list every story worth telling under `angles:` in its `index.md`: a title, `flagship` or `short`, and a one-line hook. Notes and sources go below the facts block, in the research notes. See `people/bhagat-singh/index.md`.
2. **Write the flagship stories first** (as many as the sources can support), then the short stories. Each story is a file in the subject's `stories/` folder. `about:` lists who it is about; the first name is the folder it lives in.
3. When a story is published, add `story: <file-name>` to its angle.
4. **Write illustration prompts** for the stories that need a painting, in `illustrations/prompts.txt` (see ILLUSTRATIONS.md).
5. Run `npm run check`.

### How a story should sound

Write for a Class 5 student, and make them want to keep reading.

- Open with a scene, not a birth date.
- Short sentences: the check keeps the average under 15 words.
- Explain every hard word with a margin note the first time it appears.
- Ask the questions a curious child would ask, then answer them as the story unfolds.
- Every fact comes from the sources. Disputed or family-told details can stay, but the story says so.

### Margin notes and archive pictures

```html
<aside class="note"><b>Lathi</b>: a long, heavy bamboo stick.</aside>

<figure class="plate">
  <img src="/files/people/bhagat-singh/archive/tribune-front-page-1931.webp" alt="..." loading="lazy" />
  <figcaption>What it shows.<span class="credit">Who made it, licence. <a href="...">Where this picture comes from</a></span></figcaption>
</figure>
```

## Pictures

- **Story cards** use, in order: the story's painting, its own `image:`, the first archive picture inside it, or a date card. Never the subject's portrait. See ILLUSTRATIONS.md.
- **Paintings:** save them as `illustrations/<story-file-name>.png` and run `node scripts/place-illustrations.mjs`. They appear automatically.
- **Pictures and papers:** `node scripts/fetch-media.mjs <slug>` (or `--all`) collects free-to-reuse files into `media.json`. To hide one, add its file name to `"hidden"`. If the wrong person was found, add `wikidata: "Q..."` to `index.md` and re-run with `--refresh`.
- **Portraits:** put a Wikimedia link in `image:` and run `node scripts/fetch-portraits.mjs <slug>`.

## Research from other AIs

When Claude isn't available, use RESEARCH_BRIEF.md with any AI that can search the web, and save its answer in the subject's `research/` folder. Claude checks every claim against its source before anything is written, and records the result in `research/checked.md`.

## The quality check

`npm run check` runs before every build. For every published story it confirms: a title and subtitle; a type; real subjects in `about:`, and that the story sits in its main subject's folder; at least two sources; no leftover notes or placeholders; enough words for its type; Class 5 sentence lengths; none of the banned hollow phrases; and that every picture it points to exists. It also checks every subject's links, and tells you how many planned stories and illustrations are still waiting.

## Scripts

| Script | What it does |
|---|---|
| `scripts/check-stories.mjs` | the quality check |
| `scripts/fetch-media.mjs` | pictures and papers from Wikimedia |
| `scripts/fetch-portraits.mjs` | downloads portraits into subject folders |
| `scripts/place-illustrations.mjs` | prepares paintings for the web |
| `scripts/one-time/` | imports and moves already done; kept for the record |
