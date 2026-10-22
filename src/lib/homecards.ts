// Card markup for the home page, in one place so that the page built on the server and the
// shuffled version made in the browser are exactly the same. No imports from the site data here:
// this file also runs in the visitor's browser.
export interface HomeStory { u: string; t: string; st: string; f: 0 | 1; w: string; i: string; p: 0 | 1; y: string; pl: string; c: number; h: string }
export interface HomeDay { m: number; d: number; y: number; t: "story" | "born" | "died" | "event"; n: string; u: string; s: string; i: string; p: 0 | 1 }

export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ARROW = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const art = (s: { i: string; p: 0 | 1; y: string; pl: string; c: number }) =>
  s.i
    ? `<span class="art"><img src="${esc(s.i)}" alt="" loading="lazy" decoding="async" />${s.p ? '<span class="ai-badge">AI illustration</span>' : ""}</span>`
    : `<span class="art date-card tint-${s.c}" aria-hidden="true"><span class="dc-year">${esc(s.y)}</span>${s.pl ? `<span class="dc-place">${esc(s.pl)}</span>` : ""}<span class="dc-band"></span></span>`;

const kind = (s: HomeStory) => `<span class="kind${s.f ? "" : " short"}">${s.f ? "Flagship story" : "Short story"}${s.w ? `<span style="color:var(--soft);font-weight:400;text-transform:none;letter-spacing:0"> · ${esc(s.w)}</span>` : ""}</span>`;

export const storyCardHtml = (s: HomeStory) =>
  `<a class="card" href="${esc(s.u)}">${art(s)}<span class="body">${kind(s)}<h3>${esc(s.t)}</h3><p>${esc(s.st)}</p></span><span class="go" aria-hidden="true">${ARROW}</span></a>`;

/** The big "story of the moment" card, with the story's opening line. */
export const spotlightHtml = (s: HomeStory) =>
  `<a class="card wide spot" href="${esc(s.u)}">${art(s)}<span class="body">${kind(s)}<h3>${esc(s.t)}</h3>${s.h ? `<p class="spot-hook">${esc(s.h)}</p>` : `<p>${esc(s.st)}</p>`}<span class="spot-go">Read the story ${ARROW}</span></span></a>`;

const label = (x: HomeDay) =>
  x.t === "story" ? `${x.d} ${MONTH_NAMES[x.m - 1]} ${x.y}`
  : x.t === "born" ? `Born on this day in ${x.y}`
  : x.t === "died" ? `Died on this day in ${x.y}`
  : `${x.d} ${MONTH_NAMES[x.m - 1]} ${x.y}`;

export const dayCardHtml = (x: HomeDay) => {
  const pic = x.i
    ? `<span class="art"><img src="${esc(x.i)}" alt="" loading="lazy" decoding="async" />${x.p ? '<span class="ai-badge">AI illustration</span>' : ""}</span>`
    : `<span class="art date-card tint-${x.y % 4}" aria-hidden="true"><span class="dc-year">${x.y}</span><span class="dc-band"></span></span>`;
  return `<a class="card" href="${esc(x.u)}">${pic}<span class="body"><span class="kind${x.t === "story" ? " short" : ""}">${esc(label(x))}</span><h3>${esc(x.n)}</h3>${x.s ? `<p>${esc(x.s)}</p>` : ""}</span><span class="go" aria-hidden="true">${ARROW}</span></a>`;
};

export const dayHeading = (ahead: number, d: number, m: number) =>
  ahead === 0 ? { h: "On this day", p: `Things that happened, or people who were born or died, on ${d} ${MONTH_NAMES[m - 1]}.` }
  : { h: `Coming up: ${d} ${MONTH_NAMES[m - 1]}`, p: ahead === 1 ? "Tomorrow, on the calendar of the freedom struggle." : `In ${ahead} days, on the calendar of the freedom struggle.` };
