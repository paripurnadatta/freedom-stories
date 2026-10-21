// Where things live: one folder per subject, src/content/<kind>/<slug>/.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const CONTENT = "src/content";
export const KINDS = ["people", "events", "places", "organisations"];

/** Every subject folder, as { kind, slug, dir }. */
export function allSubjects() {
  return KINDS.flatMap((kind) =>
    existsSync(join(CONTENT, kind))
      ? readdirSync(join(CONTENT, kind)).map((slug) => ({ kind, slug, dir: join(CONTENT, kind, slug) }))
      : [],
  );
}

/** The folder for one subject slug, e.g. "bhagat-singh". */
export function subjectDir(slug) {
  const hit = allSubjects().find((s) => s.slug === slug);
  if (!hit) throw new Error(`No subject folder called "${slug}"`);
  return hit;
}

/** Web address for a file inside a subject folder. */
export const webPath = (dir, ...parts) => "/files/" + join(dir, ...parts).slice(CONTENT.length + 1).split("\\").join("/");
