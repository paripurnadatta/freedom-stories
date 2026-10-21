// The full gallery of a subject, as JSON. Subject pages print only the first few pictures of
// each shelf; "Show more" and the filters load the rest from here, so big pages (Gandhi has
// about two thousand items) stay light.
import type { APIRoute } from "astro";
import { cleanCredit, loadSite, shortCaption, thumbOf, largeOf, type MediaItem } from "../../lib/site";

export const GALLERY_PAGE = 24;

export async function getStaticPaths() {
  const site = await loadSite();
  return site.hubs
    .filter((s) => {
      const m = site.mediaOf(s.id);
      return m.original.length > GALLERY_PAGE || m.later.length > GALLERY_PAGE;
    })
    .map((s) => ({ params: { slug: s.id } }));
}

const slim = (i: MediaItem) => ({
  type: i.type,
  url: i.type === "image" ? largeOf(i) : i.url,
  thumb: thumbOf(i),
  title: i.title,
  caption: shortCaption(i.description, i.title),
  credit: cleanCredit(i.author, i.license),
  page: i.page,
  year: i.year ?? null,
});

export const GET: APIRoute = async ({ params }) => {
  const site = await loadSite();
  const m = site.mediaOf(params.slug!);
  return new Response(JSON.stringify({ then: m.original.map(slim), later: m.later.map(slim) }), {
    headers: { "Content-Type": "application/json" },
  });
};
