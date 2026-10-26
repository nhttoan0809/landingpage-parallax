import * as THREE from "three";
import { makeBladeGeometry } from "../phoenix/geometry";
import { makePhoenix } from "../phoenix";
import { sampleFlight } from "../phoenix/motion";
import { sampleStory } from "../story";

function dispose(birds: THREE.Object3D[]) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  birds.forEach((bird) =>
    bird.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) geometries.add(mesh.geometry);
      if (mesh.material)
        (Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]
        ).forEach((material) => materials.add(material));
      if ((mesh as THREE.InstancedMesh).isInstancedMesh)
        (mesh as THREE.InstancedMesh).dispose();
    }),
  );
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

describe("articulated phoenix", () => {
  it.each([false, true])(
    "builds closed feather and ribbon surfaces at low=%s",
    (low) => {
      for (const tail of [undefined, { length: 4.6, spread: -0.5 }]) {
        const geometry = makeBladeGeometry(low, tail);
        const index = geometry.index!,
          position = geometry.getAttribute("position");
        const edges = new Map<string, number>();
        for (let i = 0; i < index.count; i += 3) {
          const triangle = [
            index.getX(i),
            index.getX(i + 1),
            index.getX(i + 2),
          ];
          triangle.forEach((a, j) => {
            const b = triangle[(j + 1) % 3];
            const key = [Math.min(a, b), Math.max(a, b)].join(":");
            edges.set(key, (edges.get(key) ?? 0) + 1);
          });
        }
        expect([...edges.values()].every((count) => count === 2)).toBe(true);
        expect(Array.from(position.array).every(Number.isFinite)).toBe(true);
        expect(
          Array.from(geometry.getAttribute("normal").array).every(
            Number.isFinite,
          ),
        ).toBe(true);
        expect(Math.max(...index.array)).toBeLessThan(position.count);
        expect(geometry.getAttribute("uv").count).toBe(position.count);
        geometry.dispose();
      }
    },
  );
  it("keeps distinct elbow/wrist lag, and static poses ignore time and pointer", () => {
    const pose = sampleStory(0.25, false);
    const animated = sampleFlight(pose, 1.3, false, { x: 0.8, y: 0.5 });
    expect(animated.elbowZ).not.toBe(animated.shoulderZ);
    expect(animated.wristZ).not.toBe(animated.elbowZ);
    expect(sampleFlight(pose, 2, false)).not.toEqual(
      sampleFlight(pose, 1.3, false),
    );
    expect(sampleFlight(pose, 2, true, { x: 1, y: -1 })).toEqual(
      sampleFlight(pose, 30, true),
    );
  });
  it("retains the silhouette hierarchy and nine ribbons while reducing low-tier feathers", () => {
    const materials = Array.from(
      { length: 6 },
      () => new THREE.MeshPhysicalMaterial(),
    );
    const high = makePhoenix(materials, false),
      low = makePhoenix(materials, true);
    expect(high.metrics.feathers).toBe(701);
    expect(low.metrics.feathers).toBeLessThan(high.metrics.feathers * 0.6);
    expect(high.metrics.batches).toBeLessThan(25);
    expect(high.metrics.tailRibbons).toBe(9);
    expect(low.metrics.tailRibbons).toBe(9);
    for (const rig of [high, low]) {
      const pose = sampleStory(0.25, false);
      rig.update(pose, 1, false, { x: 0.5, y: 0.2 });
      const shoulder = rig.bird.getObjectByName("Left_Wing_Shoulder")!;
      const elbow = rig.bird.getObjectByName("Left_Wing_Elbow")!;
      const wrist = rig.bird.getObjectByName("Left_Wing_Wrist")!;
      expect(wrist.parent).toBe(elbow);
      expect(elbow.parent).toBe(shoulder);
      const before = wrist.rotation.toArray();
      rig.update(pose, 1.8, false, { x: 0.5, y: 0.2 });
      expect(wrist.rotation.toArray()).not.toEqual(before);
      rig.update(pose, 1, true, { x: 0, y: 0 });
      const frozen = wrist.rotation.toArray();
      rig.update(pose, 20, true, { x: 1, y: 1 });
      expect(wrist.rotation.toArray()).toEqual(frozen);
    }
    dispose([high.bird, low.bird]);
  });
  it("samples every assembly parameter continuously at chapter boundaries", () => {
    expect(sampleStory(0.14, false).block).toBeGreaterThan(0.5);
    expect(sampleStory(0.24, false).block).toBeLessThan(0.01);
    for (const compact of [true, false])
      for (const p of [0.25, 0.5, 0.75]) {
        const left = sampleStory(p - 1e-7, compact),
          right = sampleStory(p + 1e-7, compact);
        for (const key of [
          "wing",
          "flap",
          "pitch",
          "tail",
          "scatter",
          "block",
        ] as const)
          expect(Math.abs(left[key] - right[key])).toBeLessThan(0.001);
      }
  });
});
