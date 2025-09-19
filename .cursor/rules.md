# Landing Page Parallax – Cursor Rules

## Tech Stack Expectations
- Prefer React 18 with TypeScript for all UI work.
- Use Bun as the package manager (`bun install`, `bun run`, `bunx`).
- Styling lives in TailwindCSS utility classes; when necessary, author small CSS modules under `src/styles/`.
- For animation, default to Framer Motion; reach for `motion` components before raw CSS keyframes.
- Smooth scrolling/parallax helpers come from `@studio-freight/lenis`; avoid mixing multiple scroll libraries.

## Project Structure
- Keep feature code under `src/sections/` (one folder per scroll section).
- Shared UI elements belong in `src/components/`; hooks in `src/hooks/`.
- Place static assets in `public/` when they don’t require processing.
- Route entry stays in `src/main.tsx`; top-level layout scaffold in `src/App.tsx`.
- Keep configuration (`tailwind.config.ts`, `postcss.config.cjs`, `tsconfig.json`, `bunfig.toml`) at repo root.

## Coding Conventions
- Type everything; no implicit `any`. Export named components unless a default export improves ergonomics.
- Derive motion/Lenis values through hooks to keep components declarative.
- Prefer CSS variables for theme colours defined in `tailwind.config.ts`.
- Write small, composable sections—each section handles its own content, animations, and `useScroll` hooks.
- Keep navigation state derived from scroll position, not manual toggles.

## Interaction & Animation Rules
- Navigation underline must track the section that is at least 50% visible (`useScroll` + `IntersectionObserver`).
- Gallery cards stay within viewport padding; use resilient layout (CSS Grid/Flex) with clamp sizing and `useTransform` for subtle parallax.
- Avoid scroll-jank: clamp animation ranges, throttle expensive effects, and test on reduced-motion mode.

## Testing & Tooling
- Add lightweight integration tests with Vitest + Testing Library when behaviours become complex.
- Lint with ESLint using the recommended React + TypeScript config.
- Every new dependency needs a short note in `docs/architecture.md` (create if missing).

## Documentation & Workflow
- Strategy and decisions belong in `docs/`—update `docs/strategy.md` when plans change.
- Keep README user-focused (run/build instructions, feature overview). Developer-specific notes go in `docs/`.
- Prefer incremental commits grouped by feature/concern.
- Always run `bun run lint` and `bun run build` before tagging a milestone.

