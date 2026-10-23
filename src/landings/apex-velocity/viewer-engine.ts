import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createHelmet } from "./helmet";
import type { Variant } from "./variants";
export type Motion = { angle: number; scale: number; tilt: number };
export function mountViewer(
  host: HTMLElement,
  variant: Variant,
  motion: Motion,
  onReady: () => void,
  onError: () => void,
) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.5),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.append(canvas);
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(33, 1, 0.1, 30);
  camera.position.set(0, 0.25, 6.7);
  const environmentScene = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(environmentScene, 0.04);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.75;
  environmentScene.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x7e7470, 1.1));
  const key = new THREE.DirectionalLight(0xfff3de, 2.5);
  key.position.set(-3, 5, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc9e0ff, 1.5);
  fill.position.set(4, 2, -2);
  scene.add(fill);
  const model = createHelmet(variant);
  scene.add(model.group);
  let active = true,
    lost = false,
    disposed = false,
    raf = 0,
    previous = 0,
    frames = 0,
    userAngle = 0,
    targetX = 0,
    targetY = 0,
    x = 0,
    y = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();
  function render(time: number) {
    if (disposed || lost || !active || document.hidden) return;
    const dt = Math.min((time - previous) / 1000, 0.05);
    previous = time;
    x = THREE.MathUtils.damp(x, targetX, 7, dt);
    y = THREE.MathUtils.damp(y, targetY, 7, dt);
    model.group.rotation.set(
      motion.tilt + x,
      -0.72 + motion.angle + userAngle + y,
      -0.08,
    );
    model.group.scale.setScalar(motion.scale);
    model.group.position.y = reduce.matches
      ? 0
      : Math.sin(time * 0.00065) * 0.035;
    renderer.render(scene, camera);
    frames++;
    canvas.dataset.frames = String(frames);
    raf = requestAnimationFrame(render);
  }
  function start() {
    cancelAnimationFrame(raf);
    if (active && !document.hidden && !disposed && !lost) {
      previous = performance.now();
      raf = requestAnimationFrame(render);
    }
  }
  const intersection = new IntersectionObserver(
    (entries) => {
      active = entries[0].isIntersecting;
      start();
    },
    { rootMargin: "80px" },
  );
  intersection.observe(host);
  document.addEventListener("visibilitychange", start);
  const onLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    onError();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  let pointer: number | null = null,
    lastX = 0;
  const down = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointer = event.pointerId;
    lastX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent) => {
    if (pointer === event.pointerId) {
      userAngle += (event.clientX - lastX) * 0.012;
      lastX = event.clientX;
    } else if (event.pointerType === "mouse" && !reduce.matches) {
      const rect = canvas.getBoundingClientRect();
      targetY =
        ((event.clientX - rect.left - rect.width / 2) / rect.width) * 0.34;
      targetX =
        ((event.clientY - rect.top - rect.height / 2) / rect.height) * 0.14;
    }
  };
  const up = () => {
    pointer = null;
  };
  const leave = () => {
    targetX = 0;
    targetY = 0;
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("pointerleave", leave);
  renderer.render(scene, camera);
  onReady();
  start();
  return {
    capture() {
      renderer.render(scene, camera);
      return canvas.toDataURL("image/webp", 0.93);
    },
    update: model.update,
    rotate(delta: number) {
      userAngle += delta;
    },
    reset() {
      userAngle = 0;
      targetX = 0;
      targetY = 0;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      intersection.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", start);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", leave);
      model.dispose();
      env.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
