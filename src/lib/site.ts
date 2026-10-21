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
    mainStoriesOf: (id: string) => sortStories(mainStories.get(id)),
    appearsInOf: (id: string) => sortStories(appearsIn.get(id)),
  };
}

export function datesOf(s: Subject): string {
  if (s.data.kind === "event") return s.data.date ?? String(s.data.year);
  return [s.data.born?.slice(0, 4), s.data.died?.slice(0, 4)].filter(Boolean).join("–");
}
