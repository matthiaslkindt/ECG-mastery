import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { CASES, getCase } from "@/lib/content/cases";
import { LevelBadge, PageHeader } from "@/components/ui";
import { CaseRunner } from "@/components/learning/CaseRunner";

export function generateStaticParams() {
  return CASES.map((c) => ({ caseSlug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; caseSlug: string }> }) {
  const { locale, caseSlug } = await params;
  return { title: getCase(caseSlug)?.title[locale] };
}

export default async function CasePage({ params }: { params: Promise<{ locale: Locale; caseSlug: string }> }) {
  const { locale, caseSlug } = await params;
  setRequestLocale(locale);
  const c = getCase(caseSlug);
  if (!c) notFound();
  const t = await getTranslations("cases");
  return (
    <div>
      <p className="mb-2 text-sm"><Link href="/cases" className="text-fg-subtle hover:underline">{t("backToCases")}</Link></p>
      <PageHeader title={c.title[locale]} intro={c.teaser[locale]} aside={<LevelBadge level={c.level} locale={locale} />} />
      <CaseRunner c={c} />
    </div>
  );
}
