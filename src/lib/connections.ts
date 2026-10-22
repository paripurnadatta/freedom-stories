// Connections: two subjects are connected when a published story is about both of them.
// Nothing is invented here. Every link on the Connections page is a story a reader can open.
import { loadSite, hubUrl, storyUrl, KINDS } from "./site";
import { aliasesFor } from "./aliases";

type Site = Awaited<ReturnType<typeof loadSite>>;

/** Everything the Connections page needs: subjects that have stories, and the stories themselves. */
export function connectionData(site: Site) {
  const ids = new Set(site.hubs.filter((s) => site.hasStories(s.id)).map((s) => s.id));
  const stories: Record<string, { t: string; u: string; f: 0 | 1; a: string[] }> = {};
  const count = new Map<string, number>();
  for (const st of site.stories) {
    const a = st.data.about.filter((id) => ids.has(id));
    if (a.length === 0) continue;
    stories[st.id] = { t: st.data.title, u: storyUrl(st), f: st.data.type === "flagship" ? 1 : 0, a };
    a.forEach((id) => count.set(id, (count.get(id) ?? 0) + 1));
  }
  const nodes = [...ids]
    .map((id) => site.subjectById.get(id)!)
    .map((s) => ({
      id: s.id,
      n: s.data.name,
      k: s.data.kind,
      c: count.get(s.id) ?? 0,
      u: hubUrl(s),
      a: aliasesFor(s.id, s.data.aliases),
    }))
    .sort((x, y) => y.c - x.c || x.n.localeCompare(y.n));
  return { nodes, stories };
}

/** The subjects that share the most stories with this one, for the small picture on each page. */
export function alongside(site: Site, id: string, limit = 6) {
  const shared = new Map<string, number>();
  for (const st of site.stories) {
    if (!st.data.about.includes(id)) continue;
    for (const other of st.data.about) if (other !== id) shared.set(other, (shared.get(other) ?? 0) + 1);
  }
  return [...shared.entries()]
    .map(([otherId, count]) => ({ subject: site.subjectById.get(otherId), count }))
    .filter((x): x is { subject: NonNullable<typeof x.subject>; count: number } => x.subject !== undefined && site.hasStories(x.subject.id))
    .sort((a, b) => b.count - a.count || a.subject.data.name.localeCompare(b.subject.data.name))
    .slice(0, limit)
    .map((x) => ({ ...x, url: hubUrl(x.subject), kind: KINDS[x.subject.data.kind].one }));
}
