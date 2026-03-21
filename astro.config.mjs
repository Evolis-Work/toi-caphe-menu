import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { createLogger } from "vite";

const repoName = "toi-caphe-menu";
const viteLogger = createLogger();
const viteWarn = viteLogger.warn.bind(viteLogger);

viteLogger.warn = (msg, options) => {
  const message = typeof msg === "string" ? msg : String(msg);
  if (message.includes("emitFile() is not supported in serve mode")) {
    return;
  }
  viteWarn(msg, options);
};

export default defineConfig({
  site: "https://evolis-work.github.io",
  base: `/${repoName}`,
  output: "static",
  integrations: [react()],
  vite: {
    customLogger: viteLogger,
    plugins: [tailwindcss()]
  }
});
