import { portraitFrame } from "../framing";
import { sampleStory } from "../story";
it("settles the full portrait above the footer, including at the bottom of the page", () => {
  const slot = { left: 115, top: 260, width: 520, height: 430 };
  for (const footer of [1000, 700, 540, 380]) {
    const frame = portraitFrame(slot, 1440, 900, footer, false);
    expect(frame.visible).toBe(true);
    expect(frame.top).toBeGreaterThanOrEqual(76);
    expect(frame.top + frame.height).toBeLessThanOrEqual(
      Math.min(876, footer - 28),
    );
  }
  expect(portraitFrame(slot, 1440, 900, 150, false).visible).toBe(false);
});
it("lets the mobile portrait leave naturally with its own content", () => {
  // DOMRect coordinates are prototype getters, not enumerable own properties.
  const rect = new DOMRect(25, 327, 340, 350);
  expect(portraitFrame(rect, 390, 844, 1477, true)).toEqual({
    left: 25,
    top: 327,
    width: 340,
    height: 350,
    visible: true,
  });
  expect(
    portraitFrame(
      { left: 25, top: -450, width: 340, height: 350 },
      390,
      844,
      400,
      true,
    ).visible,
  ).toBe(false);
});
it("flies from right to left on a curved, banked trajectory and retraces it", () => {
  const start = sampleStory(0, false),
    mid = sampleStory(0.15, false),
    end = sampleStory(0.25, false);
  expect(start.x).toBeGreaterThan(0);
  expect(end.x).toBeLessThan(0);
  expect(mid.y).toBeGreaterThan(Math.max(start.y, end.y));
  expect(Math.abs(mid.roll)).toBeGreaterThan(0.1);
  expect(mid.z).not.toBeCloseTo((start.z + end.z) / 2, 1);
  const times = [0, 0.08, 0.14, 0.2, 0.25, 0.63, 0.75, 1];
  expect(times.map((p) => sampleStory(p, false))).toEqual(
    [...times]
      .reverse()
      .map((p) => sampleStory(p, false))
      .reverse(),
  );
});

it("leaves Formation fully to the left, stays absent in the gallery, and enters Rebirth from the right", () => {
  for (const compact of [true, false]) {
    const leaving = [0.31, 0.36, 0.42, 0.47].map((p) =>
      sampleStory(p, compact),
    );
    expect(
      leaving.every((pose, i) => i === 0 || pose.x < leaving[i - 1].x),
    ).toBe(true);
    expect(leaving.at(-1)!.x).toBeLessThan(compact ? -7 : -18);
    for (const p of [0.5, 0.56, 0.6, 0.64])
      expect(sampleStory(p, compact).bird).toBe(0);
    const entering = [0.65, 0.7, 0.75, 0.78].map((p) =>
      sampleStory(p, compact),
    );
    expect(
      entering.every((pose, i) => i === 0 || pose.x < entering[i - 1].x),
    ).toBe(true);
    expect(entering[0].x).toBeGreaterThan(compact ? 7 : 18);
  }
});

it("keeps the fully visible Rebirth pose continuous into the final portrait", () => {
  for (const compact of [false, true]) {
    const a = sampleStory(0.9 - 1e-7, compact),
      b = sampleStory(0.9 + 1e-7, compact);
    for (const key of ["x", "y", "z", "pitch", "scale"] as const)
      expect(Math.abs(a[key] - b[key])).toBeLessThan(0.002);
  }
});
