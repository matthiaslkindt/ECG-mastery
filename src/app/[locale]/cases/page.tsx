import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { CASES } from "@/lib/content/cases";
import { COMPETENCIES } from "@/lib/content/competencies";
import { Badge, buttonClasses, Card, LevelBadge, PageHeader } from "@/components/ui";
import { CaseDoneMark } from "@/components/learning/CaseDoneMark";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cases" });
  return { title: t("title") };
}

export default async function CasesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  const tApp = await getTranslations("app");
  return (
    <div>
      <PageHeader title={t("title")} intro={t("intro")} />
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CASES.map((c) => (
          <Card key={c.id} as="li" className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <LevelBadge level={c.level} locale={locale} />
              <CaseDoneMark caseId={c.id} />
            </div>
            <h2 className="mt-3 text-lg font-semibold">{c.title[locale]}</h2>
            <p className="mt-1 text-sm text-fg-muted">{c.teaser[locale]}</p>
            <div className="mt-3 flex flex-wrap gap-1">{c.competencies.map((k) => <Badge key={k}>{COMPETENCIES[k].title[locale]}</Badge>)}</div>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="inline-flex items-center gap-1 text-xs text-fg-subtle"><Clock size={12} aria-hidden="true" />{tApp("minutes", { n: c.estimatedMinutes })}</span>
              <Link href={`/cases/${c.slug}`} className={buttonClasses({ size: "sm" })}>{t("start")}</Link>
            </div>
          </Card>
        ))}
      </ul>
    </div>
  );
}
