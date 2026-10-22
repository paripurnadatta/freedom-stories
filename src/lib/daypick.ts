// Pure date helpers for "on this day". No site imports: this also runs in the browser.
import type { HomeDay } from "./homecards";

/** Days from (fromM, fromD) forward to the day (m, d), wrapping the year. 0 = today. */
export const daysAhead = (m: number, d: number, fromM: number, fromD: number) => {
  const day = (mm: number, dd: number) => (mm === 2 && dd === 29 ? Date.UTC(2001, 2, 1) : Date.UTC(2001, mm - 1, dd)); // 2001 has no 29 Feb
  const diff = Math.round((day(m, d) - day(fromM, fromD)) / 86400000);
  return diff < 0 ? diff + 365 : diff;
};

/** Today's items; if there are none, the items on the nearest day coming up. Stories first. */
export function pickDays(items: HomeDay[], month: number, day: number, limit = 3) {
  if (!items.length) return { ahead: 0, month, day, list: [] as HomeDay[] };
  const order = { story: 0, event: 1, born: 2, died: 3 } as const;
  const nearest = Math.min(...items.map((x) => daysAhead(x.m, x.d, month, day)));
  const hit = items.filter((x) => daysAhead(x.m, x.d, month, day) === nearest);
  const list = [...hit].sort((a, b) => order[a.t] - order[b.t] || a.y - b.y).slice(0, limit);
  return { ahead: nearest, month: list[0].m, day: list[0].d, list };
}
