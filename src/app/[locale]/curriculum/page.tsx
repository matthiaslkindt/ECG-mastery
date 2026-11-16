import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { CURRICULUM } from "@/lib/content/curriculum";
import { COMPETENCIES } from "@/lib/content/competencies";
import { Badge, Card, LevelBadge, PageHeader } from "@/components/ui";
import { ReviewBadge } from "@/components/layout/ReviewBadge";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "curriculum" });
  return { title: t("title") };
}

export default async function CurriculumPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("curriculum");
  return (
    <div>
      <PageHeader title={t("title")} intro={t("intro")} />
      <ol className="grid gap-4 md:grid-cols-2">
        {CURRICULUM.map((m) => (
          <Card key={m.id} as="li" className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-xs text-fg-subtle">{String(m.order).padStart(2, "0")}</span>
              <LevelBadge level={m.level} locale={locale} />
            </div>
            <h2 className="mt-2 text-lg font-semibold"><Link href={`/curriculum/${m.slug}`} className="hover:underline">{m.title[locale]}</Link></h2>
            <p className="mt-1 text-sm text-fg-muted">{m.description[locale]}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {m.competencies.map((c) => <Badge key={c}>{COMPETENCIES[c].title[locale]}</Badge>)}
            </div>
            <div className="mt-auto flex items-center justify-between pt-4 text-xs text-fg-subtle">
              <span>{t("lessons", { n: m.lessons.length })}</span>
              <ReviewBadge review={m.review} compact />
            </div>
          </Card>
        ))}
      </ol>
    </div>
  );
}
