# Rajguru: review needed before merge (22 October 2026)

**Writer:** ChatGPT, not Claude. **Branch:** `chatgpt-work`. Claude has not approved this work and it must not be merged into `main` before review.

## Validation status
- The five new short story bodies were counted with the script's word-count rules: 377, 400, 387, 401, 369 words. All are 350+; no flagship.
- A per-story source count, image references, frontmatter, average sentence length and disallowed phrase scan still need verification by the actual repository script.
- **`npm install`, `npm run check` and `npm run build` NOT RUN.** The execution container cannot resolve `github.com` and cannot check out the private repository; only the GitHub connector can access it. Do not infer a passing build. Run checks in a normal local clone or CI before merging or publishing.
- No code, site layout, existing stories, or `media.json` edited.

## Historical/editorial checks for Claude
- [ ] The NBT book gives Rajguru's birthplace as **Varanasi** while the government's publication notice gives **Khed**. The main index gives only the undisputed birth *date*; birth-room story calls the building the government's identified room.
- [ ] Saunders shooting is usually **17 Dec 1928**, while Kama Maclean prints **18 Dec**; the shooting and train stories note the disagreement.
- [ ] Home Affairs identifies Scott as responsible for the Lajpat Rai baton charge; the NBT book identifies Saunders. Do not simplify the disagreement away.
- [ ] The constable Chanan Singh death and Azad's role are sourced to NBT but an original inquest/deposition has not been checked. No graphic detail is used.
- [ ] NBT's account of the station scene includes dramatic props and claims not verified from eyewitness papers; we omitted them.
- [ ] The special tribunal legal history is **secondary**: check Ordinance III/1930, court judgment, and Privy Council decision if the legal story is expanded.
- [ ] The Ministry's simplified “denied right to appeal” is reconciled with a later writer's special-leave proceeding. Verify exact procedural details.
- [ ] The original full text of the old Tribune print is not transcribed; the contemporary **25 March 1931** page is distinct from the **23 March** execution.
- [ ] Government Gazette (13 Mar 2024) already identifies the birth room as protected by a **2000** declaration but gives notice of proposed *additional adjacent-area controls*. Do not treat the proposed new controls as final law.
- [ ] The Times of India page **opened**; it reported a restoration and **planned** March 2026 reopening. Actual reopening not verified.
- [ ] The pre-existing index portrait is a 2013 India Post image with **GODL-India**, outside the narrowly approved PD/CC list. It was not altered; review whether it can continue appearing.
- [ ] No direct Rajguru speech is published. Alleged last words “Our time to die has come” were printed by NBT but are **UNVERIFIED as historical direct speech** and were excluded.

## Media and painting needs

- **No new generated images were added.**
- `the-second-name-at-the-gate`: reuse of existing public-domain 1928 HSRA notice WebP in Rajguru's local archive, copied as a Git blob; confirm original is a later typed copy.
- `the-headline-after-the-execution`: reuse of existing public-domain old Tribune page WebP in Rajguru's local archive, copied as a Git blob.
- **Two paintings requested** in `illustrations/prompts.txt`: `a-servant-on-the-train.png` and `a-court-with-fewer-doors.png`. Owners must supply; site will label AI automatically.
- `the-room-the-town-kept`: genuine 2012 CC BY-SA 3.0 photo exists on [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Birth_room_of_rajguru.JPG), photographer Miteshbhodia. It needs local download as WebP and an attributed `image:` block. Not completed because binary downloads are not available via the connected repository tools. Do **not** use an AI substitute.

## Known inaccessible source attempts (not used for factual claims)
- Marathi Vishwakosh: https://vishwakosh.marathi.gov.in/31091/ — prior research reported HTTP 502.
- Amrit Mahotsav old district link: https://cmsadmin.amritmahotsav.nic.in/district-reopsitory-detail.htm?12134= — unresolved in previous research.
- Ferozepur memorial tourist page: https://ferozepur.nic.in/tourist-place/the-national-martyrs-memorial-hussainiwala-border/ — timed out in previous research.
- No fact depends on these pages.

## Omitted as unsourced, thin or inappropriate

Rajguru's reported last words, exact faces and dialogue in the train escape, unsourced police informant, direct role in the Assembly bombing, unverified exact arrest date, graphic shooting or execution detail, and all other original report angles except 06/08/11/13/14. **No flagship was written.**
