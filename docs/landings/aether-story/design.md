# Aether Studio — design & implementation

An original fictional studio and procedural phoenix, inspired by the narrative pacing of [Noomo’s case study](https://noomoagency.com/insights/the-power-of-digital-storytelling-website), accessed 2026-10-23. No Noomo model, artwork, logo, soundtrack, UI, or source is reused.

Current model and story update (2026-10-26): [articulated phoenix v2](phoenix-v2.md), adapted from the user-supplied procedural HTML. See [current validation](validation-v2.md). The current three vivid finishes and preset v4 are described in [appearances.md](appearances.md).

## Direction before implementation

The luminous sculpture is the memorable element. Quiet gallery furniture frames it: a silver-lilac ground `#eeedf4`, ink `#272536`, smoke `#686273`, amethyst `#785c91`, night `#171522`, pearl `#faf9ff`. Cormorant Garamond is the expressive exhibition face; Manrope is the functional face. Both are locally hosted. Sparse chapter numbers communicate the real four-part sequence. Chapter copy stays left aligned; the sculpture and text alternate sides to motivate its flight. No dashboard cards or decorative metric badges.

Desktop: Spark pairs a title on the left with the phoenix on the right. Formation moves the copy and flight controls to the right while the bird arcs to the left. Resonance becomes a dark three-crystal gallery; Rebirth returns the full bird to the right of its light controls. Reimagine gathers the resulting portrait and palette/save controls. Mobile uses centered sculpture placement, shorter camera moves, stacked crystals, and ordinary scrolling without any pin. All content lives in normal HTML flow.

Plan critique: the initial generic dark portfolio / sans-only search result did not fit the requested silver exhibition. Keep its verified storytelling / accessible reading guidance, replace its palette and typography with the gallery direction above. The light-to-dark change carries a narrative function: reading the project stories.

## Skill research

Used repository UI UX Pro Max search.py (in this worktree):

- `"creative studio immersive exhibition" --design-system -p "Aether Studio"`: verified Scroll-Triggered Storytelling / Motion-Driven result. Adopt complete DOM order, progress navigation, shorter mobile choreography, and static final states. Override black/white palette and Archivo/Space Grotesk to match the brief.
- `"reduced motion" --domain ux`: verified Reduced Motion, Excessive Motion, Motion Sensitivity. Disable parallax, continuous time and camera travel in static mode.
- `"transmission performance dispose" --stack threejs`: verified geometry/texture disposal and linear color management recommendations.

Applied frontend-design (deliberate identity, critique after rendering), vercel-react-best-practices (lazy scene module, refs for transient frames), gsap-react (scoped useGSAP and revert), gsap-scrolltrigger (one reversible timeline, refresh after resize).

## Storyboard

| Chapter   | Copy / interaction                                                   | Sculpture                                              |
| --------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| Spark     | Some ideas are born to rise. Start story / Read without motion       | Full, asymmetrically lit phoenix                       |
| Formation | Give the invisible a form. Choose wingbeats, speed and openness      | Curved right-to-left flight; banked three-quarter view |
| Resonance | A story finds its echo. Three fictional project case studies         | Bird retreats; three independently lit 3D crystals     |
| Rebirth   | Give your phoenix its own light. Iridescence, dispersion, inner glow | Full bird on the right, retaining the chosen rhythm    |
| Reimagine | Make a little light your own. Palette, settings summary, save/export | Personal portrait settles above the footer             |

## Technical decisions

Three.js WebGLRenderer (not WebGPU), procedural closed-volume feather geometry, MeshPhysicalMaterial transmission / IOR / thickness / dispersion. Environment generated locally with PMREM; no external HDRI. Native scroll; GSAP ScrollTrigger drives a single plain-object progress ref, not React frame state. No smooth-scroll provider. See assets.md for asset sources and validation.md for measured QA.

## Model, light and glass

The current bird uses the user-supplied AI-assisted prototype's anatomy, ported to `phoenix/rig.ts`: a streamlined body, separate neck/head, curved beak, crest, layered wing feathers and nine tails. Each wing now has shoulder → elbow → wrist articulation. High quality uses 701 feather instances in 17 batches; low uses 276 while retaining every major joint and nine tail ribbons. Repository-authored closed feather/ribbon volumes, GPU deformation, continuous assembly blending and physical glass replace the prototype's plane feathers, per-mesh updates and opaque shader. Full provenance, equations and limits are in [phoenix-v2.md](phoenix-v2.md). No original Noomo asset, GLB, Draco, KTX2 or CDN decoder is loaded.

`scene.ts` creates five original photographic reflection panels and a local PMREM environment. The current three appearances use stylized opaque shading over a physical-material base; the prior glass option has been removed. `glassShader.ts` supplies spectral colour, directional glints, a travelling feather sheen, real wireframe line shading and molten veins. `bloom.ts` extracts actual HDR highlights, blurs them at bounded resolution and composites their radiance around the feathers. No remote HDRI, model or decoder is loaded. Current equations, appearance semantics and approximations are in [appearances.md](appearances.md) and [refinement.md](refinement.md).

`energyShader.ts` is the separate original GLSL energy effect. Seeds are distributed deterministically with the golden angle. Vertex positions receive bounded sine displacement. Fragment alpha is `radialFalloff² × valueNoise(time, seed) × wave × glow × energy`. Cubic smoothstep interpolates the hash-based 1D value noise. Runtime inputs are `uTime`, `uGlow`, `uEnergy`, `uDpr`, `uColor` and seed attributes. It uses normal alpha blending with depth writes off, no screen feedback or history buffer. Static mode freezes time and renders only on initial layout, resize or a control change.

## Timeline, layout and interaction

One scoped `useGSAP` timeline scrubs a plain scroll-position object; `progressAt` maps the actual chapter offsets into four equal narrative intervals. It handles unequal stacked-gallery heights, resize and the inline reading expansion. `sampleStory` uses an 18% reading hold and smoothstep timing. Desktop position and camera distance follow cubic Bezier arcs, with a sine bank, yaw/pitch lean and a modest scale reduction at mid-flight. Exact endpoints preserve composition and reverse-scroll continuity. Mobile retains a shorter centered path with smaller banks and ordinary-flow sculpture slots. Backward scroll retraces the same stateless pose. Navigation state changes only at chapter boundaries. There is no React state update per render frame.

The canvas is transparent over complete HTML sections. The dark gallery owns a solid HTML background; a scissor excludes the light sculpture from its bounds, preserving white-text contrast at partial scroll positions. Three real prism meshes render in scissored HTML slots. Mouse parallax is bounded to 0.045 / 0.025 radians and disabled on compact touch layouts and static mode. Mobile Formation and Rebirth follow their ordinary-flow sculpture slots instead of pinning or flying behind paragraphs. The final portrait follows a dedicated slot: desktop framing clamps its full feather/tail envelope into the space above the footer, shrinking as the credits approach. On mobile it leaves naturally with the preceding content, rather than floating over controls or credits. DOMRect coordinates are copied explicitly because browser DOMRect properties are non-enumerable getters. Tablet portrait applies an additional fit adjustment. No chapter uses scroll-jacking or pin spacing.

Buttons open native HTML dialogs. Escape, explicit close, a focus loop, body scroll lock and trigger-focus restoration are provided. Full stories can also be expanded inline, and are automatically present in static mode. Crystal hover and keyboard focus have matching feedback and optional notes. A user gesture is required to create the Web Audio graph: three quiet sine tones supply the ambient bed, and one short enveloped note represents each crystal. Mute closes the graph; hidden-tab visibility suspends/resumes it.

Formation owns wingbeat enable/disable, speed (0.25–2×) and wing openness; Rebirth owns three appearance options, independent iridescence, dispersion and inner glow. Dispersion is disabled for nonrefractive Holo/Magma finishes with a visible explanation. Reimagine supplies a settings summary, links back to both chapters and save/import/export. Each of the three appearances owns its colour direction; there is no palette chooser. All use one shared preset and update the existing scene. A separate accumulated wingbeat clock changes speed without resetting phase and pauses when wingbeats are disabled; a glide still has subtle surface/energy life. Hidden-tab resume resets only the elapsed-time clock. Static reading disables the two time-based controls and retains wing shape and material adjustments in its on-demand study.

Appearance, spectral dispersion, iridescence and glow update materials, feather/glint/particle/aura uniforms and bloom strength. Preset v4 validates the three appearances and numeric choices. Legacy v1–v3 imports preserve numeric settings, discard the removed palette and map Glass to Iridescent. Files over 16 KB, unknown versions and invalid fields are rejected without replacing current settings. The existing storage key is retained; local save/import/export has guarded access and object-URL cleanup.

The secondary analytic aura in `energyShader.ts` is an analytic 8×8 plane behind the bird, not a bloom post-process. With normalized radius `r`, its haze is `exp(-4r²) × (1 - smoothstep(0.65,1,r))`, with a faint Gaussian ring at radius 0.58. Alpha scales with the Inner glow control and uses the palette edge colour. It is disposed with the scene. The separate HDR bloom pipeline now uses bounded render targets whose storage is included in the budget.

## Failure and lifecycle

The headline, CTA and complete HTML story do not wait for the scene. Local WebP / SVG images illustrate the fallback. There is a 15-second import timeout, clear status, retry and a reading-mode action. A lost context disposes its old renderer and retry mounts a new canvas. Scene initialization has a rollback path; normal teardown removes RAF, observers, pointer / media / visibility listeners, geometry, materials, field texture, environment target and renderer-owned transmission targets. The audio hook closes its context. GSAP reverts its scoped timeline. A hidden document stops frame scheduling and resets the frame clock when it returns.

## Quality tiers

| Setting                 | High                                    | Low                   |
| ----------------------- | --------------------------------------- | --------------------- |
| Feather instances       | 701 in 17 joint/material batches        | 276 in 17 batches     |
| Tail ribbons            | 9, GPU-deformed                         | 9, fewer subdivisions |
| DPR cap                 | 1.5                                     | 1                     |
| Antialias               | On                                      | Off                   |
| Transmission resolution | 0.75 × viewport                         | 0.45 × viewport       |
| Energy seeds            | 180                                     | 60                    |
| PMREM cube face size    | 128                                     | 64                    |
| Shadows / bloom         | Neither; studio reflections define form | Neither               |

Automatic selects low at ≤767 px or hardwareConcurrency ≤4. A manual quality selector is available. Both retain genuine transmission, the complete silhouette and all content. Reduced motion replaces the fixed story canvas with static posters and a local on-demand material study. No camera travel, mouse parallax, time animation or long pin remains. Without WebGL, colour preview is illustrative and there is no claim of live optical material rendering.

## References checked 2026-10-23

- [Noomo's original case study](https://noomoagency.com/insights/the-power-of-digital-storytelling-website): narrative inspiration and original production pipeline; no asset rights inferred.
- [Three MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html), plus installed r186 source: transmission, dispersion, environment lighting and disposal.
- [GSAP React](https://gsap.com/resources/React/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and official Context7 `/greensock/react` docs: scoped cleanup, reversible scrub and refresh.
- [GSAP Standard No Charge License](https://gsap.com/community/standard-license/): installed GSAP / React adapter use this license, not MIT. This site is a fictional studio experience with material controls, not a visual animation authoring product.

The lightweight SceneView shell is bundled with the HTML story entry, so there is no additional uncaught React.lazy wrapper-chunk failure. Only the heavy Three.js scene is dynamically imported, inside its guarded timeout / error path. A failed module import offers an explicit document reload (ES module import failures can be cached by the browser). Shader compilation errors also enter the illustrated fallback.

## Story workshop follow-up — 2026-10-26

Focused UI UX Pro Max searches: `"slider live preview" --domain ux` did not provide a relevant slider match. The narrower `"keyboard accessible range slider" --domain ux` returned generic control semantics / accessible-name guidance, not a verified slider-specific result. Native range and checkbox controls, visible labels, keyboard operation and reduced-motion behavior follow the skill’s built-in accessibility defaults. The two fieldsets progressively introduce motion, then light; they share state instead of repeating every option at the end.

See [story workshop notes](story-workshop.md) for the flight/framing regression and browser evidence.

Current follow-up: [refinement.md](refinement.md) supersedes the earlier palette/glass and simple departure descriptions. Formation now exits fully left; Rebirth enters from the right; matching normal/awakened crystal stills come from the live renderer; the larger final portrait is checked after wide-screen resize.
