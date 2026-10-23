export const palettes = {
  opal: { name: "Opal", color: "#d6c8ef", edge: "#7862aa", light: "#e3d9ff" },
  tide: { name: "Tide", color: "#a9ded8", edge: "#337e97", light: "#b7f6eb" },
  ember: { name: "Ember", color: "#efc2a6", edge: "#b36a89", light: "#ffcfad" },
} as const;
export type Preset = {
  schema: "aether.phoenix";
  version: 1;
  palette: keyof typeof palettes;
  dispersion: number;
  glow: number;
};
export const defaultPreset: Preset = {
  schema: "aether.phoenix",
  version: 1,
  palette: "opal",
  dispersion: 0.45,
  glow: 0.35,
};
export const storageKey = "aether.phoenix.v1";
export function parsePreset(text: string): Preset {
  if (text.length > 16384)
    throw new Error(
      "Preset is too large. Choose a JSON file smaller than 16 KB.",
    );
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("This file is not valid JSON. Choose an Aether preset.");
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Preset must be a JSON object.");
  const p = value as Record<string, unknown>;
  if (p.schema !== "aether.phoenix" || p.version !== 1)
    throw new Error("Unsupported preset. Expected aether.phoenix, version 1.");
  if (typeof p.palette !== "string" || !Object.hasOwn(palettes, p.palette))
    throw new Error("Choose a preset with an Opal, Tide or Ember palette.");
  for (const key of ["dispersion", "glow"]) {
    if (
      typeof p[key] !== "number" ||
      !Number.isFinite(p[key]) ||
      p[key] < 0 ||
      p[key] > 1
    )
      throw new Error(
        `${key === "glow" ? "Glow" : "Dispersion"} must be a number from 0 to 1.`,
      );
  }
  return {
    schema: "aether.phoenix",
    version: 1,
    palette: p.palette as Preset["palette"],
    dispersion: p.dispersion as number,
    glow: p.glow as number,
  };
}
export function serializePreset(preset: Preset) {
  return JSON.stringify(parsePreset(JSON.stringify(preset)), null, 2);
}
