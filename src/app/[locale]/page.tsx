import { getTranslations, setRequestLocale } from "next-intl/server";
import { Activity, BookOpen, Stethoscope, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { CURRICULUM } from "@/lib/content/curriculum";
import { LEVEL_AUDIENCE, LEVEL_LABELS, type Level } from "@/lib/content/types";
import { buttonClasses, Card, LevelBadge, SectionTitle } from "@/components/ui";
import { EcgFigure } from "@/components/ecg/EcgFigure";
import { HomeProgress } from "@/components/learning/HomeProgress";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("curriculum");

  const features = [
    { icon: Activity, title: t("features.viewer"), body: t("features.viewerBody") },
    { icon: BookOpen, title: t("features.curriculum"), body: t("features.curriculumBody") },
    { icon: Stethoscope, title: t("features.cases"), body: t("features.casesBody") },
    { icon: TrendingUp, title: t("features.competency"), body: t("features.competencyBody") },
  ];

  return (
    <div className="flex flex-col gap-12">
      <section className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">{t("heroTitle")}</h1>
          <p className="mt-4 max-w-xl text-lg text-fg-muted">{t("heroBody")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/curriculum" className={buttonClasses({ size: "lg" })}>{t("startLearning")}</Link>
            <Link href="/library" className={buttonClasses({ variant: "secondary", size: "lg" })}>{t("browseLibrary")}</Link>
          </div>
          <HomeProgress />
        </div>
        <EcgFigure ecgId="ptbxl-00003" layout="3x4+rhythm" controls={false} linkToLibrary />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {features.map(({ icon: Icon, title, body }) => (
          <Card key={title} className="p-5">
            <Icon size={20} className="text-accent" aria-hidden="true" />
            <h2 className="mt-3 font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-fg-muted">{body}</p>
          </Card>
        ))}
      </section>

      <section>
        <SectionTitle>{t("levels")}</SectionTitle>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">{t("levelsBody")}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {([1, 2, 3, 4] as Level[]).map((level) => {
            const mods = CURRICULUM.filter((m) => m.level === level);
            return (
              <Card key={level} className="p-5">
                <LevelBadge level={level} locale={locale} />
                <p className="mt-2 text-sm font-medium">{LEVEL_LABELS[level][locale]}</p>
                <p className="text-xs text-fg-subtle">{tc("audience")}: {LEVEL_AUDIENCE[level][locale]}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {mods.map((m) => (
                    <li key={m.id}><Link href={`/curriculum/${m.slug}`} className="text-accent hover:underline">{m.title[locale]}</Link></li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
