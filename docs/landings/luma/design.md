# Luma Field — visual direction

Fictional compact travel camera for people who want to explore and photograph nature.
The page introduces the product, demonstrates its design and imagined color profiles,
and lets visitors choose and download a concept kit configuration.

## Design choices

- Paper `#f8faf7`, ink `#182c24`, evergreen `#193c30`, mist `#e6ece3`, stone `#647068`, white `#ffffff`.
- Be Vietnam Pro for Vietnamese typography: compact, bold display headlines and calm body text.
- Full-bleed alpine hero; left-aligned copy, independent camera cutout at right, and scroll-driven depth.
- Editorial story, forest interlude, product detail study, interactive landscape gallery, product configuration.
- Visual focus belongs to the camera and nature imagery. Navigation and controls stay restrained.

The UI UX Pro Max search recommended scroll storytelling. Its liquid-glass and luxury
serif suggestions were reviewed and replaced with restrained opaque controls and an
outdoor photographic direction, which better suits a compact field camera.

## Interaction and motion

Hero: sticky scene; landscape drifts slowly while the camera rises, rotates, and scales.
Copy moves independently. Forest, product study, and gallery have separate scroll offsets.
Motion uses Framer Motion values without React state updates per scroll frame.
Every parallax transform resolves to a static value under reduced motion.
Gallery tabs support arrow keys, Home, and End; configuration uses a native modal dialog.

The concept has no checkout or remote form submission. Downloading a configuration
creates a text file locally. Camera specifications and price are fictional.

## Assets

- Product cutout: generated with the built-in ImageGen tool; `public/landings/luma/images/luma-camera.png`.
- Prompt: photorealistic fictional compact travel camera, sage textured grip, brushed silver body,
  black optical lens, three-quarter front view, natural studio daylight, transparent background,
  no props or real brands. The full generation prompt is retained in `docs/landings/luma/camera-image-prompt.txt`.
- Landscapes: local copies from Unsplash, used as illustrative imagery rather than sample camera output.
  Source IDs: `photo-1470770841072-f978cf4d019e`, `photo-1464822759023-fed622ff2c3b`,
  `photo-1441974231531-c6227db76b6e`, `photo-1518837695005-2083093ee35b`.

## Collection integration

This experience lives at `/luma/` (under the deployment base when hosted).
Its HTML is `luma/index.html`; all React code, providers, and CSS belong to
`src/landings/luma/`. The catalog links to it without importing its UI or styles.
