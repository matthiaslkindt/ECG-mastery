"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { AxisCategory, DiagnosisId, FindingId, InterpretationKey, InterpretationSubmission, RhythmCategory } from "@/lib/content/types";
import { scoreInterpretation, type InterpretationResult } from "@/lib/learning/scoring";
import { Button, cn } from "@/components/ui";

const RHYTHMS: RhythmCategory[] = ["sinus-rhythm", "sinus-bradycardia", "sinus-tachycardia", "sinus-arrhythmia", "atrial-fibrillation", "atrial-flutter", "svt", "ventricular-tachycardia", "junctional", "paced", "av-block-2", "av-block-3", "ectopic-atrial"];
const AXES: AxisCategory[] = ["normal", "left", "right", "extreme"];
const URGENCIES: InterpretationKey["urgency"][] = ["routine", "urgent", "emergency"];
const FINDINGS: FindingId[] = ["first-degree-avb", "second-degree-avb-mobitz-1", "second-degree-avb-mobitz-2", "av-block-2-1", "third-degree-avb", "av-dissociation", "rbbb", "incomplete-rbbb", "lbbb", "lafb", "lpfb", "nonspecific-ivcd", "lvh", "rvh", "lae", "rae", "low-voltage", "st-elevation-inferior", "st-elevation-anterior", "st-elevation-lateral", "st-elevation-diffuse", "st-depression", "reciprocal-st-depression", "t-inversion", "hyperacute-t", "peaked-t", "pathological-q-inferior", "pathological-q-anterior", "pathological-q-lateral", "poor-r-progression", "prolonged-qt", "short-pr", "delta-wave", "pvc", "pac", "pacing-spikes", "brugada-pattern", "u-wave", "flutter-waves", "fibrillatory-baseline", "retrograde-p"];
const DIAGNOSES: DiagnosisId[] = ["normal-ecg", "sinus-bradycardia", "sinus-tachycardia", "sinus-arrhythmia", "atrial-fibrillation", "atrial-flutter", "atrial-tachycardia", "avnrt-avrt", "monomorphic-vt", "first-degree-avb", "mobitz-1", "mobitz-2", "complete-heart-block", "rbbb", "incomplete-rbbb", "lbbb", "lafb", "bifascicular-block", "lvh", "rvh", "lae", "inferior-stemi", "inferolateral-stemi", "anterior-stemi", "lateral-stemi", "posterior-mi", "old-inferior-mi", "old-anterior-mi", "subendocardial-ischaemia", "wellens-syndrome", "pericarditis", "hyperkalaemia", "hypokalaemia", "long-qt", "brugada-syndrome", "wpw", "paced-rhythm", "pvcs", "pacs", "bigeminy", "sinus-pause", "low-voltage", "nonspecific-st-t"];

/** The structured ECG report form. Only fields present in the key are scored. */
export function InterpretationForm({ ecgKey, onSubmit, onRetry }: { ecgKey: InterpretationKey; onSubmit?: (r: InterpretationResult, s: InterpretationSubmission) => void; onRetry?: () => void }) {
  const t = useTranslations("interp");
  const [rate, setRate] = useState("");
  const [rhythm, setRhythm] = useState<RhythmCategory | "">("");
  const [axis, setAxis] = useState<AxisCategory | "">("");
  const [pr, setPr] = useState("");
  const [prNa, setPrNa] = useState(false);
  const [qrs, setQrs] = useState("");
  const [qtc, setQtc] = useState("");
  const [findings, setFindings] = useState<FindingId[]>([]);
  const [diagnosis, setDiagnosis] = useState<DiagnosisId[]>([]);
  const [urgency, setUrgency] = useState<InterpretationKey["urgency"] | "">("");
  const [filter, setFilter] = useState("");
  const [result, setResult] = useState<InterpretationResult | null>(null);

  const num = (v: string) => (v.trim() === "" ? undefined : Number(v));

  const submit = () => {
    const sub: InterpretationSubmission = {
      rate: num(rate), rhythm: rhythm || undefined, axis: axis || undefined,
      pr: prNa ? null : num(pr), qrs: num(qrs), qtc: num(qtc),
      findings, diagnosis, urgency: urgency || undefined,
    };
    const r = scoreInterpretation(ecgKey, sub);
    setResult(r);
    onSubmit?.(r, sub);
  };
  const reset = () => {
    setResult(null);
    onRetry?.();
  };

  const toggle = <T extends string>(list: T[], set: (v: T[]) => void, id: T) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const visibleFindings = useMemo(() => FINDINGS.filter((f) => t(`findingLabels.${f}`).toLowerCase().includes(filter.toLowerCase())), [filter, t]);
  const locked = !!result;
  const fieldClass = "h-9 w-full rounded-md border border-border-strong bg-bg-elevated px-2 text-sm text-fg disabled:opacity-60";

  const fieldResult = (name: string) => result?.fields.find((f) => f.field === name);
  const statusCls = (s?: string) => s === "correct" ? "text-success" : s === "incorrect" ? "text-danger" : s === "partial" ? "text-warning" : "text-fg-subtle";

  return (
    <form className="rounded-lg border border-border bg-bg-elevated p-5" onSubmit={(e) => { e.preventDefault(); if (!locked) submit(); }} aria-label={t("title")}>
      <h3 className="text-base font-semibold">{t("title")}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Field label={t("rate")} res={fieldResult("rate")} statusCls={statusCls} t={t}>
          <input type="number" inputMode="numeric" className={fieldClass} value={rate} onChange={(e) => setRate(e.target.value)} disabled={locked} min={10} max={350} />
        </Field>
        <Field label={t("rhythm")} res={fieldResult("rhythm")} statusCls={statusCls} t={t} className="col-span-2">
          <select className={fieldClass} value={rhythm} onChange={(e) => setRhythm(e.target.value as RhythmCategory)} disabled={locked}>
            <option value="">{t("selectRhythm")}</option>
            {RHYTHMS.map((r) => <option key={r} value={r}>{t(`rhythms.${r}`)}</option>)}
          </select>
        </Field>
        <Field label={t("axis")} res={fieldResult("axis")} statusCls={statusCls} t={t}>
          <select className={fieldClass} value={axis} onChange={(e) => setAxis(e.target.value as AxisCategory)} disabled={locked}>
            <option value="">{t("selectAxis")}</option>
            {AXES.map((a) => <option key={a} value={a}>{t(`axes.${a}`)}</option>)}
          </select>
        </Field>
        <Field label={t("pr")} res={fieldResult("pr")} statusCls={statusCls} t={t}>
          <div className="flex items-center gap-2">
            <input type="number" inputMode="numeric" className={fieldClass} value={pr} onChange={(e) => setPr(e.target.value)} disabled={locked || prNa} min={40} max={600} />
            <label className="flex shrink-0 items-center gap-1 text-[11px] text-fg-muted"><input type="checkbox" checked={prNa} onChange={(e) => setPrNa(e.target.checked)} disabled={locked} />{t("notMeasurable")}</label>
          </div>
        </Field>
        <Field label={t("qrs")} res={fieldResult("qrs")} statusCls={statusCls} t={t}>
          <input type="number" inputMode="numeric" className={fieldClass} value={qrs} onChange={(e) => setQrs(e.target.value)} disabled={locked} min={40} max={300} />
        </Field>
        <Field label={t("qtc")} res={fieldResult("qtc")} statusCls={statusCls} t={t}>
          <input type="number" inputMode="numeric" className={fieldClass} value={qtc} onChange={(e) => setQtc(e.target.value)} disabled={locked} min={200} max={800} />
        </Field>
      </div>

      <fieldset className="mt-5">
        <legend className="flex w-full items-center justify-between text-sm font-semibold">
          <span>{t("findings")} {result && <span className={cn("ml-2 text-xs font-medium", statusCls(fieldResult("findings")?.status))}>{t(`status.${fieldResult("findings")?.status ?? "not-scored"}`)}</span>}</span>
          <input type="search" placeholder={t("searchFindings")} className="h-8 w-44 rounded-md border border-border bg-bg-elevated px-2 text-xs font-normal" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label={t("searchFindings")} />
        </legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {visibleFindings.map((f) => {
            const on = findings.includes(f);
            const missed = result && result.missedFindings.includes(f);
            const wrong = result && result.wrongFindings.includes(f);
            return (
              <button key={f} type="button" disabled={locked} onClick={() => toggle(findings, setFindings, f)} aria-pressed={on}
                className={cn("rounded-full border px-2.5 py-1 text-xs transition-colors disabled:cursor-default",
                  !result && (on ? "border-accent bg-accent-soft text-accent" : "border-border text-fg-muted hover:bg-bg-muted"),
                  result && on && !wrong && "border-success bg-success-soft text-success",
                  result && wrong && "border-danger bg-danger-soft text-danger line-through",
                  result && missed && "border-warning bg-warning-soft text-warning",
                  result && !on && !missed && "border-border text-fg-subtle opacity-60")}>
                {t(`findingLabels.${f}`)}{result && missed ? ` · ${t("missed")}` : ""}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold">{t("diagnosis")} {result && <span className={cn("ml-2 text-xs font-medium", statusCls(fieldResult("diagnosis")?.status))}>{t(`status.${fieldResult("diagnosis")?.status ?? "not-scored"}`)}</span>}</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {DIAGNOSES.map((d) => {
            const on = diagnosis.includes(d);
            const missed = result && result.missedDiagnoses.includes(d);
            const wrong = result && result.wrongDiagnoses.includes(d);
            return (
              <button key={d} type="button" disabled={locked} onClick={() => toggle(diagnosis, setDiagnosis, d)} aria-pressed={on}
                className={cn("rounded-full border px-2.5 py-1 text-xs transition-colors disabled:cursor-default",
                  !result && (on ? "border-accent bg-accent-soft text-accent" : "border-border text-fg-muted hover:bg-bg-muted"),
                  result && on && !wrong && "border-success bg-success-soft text-success",
                  result && wrong && "border-danger bg-danger-soft text-danger line-through",
                  result && missed && "border-warning bg-warning-soft text-warning",
                  result && !on && !missed && "border-border text-fg-subtle opacity-60")}>
                {t(`diagnosisLabels.${d}`)}{result && missed ? ` · ${t("missed")}` : ""}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Field label={t("urgency")} res={fieldResult("urgency")} statusCls={statusCls} t={t}>
          <select className={fieldClass} value={urgency} onChange={(e) => setUrgency(e.target.value as InterpretationKey["urgency"])} disabled={locked}>
            <option value="">{t("selectUrgency")}</option>
            {URGENCIES.map((u) => <option key={u} value={u}>{t(`urgencies.${u}`)}</option>)}
          </select>
        </Field>
      </div>

      <div className="mt-5 flex items-center gap-3">
        {!result ? (
          <Button type="submit">{t("submit")}</Button>
        ) : (
          <>
            <div className="text-sm"><span className="text-fg-muted">{t("score")}: </span><span className="tabular text-lg font-semibold">{Math.round(result.score * 100)}%</span></div>
            <Button type="button" variant="secondary" onClick={reset}>{t("retry")}</Button>
          </>
        )}
      </div>
    </form>
  );
}

function Field({ label, children, res, statusCls, t, className }: { label: string; children: React.ReactNode; res?: { status: string; expected?: string; given?: string }; statusCls: (s?: string) => string; t: ReturnType<typeof useTranslations<"interp">>; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-1 text-xs font-medium text-fg-muted", className)}>
      <span className="flex items-center justify-between">
        {label}
        {res && <span className={cn("font-medium", statusCls(res.status))}>{t(`status.${res.status as "correct"}`)}</span>}
      </span>
      {children}
      {res && res.status !== "correct" && res.expected && <span className="font-mono text-[11px] text-fg-subtle">{t("expected")}: {res.expected}</span>}
    </label>
  );
}
