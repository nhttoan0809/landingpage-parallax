# Flight, light and discoveries — 2026-10-26

This refinement implements the user's five follow-up requests. It supersedes earlier Prismatic Glass/palette and analytic-only glow descriptions. Current validation: [validation-v2.md](validation-v2.md).

## Three appearances, one choice

Prismatic Glass and the separate palette chooser are removed. Iridescent GLSL, Holo Wireframe and Solar Magma GLSL each own their coherent colour direction. Rebirth chooses the appearance and its light; Reimagine reviews and saves it. Preset **v4** contains appearance, dispersion, glow, iridescence, wingbeat enable/speed and openness, with no palette field. V1–V3 files remain readable: the removed glass finish maps to Iridescent, obsolete palettes are discarded, and numeric choices are retained. A v1 file retains its historical 45% iridescence default.

The three current finishes are stylized opaque shader treatments. Spectral dispersion controls colour separation in Iridescent; it is not advertised as physical refraction. The Holo/Magma dispersion input is disabled with an explanation. No glass/transparency option remains in the interface.

## Actual luminous highlights

`glassShader.ts` now produces narrow, HDR feather glints and a travelling sheen. The sheen combines world-space movement, a feather-fibre mask and a high-power directional glint. Iridescence scales its radiance strongly, while inner glow also affects intensity. Holo's scan and Magma's hot edges generate HDR highlights too. Static mode freezes all time inputs.

`bloom.ts` extracts these highlights from an actual render of the sculpture, with tone mapping disabled for its HDR source. A threshold of 1.05 excludes the ordinary light-page background. Two separable Gaussian blur passes spread the light, then a transparent, colour-managed composite places the soft radiance back around the rendered feathers. This is a render-target bloom effect, in addition to the restrained analytic aura; it is not only a material tint or CSS filter.

The three RGBA16F targets are capped at 384 pixels on their longest side in high quality, 192 in low. Their colour storage plus a conservative 32-bit source depth allowance are included in the resource budget. Targets resize with the view and are explicitly disposed. The composite respects the dark gallery scissor, so it cannot wash over the case-study text. Three.js r186 render-target sizing/disposal and colour-management documentation were checked against installed source and official Context7 documentation.

## Matching crystals, visible discovery

Previously the moving story used physical 3D crystals and the static story used independently drawn SVGs. Their materials and lighting differed. Static images are now rendered from the **same live geometry, material, environment, camera angle and state** by [qa/render-crystals.mjs](qa/render-crystals.mjs). A shared 5:4 slot keeps the projection consistent. Raster compression/antialiasing can create small pixel differences; the colour direction is shared.

Opening a project records a page-local discovered state. That crystal gains a luminous core and orbital ring, brighter facets, a “Story discovered” label and “Revisit concept” action. The state survives switching between motion and static reading. It does not overwrite the reader's phoenix settings. Native dialogs retain Enter/Escape, focus handling and complete readable case stories.

The renderer holds the same crystal angle in both modes. Hover/focus gives the same scale feedback, while discovery supplies the lasting visual transformation. Still assets have both normal and awakened variants, so reduced motion and no-GPU reading can show that state without an animation loop.

## Depart and return

Formation retains its initial reading pose on the left, then the entire phoenix flies beyond the left edge. It is absent throughout the central gallery. As Rebirth enters the viewport it arrives from beyond the right edge, banks in and settles beside the controls. Compact layouts have shorter travel. Reverse scroll retraces the same stateless flight. A dedicated interpolation keeps the held Rebirth pose continuous into the final portrait.

The GSAP scrub now stores a normalized 0–1 value, then maps it through current section offsets. Refresh recomputes that mapping immediately. This prevents an old pixel-distance tween from leaving the phoenix behind its controls after a wide-screen resize.

## A larger final portrait

The final sculpture slot is taller and uses some of the open gutter to the left of the save panel. The fit uses a tighter measured wing/tail envelope and a larger scale. Desktop still clamps the portrait above the footer; mobile follows its normal content slot. Review includes the user's 2404×1268 layout, 1440×900 and 390×844. Pixel-bound checks verify that the coloured silhouette stays in the left column after resize and that its tail remains above the footer.

## Evidence

[qa/refinement.mjs](qa/refinement.mjs) checks removal of Glass/palette, discovery state, motion/static crystal colour, departure/return screenshots, actual final-portrait pixel bounds after resize, footer clearance and v4 persistence. Unit tests cover departure/absence/re-entry, pose continuity, legacy migration and discovery interactions. Existing browser checks cover fallback, quality, hashes, document isolation and reduced motion.

- [Flight leaving left](qa/pages-refined-leaving-left.png), [return from right](qa/pages-refined-returning-right.png)
- [Crystals before discovery](qa/pages-refined-crystals-motion.png), [after discovery](qa/pages-refined-crystals-discovered.png), [same state without motion](qa/pages-refined-crystals-static.png)
- [Wide final portrait](qa/pages-refined-portrait-2404.png), [wide footer](qa/pages-refined-footer-2404.png), [mobile portrait](qa/pages-refined-portrait-390.png)
- [Ordinary-base report](qa/normal-refinement.json), [repository-base report](qa/pages-refinement.json)

UI UX Pro Max's focused interaction-feedback search supplied general feedback guidance; native controls, visible state and reduced-motion behavior follow its accessibility defaults. Frontend Design's rendered critique found and corrected the wide-screen composition issue. No new runtime dependency was added and no package or lockfile was edited.
