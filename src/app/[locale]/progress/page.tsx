import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/localized";
import { PageHeader } from "@/components/ui";
import { ProgressDashboard } from "@/components/learning/ProgressDashboard";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "progress" });
  return { title: t("title") };
}

export default async function ProgressPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("progress");
  return (
    <div>
      <PageHeader title={t("title")} intro={t("intro")} />
      <ProgressDashboard />
    </div>
  );
}
