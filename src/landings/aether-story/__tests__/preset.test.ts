import { defaultPreset, parsePreset, serializePreset } from "../preset";

describe("versioned local presets", () => {
  it("round trips all runtime material inputs", () => {
    const p = {
      ...defaultPreset,
      palette: "tide" as const,
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
    ["version", JSON.stringify({ ...defaultPreset, version: 2 })],
    ["schema", JSON.stringify({ ...defaultPreset, schema: "other" })],
    [
      "unknown palette",
      JSON.stringify({ ...defaultPreset, palette: "__proto__" }),
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
