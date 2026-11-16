/**
 * Scoring for structured ECG interpretation and multiple-choice questions.
 * Pure functions so they can be unit-tested and reused server-side later.
 */
import type { CompetencyId, InterpretationKey, InterpretationSubmission, Question } from "../content/types";

export interface FieldResult {
  field: string;
  status: "correct" | "incorrect" | "partial" | "skipped" | "not-scored";
  /** 0..1 */
  score: number;
  weight: number;
  expected?: string;
  given?: string;
}

export interface InterpretationResult {
  fields: FieldResult[];
  /** Weighted score 0..1 */
  score: number;
  missedFindings: string[];
  wrongFindings: string[];
  missedDiagnoses: string[];
  wrongDiagnoses: string[];
}

const fmt = (v: unknown) => (v === undefined || v === null ? "—" : String(v));

export function scoreInterpretation(key: InterpretationKey, sub: InterpretationSubmission): InterpretationResult {
  const fields: FieldResult[] = [];

  const numeric = (field: string, k: { value: number; tolerance: number } | null | undefined, v: number | null | undefined, weight: number) => {
    if (k === undefined) return;
    if (k === null) {
      // Not measurable (e.g. PR in AF): correct if learner says not measurable (null) or leaves blank.
      const ok = v === null || v === undefined;
      fields.push({ field, status: ok ? "correct" : "incorrect", score: ok ? 1 : 0, weight, expected: "n/a", given: fmt(v) });
      return;
    }
    if (v === undefined || v === null) {
      fields.push({ field, status: "skipped", score: 0, weight, expected: `${k.value} ± ${k.tolerance}`, given: "—" });
      return;
    }
    const diff = Math.abs(v - k.value);
    const score = diff <= k.tolerance ? 1 : diff <= k.tolerance * 2 ? 0.5 : 0;
    fields.push({ field, status: score === 1 ? "correct" : score > 0 ? "partial" : "incorrect", score, weight, expected: `${k.value} ± ${k.tolerance}`, given: fmt(v) });
  };

  numeric("rate", key.rate, sub.rate, 1);
  numeric("pr", key.pr, sub.pr, 1);
  numeric("qrs", key.qrs, sub.qrs, 1);
  numeric("qtc", key.qtc, sub.qtc, 1);

  const categorical = (field: string, expected: string | undefined, given: string | undefined, weight: number) => {
    if (expected === undefined) return;
    if (given === undefined) {
      fields.push({ field, status: "skipped", score: 0, weight, expected, given: "—" });
      return;
    }
    const ok = expected === given;
    fields.push({ field, status: ok ? "correct" : "incorrect", score: ok ? 1 : 0, weight, expected, given });
  };
  categorical("rhythm", key.rhythm, sub.rhythm, 2);
  categorical("axis", key.axis, sub.axis, 1);
  categorical("urgency", key.urgency, sub.urgency, 1);

  // Findings: required must be present; distractors penalised; optional ignored; other extras mildly penalised.
  const required = new Set<string>(key.findings);
  const optional = new Set<string>(key.optionalFindings ?? []);
  const distractors = new Set<string>(key.distractors ?? []);
  const given = new Set<string>(sub.findings);
  const missedFindings = [...required].filter((f) => !given.has(f));
  const wrongFindings = [...given].filter((f) => !required.has(f) && !optional.has(f));
  let findingScore: number;
  if (required.size === 0 && wrongFindings.length === 0) findingScore = 1;
  else {
    const hit = required.size === 0 ? 1 : (required.size - missedFindings.length) / required.size;
    const penalty = wrongFindings.reduce((acc, f) => acc + (distractors.has(f) ? 0.35 : 0.15), 0);
    findingScore = Math.max(0, hit - penalty);
  }
  fields.push({
    field: "findings",
    status: findingScore === 1 ? "correct" : findingScore > 0 ? "partial" : "incorrect",
    score: findingScore,
    weight: 2,
    expected: [...required].join(", ") || "none",
    given: [...given].join(", ") || "none",
  });

  const expectedDx = new Set<string>(key.diagnosis);
  const givenDx = new Set<string>(sub.diagnosis);
  const missedDiagnoses = [...expectedDx].filter((d) => !givenDx.has(d));
  const wrongDiagnoses = [...givenDx].filter((d) => !expectedDx.has(d));
  const dxHit = expectedDx.size === 0 ? 1 : (expectedDx.size - missedDiagnoses.length) / expectedDx.size;
  const dxScore = Math.max(0, dxHit - wrongDiagnoses.length * 0.25);
  fields.push({
    field: "diagnosis",
    status: dxScore === 1 ? "correct" : dxScore > 0 ? "partial" : "incorrect",
    score: dxScore,
    weight: 3,
    expected: [...expectedDx].join(", "),
    given: [...givenDx].join(", ") || "—",
  });

  const scored = fields.filter((f) => f.status !== "not-scored");
  const totalWeight = scored.reduce((a, f) => a + f.weight, 0);
  const score = totalWeight ? scored.reduce((a, f) => a + f.score * f.weight, 0) / totalWeight : 0;
  return { fields, score, missedFindings, wrongFindings, missedDiagnoses, wrongDiagnoses };
}

export interface QuestionResult {
  questionId: string;
  competency: CompetencyId;
  /** 0..1 — multiple-true questions get partial credit. */
  score: number;
  correct: boolean;
  selected: string[];
  correctOptionIds: string[];
}

export function scoreQuestion(q: Question, selected: string[]): QuestionResult {
  const correctIds = q.options.filter((o) => o.correct).map((o) => o.id);
  const sel = new Set(selected);
  if (q.kind === "single") {
    const correct = selected.length === 1 && correctIds.includes(selected[0]!);
    return { questionId: q.id, competency: q.competency, score: correct ? 1 : 0, correct, selected, correctOptionIds: correctIds };
  }
  // Multiple-true: +1 per correct option selected, −1 per incorrect selected, normalised by number of correct options.
  let raw = 0;
  for (const o of q.options) {
    if (sel.has(o.id)) raw += o.correct ? 1 : -1;
  }
  const score = Math.max(0, Math.min(1, raw / Math.max(correctIds.length, 1)));
  const correct = score === 1 && selected.length === correctIds.length;
  return { questionId: q.id, competency: q.competency, score, correct, selected, correctOptionIds: correctIds };
}
