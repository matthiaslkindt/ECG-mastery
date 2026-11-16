import { describe, expect, it } from "vitest";
import { CURRICULUM } from "@/lib/content/curriculum";
import { CASES } from "@/lib/content/cases";
import { ASSESSMENTS } from "@/lib/content/assessments";
import { ECG_LIBRARY, getEcgEntry } from "@/lib/content/library";
import { SYNTH_PRESETS } from "@/lib/ecg/synth/presets";
import { existsSync } from "node:fs";
import path from "node:path";

describe("content integrity", () => {
  it("every ECG reference resolves to a library entry", () => {
    const refs: string[] = [];
    for (const m of CURRICULUM) for (const l of m.lessons) for (const b of l.blocks) {
      if (b.type === "ecg") refs.push(b.ecgId);
      if (b.type === "check" && b.question.ecgId) refs.push(b.question.ecgId);
    }
    for (const c of CASES) { refs.push(c.ecgId); for (const s of c.steps) if (s.ecgId) refs.push(s.ecgId); }
    for (const a of ASSESSMENTS) for (const q of a.questions) if (q.ecgId) refs.push(q.ecgId);
    const missing = refs.filter((r) => !getEcgEntry(r));
    expect(missing).toEqual([]);
  });

  it("library sources exist (preset or downloaded file)", () => {
    for (const e of ECG_LIBRARY) {
      if (e.source.kind === "synthetic") expect(SYNTH_PRESETS[e.source.presetId], e.id).toBeDefined();
      else expect(existsSync(path.join("public", e.source.file)), e.id).toBe(true);
    }
  });

  it("ids and slugs are unique", () => {
    const uniq = (xs: string[]) => expect(new Set(xs).size).toBe(xs.length);
    uniq(CURRICULUM.map((m) => m.slug));
    uniq(CURRICULUM.flatMap((m) => m.lessons.map((l) => l.id)));
    uniq(CASES.map((c) => c.slug));
    uniq(ASSESSMENTS.map((a) => a.slug));
    uniq(ECG_LIBRARY.map((e) => e.id));
  });

  it("every question has exactly one correct option when single, and ≥1 when multiple", () => {
    const qs = [
      ...CURRICULUM.flatMap((m) => m.lessons.flatMap((l) => l.blocks.flatMap((b) => (b.type === "check" ? [b.question] : [])))),
      ...CASES.flatMap((c) => c.steps.flatMap((s) => (s.question ? [s.question] : []))),
      ...ASSESSMENTS.filter((a) => a.kind === "summative").flatMap((a) => a.questions),
    ];
    for (const q of qs) {
      const n = q.options.filter((o) => o.correct).length;
      if (q.kind === "single") expect(n, q.id).toBe(1);
      else expect(n, q.id).toBeGreaterThanOrEqual(1);
    }
  });

  it("all localized strings have both languages", () => {
    const check = (v: unknown, pathStr: string) => {
      if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        if ("en" in o && "nl" in o && typeof o.en === "string") {
          expect(typeof o.nl, pathStr).toBe("string");
          expect((o.nl as string).length, pathStr).toBeGreaterThan(0);
          return;
        }
        for (const [k, x] of Object.entries(o)) check(x, `${pathStr}.${k}`);
      }
    };
    check(CURRICULUM, "curriculum");
    check(CASES, "cases");
    check(ECG_LIBRARY, "library");
  });

  it("summative tests reference existing modules", () => {
    for (const m of CURRICULUM) if (m.summativeTestSlug) expect(ASSESSMENTS.find((a) => a.slug === m.summativeTestSlug), m.slug).toBeDefined();
  });
});
