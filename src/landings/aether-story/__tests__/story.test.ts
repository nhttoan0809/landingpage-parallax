import { chapterAt, progressAt, sampleStory } from "../story";

describe("reversible story mapping", () => {
  const offsets = [0, 1000, 2000, 4000, 5000];
  it("clamps the story before and after its scroll range", () => {
    expect(progressAt(-900, offsets)).toBe(0);
    expect(progressAt(10000, offsets)).toBe(1);
    expect(sampleStory(-1, false)).toEqual(sampleStory(0, false));
    expect(sampleStory(2, true)).toEqual(sampleStory(1, true));
    expect(chapterAt(-1)).toBe("spark");
    expect(chapterAt(1)).toBe("rebirth");
  });
  it("maps unequal mobile chapter heights to the right chapter", () => {
    expect(progressAt(1000, offsets)).toBe(0.25);
    expect(progressAt(3000, offsets)).toBe(0.625);
    expect(chapterAt(progressAt(3000, offsets))).toBe("resonance");
    expect(progressAt(4000, offsets)).toBe(0.75);
  });
  it("retraces exactly the same camera and wings while scrolling backwards", () => {
    const forward = [0, 650, 1400, 2600, 3990, 5000].map((y) =>
      sampleStory(progressAt(y, offsets), false),
    );
    const backward = [5000, 3990, 2600, 1400, 650, 0]
      .map((y) => sampleStory(progressAt(y, offsets), false))
      .reverse();
    expect(backward).toEqual(forward);
    expect(sampleStory(0.25, false).turn).toBeLessThan(
      sampleStory(0, false).turn,
    );
    expect(sampleStory(0.25, false).wing).not.toBe(sampleStory(0, false).wing);
  });
  it("uses distinct compact camera positions and scales, and holds each reading beat", () => {
    expect(sampleStory(0.25, true).x).not.toBe(sampleStory(0.25, false).x);
    expect(sampleStory(0.25, true).scale).toBeLessThan(
      sampleStory(0.25, false).scale,
    );
    expect(sampleStory(0.01, false)).toEqual(sampleStory(0, false));
    expect(progressAt(20, [0, 0, 30, 40, 50])).toBe(0);
  });
});
