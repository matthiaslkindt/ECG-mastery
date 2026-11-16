/**
 * Lead geometry for the dipole model.
 *
 * Coordinate system (patient-centred):
 *   +x = patient's left, +y = inferior (towards the feet), +z = anterior (towards the sternum).
 *
 * Limb leads lie in the frontal (x–y) plane at their hexaxial angles. Precordial leads are
 * modelled as unit vectors in the horizontal (x–z) plane with a small inferior tilt and a
 * proximity gain, which reproduces the familiar precordial R-wave progression when the
 * ventricular depolarisation vector points left, inferior and slightly posterior.
 */
import { LEAD_NAMES, type LeadName } from "../types";

export type Vec3 = readonly [number, number, number];

const deg = (d: number) => (d * Math.PI) / 180;

function frontal(angleDeg: number): Vec3 {
  return [Math.cos(deg(angleDeg)), Math.sin(deg(angleDeg)), 0];
}

function precordial(horizontalAngleDeg: number, gain: number, inferiorTilt = 0.12): Vec3 {
  const a = deg(horizontalAngleDeg);
  return [Math.cos(a) * gain, inferiorTilt * gain, Math.sin(a) * gain];
}

export const LEAD_VECTORS: Record<LeadName, Vec3> = {
  I: frontal(0),
  II: frontal(60),
  III: frontal(120),
  aVR: frontal(-150),
  aVL: frontal(-30),
  aVF: frontal(90),
  V1: precordial(118, 1.5, 0.05),
  V2: precordial(98, 1.7, 0.08),
  V3: precordial(72, 1.7, 0.12),
  V4: precordial(48, 1.7, 0.15),
  V5: precordial(26, 1.6, 0.15),
  V6: precordial(6, 1.45, 0.12),
};

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function scale(a: Vec3, k: number): Vec3 {
  return [a[0] * k, a[1] * k, a[2] * k];
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/** A vector in the frontal plane at `angleDeg` with magnitude `m`, plus a z component. */
export function frontalVec(angleDeg: number, m: number, z = 0): Vec3 {
  return [m * Math.cos(deg(angleDeg)), m * Math.sin(deg(angleDeg)), z];
}

export function projectAll(v: Vec3): Record<LeadName, number> {
  const out = {} as Record<LeadName, number>;
  for (const l of LEAD_NAMES) out[l] = dot(LEAD_VECTORS[l], v);
  return out;
}
