export const chapters = ["spark", "formation", "resonance", "rebirth"] as const;
export type Chapter = (typeof chapters)[number];
export const clamp = (n: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
export function chapterAt(progress: number): Chapter {
  return chapters[Math.min(3, Math.floor(clamp(progress) * 4))];
}
/** Scroll offsets may have unequal lengths (stacked mobile case studies). */
export function progressAt(scroll: number, offsets: readonly number[]): number {
  if (
    offsets.length !== 5 ||
    offsets.some(
      (v, i) => !Number.isFinite(v) || (i > 0 && v <= offsets[i - 1]),
    )
  )
    return 0;
  const y = clamp(scroll, offsets[0], offsets[4]);
  for (let i = 0; i < 4; i++) {
    if (y <= offsets[i + 1])
      return (i + (y - offsets[i]) / (offsets[i + 1] - offsets[i])) / 4;
  }
  return 1;
}
export type Pose = {
  x: number;
  y: number;
  z: number;
  turn: number;
  wing: number;
  scale: number;
  night: number;
  energy: number;
  bird: number;
};
const desktop: Pose[] = [
  {
    x: 2.7,
    y: 0,
    z: 15,
    turn: -0.22,
    wing: 0.13,
    scale: 0.82,
    night: 0,
    energy: 0.25,
    bird: 1,
  },
  {
    x: 2.9,
    y: -0.1,
    z: 14.5,
    turn: 0.66,
    wing: -0.12,
    scale: 0.83,
    night: 0,
    energy: 0.5,
    bird: 1,
  },
  {
    x: 3.4,
    y: 0.9,
    z: 15,
    turn: 1.02,
    wing: 0.42,
    scale: 0.5,
    night: 1,
    energy: 0.12,
    bird: 0,
  },
  {
    x: 0,
    y: -1.25,
    z: 17,
    turn: 0,
    wing: -0.18,
    scale: 0.85,
    night: 0,
    energy: 0.85,
    bird: 1,
  },
  {
    x: -2.8,
    y: -1.2,
    z: 16.4,
    turn: -0.25,
    wing: 0.04,
    scale: 0.7,
    night: 0,
    energy: 0.4,
    bird: 1,
  },
];
const mobile: Pose[] = [
  {
    x: 0,
    y: -1.15,
    z: 14,
    turn: -0.14,
    wing: 0.13,
    scale: 0.46,
    night: 0,
    energy: 0.2,
    bird: 1,
  },
  {
    x: 0.12,
    y: -1.05,
    z: 14,
    turn: 0.4,
    wing: -0.15,
    scale: 0.46,
    night: 0,
    energy: 0.35,
    bird: 1,
  },
  {
    x: 0,
    y: 0,
    z: 14,
    turn: 0.6,
    wing: 0.28,
    scale: 0.25,
    night: 1,
    energy: 0.1,
    bird: 0,
  },
  {
    x: 0,
    y: -1.2,
    z: 14.5,
    turn: 0,
    wing: -0.12,
    scale: 0.48,
    night: 0,
    energy: 0.7,
    bird: 1,
  },
  {
    x: 0,
    y: -0.6,
    z: 14,
    turn: -0.2,
    wing: 0.05,
    scale: 0.43,
    night: 0,
    energy: 0.35,
    bird: 1,
  },
];
/** Hold the beginning of each chapter, then ease into the next composition. Reversible and stateless. */
export function sampleStory(progress: number, compact: boolean): Pose {
  const frames = compact ? mobile : desktop;
  const p = clamp(progress) * 4;
  const index = Math.min(3, Math.floor(p));
  const fraction = p - index;
  const t = clamp((fraction - 0.18) / 0.74);
  const ease = t * t * (3 - 2 * t);
  return Object.fromEntries(
    Object.keys(frames[0]).map((key) => {
      const k = key as keyof Pose;
      return [
        k,
        frames[index][k] + (frames[index + 1][k] - frames[index][k]) * ease,
      ];
    }),
  ) as Pose;
}
