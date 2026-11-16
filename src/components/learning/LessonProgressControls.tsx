"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useProgress } from "@/lib/progress/store";

export function LessonCompleteButton({ lessonId }: { lessonId: string }) {
  const t = useTranslations("curriculum");
  const done = useProgress((s) => !!s.lessonsCompleted[lessonId]);
  const complete = useProgress((s) => s.completeLesson);
  return done ? (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 size={18} aria-hidden="true" />{t("markedComplete")}</span>
  ) : (
    <Button variant="secondary" onClick={() => complete(lessonId)}>{t("markComplete")}</Button>
  );
}

export function LessonDoneMark({ lessonId }: { lessonId: string }) {
  const done = useProgress((s) => !!s.lessonsCompleted[lessonId]);
  const t = useTranslations("curriculum");
  if (!done) return null;
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 size={14} aria-hidden="true" />{t("completed")}</span>;
}
