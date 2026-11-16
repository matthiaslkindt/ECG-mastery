"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { ClinicalCase } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/localized";
import { useProgress } from "@/lib/progress/store";
import { Button, Card, ProgressBar, SectionTitle } from "@/components/ui";
import { EcgFigure } from "@/components/ecg/EcgFigure";
import { InterpretationForm } from "./InterpretationForm";
import { QuestionBlock } from "./QuestionBlock";
import { Link } from "@/i18n/navigation";

export function CaseRunner({ c }: { c: ClinicalCase }) {
  const t = useTranslations("cases");
  const locale = useLocale() as Locale;
  const [step, setStep] = useState(0);
  const [interpScore, setInterpScore] = useState<number | null>(null);
  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const { recordInterpretation, recordQuestion, completeCase } = useProgress();
  const total = c.steps.length;
  const current = c.steps[step]!;
  const last = step === total - 1;

  const canAdvance = current.kind === "interpret" ? interpScore !== null : current.kind === "question" ? !!answered[current.id] : true;

  const finish = () => completeCase(c.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-5">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-fg-subtle">
            <span>{t("step", { n: step + 1, total })}</span>
            <span>{current.title[locale]}</span>
          </div>
          <ProgressBar value={(step + 1) / total} />
        </div>

        {(current.kind === "interpret" || current.kind === "history") && <EcgFigure ecgId={current.ecgId ?? c.ecgId} layout="3x4+rhythm" linkToLibrary={false} />}

        {current.kind === "history" && (
          <Card className="p-5">
            <h2 className="text-lg font-semibold">{current.title[locale]}</h2>
            {current.body && <p className="mt-2 text-sm text-fg-muted">{current.body[locale]}</p>}
          </Card>
        )}

        {current.kind === "interpret" && (
          <InterpretationForm
            ecgKey={current.key ?? c.key}
            onSubmit={(r) => {
              setInterpScore(r.score);
              recordInterpretation({ ecgId: current.ecgId ?? c.ecgId, competencies: c.competencies, score: r.score, context: { kind: "case", id: c.id } });
            }}
            onRetry={() => setInterpScore(null)}
          />
        )}

        {current.kind === "question" && current.question && (
          <QuestionBlock
            question={current.question}
            showEcg={false}
            onAnswered={(r) => {
              setAnswered((a) => ({ ...a, [current.id]: true }));
              recordQuestion({ questionId: r.questionId, competency: r.competency, score: r.score, context: { kind: "case", id: c.id } });
            }}
          />
        )}

        {(current.kind === "reveal" || current.kind === "teaching") && (
          <Card className="p-5">
            <h2 className="text-lg font-semibold">{t("outcome")}</h2>
            {current.body && <p className="prose-ecg mt-2">{current.body[locale]}</p>}
            <SectionTitle className="mt-6">{t("teachingPoints")}</SectionTitle>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">
              {c.teachingPoints.map((p, i) => <li key={i}>{p[locale]}</li>)}
            </ul>
            {interpScore !== null && (
              <p className="mt-4 text-sm text-fg-muted">{t("yourScore")}: <span className="tabular font-semibold text-fg">{Math.round(interpScore * 100)}%</span></p>
            )}
          </Card>
        )}

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}><ArrowLeft size={16} aria-hidden="true" />{t("previous")}</Button>
          {!last ? (
            <Button onClick={() => setStep((s) => Math.min(total - 1, s + 1))} disabled={!canAdvance}>{t("next")}<ArrowRight size={16} aria-hidden="true" /></Button>
          ) : (
            <Link href="/cases" onClick={finish} className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-accent-fg hover:opacity-90"><CheckCircle2 size={16} aria-hidden="true" />{t("finish")}</Link>
          )}
        </div>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
        <Card className="p-5">
          <SectionTitle>{t("presentation")}</SectionTitle>
          <p className="mt-2 text-lg font-semibold">{t("ageSex", { age: c.presentation.age, sex: c.presentation.sex === "M" ? t("male") : t("female") })}</p>
          <dl className="mt-3 space-y-3 text-sm">
            <div><dt className="text-xs font-medium text-fg-subtle">{t("setting")}</dt><dd>{c.presentation.setting[locale]}</dd></div>
            <div><dt className="text-xs font-medium text-fg-subtle">{t("history")}</dt><dd>{c.presentation.history[locale]}</dd></div>
            {c.presentation.vitals && <div><dt className="text-xs font-medium text-fg-subtle">{t("vitals")}</dt><dd className="font-mono text-xs">{c.presentation.vitals[locale]}</dd></div>}
          </dl>
        </Card>
        <ol className="flex flex-col gap-1 text-sm">
          {c.steps.map((s, i) => (
            <li key={s.id} className={i === step ? "font-semibold text-accent" : i < step ? "text-fg-muted" : "text-fg-subtle"}>
              <span className="tabular mr-2 font-mono text-xs">{i + 1}</span>{s.title[locale]}
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
