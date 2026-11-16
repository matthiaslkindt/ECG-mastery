/**
 * Named synthetic ECG presets. Each preset is a complete, reproducible parameter set for the
 * dipole model. Presets are referenced from the ECG library (`src/lib/ecg/library.ts`), which
 * attaches the clinical interpretation key, teaching points and translations.
 */
import type { SynthParams } from "./model";

export interface SynthPreset {
  id: string;
  params: SynthParams;
  /** Short English description of what the generator does (for provenance / docs). */
  modelNotes: string;
}

const sinus = (rate: number, pr = 0.16, extra: Partial<Extract<SynthParams["rhythm"], { type: "sinus" }>> = {}) =>
  ({ type: "sinus", rate, pr, ...extra }) as const;

export const SYNTH_PRESETS: Record<string, SynthPreset> = {
  "normal-sinus": {
    id: "normal-sinus",
    params: { rhythm: sinus(72, 0.16, { respiratoryArrhythmia: 0.02 }), ventricular: {} },
    modelNotes: "Sinus rhythm 72/min, PR 160 ms, axis +55°, QTc 400 ms, mild respiratory sinus arrhythmia.",
  },
  "sinus-bradycardia": {
    id: "sinus-bradycardia",
    params: { rhythm: sinus(44, 0.17), ventricular: { uWave: 0.05 } },
    modelNotes: "Sinus bradycardia 44/min with small U waves.",
  },
  "sinus-tachycardia": {
    id: "sinus-tachycardia",
    params: { rhythm: sinus(128, 0.14), ventricular: {} },
    modelNotes: "Sinus tachycardia 128/min; P waves begin to merge with the preceding T.",
  },
  "left-axis-deviation": {
    id: "left-axis-deviation",
    params: { rhythm: sinus(70), ventricular: { axisDeg: -40 } },
    modelNotes: "Sinus rhythm with mean QRS axis −40°.",
  },
  "right-axis-deviation": {
    id: "right-axis-deviation",
    params: { rhythm: sinus(78), ventricular: { axisDeg: 115 } },
    modelNotes: "Sinus rhythm with mean QRS axis +115°.",
  },
  "first-degree-avb": {
    id: "first-degree-avb",
    params: { rhythm: sinus(66, 0.27), ventricular: {} },
    modelNotes: "Sinus rhythm, PR 270 ms.",
  },
  "mobitz-1": {
    id: "mobitz-1",
    params: { rhythm: { type: "mobitz1", rate: 75, cycleLength: 4, prStart: 0.18, prIncrement: 0.07 }, ventricular: {} },
    modelNotes: "Wenckebach 4:3 conduction, PR 180 → 250 → 320 ms then dropped beat.",
  },
  "mobitz-2": {
    id: "mobitz-2",
    params: { rhythm: { type: "mobitz2", rate: 80, prFixed: 0.18, dropEvery: 3 }, ventricular: { bbb: "rbbb" } },
    modelNotes: "Mobitz II 3:2 with fixed PR 180 ms and RBBB (infranodal disease).",
  },
  "complete-heart-block": {
    id: "complete-heart-block",
    params: { rhythm: { type: "avb3", atrialRate: 84, escapeRate: 36 }, ventricular: {}, variants: { escape: { qrsWidth: 1.8, axisDeg: -75 } } },
    modelNotes: "Complete AV block; sinus P at 84/min dissociated from a wide ventricular escape at 36/min.",
  },
  "atrial-fibrillation": {
    id: "atrial-fibrillation",
    params: { rhythm: { type: "afib", meanRate: 118 }, ventricular: {} },
    modelNotes: "AF with rapid ventricular response, mean 118/min, fibrillatory baseline.",
  },
  "atrial-fibrillation-slow": {
    id: "atrial-fibrillation-slow",
    params: { rhythm: { type: "afib", meanRate: 68, irregularity: 0.25 }, ventricular: {} },
    modelNotes: "Rate-controlled AF, mean 68/min.",
  },
  "atrial-flutter-2-1": {
    id: "atrial-flutter-2-1",
    params: { rhythm: { type: "aflutter", atrialRate: 300, conduction: 2 }, ventricular: {} },
    modelNotes: "Typical counter-clockwise flutter, 300/min atrial rate, 2:1 conduction (ventricular 150/min).",
  },
  "atrial-flutter-variable": {
    id: "atrial-flutter-variable",
    params: { rhythm: { type: "aflutter", atrialRate: 300, conduction: "variable" }, ventricular: {} },
    modelNotes: "Flutter with variable block revealing sawtooth F waves.",
  },
  "pvc-sinus": {
    id: "pvc-sinus",
    params: { rhythm: { type: "sinus-with-ectopy", rate: 70, pr: 0.16, ectopy: [{ afterBeat: 2, kind: "pvc", coupling: 0.55 }, { afterBeat: 7, kind: "pvc", coupling: 0.55 }] }, ventricular: {} },
    modelNotes: "Sinus rhythm with two unifocal PVCs and full compensatory pauses.",
  },
  "ventricular-bigeminy": {
    id: "ventricular-bigeminy",
    params: { rhythm: { type: "sinus-with-ectopy", rate: 64, pr: 0.16, ectopy: [], bigeminy: true }, ventricular: {} },
    modelNotes: "Ventricular bigeminy: every sinus beat followed by a PVC.",
  },
  "pac-sinus": {
    id: "pac-sinus",
    params: { rhythm: { type: "sinus-with-ectopy", rate: 74, pr: 0.16, ectopy: [{ afterBeat: 3, kind: "pac", coupling: 0.6 }] }, ventricular: {} },
    modelNotes: "Sinus rhythm with a premature atrial complex and non-compensatory pause.",
  },
  avnrt: {
    id: "avnrt",
    params: { rhythm: { type: "svt", rate: 180, retrogradeP: true }, ventricular: { qtc: 0.38 } },
    modelNotes: "Regular narrow-complex tachycardia 180/min with retrograde P (pseudo-S in II, pseudo-r' in V1).",
  },
  "monomorphic-vt": {
    id: "monomorphic-vt",
    params: { rhythm: { type: "vt", rate: 165, dissociatedAtrialRate: 78 }, ventricular: {} },
    modelNotes: "Monomorphic VT 165/min, extreme axis, AV dissociation with sinus P at 78/min.",
  },
  "wpw-type-a": {
    id: "wpw-type-a",
    params: { rhythm: sinus(72, 0.1), ventricular: { delta: { pathway: "left-lateral", mV: 0.5 } } },
    modelNotes: "Pre-excitation via a left lateral pathway: PR 100 ms, delta wave positive in V1.",
  },
  "wpw-type-b": {
    id: "wpw-type-b",
    params: { rhythm: sinus(70, 0.1), ventricular: { delta: { pathway: "right-sided", mV: 0.5 } } },
    modelNotes: "Pre-excitation via a right-sided pathway: delta wave negative in V1, positive in I.",
  },
  "paced-ventricular": {
    id: "paced-ventricular",
    params: { rhythm: { type: "paced", rate: 70 }, ventricular: {} },
    modelNotes: "VVI pacing at 70/min: pacing spike followed by LBBB-like QRS with left axis.",
  },
  lbbb: {
    id: "lbbb",
    params: { rhythm: sinus(74), ventricular: { bbb: "lbbb" } },
    modelNotes: "Complete LBBB: QRS ≈ 150 ms, broad notched R in I/aVL/V5–6, QS in V1–V2, discordant ST-T.",
  },
  rbbb: {
    id: "rbbb",
    params: { rhythm: sinus(76), ventricular: { bbb: "rbbb" } },
    modelNotes: "Complete RBBB: rSR' in V1, broad terminal S in I/V6, QRS ≈ 140 ms, inverted T V1–V2.",
  },
  lafb: {
    id: "lafb",
    params: { rhythm: sinus(70), ventricular: { lafb: true } },
    modelNotes: "Left anterior fascicular block: axis −50°, qR in aVL, rS in II/III/aVF, QRS < 120 ms.",
  },
  lvh: {
    id: "lvh",
    params: { rhythm: sinus(68), ventricular: { lvh: true }, atrial: { lae: true } },
    modelNotes: "LVH with strain: high voltages, ST depression and T inversion in lateral leads, left atrial abnormality.",
  },
  rvh: {
    id: "rvh",
    params: { rhythm: sinus(88), ventricular: { rvh: true, axisDeg: 120 }, atrial: { rae: true } },
    modelNotes: "RVH: right axis, dominant R in V1, deep S in V6, right atrial enlargement.",
  },
  "stemi-inferior": {
    id: "stemi-inferior",
    params: { rhythm: sinus(58, 0.18), ventricular: { stElevation: { territory: "inferior", mV: 0.3, hyperacuteT: true } } },
    modelNotes: "Acute inferior STEMI: ST elevation II/III/aVF with reciprocal depression aVL/I, sinus bradycardia.",
  },
  "stemi-anterior": {
    id: "stemi-anterior",
    params: { rhythm: sinus(96), ventricular: { stElevation: { territory: "anteroseptal", mV: 0.4, hyperacuteT: true } } },
    modelNotes: "Acute anteroseptal STEMI (LAD): ST elevation V1–V4 with hyperacute T waves.",
  },
  "stemi-lateral": {
    id: "stemi-lateral",
    params: { rhythm: sinus(84), ventricular: { stElevation: { territory: "lateral", mV: 0.25 } } },
    modelNotes: "Lateral STEMI: ST elevation I, aVL, V5–V6 with inferior reciprocal depression.",
  },
  "posterior-mi": {
    id: "posterior-mi",
    params: { rhythm: sinus(80), ventricular: { stElevation: { territory: "posterior", mV: 0.3 } } },
    modelNotes: "Posterior MI: horizontal ST depression V1–V3 with tall R (mirror of posterior ST elevation).",
  },
  "old-inferior-mi": {
    id: "old-inferior-mi",
    params: { rhythm: sinus(66), ventricular: { qWaves: "inferior", tInversion: "inferior" } },
    modelNotes: "Old inferior MI: pathological Q waves and T inversion in II, III, aVF.",
  },
  "old-anterior-mi": {
    id: "old-anterior-mi",
    params: { rhythm: sinus(72), ventricular: { qWaves: "anteroseptal" } },
    modelNotes: "Old anteroseptal MI: QS complexes / poor R progression V1–V3.",
  },
  "wellens-a": {
    id: "wellens-a",
    params: { rhythm: sinus(70), ventricular: { tInversion: "anterior" } },
    modelNotes: "Wellens pattern: deep symmetric T inversion V2–V4 in a pain-free patient (critical proximal LAD).",
  },
  "subendocardial-ischaemia": {
    id: "subendocardial-ischaemia",
    params: { rhythm: sinus(104), ventricular: { stDepressionMv: 0.2 } },
    modelNotes: "Diffuse ST depression with ST elevation in aVR (demand ischaemia / left main).",
  },
  pericarditis: {
    id: "pericarditis",
    params: { rhythm: sinus(92), ventricular: { stElevation: { territory: "diffuse", mV: 0.15 } }, atrial: { pAmp: 1 } },
    modelNotes: "Acute pericarditis: diffuse concave ST elevation, ST depression and PR elevation in aVR.",
  },
  hyperkalaemia: {
    id: "hyperkalaemia",
    params: { rhythm: sinus(62, 0.2), ventricular: { peakedT: true, qrsWidth: 1.3 }, atrial: { pAmp: 0.4 } },
    modelNotes: "Hyperkalaemia: tall peaked T waves, flattened P, widening QRS.",
  },
  hypokalaemia: {
    id: "hypokalaemia",
    params: { rhythm: sinus(78), ventricular: { tAmp: 0.35, uWave: 0.18, stDepressionMv: 0.06 } },
    modelNotes: "Hypokalaemia: flattened T, prominent U waves, mild ST depression.",
  },
  "long-qt": {
    id: "long-qt",
    params: { rhythm: sinus(60), ventricular: { qtc: 0.54 } },
    modelNotes: "Prolonged QT: QTc 540 ms.",
  },
  "brugada-type-1": {
    id: "brugada-type-1",
    params: { rhythm: sinus(70), ventricular: { brugada: true, bbb: "irbbb" } },
    modelNotes: "Brugada type 1: coved ST elevation ≥ 2 mm in V1–V2 with negative T.",
  },
  "sinus-arrest": {
    id: "sinus-arrest",
    params: { rhythm: { type: "sinus-arrest", rate: 62, pr: 0.16, pauseAfterBeat: 3, pauseSec: 3.2, escape: "junctional" }, ventricular: {} },
    modelNotes: "Sinus pause of 3.2 s terminated by a junctional escape beat.",
  },
  "low-voltage": {
    id: "low-voltage",
    params: { rhythm: sinus(98), ventricular: { voltage: 0.35, tAmp: 0.5 } },
    modelNotes: "Low QRS voltage (pericardial effusion / infiltrative disease) with sinus tachycardia.",
  },
};

export const SYNTH_PRESET_IDS = Object.keys(SYNTH_PRESETS);
