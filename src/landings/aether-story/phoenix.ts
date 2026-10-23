import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/** A closed lenticular feather. Rings bend gently in depth; sharp tips remain separated. */
export function featherGeometry(length: number, width: number, bend = 0.15) {
  const vertices: number[] = [],
    indices: number[] = [];
  const rings = 15,
    sides = 12;
  for (let i = 0; i <= rings; i++) {
    const t = i / rings;
    const profile = Math.max(
      0.006,
      Math.pow(Math.sin(Math.PI * t), 0.74) * (1 - 0.38 * t),
    );
    for (let j = 0; j < sides; j++) {
      const a = (j / sides) * Math.PI * 2;
      vertices.push(
        Math.cos(a) * width * profile,
        t * length,
        Math.sin(a) * width * 0.5 * profile + bend * t * t,
      );
    }
  }
  for (let i = 0; i < rings; i++)
    for (let j = 0; j < sides; j++) {
      const a = i * sides + j,
        b = i * sides + ((j + 1) % sides),
        c = a + sides,
        d = b + sides;
      indices.push(a, d, b, a, c, d);
    }
  for (let j = 1; j < sides - 1; j++) {
    indices.push(0, j, j + 1);
    const a = rings * sides;
    indices.push(a, a + j + 1, a + j);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function mergeParts(parts: THREE.BufferGeometry[]) {
  // Normalise indexed and non-indexed primitive geometry before merging.
  const normalized = parts.map((g) => (g.index ? g.toNonIndexed() : g));
  normalized.forEach((g) => g.deleteAttribute("uv"));
  const result = mergeGeometries(normalized)!;
  new Set([...normalized, ...parts]).forEach((g) => g.dispose());
  return result;
}
export function makePhoenix(materials: THREE.MeshPhysicalMaterial[]) {
  const bird = new THREE.Group();
  bird.name = "Aether — glass phoenix";
  const body = new THREE.Group();
  bird.add(body);
  const parts: THREE.BufferGeometry[] = [];
  // One continuous curved body / neck / head surface avoids intersecting ellipsoids.
  const profile = [
    new THREE.Vector2(0.01, -0.96),
    new THREE.Vector2(0.18, -0.76),
    new THREE.Vector2(0.3, -0.4),
    new THREE.Vector2(0.32, -0.05),
    new THREE.Vector2(0.25, 0.3),
    new THREE.Vector2(0.16, 0.55),
    new THREE.Vector2(0.12, 0.85),
    new THREE.Vector2(0.13, 1.1),
    new THREE.Vector2(0.21, 1.32),
    new THREE.Vector2(0.23, 1.47),
    new THREE.Vector2(0.17, 1.62),
    new THREE.Vector2(0.02, 1.68),
  ];
  const curve = new THREE.SplineCurve(profile);
  const torso = new THREE.LatheGeometry(curve.getPoints(70), 32);
  const pos = torso.getAttribute("position");
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const curveX = 0.33 * THREE.MathUtils.smoothstep(y, 0.45, 1.4);
    pos.setXYZ(i, pos.getX(i) + curveX, y, pos.getZ(i) * 0.85);
  }
  torso.computeVertexNormals();
  parts.push(torso);
  const beak = new THREE.ConeGeometry(0.105, 0.4, 4);
  beak.rotateZ(-Math.PI / 2);
  beak.translate(0.69, 1.45, 0.02);
  parts.push(beak);
  for (let i = 0; i < 4; i++) {
    const crest = featherGeometry(0.62 + i * 0.1, 0.085, 0.09);
    crest.rotateZ(0.3 + i * 0.2);
    crest.translate(0.32 - i * 0.045, 1.6, -0.04);
    parts.push(crest);
  }
  body.add(new THREE.Mesh(mergeParts(parts), materials[0]));
  const eyeMaterial = new THREE.MeshStandardMaterial({
    color: "#5d4585",
    metalness: 0.4,
    roughness: 0.15,
  });
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 10, 8),
      eyeMaterial,
    );
    eye.position.set(0.44, 1.49, side * 0.182);
    body.add(eye);
  }
  // Central tail fans downward into seven separate curved ribbons.
  const tailParts: THREE.BufferGeometry[][] = [[], [], []];
  for (let i = 0; i < 9; i++) {
    const n = i - 4;
    const feather = featherGeometry(
      2.1 + (4 - Math.abs(n)) * 0.23,
      0.16 + (4 - Math.abs(n)) * 0.012,
      0.4 + Math.abs(n) * 0.035,
    );
    feather.rotateZ(Math.PI + n * 0.105);
    feather.rotateY(n * 0.12);
    feather.translate(n * 0.045, -0.6, -0.03 + Math.abs(n) * 0.04);
    tailParts[i % 3].push(feather);
  }
  tailParts.forEach((p, i) =>
    body.add(new THREE.Mesh(mergeParts(p), materials[i])),
  );
  const wings: THREE.Group[] = [];
  for (const side of [-1, 1]) {
    const wing = new THREE.Group();
    wing.position.set(side * 0.28, 0.43, 0);
    wing.name = side === 1 ? "right-wing-pivot" : "left-wing-pivot";
    const layers: THREE.BufferGeometry[][] = [[], [], []];
    // Primary feathers fan out along a broad rising arc with separate tips.
    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      const length = 1.25 + 1.7 * Math.sin(t * Math.PI * 0.78);
      const f = featherGeometry(
        length,
        0.16 + 0.015 * Math.sin(t * Math.PI),
        0.12 + t * 0.24,
      );
      f.rotateZ(-side * (0.08 + t * 1.3));
      f.translate(side * (0.05 + t * 1.3), 0.03 + t * 0.3, -0.12 + t * 0.1);
      layers[i % 3].push(f);
    }
    // A shorter row covers the shoulder and gives the wing a structured leading edge.
    for (let i = 0; i < 13; i++) {
      const t = i / 12;
      const f = featherGeometry(0.63 + t * 0.65, 0.13, 0.1);
      f.rotateZ(-side * (0.32 + t * 1.35));
      f.translate(side * (0.02 + t * 1.26), 0.01 + t * 0.31, 0.18);
      layers[(i + 1) % 3].push(f);
    }
    layers.forEach((p, i) => {
      const mesh = new THREE.Mesh(mergeParts(p), materials[i]);
      mesh.renderOrder = i;
      wing.add(mesh);
    });
    wings.push(wing);
    bird.add(wing);
  }
  bird.rotation.x = -0.06;
  return { bird, wings };
}
