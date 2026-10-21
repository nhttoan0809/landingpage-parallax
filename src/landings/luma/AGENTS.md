# Luma Field

This folder owns the complete Luma page at `/luma/`, including its CSS reset,
components, sections, Lenis provider, and tests. Entry HTML: `luma/index.html`.
Static files: `public/landings/luma/`. Design notes: `docs/landings/luma/design.md`.

Preserve Luma's Vietnamese travel-camera narrative, green/silver product imagery,
parallax hero, accessible gallery tabs, color selection, and kit download.

- Reuse Framer Motion and Lenis for existing motion. Add another animation library
  only for an interaction that requires it, explaining the dependency choice.
- Keep one Lenis instance and frame loop inside this entry's provider. Clean up
  all effects and keep reduced-motion content readable and static.
- Keep `index.css` private to this entry. It includes Luma's document reset and
  tokens. Do not import it into the catalog or another landing.
- In-document links stay `#section`; the collection return link uses BASE_URL.
- Keep asset paths BASE_URL-aware and prefixed with `landings/luma/`.
- Test mobile/desktop scroll transforms, gallery bounds and keyboard navigation,
  native dialog focus, download, and reduced motion after behavior changes.
