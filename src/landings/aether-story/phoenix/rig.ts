import * as THREE from "three";
import { makeBladeGeometry } from "./geometry";
import { sampleFlight } from "./motion";
import type { Pose } from "../story";

/** Anatomical layout ported from the user-supplied phoenix prototype.
 * Shared feather instances are attached to individual joints; no CDN or prototype UI is loaded.
 */
export function makePhoenix(
  materials: THREE.MeshPhysicalMaterial[],
  low = false,
) {
  const bird = new THREE.Group();
  bird.name = "Aether — articulated glass phoenix";
  const phoenixShaderMat = materials[1],
    crestShaderMat = materials[2];
  const densityMult = low ? 0.46 : 1;
  const featherGeo = makeBladeGeometry(low);
  const beakHornMat = new THREE.MeshStandardMaterial({
    color: "#ae97ba",
    metalness: 0.55,
    roughness: 0.24,
  });
  const eyeGlowMat = new THREE.MeshStandardMaterial({
    color: "#332943",
    emissive: "#7260a2",
    emissiveIntensity: 0.15,
    roughness: 0.2,
  });
  type Feather = {
    pos: THREE.Vector3;
    rot: THREE.Euler;
    featherScale: THREE.Vector3;
    material?: THREE.Material;
    flutterPhase?: number;
    flutterAmp?: number;
    isVentralChest?: boolean;
  };
  const batches = new Map<THREE.Group, Map<THREE.Material, Feather[]>>();
  let featherCount = 0;
  function addSculptedFeather(parent: THREE.Group, options: Feather) {
    const byMaterial =
      batches.get(parent) ?? new Map<THREE.Material, Feather[]>();
    batches.set(parent, byMaterial);
    const material =
      options.material ??
      (parent.name.includes("Wing") ? phoenixShaderMat : materials[5]);
    const feathers = byMaterial.get(material) ?? [];
    byMaterial.set(material, feathers);
    feathers.push(options);
    featherCount++;
  }
  const bodyPivot = new THREE.Group();
  bodyPivot.name = "Torso_Core";
  bird.add(bodyPivot);

  // Sleek falcon-like torso core (tucked ventral sternum, slender streamlined keel)
  const coreGeo = new THREE.SphereGeometry(0.42, 28, 24);
  const corePos = coreGeo.attributes.position;
  for (let i = 0; i < corePos.count; i++) {
    let cx = corePos.getX(i) * 0.76;
    let cy = corePos.getY(i);
    const cz = corePos.getZ(i) * 1.95;

    // Flatten & tuck in the lower chest/belly (cy < 0) so it never looks bloated
    if (cy < 0) {
      cy *= 0.48;
    } else {
      cy *= 0.78;
    }
    // Taper front sternum and rear pelvis smoothly
    const longitudinalTaper = 1.0 - Math.pow(Math.abs(cz) / 0.92, 2.2) * 0.35;
    cx *= longitudinalTaper;
    // Gentle aerodynamic arch
    cy += Math.sin((cz / 0.85) * Math.PI * 0.5) * 0.06;

    corePos.setXYZ(i, cx, cy, cz);
  }
  coreGeo.computeVertexNormals();

  const coreMesh = new THREE.Mesh(coreGeo, materials[0]);
  coreMesh.name = "Sleek_Torso_Hull";
  coreMesh.position.set(0, 0.24, 0.02);
  coreMesh.rotation.x = -0.08;
  bodyPivot.add(coreMesh);

  // Streamlined Overlapping Dorsal & Ventral Plumage (Flush backward along body tangent)
  const dummyObj = new THREE.Object3D();
  const numTorsoRings = Math.round(20 * densityMult);
  for (let r = 0; r < numTorsoRings; r++) {
    const t = r / (numTorsoRings - 1); // 0.0 (neck base) -> 1.0 (tail root)
    const zPos = 0.68 - t * 1.48;
    const envelope = Math.sin(Math.pow(t, 0.72) * Math.PI); // 0 at ends, 1 at mid-shoulder

    // Spine centerline curve (sleek and elevated)
    const yCenter = 0.29 - t * 0.28 + Math.sin(t * Math.PI) * 0.05;
    const radiusX = envelope * 0.3 + 0.08;
    const radiusTop = envelope * 0.24 + 0.07;
    // Ventral (under-chest) vertical radius is kept very shallow & tucked
    const radiusBottom = (envelope * 0.12 + 0.045) / 1.25;

    // Surface tangent derivative dz -> dy & dr for flush feather alignment
    const dEnvelope =
      Math.cos(Math.pow(t, 0.72) * Math.PI) *
      0.72 *
      Math.pow(Math.max(0.05, t), -0.28);

    const feathersInRing = Math.max(
      8,
      Math.round(16 * Math.sin(t * Math.PI + 0.2) * densityMult),
    );
    for (let j = 0; j < feathersInRing; j++) {
      const angle =
        (j / feathersInRing) * Math.PI * 2 +
        (r % 2) * (Math.PI / feathersInRing);
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const isVentral = sinA < 0; // Under-chest / belly region

      // Skip front-most lower chest feathers near neck base so the throat/sternum is razor-clean
      if (isVentral && t < 0.14 && sinA < -0.35) continue;

      const rY = isVentral ? radiusBottom : radiusTop;
      const px = cosA * radiusX * (isVentral ? 0.86 : 1.0);
      const py = yCenter + sinA * rY;

      // Compute exact backward tangent target so every feather hugs the body toward the tail (-Z)
      // Remember: feather geometry has root at y=0 and tip at +Y, with dorsal ridge at +Z
      const nextT = Math.min(1.0, t + 0.18);
      const nextEnv = Math.sin(Math.pow(nextT, 0.72) * Math.PI);
      const nextYCenter =
        0.29 - nextT * 0.28 + Math.sin(nextT * Math.PI) * 0.05;
      const nextRX = nextEnv * 0.3 + 0.08;
      const nextRY = isVentral
        ? (nextEnv * 0.12 + 0.045) / 1.25
        : nextEnv * 0.24 + 0.07;

      const targetX = cosA * nextRX * (isVentral ? 0.82 : 0.98);
      const targetY = nextYCenter + sinA * nextRY;
      const targetZ = 0.68 - nextT * 1.48;

      // Orient feather so its local +Y axis (feather tip) points strictly backward along (target - pos)
      const dirVec = new THREE.Vector3(
        targetX - px,
        targetY - py,
        targetZ - zPos,
      ).normalize();
      const outwardNormal = new THREE.Vector3(
        cosA,
        sinA * (isVentral ? 0.6 : 1.0),
        -dEnvelope * 0.08,
      ).normalize();

      // Construct orthonormal basis: Y = dirVec (tip direction), Z = outwardNormal (dorsal face)
      const xAxis = new THREE.Vector3()
        .crossVectors(dirVec, outwardNormal)
        .normalize();
      const zAxis = new THREE.Vector3().crossVectors(xAxis, dirVec).normalize();
      const rotMat = new THREE.Matrix4().makeBasis(xAxis, dirVec, zAxis);
      dummyObj.rotation.setFromRotationMatrix(rotMat);

      // Ventral chest feathers are shorter & narrower so they form sleek overlapping scales
      const fLen = isVentral ? 0.2 + envelope * 0.11 : 0.28 + envelope * 0.18;
      const fWidth = isVentral ? 0.68 : 0.85;

      addSculptedFeather(bodyPivot, {
        pos: new THREE.Vector3(px, py, zPos),
        rot: dummyObj.rotation.clone(),
        featherScale: new THREE.Vector3(fWidth, fLen, 0.75),
        isVentralChest: isVentral,
        flutterPhase: r * 0.3 + j * 0.2,
        flutterAmp: isVentral ? 0.008 : 0.022,
      });
    }
  }

  // ------------------------------------------------------------------------
  // 2. S-CURVED NECK, RAPTOR HEAD, CURVED BEAK & 9-PLUME ROYAL CREST
  // ------------------------------------------------------------------------
  const neckPivot = new THREE.Group();
  neckPivot.name = "Cervical_Neck";
  neckPivot.position.set(0, 0.42, 0.62);
  bodyPivot.add(neckPivot);

  // Layered Neck Hackle Feathers (Sleek S-curve throat & nape scales)
  const neckRings = Math.round(11 * densityMult);
  for (let n = 0; n < neckRings; n++) {
    const nt = n / Math.max(1, neckRings - 1);
    const ny = nt * 0.5;
    const nz = Math.sin(nt * Math.PI) * 0.1 + nt * 0.15;
    const nRad = 0.18 * (1.0 - nt * 0.28);
    const count = Math.max(7, Math.round(12 * densityMult));

    for (let k = 0; k < count; k++) {
      const ang = (k / count) * Math.PI * 2 + (n % 2) * 0.25;
      const cosA = Math.cos(ang);
      const sinA = Math.sin(ang);
      const isThroat = sinA > 0; // Front throat side (+Z)

      // Throat feathers point strictly downward/backward Flush against neck; never sticking out forward
      const px = cosA * nRad * 0.88;
      const py = ny;
      const pz = nz + sinA * nRad * (isThroat ? 0.72 : 1.0);

      const tipDir = new THREE.Vector3(
        cosA * 0.12,
        -0.88,
        isThroat ? -0.45 : -0.52,
      ).normalize();
      const outNorm = new THREE.Vector3(cosA, 0.15, sinA).normalize();
      const xAx = new THREE.Vector3().crossVectors(tipDir, outNorm).normalize();
      const zAx = new THREE.Vector3().crossVectors(xAx, tipDir).normalize();
      const rMat = new THREE.Matrix4().makeBasis(xAx, tipDir, zAx);
      dummyObj.rotation.setFromRotationMatrix(rMat);

      addSculptedFeather(neckPivot, {
        pos: new THREE.Vector3(px, py, pz),
        rot: dummyObj.rotation.clone(),
        featherScale: new THREE.Vector3(
          0.55,
          (isThroat ? 0.19 : 0.25) + (1.0 - nt) * 0.08,
          0.65,
        ),
        isVentralChest: isThroat,
        flutterPhase: n * 0.4 + k,
        flutterAmp: 0.012,
      });
    }
  }

  // Head Cranium Group
  const headPivot = new THREE.Group();
  headPivot.name = "Phoenix_Head_Crown";
  headPivot.position.set(0, 0.54, 0.2);
  neckPivot.add(headPivot);

  const skullGeo = new THREE.SphereGeometry(0.22, 20, 18);
  skullGeo.scale(0.88, 0.85, 1.32);
  const skullMesh = new THREE.Mesh(skullGeo, materials[0]);
  skullMesh.position.set(0, 0.06, 0.08);
  headPivot.add(skullMesh);

  // Sculpted Curved Raptor Upper & Lower Beak
  const upperBeakCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.08, 0.25),
    new THREE.Vector3(0, 0.09, 0.44),
    new THREE.Vector3(0, 0.04, 0.58),
    new THREE.Vector3(0, -0.04, 0.64),
  ]);
  const upperBeakGeo = new THREE.TubeGeometry(
    upperBeakCurve,
    16,
    0.065,
    12,
    false,
  );
  // Taper the beak to a razor-sharp tip
  const bPos = upperBeakGeo.attributes.position;
  for (let i = 0; i < bPos.count; i++) {
    const z = bPos.getZ(i);
    const taper = Math.max(0.04, 1.0 - Math.max(0, (z - 0.25) / 0.4));
    bPos.setX(i, bPos.getX(i) * taper);
    bPos.setY(i, (bPos.getY(i) - 0.05) * taper + 0.05);
  }
  upperBeakGeo.computeVertexNormals();
  const upperBeakMesh = new THREE.Mesh(upperBeakGeo, beakHornMat);
  headPivot.add(upperBeakMesh);

  const lowerBeakGeo = new THREE.ConeGeometry(0.048, 0.26, 12);
  lowerBeakGeo.rotateX(Math.PI * 0.44);
  const lowerBeakMesh = new THREE.Mesh(lowerBeakGeo, beakHornMat);
  lowerBeakMesh.position.set(0, 0.0, 0.38);
  headPivot.add(lowerBeakMesh);

  // Glowing Recessed Eyes + Brow Ridge Feathers
  for (const side of [-1, 1]) {
    const eyeSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 14, 14),
      eyeGlowMat,
    );
    eyeSphere.position.set(side * 0.155, 0.1, 0.19);
    eyeSphere.scale.set(0.7, 0.9, 1.25);
    headPivot.add(eyeSphere);

    // Fierce Supraorbital Brow Plumes
    for (let b = 0; b < 4; b++) {
      addSculptedFeather(headPivot, {
        pos: new THREE.Vector3(
          side * (0.14 + b * 0.02),
          0.15 + b * 0.015,
          0.22 - b * 0.07,
        ),
        rot: new THREE.Euler(-1.15 - b * 0.1, side * 0.35, -side * 0.4),
        featherScale: new THREE.Vector3(0.45, 0.28 + b * 0.08, 0.6),
        material: crestShaderMat,
      });
    }
  }

  // Ornate 9-Plume Royal Sweeping Crown Crest
  const crownSpecs = [
    { x: 0.0, y: 0.2, z: 0.05, rx: -0.95, ry: 0.0, len: 1.35, w: 0.95 },
    { x: 0.06, y: 0.19, z: 0.0, rx: -1.08, ry: 0.16, len: 1.22, w: 0.85 },
    { x: -0.06, y: 0.19, z: 0.0, rx: -1.08, ry: -0.16, len: 1.22, w: 0.85 },
    { x: 0.11, y: 0.16, z: -0.06, rx: -1.22, ry: 0.3, len: 1.05, w: 0.78 },
    { x: -0.11, y: 0.16, z: -0.06, rx: -1.22, ry: -0.3, len: 1.05, w: 0.78 },
    { x: 0.15, y: 0.12, z: -0.11, rx: -1.35, ry: 0.44, len: 0.88, w: 0.7 },
    { x: -0.15, y: 0.12, z: -0.11, rx: -1.35, ry: -0.44, len: 0.88, w: 0.7 },
    { x: 0.0, y: 0.15, z: -0.12, rx: -1.42, ry: 0.0, len: 1.5, w: 0.9 },
    { x: 0.0, y: 0.11, z: -0.18, rx: -1.55, ry: 0.0, len: 1.15, w: 0.8 },
  ];
  crownSpecs.forEach((c, idx) => {
    addSculptedFeather(headPivot, {
      pos: new THREE.Vector3(c.x, c.y, c.z),
      rot: new THREE.Euler(c.rx, c.ry, 0),
      featherScale: new THREE.Vector3(c.w, c.len, 1.1),
      material: crestShaderMat,
      flutterPhase: idx * 0.5,
      flutterAmp: 0.08,
    });
  });

  // ------------------------------------------------------------------------
  // 3. TUCKED AVIAN LEGS & METALLIC RAPTOR TALONS
  // ------------------------------------------------------------------------
  for (const side of [-1, 1]) {
    const legGroup = new THREE.Group();
    legGroup.position.set(side * 0.28, -0.26, -0.18);
    bodyPivot.add(legGroup);

    // Feathered thigh plumage
    for (let f = 0; f < 6; f++) {
      const ang = (f / 6) * Math.PI * 2;
      addSculptedFeather(legGroup, {
        pos: new THREE.Vector3(
          Math.cos(ang) * 0.09,
          -0.08,
          Math.sin(ang) * 0.09,
        ),
        rot: new THREE.Euler(-1.9, side * 0.2, ang),
        featherScale: new THREE.Vector3(0.55, 0.32, 0.6),
      });
    }

    // Three tucked front talons
    for (let t = -1; t <= 1; t++) {
      const clawGeo = new THREE.ConeGeometry(0.024, 0.18, 8);
      clawGeo.rotateX(Math.PI * 0.65);
      const claw = new THREE.Mesh(clawGeo, beakHornMat);
      claw.position.set(t * 0.045, -0.28, -0.06);
      claw.rotation.y = -t * 0.25;
      legGroup.add(claw);
    }
  }

  // ------------------------------------------------------------------------
  // 4. MULTI-JOINTED 4-TIER ANATOMICAL WINGS (HUMERUS -> ULNA -> MANUS)
  // ------------------------------------------------------------------------
  function featherRotation(sweep: number) {
    const direction = new THREE.Vector3(sweep, 0.03, -1).normalize();
    const x = new THREE.Vector3()
      .crossVectors(direction, new THREE.Vector3(0, 1, 0))
      .normalize();
    const z = new THREE.Vector3().crossVectors(x, direction).normalize();
    return new THREE.Euler().setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(x, direction, z),
    );
  }
  function createArticulatedWing(side: number) {
    const shoulder = new THREE.Group();
    shoulder.name = side > 0 ? "Left_Wing_Shoulder" : "Right_Wing_Shoulder";
    shoulder.position.set(side * 0.34, 0.42, 0.28);
    bodyPivot.add(shoulder);

    const elbow = new THREE.Group();
    elbow.name = side > 0 ? "Left_Wing_Elbow" : "Right_Wing_Elbow";
    elbow.position.set(side * 1.18, 0.12, -0.12);
    shoulder.add(elbow);

    const wrist = new THREE.Group();
    wrist.name = side > 0 ? "Left_Wing_Wrist" : "Right_Wing_Wrist";
    wrist.position.set(side * 1.38, 0.05, -0.18);
    elbow.add(wrist);

    // Leading Edge Wing Bone (Propatagium ridge)
    const boneCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0.08),
      new THREE.Vector3(side * 0.6, 0.08, 0.12),
      new THREE.Vector3(side * 1.18, 0.12, -0.04),
    ]);
    const boneGeo = new THREE.TubeGeometry(boneCurve, 12, 0.055, 8, false);
    shoulder.add(new THREE.Mesh(boneGeo, materials[0]));

    // --- TIER 1 & 2: INNER ARM (HUMERUS) COVERTS & SCAPULARS ---
    const innerCols = Math.round(14 * densityMult);
    for (let i = 0; i < innerCols; i++) {
      const u = i / Math.max(1, innerCols - 1);
      const x = side * (0.08 + u * 1.12);
      const y = Math.sin(u * Math.PI) * 0.12 + u * 0.1;
      const z = -u * 0.1;

      // Row A: Lesser Coverts (Dense small overlapping shoulder scales - Dorsal & Ventral)
      for (let sub = 0; sub < 2; sub++) {
        addSculptedFeather(shoulder, {
          pos: new THREE.Vector3(
            x,
            y + 0.06 - sub * 0.04,
            z + 0.06 - sub * 0.1,
          ),
          rot: featherRotation(side * (0.04 + u * 0.12)),
          featherScale: new THREE.Vector3(0.85, 0.42 + sub * 0.18, 0.9),
          flutterPhase: i * 0.25 + sub,
        });
      }

      // Row B: Median Coverts
      addSculptedFeather(shoulder, {
        pos: new THREE.Vector3(x, y - 0.01, z - 0.14),
        rot: featherRotation(side * (0.08 + u * 0.18)),
        featherScale: new THREE.Vector3(
          1.05,
          0.78 + Math.sin(u * Math.PI) * 0.25,
          1.0,
        ),
        flutterPhase: i * 0.3,
      });

      // Row C: Tertiary / Inner Secondaries
      addSculptedFeather(shoulder, {
        pos: new THREE.Vector3(x, y - 0.06, z - 0.28),
        rot: featherRotation(side * (0.12 + u * 0.24)),
        featherScale: new THREE.Vector3(1.18, 1.28 + u * 0.38, 1.1),
        flutterPhase: i * 0.35,
        flutterAmp: 0.05,
      });
    }

    // --- TIER 3: MID FOREARM (ULNA/RADIUS) GREATER COVERTS & SECONDARIES ---
    const midCols = Math.round(16 * densityMult);
    for (let i = 0; i < midCols; i++) {
      const u = i / Math.max(1, midCols - 1);
      const x = side * (u * 1.38);
      const y = Math.sin(u * Math.PI) * 0.08 + u * 0.04;
      const z = -u * 0.16;

      // Lesser & Median Forearm Coverts
      addSculptedFeather(elbow, {
        pos: new THREE.Vector3(x, y + 0.05, z + 0.04),
        rot: featherRotation(side * (0.18 + u * 0.28)),
        featherScale: new THREE.Vector3(0.9, 0.52 + u * 0.15, 0.9),
        flutterPhase: i * 0.25,
      });

      // Greater Secondary Coverts
      addSculptedFeather(elbow, {
        pos: new THREE.Vector3(x, y, z - 0.12),
        rot: featherRotation(side * (0.2 + u * 0.34)),
        featherScale: new THREE.Vector3(
          1.12,
          0.98 + Math.sin(u * Math.PI) * 0.32,
          1.05,
        ),
        flutterPhase: i * 0.32,
      });

      // Long Sculpted Secondaries (Main lifting airfoil blades)
      addSculptedFeather(elbow, {
        pos: new THREE.Vector3(x, y - 0.05, z - 0.28),
        rot: featherRotation(side * (0.22 + u * 0.42)),
        featherScale: new THREE.Vector3(
          1.26,
          1.68 + Math.sin(u * Math.PI) * 0.48,
          1.15,
        ),
        material: i % 4 === 0 ? crestShaderMat : phoenixShaderMat,
        flutterPhase: i * 0.38,
        flutterAmp: 0.065,
      });
    }

    // --- TIER 4: OUTER HAND (MANUS) ALULA & FANNING PRIMARY REMIGES ---
    // Alula (Bastard wing thumb feathers for high-detail anatomical realism)
    for (let a = 0; a < 4; a++) {
      addSculptedFeather(wrist, {
        pos: new THREE.Vector3(side * (0.08 + a * 0.09), 0.06, 0.06 - a * 0.04),
        rot: featherRotation(side * (0.35 + a * 0.12)),
        featherScale: new THREE.Vector3(0.75, 0.55 + a * 0.12, 0.9),
        material: crestShaderMat,
      });
    }

    // Primary Coverts & 16 Sweeping Primary Flight Blades (Fanned out like an eagle/phoenix)
    const numPrimaries = Math.round(16 * densityMult);
    for (let i = 0; i < numPrimaries; i++) {
      const u = i / Math.max(1, numPrimaries - 1);
      const x = side * (u * 1.05);
      const y = -u * 0.08;
      const z = -Math.pow(u, 1.35) * 0.52;

      // Primary Covert
      addSculptedFeather(wrist, {
        pos: new THREE.Vector3(x * 0.85, y + 0.03, z * 0.75 - 0.05),
        rot: featherRotation(side * (0.35 + u * 0.55)),
        featherScale: new THREE.Vector3(0.95, 0.88 + (1.0 - u) * 0.25, 1.0),
        flutterPhase: i * 0.3,
      });

      // Long Aerodynamic Primary Blade (Fans outward from trailing edge to wingtip)

      const primaryLength =
        2.05 + Math.sin(u * Math.PI * 0.88) * 0.82 - u * 0.25;
      addSculptedFeather(wrist, {
        pos: new THREE.Vector3(x, y - 0.02, z - 0.14),
        rot: featherRotation(side * (0.35 + u * 1.0)),
        featherScale: new THREE.Vector3(1.18 - u * 0.28, primaryLength, 1.25),
        material: i >= numPrimaries - 5 ? crestShaderMat : phoenixShaderMat,
        flutterPhase: i * 0.45,
        flutterAmp: 0.085,
      });
    }

    return { shoulder, elbow, wrist };
  }

  const leftWing = createArticulatedWing(1);

  const rightWing = createArticulatedWing(-1);

  // ------------------------------------------------------------------------
  // 5. Nine flowing tail ribbons and layered tail coverts
  // ------------------------------------------------------------------------
  const tailRootGroup = new THREE.Group();
  tailRootGroup.name = "Phoenix_Nine_Tail_Plumes";
  tailRootGroup.position.set(0, -0.1, -0.82);
  bodyPivot.add(tailRootGroup);

  // Layered upper/lower tail coverts (45 feathers at high quality)
  const covertLayers = 3;
  for (let layer = 0; layer < covertLayers; layer++) {
    const count = Math.round((11 + layer * 4) * densityMult);
    for (let c = 0; c < count; c++) {
      const ratio = c / Math.max(1, count - 1) - 0.5; // -0.5 to 0.5
      const spreadAngle = ratio * 1.35;
      addSculptedFeather(tailRootGroup, {
        pos: new THREE.Vector3(
          Math.sin(spreadAngle) * (0.22 + layer * 0.12),
          -layer * 0.05,
          -layer * 0.18,
        ),
        rot: new THREE.Euler(
          -Math.PI * 0.54 - layer * 0.05,
          -spreadAngle * 0.85,
          0,
        ),
        featherScale: new THREE.Vector3(1.15, 0.85 + layer * 0.48, 1.0),
        material: layer === 2 ? crestShaderMat : phoenixShaderMat,
        flutterPhase: c * 0.3 + layer,
      });
    }
  }

  const tails: THREE.Mesh[] = [];
  for (let r = 0; r < 9; r++) {
    const spread = (r - 4) / 4;
    const geometry = makeBladeGeometry(low, {
      length: 4.6 - Math.abs(spread) * 1.15,
      spread,
    });
    const count = geometry.getAttribute("position").count;
    geometry.setAttribute(
      "aPhase",
      new THREE.Float32BufferAttribute(
        new Float32Array(count).fill(r * 0.45),
        1,
      ),
    );
    const ribbon = new THREE.Mesh(geometry, materials[3 + (r % 2)]);
    ribbon.name = `tail-ribbon-${r}`;
    // The GPU wave extends beyond the undeformed bounds.
    ribbon.frustumCulled = false;
    tails.push(ribbon);
    tailRootGroup.add(ribbon);
  }
  const instanceMeshes: THREE.InstancedMesh[] = [];
  for (const [parent, byMaterial] of batches)
    for (const [material, feathers] of byMaterial) {
      const geometry = featherGeo.clone();
      const phase: number[] = [],
        amplitude: number[] = [],
        scatter: number[] = [];
      const instances = new THREE.InstancedMesh(
        geometry,
        material,
        feathers.length,
      );
      instances.name = `${parent.name || "plumage"}-feathers`;
      instances.frustumCulled = false;
      const dummy = new THREE.Object3D();
      feathers.forEach((f, i) => {
        dummy.position.copy(f.pos);
        dummy.rotation.copy(f.rot);
        dummy.scale.copy(f.featherScale);
        dummy.updateMatrix();
        instances.setMatrixAt(i, dummy.matrix);
        phase.push(f.flutterPhase ?? i * 2.399963);
        amplitude.push(f.flutterAmp ?? 0.025);
        // Local displacement becomes a parent-space outward offset after instanceMatrix.
        const direction = f.pos.clone().normalize();
        if (direction.lengthSq() < 0.001) direction.set(0, 1, 0);
        direction
          .multiplyScalar(0.8)
          .applyMatrix3(
            new THREE.Matrix3().setFromMatrix4(dummy.matrix).invert(),
          );
        scatter.push(direction.x, direction.y, direction.z);
      });
      geometry.setAttribute(
        "aPhase",
        new THREE.InstancedBufferAttribute(new Float32Array(phase), 1),
      );
      geometry.setAttribute(
        "aAmplitude",
        new THREE.InstancedBufferAttribute(new Float32Array(amplitude), 1),
      );
      geometry.setAttribute(
        "aScatter",
        new THREE.InstancedBufferAttribute(new Float32Array(scatter), 3),
      );
      instances.instanceMatrix.needsUpdate = true;
      parent.add(instances);
      instanceMeshes.push(instances);
    }
  featherGeo.dispose();
  const neckCore = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0.25, 0.15),
        new THREE.Vector3(0, 0.54, 0.2),
      ]),
      low ? 12 : 20,
      0.115,
      low ? 8 : 12,
      false,
    ),
    materials[0],
  );
  neckPivot.add(neckCore);
  const metrics = {
    feathers: featherCount,
    batches: instanceMeshes.length,
    tailRibbons: tails.length,
  };
  function update(
    pose: Pose,
    time: number,
    isStatic: boolean,
    pointer: { x: number; y: number },
  ) {
    const motion = sampleFlight(pose, time, isStatic, pointer);
    for (const [wing, side] of [
      [leftWing, 1],
      [rightWing, -1],
    ] as const) {
      wing.shoulder.rotation.set(motion.shoulderX, 0, side * motion.shoulderZ);
      wing.elbow.rotation.set(0, side * motion.elbowY, side * motion.elbowZ);
      wing.wrist.rotation.set(motion.wristX, 0, side * motion.wristZ);
    }
    bodyPivot.position.y = motion.bodyY;
    bodyPivot.rotation.x = motion.bodyPitch;
    neckPivot.rotation.set(motion.neckPitch, motion.neckYaw, 0);
    headPivot.rotation.set(motion.headPitch, motion.headYaw, 0);
    tailRootGroup.rotation.y = motion.tailYaw;
    tailRootGroup.rotation.x = pose.tail;
  }
  return { bird, update, metrics };
}
