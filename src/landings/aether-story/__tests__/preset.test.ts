import { defaultPreset, parsePreset, serializePreset } from "../preset";

describe("versioned local presets", () => {
  it("round trips all runtime material inputs", () => {
    const p = {
      ...defaultPreset,
      dispersion: 0,
      glow: 1,
    };
    expect(parsePreset(serializePreset(p))).toEqual(p);
  });
  it.each([
    ["invalid json", "{"],
    ["array", "[]"],
    ["null", "null"],
    ["oversized", " ".repeat(16385)],
    ["version", JSON.stringify({ ...defaultPreset, version: 5 })],
    ["schema", JSON.stringify({ ...defaultPreset, schema: "other" })],
    [
      "unknown palette",
      JSON.stringify({ ...defaultPreset, version: 3, palette: "__proto__" }),
    ],
    ["string input", JSON.stringify({ ...defaultPreset, dispersion: ".5" })],
    ["out of range", JSON.stringify({ ...defaultPreset, glow: 1.1 })],
    ["negative", JSON.stringify({ ...defaultPreset, dispersion: -0.1 })],
    [
      "nonfinite",
      '{"schema":"aether.phoenix","version":1,"palette":"opal","dispersion":1e999,"glow":0}',
    ],
    ["missing", '{"schema":"aether.phoenix","version":1,"palette":"opal"}'],
  ])("rejects %s without accepting partial data", (_name, json) =>
    expect(() => parsePreset(json)).toThrow(),
  );
  it("migrates a saved version-1 material into a complete personal phoenix", () => {
    expect(
      parsePreset(
        JSON.stringify({
          schema: "aether.phoenix",
          version: 1,
          palette: "ember",
          dispersion: 0.7,
          glow: 0.2,
        }),
      ),
    ).toEqual({
      ...defaultPreset,
      appearance: "iridescent",
      iridescence: 0.45,
      dispersion: 0.7,
      glow: 0.2,
    });
  });
  it.each([
    { flapSpeed: 0 },
    { flapSpeed: 2.1 },
    { flapEnabled: "true" },
    { wingSpread: -1 },
    { iridescence: 2 },
  ])("rejects invalid flight/light properties %j", (value) => {
    expect(() =>
      parsePreset(JSON.stringify({ ...defaultPreset, ...value })),
    ).toThrow();
  });
  it("only returns schema fields, ignoring untrusted extra properties", () => {
    expect(
      parsePreset(
        JSON.stringify({
          ...defaultPreset,
          unexpected: "<script>danger</script>",
        }),
      ),
    ).toEqual(defaultPreset);
  });
});

it("migrates v2 without losing its flight or material choices", () => {
  const old = { ...defaultPreset, appearance: undefined, palette: "opal" };
  const legacy = {
    ...old,
    version: 2,
    iridescence: 0.62,
    flapSpeed: 1.7,
    flapEnabled: false,
  };
  expect(parsePreset(JSON.stringify(legacy))).toEqual({
    ...defaultPreset,
    iridescence: 0.62,
    flapSpeed: 1.7,
    flapEnabled: false,
  });
});
it.each(["iridescent", "holo", "magma"] as const)(
  "round trips the %s appearance",
  (appearance) => {
    const preset = { ...defaultPreset, appearance };
    expect(parsePreset(serializePreset(preset))).toEqual(preset);
  },
);
it.each(["__proto__", "unknown", 1, null, undefined])(
  "rejects an invalid v4 appearance %j",
  (appearance) => {
    expect(() =>
      parsePreset(JSON.stringify({ ...defaultPreset, appearance })),
    ).toThrow();
  },
);

it("migrates removed Glass and palette options while preserving the numeric settings", () => {
  const legacy = {
    ...defaultPreset,
    version: 3,
    appearance: "glass",
    palette: "ember",
    iridescence: 0.6,
  };
  expect(parsePreset(JSON.stringify(legacy))).toEqual({
    ...defaultPreset,
    iridescence: 0.6,
  });
  expect(parsePreset(serializePreset(defaultPreset))).not.toHaveProperty(
    "palette",
  );
});
