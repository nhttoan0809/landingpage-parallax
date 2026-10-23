export const variants = [
  {
    id: "ignition",
    name: "Ignition",
    edition: "AV–01",
    shell: "#e85928",
    accent: "#f1eee5",
    visor: "#242b32",
    finish: "Gloss ceramic",
    material: "Painted composite shell",
    description:
      "The first spark. Signal orange, warm ivory graphics and a smoked visor. Made for the moment the lights go out.",
    mood: "The original racing instinct.",
  },
  {
    id: "afterhours",
    name: "Afterhours",
    edition: "AV–02",
    shell: "#282c31",
    accent: "#b6b8df",
    visor: "#30344c",
    finish: "Satin graphite",
    material: "Exposed carbon-inspired composite",
    description:
      "A quieter kind of loud. Graphite, electric lilac and a midnight visor, inspired by the empty circuit after the last lap.",
    mood: "When the circuit falls quiet.",
  },
  {
    id: "saltline",
    name: "Saltline",
    edition: "AV–03",
    shell: "#e8e4d8",
    accent: "#287275",
    visor: "#223c40",
    finish: "Pearl enamel",
    material: "Pearlescent composite shell",
    description:
      "Room to breathe. A pearl shell, deep teal graphics and a sea-glass visor. A little of the coast, taken to the grid.",
    mood: "A different state of speed.",
  },
] as const;
export type Variant = (typeof variants)[number];
export function configuration(variant: Variant) {
  return {
    schemaVersion: "1.0",
    brand: "Apex Velocity",
    rider: "Alex Vale",
    variant: { id: variant.id, name: variant.name, edition: variant.edition },
    colors: {
      shell: variant.shell,
      graphic: variant.accent,
      visor: variant.visor,
    },
    materials: {
      shell: variant.material,
      finish: variant.finish,
      visor: "Reflective smoked polycarbonate",
      trim: "Matte elastomer",
    },
    conceptOnly: true,
  };
}
export function downloadConfiguration(variant: Variant) {
  const blob = new Blob(
    [JSON.stringify(configuration(variant), null, 2) + "\n"],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `apex-velocity-${variant.id}.json`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
