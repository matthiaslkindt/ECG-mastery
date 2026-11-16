import type { LeadName } from "@/lib/ecg/types";

export type EcgLayout = "3x4" | "3x4+rhythm" | "6x2" | "single";

export const MM_PER_SEC = 25;
export const MM_PER_MV = 10;

export interface Panel {
  lead: LeadName;
  /** Top-left in mm. */
  x: number;
  y: number;
  /** Width / height in mm. */
  w: number;
  h: number;
  /** Time window shown (seconds from record start). */
  t0: number;
  dur: number;
  /** Baseline (0 mV) y position in mm. */
  baseline: number;
  rhythm?: boolean;
}

const COLS: LeadName[][] = [
  ["I", "II", "III"],
  ["aVR", "aVL", "aVF"],
  ["V1", "V2", "V3"],
  ["V4", "V5", "V6"],
];

export const MARGIN_LEFT_MM = 9;

export function buildPanels(layout: EcgLayout, duration: number, singleLead: LeadName, rowHeightMm = 30): { panels: Panel[]; width: number; height: number } {
  const panels: Panel[] = [];
  const m = MARGIN_LEFT_MM;
  if (layout === "3x4" || layout === "3x4+rhythm") {
    const colDur = Math.min(2.5, duration / 4);
    const colW = colDur * MM_PER_SEC;
    COLS.forEach((col, ci) => {
      col.forEach((lead, ri) => {
        panels.push({ lead, x: m + ci * colW, y: ri * rowHeightMm, w: colW, h: rowHeightMm, t0: ci * colDur, dur: colDur, baseline: ri * rowHeightMm + rowHeightMm / 2 });
      });
    });
    let height = rowHeightMm * 3;
    if (layout === "3x4+rhythm") {
      panels.push({ lead: "II", x: m, y: height, w: colW * 4, h: rowHeightMm, t0: 0, dur: colDur * 4, baseline: height + rowHeightMm / 2, rhythm: true });
      height += rowHeightMm;
    }
    return { panels, width: m + colW * 4, height };
  }
  if (layout === "6x2") {
    const colDur = Math.min(5, duration / 2);
    const colW = colDur * MM_PER_SEC;
    const left: LeadName[] = ["I", "II", "III", "aVR", "aVL", "aVF"];
    const right: LeadName[] = ["V1", "V2", "V3", "V4", "V5", "V6"];
    const rh = rowHeightMm * 0.8;
    left.forEach((lead, ri) => panels.push({ lead, x: m, y: ri * rh, w: colW, h: rh, t0: 0, dur: colDur, baseline: ri * rh + rh / 2 }));
    right.forEach((lead, ri) => panels.push({ lead, x: m + colW, y: ri * rh, w: colW, h: rh, t0: colDur, dur: colDur, baseline: ri * rh + rh / 2 }));
    return { panels, width: m + colW * 2, height: rh * 6 };
  }
  // single lead, full duration, taller
  const w = duration * MM_PER_SEC;
  const h = rowHeightMm * 1.6;
  panels.push({ lead: singleLead, x: m, y: 0, w, h, t0: 0, dur: duration, baseline: h / 2, rhythm: true });
  return { panels, width: m + w, height: h };
}

/** Build an SVG path (in mm) for one panel. */
export function tracePath(signal: Float32Array, fs: number, panel: Panel, pxPerMm: number): string {
  const i0 = Math.max(0, Math.floor(panel.t0 * fs));
  const i1 = Math.min(signal.length, Math.ceil((panel.t0 + panel.dur) * fs));
  // Decimate to roughly 2 points per rendered pixel while keeping extrema.
  const samplesPerMm = fs / MM_PER_SEC;
  const step = Math.max(1, Math.floor(samplesPerMm / (pxPerMm * 2)));
  const parts: string[] = [];
  const halfH = panel.h / 2 - 1;
  for (let i = i0; i < i1; i += step) {
    let v = signal[i]!;
    if (step > 1) {
      // keep the max-magnitude sample in the window so R peaks survive decimation
      for (let j = i + 1; j < Math.min(i + step, i1); j++) if (Math.abs(signal[j]!) > Math.abs(v)) v = signal[j]!;
    }
    const x = panel.x + ((i - i0) / fs) * MM_PER_SEC;
    const mv = Math.max(-halfH / MM_PER_MV, Math.min(halfH / MM_PER_MV, v));
    const y = panel.baseline - mv * MM_PER_MV;
    parts.push(`${i === i0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return parts.join("");
}
