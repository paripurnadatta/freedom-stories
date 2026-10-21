import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // Set this to the real domain when the site goes live; it powers canonical URLs and the sitemap.
  site: "https://example.com",
  trailingSlash: "always",
  integrations: [sitemap({ filter: (page) => !page.includes("/search/") })],
});
