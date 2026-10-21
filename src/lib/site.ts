import { getCollection, type CollectionEntry } from "astro:content";

export type Subject = CollectionEntry<"subjects">;
export type Story = CollectionEntry<"stories">;

export const hubUrl = (s: Subject) => `/${s.data.kind === "person" ? "people" : "events"}/${s.id}/`;
export const storyUrl = (s: Story) => `/stories/${s.id}/`;

/** Everything the pages need, loaded once per build. */
export async function loadSite() {
  const subjects = await getCollection("subjects");
  const stories = (await getCollection("stories"))
    .filter((s) => s.data.status === "published")
    .sort((a, b) => a.data.year - b.data.year);

  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const mediaById = new Map((await getCollection("media")).map((m) => [m.data.subject, m.data]));

  // Stories mainly about a subject (first in `about`), and stories they appear in.
  const mainStories = new Map<string, Story[]>();
  const appearsIn = new Map<string, Story[]>();
  for (const story of stories) {
    story.data.about.forEach((id, i) => {
      const bucket = i === 0 ? mainStories : appearsIn;
      bucket.set(id, [...(bucket.get(id) ?? []), story]);
    });
  }

  // A subject gets its own page once at least one published story features it.
  const hasHub = (id: string) => mainStories.has(id) || appearsIn.has(id);
  const hubs = subjects.filter((s) => hasHub(s.id));

  const sortStories = (list: Story[] = []) =>
    [...list].sort((a, b) => (a.data.type === b.data.type ? a.data.year - b.data.year : a.data.type === "flagship" ? -1 : 1));

  return {
    subjects,
    stories,
    subjectById,
    hubs,
    hasHub,
    mediaOf: (id: string) => {
      const m = mediaById.get(id);
      if (!m) return { original: [], later: [] };
      const shown = m.items.filter((i) => !m.hidden.includes(i.file));
      return { original: shown.filter((i) => i.era === "original"), later: shown.filter((i) => i.era === "later") };
    },
    mainStoriesOf: (id: string) => sortStories(mainStories.get(id)),
    appearsInOf: (id: string) => sortStories(appearsIn.get(id)),
  };
}

export function datesOf(s: Subject): string {
  if (s.data.kind === "event") return s.data.date ?? String(s.data.year);
  return [s.data.born?.slice(0, 4), s.data.died?.slice(0, 4)].filter(Boolean).join("–");
}

/** Roughly how long a story takes a young reader (about 150 words a minute). */
export function minutesToRead(body = ""): number {
  const words = body.replace(/<[^>]+>/g, " ").replace(/[#*_>`-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 150));
}

/** Commons credits are messy ("Unknown authorUnknown author"). Make them readable. */
export function cleanCredit(author: string, license: string): string {
  let a = author.replace(/\s+/g, " ").trim();
  const half = a.length / 2;
  if (a.length % 2 === 0 && a.slice(0, half) === a.slice(half)) a = a.slice(0, half);
  a = a.replace(/^(.+?)\s*\1$/i, "$1").replace(/^unknown( author| photographer)?$/i, "Unknown photographer").trim();
  if (a.length > 80) a = a.slice(0, 77).replace(/\s+\S*$/, "") + "...";
  return [a, license].filter(Boolean).join(", ");
}

/** A short caption: the first sentence of the description, or the title. */
export function shortCaption(description: string, title: string): string {
  const text = (description || title).replace(/\s+/g, " ").trim();
  const first = text.match(/^.{20,180}?[.!?](?=\s|$)/)?.[0] ?? text;
  const capped = first.length > 180 ? first.slice(0, 177).replace(/\s+\S*$/, "") + "..." : first;
  return capped.charAt(0).toUpperCase() + capped.slice(1);
}
