/** Data only: the HTML controls never import the Three.js renderer. */
export const appearances = {
  iridescent: {
    name: "Iridescent GLSL",
    description: "A luminous spectrum shifts across sculpted feathers.",
    swatch: "linear-gradient(135deg, #ff468d, #8354f5 48%, #24cfef)",
  },
  holo: {
    name: "Holo Wireframe",
    description: "A luminous blue mesh, traced by a travelling scan of light.",
    swatch: "repeating-linear-gradient(45deg, #2857b9 0 1px, #b0f5f7 1px 5px)",
  },
  magma: {
    name: "Solar Magma GLSL",
    description: "Ember-dark feathers with molten gold flowing to their tips.",
    swatch: "linear-gradient(135deg, #5d173a, #ef4c13 48%, #ffd354)",
  },
} as const;
export type Appearance = keyof typeof appearances;
