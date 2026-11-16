import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { CURRICULUM, getLesson } from "@/lib/content/curriculum";
import { COMPETENCIES } from "@/lib/content/competencies";
import { Badge, buttonClasses, Card, LevelBadge, SectionTitle } from "@/components/ui";
import { ReviewBadge } from "@/components/layout/ReviewBadge";
import { LessonBlocks } from "@/components/learning/LessonBlocks";
import { LessonCompleteButton } from "@/components/learning/LessonProgressControls";

export function generateStaticParams() {
  return CURRICULUM.flatMap((m) => m.lessons.map((l) => ({ moduleSlug: m.slug, lessonSlug: l.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; moduleSlug: string; lessonSlug: string }> }) {
  const { locale, moduleSlug, lessonSlug } = await params;
  const r = getLesson(moduleSlug, lessonSlug);
  return { title: r?.lesson.title[locale] };
}

export default async function LessonPage({ params }: { params: Promise<{ locale: Locale; moduleSlug: string; lessonSlug: string }> }) {
  const { locale, moduleSlug, lessonSlug } = await params;
  setRequestLocale(locale);
  const r = getLesson(moduleSlug, lessonSlug);
  if (!r) notFound();
  const { module: m, lesson, index } = r;
  const t = await getTranslations("curriculum");
  const tApp = await getTranslations("app");
  const prev = m.lessons[index - 1];
  const next = m.lessons[index + 1];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
      <article>
        <p className="mb-2 text-sm text-fg-subtle"><Link href="/curriculum" className="hover:underline">{t("title")}</Link> / <Link href={`/curriculum/${m.slug}`} className="hover:underline">{m.title[locale]}</Link></p>
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
            <LevelBadge level={lesson.level} locale={locale} />
            <span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden="true" />{tApp("minutes", { n: lesson.estimatedMinutes })}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{lesson.title[locale]}</h1>
          <p className="mt-2 text-lg text-fg-muted">{lesson.summary[locale]}</p>
        </header>

        <Card className="mb-8 p-5">
          <SectionTitle>{t("objectives")}</SectionTitle>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm">
            {lesson.objectives.map((o) => (
              <li key={o.id}>{o.text[locale]} <Badge className="ml-1 align-middle">{COMPETENCIES[o.competency].title[locale]}</Badge></li>
            ))}
          </ol>
        </Card>

        <LessonBlocks lesson={lesson} />

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6">
          <LessonCompleteButton lessonId={lesson.id} />
          <nav className="flex items-center justify-between" aria-label="Lesson navigation">
            {prev ? (
              <Link href={`/curriculum/${m.slug}/${prev.slug}`} className={buttonClasses({ variant: "ghost", size: "sm" })}><ArrowLeft size={14} aria-hidden="true" />{t("previousLesson")}</Link>
            ) : <span />}
            {next ? (
              <Link href={`/curriculum/${m.slug}/${next.slug}`} className={buttonClasses({ size: "sm" })}>{t("nextLesson")}<ArrowRight size={14} aria-hidden="true" /></Link>
            ) : m.summativeTestSlug ? (
              <Link href={`/assessments/${m.summativeTestSlug}`} className={buttonClasses({ size: "sm" })}>{t("summativeTest")}<ArrowRight size={14} aria-hidden="true" /></Link>
            ) : (
              <Link href={`/curriculum/${m.slug}`} className={buttonClasses({ variant: "secondary", size: "sm" })}>{t("backToModule")}</Link>
            )}
          </nav>
        </div>
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-6 flex flex-col gap-4">
          <Card className="p-4">
            <SectionTitle>{m.title[locale]}</SectionTitle>
            <ol className="mt-2 space-y-1.5 text-sm">
              {m.lessons.map((l, i) => (
                <li key={l.id}>
                  <Link href={`/curriculum/${m.slug}/${l.slug}`} className={l.id === lesson.id ? "font-semibold text-accent" : "text-fg-muted hover:text-fg"}>
                    <span className="tabular mr-2 font-mono text-xs">{i + 1}</span>{l.title[locale]}
                  </Link>
                </li>
              ))}
            </ol>
          </Card>
          <Card className="p-4">
            <SectionTitle>{t("reviewStatus")}</SectionTitle>
            <div className="mt-2"><ReviewBadge review={lesson.review} /></div>
            {lesson.review.references?.length ? (
              <ul className="mt-3 space-y-1 text-[11px] leading-snug text-fg-subtle">{lesson.review.references.map((ref) => <li key={ref}>{ref}</li>)}</ul>
            ) : null}
          </Card>
        </div>
      </aside>
    </div>
  );
}
