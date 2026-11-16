"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { useProgress } from "@/lib/progress/store";

export function CaseDoneMark({ caseId }: { caseId: string }) {
  const done = useProgress((s) => !!s.casesCompleted[caseId]);
  const t = useTranslations("cases");
  if (!done) return null;
  return <span className="inline-flex items-center gap-1 text-xs font-medium text-success"><CheckCircle2 size={14} aria-hidden="true" />{t("completed")}</span>;
}
