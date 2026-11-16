"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import type { Question } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/localized";
import { scoreQuestion, type QuestionResult } from "@/lib/learning/scoring";
import { Button, cn } from "@/components/ui";
import { EcgFigure } from "@/components/ecg/EcgFigure";

export function QuestionBlock({ question, onAnswered, showEcg = true, compact }: {
  question: Question;
  onAnswered?: (result: QuestionResult) => void;
  showEcg?: boolean;
  compact?: boolean;
}) {
  const t = useTranslations("lesson");
  const locale = useLocale() as Locale;
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<QuestionResult | null>(null);

  const toggle = (id: string) => {
    if (result) return;
    setSelected((s) => (question.kind === "single" ? [id] : s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };
  const submit = () => {
    const r = scoreQuestion(question, selected);
    setResult(r);
    onAnswered?.(r);
  };

  const tone = result ? (result.correct ? "success" : result.score > 0 ? "warning" : "danger") : null;

  return (
    <section className={cn("rounded-lg border border-border bg-bg-elevated", compact ? "p-4" : "p-5")} aria-labelledby={`${question.id}-stem`}>
      {!compact && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">{t("check")}</p>}
      <p id={`${question.id}-stem`} className="font-medium text-fg">{question.stem[locale]}</p>
      <p className="mt-1 text-xs text-fg-subtle">{question.kind === "single" ? t("selectOne") : t("selectMany")}</p>
      {showEcg && question.ecgId && <EcgFigure ecgId={question.ecgId} className="mt-4" layout="3x4+rhythm" />}
      <div className="mt-4 flex flex-col gap-2" role={question.kind === "single" ? "radiogroup" : "group"}>
        {question.options.map((o) => {
          const isSel = selected.includes(o.id);
          const reveal = !!result;
          return (
            <button
              key={o.id}
              type="button"
              role={question.kind === "single" ? "radio" : "checkbox"}
              aria-checked={isSel}
              disabled={reveal}
              onClick={() => toggle(o.id)}
              className={cn(
                "flex items-start gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors disabled:cursor-default",
                !reveal && (isSel ? "border-accent bg-accent-soft" : "border-border hover:bg-bg-muted"),
                reveal && o.correct && "border-success bg-success-soft",
                reveal && !o.correct && isSel && "border-danger bg-danger-soft",
                reveal && !o.correct && !isSel && "border-border opacity-70",
              )}
            >
              <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border", question.kind === "single" ? "rounded-full" : "rounded", isSel ? "border-accent bg-accent text-accent-fg" : "border-border-strong")}>
                {reveal && o.correct ? <Check size={12} /> : reveal && isSel ? <X size={12} /> : isSel ? <Check size={12} /> : null}
              </span>
              <span className="flex-1">
                <span>{o.text[locale]}</span>
                {reveal && o.rationale && <span className="mt-1 block text-xs text-fg-muted">{o.rationale[locale]}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {!result ? (
        <Button className="mt-4" size="sm" onClick={submit} disabled={selected.length === 0}>{t("submit")}</Button>
      ) : (
        <div className={cn("mt-4 rounded-md border p-3 text-sm", tone === "success" && "border-success bg-success-soft", tone === "warning" && "border-warning bg-warning-soft", tone === "danger" && "border-danger bg-danger-soft")}>
          <p className="font-semibold">{result.correct ? t("correct") : result.score > 0 ? t("partial") : t("incorrect")}</p>
          <p className="mt-1 text-fg-muted"><span className="font-medium text-fg">{t("explanation")}: </span>{question.explanation[locale]}</p>
        </div>
      )}
    </section>
  );
}
