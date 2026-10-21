# Illustrations

Paintings made for this site. The prompts for each subject live in its own folder:

```
src/content/people/bhagat-singh/illustrations/prompts.txt
src/content/home/illustrations/prompts.txt          (home page)
```

## How a painting gets onto the site

1. Open the subject's `illustrations/prompts.txt` and copy one PROMPT into your image generator.
2. Save the image in that same folder, named with its **FILE NAME** (for example `the-disguise-on-the-train.png`).
3. Run `node scripts/place-illustrations.mjs`, or hand the image to Claude. It is resized to a web-friendly `.webp`.

That's all. The site finds `illustrations/<story-name>.webp` by itself and uses it at the top of the story and on its card everywhere. Its caption always says "An artist's impression". `npm run check` tells you how many illustrations are still waiting.

## Where paintings go

Use a real picture whenever one exists; paint only what nobody could photograph.

- **The home page hero.**
- **Every flagship story.** The painting is the opening scene.
- **Short stories about moments nobody photographed**: an escape, a jail cell at night, a family scene.
- **Anything before about 1850.** Before photography reached India, paintings are the only way to show a scene.
- **Share previews.** A story's painting becomes its picture when shared on WhatsApp or social media.

## Where they never go

- **Instead of a real photograph of a person.** If a genuine photo exists, use it.
- **As an invented face.** For people with no known likeness, paint them from behind, at a distance, or in a crowd.
- **In "Pictures and papers".** That section is archival only.
- **As fake documents.** No letters, newspapers or posters with readable words.
- **Showing violence.** Paint the moment before or after, never the act.

## Which picture a card shows

Each story card picks the first of these that exists:

1. its painting
2. the story's own `image:`
3. the first archive picture printed inside the story
4. a date card: the year and place in big type, in one of four tints

A card never falls back to the subject's portrait, so a page of cards never repeats one face. The top of a story page uses the painting, then the story's image, then the subject's portrait.

## The house style

Every prompt in a prompts.txt already ends with this. Use it when writing new ones:

```
Painterly storybook illustration for a children's history book about India's freedom struggle. Rich, warm gouache and oil-paint texture with visible brushwork, cinematic lighting, warm saffron and amber light against deep indigo shadows, touches of leaf green. Historically accurate 1900s–1940s Indian clothing, architecture and objects. Faces calm and dignified. No text, no letters, no captions, no logos, no watermark, no borders. No gore, no blood, no weapons pointed at anyone. Do not include the Indian national flag or the Ashoka Chakra.
```

For stories set before 1900, change "1900s–1940s" to the right period. Leave out the last sentence only for a scene where people historically carried a flag, and even then keep it small and part of the scene.

## Sizes

| Where it goes | Shape | Generate at |
|---|---|---|
| Home page hero | 21:9, very wide | 2560 × 1100; keep the left third quiet |
| Flagship story | 16:7.5, wide | 2400 × 1125; keep the main action in the centre |
| Short story | 16:6, extra wide | 2400 × 900; keep the main action in the centre |

Cards crop every painting to 4:3 from the centre.

## Writing prompts for a new subject

When a subject's stories are written, add `illustrations/prompts.txt` to its folder, with one entry per story that needs a painting, in the same format as Bhagat Singh's: a `FILE NAME:` line (the story's file name, without `.md`), the shape, where it goes, and the full prompt with the house style.
