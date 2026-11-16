import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { CURRICULUM, getModule } from "@/lib/content/curriculum";
import { COMPETENCIES } from "@/lib/content/competencies";
import { LEVEL_AUDIENCE } from "@/lib/content/types";
import { Badge, buttonClasses, Card, LevelBadge, PageHeader, SectionTitle } from "@/components/ui";
import { ReviewBadge } from "@/components/layout/ReviewBadge";
import { LessonDoneMark } from "@/components/learning/LessonProgressControls";

export function generateStaticParams() {
  return CURRICULUM.map((m) => ({ moduleSlug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; moduleSlug: string }> }) {
  const { locale, moduleSlug } = await params;
  const m = getModule(moduleSlug);
  return { title: m?.title[locale] };
}

export default async function ModulePage({ params }: { params: Promise<{ locale: Locale; moduleSlug: string }> }) {
  const { locale, moduleSlug } = await params;
  setRequestLocale(locale);
  const m = getModule(moduleSlug);
  if (!m) notFound();
  const t = await getTranslations("curriculum");
  const tApp = await getTranslations("app");
  return (
    <div>
      <p className="mb-2 text-sm"><Link href="/curriculum" className="text-fg-subtle hover:underline">{t("title")}</Link></p>
      <PageHeader title={m.title[locale]} intro={m.description[locale]} aside={<LevelBadge level={m.level} locale={locale} />} />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <ol className="flex flex-col gap-3">
          {m.lessons.map((l, i) => (
            <Card key={l.id} as="li" className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-xs text-fg-subtle">{t("lessons", { n: i + 1 }).replace(/\D+$/, "")} {i + 1}</p>
                  <h2 className="mt-0.5 text-lg font-semibold"><Link href={`/curriculum/${m.slug}/${l.slug}`} className="hover:underline">{l.title[locale]}</Link></h2>
                  <p className="mt-1 text-sm text-fg-muted">{l.summary[locale]}</p>
                </div>
                <LessonDoneMark lessonId={l.id} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-fg-subtle">
                <span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden="true" />{tApp("minutes", { n: l.estimatedMinutes })}</span>
                {l.competencies.map((c) => <Badge key={c}>{COMPETENCIES[c].title[locale]}</Badge>)}
              </div>
              <Link href={`/curriculum/${m.slug}/${l.slug}`} className={buttonClasses({ variant: "secondary", size: "sm", className: "mt-4" })}>{t("startLesson")}<ArrowRight size={14} aria-hidden="true" /></Link>
            </Card>
          ))}
        </ol>
        <aside className="flex flex-col gap-4">
          <Card className="p-5">
            <SectionTitle>{t("audience")}</SectionTitle>
            <p className="mt-2 text-sm">{LEVEL_AUDIENCE[m.level][locale]}</p>
          </Card>
          <Card className="p-5">
            <SectionTitle>{t("practice")}</SectionTitle>
            <div className="mt-3 flex flex-col gap-2">
              <Link href={`/assessments/${m.slug}-practice`} className={buttonClasses({ variant: "secondary", size: "sm" })}>{t("practice")}</Link>
              {m.summativeTestSlug && <Link href={`/assessments/${m.summativeTestSlug}`} className={buttonClasses({ size: "sm" })}>{t("summativeTest")}</Link>}
            </div>
          </Card>
          <Card className="p-5">
            <SectionTitle>{t("reviewStatus")}</SectionTitle>
            <div className="mt-3"><ReviewBadge review={m.review} /></div>
            {m.review.references?.length ? (
              <>
                <SectionTitle className="mt-4">{t("references")}</SectionTitle>
                <ul className="mt-2 space-y-1 text-xs text-fg-muted">{m.review.references.map((r) => <li key={r}>{r}</li>)}</ul>
              </>
            ) : null}
          </Card>
        </aside>
      </div>
    </div>
  );
}
