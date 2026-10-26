# Articulated phoenix — implementation and review

> Current behavior: the [2026-10-26 refinement](refinement.md) supersedes earlier Glass/palette, departure and final-scale details below. Anatomy provenance remains applicable.

Implemented 2026-10-25; story and customization extended 2026-10-26 from the user-supplied, AI-assisted `noomo_phoenix_3d_the_power_of_digital_storytelling.html`. The original file remains untouched in the source checkout. A byte-for-byte reference copy is retained at [reference/phoenix-prototype.html](reference/phoenix-prototype.html); it is documentation, not a production entry. Its CDN scripts, Noomo-labelled UI, exporters, opaque GLSL material and post-processing engine are not loaded by Aether.

## Direction and reuse

Retain Aether's silver-lilac exhibition, local Cormorant/Manrope fonts, English copy, four chapters and HTML case studies. The sculpture supplies the motion; surrounding controls stay quiet. The prototype's torso rings, S-neck, beak, crest, layered coverts, three-joint wings and nine tail layout are ported to typed, page-owned code. Wing feather directions were revised to form a genuine outward fan rather than twisting parallel rows. The original lathe bird has been replaced.

The original prototype at Ultra measured 701 feathers, 733 mesh objects and 126,956 triangles in real Chrome/r128. The port uses 701 feather instances in 17 batches at high quality, or 276 in 17 batches at low. Both have a shoulder → elbow → wrist hierarchy on each side, separate neck/head, and nine ribbons. Closed two-sided volumes increase triangle count, while batching dramatically reduces the object count and unique geometry storage. Triangle count is reported separately from memory.

UI UX Pro Max was read and its local search tool used: `"animation reduced motion" --domain ux` verifies Reduced Motion and Excessive Motion guidance. `"instances" --stack threejs` verifies shared material instances. Frontend Design's critique-after-render workflow was used for silhouette, feather fan, physical material readability and mobile framing. Current r186 [InstancedMesh documentation](https://github.com/mrdoob/three.js/blob/r186/docs/pages/InstancedMesh.html) was consulted through Context7 during planning. No additional runtime dependency was needed.

## Modules

- `phoenix/rig.ts`: anatomical layout adapted from the supplied prototype; joint hierarchy, batch construction and joint updates.
- `phoenix/geometry.ts`: repository-authored closed asymmetric feathers, raised shaft/camber, UVs, perimeter walls and tapered ribbon volumes.
- `phoenix/motion.ts`: pure shoulder/elbow/wrist sampling with phase lags, body counter-motion, neck/head tracking and tail-root sway.
- `phoenix/surface.ts`: repository-authored vertex displacement and feather microstructure injected into the physical glass shader.
- `story.ts`: reversible poses, independent compact composition, and continuous construction/scatter controls.
- `scene.ts`: existing renderer/environment, gallery scissoring, quality, preset updates, failure handling and lifecycle remain page-owned.

## Motion and story

Joint phase is `flightTime × 1.75`; `flightTime` accumulates elapsed seconds multiplied by the user-selected wingbeat speed, and pauses for a glide; shoulder uses `sin(phase)`, elbow lags by 0.55 rad and wrist by 1.05 rad. The body counter-heaves and pitches slightly, and the head/cervical joints respond to bounded desktop pointer values. Time is advanced by elapsed seconds with a 50 ms recovery cap; hidden-tab resume resets the clock. Scroll determines structural pose, while the flight cycle adds small motion. Static mode explicitly removes time and pointer contributions.

| Chapter   | Change                                                                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Spark     | Readable complete bird in three-quarter view. After its reading hold, a smooth construction pulse blends feather vertices toward block-shaped volumes, then restores the feathers. |
| Formation | Curved right-to-left flight and bank into a left-side pose; right-side copy lets the reader choose wingbeats, speed and openness. Mobile has its own sculpture slot.               |
| Resonance | Bounded local-space feather scatter while the bird retreats. The solid HTML gallery and its three crystal/case-study interactions retain priority.                                 |
| Rebirth   | Scatter closes, the full bird returns on the right, and independent iridescence, dispersion and glow controls set its light.                                                       |
| Reimagine | Choose Opal/Tide/Ember, review the inherited rhythm/light, and save the personal portrait. Fitted framing keeps feathers and tail above the footer.                                |

`sampleStory` remains stateless: reverse scroll retraces the camera, joints and assembly state. The prototype's abrupt geometry swap at a voxel threshold has been replaced by a same-topology shader blend. No frame-by-frame React state or independent animation loop is introduced.

## Glass and shader limits

In Prismatic Glass, body and main feathers retain actual MeshPhysicalMaterial transmission/refraction, environment reflections, absorption, IOR and RGB dispersion. Coverts use a less transparent physical material (transmission 0.55) to make the torso and neck readable. Feather and ribbon thicknesses, UVs and normals are generated as geometry. The lighting is restrained; there is no bloom pass.

Feather vertex displacement is `sin(time × 2.8 + phase + uv.y × 4) × amplitude × uv.y²`. Instance attributes carry deterministic phase, amplitude and outward scatter, transformed into blade-local coordinates so they follow their joint. Ribbon waves use `sin(uv.y × 5.2 − time × 2.2 + ribbonPhase) × uv.y^1.35`, with a smaller lateral cosine. All nine tails deform on the GPU; CPU vertex-array uploads were removed. A shaft mask and diagonal sine pattern add subtle roughness variation. Small-slope normal corrections are an approximation, not a cloth solver.

Glass still uses Three's screen-space transmission: overlapping feather layers do not recursively refract one another, instanced feathers are not individually transparency-sorted, and the shader does not implement spectral path tracing or caustics. Front-side closed volumes, depth tests, restrained viewing angles and per-joint/material batching were reviewed at front and oblique poses. These limits remain explicit.

## Quality, compatibility and lifecycle

High/low reduce feather density and blade/ribbon subdivisions as well as the existing DPR, transmission resolution, PMREM and particle settings. Low retains every major joint and nine tails. Preview framing adapts to aspect ratio; compact story positions remain distinct from desktop.

Preset v3 adds four appearance choices to palette, dispersion, glow, iridescence, wingbeat enable/speed and openness. V1/V2 migrate to Prismatic Glass with their previous values preserved; the original storage key remains readable. Manual/OS reduced motion freezes the live study and uses a regenerated local poster for reading. No-GPU and failed-chunk fallbacks keep all HTML content available. Cleanup now also calls InstancedMesh.dispose to release instance-specific buffers, in addition to existing geometry/material/texture/renderer disposal.

## Reproduce

Use the worktree root and install dependencies with `bun install --frozen-lockfile`.

```sh
bun run dev --host 127.0.0.1 --port 5184 --strictPort
# Another terminal:
AETHER_QA_URL=http://127.0.0.1:5184/ node docs/landings/aether-story/qa/render-assets.mjs
bun run lint
bun run test --run
bun run build
bun run preview --host 127.0.0.1 --port 4184 --strictPort
AETHER_QA_URL=http://127.0.0.1:4184/ node docs/landings/aether-story/qa/run.mjs
```

Video QA uses a worktree-local Playwright ffmpeg download:

```sh
PLAYWRIGHT_BROWSERS_PATH=./node_modules/.cache/ms-playwright bunx playwright install ffmpeg
PLAYWRIGHT_BROWSERS_PATH=./node_modules/.cache/ms-playwright AETHER_QA_URL=http://127.0.0.1:4184/ node docs/landings/aether-story/qa/phoenix-v2.mjs
```

The follow-up choreography, chapter controls and footer fix are documented in [story-workshop.md](story-workshop.md). Current results and limitations are in [validation-v2.md](validation-v2.md). The older `validation.md` contains the original 2026-10-23 baseline.

The vivid Iridescent GLSL, actual Holo Wireframe and Solar Magma GLSL extensions are documented in [appearances.md](appearances.md). They reuse this anatomy and lifecycle.
