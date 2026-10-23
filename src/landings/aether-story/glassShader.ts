import { Color, type MeshPhysicalMaterial } from "three";

/** An art-directed contour on top of Three's actual physical transmission shader.
 * It exaggerates grazing-angle absorption; it does not replace refraction.
 * Runtime colour and contrast follow the selected palette and dispersion control.
 */
export function installGlassContour(material: MeshPhysicalMaterial) {
  const uniforms = {
    uEdgeColour: { value: new Color("#7862aa") },
    uContour: { value: 0.48 },
  };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader =
      "uniform vec3 uEdgeColour;\nuniform float uContour;\n" +
      shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `
      float aetherRim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 1.65);
      outgoingLight = mix(outgoingLight, outgoingLight * uEdgeColour * .65, aetherRim * uContour);
      outgoingLight += vec3(.18, .15, .22) * pow(aetherRim, 10.0);
      #include <opaque_fragment>
    `,
    );
  };
  material.customProgramCacheKey = () => "aether-glass-contour-v1";
  return (colour: string, dispersion: number) => {
    uniforms.uEdgeColour.value.set(colour);
    uniforms.uContour.value = 0.48 + dispersion * 0.22;
  };
}
