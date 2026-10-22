// "On this day": dates that the site already holds in its own facts.
//   - a story's `when:` line, when it names a full date (e.g. "17 December 1928")
//   - a person's `born` / `died`, when they are full dates
//   - an event's `date`, when it is a full date (YYYY-MM-DD)
// Nothing here is invented: if a date is not written in full in the content, it is not used.
import { hubUrl, lineFor, storyUrl, loadSite } from "./site";
import type { HomeDay } from "./homecards";
export { daysAhead, pickDays } from "./daypick";

type Site = Awaited<ReturnType<typeof loadSite>>;

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export interface DayItem {
  m: number; // month 1-12
  d: number; // day 1-31
  y: number; // year it happened
  t: "story" | "born" | "died" | "event";
  n: string; // title or name
  u: string; // link
  s: string; // one line under the name
  i: string; // picture ("" if none)
  p: 0 | 1; // 1 = AI painting, must be labelled
}

/** First full "17 December 1928" in a piece of text, or an ISO date "1931-03-23". */
export function fullDate(text?: string): { d: number; m: number; y: number } | undefined {
  if (!text) return undefined;
  const iso = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (iso) return { y: +iso[1], m: +iso[2], d: +iso[3] };
  const re = new RegExp(`\\b(\\d{1,2})\\s+(${MONTHS.join("|")})\\s+(\\d{4})\\b`);
  const m = text.match(re);
  if (!m) return undefined;
  return { d: +m[1], m: MONTHS.indexOf(m[2]) + 1, y: +m[3] };
}

export function collectDays(site: Site): DayItem[] {
  const items: DayItem[] = [];
  for (const st of site.stories) {
    const f = fullDate(st.data.when);
    if (!f) continue;
    const pic = site.cardPicture(st);
    const who = site.subjectById.get(st.data.about[0]);
    items.push({
      ...f, t: "story", n: st.data.title, u: storyUrl(st), s: who?.data.name ?? "",
      i: pic?.src ?? "", p: pic && pic.src === site.paintingFor(st)?.src ? 1 : 0,
    });
  }
  for (const sub of site.hubs) {
    if (!site.hasStories(sub.id)) continue;
    const d = sub.data;
    if (d.kind === "person") {
      for (const [field, t] of [["born", "born"], ["died", "died"]] as const) {
        const f = fullDate(d[field]);
        if (f) items.push({ ...f, t, n: d.name, u: hubUrl(sub), s: lineFor(sub), i: d.image?.src ?? "", p: 0 });
      }
    } else if (d.kind === "event") {
      const f = fullDate(d.date);
      if (f) items.push({ ...f, t: "event", n: d.name, u: hubUrl(sub), s: lineFor(sub), i: d.image?.src ?? "", p: 0 });
    }
  }
  return items;
}
