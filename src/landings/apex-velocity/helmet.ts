import * as THREE from "three";
import type { Variant } from "./variants";

// Original parametric full-face shell. +Z is the front of the helmet.
function shellPoint(theta: number, phi: number, inflate = 1) {
  const s = Math.sin(theta);
  const front = Math.max(0, Math.cos(phi));
  const chin = Math.max(0, Math.sin((theta - 1.52) * 2.5)) * 0.28 * front ** 5;
  return new THREE.Vector3(
    1.12 * s * Math.sin(phi) * inflate,
    (1.31 * Math.cos(theta) + 0.14) * inflate,
    (1.2 * s * Math.cos(phi) + chin) * inflate,
  );
}
function surface(
  t0: number,
  t1: number,
  p0: number,
  p1: number,
  rows: number,
  cols: number,
  hole = false,
  inflate = 1,
) {
  const positions: number[] = [],
    uv: number[] = [],
    indices: number[] = [];
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++) {
      const t = t0 + ((t1 - t0) * r) / rows,
        p = p0 + ((p1 - p0) * c) / cols;
      positions.push(...shellPoint(t, p, inflate).toArray());
      uv.push((p + Math.PI) / (2 * Math.PI), 1 - t / 2.32);
    }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const t = t0 + ((t1 - t0) * (r + 0.5)) / rows,
        p = p0 + ((p1 - p0) * (c + 0.5)) / cols;
      if (hole && t > 1.17 && t < 1.69 && Math.abs(p) < 1.36) continue;
      const a = r * (cols + 1) + c,
        b = a + cols + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function paint(canvas: HTMLCanvasElement, v: Variant) {
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = v.shell;
  ctx.fillRect(0, 0, 1024, 512);
  ctx.fillStyle = v.accent;
  for (const x of [170, 660]) {
    ctx.beginPath();
    ctx.moveTo(x - 90, 80);
    ctx.lineTo(x + 26, 80);
    ctx.lineTo(x + 220, 480);
    ctx.lineTo(x + 90, 480);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 55, 80);
    ctx.lineTo(x + 78, 80);
    ctx.lineTo(x + 272, 480);
    ctx.lineTo(x + 246, 480);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#202327";
  ctx.font = "italic 900 86px Arial";
  ctx.fillText("AV", 187, 255);
  ctx.fillText("AV", 696, 255);
  ctx.font = "bold 15px Arial";
  ctx.fillText("APEX VELOCITY", 173, 282);
  ctx.fillText("APEX VELOCITY", 680, 282);
  ctx.fillStyle = v.accent;
  ctx.font = "italic 900 68px Arial";
  ctx.fillText("27", 472, 140);
  if (v.id === "afterhours") {
    ctx.globalAlpha = 0.075;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    for (let i = -512; i < 1024; i += 12) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 512, 512);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
}
export function createHelmet(variant: Variant) {
  const group = new THREE.Group();
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  paint(canvas, variant);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;
  const shell = new THREE.MeshPhysicalMaterial({
    map,
    roughness: 0.25,
    metalness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.16,
    side: THREE.DoubleSide,
  });
  const visor = new THREE.MeshPhysicalMaterial({
    color: variant.visor,
    metalness: 0.82,
    roughness: 0.14,
    clearcoat: 1,
    envMapIntensity: 1.6,
    side: THREE.DoubleSide,
  });
  const rubber = new THREE.MeshStandardMaterial({
    color: "#111519",
    roughness: 0.84,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: "#a4a6a6",
    metalness: 0.9,
    roughness: 0.25,
  });
  const graphic = new THREE.MeshStandardMaterial({
    color: variant.accent,
    roughness: 0.3,
  });
  group.add(
    new THREE.Mesh(
      surface(0.002, 2.32, -Math.PI, Math.PI, 60, 112, true),
      shell,
    ),
  );
  group.add(
    new THREE.Mesh(
      surface(1.15, 1.71, -1.39, 1.39, 12, 64, false, 1.022),
      visor,
    ),
  );
  function tube(
    points: THREE.Vector3[],
    radius: number,
    material: THREE.Material,
    closed = false,
  ) {
    const curve = new THREE.CatmullRomCurve3(points, closed);
    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 96, radius, 6, closed),
      material,
    );
    group.add(mesh);
    return mesh;
  }
  for (const t of [1.15, 1.71])
    tube(
      Array.from({ length: 45 }, (_, i) =>
        shellPoint(t, -1.39 + (i / 44) * 2.78, 1.025),
      ),
      0.024,
      rubber,
    );
  tube(
    Array.from({ length: 65 }, (_, i) =>
      shellPoint(2.32, -Math.PI + (i / 64) * Math.PI * 2),
    ),
    0.045,
    rubber,
    true,
  );
  // Visor hinge hardware, raised air intakes and a signature crown blade.
  for (const side of [-1, 1]) {
    const pivot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105, 0.105, 0.065, 24),
      rubber,
    );
    pivot.rotation.z = Math.PI / 2;
    pivot.position.set(side * 1.115, 0.24, 0.3);
    group.add(pivot);
    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.043, 0.043, 0.072, 6),
      metal,
    );
    bolt.rotation.z = Math.PI / 2;
    bolt.position.copy(pivot.position);
    group.add(bolt);
    const vent = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.055, 0.1),
      rubber,
    );
    vent.position.set(side * 0.38, 1.22, 0.52);
    vent.rotation.x = -0.4;
    group.add(vent);
  }
  for (let i = 0; i < 5; i++) {
    const phi = (i - 2) * 0.11;
    group.add(
      new THREE.Mesh(
        surface(1.96, 2.015, phi - 0.037, phi + 0.037, 3, 4, false, 1.008),
        rubber,
      ),
    );
  }
  const lock = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.16, 0.06), metal);
  lock.position.set(0.45, 0.02, 1.16);
  lock.rotation.y = 0.3;
  group.add(lock);
  const spoiler = new THREE.Mesh(
    new THREE.BoxGeometry(1.36, 0.055, 0.27),
    graphic,
  );
  spoiler.position.set(0, 0.45, -1.13);
  spoiler.rotation.x = 0.15;
  group.add(spoiler);
  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.71, 0.75, 0.19, 48, 1, true),
    rubber,
  );
  inner.position.y = -0.72;
  group.add(inner);
  return {
    group,
    update(v: Variant) {
      paint(canvas, v);
      map.needsUpdate = true;
      visor.color.set(v.visor);
      graphic.color.set(v.accent);
      shell.roughness = v.id === "afterhours" ? 0.46 : 0.25;
    },
    dispose() {
      group.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      [shell, visor, rubber, metal, graphic].forEach((m) => m.dispose());
      map.dispose();
    },
  };
}
