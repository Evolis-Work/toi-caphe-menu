import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

const repoName = "toi-caphe-menu";

export default defineConfig({
  site: "https://evolis-work.github.io",
  base: `/${repoName}`,
  output: "static",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
