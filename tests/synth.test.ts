import { describe, expect, it } from "vitest";
import { synthesize, SYNTH_PRESETS, SYNTH_PRESET_IDS } from "@/lib/ecg/synth";
import { detectRPeaks, heartRateFromPeaks, rrIrregularity, meanAtOffset, baselineBeforeR } from "@/lib/ecg/measure";
import { LEAD_NAMES } from "@/lib/ecg/types";

const gen = (id: string, seed = 7) => synthesize(SYNTH_PRESETS[id]!.params, { presetId: id, seed });
const st = (rec: ReturnType<typeof gen>, lead: (typeof LEAD_NAMES)[number], peaks: number[]) => meanAtOffset(rec, lead, peaks, 0.08, 0.01) - baselineBeforeR(rec, lead, peaks);

describe("synthesizer", () => {
  it("produces 12 leads of the requested length for every preset", () => {
    for (const id of SYNTH_PRESET_IDS) {
      const rec = gen(id);
      expect(rec.fs).toBe(500);
      for (const l of LEAD_NAMES) {
        expect(rec.leads[l].length).toBe(5000);
        expect(Number.isFinite(rec.leads[l][100])).toBe(true);
      }
    }
  });

  it("is deterministic for a given seed", () => {
    const a = gen("normal-sinus", 3);
    const b = gen("normal-sinus", 3);
    expect(Array.from(a.leads.V3.slice(0, 200))).toEqual(Array.from(b.leads.V3.slice(0, 200)));
  });

  it("normal sinus rhythm has the expected rate, negative aVR and precordial transition", () => {
    const rec = gen("normal-sinus");
    const peaks = detectRPeaks(rec, "II");
    expect(heartRateFromPeaks(peaks, rec.fs)).toBeGreaterThanOrEqual(68);
    expect(heartRateFromPeaks(peaks, rec.fs)).toBeLessThanOrEqual(76);
    expect(rrIrregularity(peaks, rec.fs)).toBeLessThan(0.08);
    const max = (l: (typeof LEAD_NAMES)[number]) => Math.max(...Array.from(rec.leads[l]));
    const min = (l: (typeof LEAD_NAMES)[number]) => Math.min(...Array.from(rec.leads[l]));
    expect(Math.abs(min("aVR"))).toBeGreaterThan(max("aVR"));
    expect(Math.abs(min("V1"))).toBeGreaterThan(max("V1"));
    expect(max("V6")).toBeGreaterThan(Math.abs(min("V6")));
    expect(max("II")).toBeGreaterThan(1.0);
  });

  it("atrial fibrillation is irregular, sinus rhythm is not", () => {
    const af = gen("atrial-fibrillation");
    const sr = gen("sinus-tachycardia");
    expect(rrIrregularity(detectRPeaks(af, "II"), af.fs)).toBeGreaterThan(0.12);
    expect(rrIrregularity(detectRPeaks(sr, "II"), sr.fs)).toBeLessThan(0.05);
  });

  it("inferior STEMI elevates II/III/aVF with reciprocal depression in aVL", () => {
    const rec = gen("stemi-inferior");
    const peaks = detectRPeaks(rec, "II");
    expect(st(rec, "II", peaks)).toBeGreaterThan(0.15);
    expect(st(rec, "III", peaks)).toBeGreaterThan(0.15);
    expect(st(rec, "aVF", peaks)).toBeGreaterThan(0.15);
    expect(st(rec, "aVL", peaks)).toBeLessThan(-0.05);
  });

  it("anterior STEMI elevates V2–V4 and posterior MI depresses V1–V3", () => {
    const ant = gen("stemi-anterior");
    const pa = detectRPeaks(ant, "II");
    expect(st(ant, "V2", pa)).toBeGreaterThan(0.3);
    expect(st(ant, "V3", pa)).toBeGreaterThan(0.3);
    const post = gen("posterior-mi");
    const pp = detectRPeaks(post, "II");
    expect(st(post, "V2", pp)).toBeLessThan(-0.1);
  });

  it("VT is fast with a positive aVR; complete heart block has a slow ventricular rate", () => {
    const vt = gen("monomorphic-vt");
    const pv = detectRPeaks(vt, "V5");
    expect(heartRateFromPeaks(pv, vt.fs)).toBeGreaterThan(150);
    expect(Math.max(...Array.from(vt.leads.aVR))).toBeGreaterThan(Math.abs(Math.min(...Array.from(vt.leads.aVR))));
    const chb = gen("complete-heart-block");
    const pc = detectRPeaks(chb, "V5");
    expect(heartRateFromPeaks(pc, chb.fs)).toBeLessThan(45);
  });

  it("LBBB widens the QRS compared with normal", () => {
    const width = (id: string) => {
      const rec = gen(id);
      const x = rec.leads.V6;
      const peaks = detectRPeaks(rec, "V6");
      const p = peaks[2]!;
      const thr = 0.15 * Math.abs(x[p]!);
      let a = p, b = p;
      while (a > 0 && Math.abs(x[a]!) > thr) a--;
      while (b < x.length - 1 && Math.abs(x[b]!) > thr) b++;
      return ((b - a) / rec.fs) * 1000;
    };
    expect(width("lbbb")).toBeGreaterThan(width("normal-sinus") * 1.4);
  });
});
