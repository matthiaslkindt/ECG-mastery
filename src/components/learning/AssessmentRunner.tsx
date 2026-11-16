"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Assessment, Question } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/localized";
import { scoreQuestion, type QuestionResult } from "@/lib/learning/scoring";
import { useProgress } from "@/lib/progress/store";
import { Button, Card, cn, ProgressBar } from "@/components/ui";
import { EcgFigure } from "@/components/ecg/EcgFigure";
import { QuestionBlock } from "./QuestionBlock";

/**
 * Summative mode: all questions answered first, scored together, then reviewed.
 * Formative mode: immediate feedback per question (delegates to QuestionBlock).
 */
export function AssessmentRunner({ assessment }: { assessment: Assessment }) {
  const t = useTranslations("assess");
  const locale = useLocale() as Locale;
  const { recordQuestion, recordAssessment } = useProgress();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [results, setResults] = useState<QuestionResult[] | null>(null);
  const [attempt, setAttempt] = useState(0);
  const started = useRef(Date.now());

  useEffect(() => { started.current = Date.now(); }, [attempt]);

  const unanswered = assessment.questions.filter((q) => !(answers[q.id]?.length)).length;
  const score = useMemo(() => (results ? results.reduce((a, r) => a + r.score, 0) / Math.max(results.length, 1) : null), [results]);

  if (assessment.kind === "formative") {
    return (
      <div className="flex flex-col gap-5" key={attempt}>
        {assessment.questions.map((q, i) => (
          <div key={q.id}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">{t("question", { n: i + 1, total: assessment.questions.length })}</p>
            <QuestionBlock question={q} compact onAnswered={(r) => recordQuestion({ questionId: r.questionId, competency: r.competency, score: r.score, context: { kind: "assessment", id: assessment.id } })} />
          </div>
        ))}
        <div><Button variant="secondary" onClick={() => setAttempt((a) => a + 1)}>{t("retake")}</Button></div>
      </div>
    );
  }

  const submit = () => {
    const rs = assessment.questions.map((q) => scoreQuestion(q, answers[q.id] ?? []));
    setResults(rs);
    for (const r of rs) recordQuestion({ questionId: r.questionId, competency: r.competency, score: r.score, context: { kind: "assessment", id: assessment.id } });
    const s = rs.reduce((a, r) => a + r.score, 0) / Math.max(rs.length, 1);
    recordAssessment({ assessmentSlug: assessment.slug, score: s, passed: assessment.passMark !== undefined ? s >= assessment.passMark : null, durationSec: Math.round((Date.now() - started.current) / 1000) });
  };
  const retake = () => { setAnswers({}); setResults(null); setAttempt((a) => a + 1); };

  return (
    <div className="flex flex-col gap-5">
      {results && score !== null && (
        <Card className={cn("p-5", assessment.passMark !== undefined && (score >= assessment.passMark ? "border-success" : "border-danger"))} aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{t("result")}</p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="tabular text-3xl font-semibold">{t("score", { pct: Math.round(score * 100) })}</span>
            {assessment.passMark !== undefined && (
              <span className={cn("text-sm font-semibold", score >= assessment.passMark ? "text-success" : "text-danger")}>{score >= assessment.passMark ? t("passed") : t("failed")}</span>
            )}
          </div>
          <ProgressBar value={score} className="mt-3" />
          <div className="mt-4"><Button variant="secondary" onClick={retake}>{t("retake")}</Button></div>
        </Card>
      )}

      {assessment.questions.map((q, i) => (
        <SummativeQuestion key={`${q.id}-${attempt}`} index={i} total={assessment.questions.length} q={q} locale={locale} selected={answers[q.id] ?? []} result={results?.[i] ?? null}
          onChange={(sel) => setAnswers((a) => ({ ...a, [q.id]: sel }))} />
      ))}

      {!results && (
        <div className="flex items-center gap-4">
          <Button onClick={submit} disabled={unanswered > 0}>{t("submit")}</Button>
          {unanswered > 0 && <span className="text-sm text-fg-subtle">{t("unanswered", { n: unanswered })}</span>}
        </div>
      )}
    </div>
  );
}

function SummativeQuestion({ q, index, total, locale, selected, onChange, result }: { q: Question; index: number; total: number; locale: Locale; selected: string[]; onChange: (s: string[]) => void; result: QuestionResult | null }) {
  const t = useTranslations("assess");
  const tl = useTranslations("lesson");
  const toggle = (id: string) => onChange(q.kind === "single" ? [id] : selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  return (
    <Card as="section" className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{t("question", { n: index + 1, total })}</p>
      <p className="mt-1 font-medium">{q.stem[locale]}</p>
      <p className="mt-1 text-xs text-fg-subtle">{q.kind === "single" ? tl("selectOne") : tl("selectMany")}</p>
      {q.ecgId && <EcgFigure ecgId={q.ecgId} className="mt-4" layout="3x4+rhythm" linkToLibrary={!!result} />}
      <div className="mt-4 flex flex-col gap-2" role={q.kind === "single" ? "radiogroup" : "group"}>
        {q.options.map((o) => {
          const on = selected.includes(o.id);
          return (
            <button key={o.id} type="button" role={q.kind === "single" ? "radio" : "checkbox"} aria-checked={on} disabled={!!result} onClick={() => toggle(o.id)}
              className={cn("rounded-md border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default",
                !result && (on ? "border-accent bg-accent-soft" : "border-border hover:bg-bg-muted"),
                result && o.correct && "border-success bg-success-soft",
                result && !o.correct && on && "border-danger bg-danger-soft",
                result && !o.correct && !on && "border-border opacity-70")}>
              {o.text[locale]}
              {result && o.rationale && <span className="mt-1 block text-xs text-fg-muted">{o.rationale[locale]}</span>}
            </button>
          );
        })}
      </div>
      {result && (
        <div className={cn("mt-4 rounded-md border p-3 text-sm", result.correct ? "border-success bg-success-soft" : result.score > 0 ? "border-warning bg-warning-soft" : "border-danger bg-danger-soft")}>
          <p className="font-semibold">{result.correct ? tl("correct") : result.score > 0 ? tl("partial") : tl("incorrect")}</p>
          <p className="mt-1 text-fg-muted">{q.explanation[locale]}</p>
        </div>
      )}
    </Card>
  );
}
