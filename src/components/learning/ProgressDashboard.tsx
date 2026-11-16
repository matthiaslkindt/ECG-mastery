"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { COMPETENCIES, COMPETENCY_IDS } from "@/lib/content/competencies";
import { CURRICULUM, ALL_LESSONS } from "@/lib/content/curriculum";
import { CASES } from "@/lib/content/cases";
import { ASSESSMENTS } from "@/lib/content/assessments";
import type { Locale } from "@/lib/i18n/localized";
import { computeMastery, type MasteryLevel } from "@/lib/progress/competency";
import { useProgress } from "@/lib/progress/store";
import { Badge, Button, Card, cn, ProgressBar, SectionTitle } from "@/components/ui";
import { Link } from "@/i18n/navigation";

const LEVEL_TONE: Record<MasteryLevel, "neutral" | "info" | "warning" | "success" | "accent"> = { "not-started": "neutral", novice: "info", developing: "warning", competent: "success", proficient: "accent" };

export function ProgressDashboard() {
  const t = useTranslations("progress");
  const tc = useTranslations("curriculum");
  const ta = useTranslations("assess");
  const locale = useLocale() as Locale;
  const progress = useProgress();
  const mastery = useMemo(() => computeMastery(progress), [progress]);

  const lessonsDone = ALL_LESSONS.filter(({ lesson }) => progress.lessonsCompleted[lesson.id]).length;
  const casesDone = CASES.filter((c) => progress.casesCompleted[c.id]).length;

  // Recommend the first lesson of the weakest competency with content.
  const weakest = [...mastery].sort((a, b) => (a.score ?? -1) - (b.score ?? -1))[0];
  const recommended = weakest ? ALL_LESSONS.find(({ lesson }) => lesson.competencies.includes(weakest.competency) && !progress.lessonsCompleted[lesson.id]) : undefined;

  const summative = ASSESSMENTS.filter((a) => a.kind === "summative");

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-6">
        <Card className="p-5">
          <SectionTitle>{t("competencies")}</SectionTitle>
          <ul className="mt-3 divide-y divide-border">
            {COMPETENCY_IDS.map((id) => {
              const m = mastery.find((x) => x.competency === id)!;
              return (
                <li key={id} className="grid grid-cols-[1fr_auto] items-center gap-3 py-3 md:grid-cols-[220px_1fr_120px_90px]">
                  <div>
                    <p className="text-sm font-medium">{COMPETENCIES[id].title[locale]}</p>
                    <p className="text-xs text-fg-subtle md:hidden">{t("attempts", { n: m.attempts })}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1"><ProgressBar value={m.score ?? 0} label={COMPETENCIES[id].title[locale]} /></div>
                  <span className="hidden text-xs text-fg-subtle md:block">{m.score === null ? t("noData") : `${Math.round(m.score * 100)}% · ${t("attempts", { n: m.attempts })}`}</span>
                  <Badge tone={LEVEL_TONE[m.level]} className="justify-self-end">{t(`level.${m.level}`)}</Badge>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-5">
          <SectionTitle>{t("assessments")}</SectionTitle>
          <ul className="mt-3 divide-y divide-border">
            {summative.map((a) => {
              const best = progress.assessmentResults.filter((r) => r.assessmentSlug === a.slug).sort((x, y) => y.score - x.score)[0];
              return (
                <li key={a.slug} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <Link href={`/assessments/${a.slug}`} className="font-medium hover:underline">{a.title[locale]}</Link>
                  {best ? (
                    <span className={cn("tabular font-semibold", best.passed ? "text-success" : "text-danger")}>{ta("bestAttempt")}: {Math.round(best.score * 100)}%</span>
                  ) : (
                    <span className="text-fg-subtle">{ta("noAttempt")}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="p-5">
          <SectionTitle>{t("lessons")}</SectionTitle>
          <p className="tabular mt-2 text-2xl font-semibold">{lessonsDone} <span className="text-base font-normal text-fg-subtle">/ {ALL_LESSONS.length}</span></p>
          <ProgressBar value={lessonsDone / ALL_LESSONS.length} className="mt-2" />
          <ul className="mt-4 space-y-2 text-sm">
            {CURRICULUM.map((m) => {
              const done = m.lessons.filter((l) => progress.lessonsCompleted[l.id]).length;
              return (
                <li key={m.id} className="flex items-center justify-between gap-2">
                  <Link href={`/curriculum/${m.slug}`} className="truncate hover:underline">{m.title[locale]}</Link>
                  <span className="tabular shrink-0 text-xs text-fg-subtle">{done}/{m.lessons.length}</span>
                </li>
              );
            })}
          </ul>
        </Card>
        <Card className="p-5">
          <SectionTitle>{t("cases")}</SectionTitle>
          <p className="tabular mt-2 text-2xl font-semibold">{casesDone} <span className="text-base font-normal text-fg-subtle">/ {CASES.length}</span></p>
          <ProgressBar value={casesDone / Math.max(CASES.length, 1)} className="mt-2" />
        </Card>
        {recommended && (
          <Card className="p-5">
            <SectionTitle>{t("recommended")}</SectionTitle>
            <p className="mt-2 text-sm text-fg-muted">{COMPETENCIES[recommended.lesson.competencies[0]!].title[locale]}</p>
            <Link href={`/curriculum/${recommended.module.slug}/${recommended.lesson.slug}`} className="mt-1 block font-medium text-accent hover:underline">{recommended.lesson.title[locale]}</Link>
            <p className="mt-1 text-xs text-fg-subtle">{tc("lessons", { n: recommended.module.lessons.length })} · {recommended.module.title[locale]}</p>
          </Card>
        )}
        <div className="text-xs text-fg-subtle">
          <p>{t("storedLocally")}</p>
          <Button variant="ghost" size="sm" className="mt-2 text-danger" onClick={() => { if (confirm(t("resetConfirm"))) progress.reset(); }}>{t("reset")}</Button>
        </div>
      </div>
    </div>
  );
}
