import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { createReadStream, existsSync, statSync, cpSync, readdirSync } from "node:fs";
import { join, normalize, extname } from "node:path";
import { fileURLToPath } from "node:url";

/*
  Pictures live next to the subject they belong to, in src/content/<kind>/<slug>/.
  This serves them at /files/<kind>/<slug>/... while you work (npm run dev),
  and copies them into the finished site when it is built.
*/
const CONTENT = fileURLToPath(new URL("./src/content/", import.meta.url));
const TYPES = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".svg": "image/svg+xml", ".pdf": "application/pdf" };

function subjectFiles() {
  return {
    name: "subject-files",
    hooks: {
      "astro:server:setup": ({ server }) => {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith("/files/")) return next();
          const rel = normalize(decodeURIComponent(req.url.slice("/files/".length).split("?")[0]));
          const file = join(CONTENT, rel);
          if (!file.startsWith(CONTENT) || !TYPES[extname(file).toLowerCase()] || !existsSync(file) || !statSync(file).isFile()) return next();
          res.setHeader("Content-Type", TYPES[extname(file).toLowerCase()]);
          createReadStream(file).pipe(res);
        });
      },
      "astro:build:done": ({ dir }) => {
        const out = join(fileURLToPath(dir), "files");
        const walk = (d) => {
          for (const e of readdirSync(d, { withFileTypes: true })) {
            const p = join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (TYPES[extname(e.name).toLowerCase()]) cpSync(p, join(out, p.slice(CONTENT.length)), { recursive: true });
          }
        };
        walk(CONTENT);
      },
    },
  };
}

export default defineConfig({
  // Set this to the real domain when the site goes live; it powers canonical URLs and the sitemap.
  site: "https://example.com",
  trailingSlash: "always",
  integrations: [subjectFiles(), sitemap({ filter: (page) => !page.includes("/search/") })],
});
