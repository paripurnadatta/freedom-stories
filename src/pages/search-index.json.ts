// A small list of every searchable name, for the instant suggestions under the search boxes
// and for "Did you mean...?" on the search page. Only subjects that have stories are listed,
// so nobody is sent to an empty page.
import { loadSite, hubUrl, storyUrl, lineFor, KINDS } from "../lib/site";
import { aliasesFor } from "../lib/aliases";

export async function GET() {
  const site = await loadSite();
  const subjects = site.hubs
    .filter((s) => site.hasStories(s.id))
    .map((s) => ({
      k: s.data.kind,
      n: s.data.name,
      u: hubUrl(s),
      s: lineFor(s) || KINDS[s.data.kind].one,
      a: aliasesFor(s.id, s.data.aliases),
      i: s.data.image?.src ?? "",
    }));
  const stories = site.stories.map((st) => {
    const who = site.subjectById.get(st.data.about[0]);
    return {
      k: "story",
      n: st.data.title,
      u: storyUrl(st),
      s: who?.data.name ?? "",
      a: [] as string[],
      i: site.cardPicture(st)?.src ?? "",
      p: site.cardPicture(st)?.src === site.paintingFor(st)?.src && !!site.paintingFor(st) ? 1 : 0, // 1 = AI painting: always labelled
    };
  });
  return new Response(JSON.stringify([...subjects, ...stories]), { headers: { "Content-Type": "application/json" } });
}
