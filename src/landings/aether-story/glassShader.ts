import { Color, type MeshPhysicalMaterial } from "three";
import {
  injectSurface,
  type SurfaceKind,
  type SurfaceUniforms,
} from "./phoenix/surface";

/** Shared uniforms survive program recompilation when wireframe/transmission changes. */
export const makeAppearanceUniforms = () => ({
  uAetherLook: { value: 1 },
  uAetherTime: { value: 0 },
  uAetherIridescence: { value: 0.8 },
  uAetherGlow: { value: 0.35 },
  uAetherHue: { value: 0 },
  uAetherDispersion: { value: 0.45 },
  uAetherPrimary: { value: new Color("#ae6dea") },
  uAetherAccent: { value: new Color("#f66dbb") },
});
export type AppearanceUniforms = ReturnType<typeof makeAppearanceUniforms>;

/** Physical glass plus deliberately stylized spectral, hologram and molten finishes.
 * Anatomy/motion use the same geometry and joint hierarchy in every finish.
 */
export function installGlassContour(
  material: MeshPhysicalMaterial,
  appearance: AppearanceUniforms,
  surface?: { kind: SurfaceKind; uniforms: SurfaceUniforms },
) {
  const uniforms = {
    uEdgeColour: { value: new Color("#58319b") },
    uContour: { value: 0.48 },
  };
  material.onBeforeCompile = (shader) => {
    if (surface) injectSurface(shader, surface.kind, surface.uniforms);
    Object.assign(shader.uniforms, uniforms, appearance);
    shader.vertexShader =
      "varying vec2 vAetherUv; varying vec3 vAetherWorld;\n" +
      shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <project_vertex>",
      `
      #include <project_vertex>
      vAetherUv = uv;
      vec4 aetherPosition = vec4(transformed, 1.0);
      #ifdef USE_INSTANCING
        aetherPosition = instanceMatrix * aetherPosition;
      #endif
      vAetherWorld = (modelMatrix * aetherPosition).xyz;
    `,
    );
    shader.fragmentShader =
      `
      varying vec2 vAetherUv; varying vec3 vAetherWorld;
      uniform vec3 uEdgeColour, uAetherPrimary, uAetherAccent;
      uniform float uContour, uAetherLook, uAetherTime, uAetherIridescence, uAetherGlow, uAetherHue, uAetherDispersion;
      vec3 aetherSpectrum(float phase) {
        return .5 + .5 * cos(6.2831853 * (phase + vec3(0., .33, .67)));
      }
    ` + shader.fragmentShader;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      `
      float aetherNdotV = clamp(abs(dot(normal, normalize(vViewPosition))), 0., 1.);
      float aetherRim = pow(1. - aetherNdotV, 1.65);
      float phase = aetherNdotV * .65 + vAetherWorld.y * .14 + vAetherUv.y * (.18 + uAetherDispersion * .5)
        + uAetherHue - uAetherTime * .06;
      vec3 spectrum = aetherSpectrum(phase);
      float aetherShaft = 1. - smoothstep(.015, .065, abs(vAetherUv.x - .5));
      float aetherBarbs = .88 + .12 * sin(vAetherUv.y * 70. - abs(vAetherUv.x - .5) * 42.);
      float glint = pow(max(dot(normal, normalize(vec3(-.35, .7, 1.))), 0.), 42.);
      float lightSweep = pow(max(0.,sin(vAetherWorld.x*.85+vAetherWorld.y*1.3-uAetherTime*.65)),32.);
      float fibreGlint = pow(.5+.5*sin(vAetherUv.y*65.-abs(vAetherUv.x-.5)*38.),18.);
      float sparkle = lightSweep * (.15 + fibreGlint*.85) + glint*.45;
      if (uAetherLook < 1.5) {
        // A saturated enamel base keeps colour readable away from grazing angles.
        vec3 enamel = mix(uAetherPrimary, uAetherAccent, smoothstep(.1, .95, vAetherUv.y));
        vec3 spectralColour = mix(enamel * .8, spectrum * 1.15, uAetherIridescence * .65);
        float relief = .28 + .72 * max(dot(normal, normalize(vec3(-.5, .7, 1.))), 0.);
        outgoingLight = mix(outgoingLight * .65, spectralColour * relief * aetherBarbs, .76);
        outgoingLight += spectrum * aetherRim * uAetherIridescence * (.65 + uAetherGlow * 1.2);
        outgoingLight += vec3(1., .83, .96) * glint * (.22 + uAetherIridescence * .45);
        outgoingLight += mix(spectrum,vec3(1.),.65) * sparkle * pow(uAetherIridescence,2.) * (5.5 + uAetherGlow * 3.);
        outgoingLight += uAetherAccent * aetherShaft * .06 * uAetherGlow;
      } else if (uAetherLook < 2.5) {
        // Real triangle edges, shaded in cobalt/cyan; a slow scan reads on a light page.
        float scan = pow(.5 + .5 * sin(vAetherWorld.y * 3.5 - uAetherTime * 1.8), 14.);
        vec3 ink = mix(vec3(.005, .025, .19), vec3(.01, .23, .54), aetherRim);
        outgoingLight = ink * (1. + uAetherGlow) + vec3(.02, .7, .85) * scan * (.18 + uAetherGlow * .8);
        outgoingLight += spectrum * aetherRim * uAetherIridescence * .2;
        outgoingLight += vec3(.15,1.3,2.2)*scan*(uAetherIridescence*.9+uAetherGlow*.7);
      } else {
        // Domain-warped flow creates molten veins, rather than a flat orange tint.
        float warp = sin(vAetherUv.x * 13. + vAetherWorld.y * 1.4 + uAetherTime * .3) * 2.
          + sin(vAetherWorld.x * 3. - vAetherWorld.z * .7) * 1.3;
        float flow = .5 + .5 * sin(vAetherUv.y * 15. - uAetherTime * 1.7 + warp);
        float veins = smoothstep(.7, .98, flow);
        float tips = smoothstep(.68, 1., vAetherUv.y);
        float heat = clamp(veins * .72 + aetherShaft * .35 + tips * .55, 0., 1.);
        vec3 coal = mix(vec3(.055, .003, .012), uAetherPrimary * .12, .3);
        vec3 lava = mix(vec3(.85, .035, .002), vec3(1., .58, .035), heat);
        outgoingLight = coal * (.65 + aetherNdotV * .35) + lava * (.13 + heat * (1.1 + uAetherGlow * 1.8));
        outgoingLight += vec3(1., .42, .035) * aetherRim * (.22 + uAetherGlow * .6);
        outgoingLight += vec3(1.,.85,.35) * sparkle * uAetherIridescence * 3.;
      }
      #include <opaque_fragment>
    `,
    );
  };
  material.customProgramCacheKey = () =>
    `aether-appearance-v4-${surface?.kind ?? "body"}`;
  return (colour: string, dispersion: number) => {
    uniforms.uEdgeColour.value.set(colour);
    uniforms.uContour.value = 0.48 + dispersion * 0.22;
  };
}
