import type { Pose } from "../story";

/** Pure joint sampling: scroll owns the pose; time adds a small, optional flight cycle.
 * The elbow and wrist lag the shoulder. A static sample never depends on time or pointer.
 */
export function sampleFlight(
  pose: Pose,
  time: number,
  isStatic: boolean,
  pointer = { x: 0, y: 0 },
) {
  const phase = isStatic ? 0 : time * 1.75;
  const life = isStatic ? 0 : 1;
  const amplitude = pose.flap * life;
  const cursor = isStatic ? { x: 0, y: 0 } : pointer;
  return {
    shoulderZ: 0.26 + pose.wing * 0.4 + Math.sin(phase) * amplitude,
    shoulderX: -0.04 + Math.cos(phase) * amplitude * 0.23,
    elbowZ: -pose.wing * 0.3 + Math.sin(phase - 0.55) * amplitude * 0.72,
    elbowY: pose.wing * 0.65 + Math.cos(phase - 0.4) * amplitude * 0.25,
    wristZ: -pose.wing * 0.22 + Math.sin(phase - 1.05) * amplitude * 0.78,
    wristX: Math.cos(phase - 0.85) * amplitude * 0.3,
    bodyY: -Math.sin(phase) * amplitude * 0.22,
    bodyPitch: Math.cos(phase) * amplitude * 0.1,
    neckYaw: cursor.x * 0.1,
    neckPitch: Math.sin(phase - 0.3) * amplitude * 0.13,
    headYaw: cursor.x * 0.15,
    headPitch: -cursor.y * 0.1 - Math.sin(phase) * amplitude * 0.1,
    tailYaw: Math.sin(phase - 1.3) * amplitude * 0.12,
  };
}
