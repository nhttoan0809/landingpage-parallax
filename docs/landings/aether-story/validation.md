# Aether Story — validation and handoff

Validated on 2026-10-23. This is an original fictional studio concept and a local static build, not a published site.

## Worktree and source preservation

- Worktree: `/Users/toannguyen/Documents/personal-repos/landingpage-parallax-worktrees/aether-story`
- Branch: `feat/aether-story`
- Implementation base: `9eba9d96de30d1c972ccb9c6832f5b771772286b`
- Source checkout: `/Users/toannguyen/Documents/personal-repos/landingpage-parallax`, initially clean on `main`. The original implementation and validation left that checkout untouched. The user subsequently authorized committing Aether and merging it into `main`.
- All Aether code, fonts, generated art, dependency installation, test runs, builds and preview servers belong to this worktree. The pre-existing `apex-velocity` worktree was left alone.
- The Aether worktree and branch are retained. The final `dist/` uses the GitHub Pages base. Both local Aether servers were stopped at the user's request before integration; commit and merge history is recorded in Git.

## Integration validation

`main` received Apex Velocity in `621c9ea` while Aether was being handed off. Integration preserves both landings, combines their catalog entries and retains Apex's additional accessibility dependency. The only content conflict was the data-only registry. All integration checks ran inside the Aether worktree.

- `bun install --frozen-lockfile`, `bun run lint`, and `bun run test --run`: passed; **34 tests in 6 files**, including the 6 Apex tests.
- Ordinary and GitHub Pages builds: passed; catalog, Aether, Apex and Luma each retain an independent stylesheet.
- Real Chrome smoke checks at both bases: all three catalog links load fresh documents, direct reloads work, each document owns its brand CSS, Aether's WebGL preview becomes ready, and there are no page, console or HTTP errors. Luma retains its existing Google Fonts stylesheet.
- The conservative budget was recalculated against the combined production manifest: **1.015 MiB**. Shared JavaScript dependencies do not share brand CSS.
- Temporary integration previews were stopped after verification. Ports 5182, 4183 and 4393 are no longer serving Aether.

The detailed acceptance and performance records below describe the original isolated Aether validation before the Apex integration.

## Required commands

| Command                                                                                                        | Final exit status / result                                                            |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `bun add three gsap @gsap/react`                                                                               | 0; installed inside this worktree                                                     |
| `bun add -d @types/three @playwright/test`                                                                     | 0                                                                                     |
| `bun run lint`                                                                                                 | 0; no ESLint warnings                                                                 |
| `bun run test --run`                                                                                           | 0; **28 tests in 5 files** (22 Aether, 1 catalog, 5 existing Luma)                    |
| `bun run build`                                                                                                | 0; three real HTML entries, CSS isolation guard passes                                |
| `VITE_GITHUB_PAGES=true bun run build`                                                                         | 0; nested HTML and prefixed assets, CSS guard passes                                  |
| `bun run preview --host 127.0.0.1 --port 4182 --strictPort`                                                    | Served ordinary-base build; stopped after QA                                          |
| `VITE_GITHUB_PAGES=true bun run preview --host 127.0.0.1 --port 4183 --strictPort`                             | Served GitHub Pages base preview; stopped after QA at the user's request              |
| `node docs/landings/aether-story/qa/run.mjs`                                                                   | 0; 18 acceptance checks at normal base                                                |
| `AETHER_QA_URL=http://127.0.0.1:4183/landingpage-parallax/ node docs/landings/aether-story/qa/run.mjs`         | 0; 18 acceptance checks at repository base                                            |
| `AETHER_QA_URL=http://127.0.0.1:4183/landingpage-parallax/ node docs/landings/aether-story/qa/performance.mjs` | 0; two 30-second measurements                                                         |
| `node docs/landings/aether-story/qa/lifecycle.mjs`                                                             | 0; scene RAF pauses, audio suspends, resume works; static study has no continuous RAF |
| `node docs/landings/aether-story/qa/budget.mjs`                                                                | 0; both budgets pass                                                                  |

The unit tests cover real production `progressAt` / `sampleStory` mapping, unequal chapter heights, clamps and reverse traversal; versioned preset round trips and malformed data; Enter / Escape / focus trapping / focus return; complete static content; local preset save / restore / reset and corrupt storage. They do **not** establish shader appearance or WebGL performance. Browser checks use actual Chrome/WebGL, not jsdom.

Build output retains the existing Browserslist / baseline-data age notices and a Vite warning for Three.js (~552 kB raw in the isolated scene chunk; ~548 kB in the combined build's shared Three.js chunk). It remains dynamically loaded and inside the measured budget; no warning limit, CSS guard or code-splitting requirement was disabled. The existing Luma unit test prints its normal reduced-motion informational message.

## Browser matrix

Raw records: [normal-report.json](qa/normal-report.json), [pages-report.json](qa/pages-report.json). Both contain **zero unexpected console / page / WebGL errors and zero failed requests in the ordinary flow**. The intentional no-GPU and network-drop scenarios run separately and verify their recovery UI.

| Flow                                                                             | `/` base                                             | `/landingpage-parallax/` base              |
| -------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------ |
| Catalog → Aether creates a fresh document                                        | Pass                                                 | Pass                                       |
| Direct brand URL / reload / hash navigation and reload                           | Pass                                                 | Pass                                       |
| Return to collection / browser Back                                              | Pass                                                 | Pass                                       |
| Four chapters, reverse scroll and active chapter                                 | Pass                                                 | Pass                                       |
| Crystal Enter, focus loop, Escape, scroll persistence and restored trigger focus | Pass                                                 | Pass                                       |
| Sound muted by default; user activates graph; crystal focus; mute closes graph   | Pass                                                 | Pass                                       |
| Palette changes actual canvas; dispersion / glow; reset                          | Pass                                                 | Pass                                       |
| Save / restore, JSON download, invalid JSON / schema import, valid import        | Pass                                                 | Pass                                       |
| Quality control and automatic tier across viewport breakpoints                   | Pass                                                 | Pass                                       |
| Manual static reading; full inline project stories; on-demand material preview   | Pass                                                 | Pass                                       |
| Lost WebGL context, static fallback and fresh-canvas retry                       | Pass                                                 | Pass                                       |
| Scene-chunk network failure leaves content available; explicit reload recovers   | Pass                                                 | Pass                                       |
| No WebGL: poster, headline, CTA, projects and controls remain available          | Pass                                                 | Pass                                       |
| 360×800, 390×844, 768×1024, 1440×900 and 844×390 landscape                       | No horizontal overflow / page errors                 | No horizontal overflow / page errors       |
| OS reduced motion at 390×844                                                     | Pass; ordinary flow, complete project copy           | Pass; ordinary flow, complete project copy |
| Catalog isolation                                                                | One catalog CSS; no Aether scene / font JS; no Lenis | Same                                       |
| Aether isolation                                                                 | One private CSS; local fonts; no Luma runtime        | Same                                       |
| Existing Luma direct URL, reload, content, CSS / font ownership                  | Pass, plus 5 existing tests                          | Pass                                       |

The main text colour pairs were checked mathematically with WCAG relative luminance: body 12.86:1, muted text 5.04:1, project text 9.88:1, CTA 14.29:1, case labels 4.73:1. See [contrast.json](qa/contrast.json). Loading text retains full opacity. This is a token contrast check and keyboard / layout review, not a claim of a complete automated WCAG certification.

[Lifecycle evidence](qa/lifecycle.json): instrumentation counted scene-requested RAF callbacks only. A synthetic `document.hidden` / `visibilitychange` test in real Chrome stopped the counter and suspended the actual AudioContext, then resumed both; static mode kept its counter unchanged. This exercises the handlers, not an actual OS tab-switch or physical phone lifecycle.

## Performance and budgets

Environment: **Apple M4 Pro**, macOS **26.5.2**, Chrome **155.0.8059.85**, ANGLE / Metal Apple M4 Pro; headless, no CPU / GPU throttling. The document remained visible during measurement. [Raw measurements](qa/performance.json).

Method: 1-second warm-up after scene / quality setup, then 30 seconds of `requestAnimationFrame` intervals while programmed native scroll traverses all four chapters forward and backward, with reading holds. These are browser frame-interval measurements, not GPU timer-query or power measurements.

| Environment                                           | CSS viewport / device DPR / actual canvas | Tier | Mean FPS | p95 interval | Max interval |
| ----------------------------------------------------- | ----------------------------------------- | ---- | -------- | ------------ | ------------ |
| Desktop, actual M4 GPU                                | 1440×900 / DPR 2 / 2160×1350 (cap 1.5)    | High | 60.00    | 16.7 ms      | 16.8 ms      |
| Mobile **viewport emulation on the same desktop GPU** | 390×844 / DPR 3 / 390×844 (cap 1)         | Low  | 60.00    | 16.7 ms      | 16.8 ms      |

The measured desktop workload meets the requested ≥45 FPS / p95 ≤40 ms targets. **Real mobile ≥30 FPS remains unverified**: no physical phone was used in this validation run. Responsive emulation is not evidence for that criterion. Safari, Firefox and real touch-device GPU / audio behaviour have not been measured.

[Budget calculation](qa/budget.json) conservatively totals Aether HTML, **every** static / dynamic JS and CSS dependency in the manifest and **every** Aether public file (even unused preview, fallback and license files), without compression or cache discounts: **1.015 MiB** in the combined build, below the 18 MiB first-experience budget.

Scene geometry / texture data: **4.779 MiB high**, **3.933 MiB low**, below 8 MiB. This counts unique geometry attribute / index arrays, the baked environment target and generated light-field texture. It excludes renderer framebuffer allocations and shader programs; these figures are not total GPU memory. The initial sculpture is ~33,552 triangles. No model or texture is fetched from a remote host. Both tiers retain the same silhouette.

## Visual review and corrections

Reviewed real GPU renders at hero, three-quarter Formation, crystal gallery, full Rebirth, customizer and mobile. Primary fixes during iteration were: outward feather / crystal normals and compatible merged geometry attributes; fitting wing tips within portrait / tablet viewports; preserving dark gallery contrast throughout partial scroll; moving mobile Formation into its natural-flow sculpture slot; lowering the final mobile material composition below its copy; putting static-view errors next to the preview; removing poster multiply blending; fresh-canvas recovery and reactive quality changes. Frame grabs show no severe feather flicker / layer artifacts, blown-out highlights or unreadable crystals at the tested poses. This is limited to the tested Chrome / M4 environment, not a cross-device rendering guarantee.

- Before: [hero](qa/before-hero.png), [mobile Formation](qa/before-mobile-formation.png).
- Final: [Spark](qa/pages-hero.png), [Formation / side view](qa/pages-formation.png), [Resonance](qa/pages-resonance.png), [Rebirth / front view](qa/pages-rebirth.png), [customizer](qa/pages-customizer.png).
- Mobile: [hero](qa/pages-mobile-spark.png), [Formation detail](qa/pages-mobile-formation-detail.png), [gallery](qa/pages-mobile-resonance.png), [Rebirth](qa/pages-mobile-rebirth.png), [material study](qa/pages-mobile-reimagine.png).
- Fallback: [no GPU / static reading](qa/pages-no-gpu.png), [on-demand static study](qa/pages-static.png).

The artistic glass contour and the limits of RGB / screen-space refraction are described in [design.md](design.md); sources, licenses and reproducible local art are in [assets.md](assets.md). There is no claim of matching Noomo's production quality, offline spectral rendering or real client outcomes.

## Run / preview

The production preview was validated at (server now stopped):

**http://127.0.0.1:4183/landingpage-parallax/aether-story/**

The development server was stopped at:

**http://127.0.0.1:5182/aether-story/**

To restart from this retained worktree:

```sh
cd /Users/toannguyen/Documents/personal-repos/landingpage-parallax-worktrees/aether-story
bun install --frozen-lockfile
bun run dev --host 127.0.0.1 --port 5182 --strictPort
```

Production preview with the current deployment base:

```sh
cd /Users/toannguyen/Documents/personal-repos/landingpage-parallax-worktrees/aether-story
VITE_GITHUB_PAGES=true bun run build
VITE_GITHUB_PAGES=true bun run preview --host 127.0.0.1 --port 4183 --strictPort
```

For a root-base production preview, run `bun run build` before `bun run preview`; do not serve a prefixed build under a root-only configuration. CI still uploads the complete `dist/` directory. Nothing has been published or pushed.
