/**
 * ECG synthesis: a physiologically-motivated cardiac dipole model.
 *
 * Each cardiac event (P, QRS components, ST injury current, T, U, pacing spike) is modelled
 * as a time-localised waveform whose amplitude is a 3-D vector (the instantaneous cardiac
 * dipole). The 12 leads are obtained by projecting the summed dipole onto the lead vectors
 * in `leads.ts`. Because pathology is expressed as changes to vectors and timings — a wider,
 * leftward-posterior QRS for LBBB, an injury vector pointing inferiorly for inferior STEMI —
 * the resulting tracings behave coherently across leads (reciprocal changes, R-wave
 * progression, axis) the way real ECGs do, rather than being painted lead by lead.
 *
 * This is a teaching synthesizer: it aims for recognisable, internally consistent patterns,
 * not for the full biophysics of the myocardium.
 */
import { LEAD_NAMES, type EcgRecord, type LeadName } from "../types";
import { LEAD_VECTORS, add, dot, frontalVec, scale, type Vec3 } from "./leads";
import { createRng, type Rng } from "./random";

/* ------------------------------------------------------------------ */
/* Waveform primitives                                                 */
/* ------------------------------------------------------------------ */

export interface Wave {
  /** Centre time (s) relative to the event reference (QRS onset or P onset). */
  t: number;
  /** Width (s) on the left/right of the centre — asymmetric Gaussians give realistic T waves. */
  sigmaL: number;
  sigmaR: number;
  /** Dipole amplitude in mV along x (left), y (inferior), z (anterior). */
  amp: Vec3;
  /** 'gauss' = bell; 'plateau' = flat-topped (used for ST injury currents); 'spike' = pacing artefact. */
  shape?: "gauss" | "plateau" | "spike";
}

function waveValue(w: Wave, dt: number): number {
  const s = dt < 0 ? w.sigmaL : w.sigmaR;
  const u = dt / s;
  switch (w.shape) {
    case "plateau":
      return Math.exp(-Math.pow(u, 4) / 2);
    case "spike":
      return Math.abs(u) < 1 ? 1 - Math.abs(u) : 0;
    default:
      return Math.exp(-(u * u) / 2);
  }
}

/* ------------------------------------------------------------------ */
/* Morphology parameters                                               */
/* ------------------------------------------------------------------ */

export type BundleBranchBlock = "none" | "rbbb" | "irbbb" | "lbbb";
export type Territory = "inferior" | "anterior" | "anteroseptal" | "lateral" | "posterior" | "diffuse";

export interface VentricularParams {
  /** Mean frontal QRS axis in degrees (normal −30 … +90). */
  axisDeg: number;
  /** Overall QRS voltage multiplier. */
  voltage: number;
  /** Width multiplier for the QRS (1 = ~90 ms). */
  qrsWidth: number;
  bbb: BundleBranchBlock;
  /** Left ventricular hypertrophy with strain pattern. */
  lvh: boolean;
  rvh: boolean;
  /** Corrected QT (s). */
  qtc: number;
  /** T-wave amplitude multiplier (negative values invert). */
  tAmp: number;
  /** Peaked, narrow T waves (hyperkalaemia). */
  peakedT: boolean;
  /** Acute ST-segment injury current. */
  stElevation?: { territory: Territory; mV: number; hyperacuteT?: boolean };
  /** Subendocardial-type ST depression (vector opposite to the QRS). */
  stDepressionMv?: number;
  /** Pathological Q waves (loss of forces) in a territory. */
  qWaves?: Territory;
  /** T-wave inversion in a territory (Wellens / ischaemia). */
  tInversion?: Territory;
  /** Ventricular pre-excitation delta wave; direction depends on pathway. */
  delta?: { pathway: "left-lateral" | "right-sided" | "posteroseptal"; mV: number };
  /** Coved ST elevation V1–V2 with negative T (Brugada type 1). */
  brugada: boolean;
  /** Add a U wave. */
  uWave: number;
  /** Left anterior fascicular block (qR in aVL, rS inferior, axis ≤ −45°). */
  lafb: boolean;
  /** Ventricular paced morphology (LBBB-like with spike). */
  paced: boolean;
}

export const NORMAL_VENTRICULAR: VentricularParams = {
  axisDeg: 55,
  voltage: 1,
  qrsWidth: 1,
  bbb: "none",
  lvh: false,
  rvh: false,
  qtc: 0.4,
  tAmp: 1,
  peakedT: false,
  brugada: false,
  uWave: 0,
  lafb: false,
  paced: false,
};

export interface AtrialParams {
  /** P-wave amplitude multiplier. */
  pAmp: number;
  /** Left atrial enlargement: broad, notched P with deep terminal negativity in V1. */
  lae: boolean;
  /** Right atrial enlargement: tall peaked P in II. */
  rae: boolean;
  /** Retrograde (inferior-to-superior) P-wave vector. */
  retrograde: boolean;
}

export const NORMAL_ATRIAL: AtrialParams = { pAmp: 1, lae: false, rae: false, retrograde: false };

/* ------------------------------------------------------------------ */
/* Territory vectors (direction of injury / loss of forces)            */
/* ------------------------------------------------------------------ */

const TERRITORY_VEC: Record<Territory, Vec3> = {
  inferior: [0.05, 1, 0.1],
  anterior: [0.1, -0.05, 1],
  anteroseptal: [-0.25, -0.05, 0.95],
  lateral: [1, -0.1, 0.05],
  posterior: [0.3, 0.1, -1],
  diffuse: [0.65, 0.6, 0.45],
};

function unit(v: Vec3): Vec3 {
  const m = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / m, v[1] / m, v[2] / m];
}

/* ------------------------------------------------------------------ */
/* Build event morphologies                                            */
/* ------------------------------------------------------------------ */

export interface VentricularMorphology {
  waves: Wave[]; // relative to QRS onset (t = 0)
  qrsDuration: number;
  qt: number;
}

/**
 * Build the QRS-T complex for one beat. `rr` is the preceding RR interval (s) used for
 * rate-correcting the QT interval with Bazett's formula.
 */
export function buildVentricular(p: VentricularParams, rr: number): VentricularMorphology {
  const waves: Wave[] = [];
  const w = p.qrsWidth;
  const V = p.voltage;
  let axis = p.axisDeg;
  if (p.lafb) axis = Math.min(axis, -50);

  // --- Septal q: brief, rightward & anterior.
  const septalAmp = p.bbb === "lbbb" || p.paced ? 0 : 0.22 * V;
  if (septalAmp > 0) {
    waves.push({ t: 0.012 * w, sigmaL: 0.006 * w, sigmaR: 0.006 * w, amp: [-0.6 * septalAmp, -0.15 * septalAmp, 0.8 * septalAmp] });
  }

  // --- Main R: left, inferior (along the axis), slightly posterior.
  let rMag = 1.55 * V;
  if (p.lvh) rMag *= 1.75;
  if (p.rvh) rMag *= 0.85;
  const posterior = p.rvh ? 0.25 : -0.55 * (p.lvh ? 1.3 : 1);
  const rVec = frontalVec(axis, rMag, posterior * V);
  waves.push({ t: 0.04 * w, sigmaL: 0.011 * w, sigmaR: 0.011 * w, amp: rVec });

  // --- Terminal S: right, superior, posterior.
  let sVec: Vec3 = [-0.35 * V, -0.22 * V, -0.28 * V];
  if (p.rvh) sVec = [-0.6 * V, -0.1 * V, 0.35 * V]; // tall R in V1, deep S in V6
  waves.push({ t: 0.068 * w, sigmaL: 0.009 * w, sigmaR: 0.012 * w, amp: sVec });

  let qrsDuration = 0.09 * w;

  // --- Bundle branch blocks.
  if (p.bbb === "rbbb" || p.bbb === "irbbb") {
    const k = p.bbb === "rbbb" ? 1 : 0.45;
    // Late, slow, rightward-anterior terminal force: R' in V1, broad S in I/V6.
    waves.push({ t: (0.085 + 0.02 * k) * w, sigmaL: 0.012 * w, sigmaR: 0.02 * w * k + 0.008, amp: [-0.7 * k * V, -0.15 * k * V, 0.75 * k * V] });
    qrsDuration = p.bbb === "rbbb" ? 0.14 * w : 0.105 * w;
  }
  if (p.bbb === "lbbb" || p.paced) {
    // Broad, notched leftward-posterior activation; no septal q.
    waves.length = 0;
    const axisL = p.paced ? -45 : Math.min(axis, 20);
    waves.push({ t: 0.03 * w, sigmaL: 0.014 * w, sigmaR: 0.02 * w, amp: frontalVec(axisL, 1.2 * V, -0.95 * V) });
    waves.push({ t: 0.085 * w, sigmaL: 0.022 * w, sigmaR: 0.03 * w, amp: frontalVec(axisL + 5, 1.1 * V, -1.1 * V) });
    waves.push({ t: 0.125 * w, sigmaL: 0.012 * w, sigmaR: 0.012 * w, amp: [-0.15 * V, -0.1 * V, 0.05 * V] });
    qrsDuration = 0.155 * w;
  }

  // --- LAFB: small q in I/aVL, rS inferior is implied by the −50° axis; add a late superior force.
  if (p.lafb) {
    waves.push({ t: 0.06 * w, sigmaL: 0.01 * w, sigmaR: 0.014 * w, amp: [-0.1 * V, -0.45 * V, -0.1 * V] });
  }

  // --- Pre-excitation delta wave: slow initial force before the main QRS.
  if (p.delta) {
    const dir: Vec3 =
      p.delta.pathway === "left-lateral" ? [-0.3, 0.4, 0.85] // positive V1, negative I/aVL (type A)
      : p.delta.pathway === "right-sided" ? [0.85, 0.4, -0.3] // negative V1, positive I (type B)
      : [0.6, -0.75, 0.3]; // posteroseptal: negative inferior leads (pseudo-infarct)
    waves.push({ t: -0.018, sigmaL: 0.02, sigmaR: 0.024, amp: scale(unit(dir), p.delta.mV) });
    qrsDuration += 0.03;
  }

  // --- Pathological Q waves: loss of forces in a territory = initial negative vector.
  if (p.qWaves) {
    const dir = unit(TERRITORY_VEC[p.qWaves]);
    waves.push({ t: 0.016 * w, sigmaL: 0.009 * w, sigmaR: 0.012 * w, amp: scale(dir, -0.55 * V) });
    // Loss of R forces in that direction.
    waves.push({ t: 0.04 * w, sigmaL: 0.011 * w, sigmaR: 0.011 * w, amp: scale(dir, -0.35 * V) });
  }

  // --- Repolarisation.
  const qt = Math.max(0.26, Math.min(0.7, p.qtc * Math.sqrt(Math.max(rr, 0.3))));
  const tCentre = qt * 0.78;
  let tVec: Vec3 = add(frontalVec(Math.max(axis - 15, 0), 0.42, 0), [0, 0, 0.12]);
  tVec = scale(tVec, p.tAmp);

  // Secondary repolarisation changes: strain / discordance.
  if (p.lvh) tVec = add(scale(tVec, 0.3), [-0.3, -0.15, 0.25]);
  if (p.rvh) tVec = add(scale(tVec, 0.4), [0.2, 0.1, -0.45]);
  if (p.bbb === "lbbb" || p.paced) tVec = [-0.35, -0.2, 0.55]; // discordant: negative lateral, positive V1–V3
  if (p.bbb === "rbbb") tVec = add(scale(tVec, 0.7), [0.25, 0.05, -0.35]); // inverted V1–V2

  if (p.tInversion) {
    const dir = unit(TERRITORY_VEC[p.tInversion]);
    tVec = add(scale(tVec, 0.35), scale(dir, -0.45));
  }

  let tSigmaL = 0.07;
  let tSigmaR = 0.045;
  if (p.peakedT) {
    tVec = scale(unit(add(tVec, [0, 0, 0.3])), 0.95);
    tSigmaL = 0.032;
    tSigmaR = 0.03;
  }

  // Acute injury: ST elevation (plateau) in the direction of the injured wall, plus hyperacute T.
  if (p.stElevation) {
    const dir = unit(TERRITORY_VEC[p.stElevation.territory]);
    const m = p.stElevation.mV;
    const stStart = qrsDuration - 0.01;
    const centre = (stStart + tCentre) / 2;
    waves.push({ t: centre, sigmaL: (centre - stStart) * 1.15, sigmaR: (tCentre - centre) * 1.1, amp: scale(dir, m), shape: "plateau" });
    if (p.stElevation.hyperacuteT) tVec = add(tVec, scale(dir, m * 1.4));
    else tVec = add(scale(tVec, 0.6), scale(dir, m * 0.5));
  }
  if (p.stDepressionMv) {
    const dir = unit(rVec);
    const stStart = qrsDuration - 0.01;
    const centre = (stStart + tCentre) / 2;
    waves.push({ t: centre, sigmaL: (centre - stStart) * 1.1, sigmaR: (tCentre - centre) * 0.9, amp: scale(dir, -p.stDepressionMv), shape: "plateau" });
  }
  if (p.brugada) {
    const dir: Vec3 = unit([-0.45, -0.25, 0.85]);
    waves.push({ t: qrsDuration + 0.03, sigmaL: 0.045, sigmaR: 0.07, amp: scale(dir, 0.32), shape: "plateau" });
    tVec = add(scale(tVec, 0.6), scale(dir, -0.3));
  }

  waves.push({ t: tCentre, sigmaL: tSigmaL, sigmaR: tSigmaR, amp: tVec });

  if (p.uWave > 0) {
    waves.push({ t: tCentre + 0.19, sigmaL: 0.05, sigmaR: 0.05, amp: scale(unit(tVec), p.uWave) });
  }

  if (p.paced) {
    waves.push({ t: -0.004, sigmaL: 0.002, sigmaR: 0.002, amp: [1.6, 0.9, -1.2], shape: "spike" });
  }

  return { waves, qrsDuration, qt };
}

export interface AtrialMorphology {
  waves: Wave[]; // relative to P onset
  pDuration: number;
}

export function buildAtrial(p: AtrialParams): AtrialMorphology {
  const waves: Wave[] = [];
  const a = p.pAmp;
  if (p.retrograde) {
    waves.push({ t: 0.045, sigmaL: 0.02, sigmaR: 0.02, amp: [0.05 * a, -0.14 * a, 0.02 * a] });
    return { waves, pDuration: 0.09 };
  }
  // Right atrium first (anterior-inferior), then left atrium (left-posterior).
  const raMag = (p.rae ? 0.26 : 0.11) * a;
  waves.push({ t: 0.03, sigmaL: 0.016, sigmaR: 0.016, amp: [0.45 * raMag, 0.85 * raMag, 0.55 * raMag] });
  const laDelay = p.lae ? 0.065 : 0.04;
  const laMag = (p.lae ? 0.16 : 0.1) * a;
  waves.push({ t: 0.03 + laDelay, sigmaL: p.lae ? 0.022 : 0.018, sigmaR: p.lae ? 0.022 : 0.018, amp: [0.75 * laMag, 0.5 * laMag, (p.lae ? -0.95 : -0.55) * laMag] });
  return { waves, pDuration: p.lae ? 0.13 : 0.1 };
}

/* ------------------------------------------------------------------ */
/* Rhythm scheduling                                                   */
/* ------------------------------------------------------------------ */

export interface ScheduledEvent {
  /** Absolute time (s) of the event reference. */
  t: number;
  kind: "P" | "QRS";
  /** Which morphology to use: "default" or a named variant (e.g. "pvc"). */
  variant: string;
  /** Preceding RR for QT correction (QRS only). */
  rr?: number;
}

export type RhythmSpec =
  | { type: "sinus"; rate: number; pr: number; variability?: number; respiratoryArrhythmia?: number }
  | { type: "afib"; meanRate: number; irregularity?: number }
  | { type: "aflutter"; atrialRate: number; conduction: number | "variable" }
  | { type: "mobitz1"; rate: number; cycleLength: number; prStart: number; prIncrement: number }
  | { type: "mobitz2"; rate: number; prFixed: number; dropEvery: number }
  | { type: "avb3"; atrialRate: number; escapeRate: number }
  | { type: "sinus-with-ectopy"; rate: number; pr: number; ectopy: Array<{ afterBeat: number; kind: "pvc" | "pac"; coupling: number }>; bigeminy?: boolean }
  | { type: "svt"; rate: number; retrogradeP: boolean }
  | { type: "vt"; rate: number; dissociatedAtrialRate?: number }
  | { type: "paced"; rate: number }
  | { type: "sinus-arrest"; rate: number; pr: number; pauseAfterBeat: number; pauseSec: number; escape?: "junctional" | "none" };

export interface Schedule {
  events: ScheduledEvent[];
  /** Continuous atrial activity (f-waves / flutter waves). */
  atrialNoise?: { kind: "fibrillation" | "flutter"; rate: number };
}

export function buildSchedule(spec: RhythmSpec, duration: number, rng: Rng): Schedule {
  const ev: ScheduledEvent[] = [];
  const start = 0.35;

  const pushBeat = (tQrs: number, pr: number | null, rr: number, variant = "default", pVariant = "default") => {
    if (pr !== null) ev.push({ t: tQrs - pr, kind: "P", variant: pVariant });
    ev.push({ t: tQrs, kind: "QRS", variant, rr });
  };

  switch (spec.type) {
    case "sinus": {
      const rrMean = 60 / spec.rate;
      let t = start;
      let prev = rrMean;
      while (t < duration + 1) {
        const resp = spec.respiratoryArrhythmia ? spec.respiratoryArrhythmia * Math.sin((2 * Math.PI * t) / 4.5) : 0;
        const rr = rrMean * (1 + resp) + rng.gaussian(0, (spec.variability ?? 0.015) * rrMean);
        pushBeat(t, spec.pr, prev);
        prev = rr;
        t += rr;
      }
      break;
    }
    case "afib": {
      const rrMean = 60 / spec.meanRate;
      const irr = spec.irregularity ?? 0.22;
      let t = start;
      let prev = rrMean;
      while (t < duration + 1) {
        const rr = Math.max(0.28, rrMean * Math.exp(rng.gaussian(0, irr)));
        pushBeat(t, null, prev);
        prev = rr;
        t += rr;
      }
      return { events: ev, atrialNoise: { kind: "fibrillation", rate: 420 } };
    }
    case "aflutter": {
      const fl = 60 / spec.atrialRate;
      let t = start;
      let n = 0;
      let prev = fl * (spec.conduction === "variable" ? 3 : spec.conduction);
      while (t < duration + 1) {
        const k = spec.conduction === "variable" ? [2, 4, 3, 2, 4][n % 5]! : spec.conduction;
        const rr = fl * k;
        pushBeat(t, null, prev);
        prev = rr;
        t += rr;
        n++;
      }
      return { events: ev, atrialNoise: { kind: "flutter", rate: spec.atrialRate } };
    }
    case "mobitz1": {
      const pp = 60 / spec.rate;
      let tP = start - spec.prStart;
      let i = 0;
      let lastQrs = -1;
      while (tP < duration + 1) {
        const pos = i % spec.cycleLength;
        ev.push({ t: tP, kind: "P", variant: "default" });
        if (pos < spec.cycleLength - 1) {
          const pr = spec.prStart + pos * spec.prIncrement;
          const tQ = tP + pr;
          ev.push({ t: tQ, kind: "QRS", variant: "default", rr: lastQrs < 0 ? pp : tQ - lastQrs });
          lastQrs = tQ;
        }
        tP += pp + rng.gaussian(0, 0.01);
        i++;
      }
      break;
    }
    case "mobitz2": {
      const pp = 60 / spec.rate;
      let tP = start - spec.prFixed;
      let i = 0;
      let lastQrs = -1;
      while (tP < duration + 1) {
        ev.push({ t: tP, kind: "P", variant: "default" });
        if ((i + 1) % spec.dropEvery !== 0) {
          const tQ = tP + spec.prFixed;
          ev.push({ t: tQ, kind: "QRS", variant: "default", rr: lastQrs < 0 ? pp : tQ - lastQrs });
          lastQrs = tQ;
        }
        tP += pp + rng.gaussian(0, 0.01);
        i++;
      }
      break;
    }
    case "avb3": {
      const pp = 60 / spec.atrialRate;
      for (let tP = 0.1; tP < duration + 1; tP += pp + rng.gaussian(0, 0.008)) ev.push({ t: tP, kind: "P", variant: "default" });
      const rr = 60 / spec.escapeRate;
      for (let tQ = start + 0.2; tQ < duration + 1; tQ += rr) ev.push({ t: tQ, kind: "QRS", variant: "escape", rr });
      break;
    }
    case "sinus-with-ectopy": {
      const rrMean = 60 / spec.rate;
      let t = start;
      let prev = rrMean;
      let beat = 0;
      const nextSinus: number[] = [];
      while (t < duration + 1) {
        nextSinus.push(t);
        t += rrMean + rng.gaussian(0, 0.012);
      }
      let i = 0;
      let skipSinusAt = -1;
      while (i < nextSinus.length) {
        const tS = nextSinus[i]!;
        if (i === skipSinusAt) {
          i++;
          continue;
        }
        pushBeat(tS, spec.pr, prev);
        prev = rrMean;
        const ect = spec.bigeminy ? { afterBeat: beat, kind: "pvc" as const, coupling: 0.55 } : spec.ectopy.find((e) => e.afterBeat === beat);
        if (ect) {
          const tE = tS + ect.coupling * rrMean;
          if (ect.kind === "pvc") {
            ev.push({ t: tE, kind: "QRS", variant: "pvc", rr: ect.coupling * rrMean });
            // Full compensatory pause: sinus node unaffected, next sinus P conducts normally,
            // except the P falling in the PVC's refractory period which is blocked.
            const nextP = nextSinus[i + 1];
            if (nextP !== undefined && nextP - spec.pr < tE + 0.25) {
              ev.push({ t: nextP - spec.pr, kind: "P", variant: "default" }); // buried / blocked P
              skipSinusAt = i + 1;
              prev = (nextSinus[i + 2] ?? nextP + rrMean) - tE;
              i += 1;
              // Re-insert the beat after the skipped one with prev RR handled.
            }
          } else {
            // PAC: early abnormal P, normal QRS, resets the sinus node (non-compensatory pause).
            ev.push({ t: tE - 0.15, kind: "P", variant: "ectopic" });
            ev.push({ t: tE, kind: "QRS", variant: "default", rr: ect.coupling * rrMean });
            const shift = tE + rrMean * 1.08 - (nextSinus[i + 1] ?? tE + rrMean);
            for (let j = i + 1; j < nextSinus.length; j++) nextSinus[j] = nextSinus[j]! + shift;
            prev = rrMean * 1.08;
          }
        }
        beat++;
        i++;
      }
      break;
    }
    case "svt": {
      const rr = 60 / spec.rate;
      let t = start;
      while (t < duration + 1) {
        ev.push({ t, kind: "QRS", variant: "default", rr });
        if (spec.retrogradeP) ev.push({ t: t + 0.07, kind: "P", variant: "retrograde" });
        t += rr;
      }
      break;
    }
    case "vt": {
      const rr = 60 / spec.rate;
      for (let t = start; t < duration + 1; t += rr + rng.gaussian(0, 0.004)) ev.push({ t, kind: "QRS", variant: "vt", rr });
      if (spec.dissociatedAtrialRate) {
        const pp = 60 / spec.dissociatedAtrialRate;
        for (let tP = 0.15; tP < duration + 1; tP += pp) ev.push({ t: tP, kind: "P", variant: "default" });
      }
      break;
    }
    case "paced": {
      const rr = 60 / spec.rate;
      for (let t = start; t < duration + 1; t += rr) ev.push({ t, kind: "QRS", variant: "paced", rr });
      break;
    }
    case "sinus-arrest": {
      const rrMean = 60 / spec.rate;
      let t = start;
      let prev = rrMean;
      let beat = 0;
      while (t < duration + 1) {
        pushBeat(t, spec.pr, prev);
        if (beat === spec.pauseAfterBeat) {
          if (spec.escape === "junctional") {
            const tEsc = t + spec.pauseSec * 0.75;
            ev.push({ t: tEsc, kind: "QRS", variant: "default", rr: spec.pauseSec * 0.75 });
          }
          prev = spec.pauseSec;
          t += spec.pauseSec;
        } else {
          const rr = rrMean + rng.gaussian(0, 0.012);
          prev = rr;
          t += rr;
        }
        beat++;
      }
      break;
    }
  }
  return { events: ev };
}

/* ------------------------------------------------------------------ */
/* Full synthesis                                                      */
/* ------------------------------------------------------------------ */

export interface SynthParams {
  rhythm: RhythmSpec;
  ventricular: Partial<VentricularParams>;
  atrial?: Partial<AtrialParams>;
  /** Morphology overrides for named variants (pvc, vt, escape, paced). */
  variants?: Record<string, Partial<VentricularParams>>;
  noise?: { baselineWander?: number; muscle?: number; mains?: number };
}

export interface SynthOptions {
  fs?: number;
  durationSec?: number;
  seed?: number;
  id?: string;
  presetId?: string;
}

const DEFAULT_VARIANTS: Record<string, Partial<VentricularParams>> = {
  pvc: { axisDeg: -100, qrsWidth: 1.75, voltage: 1.4, bbb: "none", tAmp: -1.6, lvh: false, lafb: false, delta: undefined, stElevation: undefined, qWaves: undefined },
  vt: { axisDeg: -120, qrsWidth: 1.8, voltage: 1.3, tAmp: -1.5, bbb: "none", lvh: false, lafb: false },
  escape: { qrsWidth: 1.7, axisDeg: -70, voltage: 1.1, tAmp: -1.2, bbb: "none" },
  paced: { paced: true, qrsWidth: 1.1 },
};

export function synthesize(params: SynthParams, opts: SynthOptions = {}): EcgRecord {
  const fs = opts.fs ?? 500;
  const duration = opts.durationSec ?? 10;
  const seed = opts.seed ?? 1;
  const rng = createRng(seed);
  const n = Math.round(fs * duration);

  const vBase: VentricularParams = { ...NORMAL_VENTRICULAR, ...params.ventricular };
  const aBase: AtrialParams = { ...NORMAL_ATRIAL, ...(params.atrial ?? {}) };
  const schedule = buildSchedule(params.rhythm, duration, rng);

  // Dipole time series.
  const dx = new Float32Array(n);
  const dy = new Float32Array(n);
  const dz = new Float32Array(n);

  const addWaves = (waves: Wave[], tRef: number, jitterGain = 1) => {
    for (const w of waves) {
      const centre = tRef + w.t;
      const span = Math.max(w.sigmaL, w.sigmaR) * 4.5;
      const i0 = Math.max(0, Math.floor((centre - span) * fs));
      const i1 = Math.min(n - 1, Math.ceil((centre + span) * fs));
      for (let i = i0; i <= i1; i++) {
        const v = waveValue(w, i / fs - centre) * jitterGain;
        if (v === 0) continue;
        dx[i] = dx[i]! + w.amp[0] * v;
        dy[i] = dy[i]! + w.amp[1] * v;
        dz[i] = dz[i]! + w.amp[2] * v;
      }
    }
  };

  const atrialMorph = buildAtrial(aBase);
  const ectopicAtrial = buildAtrial({ ...aBase, pAmp: aBase.pAmp * 0.8, lae: false, rae: false });
  const retroAtrial = buildAtrial({ ...aBase, retrograde: true });

  for (const e of schedule.events) {
    if (e.kind === "P") {
      const m = e.variant === "retrograde" ? retroAtrial : e.variant === "ectopic" ? ectopicAtrial : atrialMorph;
      addWaves(m.waves, e.t);
    } else {
      const override = e.variant === "default" ? {} : { ...DEFAULT_VARIANTS[e.variant], ...(params.variants?.[e.variant] ?? {}) };
      const vp: VentricularParams = { ...vBase, ...override };
      const m = buildVentricular(vp, e.rr ?? 0.85);
      // Tiny beat-to-beat amplitude variation keeps the tracing from looking stamped.
      addWaves(m.waves, e.t, 1 + rng.gaussian(0, 0.015));
    }
  }

  // Continuous atrial activity.
  if (schedule.atrialNoise) {
    const { kind, rate } = schedule.atrialNoise;
    if (kind === "flutter") {
      const f = rate / 60;
      // Sawtooth, typical counter-clockwise flutter: negative in II/III/aVF, positive in V1.
      const vec: Vec3 = [-0.12, -0.5, 0.35];
      for (let i = 0; i < n; i++) {
        const ph = ((i / fs) * f) % 1;
        const saw = ph < 0.75 ? ph / 0.75 : 1 - (ph - 0.75) / 0.25; // slow rise, fast fall
        const v = (saw - 0.5) * 0.32;
        dx[i] = dx[i]! + vec[0] * v;
        dy[i] = dy[i]! + vec[1] * v;
        dz[i] = dz[i]! + vec[2] * v;
      }
    } else {
      // Fibrillatory waves: a few drifting sinusoids around 5–8 Hz with random amplitude.
      const comps = Array.from({ length: 4 }, () => ({
        f: rng.uniform(4.5, 8),
        ph: rng.uniform(0, 2 * Math.PI),
        a: rng.uniform(0.02, 0.06),
        drift: rng.uniform(0.05, 0.2),
      }));
      const vec: Vec3 = [0.4, 0.5, 0.75];
      for (let i = 0; i < n; i++) {
        const t = i / fs;
        let v = 0;
        for (const c of comps) v += c.a * Math.sin(2 * Math.PI * c.f * t + c.ph + Math.sin(t * c.drift) * 2);
        dx[i] = dx[i]! + vec[0] * v;
        dy[i] = dy[i]! + vec[1] * v;
        dz[i] = dz[i]! + vec[2] * v;
      }
    }
  }

  // Project onto the 12 leads.
  const leads = {} as Record<LeadName, Float32Array>;
  const noise = params.noise ?? {};
  const wanderAmp = noise.baselineWander ?? 0.03;
  const muscleAmp = noise.muscle ?? 0.006;
  const mainsAmp = noise.mains ?? 0;
  for (const lead of LEAD_NAMES) {
    const lv = LEAD_VECTORS[lead];
    const sig = new Float32Array(n);
    const wanderPhase = rng.uniform(0, 2 * Math.PI);
    const wanderF = rng.uniform(0.15, 0.3);
    const leadWander = wanderAmp * rng.uniform(0.6, 1.4);
    for (let i = 0; i < n; i++) {
      const t = i / fs;
      let v = dot(lv, [dx[i]!, dy[i]!, dz[i]!]);
      v += leadWander * Math.sin(2 * Math.PI * wanderF * t + wanderPhase);
      if (muscleAmp > 0) v += rng.gaussian(0, muscleAmp);
      if (mainsAmp > 0) v += mainsAmp * Math.sin(2 * Math.PI * 50 * t);
      sig[i] = v;
    }
    leads[lead] = sig;
  }

  return {
    id: opts.id ?? `synth-${opts.presetId ?? "custom"}-${seed}`,
    fs,
    durationSec: duration,
    leads,
    source: { kind: "synthetic", presetId: opts.presetId ?? "custom", seed },
  };
}
