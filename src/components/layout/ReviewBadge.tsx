import { useTranslations } from "next-intl";
import type { ContentReview } from "@/lib/content/types";
import { Badge } from "@/components/ui";

const TONE = { draft: "neutral", "in-review": "warning", approved: "success", "needs-revision": "danger" } as const;

/** Shows the independent medical and translation review states for a content item. */
export function ReviewBadge({ review, compact }: { review: ContentReview; compact?: boolean }) {
  const t = useTranslations("review");
  return (
    <div className="flex flex-wrap items-center gap-1.5" title={`${t("medical")}: ${t(`status.${review.medical.status}`)} · ${t("translation")}: ${t(`status.${review.translationNl.status}`)}`}>
      <Badge tone={TONE[review.medical.status]}>{compact ? "MD" : t("medical")}: {t(`status.${review.medical.status}`)}</Badge>
      <Badge tone={TONE[review.translationNl.status]}>{compact ? "NL" : t("translation")}: {t(`status.${review.translationNl.status}`)}</Badge>
    </div>
  );
}
