# Three expressions of the phoenix

Current implementation, 2026-10-26. **Prismatic Glass and the palette chooser have been removed at the user's request.** This replaces the earlier four-finish implementation. Full flight/crystal/portrait changes: [refinement.md](refinement.md). Validation: [validation-v2.md](validation-v2.md).

| Appearance           | Current rendering                                                                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Iridescent GLSL**  | A saturated spectral surface with narrow directional glints, a moving feather sheen and HDR bloom. Iridescence scales colour contribution, highlight radiance and bloom strength. |
| **Holo Wireframe**   | Actual triangle-edge line draws, with cobalt/cyan light and a luminous scan.                                                                                                      |
| **Solar Magma GLSL** | Ember-dark feathers, moving molten veins, bright gold shafts/tips and bloom around hot edges.                                                                                     |

Each appearance owns its colour direction. Rebirth's native radio group chooses it, and Reimagine reviews/saves the result. There is no second colour-palette control. The three finishes are deliberately stylized opaque shader treatments, not claims of transparent glass. Dispersion is an artistic spectral-spread control for Iridescent and is disabled for the other two appearances with an explanation.

`appearances.ts` is data only. `glassShader.ts` retains the model's physical-material base and injects the current GLSL finishes; the filename reflects its earlier implementation. `bloom.ts` adds actual HDR highlight extraction, a separable Gaussian blur and a transparent composite. The existing analytic aura remains secondary. The geometry, joints, instance batching and story progress are shared across appearances; switching does not replace the canvas or renderer.

The supplied [prototype](reference/phoenix-prototype.html) was inspected for spectral/Fresnel ideas, feather anatomy, a moving magma wave and a real wireframe switch. Its r128 CDN application and post-processing implementation are not loaded. The current r186 integration and bloom pipeline were authored for this repository. Three.js r186 material hooks, render-target resizing/disposal and colour management were checked through official Context7 documentation and installed source.

Preset **v4** stores appearance and numeric motion/light settings, without a palette field. V1–V3 imports preserve numeric choices while discarding the removed palette; the old Glass appearance maps to Iridescent. Invalid v4 names/types/missing properties are rejected. The existing storage key remains readable. Static reading freezes the scan, sheen, molten flow and flight while retaining material controls in the local study.

The spectral overlay and molten shading are artistic approximations. Bloom uses an HDR bright-pass with a 1.05 threshold and three bounded RGBA16F targets, not an unbounded full-resolution post-processing chain. Alpha composition and gallery scissoring preserve readable HTML. Target storage is included in the resource budget; targets and shaders are disposed with the scene.

Evidence from real Chrome/WebGL:

- [Iridescent](qa/pages-appearance-iridescent.png), [Holo](qa/pages-appearance-holo.png), [Magma](qa/pages-appearance-magma.png)
- [Mobile Iridescent](qa/pages-appearance-mobile-iridescent.png), [mobile Holo](qa/pages-appearance-mobile-holo.png), [mobile Magma](qa/pages-appearance-mobile-magma.png)
- [Minimum iridescence](qa/pages-iridescence-0.png), [maximum iridescence](qa/pages-iridescence-1.png)
- [Ordinary-base checks](qa/normal-appearances.json), [repository-base checks](qa/pages-appearances.json)

The test observes actual GL.LINES draws, distinct frozen material renders, brighter coloured highlights, retained presets and reuse of warmed shader programs. Pixel luma is an encoded RGB screenshot statistic, not photometric luminance. Timing, memory accounting and physical-device limitations are in the validation report.
