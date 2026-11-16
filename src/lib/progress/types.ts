import type { CompetencyId } from "../content/types";

export interface QuestionAttempt {
  id: string;
  questionId: string;
  competency: CompetencyId;
  score: number; // 0..1
  context: { kind: "lesson" | "assessment" | "case"; id: string };
  at: string; // ISO
}

export interface InterpretationAttempt {
  id: string;
  ecgId: string;
  competencies: CompetencyId[];
  score: number; // 0..1
  context: { kind: "case" | "library"; id: string };
  at: string;
}

export interface AssessmentResult {
  id: string;
  assessmentSlug: string;
  score: number; // 0..1
  passed: boolean | null; // null for formative
  at: string;
  durationSec?: number;
}

export interface ProgressState {
  version: 1;
  lessonsCompleted: Record<string, string>; // lessonId → ISO date
  casesCompleted: Record<string, string>;
  questionAttempts: QuestionAttempt[];
  interpretationAttempts: InterpretationAttempt[];
  assessmentResults: AssessmentResult[];
}

export const EMPTY_PROGRESS: ProgressState = {
  version: 1,
  lessonsCompleted: {},
  casesCompleted: {},
  questionAttempts: [],
  interpretationAttempts: [],
  assessmentResults: [],
};

/**
 * Persistence boundary. The default implementation stores progress in the browser; a server
 * implementation (per-user, with authentication) can replace it without touching the UI.
 */
export interface ProgressRepository {
  load(): Promise<ProgressState | null>;
  save(state: ProgressState): Promise<void>;
  clear(): Promise<void>;
}
