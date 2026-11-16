import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { decodeRecord, encodeRecord } from "@/lib/ecg/codec";
import { parseHeader } from "@/lib/ecg/wfdb";
import { synthesize, SYNTH_PRESETS } from "@/lib/ecg/synth";
import { LEAD_NAMES } from "@/lib/ecg/types";

describe("codec", () => {
  it("round-trips a record to within 1 µV", () => {
    const rec = synthesize(SYNTH_PRESETS["normal-sinus"]!.params, { seed: 1 });
    const back = decodeRecord(encodeRecord(rec));
    for (const l of LEAD_NAMES) {
      for (let i = 0; i < rec.leads[l].length; i += 97) {
        expect(Math.abs(back.leads[l][i]! - rec.leads[l][i]!)).toBeLessThanOrEqual(0.0011);
      }
    }
  });

  it("decodes a downloaded PTB-XL record with plausible amplitudes", () => {
    const file = JSON.parse(readFileSync("public/ecg/ptbxl/ptbxl-00003.json", "utf8"));
    const rec = decodeRecord(file);
    expect(rec.fs).toBe(500);
    expect(rec.leads.II.length).toBe(5000);
    const max = Math.max(...Array.from(rec.leads.II));
    expect(max).toBeGreaterThan(0.3);
    expect(max).toBeLessThan(5);
    expect(rec.source.kind).toBe("ptbxl");
  });
});

describe("wfdb header", () => {
  it("parses a PTB-XL style header", () => {
    const h = parseHeader("00001_hr 12 500 5000\n00001_hr.dat 16 1000.0(0)/mV 16 0 -115 13047 0 I\n00001_hr.dat 16 1000.0(0)/mV 16 0 -50 11561 0 II\n");
    expect(h.fs).toBe(500);
    expect(h.nSamples).toBe(5000);
    expect(h.signals[0]!.gain).toBe(1000);
    expect(h.signals[0]!.baseline).toBe(0);
    expect(h.signals[1]!.description).toBe("II");
  });
});
