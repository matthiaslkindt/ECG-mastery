"use client";

import { useLocale, useTranslations } from "next-intl";
import { AlertTriangle, Lightbulb, Sparkles, Stethoscope } from "lucide-react";
import type { Lesson, LessonBlock } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/localized";
import { cn } from "@/components/ui";
import { EcgFigure } from "@/components/ecg/EcgFigure";
import { QuestionBlock } from "./QuestionBlock";
import { useProgress } from "@/lib/progress/store";

const CALLOUT = {
  key: { icon: Sparkles, cls: "border-accent/40 bg-accent-soft", iconCls: "text-accent" },
  pitfall: { icon: AlertTriangle, cls: "border-danger/40 bg-danger-soft", iconCls: "text-danger" },
  pearl: { icon: Lightbulb, cls: "border-warning/40 bg-warning-soft", iconCls: "text-warning" },
  clinical: { icon: Stethoscope, cls: "border-success/40 bg-success-soft", iconCls: "text-success" },
} as const;

export function LessonBlocks({ lesson }: { lesson: Lesson }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("lesson");
  const recordQuestion = useProgress((s) => s.recordQuestion);

  return (
    <div className="flex flex-col gap-6">
      {lesson.blocks.map((b, i) => (
        <Block key={i} block={b} locale={locale} t={t} onAnswered={(r) => recordQuestion({ questionId: r.questionId, competency: r.competency, score: r.score, context: { kind: "lesson", id: lesson.id } })} />
      ))}
    </div>
  );
}

function Block({ block, locale, t, onAnswered }: { block: LessonBlock; locale: Locale; t: ReturnType<typeof useTranslations<"lesson">>; onAnswered: Parameters<typeof QuestionBlock>[0]["onAnswered"] }) {
  switch (block.type) {
    case "heading":
      return <h2 className="mt-2 text-xl font-semibold tracking-tight">{block.text[locale]}</h2>;
    case "paragraph":
      return <p className="prose-ecg text-fg">{block.text[locale]}</p>;
    case "list":
      return block.ordered ? (
        <ol className="prose-ecg list-decimal space-y-1.5 pl-6 marker:text-fg-subtle">{block.items.map((it, i) => <li key={i}>{it[locale]}</li>)}</ol>
      ) : (
        <ul className="prose-ecg list-disc space-y-1.5 pl-6 marker:text-fg-subtle">{block.items.map((it, i) => <li key={i}>{it[locale]}</li>)}</ul>
      );
    case "callout": {
      const c = CALLOUT[block.tone];
      const Icon = c.icon;
      return (
        <aside className={cn("flex gap-3 rounded-lg border p-4", c.cls)}>
          <Icon size={18} className={cn("mt-0.5 shrink-0", c.iconCls)} aria-hidden="true" />
          <div className="text-sm leading-relaxed">
            <p className="font-semibold">{block.title?.[locale] ?? t(`callout.${block.tone}`)}</p>
            <p className="mt-1 text-fg">{block.text[locale]}</p>
          </div>
        </aside>
      );
    }
    case "table":
      return (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            {block.caption && <caption className="bg-bg-muted px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-fg-subtle">{block.caption[locale]}</caption>}
            <thead className="bg-bg-muted/60 text-left text-xs uppercase tracking-wide text-fg-muted">
              <tr>{block.header.map((h, i) => <th key={i} scope="col" className="px-3 py-2 font-semibold">{h[locale]}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className="border-t border-border align-top">
                  {row.map((cell, ci) => <td key={ci} className={cn("px-3 py-2", ci === 0 && "font-medium")}>{cell[locale]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "ecg":
      return <EcgFigure ecgId={block.ecgId} caption={block.caption[locale]} layout={block.layout} focusLeads={block.focusLeads} annotations={block.annotations} />;
    case "check":
      return <QuestionBlock question={block.question} onAnswered={onAnswered} />;
  }
}
