"use client";

import { useTranslations, useLocale } from "next-intl";
import { ALL_LESSONS } from "@/lib/content/curriculum";
import { useProgress } from "@/lib/progress/store";
import { ProgressBar } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";

export function HomeProgress() {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;
  const hydrated = useProgress((s) => s.hydrated);
  const completed = useProgress((s) => s.lessonsCompleted);
  if (!hydrated) return null;
  const done = ALL_LESSONS.filter(({ lesson }) => completed[lesson.id]).length;
  if (done === 0) return null;
  const next = ALL_LESSONS.find(({ lesson }) => !completed[lesson.id]);
  return (
    <div className="mt-8 max-w-md rounded-lg border border-border bg-bg-elevated p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">{t("yourProgress")}</p>
      <p className="mt-1 text-sm">{t("lessonsDone", { done, total: ALL_LESSONS.length })}</p>
      <ProgressBar value={done / ALL_LESSONS.length} className="mt-2" />
      {next && (
        <Link href={`/curriculum/${next.module.slug}/${next.lesson.slug}`} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
          {t("continue")}: {next.lesson.title[locale]} →
        </Link>
      )}
    </div>
  );
}
