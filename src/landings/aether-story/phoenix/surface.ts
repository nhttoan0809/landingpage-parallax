import type { MeshPhysicalMaterial } from "three";
type Shader = Parameters<MeshPhysicalMaterial["onBeforeCompile"]>[0];
export type SurfaceKind = "blade" | "tail";
export const makeSurfaceUniforms = () => ({
  uPhoenixTime: { value: 0 },
  uPhoenixLife: { value: 1 },
  uPhoenixScatter: { value: 0 },
  uPhoenixBlock: { value: 0 },
});
export type SurfaceUniforms = ReturnType<typeof makeSurfaceUniforms>;

/** Adds anatomy and movement to the existing physical glass pipeline, not an opaque replacement.
 * Feather instances retain their joint transform. Scatter is transformed back to blade-local space.
 */
export function injectSurface(
  shader: Shader,
  kind: SurfaceKind,
  uniforms: SurfaceUniforms,
) {
  Object.assign(shader.uniforms, uniforms);
  const tail = kind === "tail";
  const declarations = `
    uniform float uPhoenixTime, uPhoenixLife, uPhoenixScatter, uPhoenixBlock;
    attribute float aPhase, aAmplitude, aFace;
    attribute vec3 aScatter;
    varying vec2 vPhoenixUv;
  `;
  shader.vertexShader = declarations + shader.vertexShader;
  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    vPhoenixUv = uv;
    ${
      tail
        ? `
      float tailWave = uv.y * 5.2 - uPhoenixTime * 2.2 + aPhase;
      float tailWeight = pow(uv.y, 1.35) * uPhoenixLife;
      transformed.y += sin(tailWave) * .25 * tailWeight;
      transformed.x += cos(tailWave * .75) * .15 * tailWeight;
    `
        : `
      float flutter = sin(uPhoenixTime * 2.8 + aPhase + uv.y * 4.0);
      transformed.z += flutter * aAmplitude * uv.y * uv.y * uPhoenixLife;
      vec3 blockPosition = vec3(sign(position.x) * .1, uv.y, aFace * .065);
      transformed = mix(transformed, blockPosition, uPhoenixBlock);
      transformed += aScatter * uPhoenixScatter;
    `
    }
  `,
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <beginnormal_vertex>",
    `
    #include <beginnormal_vertex>
    ${
      tail
        ? `
      float wave = uv.y * 5.2 - uPhoenixTime * 2.2 + aPhase;
      // Small-slope normal correction for the ribbon's travelling wave.
      objectNormal.z += cos(wave) * .2 * pow(uv.y, 1.35) * uPhoenixLife * abs(objectNormal.y);
    `
        : `
      objectNormal.y -= cos(uPhoenixTime * 2.8 + aPhase + uv.y * 4.0) * aAmplitude * 4.0 * uv.y * uv.y * uPhoenixLife * abs(objectNormal.z);
      objectNormal = normalize(mix(objectNormal, vec3(0.0, 0.0, aFace), uPhoenixBlock * .8));
    `
    }
  `,
  );
  shader.fragmentShader = "varying vec2 vPhoenixUv;\n" + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <roughnessmap_fragment>",
    `
    #include <roughnessmap_fragment>
    float shaft = 1.0 - smoothstep(.025, .11, abs(vPhoenixUv.x - .5));
    float barbs = .5 + .5 * sin(vPhoenixUv.y * 48.0 - abs(vPhoenixUv.x - .5) * 45.0);
    roughnessFactor = clamp(roughnessFactor + barbs * .025 - shaft * .025, .035, 1.0);
  `,
  );
}
