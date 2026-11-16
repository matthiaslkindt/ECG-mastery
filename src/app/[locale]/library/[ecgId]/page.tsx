import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n/localized";
import { ECG_LIBRARY, getEcgEntry } from "@/lib/content/library";
import { SYNTH_PRESETS } from "@/lib/ecg/synth/presets";
import { COMPETENCIES } from "@/lib/content/competencies";
import { Badge, Card, LevelBadge, PageHeader, SectionTitle } from "@/components/ui";
import { ReviewBadge } from "@/components/layout/ReviewBadge";
import { EcgFigure } from "@/components/ecg/EcgFigure";
import { LibraryInterpretation } from "@/components/learning/LibraryInterpretation";
import { PTBXL_SELECTION } from "@/data/ptbxl-selection";

const PTB_META: Record<number, { age: number; sex: string }> = Object.fromEntries(Object.values(PTBXL_SELECTION).map((s) => [s.ecgId, { age: s.age, sex: s.sex }]));

export function generateStaticParams() {
  return ECG_LIBRARY.map((e) => ({ ecgId: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; ecgId: string }> }) {
  const { locale, ecgId } = await params;
  return { title: getEcgEntry(ecgId)?.title[locale] };
}

export default async function LibraryEntryPage({ params }: { params: Promise<{ locale: Locale; ecgId: string }> }) {
  const { locale, ecgId } = await params;
  setRequestLocale(locale);
  const e = getEcgEntry(ecgId);
  if (!e) notFound();
  const t = await getTranslations("library");
  const tApp = await getTranslations("app");
  const ti = await getTranslations("interp");
  const idx = ECG_LIBRARY.findIndex((x) => x.id === e.id);
  const prev = ECG_LIBRARY[idx - 1];
  const next = ECG_LIBRARY[idx + 1];
  const src = e.source;
  const preset = src.kind === "synthetic" ? SYNTH_PRESETS[src.presetId] : undefined;

  return (
    <div>
      <p className="mb-2 text-sm"><Link href="/library" className="text-fg-subtle hover:underline">{t("title")}</Link></p>
      <PageHeader title={e.title[locale]} intro={e.description[locale]} aside={<div className="flex items-center gap-2"><LevelBadge level={e.level} locale={locale} /><Badge tone={src.kind === "ptbxl" ? "accent" : "neutral"}>{src.kind === "ptbxl" ? tApp("real") : tApp("synthetic")}</Badge></div>} />
      <EcgFigure ecgId={e.id} layout="3x4+rhythm" linkToLibrary={false} />
      <p className="mt-2 text-xs text-fg-subtle">
        {src.kind === "ptbxl"
          ? t("ptbxlNote", { age: PTB_META[src.ecgId]?.age ?? "?", sex: PTB_META[src.ecgId]?.sex ?? "?" })
          : t("synthNote", { preset: src.presetId, seed: src.seed })}
        {preset && <> · {t("modelNotes")}: {preset.modelNotes}</>}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <LibraryInterpretation entry={e} />
        <aside className="flex flex-col gap-4">
          <Card className="p-5">
            <SectionTitle>{t("teachingPoints")}</SectionTitle>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">{e.teachingPoints.map((p, i) => <li key={i}>{p[locale]}</li>)}</ul>
          </Card>
          <Card className="p-5">
            <SectionTitle>{ti("diagnosis")}</SectionTitle>
            <div className="mt-2 flex flex-wrap gap-1">{e.tags.map((d) => <Badge key={d} tone="accent">{ti(`diagnosisLabels.${d}`)}</Badge>)}</div>
            <SectionTitle className="mt-4">{t("level")}</SectionTitle>
            <div className="mt-2 flex flex-wrap gap-1">{e.competencies.map((c) => <Badge key={c}>{COMPETENCIES[c].title[locale]}</Badge>)}</div>
            <div className="mt-4"><ReviewBadge review={e.review} /></div>
            {src.kind === "ptbxl" && <p className="mt-3 text-[11px] text-fg-subtle">{t("attribution")} · PTB-XL ecg_id {src.ecgId}</p>}
          </Card>
          <nav className="flex justify-between text-sm" aria-label="Library navigation">
            {prev ? <Link href={`/library/${prev.id}`} className="text-accent hover:underline">← {prev.title[locale]}</Link> : <span />}
            {next ? <Link href={`/library/${next.id}`} className="text-right text-accent hover:underline">{next.title[locale]} →</Link> : <span />}
          </nav>
        </aside>
      </div>
    </div>
  );
}
