import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const source = z.object({
  title: z.string(),
  url: z.string().url(),
  publisher: z.string().optional(),
});

const image = z.object({
  src: z.string().url(),
  alt: z.string().default(""),
  caption: z.string().optional(),
  credit: z.string().optional(),
  license: z.string().optional(),
  sourceUrl: z.string().url().optional(),
});

// One file = one story. The facts block at the top of each file must match this.
const stories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: z.object({
    id: z.string(),
    kind: z.enum(["person", "event"]),
    name: z.string(),
    title: z.string(),
    subtitle: z.string().default(""),
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
    quote: z.object({ text: z.string(), by: z.string() }).optional(),
    status: z.enum(["draft", "published"]),
  }),
});

export const collections = { stories };
