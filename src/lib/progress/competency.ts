import { COMPETENCY_IDS } from "../content/competencies";
import type { CompetencyId } from "../content/types";
import type { ProgressState } from "./types";

export type MasteryLevel = "not-started" | "novice" | "developing" | "competent" | "proficient";

export interface CompetencyMastery {
  competency: CompetencyId;
  /** Recency-weighted mean score 0..1, or null if no evidence. */
  score: number | null;
  attempts: number;
  level: MasteryLevel;
  /** Most recent evidence date. */
  lastAt?: string;
}

const HALF_LIFE_DAYS = 45;

function recencyWeight(at: string, now: number): number {
  const ageDays = Math.max(0, (now - Date.parse(at)) / 86_400_000);
  return Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
}

export function masteryLevel(score: number | null, attempts: number): MasteryLevel {
  if (score === null || attempts === 0) return "not-started";
  if (attempts < 3) return "novice";
  if (score >= 0.85 && attempts >= 8) return "proficient";
  if (score >= 0.7) return "competent";
  return "developing";
}

export function computeMastery(progress: ProgressState, now = Date.now()): CompetencyMastery[] {
  const acc = new Map<CompetencyId, { wsum: number; w: number; n: number; lastAt?: string }>();
  const add = (c: CompetencyId, score: number, at: string) => {
    const e = acc.get(c) ?? { wsum: 0, w: 0, n: 0 };
    const w = recencyWeight(at, now);
    e.wsum += score * w;
    e.w += w;
    e.n += 1;
    if (!e.lastAt || at > e.lastAt) e.lastAt = at;
    acc.set(c, e);
  };
  for (const a of progress.questionAttempts) add(a.competency, a.score, a.at);
  for (const a of progress.interpretationAttempts) for (const c of a.competencies) add(c, a.score, a.at);
  return COMPETENCY_IDS.map((competency) => {
    const e = acc.get(competency);
    const score = e && e.w > 0 ? e.wsum / e.w : null;
    return { competency, score, attempts: e?.n ?? 0, level: masteryLevel(score, e?.n ?? 0), lastAt: e?.lastAt };
  });
}

/** Overall curriculum completion as a fraction of lessons. */
export function lessonCompletion(progress: ProgressState, lessonIds: string[]): number {
  if (lessonIds.length === 0) return 0;
  const done = lessonIds.filter((id) => progress.lessonsCompleted[id]).length;
  return done / lessonIds.length;
}
