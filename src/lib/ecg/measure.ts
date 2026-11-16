/**
 * Lightweight signal measurements used for tests, auto-hints and the library builder.
 * These are deliberately simple (no clinical-grade QRS detector) — authored interpretation
 * keys remain the source of truth for assessment.
 */
import type { EcgRecord, LeadName } from "./types";

/** Detect R peaks in a lead using a derivative-energy threshold with a refractory period. */
export function detectRPeaks(rec: EcgRecord, lead: LeadName = "II"): number[] {
  const x = rec.leads[lead];
  const fs = rec.fs;
  const n = x.length;
  // Band-limit by differencing then squaring and moving-average (Pan–Tompkins-lite).
  const d = new Float32Array(n);
  for (let i = 2; i < n - 2; i++) d[i] = (2 * x[i + 2]! + x[i + 1]! - x[i - 1]! - 2 * x[i - 2]!) / 8;
  const e = new Float32Array(n);
  const win = Math.round(0.08 * fs);
  let acc = 0;
  for (let i = 0; i < n; i++) {
    acc += d[i]! * d[i]!;
    if (i >= win) acc -= d[i - win]! * d[i - win]!;
    e[i] = acc / win;
  }
  let max = 0;
  for (let i = 0; i < n; i++) if (e[i]! > max) max = e[i]!;
  const thr = max * 0.2;
  let ampMax = 0;
  for (let i = 0; i < n; i++) if (Math.abs(x[i]!) > ampMax) ampMax = Math.abs(x[i]!);
  const ampGate = ampMax * 0.35; // rejects P/T waves that pass the slope threshold (e.g. wide escape QRS)
  const refractory = Math.round(0.22 * fs);
  const peaks: number[] = [];
  let i = 0;
  while (i < n) {
    if (e[i]! > thr) {
      // Find the local maximum of |x| within the next 100 ms.
      let best = i;
      const end = Math.min(n - 1, i + Math.round(0.1 * fs));
      for (let j = i; j <= end; j++) if (Math.abs(x[j]!) > Math.abs(x[best]!)) best = j;
      if (Math.abs(x[best]!) >= ampGate) {
        peaks.push(best);
        i = best + refractory;
      } else i = end + 1;
    } else i++;
  }
  return peaks;
}

export function heartRateFromPeaks(peaks: number[], fs: number): number | null {
  if (peaks.length < 2) return null;
  const rr: number[] = [];
  for (let i = 1; i < peaks.length; i++) rr.push((peaks[i]! - peaks[i - 1]!) / fs);
  const mean = rr.reduce((a, b) => a + b, 0) / rr.length;
  return Math.round(60 / mean);
}

export function rrIrregularity(peaks: number[], fs: number): number {
  if (peaks.length < 3) return 0;
  const rr: number[] = [];
  for (let i = 1; i < peaks.length; i++) rr.push((peaks[i]! - peaks[i - 1]!) / fs);
  const mean = rr.reduce((a, b) => a + b, 0) / rr.length;
  const sd = Math.sqrt(rr.reduce((a, b) => a + (b - mean) ** 2, 0) / rr.length);
  return sd / mean;
}

/** Mean amplitude (mV) in a window relative to each R peak — used for ST-segment checks. */
export function meanAtOffset(rec: EcgRecord, lead: LeadName, peaks: number[], offsetSec: number, widthSec = 0.02): number {
  const x = rec.leads[lead];
  const fs = rec.fs;
  let sum = 0;
  let count = 0;
  for (const p of peaks) {
    const c = p + Math.round(offsetSec * fs);
    const h = Math.round(widthSec * fs);
    for (let i = c - h; i <= c + h; i++) {
      if (i >= 0 && i < x.length) {
        sum += x[i]!;
        count++;
      }
    }
  }
  return count ? sum / count : 0;
}

/** Isoelectric reference: mean value ~60 ms before each R peak (PR segment). */
export function baselineBeforeR(rec: EcgRecord, lead: LeadName, peaks: number[]): number {
  return meanAtOffset(rec, lead, peaks, -0.07, 0.01);
}

/** Net QRS deflection (mV·s) ±50 ms around R peaks, relative to baseline. */
export function netQrs(rec: EcgRecord, lead: LeadName, peaks: number[]): number {
  const x = rec.leads[lead];
  const fs = rec.fs;
  const base = baselineBeforeR(rec, lead, peaks);
  let sum = 0;
  for (const p of peaks) {
    for (let i = p - Math.round(0.05 * fs); i <= p + Math.round(0.05 * fs); i++) {
      if (i >= 0 && i < x.length) sum += x[i]! - base;
    }
  }
  return sum / fs / Math.max(peaks.length, 1);
}
