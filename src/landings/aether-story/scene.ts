import * as THREE from "three";
import { makePhoenix } from "./phoenix";
import { makeEnergy } from "./energyShader";
import { installGlassContour } from "./glassShader";
import { palettes, type Preset } from "./preset";
import { sampleStory, clamp } from "./story";

export type Quality = "auto" | "high" | "low";
export type SceneOptions = {
  canvas: HTMLCanvasElement;
  preview: boolean;
  isStatic: boolean;
  quality: Quality;
  journey: { progress: number };
  preset: Preset;
  onReady: () => void;
  onError: (message: string) => void;
};
export type SceneHandle = {
  update: (preset: Preset) => void;
  dispose: () => void;
};

export function createScene(options: SceneOptions): SceneHandle {
  const { canvas, journey, preview, isStatic, onReady, onError } = options;
  const compactQuery = matchMedia("(max-width: 767px)");
  let compact = compactQuery.matches;
  const low =
    options.quality === "low" ||
    (options.quality === "auto" &&
      (compact || (navigator.hardwareConcurrency || 4) <= 4));
  const dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !low,
    alpha: true,
    powerPreference: "high-performance",
  });
  const rollback: (() => void)[] = [
    () => {
      renderer.dispose();
      renderer.forceContextLoss();
    },
  ];
  try {
    renderer.debug.onShaderError = () =>
      onError(
        "This device could not compile the glass view. Continue with the illustrated story or try a lighter quality.",
      );
    renderer.setPixelRatio(dpr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.transmissionResolutionScale = low ? 0.45 : 0.75;
    const scene = new THREE.Scene();
    rollback.push(() => disposeObjects(scene));
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
    // A small original studio environment: dark room and five luminous photographic softboxes.
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color("#30273d");
    const reflectionPanels: THREE.Mesh[] = [];
    for (const [x, y, z, w, h, color] of [
      [-4, 2, 3, 2, 8, "#f5ecff"],
      [5, 1, 0, 1, 7, "#b7dce6"],
      [-1, 5, -3, 7, 1, "#ffffff"],
      [1, -3, 2, 3, 0.5, "#b4a0d4"],
      [0, 1, -5, 1.5, 5, "#e4aabe"],
    ] as [number, number, number, number, number, string][]) {
      const box = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }),
      );
      box.position.set(x, y, z);
      box.lookAt(0, 0, 0);
      envScene.add(box);
      reflectionPanels.push(box);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    rollback.push(() => pmrem.dispose());
    const environment = pmrem.fromScene(envScene, 0.025, 0.1, 40, {
      size: low ? 64 : 128,
    });
    rollback.push(() => environment.dispose());
    scene.environment = environment.texture;
    reflectionPanels.forEach((p) => {
      p.geometry.dispose();
      (p.material as THREE.Material).dispose();
    });
    envScene.clear();
    pmrem.dispose();
    const materials = [0, 1, 2].map(
      (i) =>
        new THREE.MeshPhysicalMaterial({
          color: "#f4edff",
          metalness: 0,
          roughness: 0.025 + i * 0.012,
          transmission: 1,
          thickness: 0.65 + i * 0.14,
          ior: 1.48,
          dispersion: 0.45,
          iridescence: 0.25,
          iridescenceIOR: 1.32,
          iridescenceThicknessRange: [150, 420],
          envMapIntensity: 2.3,
          attenuationColor: "#b6a4cc",
          attenuationDistance: 3.0,
          clearcoat: 0.7,
          clearcoatRoughness: 0.1,
          side: THREE.FrontSide,
        }),
    );
    const contourUpdates = materials.map(installGlassContour);
    const { bird, wings } = makePhoenix(materials);
    scene.add(bird);
    const energy = makeEnergy(low ? 60 : 180);
    scene.add(energy.points);
    scene.add(new THREE.HemisphereLight("#f5efff", "#72708d", 0.5));
    const key = new THREE.DirectionalLight("#ffffff", 1.5);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight("#c6b6f1", 3);
    rim.position.set(4, 2, -2);
    scene.add(rim);
    const fill = new THREE.PointLight("#add9e8", 12, 18);
    fill.position.set(-3, -1, 4);
    scene.add(fill);
    // Original frosted light field behind the glass provides a real scene to refract.
    const fieldCanvas = document.createElement("canvas");
    fieldCanvas.width = 512;
    fieldCanvas.height = 512;
    const field = fieldCanvas.getContext("2d")!;
    field.fillStyle = "#eeedf4";
    field.fillRect(0, 0, 512, 512);
    const wash = field.createRadialGradient(256, 240, 30, 256, 256, 255);
    wash.addColorStop(0, "rgba(183,160,207,.27)");
    wash.addColorStop(0.65, "rgba(202,183,221,.16)");
    wash.addColorStop(1, "rgba(238,237,244,0)");
    field.fillStyle = wash;
    field.fillRect(0, 0, 512, 512);
    const fieldTexture = new THREE.CanvasTexture(fieldCanvas);
    rollback.push(() => fieldTexture.dispose());
    fieldTexture.colorSpace = THREE.SRGBColorSpace;
    const backdropMaterial = new THREE.MeshBasicMaterial({
      map: fieldTexture,
      toneMapped: false,
    });
    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(8.8, 9.5),
      backdropMaterial,
    );
    backdrop.position.set(2.7, 0, -2.5);
    scene.add(backdrop);
    const crystalScene = new THREE.Scene();
    rollback.push(() => disposeObjects(crystalScene));
    crystalScene.background = new THREE.Color("#171522");
    crystalScene.environment = environment.texture;
    crystalScene.add(new THREE.HemisphereLight("#fff8ff", "#44405a", 3));
    const crystalLight = new THREE.DirectionalLight("#ffffff", 4);
    crystalLight.position.set(-2, 3, 4);
    crystalScene.add(crystalLight);
    const crystalCamera = new THREE.PerspectiveCamera(35, 1.4, 0.1, 30);
    crystalCamera.position.set(0, 0.2, 6);
    const crystalMaterials = ["#c8b7ec", "#a6d8e8", "#c7d9b5"].map(
      (c) =>
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(c).lerp(new THREE.Color("#ffffff"), 0.6),
          attenuationColor: c,
          attenuationDistance: 2,
          roughness: 0.04,
          transmission: 1,
          thickness: 1.5,
          ior: 1.5,
          dispersion: 0.7,
          metalness: 0,
          envMapIntensity: 3,
          clearcoat: 0.8,
        }),
    );
    const crystalVertices: number[] = [],
      crystalIndices: number[] = [];
    const rings = [
      [-1.4, 0.02],
      [-0.8, 0.57],
      [0.6, 0.65],
      [1.05, 0.48],
      [1.5, 0.01],
    ];
    for (const [y, r] of rings)
      for (let j = 0; j < 6; j++) {
        const a = (j / 6) * Math.PI * 2;
        crystalVertices.push(Math.cos(a) * r, y, Math.sin(a) * r);
      }
    for (let k = 0; k < 4; k++)
      for (let j = 0; j < 6; j++) {
        const a = k * 6 + j,
          b = k * 6 + ((j + 1) % 6);
        crystalIndices.push(a, b + 6, b, a, a + 6, b + 6);
      }
    const crystalBase = new THREE.BufferGeometry();
    crystalBase.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(crystalVertices, 3),
    );
    crystalBase.setIndex(crystalIndices);
    const crystalGeometry = crystalBase.toNonIndexed();
    crystalGeometry.computeVertexNormals();
    crystalBase.dispose();
    const crystals = crystalMaterials.map((material, i) => {
      const mesh = new THREE.Mesh(crystalGeometry, material);
      mesh.scale.set(0.72, 1.12, 0.65);
      mesh.rotation.set(0.12, 0.3 + i * 0.7, -0.15 + i * 0.12);
      crystalScene.add(mesh);
      return mesh;
    });
    const resonanceSection = preview
      ? null
      : document.getElementById("resonance");
    const formationSlot = document.querySelector<HTMLElement>(
      "[data-formation-slot]",
    );
    const slots = preview
      ? []
      : Array.from(
          document.querySelectorAll<HTMLElement>("[data-crystal-slot]"),
        );
    const lightColor = new THREE.Color("#eeedf4"),
      nightColor = new THREE.Color("#171522"),
      background = new THREE.Color();
    const pointer = { x: 0, y: 0 };
    let px = 0,
      py = 0;
    let width = 0,
      height = 0,
      frame = 0,
      dead = false,
      lost = false,
      time = 0,
      lastTime = 0;
    let preset = options.preset;
    let drawing = false;
    function render(now = performance.now()) {
      if (dead || lost || document.hidden || drawing || !width || !height)
        return;
      drawing = true;
      try {
        if (!isStatic) {
          time += Math.min((now - (lastTime || now)) / 1000, 0.05);
        }
        lastTime = now;
        const pose = sampleStory(preview ? 1 : journey.progress, compact);
        if (preview) {
          pose.x = 0;
          pose.y = 0.35;
          pose.scale = compact ? 0.53 : 0.73;
          pose.z = compact ? 12 : 11;
          pose.night = 0;
          pose.bird = 1;
        }
        if (!compact && !preview && camera.aspect < 1.3) {
          pose.scale *= 0.49;
          pose.x = 1.3;
        }
        if (compact && !preview && formationSlot) {
          const weight =
            THREE.MathUtils.smoothstep(journey.progress, 0.2, 0.25) *
            (1 - THREE.MathUtils.smoothstep(journey.progress, 0.43, 0.5));
          if (weight > 0) {
            const rect = formationSlot.getBoundingClientRect();
            const worldHeight =
              2 * pose.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
            const y =
              ((height / 2 - rect.top - rect.height / 2) / height) *
              worldHeight;
            pose.y = THREE.MathUtils.lerp(pose.y, y, weight);
          }
        }
        camera.position.set(
          (compact ? 0.12 : 0.4) * Math.sin(pose.turn),
          compact ? 0 : 0.12 * pose.turn,
          pose.z,
        );
        camera.lookAt(0, 0, 0);
        px += (pointer.x - px) * 0.05;
        py += (pointer.y - py) * 0.05;
        bird.position.set(pose.x, pose.y, 0);
        bird.scale.setScalar(pose.scale);
        bird.rotation.y = pose.turn + (isStatic ? 0 : px * 0.045);
        bird.rotation.x = -0.06 + (isStatic ? 0 : py * 0.025);
        bird.visible = pose.bird > 0.02;
        // Scale into a fine spark before leaving, then fully reassemble for the final reveal.
        bird.scale.multiplyScalar(0.25 + 0.75 * pose.bird);
        wings[0].rotation.y = pose.wing;
        wings[1].rotation.y = -pose.wing;
        wings[0].rotation.z = -pose.wing * 0.4;
        wings[1].rotation.z = pose.wing * 0.4;
        energy.points.position.copy(bird.position);
        energy.points.scale.copy(bird.scale);
        energy.material.uniforms.uTime.value = time;
        energy.material.uniforms.uEnergy.value = pose.energy;
        backdrop.position.x = pose.x;
        backdrop.visible = pose.night < 0.3;
        background.copy(lightColor).lerp(nightColor, pose.night);
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, width, height);
        renderer.setClearColor(background, 0);
        renderer.autoClear = false;
        renderer.clear();
        // The gallery owns a solid HTML background: clip the light sculpture to the surrounding
        // chapters, so white project text stays readable at every partial-scroll position.
        const gallery = resonanceSection?.getBoundingClientRect();
        if (gallery && gallery.top < height && gallery.bottom > 0) {
          renderer.setScissorTest(true);
          if (gallery.top > 0) {
            renderer.setScissor(0, height - gallery.top, width, gallery.top);
            renderer.render(scene, camera);
          }
          if (gallery.bottom < height) {
            renderer.setScissor(0, 0, width, height - gallery.bottom);
            renderer.render(scene, camera);
          }
          renderer.setScissorTest(false);
        } else renderer.render(scene, camera);
        if (slots.length) {
          const bounds = slots.map((slot) => slot.getBoundingClientRect());
          renderer.autoClear = false;
          for (let i = 0; i < bounds.length; i++) {
            const r = bounds[i];
            if (r.bottom < 0 || r.top > height || r.width === 0) continue;
            renderer.setScissorTest(true);
            renderer.setScissor(r.left, height - r.bottom, r.width, r.height);
            renderer.setViewport(r.left, height - r.bottom, r.width, r.height);
            renderer.clearDepth();
            crystalCamera.aspect = r.width / r.height;
            crystalCamera.updateProjectionMatrix();
            crystals.forEach((c, index) => {
              c.visible = index === i;
            });
            crystals[i].rotation.y =
              0.3 + i * 0.7 + (isStatic ? 0 : time * 0.08);
            const active = slots[i]
              .closest("button")
              ?.matches(":hover, :focus-visible");
            const scale = active ? 1.08 : 1;
            crystals[i].scale.set(0.72 * scale, 1.12 * scale, 0.65 * scale);
            renderer.render(crystalScene, crystalCamera);
          }
          renderer.setScissorTest(false);
        }
      } catch {
        lost = true;
        onError(
          "The 3D view could not be drawn. The illustrated story is still available.",
        );
      } finally {
        drawing = false;
      }
    }
    function animate(now: number) {
      render(now);
      if (!dead && !lost && !document.hidden && !isStatic)
        frame = requestAnimationFrame(animate);
    }
    function resize() {
      const parent = canvas.parentElement!;
      width = parent.clientWidth;
      height = parent.clientHeight;
      if (!width || !height || dead) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    }
    const resizeObserver = new ResizeObserver(resize);
    rollback.push(() => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
    });
    resizeObserver.observe(canvas.parentElement!);
    function move(e: PointerEvent) {
      if (e.pointerType !== "mouse" || isStatic || compact) return;
      pointer.x = clamp((e.clientX / innerWidth) * 2 - 1, -1, 1);
      pointer.y = clamp((e.clientY / innerHeight) * 2 - 1, -1, 1);
    }
    function leave() {
      pointer.x = 0;
      pointer.y = 0;
    }
    function visibility() {
      cancelAnimationFrame(frame);
      lastTime = 0;
      if (!document.hidden) {
        render();
        if (!isStatic) frame = requestAnimationFrame(animate);
      }
    }
    function contextLost(event: Event) {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      onError(
        "Your graphics connection was interrupted. Read the illustrated story or retry the 3D view.",
      );
    }
    function changeCompact() {
      compact = compactQuery.matches;
      resize();
    }
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave);
    canvas.addEventListener("webglcontextlost", contextLost);
    compactQuery.addEventListener("change", changeCompact);
    rollback.push(() => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      canvas.removeEventListener("webglcontextlost", contextLost);
      compactQuery.removeEventListener("change", changeCompact);
    });
    function update(value: Preset) {
      preset = value;
      const palette = palettes[preset.palette];
      materials.forEach((material, i) => {
        material.color
          .set(palette.color)
          .lerp(new THREE.Color("#ffffff"), 0.65 + i * 0.08);
        material.attenuationColor.set(palette.edge);
        contourUpdates[i](palette.edge, preset.dispersion);
        material.dispersion = 0.03 + preset.dispersion * 0.97;
        material.iridescence = 0.1 + preset.dispersion * 0.5;
        material.emissive.set(palette.light);
        material.emissiveIntensity = preset.glow * 0.09;
      });
      energy.material.uniforms.uColor.value.set(palette.edge);
      energy.material.uniforms.uGlow.value = preset.glow;
      energy.material.uniforms.uDpr.value = dpr;
      render();
    }
    update(preset);
    resize();
    canvas.dataset.quality = low ? "low" : "high";
    const uniqueGeometry = new Set<THREE.BufferGeometry>();
    let geometryBytes = 0;
    for (const tree of [scene, crystalScene])
      tree.traverse((object) => {
        const g = (object as THREE.Mesh).geometry;
        if (g) uniqueGeometry.add(g);
      });
    uniqueGeometry.forEach((g) => {
      Object.values(g.attributes).forEach((a) => {
        geometryBytes += a.array.byteLength;
      });
      if (g.index) geometryBytes += g.index.array.byteLength;
    });
    canvas.dataset.geometryBytes = String(geometryBytes);
    canvas.dataset.environmentBytes = String(
      environment.width * environment.height * 8,
    );
    canvas.dataset.fieldBytes = String(512 * 512 * 4);
    canvas.dataset.triangles = String(renderer.info.render.triangles);
    onReady();
    if (!isStatic) frame = requestAnimationFrame(animate);
    return {
      update,
      dispose() {
        dead = true;
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        document.removeEventListener("visibilitychange", visibility);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerout", leave);
        canvas.removeEventListener("webglcontextlost", contextLost);
        compactQuery.removeEventListener("change", changeCompact);
        disposeObjects(scene, crystalScene);
        fieldTexture.dispose();
        environment.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        scene.clear();
        crystalScene.clear();
      },
    };
  } catch (error) {
    rollback.reverse().forEach((dispose) => {
      try {
        dispose();
      } catch {
        /* Preserve the original setup error. */
      }
    });
    throw error;
  }
}

function disposeObjects(...trees: THREE.Object3D[]) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  for (const tree of trees)
    tree.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.geometry) geometries.add(mesh.geometry);
      if (mesh.material)
        (Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]
        ).forEach((material) => materials.add(material));
    });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}
