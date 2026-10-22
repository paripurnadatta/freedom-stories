import { storyUrl, type Story, loadSite } from "./site";
import type { HomeStory } from "./homecards";

type Site = Awaited<ReturnType<typeof loadSite>>;

const clean = (md = "") =>
  md.replace(/<aside[\s\S]*?<\/aside>/g, "").replace(/^#.*$/gm, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`>]/g, "").split(/\n\s*\n/).map((p) => p.trim()).find(Boolean) ?? "";

/** The story's opening line(s): up to about 200 characters, ending at a sentence. */
export function hookOf(body?: string) {
  const text = clean(body).replace(/\s+/g, " ");
  if (text.length <= 200) return text;
  const cut = text.slice(0, 200);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("? "), cut.lastIndexOf("! "));
  return end > 40 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, "") + "…";
}

export function homeStory(site: Site, s: Story): HomeStory {
  const who = site.subjectById.get(s.data.about[0]);
  const pic = site.cardPicture(s);
  return {
    u: storyUrl(s),
    t: s.data.title,
    st: s.data.subtitle,
    f: s.data.type === "flagship" ? 1 : 0,
    w: who?.data.name ?? "",
    i: pic?.src ?? "",
    p: pic && pic.src === site.paintingFor(s)?.src ? 1 : 0,
    y: s.data.when?.match(/\b(1[6-9]\d\d|20\d\d)\b/)?.[1] ?? String(s.data.year),
    pl: (s.data.where ?? "").split(",")[0].trim(),
    c: [...s.id].reduce((n, ch) => n + ch.charCodeAt(0), 0) % 4,
    h: hookOf(s.body),
  };
}
