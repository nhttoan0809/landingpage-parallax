# Phoenix v2 — validation and handoff

Validated on 2026-10-26, including flight, chapter controls, footer framing and three appearances, HDR bloom, discovered crystals and the larger final portrait. This report supersedes the model measurements in the original 2026-10-23 [validation.md](validation.md). Current behavior: [refinement.md](refinement.md). Anatomy provenance: [phoenix-v2.md](phoenix-v2.md).

## Worktree and preservation

- Worktree: `/Users/toannguyen/Documents/personal-repos/landingpage-parallax-worktrees/aether-phoenix-v2`
- Branch: `feat/aether-phoenix-v2`
- Base HEAD: `1f9585b98f4af3e4b51b22e4634941e182fb48c9`
- Source checkout remains on the same HEAD with its pre-existing untracked HTML intact. `cmp` confirms the worktree reference copy matches the original byte for byte.
- All code, dependency installation, asset rendering, tests, builds, video capture and preview commands ran in this new worktree. No runtime dependency or lockfile change was required. Playwright's ffmpeg download lives under this worktree's ignored `node_modules/.cache/ms-playwright/`.
- Changes remain uncommitted. No merge, push, publication, stash or worktree deletion was performed. Existing landings, catalog code, registry, build configuration and dependencies were not changed.

## Required validation

| Check                                  | Result                                                                                                                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bun install --frozen-lockfile`        | Earlier v2 setup; this refinement reused existing worktree dependencies, with no package/lockfile edit                                                    |
| `bun run lint`                         | Exit 0; no ESLint warnings                                                                                                                                |
| `bun run test --run`                   | Exit 0; **64 tests in 8 files**                                                                                                                           |
| `bun run build`                        | Exit 0; four real HTML entries, CSS isolation guard passes                                                                                                |
| `VITE_GITHUB_PAGES=true bun run build` | Exit 0; four nested entries and prefixed local assets, CSS guard passes                                                                                   |
| Prettier check on changed/new source   | Pass                                                                                                                                                      |
| `git diff --check`                     | Pass                                                                                                                                                      |
| `qa/run.mjs`, ordinary base            | Exit 0; 18 checks, no ordinary-flow errors                                                                                                                |
| `qa/run.mjs`, repository base          | Exit 0; 18 checks, no ordinary-flow errors                                                                                                                |
| `qa/refinement.mjs`, both bases        | Exit 0; removed options, crystal colour/state, silhouette bounds after resize, larger portrait, footer clearance and v4 persistence                       |
| `qa/appearances.mjs`, both bases       | Exit 0; actual GL.LINES, distinct/frozen finishes, brighter iridescence, v4 persistence, v2 migration, warmed program reuse and compact quality checks    |
| `qa/story-workshop.mjs`, both bases    | Exit 0; keyboard controls, stable scene, all preset fields, legacy migration, independent static material/wing changes and desktop/mobile footer captures |
| `qa/phoenix-v2.mjs`, repository base   | Exit 0; motion/static/material/quality checks and all-brand navigation pass                                                                               |
| `qa/lifecycle.mjs`, repository base    | Exit 0; render/audio pause and resume, no continuing static RAF                                                                                           |
| `qa/performance.mjs`, repository base  | Exit 0; four 30-second measurements across three desktop finishes and compact Iridescent                                                                  |
| `qa/budget.mjs`                        | Exit 0; both limits pass                                                                                                                                  |

The five new model tests check closed manifold feather/ribbon topology, finite normals/UVs/indices at both tiers, distinct joint phase lag, time/pointer-independent static poses, retained joint hierarchy and tails at low quality, and continuity/construction state at chapter boundaries. Additional tests cover a curved right-to-left flight and bank, reverse scroll, footer-space fitting, real DOMRect getters, shared chapter controls and complete preset save/reset/restore, reduced-motion control availability, v1/v2 migration, v4 appearance round trips, invalid appearance rejection and native radio keyboard behavior. Existing tests cover unequal chapter heights, dialogs and static reading. jsdom tests do not establish rendering quality.

The existing shared Three.js chunk warning remains (~550 kB raw / 137 kB gzip in the current installation). Current observed versions are Vite 7.3.7, React 19.3.1, Three 0.186.1 and Playwright 1.64.1; no package or lockfile was changed for this refinement. No warning threshold, CSS guard or code-splitting check was disabled.

## Browser and visual review

Real Chrome/WebGL checks at `/` and `/landingpage-parallax/`: catalog → Aether uses a fresh document, direct reload and hashes work, return/back works, camera/chapter mapping retraces in reverse, keyboard case-study dialogs retain focus/Escape behavior, sound remains opt-in, and material/preset/quality controls work. Low/high and responsive auto-quality reinitialization pass. The no-GPU, blocked scene-chunk and lost-context scenarios preserve content and recover through their explicit actions. Aether loads one private brand CSS and local fonts; the catalog does not start its scene or Lenis. Luma and Apex catalog links/direct reload remain valid.

Checked 360×800, 390×844, 768×1024, 1440×900, 844×390 landscape and OS reduced-motion emulation. No horizontal overflow or page errors were found. Visual iterations corrected the parallel feather rows, weak torso/neck definition, overly bright reflections, and clipped wing tips on compact Reimagine. Compact scale is capped against the view width for the articulated wing envelope; the material-study preview also fits its aspect ratio.

- Current shader appearances and [refinement](refinement.md): [implementation](appearances.md), [ordinary report](qa/normal-appearances.json), [repository-base report](qa/pages-appearances.json); captures [Iridescent](qa/pages-appearance-iridescent.png), [Holo](qa/pages-appearance-holo.png), [Magma](qa/pages-appearance-magma.png).
- Before v2: [hero](qa/before-v2-hero.png), [Formation](qa/before-v2-formation.png).
- Current desktop: [Spark](qa/pages-hero.png), [Formation / oblique view](qa/pages-formation.png), [Resonance](qa/pages-resonance.png), [Rebirth / front view](qa/pages-rebirth.png), [customizer](qa/pages-customizer.png).
- Current mobile: [Spark](qa/pages-mobile-spark.png), [Formation detail](qa/pages-mobile-formation-detail.png), [Reimagine](qa/pages-mobile-reimagine.png).
- [Recorded browser motion](qa/phoenix-v2-motion.webm): actual live WebGL and native scroll, not a replacement video used by the site.
- [New-model checks](qa/phoenix-v2.json): idle canvas pixels change, static canvas frames remain byte-identical across time, changing appearance alters the frozen rendering, high/low telemetry matches 701/276 feathers, 17 batches and nine tails.
- Story-workshop follow-up: [notes](story-workshop.md), [ordinary-base report](qa/normal-workshop.json), [repository-base report](qa/pages-workshop.json). Visual evidence: [banked crossing](qa/pages-workshop-bank.png), [flight controls](qa/pages-workshop-formation.png), [light controls](qa/pages-workshop-rebirth.png), [full portrait above footer](qa/pages-workshop-footer.png), [mobile portrait](qa/pages-workshop-mobile-portrait.png) and [mobile footer](qa/pages-workshop-mobile-footer.png). Every individual wing-shape/light control changes the frozen WebGL study while preserving static time.
- [Lifecycle](qa/lifecycle.json): real scene RAF and Web Audio suspension are instrumented. Visibility is simulated with `document.hidden`/`visibilitychange`; this is not a claim of a physical OS tab-switch test.
- Full records: [normal](qa/normal-report.json), [GitHub Pages](qa/pages-report.json). Unexpected console/page/WebGL/HTTP errors: zero in both ordinary flows. Motion/static crystal screenshots also compare encoded RGB channel means; they share the exact geometry, materials, camera and normal/discovered states rather than separate SVG styling.

The context-loss test now waits for the newly mounted canvas to finish renderer initialization before deliberately losing its context. The previous root-only readiness check could race that initialization after switching out of static mode; its synthetic premature context loss caused a precision-probe error. All current ordinary-flow reports pass without filtering that error.

The former glass treatment has been removed. Normal-deformation approximations remain documented in [phoenix-v2.md](phoenix-v2.md). Visual review applies to the tested Chrome/M4 environment, not every browser/GPU.

## Performance and budgets

Apple M4 Pro, macOS 26.5.2, Chrome 155.0.8059.85, ANGLE/Metal; headless, visible document, no CPU/GPU throttling. After warm-up, each run records 30 seconds of requestAnimationFrame intervals while native scroll traverses all four chapters forward and backward with reading holds. These are frame-interval measurements, not GPU timer queries or power measurements. [Raw results](qa/performance.json).

| Environment / finish                        | CSS viewport / device DPR / actual canvas | Tier | Mean FPS | p95 frame interval | Maximum interval |
| ------------------------------------------- | ----------------------------------------- | ---- | -------- | ------------------ | ---------------- |
| M4 Pro / Iridescent GLSL                    | 1440×900 / DPR 2 / 2160×1350              | high | 60.00    | 16.7 ms            | 16.8 ms          |
| M4 Pro / Holo Wireframe                     | 1440×900 / DPR 2 / 2160×1350              | high | 60.00    | 16.7 ms            | 16.8 ms          |
| M4 Pro / Solar Magma GLSL                   | 1440×900 / DPR 2 / 2160×1350              | high | 60.00    | 16.7 ms            | 16.8 ms          |
| Mobile viewport emulation / Iridescent GLSL | 390×844 / DPR 3 / 390×844                 | low  | 60.00    | 16.7 ms            | 16.8 ms          |

All three desktop finishes meet the requested ≥45 FPS and p95 ≤40 ms targets. **Real-phone ≥30 FPS remains unverified**: responsive emulation uses the M4 desktop GPU. Safari, Firefox and physical touch-device GPU/audio behavior were not measured.

[Conservative asset budget](qa/budget.json): **1.139 MiB** for Aether HTML, every reachable static/dynamic JS and CSS file, and every Aether public file, without gzip/cache discounts; limit 18 MiB. QA screenshots, archived reference and video are documentation and are not fetched by the site.

| Tier | Geometry/instance buffers | Environment texture | Light field     | Potential Holo line cache | HDR bloom colour/depth | Total     | Limit |
| ---- | ------------------------- | ------------------- | --------------- | ------------------------- | ---------------------- | --------- | ----- |
| high | 547,764 bytes             | 1,572,864 bytes     | 1,048,576 bytes | 197,760 bytes             | 2,580,480 bytes        | 5.672 MiB | 8 MiB |
| low  | 312,240 bytes             | 688,128 bytes       | 1,048,576 bytes | 103,680 bytes             | 478,464 bytes          | 2.509 MiB | 8 MiB |

These are geometry/instance/texture payloads plus explicit bloom target colour/depth storage, excluding other renderer framebuffer allocations and shader programs; they are not total GPU memory. Main default-Iridescent render counts: **191,588 triangles high**, **35,580 low**. The low-resolution HDR source repeats the sculpture draw; blur/composite use full-screen triangles. Feather instances: **701 / 276**, in **17 batches** at both tiers, with **9 tail ribbons** each. The line-cache allowance covers entering Holo, even though it is not the initial finish. Resource reduction preserves all three appearances, joints and content.

The wide 2404×1268 capture measures an approximately 802-pixel coloured silhouette, fully in the left column. At 1440×900 it is approximately 517 pixels wide. Discovered crystal motion/static channel means differ by less than four encoded RGB levels in the tested captures; this is a screenshot comparison, not a physical colour measurement.

## Run / preview

The retained production preview is running at:

**http://127.0.0.1:4185/landingpage-parallax/aether-story/**

Temporary development/ordinary-base servers on 5184 and 4184 were stopped. To run development from the retained worktree:

```sh
cd /Users/toannguyen/Documents/personal-repos/landingpage-parallax-worktrees/aether-phoenix-v2
bun run dev --host 127.0.0.1 --port 5184 --strictPort
```

To rebuild/restart the production preview (stop its existing server before reusing 4185):

```sh
cd /Users/toannguyen/Documents/personal-repos/landingpage-parallax-worktrees/aether-phoenix-v2
VITE_GITHUB_PAGES=true bun run build
VITE_GITHUB_PAGES=true bun run preview --host 127.0.0.1 --port 4185 --strictPort
```

The current `dist/` uses the repository base. Run `bun run build` before serving a root-base preview. All four documents remain in the build output.
