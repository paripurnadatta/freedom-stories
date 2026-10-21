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

// A person or an event: the facts, kept in one place and shared by every story about them.
const subjects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/subjects" }),
  schema: z.object({
    id: z.string(),
    kind: z.enum(["person", "event"]),
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
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    type: z.enum(["flagship", "short"]),
    about: z.array(z.string()).min(1),
    year: z.number().int().min(1000).max(1950),
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
  loader: glob({ pattern: "**/*.json", base: "./src/content/media" }),
  schema: z.object({
    subject: z.string(),
    wikipedia: z.string().nullable(),
    commonsCategory: z.string().nullable(),
    hidden: z.array(z.string()).default([]),
    items: z.array(mediaItem),
  }),
});

export const collections = { subjects, stories, media };
