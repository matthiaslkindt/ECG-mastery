import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/localized";
import { PageHeader } from "@/components/ui";
import { LibraryBrowser } from "@/components/learning/LibraryBrowser";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "library" });
  return { title: t("title") };
}

export default async function LibraryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("library");
  return (
    <div>
      <PageHeader title={t("title")} intro={t("intro")} />
      <LibraryBrowser />
    </div>
  );
}
