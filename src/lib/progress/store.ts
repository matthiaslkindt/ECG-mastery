"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CompetencyId } from "../content/types";
import { EMPTY_PROGRESS, type AssessmentResult, type InterpretationAttempt, type ProgressState, type QuestionAttempt } from "./types";

const newId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

interface ProgressActions {
  completeLesson: (lessonId: string) => void;
  completeCase: (caseId: string) => void;
  recordQuestion: (a: { questionId: string; competency: CompetencyId; score: number; context: QuestionAttempt["context"] }) => void;
  recordInterpretation: (a: { ecgId: string; competencies: CompetencyId[]; score: number; context: InterpretationAttempt["context"] }) => void;
  recordAssessment: (a: Omit<AssessmentResult, "id" | "at">) => void;
  reset: () => void;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
}

export type ProgressStore = ProgressState & ProgressActions;

/**
 * Client-side progress store persisted to localStorage. The ProgressRepository interface in
 * ./types.ts is the seam for a server-backed implementation (see docs/ARCHITECTURE.md).
 */
export const useProgress = create<ProgressStore>()(
  persist(
    (set) => ({
      ...EMPTY_PROGRESS,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      completeLesson: (lessonId) => set((s) => ({ lessonsCompleted: { ...s.lessonsCompleted, [lessonId]: s.lessonsCompleted[lessonId] ?? new Date().toISOString() } })),
      completeCase: (caseId) => set((s) => ({ casesCompleted: { ...s.casesCompleted, [caseId]: new Date().toISOString() } })),
      recordQuestion: (a) => set((s) => ({ questionAttempts: [...s.questionAttempts, { id: newId(), at: new Date().toISOString(), ...a }].slice(-2000) })),
      recordInterpretation: (a) => set((s) => ({ interpretationAttempts: [...s.interpretationAttempts, { id: newId(), at: new Date().toISOString(), ...a }].slice(-1000) })),
      recordAssessment: (a) => set((s) => ({ assessmentResults: [...s.assessmentResults, { id: newId(), at: new Date().toISOString(), ...a }] })),
      reset: () => set({ ...EMPTY_PROGRESS }),
    }),
    {
      name: "ecg-mastery-progress",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        version: s.version,
        lessonsCompleted: s.lessonsCompleted,
        casesCompleted: s.casesCompleted,
        questionAttempts: s.questionAttempts,
        interpretationAttempts: s.interpretationAttempts,
        assessmentResults: s.assessmentResults,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
