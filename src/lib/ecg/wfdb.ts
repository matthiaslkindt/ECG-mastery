/**
 * Minimal WFDB reader for PTB-XL style records (format 16, little-endian, interleaved).
 * Only the subset of the header specification needed for PhysioNet PTB-XL is handled.
 */
import { LEAD_NAMES, type LeadName } from "./types";

export interface WfdbHeader {
  recordName: string;
  nSignals: number;
  fs: number;
  nSamples: number;
  signals: Array<{
    fileName: string;
    format: number;
    gain: number; // ADC units per mV
    baseline: number;
    adcResolution: number;
    adcZero: number;
    description: string;
  }>;
}

export function parseHeader(text: string): WfdbHeader {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith("#"));
  const [rec, nSig, fs, nSamp] = lines[0]!.trim().split(/\s+/);
  const signals = lines.slice(1, 1 + Number(nSig)).map((l) => {
    const p = l.trim().split(/\s+/);
    // e.g. "00001_hr.dat 16 1000.0(0)/mV 16 0 -115 13047 0 I"
    const gainSpec = p[2]!;
    const gainMatch = /^([\d.]+)(?:\(([-\d]+)\))?/.exec(gainSpec);
    const gain = gainMatch ? Number(gainMatch[1]) : 200;
    const baseline = gainMatch && gainMatch[2] !== undefined ? Number(gainMatch[2]) : Number(p[4] ?? 0);
    return {
      fileName: p[0]!,
      format: Number(p[1]),
      gain,
      baseline,
      adcResolution: Number(p[3] ?? 16),
      adcZero: Number(p[4] ?? 0),
      description: p[p.length - 1]!,
    };
  });
  return { recordName: rec!, nSignals: Number(nSig), fs: Number(fs), nSamples: Number(nSamp), signals };
}

/** Normalise PTB-XL lead labels (AVR → aVR). */
function normaliseLead(desc: string): LeadName | null {
  const u = desc.toUpperCase();
  const map: Record<string, LeadName> = {
    I: "I", II: "II", III: "III", AVR: "aVR", AVL: "aVL", AVF: "aVF",
    V1: "V1", V2: "V2", V3: "V3", V4: "V4", V5: "V5", V6: "V6",
  };
  return map[u] ?? null;
}

export function parseSignals(header: WfdbHeader, dat: Uint8Array): Record<LeadName, Float32Array> {
  if (header.signals.some((s) => s.format !== 16)) {
    throw new Error("Only WFDB format 16 is supported");
  }
  const n = header.nSignals;
  const view = new DataView(dat.buffer, dat.byteOffset, dat.byteLength);
  const nSamples = Math.min(header.nSamples, Math.floor(dat.byteLength / (2 * n)));
  const out = {} as Record<LeadName, Float32Array>;
  for (const lead of LEAD_NAMES) out[lead] = new Float32Array(nSamples);
  header.signals.forEach((sig, ch) => {
    const lead = normaliseLead(sig.description);
    if (!lead) return;
    const arr = out[lead];
    for (let i = 0; i < nSamples; i++) {
      const raw = view.getInt16((i * n + ch) * 2, true);
      arr[i] = (raw - sig.baseline) / sig.gain;
    }
  });
  return out;
}
