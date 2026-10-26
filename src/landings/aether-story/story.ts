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
  roll: number;
  wing: number;
  flap: number;
  pitch: number;
  tail: number;
  scatter: number;
  block: number;
  scale: number;
  night: number;
  energy: number;
  bird: number;
};
const desktop: Pose[] = [
  {
    x: 3.25,
    y: 0,
    z: 15,
    roll: 0,
    turn: 0.38,
    wing: 0.13,
    flap: 0.16,
    pitch: -0.78,
    tail: 0.03,
    scatter: 0.06,
    block: 0.025,
    scale: 0.74,
    night: 0,
    energy: 0.25,
    bird: 1,
  },
  {
    x: -3.15,
    y: -0.1,
    z: 14.5,
    roll: 0,
    turn: -0.62,
    wing: -0.12,
    flap: 0.22,
    pitch: -0.58,
    tail: -0.08,
    scatter: 0,
    block: 0,
    scale: 0.76,
    night: 0,
    energy: 0.5,
    bird: 1,
  },
  {
    x: -1.8,
    y: 0.9,
    z: 15,
    roll: 0,
    turn: 1.02,
    wing: 0.42,
    flap: 0.06,
    pitch: -0.85,
    tail: 0.12,
    scatter: 0.7,
    block: 0,
    scale: 0.5,
    night: 1,
    energy: 0.12,
    bird: 0,
  },
  {
    x: 3.1,
    y: 0,
    z: 16,
    roll: 0,
    turn: 0,
    wing: -0.18,
    flap: 0.25,
    pitch: -0.9,
    tail: -0.04,
    scatter: 0,
    block: 0,
    scale: 0.72,
    night: 0,
    energy: 0.85,
    bird: 1,
  },
  {
    x: -2.8,
    y: -1.2,
    z: 16.4,
    roll: 0,
    turn: -0.25,
    wing: 0.04,
    flap: 0.12,
    pitch: -0.76,
    tail: 0.04,
    scatter: 0,
    block: 0,
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
    roll: 0,
    turn: 0.28,
    wing: 0.13,
    flap: 0.16,
    pitch: -0.78,
    tail: 0.03,
    scatter: 0.06,
    block: 0.025,
    scale: 0.37,
    night: 0,
    energy: 0.2,
    bird: 1,
  },
  {
    x: 0.12,
    y: -1.05,
    z: 14,
    roll: 0,
    turn: 0.4,
    wing: -0.15,
    flap: 0.22,
    pitch: -0.58,
    tail: -0.08,
    scatter: 0,
    block: 0,
    scale: 0.37,
    night: 0,
    energy: 0.35,
    bird: 1,
  },
  {
    x: 0,
    y: 0,
    z: 14,
    roll: 0,
    turn: 0.6,
    wing: 0.28,
    flap: 0.06,
    pitch: -0.85,
    tail: 0.12,
    scatter: 0.7,
    block: 0,
    scale: 0.25,
    night: 1,
    energy: 0.1,
    bird: 0,
  },
  {
    x: 0,
    y: -1.2,
    z: 14.5,
    roll: 0,
    turn: 0,
    wing: -0.12,
    flap: 0.25,
    pitch: -0.9,
    tail: -0.04,
    scatter: 0,
    block: 0,
    scale: 0.39,
    night: 0,
    energy: 0.7,
    bird: 1,
  },
  {
    x: 0,
    y: -0.6,
    z: 14,
    roll: 0,
    turn: -0.2,
    wing: 0.05,
    flap: 0.12,
    pitch: -0.76,
    tail: 0.04,
    scatter: 0,
    block: 0,
    scale: 0.39,
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
  const pose = Object.fromEntries(
    Object.keys(frames[0]).map((key) => {
      const k = key as keyof Pose;
      return [
        k,
        frames[index][k] + (frames[index + 1][k] - frames[index][k]) * ease,
      ];
    }),
  ) as Pose;
  if (!compact) {
    const paths = [
      [
        [3.25, 2.7, -3.8, -3.15],
        [0, 1.15, 1.5, -0.1],
        [15, 11.6, 18.4, 14.5],
      ],
      [
        [-3.15, -3.9, -2.8, -1.8],
        [-0.1, 1.5, 2.2, 0.9],
        [14.5, 13.8, 17.8, 15],
      ],
      [
        [-1.8, -2, 3.8, 3.1],
        [0.9, 1.8, 1.1, 0],
        [15, 18, 12.8, 16],
      ],
      [
        [3.1, 3.8, -3.4, -2.8],
        [0, 1.3, 0.6, -1.2],
        [16, 12.8, 18.2, 16.4],
      ],
    ];
    const curve = (points: number[]) =>
      Math.pow(1 - ease, 3) * points[0] +
      3 * Math.pow(1 - ease, 2) * ease * points[1] +
      3 * (1 - ease) * ease * ease * points[2] +
      Math.pow(ease, 3) * points[3];
    pose.x = curve(paths[index][0]);
    pose.y = curve(paths[index][1]);
    pose.z = curve(paths[index][2]);
    const bank = Math.sin(Math.PI * ease);
    pose.roll = bank * (index % 2 === 0 ? 0.26 : -0.22);
    pose.turn -= bank * (index === 0 ? 0.4 : -0.15);
    pose.pitch += bank * 0.12;
    pose.scale *= 1 - bank * 0.16;
  } else {
    pose.roll = Math.sin(Math.PI * ease) * 0.1;
    pose.x += Math.sin(Math.PI * ease) * (index % 2 ? -0.12 : 0.12);
  }
  // Leave the entire viewport before Resonance; re-enter from beyond the right edge.
  const flight = (start: number, end: number) => {
    const t = clamp((progress - start) / (end - start));
    return t * t * (3 - 2 * t);
  };
  if (progress >= 0.295 && progress < 0.5) {
    const t = flight(0.295, 0.48);
    pose.x = -3.15 + ((compact ? -9 : -22) + 3.15) * t;
    pose.y = -0.1 + Math.sin(t * Math.PI) * 0.9;
    pose.z = 14.5 + t * 1.5;
    pose.scale = compact ? 0.37 : 0.76;
    pose.roll = Math.sin(t * Math.PI) * 0.25;
    pose.turn = -0.62 - Math.sin(t * Math.PI) * 0.25;
    pose.scatter = 0;
    pose.bird = progress < 0.48 ? 1 : 0;
  }
  if (progress >= 0.5 && progress < 0.65) {
    pose.bird = 0;
    pose.x = compact ? 9 : 22;
    pose.scatter = 0;
  }
  if (progress >= 0.65 && progress < 0.9) {
    const t = flight(0.65, 0.78);
    Object.assign(pose, frames[3]);
    pose.x = (compact ? 9 : 22) * (1 - t) + (compact ? 0 : 3.1) * t;
    pose.y = Math.sin(t * Math.PI) * 0.8;
    pose.z = 18 - t * 2;
    pose.scale = compact ? 0.39 : 0.72;
    pose.turn = -0.45 * (1 - t);
    pose.roll = -Math.sin(t * Math.PI) * 0.18;
    pose.pitch = -0.9;
    pose.wing = -0.18;
    pose.flap = 0.25;
    pose.night = 0;
    pose.scatter = 0;
    pose.bird = 1;
  }
  if (progress >= 0.9) {
    const t = flight(0.9, 1);
    const rebirth = { ...frames[3], y: 0, z: 16, wing: -0.18, pitch: -0.9 };
    for (const key of Object.keys(pose) as (keyof Pose)[])
      pose[key] = rebirth[key] + (frames[4][key] - rebirth[key]) * t;
    pose.y = frames[4].y * t;
    pose.z = 16 + (frames[4].z - 16) * t;
    pose.roll = Math.sin(t * Math.PI) * 0.12;
    pose.y += Math.sin(t * Math.PI) * 0.5;
  }
  // A bounded construction beat after the hero reading hold: no geometry swap or history.
  if (p > 0.25 && p < 0.88) {
    const assembly = Math.pow(Math.sin(((p - 0.25) / 0.63) * Math.PI), 2);
    pose.block += assembly * 0.6;
    pose.scatter += assembly * 0.12;
  }
  return pose;
}
