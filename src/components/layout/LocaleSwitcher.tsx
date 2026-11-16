"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, type Locale } from "@/lib/i18n/localized";
import { cn } from "@/components/ui";

const LABELS: Record<Locale, string> = { en: "EN", nl: "NL" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("nav");
  return (
    <div className="inline-flex rounded-md border border-border p-0.5" role="group" aria-label={t("language")}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => router.replace({ pathname, params } as never, { locale: l })}
          className={cn("h-7 rounded px-2 text-xs font-semibold", l === locale ? "bg-bg-muted text-fg" : "text-fg-subtle hover:text-fg")}
          aria-pressed={l === locale}
          lang={l}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
