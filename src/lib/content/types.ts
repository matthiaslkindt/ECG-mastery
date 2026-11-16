/**
 * Content model for ECG Mastery.
 *
 * Design goals
 *  - Bilingual by construction: every learner-facing string is a `Localized` pair so the English
 *    and Dutch versions live next to each other and can be diffed/reviewed together.
 *  - Independent editorial review: each content item carries a `review` block with separate
 *    medical and translation sign-off, so a translation can be approved (or sent back) without
 *    touching the medical review and vice-versa. `scripts/check-content.ts` reports the status.
 *  - Competency-based: lessons, cases and questions are tagged with competencies and a level, so
 *    progress can be expressed as mastery per competency rather than "lessons viewed".
 */
import type { EcgAnnotation, LeadName } from "../ecg/types";
import type { Localized } from "../i18n/localized";

/* ---------------------------------- Review --------------------------------- */

export type ReviewStatus = "draft" | "in-review" | "approved" | "needs-revision";

export interface ReviewRecord {
  status: ReviewStatus;
  /** Name/role of the reviewer; never a learner-facing field. */
  reviewer?: string;
  /** ISO date. */
  date?: string;
  notes?: string;
}

export interface ContentReview {
  /** Medical accuracy review of the English source text. */
  medical: ReviewRecord;
  /** Independent review of the Dutch translation against the approved English source. */
  translationNl: ReviewRecord;
  /** Version of the English source the Dutch translation was made from. */
  sourceVersion: number;
  /** Literature references supporting the content (ESC/AHA guidelines, key papers). */
  references?: string[];
}

export const UNREVIEWED: ContentReview = {
  medical: { status: "draft" },
  translationNl: { status: "draft" },
  sourceVersion: 1,
};

/* ------------------------------- Competencies ------------------------------ */

export type CompetencyId =
  | "systematic-approach"
  | "rate-rhythm"
  | "axis"
  | "intervals"
  | "conduction-blocks"
  | "chamber-enlargement"
  | "acute-ischaemia"
  | "chronic-ischaemia"
  | "narrow-complex-tachycardia"
  | "wide-complex-tachycardia"
  | "bradyarrhythmia-pacing"
  | "inherited-arrhythmia"
  | "systemic-metabolic"
  | "clinical-integration";

/** Learner level the content is pitched at. Levels are cumulative. */
export type Level = 1 | 2 | 3 | 4;

export const LEVEL_LABELS: Record<Level, Localized> = {
  1: { en: "Foundation", nl: "Basis" },
  2: { en: "Core", nl: "Kern" },
  3: { en: "Advanced", nl: "Gevorderd" },
  4: { en: "Expert", nl: "Expert" },
};

export const LEVEL_AUDIENCE: Record<Level, Localized> = {
  1: { en: "Medical students and junior doctors", nl: "Geneeskundestudenten en basisartsen" },
  2: { en: "Internal medicine and emergency residents", nl: "AIOS interne geneeskunde en SEH" },
  3: { en: "Cardiology residents", nl: "AIOS cardiologie" },
  4: { en: "Cardiology fellows and practising cardiologists", nl: "Fellows en praktiserend cardiologen" },
};

export interface Competency {
  id: CompetencyId;
  title: Localized;
  description: Localized;
}

/* --------------------------------- Lessons --------------------------------- */

export type LessonBlock =
  | { type: "heading"; text: Localized }
  | { type: "paragraph"; text: Localized }
  | { type: "list"; ordered?: boolean; items: Localized[] }
  | { type: "callout"; tone: "key" | "pitfall" | "pearl" | "clinical"; title?: Localized; text: Localized }
  | { type: "table"; caption?: Localized; header: Localized[]; rows: Localized[][] }
  | {
      type: "ecg";
      ecgId: string;
      caption: Localized;
      layout?: "3x4" | "3x4+rhythm" | "6x2" | "single";
      focusLeads?: LeadName[];
      annotations?: EcgAnnotation[];
    }
  | { type: "check"; question: Question };

export interface LearningObjective {
  id: string;
  text: Localized;
  competency: CompetencyId;
}

export interface Lesson {
  id: string;
  slug: string;
  title: Localized;
  summary: Localized;
  level: Level;
  estimatedMinutes: number;
  competencies: CompetencyId[];
  objectives: LearningObjective[];
  blocks: LessonBlock[];
  review: ContentReview;
}

export interface Module {
  id: string;
  slug: string;
  order: number;
  title: Localized;
  description: Localized;
  level: Level;
  competencies: CompetencyId[];
  lessons: Lesson[];
  /** Summative test slug, if the module has one. */
  summativeTestSlug?: string;
  review: ContentReview;
}

/* -------------------------------- Questions -------------------------------- */

export interface Option {
  id: string;
  text: Localized;
  correct: boolean;
  /** Shown after answering, whether or not the option was chosen. */
  rationale?: Localized;
}

export interface Question {
  id: string;
  /** Single-best-answer or multiple-true. */
  kind: "single" | "multiple";
  stem: Localized;
  options: Option[];
  explanation: Localized;
  competency: CompetencyId;
  level: Level;
  /** Show this ECG with the question. */
  ecgId?: string;
  references?: string[];
}

/* ----------------------- Structured interpretation ------------------------ */

export type RhythmCategory =
  | "sinus-rhythm"
  | "sinus-bradycardia"
  | "sinus-tachycardia"
  | "sinus-arrhythmia"
  | "atrial-fibrillation"
  | "atrial-flutter"
  | "svt"
  | "ventricular-tachycardia"
  | "junctional"
  | "paced"
  | "av-block-2"
  | "av-block-3"
  | "ectopic-atrial";

export type AxisCategory = "normal" | "left" | "right" | "extreme";

/** Findings a learner can select in the morphology section. Keep ids stable: they are scored. */
export type FindingId =
  | "first-degree-avb"
  | "second-degree-avb-mobitz-1"
  | "second-degree-avb-mobitz-2"
  | "third-degree-avb"
  | "rbbb"
  | "incomplete-rbbb"
  | "lbbb"
  | "lafb"
  | "lpfb"
  | "nonspecific-ivcd"
  | "lvh"
  | "rvh"
  | "lae"
  | "rae"
  | "low-voltage"
  | "st-elevation-inferior"
  | "st-elevation-anterior"
  | "st-elevation-lateral"
  | "st-elevation-diffuse"
  | "st-depression"
  | "reciprocal-st-depression"
  | "t-inversion"
  | "hyperacute-t"
  | "peaked-t"
  | "pathological-q-inferior"
  | "pathological-q-anterior"
  | "pathological-q-lateral"
  | "poor-r-progression"
  | "prolonged-qt"
  | "short-pr"
  | "delta-wave"
  | "pvc"
  | "pac"
  | "pacing-spikes"
  | "brugada-pattern"
  | "u-wave"
  | "av-dissociation"
  | "av-block-2-1"
  | "flutter-waves"
  | "fibrillatory-baseline"
  | "retrograde-p";

export type DiagnosisId =
  | "normal-ecg"
  | "sinus-bradycardia"
  | "sinus-tachycardia"
  | "atrial-fibrillation"
  | "atrial-flutter"
  | "avnrt-avrt"
  | "monomorphic-vt"
  | "first-degree-avb"
  | "mobitz-1"
  | "mobitz-2"
  | "complete-heart-block"
  | "rbbb"
  | "lbbb"
  | "lafb"
  | "bifascicular-block"
  | "lvh"
  | "rvh"
  | "inferior-stemi"
  | "anterior-stemi"
  | "lateral-stemi"
  | "posterior-mi"
  | "old-inferior-mi"
  | "old-anterior-mi"
  | "subendocardial-ischaemia"
  | "wellens-syndrome"
  | "pericarditis"
  | "hyperkalaemia"
  | "hypokalaemia"
  | "long-qt"
  | "brugada-syndrome"
  | "wpw"
  | "paced-rhythm"
  | "pvcs"
  | "pacs"
  | "sinus-pause"
  | "low-voltage"
  | "nonspecific-st-t"
  | "atrial-tachycardia"
  | "sinus-arrhythmia"
  | "incomplete-rbbb"
  | "lae"
  | "bigeminy"
  | "inferolateral-stemi";

/** Numeric field with tolerance for scoring. */
export interface NumericKey {
  value: number;
  tolerance: number;
}

export interface InterpretationKey {
  rate?: NumericKey;
  rhythm: RhythmCategory;
  axis?: AxisCategory;
  pr?: NumericKey | null; // null = not measurable (e.g. AF)
  qrs?: NumericKey;
  qtc?: NumericKey;
  /** Findings that must be identified. */
  findings: FindingId[];
  /** Findings that are acceptable but not required. */
  optionalFindings?: FindingId[];
  /** Findings whose selection is penalised (classic distractors). */
  distractors?: FindingId[];
  diagnosis: DiagnosisId[];
  /** Immediate management priority — tested at level ≥ 2. */
  urgency: "routine" | "urgent" | "emergency";
}

export interface InterpretationSubmission {
  rate?: number;
  rhythm?: RhythmCategory;
  axis?: AxisCategory;
  pr?: number | null;
  qrs?: number;
  qtc?: number;
  findings: FindingId[];
  diagnosis: DiagnosisId[];
  urgency?: InterpretationKey["urgency"];
}

/* ---------------------------------- Cases ---------------------------------- */

export interface CaseStep {
  id: string;
  kind: "history" | "interpret" | "question" | "reveal" | "teaching";
  title: Localized;
  body?: Localized;
  question?: Question;
  /** For "interpret": which ECG and the scoring key. */
  ecgId?: string;
  key?: InterpretationKey;
}

export interface ClinicalCase {
  id: string;
  slug: string;
  title: Localized;
  /** Shown in the case list; should not give away the diagnosis. */
  teaser: Localized;
  level: Level;
  competencies: CompetencyId[];
  estimatedMinutes: number;
  presentation: {
    age: number;
    sex: "M" | "F";
    setting: Localized;
    history: Localized;
    vitals?: Localized;
  };
  ecgId: string;
  key: InterpretationKey;
  steps: CaseStep[];
  teachingPoints: Localized[];
  review: ContentReview;
}

/* ------------------------------- Assessments ------------------------------- */

export interface Assessment {
  id: string;
  slug: string;
  kind: "formative" | "summative";
  title: Localized;
  description: Localized;
  level: Level;
  moduleId?: string;
  competencies: CompetencyId[];
  /** Pass mark as a fraction (summative only). */
  passMark?: number;
  timeLimitMinutes?: number;
  questions: Question[];
  review: ContentReview;
}

/* -------------------------------- ECG library ------------------------------ */

export interface EcgLibraryEntry {
  id: string;
  title: Localized;
  description: Localized;
  /** Where the signal comes from. */
  source: { kind: "ptbxl"; file: string; ecgId: number } | { kind: "synthetic"; presetId: string; seed: number };
  /** Searchable clinical tags. */
  tags: DiagnosisId[];
  level: Level;
  competencies: CompetencyId[];
  key: InterpretationKey;
  teachingPoints: Localized[];
  annotations?: EcgAnnotation[];
  review: ContentReview;
}
