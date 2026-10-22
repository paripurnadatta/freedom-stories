// The data behind the Connections page: who has stories, and which stories feature whom.
import { loadSite } from "../lib/site";
import { connectionData } from "../lib/connections";

export async function GET() {
  const site = await loadSite();
  return new Response(JSON.stringify(connectionData(site)), { headers: { "Content-Type": "application/json" } });
}
