# Landing page collection — engineering guide

This repository is a collection of independently designed landing pages. The root
URL is a lightweight catalog; each brand owns a real HTML document at `/<slug>/`.
Use Bun, Vite 7, React 19, and TypeScript. Read `docs/strategy.md` before changing
entry points, asset paths, or build configuration.

## Architecture and ownership

- `index.html` → `src/catalog/main.tsx`: collection homepage only.
- `<slug>/index.html` → `src/landings/<slug>/main.tsx`: one document per brand.
- `src/landings/registry.ts`: data-only registry consumed by the catalog AND Vite
  build inputs. Never import components, stylesheets, or providers in this file.
- `src/landings/<slug>/`: all brand components, sections, CSS, tokens, hooks,
  content, and tests. Keep brand documentation in `docs/landings/<slug>/`.
- `public/landings/<slug>/`: namespaced brand images, icons, fonts, and other
  static assets. Catalog assets may live directly under `public/`.
- `src/setupTests.ts`: test infrastructure, not application code.

Do not introduce a root App that imports all landing pages or an SPA router for
cross-brand navigation. Use ordinary `<a>` links so the browser loads a fresh
HTML document, clearing the previous page's CSS and animation lifecycle. This
also supports direct URLs and refresh on GitHub Pages without rewrite rules.

## CSS isolation is required

1. Each HTML entry imports only its own page's CSS. No shared global stylesheet,
   preflight, visual component library, theme, font import, or CSS variable set.
2. Catalog globals live in `src/catalog/base.css`; catalog component styles use
   CSS Modules. Luma's reset and styles are private to its own document.
3. Global selectors (`:root`, `body`, `*`) are allowed only in the owning page's
   CSS. Repeated class names across documents are safe; do not prefix every
   selector just to compensate for bundling all pages together.
4. Prefer CSS Modules for new component styles. Define tokens, breakpoints,
   animation names, and typography within that landing's folder.
5. Font links, favicon, language, metadata, and theme-color belong in that page's
   HTML. A landing must not rely on metadata or fonts loaded by the catalog.
6. Tailwind is installed but not globally active. PostCSS currently runs only
   Autoprefixer; no root Tailwind preflight or brand theme is injected. If a new
   page needs Tailwind, explicitly configure processing and a page-local config
   with content paths restricted to that landing. Keep its output private.
7. Shared package dependencies are fine. Share only nonvisual, side-effect-free
   utilities when there is a real repeated need; do not move brand UI into a
   shared layer merely because it looks similar.

Keep Vite `cssCodeSplit: true`. `scripts/verify-build.mjs` follows the production
manifest, including static and dynamic dependencies, and rejects CSS reused by
multiple HTML entries. Do not disable this check or merge all CSS into one file.

## Adding a landing

1. Choose a unique lowercase kebab-case slug, e.g. `orbit`.
2. Create `orbit/index.html` with metadata, optional font links, root element, and
   `<script type="module" src="/src/landings/orbit/main.tsx"></script>`.
3. Create `src/landings/orbit/` with its own entry, components, reset, CSS, and
   tests. Initialize page-specific providers here, never in the catalog.
4. Put assets under `public/landings/orbit/`. In TSX use
   `${import.meta.env.BASE_URL}landings/orbit/...`; in HTML use `%BASE_URL%`.
5. Add metadata to `src/landings/registry.ts`. Vite automatically includes
   `orbit/index.html` from that registry; no manual router or deploy changes.
6. Update the README's catalog table and add brand documentation as useful.

Use `${import.meta.env.BASE_URL}${slug}/` for cross-page links and `#section` for
anchors within a document. Use trailing slashes for directory URLs. Never hardcode
`/luma/` or `/images/` in navigation/assets: deployments may use a repository base.

## Design and animation

Every landing should have its own coherent identity. No requirement to reuse
Luma's palette, typography, layout, animation library, or scrolling behavior.
Use `frontend-design`, `ui-ux-pro-max`, or `ui-styling` when applicable; use
`vercel-react-best-practices` for React changes. See `docs/frontend-skills.md`.
UI UX Pro Max is bundled in `.agents/skills/ui-ux-pro-max/`. Read its `SKILL.md`
and use its bundled Python search tool for UI/UX tasks; no global installation
is required. Keep generated design guidance scoped to the owning landing.
Read `src/landings/luma/AGENTS.md` before changing the Luma experience.

Prefer transform/opacity motion values rather than React state per scroll frame.
Respect reduced motion, preserve readable content without animation, provide
keyboard access, and clean up frames, observers, listeners, and animation instances.
Do not initialize smooth scrolling on the catalog just because a landing uses it.

## Required validation

- Run `bun run lint`, `bun run test --run`, and `bun run build`.
- When changing entries, paths, or assets, also run
  `VITE_GITHUB_PAGES=true bun run build` and preview the same base with
  `VITE_GITHUB_PAGES=true bun run preview`.
- Verify `/`, `/<slug>/`, direct reload, section hashes, catalog-to-brand links,
  return links, browser back, mobile layout, and reduced motion.
- Confirm each document loads only its own CSS, fonts, and providers. Check that
  the catalog does not request brand JavaScript or start Lenis. Fix missing
  assets, horizontal overflow, and page errors before finishing.
- CI deploys the complete `dist/` directory, including nested HTML entries.
  Do not switch to a single HTML artifact or add SPA fallback routing.
