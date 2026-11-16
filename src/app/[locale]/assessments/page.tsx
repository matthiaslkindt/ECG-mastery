import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { ASSESSMENTS } from "@/lib/content/assessments";
import { buttonClasses, Card, LevelBadge, PageHeader, SectionTitle } from "@/components/ui";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "assess" });
  return { title: t("title") };
}

export default async function AssessmentsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("assess");
  const groups = [
    { key: "summative", items: ASSESSMENTS.filter((a) => a.kind === "summative") },
    { key: "formative", items: ASSESSMENTS.filter((a) => a.kind === "formative" && a.questions.length > 0) },
  ] as const;
  return (
    <div>
      <PageHeader title={t("title")} intro={t("intro")} />
      {groups.map((g) => (
        <section key={g.key} className="mb-10">
          <SectionTitle className="mb-3">{t(g.key)}</SectionTitle>
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {g.items.map((a) => (
              <Card key={a.slug} as="li" className="flex flex-col p-5">
                <div className="flex items-center justify-between"><LevelBadge level={a.level} locale={locale} /><span className="text-xs text-fg-subtle">{t("questions", { n: a.questions.length })}</span></div>
                <h2 className="mt-2 font-semibold"><Link href={`/assessments/${a.slug}`} className="hover:underline">{a.title[locale]}</Link></h2>
                <p className="mt-1 text-sm text-fg-muted">{a.description[locale]}</p>
                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-fg-subtle">
                  <span>{a.passMark !== undefined ? t("passMark", { pct: Math.round(a.passMark * 100) }) : ""}{a.timeLimitMinutes ? ` · ${t("timeLimit", { min: a.timeLimitMinutes })}` : ""}</span>
                  <Link href={`/assessments/${a.slug}`} className={buttonClasses({ size: "sm", variant: a.kind === "summative" ? "primary" : "secondary" })}>{t("start")}</Link>
                </div>
              </Card>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
