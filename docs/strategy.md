# Collection architecture

## Decision: separate documents for separate visual identities

The catalog is a neutral index. A landing is an independent browser document,
not a child route inheriting a shared layout. Vite's multi-page build writes a
real `dist/<slug>/index.html`, which static hosting can resolve directly.
See the [Vite 7 MPA guide](https://v7.vite.dev/guide/build.html#multi-page-app).

Each brand owns its entry, providers, reset, selectors, tokens, fonts, and asset
namespace. A navigation loads a new document, so even `body`, `:root`, keyframes,
and common class names cannot leak between brands. This deliberately trades SPA
transitions for predictable style isolation and straightforward static hosting.
CSS Modules help component-local organization, but document isolation is what
protects independent brands, including their global resets and HTML metadata.

## Build and registry

`src/landings/registry.ts` contains plain metadata only. The catalog uses it to
render real links; Vite uses each slug to include `<slug>/index.html` in its
Rollup inputs. The root `index.html` is always included. Avoid any component,
CSS, environment-specific browser code, or provider imports in this registry.

`cssCodeSplit` remains enabled. The emitted manifest lets `verify-build.mjs`
follow CSS through direct, shared, and dynamic chunks. It rejects shared CSS
between document entries. Shared JS vendor chunks without styles are allowed.
No common visual stylesheet, brand theme, or Tailwind preflight is injected.

## Paths and deployment

Use BASE_URL for catalog links, landing return links, and public asset paths.
Local paths are `/` and `/luma/`; the GitHub Pages build prefixes these with
`/landingpage-parallax/`. Preserve ordinary `#section` anchors inside Luma.
CI uploads all of `dist/`. No SPA fallback or rewrite is needed for these routes.

## Verification

Check lint, tests, the production build/CSS guard, and a GitHub Pages base build.
In a browser, verify direct navigation and reload, catalog → landing → catalog,
back navigation, images, stylesheets, font ownership, and absence of Luma runtime
in the catalog. Check Luma's parallax, gallery, dialog, and downloads after moving
files. Review mobile layout and reduced motion for both documents.

For Luma's visual design, assets, and interactions see `landings/luma/design.md`.
