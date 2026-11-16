"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { EcgLibraryEntry } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/localized";
import { useProgress } from "@/lib/progress/store";
import { Button, Card, SectionTitle } from "@/components/ui";
import { InterpretationForm } from "./InterpretationForm";

/** Practice interpretation against the library key, with an optional reveal of the key. */
export function LibraryInterpretation({ entry }: { entry: EcgLibraryEntry }) {
  const t = useTranslations("library");
  const ti = useTranslations("interp");
  const locale = useLocale() as Locale;
  const [showKey, setShowKey] = useState(false);
  const recordInterpretation = useProgress((s) => s.recordInterpretation);
  const k = entry.key;
  return (
    <div className="flex flex-col gap-4">
      <InterpretationForm ecgKey={k} onSubmit={(r) => recordInterpretation({ ecgId: entry.id, competencies: entry.competencies, score: r.score, context: { kind: "library", id: entry.id } })} />
      <div>
        <Button variant="ghost" size="sm" onClick={() => setShowKey((v) => !v)} aria-expanded={showKey}>{showKey ? t("hideKey") : t("showKey")}</Button>
        {showKey && (
          <Card className="mt-2 p-5">
            <SectionTitle>{t("key")}</SectionTitle>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm md:grid-cols-3">
              {k.rate && <Row label={ti("rate")} value={`${k.rate.value} ± ${k.rate.tolerance}`} />}
              <Row label={ti("rhythm")} value={ti(`rhythms.${k.rhythm}`)} />
              {k.axis && <Row label={ti("axis")} value={ti(`axes.${k.axis}`)} />}
              {k.pr !== undefined && <Row label={ti("pr")} value={k.pr === null ? ti("notMeasurable") : `${k.pr.value} ± ${k.pr.tolerance}`} />}
              {k.qrs && <Row label={ti("qrs")} value={`${k.qrs.value} ± ${k.qrs.tolerance}`} />}
              {k.qtc && <Row label={ti("qtc")} value={`${k.qtc.value} ± ${k.qtc.tolerance}`} />}
              <Row label={ti("urgency")} value={ti(`urgencies.${k.urgency}`)} />
            </dl>
            <p className="mt-3 text-sm"><span className="font-medium">{ti("findings")}: </span>{k.findings.length ? k.findings.map((f) => ti(`findingLabels.${f}`)).join(", ") : ti("noFindings")}</p>
            <p className="mt-1 text-sm"><span className="font-medium">{ti("diagnosis")}: </span>{k.diagnosis.map((d) => ti(`diagnosisLabels.${d}`)).join(", ")}</p>
            {entry.review.medical.notes && <p className="mt-3 text-xs text-fg-subtle" lang="en">{entry.review.medical.notes}</p>}
            <p className="sr-only">{entry.title[locale]}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-fg-subtle">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
