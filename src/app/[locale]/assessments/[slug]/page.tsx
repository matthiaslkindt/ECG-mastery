import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { ASSESSMENTS, getAssessment } from "@/lib/content/assessments";
import { LevelBadge, PageHeader } from "@/components/ui";
import { AssessmentRunner } from "@/components/learning/AssessmentRunner";

export function generateStaticParams() {
  return ASSESSMENTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  return { title: getAssessment(slug)?.title[locale] };
}

export default async function AssessmentPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const a = getAssessment(slug);
  if (!a) notFound();
  const t = await getTranslations("assess");
  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-2 text-sm"><Link href="/assessments" className="text-fg-subtle hover:underline">{t("backToList")}</Link></p>
      <PageHeader title={a.title[locale]} intro={`${a.description[locale]} · ${t("questions", { n: a.questions.length })}${a.passMark !== undefined ? ` · ${t("passMark", { pct: Math.round(a.passMark * 100) })}` : ""}`} aside={<LevelBadge level={a.level} locale={locale} />} />
      <AssessmentRunner assessment={a} />
    </div>
  );
}
