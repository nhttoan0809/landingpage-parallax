# Aether Studio — design & implementation

An original fictional studio and glass phoenix, inspired by the narrative pacing of [Noomo’s case study](https://noomoagency.com/insights/the-power-of-digital-storytelling-website), accessed 2026-10-23. No Noomo model, artwork, logo, soundtrack, UI, or source is reused.

## Direction before implementation

The glass sculpture is the memorable element. Quiet gallery furniture frames it: a silver-lilac ground `#eeedf4`, ink `#272536`, smoke `#686273`, amethyst `#785c91`, night `#171522`, pearl `#faf9ff`. Cormorant Garamond is the expressive exhibition face; Manrope is the functional face. Both are locally hosted. Sparse chapter numbers communicate the real four-part sequence. Text stays left aligned except the central final reveal. No dashboard cards or decorative metric badges.

Desktop: asymmetric title left / full phoenix right; formation draws closer to the feathers; resonance becomes a dark three-crystal gallery; rebirth restores a full symmetric silhouette; the last composition leaves room for material controls. Mobile uses centered sculpture placement, shorter camera moves, stacked crystals, and ordinary scrolling without any pin. All content lives in normal HTML flow.

Plan critique: the initial generic dark portfolio / sans-only search result did not fit the requested silver exhibition. Keep its verified storytelling / accessible reading guidance, replace its palette and typography with the gallery direction above. The light-to-dark change carries a narrative function: reading the project stories.

## Skill research

Used repository UI UX Pro Max search.py (in this worktree):

- `"creative studio immersive exhibition" --design-system -p "Aether Studio"`: verified Scroll-Triggered Storytelling / Motion-Driven result. Adopt complete DOM order, progress navigation, shorter mobile choreography, and static final states. Override black/white palette and Archivo/Space Grotesk to match the brief.
- `"reduced motion" --domain ux`: verified Reduced Motion, Excessive Motion, Motion Sensitivity. Disable parallax, continuous time and camera travel in static mode.
- `"transmission performance dispose" --stack threejs`: verified geometry/texture disposal and linear color management recommendations.

Applied frontend-design (deliberate identity, critique after rendering), vercel-react-best-practices (lazy scene module, refs for transient frames), gsap-react (scoped useGSAP and revert), gsap-scrolltrigger (one reversible timeline, refresh after resize).

## Storyboard

| Chapter   | Copy / interaction                                             | Sculpture                                            |
| --------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| Spark     | Some ideas are born to rise. Start story / Read without motion | Full, asymmetrically lit phoenix                     |
| Formation | Give the invisible a form. Idea, structure, expression         | Wing unfolds; three-quarter camera reveals thickness |
| Resonance | A story finds its echo. Three fictional project case studies   | Bird retreats; three independently lit 3D crystals   |
| Rebirth   | Never the same. Always becoming.                               | Full frontal phoenix reassembled in a quiet climax   |
| Reimagine | Make a little light your own. Palette / dispersion / glow      | Close material preview responds to controls          |

## Technical decisions

Three.js WebGLRenderer (not WebGPU), procedural closed-volume feather geometry, MeshPhysicalMaterial transmission / IOR / thickness / dispersion. Environment generated locally with PMREM; no external HDRI. Native scroll; GSAP ScrollTrigger drives a single plain-object progress ref, not React frame state. No smooth-scroll provider. See assets.md for asset sources and validation.md for measured QA.

## Model, light and glass

Blender, Houdini and ZBrush are not available in this environment. The model is original procedural geometry (`phoenix.ts`), not a converted Noomo asset. A continuous curved lathe surface joins the body, neck and head; a separate pointed beak, two eyes, four crest feathers, nine tail ribbons and two independently pivoted wings complete the silhouette. Each wing has 18 primaries and 13 shorter coverts. Closed lenticular feathers have 15 longitudinal intervals and 12 cross-section sides. Geometry is merged into three material groups per wing to keep draw calls low; wing groups remain independently animated. No GLB, Draco, KTX2 or CDN decoder is needed.

`scene.ts` creates five luminous reflection panels in an original dark studio environment and bakes them locally with PMREM (128 px cube faces in high, 64 px in low). An original 512² light field provides opaque scenery for the transmission pass. MeshPhysicalMaterial uses transmission 1, IOR 1.48, per-group thickness, environment reflection, absorption, clearcoat and RGB dispersion. Glass opacity is not implemented as a CSS gradient.

These are real-time approximations: a screen-space transmission pass samples opaque scene colour, not recursive ray-traced layers of feathers. Separate glass layers do not refract one another accurately. Thickness is a material approximation, not a baked distance-to-exit field. Three's dispersion separates RGB directions rather than tracing a continuous spectrum. Iridescence approximates thin-film colour. There are no caustics, spectral path tracing or volume-scattering claims. The restrained three-quarter turn avoids long stacks of overlapping glass; front-face rendering, depth testing and controlled material render order keep the silhouette stable.

`glassShader.ts` retains Three's physical shader and adds an art-directed grazing-angle contour. With `r = (1 - |N·V|)^1.65`, it multiplies outgoing light toward the palette's edge colour by `r × contrast`, then adds a narrow `r^10` glint. Edge colour and contrast update at runtime with the palette / dispersion controls. This exaggerated contour is an artistic readability adjustment, not another physical dispersion model.

`energyShader.ts` is the separate original GLSL energy effect. Seeds are distributed deterministically with the golden angle. Vertex positions receive bounded sine displacement. Fragment alpha is `radialFalloff² × valueNoise(time, seed) × wave × glow × energy`. Cubic smoothstep interpolates the hash-based 1D value noise. Runtime inputs are `uTime`, `uGlow`, `uEnergy`, `uDpr`, `uColor` and seed attributes. It uses normal alpha blending with depth writes off, no screen feedback or history buffer. Static mode freezes time and renders only on initial layout, resize or a control change.

## Timeline, layout and interaction

One scoped `useGSAP` timeline scrubs a plain scroll-position object; `progressAt` maps the actual chapter offsets into four equal narrative intervals. It handles unequal stacked-gallery heights, resize and the inline reading expansion. `sampleStory` uses smoothstep between explicit desktop / mobile poses, with an 18% reading hold. Backward scroll retraces the same stateless pose. Navigation state changes only at chapter boundaries. There is no React state update per render frame.

The canvas is transparent over complete HTML sections. The dark gallery owns a solid HTML background; a scissor excludes the light sculpture from its bounds, preserving white-text contrast at partial scroll positions. Three real prism meshes render in scissored HTML slots. Mouse parallax is bounded to 0.045 / 0.025 radians and disabled on compact touch layouts and static mode. Mobile Formation follows its ordinary-flow sculpture slot instead of pinning or flying behind its paragraphs. Tablet portrait applies an additional fit adjustment. No chapter uses scroll-jacking or pin spacing.

Buttons open native HTML dialogs. Escape, explicit close, a focus loop, body scroll lock and trigger-focus restoration are provided. Full stories can also be expanded inline, and are automatically present in static mode. Crystal hover and keyboard focus have matching feedback and optional notes. A user gesture is required to create the Web Audio graph: three quiet sine tones supply the ambient bed, and one short enveloped note represents each crystal. Mute closes the graph; hidden-tab visibility suspends/resumes it.

Palette, dispersion and glow update the actual materials, contour uniforms and particle uniforms. Presets have `schema: "aether.phoenix"`, `version: 1`; parsing rejects malformed JSON, arrays, unsupported schemas / versions, unknown palettes, missing fields, non-numeric or out-of-range values and files over 16 KB. Unknown extra fields are stripped. Save / restore uses localStorage with guarded access; export / import uses local JSON files and object URL cleanup.

## Failure and lifecycle

The headline, CTA and complete HTML story do not wait for the scene. Local WebP / SVG images illustrate the fallback. There is a 15-second import timeout, clear status, retry and a reading-mode action. A lost context disposes its old renderer and retry mounts a new canvas. Scene initialization has a rollback path; normal teardown removes RAF, observers, pointer / media / visibility listeners, geometry, materials, field texture, environment target and renderer-owned transmission targets. The audio hook closes its context. GSAP reverts its scoped timeline. A hidden document stops frame scheduling and resets the frame clock when it returns.

## Quality tiers

| Setting                 | High                                    | Low             |
| ----------------------- | --------------------------------------- | --------------- |
| DPR cap                 | 1.5                                     | 1               |
| Antialias               | On                                      | Off             |
| Transmission resolution | 0.75 × viewport                         | 0.45 × viewport |
| Energy seeds            | 180                                     | 60              |
| PMREM cube face size    | 128                                     | 64              |
| Shadows / bloom         | Neither; studio reflections define form | Neither         |

Automatic selects low at ≤767 px or hardwareConcurrency ≤4. A manual quality selector is available. Both retain genuine transmission, the complete silhouette and all content. Reduced motion replaces the fixed story canvas with static posters and a local on-demand material study. No camera travel, mouse parallax, time animation or long pin remains. Without WebGL, colour preview is illustrative and there is no claim of live optical material rendering.

## References checked 2026-10-23

- [Noomo's original case study](https://noomoagency.com/insights/the-power-of-digital-storytelling-website): narrative inspiration and original production pipeline; no asset rights inferred.
- [Three MeshPhysicalMaterial](https://threejs.org/docs/pages/MeshPhysicalMaterial.html), plus installed r186 source: transmission, dispersion, environment lighting and disposal.
- [GSAP React](https://gsap.com/resources/React/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and official Context7 `/greensock/react` docs: scoped cleanup, reversible scrub and refresh.
- [GSAP Standard No Charge License](https://gsap.com/community/standard-license/): installed GSAP / React adapter use this license, not MIT. This site is a fictional studio experience with material controls, not a visual animation authoring product.

The lightweight SceneView shell is bundled with the HTML story entry, so there is no additional uncaught React.lazy wrapper-chunk failure. Only the heavy Three.js scene is dynamically imported, inside its guarded timeout / error path. A failed module import offers an explicit document reload (ES module import failures can be cached by the browser). Shader compilation errors also enter the illustrated fallback.
