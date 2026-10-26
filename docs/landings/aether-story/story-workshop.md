# A phoenix shaped by its reader

> Current behavior: the [2026-10-26 refinement](refinement.md) supersedes earlier Glass/palette, departure and final-scale details below. Anatomy provenance remains applicable.

Implemented 2026-10-26 in the retained `feat/aether-phoenix-v2` worktree. This follow-up completes the requested flight choreography, footer fix and chapter-level customization. Model provenance remains in [phoenix-v2.md](phoenix-v2.md); current checks are in [validation-v2.md](validation-v2.md).

## Narrative and composition

- **Spark:** an idea is born, with copy on the left and the glass bird on the right.
- **Formation:** the bird arcs upward and across to the left, banks into an oblique view and settles beside the right-aligned copy. The reader chooses whether it beats its wings or glides, the wingbeat speed (0.25–2×) and how open the wings are. These settings continue through the story.
- **Resonance:** the bird scatters and retreats for the dark case-study gallery. The three complete HTML stories and crystal interactions retain their reading space.
- **Rebirth:** it returns on the right with the rhythm already chosen. The reader gives it an independent iridescent surface, RGB dispersion and an inner glow. The light is a continuation of the original spark.
- **Reimagine:** the final personal portrait inherits both chapters, adds Opal/Tide/Ember colour, summarizes its rhythm/wings/light and provides links to revisit either chapter. Save, restore, reset, JSON import/export and quality remain here.

Desktop uses cubic Bezier position and camera-distance curves with a smoothstep parameter. A sine bank reaches approximately 15° during the first crossing; yaw and pitch lean into the turn, and scale recedes slightly mid-flight. An 18% reading hold at the start of each interval and zero-speed endpoints avoid abrupt changes. There is no path history: reversing scroll samples exactly the same pose. Mobile retains a shorter centered path, smaller banks, stacked content and ordinary-flow sculpture slots; it does not pin the page or intercept touch scrolling.

## Footer regression

The former final pose used a fixed low world-space position. An opaque footer entering the viewport could cover its body, feathers and tail. `framing.ts` now derives a portrait frame from a dedicated DOM slot and the footer's actual viewport position. Desktop keeps the entire envelope between the header clearance and 28 px above the footer, fitting its scale to the available width and height. If insufficient space remains it leaves the scene. Mobile follows its normal content slot and leaves before the credits; it does not hover over the save controls.

A related mobile bug was found during real-browser review: spreading a `DOMRect` omits its prototype-backed coordinates. Explicit coordinate reads now preserve finite portrait dimensions. The regression test uses a real DOMRect instance, not only a plain object.

## Runtime and persistence

`ChapterControls.tsx` uses native labelled ranges and a keyboard-operable switch in two fieldsets. One React preset owns all values. `SceneHandle.update` changes the existing scene rather than creating a renderer for each input. A separate wingbeat clock accumulates `delta × speed`, so changing speed does not reset phase. Disabling wingbeats removes their joint amplitude and pauses that clock; subtle surface and energy motion remain during the glide. Hidden-tab resume clears the elapsed-time timestamp while retaining accumulated phase.

Independent iridescence updates `MeshPhysicalMaterial.iridescence`. Dispersion updates real RGB transmission dispersion and the art-directed contour. Inner glow updates emissive intensity, particles and an original analytic aura behind the bird. The aura is a single alpha-blended plane with radial exponential haze and a faint Gaussian ring; no bloom pass or extra texture/framebuffer is introduced. All new resources use existing disposal paths.

Preset schema **v3** now stores the appearance alongside the original seven user choices: palette, dispersion, glow, iridescence, wingbeat enable, wingbeat speed and wing openness. V1/V2 imports and existing localStorage records remain readable and migrate to Prismatic Glass. See [current appearance implementation](appearances.md). Invalid values, types, versions and oversized files are rejected without replacing the current selection. The original localStorage key remains intentional for compatibility.

Reduced motion disables the wingbeat switch and speed control. Wing shape and light can still be adjusted in the frozen on-demand material study; independent changes were verified against its rendered canvas. The study remains pixel-identical across time after input settles. Chapter copy, links, images and stories remain accessible without WebGL.

## Evidence and reproduction

`qa/story-workshop.mjs` runs with real Chrome/WebGL. It checks native keyboard range/switch operation, stable canvas identity while changing controls, every saved/exported field, v1 migration, independently visible wing/light changes in static rendering, and captures desktop/mobile portraits and footer states. Unit tests cover the DOMRect regression, available footer space, curved/reversible flight and cross-chapter save/reset/restore.

- [Banked crossing](qa/pages-workshop-bank.png)
- [Formation and flight controls](qa/pages-workshop-formation.png)
- [Rebirth and light controls](qa/pages-workshop-rebirth.png)
- [Final portrait above the footer](qa/pages-workshop-footer.png)
- [Mobile portrait](qa/pages-workshop-mobile-portrait.png)
- [Mobile credits](qa/pages-workshop-mobile-footer.png)
- Browser reports: [ordinary base](qa/normal-workshop.json), [repository base](qa/pages-workshop.json)
- [Live browser recording](qa/phoenix-v2-motion.webm)

```sh
AETHER_QA_URL=http://127.0.0.1:4185/landingpage-parallax/ node docs/landings/aether-story/qa/story-workshop.mjs
```

The preview must match the build base. These desktop-GPU checks do not establish physical-phone FPS or cross-browser glass rendering.
