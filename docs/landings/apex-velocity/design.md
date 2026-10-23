# Apex Velocity

Original fictional athlete and helmet identity for Alex Vale, number 27. Independent HTML document at `/apex-velocity/`, with React 19 / TypeScript / Vite 7 / Bun. No changes to Luma's experience or the catalog's CSS.

## Direction and design review

The starting plan was a motorsport equipment studio: a large italic condensed headline on the left, a glossy helmet and orange circuit loop on the right; a charcoal story interlude; paired track/coast artwork; three physical-looking editions; an open configuration studio. Alignment is left-led, with the helmet free to break the grid. Body copy stays in short readable lines.

Tokens: warm paper `#f0eee7`, charcoal `#1b1e20`, signal orange `#e85928`, graphite `#64645f`, pale lilac `#b6b8df`, deep teal `#287275`. Barlow Condensed ExtraBold Italic carries racing headlines; Barlow Regular keeps the interface quiet. Both are local, page-owned fonts.

Review against generic layouts: removed a dashboard-style statistics row, decorative badges and fake race results. Replaced stock photography with original line studies of the circuit and coast, tying Saltline's material story to the off-track section. The visual signature is the large circuit bend, not a set of interchangeable cards. Three numbered milestones encode an actual narrative sequence. Orange is paired with charcoal text, never small white text.

UI UX Pro Max was read from the worktree's bundled `.agents/skills/ui-ux-pro-max/SKILL.md`. Searches run:

- `"motorsport immersive portfolio" --design-system -p "Apex Velocity"`: Swiss structure and high contrast were useful; enterprise/SaaS suitability and the blue palette were rejected for this brief.
- `"sports dynamic" --domain style`: Liquid Glass was rejected as off-topic; the second result, Kinetic Typography, matches the headline-led direction. No glass styles were persisted.
- `"dragging movements" --domain ux`: exact accessibility result. Rotation has three 44px buttons in addition to dragging.

Applied frontend-design, vercel-react-best-practices, gsap-react and gsap-scrolltrigger. The renderer is dynamically imported, per-frame values use mutable refs, and all brand styling remains private. No new global Tailwind processing, router, Lenis or Rive.

## Helmet and motion

Blender was unavailable on PATH. `helmet.ts` creates a deliberately shaped open-bottom full-face shell with a visor aperture, curved smoked visor, rubber rim, chin vents, top air intakes, metal visor pivots/lock, rear blade and neck lining. UV graphics are original canvas artwork. A RoomEnvironment PMREM plus hemisphere/key/fill lights expose gloss, satin, reflective visor and matte trim. Each edition updates paint, finish and visor immediately.

Three independently lazy viewers share the engine code, not React frame state. IntersectionObserver pauses offscreen render loops; hidden tabs cancel rendering. DPR caps: desktop 1.5, small viewport 1.25. No shadows, postprocessing, remote HDR, model or texture downloads. All resources, observers, listeners and animation frames are released on disposal.

GSAP useGSAP scopes animation to this document and matchMedia owns responsive cleanup. Hero lines stagger once. Collection lines stagger on entry. A clipped circuit layer and the two illustrations supply mask reveals. The desktop story pins for 1000px, with one reversible scrub timeline controlling helmet angle/scale/tilt, headline position, circuit mask and three milestones. Milestone copy keeps full opacity throughout for readable contrast. Mobile and reduced motion use the natural document flow; reduced motion disables pointer parallax and float, with manual drag/buttons retained.

All content and configuration work with static images or a failed GPU. The static-view toggle removes all WebGL instances. Loading and context loss keep a local poster in the viewer. A native modal dialog provides mobile focus containment; Escape, close and navigation restore focus appropriately. JSON download is versioned and revokes its object URL.

## Research

[OFF+BRAND case study](https://www.itsoffbrand.com/our-work/lando-norris), accessed 2026-10-23, confirms Webflow, WebGL, 3D, Rive and Motion in the reference project. Only interaction principles (product viewer, story pacing and on/off-track contrast) were carried into this original design. No claim is made about its current private runtime or bundle stack.

Current official documentation checked through Context7 and the primary websites:
[Three.js material docs](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial),
[Three.js cleanup](https://threejs.org/manual/#en/cleanup),
[GSAP React](https://gsap.com/resources/React/),
[ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).

## Run from the isolated worktree

```sh
cd /Users/toannguyen/Documents/personal-repos/landingpage-parallax-worktrees/apex-velocity
bun install
bun run dev --host 127.0.0.1 --port 5180 --strictPort
# http://127.0.0.1:5180/apex-velocity/
VITE_GITHUB_PAGES=true bun run build
VITE_GITHUB_PAGES=true bun run preview --host 127.0.0.1 --port 4180 --strictPort
# http://127.0.0.1:4180/landingpage-parallax/apex-velocity/
```

Branch `feat/apex-velocity`, based on `9eba9d96de30d1c972ccb9c6832f5b771772286b`. Implementation was isolated from the source checkout. The user subsequently authorized committing this landing and merging it into `main`; the feature worktree is retained. See assets.md and validation.md for provenance and measured QA.
