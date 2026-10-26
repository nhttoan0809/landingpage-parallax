import * as THREE from "three";

/** Closed, UV-mapped quill derived from the supplied prototype's asymmetric vane.
 * Both faces and the perimeter are real geometry, so physical transmission has thickness.
 */
export function makeBladeGeometry(
  low: boolean,
  tail?: { length: number; spread: number },
) {
  const nx = low ? 2 : 4,
    ny = tail ? (low ? 28 : 44) : low ? 8 : 12;
  const positions: number[] = [],
    uvs: number[] = [],
    faces: number[] = [],
    indices: number[] = [];
  const stride = nx + 1,
    surface = stride * (ny + 1);
  for (const side of [1, -1]) {
    for (let iy = 0; iy <= ny; iy++) {
      const t = iy / ny;
      for (let ix = 0; ix <= nx; ix++) {
        const u = ix / nx,
          x = (u - 0.5) * 0.22;
        if (tail) {
          const flare = Math.exp(-Math.pow((t - 0.88) * 12, 2)) * 0.85;
          const profile =
            (Math.sin(Math.sqrt(t) * Math.PI) * 0.85 + 0.2 + flare) *
            (1 - Math.pow(t, 8));
          positions.push(
            x * 1.65 * Math.max(0.002, profile) + tail.spread * t * 1.85,
            -Math.pow(t, 1.45) * 0.65 +
              side * 0.009 * Math.max(0.04, Math.sin(Math.PI * u)),
            -t * tail.length,
          );
        } else {
          const profile =
            Math.sin(Math.pow(t, 0.68) * Math.PI) * (1 - 0.18 * t) +
            0.08 * (1 - t);
          const px = x * Math.max(0.001, profile) * (x > 0 ? 0.82 : 1.15);
          const shaft = Math.abs(px) / 0.14;
          const camber =
            Math.exp(-shaft * 5) * 0.022 * (1 - t * 0.6) -
            Math.pow(t, 1.85) * 0.14 -
            Math.pow(shaft, 1.6) * 0.025;
          positions.push(
            px,
            t,
            camber +
              side *
                (0.0005 +
                  0.007 * Math.sin(Math.PI * u) * Math.sin(Math.PI * t)),
          );
        }
        uvs.push(u, t);
        faces.push(side);
      }
    }
  }
  for (let iy = 0; iy < ny; iy++)
    for (let ix = 0; ix < nx; ix++) {
      const a = iy * stride + ix,
        b = a + 1,
        c = a + stride,
        d = c + 1;
      indices.push(
        a,
        b,
        d,
        a,
        d,
        c,
        a + surface,
        d + surface,
        b + surface,
        a + surface,
        c + surface,
        d + surface,
      );
    }
  const perimeter: number[] = [];
  for (let i = 0; i <= nx; i++) perimeter.push(i);
  for (let i = 1; i <= ny; i++) perimeter.push(i * stride + nx);
  for (let i = nx - 1; i >= 0; i--) perimeter.push(ny * stride + i);
  for (let i = ny - 1; i > 0; i--) perimeter.push(i * stride);
  perimeter.forEach((a, i) => {
    const b = perimeter[(i + 1) % perimeter.length];
    indices.push(a, b + surface, b, a, a + surface, b + surface);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("aFace", new THREE.Float32BufferAttribute(faces, 1));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
