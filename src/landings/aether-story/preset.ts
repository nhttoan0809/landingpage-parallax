import { appearances, type Appearance } from "./appearances";

const palettes = {
  opal: { name: "Opal", color: "#ae6dea", edge: "#58319b", light: "#f66dbb" },
  tide: { name: "Tide", color: "#22bfc2", edge: "#12658f", light: "#52eacb" },
  ember: { name: "Ember", color: "#f28b42", edge: "#a53458", light: "#ffbd4f" },
} as const;
export type Preset = {
  schema: "aether.phoenix";
  version: 4;
  appearance: Appearance;
  dispersion: number;
  glow: number;
  iridescence: number;
  flapEnabled: boolean;
  flapSpeed: number;
  wingSpread: number;
};
export const defaultPreset: Preset = {
  schema: "aether.phoenix",
  version: 4,
  appearance: "iridescent",
  dispersion: 0.45,
  glow: 0.35,
  iridescence: 0.8,
  flapEnabled: true,
  flapSpeed: 1,
  wingSpread: 0.75,
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
  if (
    p.schema !== "aether.phoenix" ||
    (p.version !== 1 && p.version !== 2 && p.version !== 3 && p.version !== 4)
  )
    throw new Error(
      "Unsupported preset. Expected aether.phoenix, version 1, 2, 3 or 4.",
    );
  if (
    p.version !== 4 &&
    (typeof p.palette !== "string" || !Object.hasOwn(palettes, p.palette))
  )
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
  const migrated =
    p.version === 1 ? { ...defaultPreset, iridescence: 0.45, ...p } : p;
  const appearance =
    p.version === 4
      ? p.appearance
      : p.version === 3 && p.appearance !== "glass"
        ? p.appearance
        : "iridescent";
  if (typeof appearance !== "string" || !Object.hasOwn(appearances, appearance))
    throw new Error("Choose an Iridescent, Holo or Solar Magma appearance.");
  for (const [key, min, max] of [
    ["iridescence", 0, 1],
    ["wingSpread", 0, 1],
    ["flapSpeed", 0.25, 2],
  ] as const) {
    const value = migrated[key];
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < min ||
      value > max
    )
      throw new Error(`${key} must be a number from ${min} to ${max}.`);
  }
  if (typeof migrated.flapEnabled !== "boolean")
    throw new Error("Wingbeats must be enabled or disabled.");
  return {
    schema: "aether.phoenix",
    version: 4,
    appearance: appearance as Appearance,
    dispersion: p.dispersion as number,
    glow: p.glow as number,
    iridescence: migrated.iridescence as number,
    flapEnabled: migrated.flapEnabled as boolean,
    flapSpeed: migrated.flapSpeed as number,
    wingSpread: migrated.wingSpread as number,
  };
}
export function serializePreset(preset: Preset) {
  return JSON.stringify(parsePreset(JSON.stringify(preset)), null, 2);
}
