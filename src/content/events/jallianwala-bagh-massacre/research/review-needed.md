# Review before main

- No stories are written. ChatGPT did the research and the pictures only. The six stories in
  `index.md` are planned angles waiting for Claude, and none has a `story:` link.
- The writing pack is `research/chatgpt-report-2026-10-26.md`. It holds the facts for each angle,
  the URL where each fact appears, the exact quotations, and a "deliberately left out" list.
  `research/checked.md` says what held up and what did not.

## For Claude, before writing

- **Slugs.** The six angles are named in `index.md` and the prompts are keyed to these slugs:
  `jallianwala-the-garden-with-five-doors`, `jallianwala-a-grave-error`,
  `jallianwala-the-lane-where-people-crawled`, `jallianwala-the-letter-tagore-sent`,
  `jallianwala-how-india-heard`, `jallianwala-what-the-wall-remembers`. If a story is renamed,
  rename its line in `illustrations/prompts.txt` and its painting too, or the picture will not
  be picked up.
- **Two versions notes are needed** on three things: the date of the crawling order (Hunter says
  10 April, which cannot be right; the Tribune says 19 April, withdrawn 24 April; Hunter says
  withdrawn 26 April), the death toll (379 official, about 700 by Datta, about 1,000 by the
  Congress inquiry), and Udham Singh's presence in the Bagh (his own account only).
- **Two quotations are UNVERIFIED.** Tagore's letter is known here only through Wikipedia, and
  Dyer's "laughed at me ... fool of myself" answer only through Wikipedia as well. Paraphrase
  both, or use the Britannica sentence and the report's own words instead. Do not print them in
  quotation marks.
- **The well.** The 120-bodies figure rests on the plaque at the site alone. Say "a plaque at the
  site says". The Hunter report does not mention the well.
- **Violence.** Children were killed. The Hunter report counts 41 boys and a six-week-old baby;
  Malaviya's inquiry counted 42 boys. A story should say "about 40" and let that be enough. No
  description of wounds.

## Pictures

- The gallery has 69 items, 13 of them from the period ("From the time"), 33 from later years,
  and 23 near-duplicates hidden by hand. Everything is hotlinked from Wikimedia with its licence
  and credit, so nothing was downloaded for the gallery.
- The 13 period items: the crawling photograph of 1919, a photograph of the Bagh in 1919, Gandhi's
  hartal leaflet, Gandhi's appeal of 10 May 1919, the Rowlatt Bills headlines, Kitchlew in 1919,
  Dyer, two pages of the Hunter report, Tagore about 1920, Chelmsford, Udham Singh in 1929, and
  O'Dwyer. The O'Dwyer photograph is dated 1940, the year he died; it is a portrait of him, not a
  picture of the massacre.
- `archive/` has ten plates ready for the tops of stories: `jallianwala-bagh-1919`,
  `crawling-order-street-1919`, `hunter-report-1920`, `kitchlew-1919`, `dyer-1920`, `tagore-1920`,
  `hartal-leaflet-1919`, `martyrs-well`, `bullet-marked-wall`, `udham-singh-1929`. They are webp
  copies of Commons files, all public domain except the Martyrs' Well and the bullet-marked wall,
  which are CC BY-SA 2.0 and 3.0 (credit them where used).
- There is **no photograph of Dr Satyapal** on Commons. He is named in the research but has no
  picture. Do not use a picture of someone else for him.
- The plaque and the "quote from General Dyer" photographs are hidden or unused: they carry
  readable text, which the house rules keep out of pictures.

## Validation

- `npm run check` and `npm run build` were run on 26 October 2026 and both passed. Six planned
  stories are counted as waiting; six illustrations are waiting as well.

## After the rewrite (27 October 2026)

- Six stories are written and linked from `index.md`. Paintings are still needed: six prompts in `illustrations/prompts.txt`, checked against the stories on 27 October 2026. Changes made: the Parsi member in the committee room became "two more Indian members in caps"; the Lahore scene is now a telephone, not a telegraph tape, because Hunter says the first message was telephoned; the wall is red-brown brick, not sandstone; the Tagore scene no longer says Calcutta or evening.
- The two shapes remain: the first two at 16:7.5, the other four at 16:6.
