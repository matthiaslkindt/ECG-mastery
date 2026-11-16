"use client";

import { useTranslations, useLocale } from "next-intl";
import { getEcgEntry } from "@/lib/content/library";
import type { EcgAnnotation, LeadName } from "@/lib/ecg/types";
import type { Locale } from "@/lib/i18n/localized";
import { Badge } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { EcgViewer } from "./EcgViewer";
import type { EcgLayout } from "./geometry";
import { useEcgRecord } from "./useEcgRecord";

/**
 * Loads a library entry by id and renders the viewer with caption and provenance.
 * Used from lessons, cases, the library and assessments.
 */
export function EcgFigure({ ecgId, caption, layout, focusLeads, annotations, controls = true, linkToLibrary = true, className }: {
  ecgId: string;
  caption?: string;
  layout?: EcgLayout;
  focusLeads?: LeadName[];
  annotations?: EcgAnnotation[];
  controls?: boolean;
  linkToLibrary?: boolean;
  className?: string;
}) {
  const t = useTranslations("viewer");
  const tApp = useTranslations("app");
  const locale = useLocale() as Locale;
  const entry = getEcgEntry(ecgId);
  const state = useEcgRecord(entry);

  if (!entry) return <div className="rounded-lg border border-danger bg-danger-soft p-4 text-sm text-danger">Unknown ECG: {ecgId}</div>;

  return (
    <div className={className}>
      {state.status === "ready" && state.record ? (
        <EcgViewer record={state.record} layout={layout} focusLeads={focusLeads} annotations={annotations ?? entry.annotations} controls={controls} ariaLabel={entry.title[locale]} />
      ) : state.status === "error" ? (
        <div className="rounded-lg border border-danger bg-danger-soft p-4 text-sm text-danger">{t("error")}</div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-bg-elevated text-sm text-fg-subtle" aria-busy="true">{t("loading")}</div>
      )}
      <div className="mt-2 flex flex-wrap items-start justify-between gap-2 text-sm">
        {caption && <p className="max-w-3xl text-fg-muted">{caption}</p>}
        <div className="ml-auto flex items-center gap-2">
          <Badge tone={entry.source.kind === "ptbxl" ? "accent" : "neutral"}>{entry.source.kind === "ptbxl" ? tApp("real") : tApp("synthetic")}</Badge>
          {linkToLibrary && (
            <Link href={`/library/${entry.id}`} className="text-xs text-accent underline-offset-2 hover:underline">
              {entry.title[locale]}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
