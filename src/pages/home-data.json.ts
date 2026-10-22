// Everything the home page needs to shuffle its story rows, pick a "story of the moment"
// and work out "on this day" for the visitor's own date. The page itself already holds a
// full default version of each of these in its HTML; this file only lets it vary them.
import { loadSite } from "../lib/site";
import { collectDays } from "../lib/onthisday";
import { homeStory } from "../lib/homedata";

export async function GET() {
  const site = await loadSite();
  const body = JSON.stringify({ stories: site.stories.map((s) => homeStory(site, s)), days: collectDays(site) });
  return new Response(body, { headers: { "Content-Type": "application/json" } });
}
