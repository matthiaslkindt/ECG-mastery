import { describe, expect, it } from "vitest";
import { scoreInterpretation, scoreQuestion } from "@/lib/learning/scoring";
import type { InterpretationKey, Question } from "@/lib/content/types";

const key: InterpretationKey = {
  rate: { value: 58, tolerance: 6 },
  rhythm: "sinus-bradycardia",
  findings: ["st-elevation-inferior", "reciprocal-st-depression"],
  optionalFindings: ["hyperacute-t"],
  distractors: ["st-elevation-diffuse"],
  diagnosis: ["inferior-stemi"],
  urgency: "emergency",
};

describe("scoreInterpretation", () => {
  it("gives full marks for a perfect submission", () => {
    const r = scoreInterpretation(key, { rate: 60, rhythm: "sinus-bradycardia", findings: ["st-elevation-inferior", "reciprocal-st-depression", "hyperacute-t"], diagnosis: ["inferior-stemi"], urgency: "emergency" });
    expect(r.score).toBe(1);
    expect(r.missedFindings).toEqual([]);
    expect(r.wrongFindings).toEqual([]);
  });

  it("does not score fields absent from the key", () => {
    const r = scoreInterpretation(key, { rate: 60, rhythm: "sinus-bradycardia", axis: "left", pr: 400, qrs: 200, findings: ["st-elevation-inferior", "reciprocal-st-depression"], diagnosis: ["inferior-stemi"], urgency: "emergency" });
    expect(r.score).toBe(1);
    expect(r.fields.find((f) => f.field === "axis")).toBeUndefined();
  });

  it("penalises distractors more than other extras and gives partial credit for near-miss numbers", () => {
    const distractor = scoreInterpretation(key, { rate: 70, rhythm: "sinus-bradycardia", findings: ["st-elevation-inferior", "reciprocal-st-depression", "st-elevation-diffuse"], diagnosis: ["inferior-stemi"], urgency: "emergency" });
    const extra = scoreInterpretation(key, { rate: 70, rhythm: "sinus-bradycardia", findings: ["st-elevation-inferior", "reciprocal-st-depression", "u-wave"], diagnosis: ["inferior-stemi"], urgency: "emergency" });
    expect(distractor.score).toBeLessThan(extra.score);
    expect(extra.fields.find((f) => f.field === "rate")!.status).toBe("partial");
  });

  it("treats a null PR key as 'not measurable'", () => {
    const afKey: InterpretationKey = { rhythm: "atrial-fibrillation", pr: null, findings: [], diagnosis: ["atrial-fibrillation"], urgency: "urgent" };
    expect(scoreInterpretation(afKey, { pr: null, rhythm: "atrial-fibrillation", findings: [], diagnosis: ["atrial-fibrillation"], urgency: "urgent" }).score).toBe(1);
    expect(scoreInterpretation(afKey, { pr: 160, rhythm: "atrial-fibrillation", findings: [], diagnosis: ["atrial-fibrillation"], urgency: "urgent" }).fields.find((f) => f.field === "pr")!.status).toBe("incorrect");
  });
});

const q: Question = {
  id: "q", kind: "multiple", competency: "axis", level: 1,
  stem: { en: "", nl: "" }, explanation: { en: "", nl: "" },
  options: [
    { id: "a", text: { en: "", nl: "" }, correct: true },
    { id: "b", text: { en: "", nl: "" }, correct: true },
    { id: "c", text: { en: "", nl: "" }, correct: false },
  ],
};

describe("scoreQuestion", () => {
  it("scores single-best-answer", () => {
    const single: Question = { ...q, kind: "single", options: [{ ...q.options[0]!, correct: true }, { ...q.options[1]!, correct: false }, q.options[2]!] };
    expect(scoreQuestion(single, ["a"]).correct).toBe(true);
    expect(scoreQuestion(single, ["b"]).score).toBe(0);
  });
  it("gives partial credit on multiple-true and penalises wrong picks", () => {
    expect(scoreQuestion(q, ["a", "b"]).score).toBe(1);
    expect(scoreQuestion(q, ["a"]).score).toBe(0.5);
    expect(scoreQuestion(q, ["a", "b", "c"]).score).toBe(0.5);
    expect(scoreQuestion(q, ["c"]).score).toBe(0);
  });
});
