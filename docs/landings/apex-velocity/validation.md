# Validation — Apex Velocity

Validated 2026-10-23. The deliverable is an original working local landing and a static multi-page build. It uses the reference's interaction language (live helmet, cinematic scrub, bold type, on/off-track narrative), with its own identity, model, artwork and copy. This is a stylized procedural studio model, not a scanned or production Blender asset. No claim of visual parity with the reference site is made.

## Checkout and delivery

- Worktree: `/Users/toannguyen/Documents/personal-repos/landingpage-parallax-worktrees/apex-velocity`
- Branch: `feat/apex-velocity`
- Base commit: `9eba9d96de30d1c972ccb9c6832f5b771772286b`
- Scope: implementation, assets, tests and documentation for the Apex HTML entry, plus README, package.json, bun.lock and the data-only registry. The initial handoff was uncommitted for review; the user subsequently authorized committing the landing and merging it into `main`.
- Source checkout `/Users/toannguyen/Documents/personal-repos/landingpage-parallax` was preserved during implementation and was clean when integration began. The Apex dev and preview processes on ports 5180, 4180 and 4181 were stopped at the user’s request before integration. The feature worktree is retained; commit and integration history are available through Git.
- `dist/` contains the final GitHub Pages build, with real catalog, Luma and Apex HTML documents. A normal-base build snapshot is retained in ignored `node_modules/.cache/apex-dist-normal/` for simultaneous QA.

## Commands and final results

All commands run from the isolated worktree.

| Command                                                                                                   | Exit / result                                                                          |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `bun install` and task dependency installation                                                            | 0                                                                                      |
| `bun run lint`                                                                                            | 0, no warnings                                                                         |
| `bun run test --run`                                                                                      | 0, 12 tests across 3 files; 6 Apex, 5 Luma, 1 catalog                                  |
| `bun run build`                                                                                           | 0, all 3 entries pass the independent CSS guard                                        |
| `VITE_GITHUB_PAGES=true bun run build`                                                                    | 0, all 3 entries pass the independent CSS guard                                        |
| `bun run preview --host 127.0.0.1 --port 4181 --strictPort --outDir node_modules/.cache/apex-dist-normal` | Served successfully during QA; stopped at user request                                 |
| `VITE_GITHUB_PAGES=true bun run preview --host 127.0.0.1 --port 4180 --strictPort`                        | Served successfully during QA; stopped at user request                                 |
| `browser-qa.mjs`, normal and GitHub Pages bases                                                           | 0, 13 checks on each base                                                              |
| `scroll-qa.mjs`, normal and GitHub Pages bases                                                            | 0, scrub reverses and finite pin releases; no Axe violations at the forward story pose |
| `touch-qa.mjs`, normal and GitHub Pages bases                                                             | 0, horizontal drag keeps scroll position; vertical gesture scrolls                     |
| `performance-qa.mjs`, final GitHub Pages build                                                            | 0; measured result below                                                               |

The initial test/build iterations caught and fixed startup/test mocking, direct hash positioning after pin spacing, contrast during story motion, menu Tab wrapping, and polygon interpolation units. The final checks above passed after the relevant fixes. A transient macOS/Bun esbuild binary termination was resolved by reinstalling only this worktree's dependencies with `bun install --force --backend=copyfile`.

Build warnings retained: the deferred Three.js engine chunk exceeds Vite's 500 kB advisory threshold; existing browser compatibility databases are outdated. No build guard or warning threshold was disabled. The engine is dynamically imported only by visible Apex viewers.

## Browser matrix

Google Chrome 155 (headless, real ANGLE Metal rendering on Apple M4 Pro). Desktop 1440 × 1000; responsive 360 × 844, 390 × 844 and 768 × 1000. Browser automation uses installed Playwright; it does not replace visual inspection. Saved desktop, mobile and story screenshots were inspected.

| Scenario                                                                        | Normal `/`                                                                        | `/landingpage-parallax/` |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------ |
| Catalog → Apex → catalog, browser Back                                          | Pass                                                                              | Pass                     |
| Direct URL, reload, `#configure` reload                                         | Pass                                                                              | Pass                     |
| Actual WebGL helmet, pointer drag, left/right/reset, skip-link focus            | Pass                                                                              | Pass                     |
| Three editions, live studio update, real JSON download                          | Pass                                                                              | Pass                     |
| Desktop pin, two-way scrub, headline and moving mask                            | Pass                                                                              | Pass                     |
| Mobile menu: Enter, Tab/Shift+Tab containment, Escape, focus return, navigation | Pass                                                                              | Pass                     |
| 360 / 390 / 768 / 1440 horizontal overflow                                      | None                                                                              | None                     |
| Reduced motion: no pin; natural reading flow; manual viewer                     | Pass                                                                              | Pass                     |
| Static mode removes canvases; live mode can restart                             | Pass                                                                              | Pass                     |
| Simulated GPU context loss                                                      | Local poster and configuration remain usable                                      | Same                     |
| WebGL unavailable and engine chunk load failure                                 | Poster, real collection CTA and selection remain usable                           | Same                     |
| Axe WCAG A/AA automated rules                                                   | 0 violations                                                                      | 0 violations             |
| Unhandled page errors / console errors / HTTP ≥400 in normal flow               | 0 / 0 / 0                                                                         | 0 / 0 / 0                |
| Catalog CSS/fonts/runtime isolation                                             | Own CSS, static preview only; no Apex engine, GSAP, Luma runtime or Lenis startup | Same                     |
| Luma regression and isolation                                                   | Gallery keyboard, edition dialog; no Apex CSS/fonts/runtime                       | Same                     |

`qa/production-browser-results.json` and `qa/github-pages-browser-results.json` record the checks, viewports, requested catalog assets and Luma resources. Intentional WebGL/engine failure injection occurs in separate pages and is distinguished from the normal-flow error assertions.

The scroll probe samples 5% → 85% → 5% of the story timeline. Headline X changes −1.5 → −25.5 → −1.5px, the mask changes 95% → 15% → 95%, and the stage stays at 78px before releasing beyond the finite range. Screenshots show the actual helmet changing pose with the same timeline.

Trusted CDP touch events in a 390px responsive viewport: horizontal drag kept `scrollY` at 0, vertical swipe advanced it by 285px on the repository-base run. `touch-action: pan-y`, DPR 2 with a 1.25 renderer cap. This is desktop touch emulation, not a physical phone GPU test.

## Assets, network and performance

All brand visual assets **including both fonts and the catalog preview** total **359,548 bytes (0.343 MiB)**. This is a conservative upper bound for the first visual experience, comfortably below 12 MiB. Public files including OFL and credits total 364,756 bytes. Exact per-file sizes are in `qa/asset-sizes.json`.

There is no model or texture download. Original geometry and canvas paint are bundled in the deferred engine; the complete engine including Three.js is 551,259 bytes minified (137.95 kB gzip at build). Thus the complete code delivering the model is below the 4 MiB model/texture network budget. The generated 1024 × 512 RGBA paint map uses 2 MiB per viewer before GPU mipmaps; this is runtime memory, not transferred asset bytes. Poster WebPs are approximately 32–34 kB each. The headline and CTA render before the deferred engine initializes, with a local poster during loading. There are no external font, image, model or HDR requests.

Final 30-second run on **Apple M4 Pro / 24 GiB RAM**, Chrome 155, **ANGLE Metal GPU**, 1440 × 1000 CSS px, browser DPR 2, renderer DPR capped at 1.5 (story canvas 1188 × 940 pixels), no shadow maps or postprocessing:

| Metric                                               | Measured                                                    |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| Warmed bidirectional story scroll duration           | 30.015 seconds                                              |
| Average browser RAF rate                             | 60.00 FPS                                                   |
| Average actual viewer render rate                    | 60.04 FPS (frame counter; boundary can differ by one frame) |
| p95 frame interval                                   | 16.70 ms                                                    |
| Maximum sampled frame interval                       | 16.80 ms                                                    |
| Encoded resources fetched during the warmed page run | 571,832 bytes                                               |
| Encoded image/font resources in that run             | 317,214 bytes                                               |

The viewer was warmed after loading all three instances, then the script scrolled back and forth through the story's scrub range for 30 seconds. Other QA browsers were closed during measurement. The tested desktop configuration meets the ≥50 FPS / p95 ≤33.3ms targets. Raw resource timing entries, GPU name, user agent, canvas dimensions and frame counts are in `qa/github-pages-performance.json`.

Measurement limits: browser RAF intervals measure page presentation cadence, not GPU timestamp queries or physical display scan-out. Actual viewer frame counters are recorded separately. These measurements establish the desktop target only for the tested machine and quality settings. No CPU throttling was applied. A physical mobile device, mobile Safari, other GPUs and assistive technology screen readers were unavailable; physical mobile ≥30 FPS remains **unverified**. Responsive and touch emulation are not reported as real mobile GPU QA. Axe is an automated accessibility check, not a complete manual WCAG audit.

## Evidence and reproduction

- [Desktop hero](qa/github-pages-hero-desktop.png)
- [Collection](qa/github-pages-collection-desktop.png)
- [390px hero](qa/github-pages-hero-mobile.png)
- [390px collection](qa/github-pages-collection-mobile.png)
- [Story first pose](qa/github-pages-story-start.png), [forward pose](qa/github-pages-story-forward.png), [reversed pose](qa/github-pages-story-reversed.png)
- [No-WebGL fallback](qa/github-pages-no-webgl.png)
- [Downloaded configuration](qa/github-pages-configuration.json)
- [Performance and network data](qa/github-pages-performance.json)

```sh
cd /Users/toannguyen/Documents/personal-repos/landingpage-parallax-worktrees/apex-velocity
bun install
bun run dev --host 127.0.0.1 --port 5180 --strictPort
# http://127.0.0.1:5180/apex-velocity/

VITE_GITHUB_PAGES=true bun run build
VITE_GITHUB_PAGES=true bun run preview --host 127.0.0.1 --port 4180 --strictPort
# http://127.0.0.1:4180/landingpage-parallax/apex-velocity/

QA_URL=http://127.0.0.1:4180/landingpage-parallax/ QA_LABEL=github-pages node docs/landings/apex-velocity/browser-qa.mjs
QA_URL=http://127.0.0.1:4180/landingpage-parallax/ QA_LABEL=github-pages node docs/landings/apex-velocity/scroll-qa.mjs
QA_URL=http://127.0.0.1:4180/landingpage-parallax/ QA_LABEL=github-pages node docs/landings/apex-velocity/touch-qa.mjs
QA_URL=http://127.0.0.1:4180/landingpage-parallax/ QA_LABEL=github-pages node docs/landings/apex-velocity/performance-qa.mjs
```

QA scripts use the local Google Chrome executable. Adjust its path or install Playwright's Chromium on a different machine. Ports above were free when started; choose a free port if reusing these commands while another session is active.
