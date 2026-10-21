import { existsSync } from "node:fs";
import { getCollection, type CollectionEntry } from "astro:content";

export type Subject = CollectionEntry<"subjects">;
export type Story = CollectionEntry<"stories">;
type MediaData = CollectionEntry<"media">["data"];
export type MediaItem = MediaData["items"][number];
export type Picture = NonNullable<Subject["data"]["image"]>;

export const KINDS = {
  person: { path: "people", plural: "People", one: "Person" },
  event: { path: "events", plural: "Events", one: "Event" },
  place: { path: "places", plural: "Places", one: "Place" },
  organisation: { path: "organisations", plural: "Organisations", one: "Organisation" },
} as const;
export type Kind = keyof typeof KINDS;

export const hubUrl = (s: Subject) => `/${KINDS[s.data.kind].path}/${s.id}/`;
export const storyUrl = (s: Story) => `/stories/${s.id}/`;

/** A subject earns its own page once a story features it, or once it has enough pictures to be worth a visit. */
const MEDIA_FOR_PAGE = 4;

let cache: Awaited<ReturnType<typeof build>> | undefined;
export async function loadSite() {
  cache ??= await build();
  return cache;
}

async function build() {
  const subjects = (await getCollection("subjects")).sort((a, b) => a.data.name.localeCompare(b.data.name));
  const stories = (await getCollection("stories"))
    .filter((s) => s.data.status === "published")
    .sort((a, b) => a.data.year - b.data.year);
  const subjectById = new Map(subjects.map((s) => [s.id, s]));
  const media = new Map((await getCollection("media")).map((m) => [m.data.subject, m.data as MediaData]));

  const mainStories = new Map<string, Story[]>();
  const appearsIn = new Map<string, Story[]>();
  for (const story of stories) {
    story.data.about.forEach((id, i) => {
      const bucket = i === 0 ? mainStories : appearsIn;
      bucket.set(id, [...(bucket.get(id) ?? []), story]);
    });
  }

  const mediaOf = (id: string) => {
    const m = media.get(id);
    if (!m) return { original: [] as MediaItem[], later: [] as MediaItem[] };
    const shown = m.items.filter((i) => !m.hidden.includes(i.file));
    return { original: shown.filter((i) => i.era === "original"), later: shown.filter((i) => i.era === "later") };
  };
  const mediaCount = (id: string) => {
    const m = mediaOf(id);
    return m.original.length + m.later.length;
  };

  const hasStories = (id: string) => mainStories.has(id) || appearsIn.has(id);
  const hasHub = (id: string) => hasStories(id) || mediaCount(id) >= MEDIA_FOR_PAGE;
  const hubs = subjects.filter((s) => hasHub(s.id));

  const sortStories = (list: Story[] = []) =>
    [...list].sort((a, b) => (a.data.type === b.data.type ? a.data.year - b.data.year : a.data.type === "flagship" ? -1 : 1));

  /**
   * A painting for a story, if one has arrived. Paintings live in the main subject's folder as
   * illustrations/<story-id>.webp and are picked up automatically; a story can also name one in
   * its facts block. Captions always say it is an artist's impression.
   */
  const paintingFor = (story: Story): Picture | undefined => {
    if (story.data.illustration) return story.data.illustration;
    const main = subjectById.get(story.data.about[0]);
    if (!main) return undefined;
    const rel = `${KINDS[main.data.kind].path}/${main.id}/illustrations/${story.id}.webp`;
    if (!existsSync(`src/content/${rel}`)) return undefined;
    return {
      src: `/files/${rel}`,
      alt: `An artist's impression of a scene from "${story.data.title}"`,
      caption: "An artist's impression.",
      credit: "Illustration made for The Struggle for Freedom",
    };
  };

  /** The first archive picture printed inside a story, if any. */
  const firstPlate = (story: Story): Picture | undefined => {
    const m = story.body?.match(/<img src="([^"]+)" alt="([^"]*)"/);
    return m ? { src: m[1], alt: m[2] } : undefined;
  };

  /** The picture at the top of a story page: painting, then the story's own picture, then the main subject's portrait. */
  const leadPicture = (story: Story): { picture?: Picture; painted: boolean } => {
    const painting = paintingFor(story);
    if (painting) return { picture: painting, painted: true };
    const main = subjectById.get(story.data.about[0]);
    return { picture: story.data.image ?? main?.data.image, painted: false };
  };

  /**
   * The picture on a story's card: painting, the story's own picture, the first archive picture inside it.
   * Never the subject's portrait, so a page of cards never repeats one face. No picture means a date card.
   */
  const cardPicture = (story: Story): Picture | undefined => paintingFor(story) ?? story.data.image ?? firstPlate(story);

  const latest = [...stories].sort((a, b) => (b.data.published?.getTime() ?? 0) - (a.data.published?.getTime() ?? 0));

  return {
    subjects,
    stories,
    latest,
    subjectById,
    hubs,
    hasHub,
    hasStories,
    mediaOf,
    leadPicture,
    cardPicture,
    mainStoriesOf: (id: string) => sortStories(mainStories.get(id)),
    appearsInOf: (id: string) => sortStories(appearsIn.get(id)),
    /** Other published stories that share at least one subject with this one. */
    relatedStories: (story: Story) =>
      stories.filter((s) => s.id !== story.id && s.data.about.some((id) => story.data.about.includes(id))),
  };
}

export function datesOf(s: Subject): string {
  const d = s.data;
  if (d.kind === "person") return [d.born?.slice(0, 4), d.died?.slice(0, 4)].filter(Boolean).join("–");
  if (d.kind === "organisation") return [d.founded, d.ended].filter(Boolean).join("–") || "";
  if (d.kind === "event") return d.date ? d.date.slice(0, 4) : String(d.year);
  return "";
}

/** One short line under a name: a person's role, an event's year, a place's region. */
export function lineFor(s: Subject): string {
  const d = s.data;
  if (d.kind === "person") return [d.role, datesOf(s)].filter(Boolean).join(", ");
  if (d.kind === "event") return [datesOf(s), d.region].filter(Boolean).join(", ");
  if (d.kind === "organisation") return [datesOf(s) && `Founded ${d.founded}`, d.region].filter(Boolean).join(", ");
  return d.region;
}

/** Roughly how long a story takes a young reader (about 150 words a minute). */
export function minutesToRead(body = ""): number {
  const text = body.replace(/<figure[\s\S]*?<\/figure>/g, "").replace(/<aside[\s\S]*?<\/aside>/g, "").replace(/<[^>]+>/g, " ");
  const words = text.replace(/[#*_>`-]/g, " ").split(/\s+/).filter(Boolean).length;
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
  const first = text.match(/^.{20,160}?[.!?](?=\s|$)/)?.[0] ?? text;
  const capped = first.length > 160 ? first.slice(0, 157).replace(/\s+\S*$/, "") + "..." : first;
  return capped.charAt(0).toUpperCase() + capped.slice(1);
}
