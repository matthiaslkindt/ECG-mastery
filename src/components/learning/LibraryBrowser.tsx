"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { ECG_LIBRARY } from "@/lib/content/library";
import type { Level } from "@/lib/content/types";
import { Badge, Card, cn, LevelBadge } from "@/components/ui";

export function LibraryBrowser() {
  const t = useTranslations("library");
  const tApp = useTranslations("app");
  const ti = useTranslations("interp");
  const locale = useLocale() as Locale;
  const [q, setQ] = useState("");
  const [source, setSource] = useState<"all" | "ptbxl" | "synthetic">("all");
  const [level, setLevel] = useState<Level | 0>(0);

  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ECG_LIBRARY.filter((e) => (source === "all" || e.source.kind === source) && (level === 0 || e.level === level))
      .filter((e) => !needle || e.title[locale].toLowerCase().includes(needle) || e.tags.some((d) => ti(`diagnosisLabels.${d}`).toLowerCase().includes(needle)))
      .sort((a, b) => a.level - b.level || a.title[locale].localeCompare(b.title[locale]));
  }, [q, source, level, locale, ti]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search")} aria-label={t("search")} className="h-9 w-64 rounded-md border border-border-strong bg-bg-elevated px-3 text-sm" />
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5" role="group" aria-label={t("source")}>
          {(["all", "ptbxl", "synthetic"] as const).map((s) => (
            <button key={s} type="button" onClick={() => setSource(s)} aria-pressed={source === s} className={cn("h-7 rounded px-2 text-xs font-medium", source === s ? "bg-bg-muted text-fg" : "text-fg-subtle hover:text-fg")}>
              {s === "all" ? t("filterAll") : s === "ptbxl" ? tApp("real") : tApp("synthetic")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5" role="group" aria-label={t("level")}>
          {([0, 1, 2, 3, 4] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)} aria-pressed={level === l} className={cn("h-7 rounded px-2 text-xs font-medium", level === l ? "bg-bg-muted text-fg" : "text-fg-subtle hover:text-fg")}>
              {l === 0 ? t("filterAll") : `${tApp("level")} ${l}`}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-fg-subtle">{t("results", { n: items.length })}</span>
      </div>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((e) => (
          <Card key={e.id} as="li" className="p-4">
            <div className="flex items-center justify-between gap-2">
              <LevelBadge level={e.level} locale={locale} />
              <Badge tone={e.source.kind === "ptbxl" ? "accent" : "neutral"}>{e.source.kind === "ptbxl" ? tApp("real") : tApp("synthetic")}</Badge>
            </div>
            <h2 className="mt-2 font-semibold"><Link href={`/library/${e.id}`} className="hover:underline">{e.title[locale]}</Link></h2>
            <p className="mt-1 line-clamp-2 text-sm text-fg-muted">{e.description[locale]}</p>
            <div className="mt-2 flex flex-wrap gap-1">{e.tags.map((d) => <Badge key={d}>{ti(`diagnosisLabels.${d}`)}</Badge>)}</div>
          </Card>
        ))}
      </ul>
    </div>
  );
}
