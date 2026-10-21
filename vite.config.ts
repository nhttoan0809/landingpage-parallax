import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import { landingPages } from "./src/landings/registry";

const repositoryBase = "/landingpage-parallax/";
const base = process.env.VITE_GITHUB_PAGES === "true" ? repositoryBase : "/";
const directoryPaths = new Set(
  landingPages.map(({ slug }) => `${base}${slug}`),
);

for (const { slug } of landingPages) {
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(slug) || slug === "catalog") {
    throw new Error(`Invalid or reserved landing slug: ${slug}`);
  }
}
if (directoryPaths.size !== landingPages.length) {
  throw new Error("Landing slugs must be unique");
}

// Vite doesn't redirect directory paths without a slash like static hosts do.
// Keep dev/preview consistent without falling back to the catalog's HTML.
function redirectLandingDirectory(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const url = new URL(req.url ?? "/", "http://localhost");
  if (!directoryPaths.has(url.pathname)) return next();
  res.writeHead(308, { Location: `${url.pathname}/${url.search}` });
  res.end();
}

export default defineConfig({
  base,
  appType: "mpa",
  plugins: [
    react(),
    {
      name: "landing-directory-urls",
      configureServer(server) {
        server.middlewares.use(redirectLandingDirectory);
      },
      configurePreviewServer(server) {
        server.middlewares.use(redirectLandingDirectory);
      },
    },
  ],
  build: {
    // Real HTML documents keep CSS and page lifecycle isolated on static hosting.
    cssCodeSplit: true,
    manifest: true,
    rollupOptions: {
      input: {
        catalog: fileURLToPath(new URL("./index.html", import.meta.url)),
        ...Object.fromEntries(
          landingPages.map(({ slug }) => [
            slug,
            fileURLToPath(new URL(`./${slug}/index.html`, import.meta.url)),
          ]),
        ),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    coverage: {
      reporter: ["text", "json-summary", "html"],
    },
  },
});
