# Asset provenance

All assets are local and namespaced under `public/landings/apex-velocity/`. Retrieved/created on 2026-10-23. No real driver images, sponsor logos, reference screenshots or third-party helmet textures were used.

| Asset                                                                         | Author / source                                                                                                                     | Rights and modifications                                                                                                             |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Helmet shell, visor, chin, rims, vents, hinges, lock, rear blade, UV graphics | Original procedural artwork for this repository; `src/landings/apex-velocity/helmet.ts`                                             | Created for Apex Velocity. No downloaded model. Geometry and paint are generated locally by code.                                    |
| `ignition.webp`, `afterhours.webp`, `saltline.webp`                           | Locally rendered original helmet                                                                                                    | `render-posters.mjs` captures the same Three.js model into WebP with transparency. No reference imagery.                             |
| `preview.webp`                                                                | Original composition                                                                                                                | `make-preview.mjs` draws the original helmet render, type and circuit arc into a local canvas. Catalog loads only this static image. |
| `on-track.svg`, `off-track.svg`                                               | Original SVG illustrations                                                                                                          | Circuit line study and coast/path study created specifically for the two editorial sections.                                         |
| `favicon.svg`, AV wordmark, circuit loop                                      | Original vector artwork                                                                                                             | Paths authored in SVG; no sponsor/athlete mark used.                                                                                 |
| `fonts/Barlow-Regular.ttf`                                                    | Jeremy Tribby / [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/barlow)                                     | SIL Open Font License 1.1, copied to `fonts/OFL.txt`. Downloaded unchanged.                                                          |
| `fonts/BarlowCondensed-ExtraBoldItalic.ttf`                                   | Jeremy Tribby / [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl/barlowcondensed)                            | SIL Open Font License 1.1. Downloaded unchanged.                                                                                     |
| RoomEnvironment light rig                                                     | Three.js contributors / [official source](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/environments/RoomEnvironment.js) | MIT, included through installed `three@0.186.1`, not a remote HDR asset.                                                             |

Original work is supplied as part of this repository. Existing repository licensing remains applicable; this document does not relicense third-party dependencies. Font files have their own bundled OFL license. Dependency licenses remain in their installed packages. Public-facing attribution is in `credits.txt` and the page footer.

To regenerate studio imagery with the dev server running on port 5180:

```sh
node docs/landings/apex-velocity/render-posters.mjs
node docs/landings/apex-velocity/make-preview.mjs
```

The scripts use the installed Playwright package and local Google Chrome. The browser path can be adjusted for another machine. No paid or external rendering service is required. Blender was unavailable, so the model follows the brief's procedural fallback.

Exact byte sizes, build/network measurements and QA screenshots are recorded in validation.md and `qa/`.
