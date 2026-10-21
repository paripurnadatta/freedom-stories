import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const source = z.object({
  title: z.string(),
  url: z.string().url(),
  publisher: z.string().optional(),
});

const image = z.object({
  src: z.string(), // a local /portraits/ path, or a full web address
  alt: z.string().default(""),
  caption: z.string().optional(),
  credit: z.string().optional(),
  license: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});

const quote = z.object({ text: z.string(), by: z.string() });

// A planned or written story about a subject. When `story` is set, it has been written.
const angle = z.object({
  title: z.string(),
  type: z.enum(["flagship", "short"]),
  hook: z.string(),
  story: z.string().optional(),
});

/*
  Every person, event, place and organisation has its own folder:

    src/content/<people|events|places|organisations>/<slug>/
      index.md          facts, research notes and story angles
      media.json        pictures and papers from Wikimedia (scripts/fetch-media.mjs)
      portrait.webp     the portrait, if there is one
      archive/          historical pictures used inside stories
      stories/*.md      stories mainly about this subject
      illustrations/    prompts.txt, and the paintings made from it

  Pictures in these folders are served at /files/<kind>/<slug>/... (see astro.config.mjs).
*/
const KIND_FOLDERS = "{people,events,places,organisations}";
const folderOf = (entry: string) => entry.split("/")[1];

// A person, event, place or organisation: the facts, shared by every story about them.
const subjects = defineCollection({
  loader: glob({ pattern: `${KIND_FOLDERS}/*/index.md`, base: "./src/content", generateId: ({ entry }) => folderOf(entry) }),
  schema: z.object({
    id: z.string(),
    kind: z.enum(["person", "event", "place", "organisation"]),
    name: z.string(),
    wikidata: z.string().optional(), // e.g. "Q312689": helps the media collector find the right Wikipedia page
    wikipedia: z.string().optional(), // English Wikipedia title, if the name alone is ambiguous
    summary: z.string().default(""),
    born: z.string().optional(),
    died: z.string().optional(),
    date: z.string().optional(),
    endDate: z.string().optional(),
    year: z.number().int().min(1000).max(1950),
    region: z.string().default(""),
    role: z.string().optional(),
    founded: z.string().optional(), // organisations
    ended: z.string().optional(), // organisations
    aliases: z.string().optional(),
    placeType: z.string().optional(), // places
    lat: z.number().optional(), // places: for the map, once verified
    lng: z.number().optional(),
    places: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
    sources: z.array(source).default([]),
    image: image.optional(),
    quote: quote.optional(),
    angles: z.array(angle).default([]),
  }),
});

// A story. The first subject in `about` is who the story is mainly about;
// the rest are people and events who appear in it.
const stories = defineCollection({
  loader: glob({
    pattern: `${KIND_FOLDERS}/*/stories/*.md`,
    base: "./src/content",
    generateId: ({ entry }) => entry.split("/").pop()!.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    type: z.enum(["flagship", "short"]),
    when: z.string().optional(), // shown in the story header, e.g. "8 April 1929"
    where: z.string().optional(), // e.g. "Central Legislative Assembly, Delhi"
    published: z.coerce.date().optional(), // date the story went live; drives "Latest stories"
    featured: z.boolean().default(false), // show on the home page
    illustration: image.optional(), // painted lead image; falls back to an archive photo
    about: z.array(z.string()).min(1),
    year: z.number().int().min(1000).max(2030), // when the story happens; later stories (memorials, legacy) are allowed
    image: image.optional(),
    quote: quote.optional(),
    sources: z.array(source).default([]),
    status: z.enum(["draft", "published"]),
  }),
});

// Free-to-reuse media from Wikimedia Commons and Wikipedia, one file per subject.
// Written by scripts/fetch-media.mjs; edit only the "hidden" list by hand.
const mediaItem = z.object({
  file: z.string(),
  type: z.enum(["image", "audio", "video", "document"]),
  title: z.string(),
  description: z.string().default(""),
  date: z.string().default(""),
  author: z.string().default(""),
  license: z.string(),
  licenseUrl: z.string().optional(),
  thumb: z.string().optional(),
  url: z.string(),
  page: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  year: z.number().nullable().default(null),
  era: z.enum(["original", "later"]),
  foundIn: z.string(),
});
const media = defineCollection({
  loader: glob({ pattern: `${KIND_FOLDERS}/*/media.json`, base: "./src/content", generateId: ({ entry }) => folderOf(entry) }),
  schema: z.object({
    subject: z.string(),
    wikipedia: z.string().nullable(),
    commonsCategory: z.string().nullable(),
    hidden: z.array(z.string()).default([]),
    originals: z.array(z.string()).default([]), // marked by hand as from the subject's own time
    items: z.array(mediaItem),
  }),
});

export const collections = { subjects, stories, media };
