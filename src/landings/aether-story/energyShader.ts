import * as THREE from "three";
/** Original analytic energy shader. Value-noise flicker, radial falloff, and a moving wave; no texture or feedback buffer. */
export function makeEnergy(count: number) {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [],
    seeds: number[] = [];
  for (let i = 0; i < count; i++) {
    const angle = i * 2.39996323;
    const r = 0.7 + (((i * 73) % 101) / 101) * 4.4;
    positions.push(
      Math.cos(angle) * r,
      Math.sin(angle) * r * 0.75 - 0.4,
      Math.sin(i * 1.7) * 1.3 - 0.8,
    );
    seeds.push((i * 0.61803398875) % 1);
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uGlow: { value: 0.35 },
      uEnergy: { value: 0.25 },
      uDpr: { value: 1 },
      uColor: { value: new THREE.Color("#9e77c7") },
    },
    vertexShader: `
      attribute float aSeed;
      uniform float uTime; uniform float uEnergy; uniform float uDpr;
      varying float vSeed;
      void main() {
        vSeed = aSeed;
        vec3 p = position;
        p.x += sin(uTime * .18 + aSeed * 18.) * .09 * uEnergy;
        p.y += sin(uTime * .25 + aSeed * 22.) * .14 * uEnergy;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = min(9., (1.3 + aSeed * 2.1) * uDpr * 11. / -mv.z);
      }`,
    fragmentShader: `
      uniform float uTime; uniform float uGlow; uniform float uEnergy; uniform vec3 uColor;
      varying float vSeed;
      float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
      float noise(float n) { float i = floor(n); float f = fract(n); f = f*f*(3.-2.*f); return mix(hash(i), hash(i+1.), f); }
      void main() {
        float r = length(gl_PointCoord - .5) * 2.;
        float spark = pow(max(0., 1. - r), 2.);
        float flicker = .55 + .45 * noise(uTime * .5 + vSeed * 77.);
        float wave = .75 + .25 * sin(vSeed * 24. - uTime * .4);
        float alpha = spark * flicker * wave * uGlow * (.2 + uEnergy * .8);
        gl_FragColor = vec4(uColor, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.renderOrder = 10;
  return { points, material };
}
