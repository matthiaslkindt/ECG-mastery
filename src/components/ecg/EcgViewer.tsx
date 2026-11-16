"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Ruler, ZoomIn, ZoomOut, X } from "lucide-react";
import { LEAD_NAMES, type EcgAnnotation, type EcgRecord, type LeadName } from "@/lib/ecg/types";
import type { Locale } from "@/lib/i18n/localized";
import { cn } from "@/components/ui";
import { buildPanels, tracePath, MARGIN_LEFT_MM, MM_PER_MV, MM_PER_SEC, type EcgLayout } from "./geometry";

export interface EcgViewerProps {
  record: EcgRecord;
  layout?: EcgLayout;
  focusLeads?: LeadName[];
  annotations?: EcgAnnotation[];
  /** Hide layout / caliper controls (e.g. thumbnails). */
  controls?: boolean;
  className?: string;
  /** Base pixels per millimetre at zoom 1. */
  basePxPerMm?: number;
  /** Optional heading for the figure for screen readers. */
  ariaLabel?: string;
}

interface Caliper {
  panelIndex: number;
  /** Times in seconds and amplitudes in mV, absolute within the record. */
  t0: number;
  t1: number;
  mv0: number;
  mv1: number;
}

const LAYOUTS: EcgLayout[] = ["3x4+rhythm", "3x4", "6x2", "single"];

export function EcgViewer({ record, layout: initialLayout = "3x4+rhythm", focusLeads, annotations, controls = true, className, basePxPerMm = 3.2, ariaLabel }: EcgViewerProps) {
  const t = useTranslations("viewer");
  const locale = useLocale() as Locale;
  const [layout, setLayout] = useState<EcgLayout>(initialLayout);
  const [singleLead, setSingleLead] = useState<LeadName>("II");
  const [zoom, setZoom] = useState(1);
  const [calipersOn, setCalipersOn] = useState(false);
  const [caliper, setCaliper] = useState<Caliper | null>(null);
  const dragging = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const gridId = useId();

  const pxPerMm = basePxPerMm * zoom;
  const { panels, width, height } = useMemo(() => buildPanels(layout, record.durationSec, singleLead), [layout, record.durationSec, singleLead]);

  const paths = useMemo(
    () => panels.map((p) => tracePath(record.leads[p.lead], record.fs, p, pxPerMm)),
    [panels, record, pxPerMm],
  );

  /** Convert a pointer event to (panel, time, mV). */
  const locate = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      const xmm = ((e.clientX - rect.left) / rect.width) * width;
      const ymm = ((e.clientY - rect.top) / rect.height) * height;
      const idx = panels.findIndex((p) => xmm >= p.x && xmm <= p.x + p.w && ymm >= p.y && ymm <= p.y + p.h);
      if (idx < 0) return null;
      const p = panels[idx]!;
      return { idx, t: p.t0 + (xmm - p.x) / MM_PER_SEC, mv: (p.baseline - ymm) / MM_PER_MV };
    },
    [panels, width, height],
  );

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!calipersOn) return;
    const loc = locate(e);
    if (!loc) return;
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setCaliper({ panelIndex: loc.idx, t0: loc.t, t1: loc.t, mv0: loc.mv, mv1: loc.mv });
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!calipersOn || !dragging.current) return;
    const loc = locate(e);
    if (!loc) return;
    setCaliper((c) => (c ? { ...c, t1: loc.t, mv1: loc.mv } : c));
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const caliperPanel = caliper ? panels[caliper.panelIndex] : undefined;
  const dtMs = caliper ? Math.abs(caliper.t1 - caliper.t0) * 1000 : 0;
  const dmv = caliper ? caliper.mv1 - caliper.mv0 : 0;
  const bpm = dtMs > 0 ? 60000 / dtMs : 0;

  const panelLabelSize = 2.8; // mm

  return (
    <figure className={cn("rounded-lg border border-border bg-bg-elevated", className)}>
      {controls && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2 text-sm">
          <div className="flex items-center gap-1" role="group" aria-label={t("layout")}>
            {LAYOUTS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayout(l)}
                className={cn("h-7 rounded px-2 text-xs font-medium", layout === l ? "bg-accent-soft text-accent" : "text-fg-muted hover:bg-bg-muted")}
                aria-pressed={layout === l}
              >
                {t(`layouts.${l}`)}
              </button>
            ))}
          </div>
          {layout === "single" && (
            <label className="flex items-center gap-1 text-xs text-fg-muted">
              {t("lead")}
              <select value={singleLead} onChange={(e) => setSingleLead(e.target.value as LeadName)} className="h-7 rounded border border-border bg-bg-elevated px-1 text-xs text-fg">
                {LEAD_NAMES.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </label>
          )}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => { setCalipersOn((v) => !v); setCaliper(null); }}
              className={cn("inline-flex h-7 items-center gap-1 rounded px-2 text-xs font-medium", calipersOn ? "bg-accent-soft text-accent" : "text-fg-muted hover:bg-bg-muted")}
              aria-pressed={calipersOn}
              title={t("calipersHint")}
            >
              <Ruler size={14} aria-hidden="true" /> {t("calipers")}
            </button>
            {caliper && (
              <button type="button" onClick={() => setCaliper(null)} className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs text-fg-muted hover:bg-bg-muted" aria-label={t("clear")}>
                <X size={14} aria-hidden="true" />
              </button>
            )}
            <button type="button" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))} className="inline-flex h-7 w-7 items-center justify-center rounded text-fg-muted hover:bg-bg-muted" aria-label={`${t("zoom")} −`}>
              <ZoomOut size={14} />
            </button>
            <span className="tabular w-10 text-center text-xs text-fg-subtle">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(2.4, +(z + 0.2).toFixed(1)))} className="inline-flex h-7 w-7 items-center justify-center rounded text-fg-muted hover:bg-bg-muted" aria-label={`${t("zoom")} +`}>
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          width={zoom === 1 ? "100%" : width * pxPerMm}
          height={zoom === 1 ? undefined : height * pxPerMm}
          className={cn("block select-none", calipersOn && "cursor-crosshair", "touch-none")}
          style={{ maxWidth: "none", height: zoom === 1 ? "auto" : undefined }}
          role="img"
          aria-label={ariaLabel ?? t("ariaLabel", { layout: t(`layouts.${layout}`) })}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <defs>
            <pattern id={`${gridId}-minor`} width="1" height="1" patternUnits="userSpaceOnUse">
              <path d="M1 0H0V1" fill="none" stroke="var(--ecg-grid-minor)" strokeWidth="0.08" />
            </pattern>
            <pattern id={`${gridId}-major`} width="5" height="5" patternUnits="userSpaceOnUse">
              <rect width="5" height="5" fill={`url(#${gridId}-minor)`} />
              <path d="M5 0H0V5" fill="none" stroke="var(--ecg-grid-major)" strokeWidth="0.16" />
            </pattern>
          </defs>
          <rect width={width} height={height} fill="var(--ecg-paper)" />
          <rect width={width} height={height} fill={`url(#${gridId}-major)`} />

          {/* Focus highlights */}
          {focusLeads?.length
            ? panels.map((p, i) => focusLeads.includes(p.lead) && !p.rhythm && <rect key={`f${i}`} x={p.x} y={p.y} width={p.w} height={p.h} fill="var(--ecg-focus)" />)
            : null}

          {/* Panel separators, calibration and labels */}
          {panels.map((p, i) => (
            <g key={i}>
              {p.x > MARGIN_LEFT_MM && <line x1={p.x} y1={p.y + 2} x2={p.x} y2={p.y + p.h - 2} stroke="var(--ecg-label)" strokeWidth="0.15" strokeDasharray="0.6 0.6" opacity="0.6" />}
              {p.x === MARGIN_LEFT_MM && (
                /* 1 mV, 200 ms calibration pulse in the left margin of each row */
                <path d={`M1 ${p.baseline} h1.5 v-${MM_PER_MV} h${0.2 * MM_PER_SEC} v${MM_PER_MV} h1.5`} fill="none" stroke="var(--ecg-trace)" strokeWidth="0.22" />
              )}
              <text x={p.x + 1.2} y={p.y + panelLabelSize + 0.8} fontSize={panelLabelSize} fontFamily="var(--font-sans)" fontWeight="600" fill="var(--ecg-label)" stroke="var(--ecg-paper)" strokeWidth="0.7" paintOrder="stroke">
                {p.lead}
              </text>
            </g>
          ))}

          {/* Traces */}
          {paths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke="var(--ecg-trace)" strokeWidth={0.25} strokeLinejoin="round" strokeLinecap="round" />
          ))}

          {/* Annotations */}
          {annotations?.map((a) =>
            panels.map((p, i) => {
              if (a.leads && !a.leads.includes(p.lead)) return null;
              const offset = 0;
              const inRange = a.t0 >= p.t0 && a.t0 <= p.t0 + p.dur;
              if (!inRange) return null;
              const x0 = p.x + offset + (a.t0 - p.t0) * MM_PER_SEC;
              const x1 = a.t1 !== undefined ? p.x + offset + (Math.min(a.t1, p.t0 + p.dur) - p.t0) * MM_PER_SEC : x0;
              return (
                <g key={`${a.id}-${i}`}>
                  {a.t1 !== undefined && <rect x={x0} y={p.y + 1} width={Math.max(0.2, x1 - x0)} height={p.h - 2} fill="var(--ecg-annotation)" opacity="0.12" />}
                  <line x1={x0} y1={p.y + 1} x2={x0} y2={p.y + p.h - 1} stroke="var(--ecg-annotation)" strokeWidth="0.25" />
                  <text x={x0 + 0.8} y={p.y + p.h - 1.5} fontSize="2.2" fontFamily="var(--font-sans)" fill="var(--ecg-annotation)">{a.label[locale]}</text>
                </g>
              );
            }),
          )}

          {/* Calipers */}
          {caliper && caliperPanel && (() => {
            const p = caliperPanel;
            const offset = 0; // caliper times are absolute; pointer already includes any visual offset
            const x0 = p.x + offset + (caliper.t0 - p.t0) * MM_PER_SEC;
            const x1 = p.x + offset + (caliper.t1 - p.t0) * MM_PER_SEC;
            const y0 = p.baseline - caliper.mv0 * MM_PER_MV;
            const y1 = p.baseline - caliper.mv1 * MM_PER_MV;
            return (
              <g pointerEvents="none">
                <line x1={x0} y1={p.y + 1} x2={x0} y2={p.y + p.h - 1} stroke="var(--ecg-caliper)" strokeWidth="0.3" />
                <line x1={x1} y1={p.y + 1} x2={x1} y2={p.y + p.h - 1} stroke="var(--ecg-caliper)" strokeWidth="0.3" />
                <line x1={x0} y1={y0} x2={x1} y2={y0} stroke="var(--ecg-caliper)" strokeWidth="0.2" strokeDasharray="0.8 0.5" />
                <line x1={x1} y1={y0} x2={x1} y2={y1} stroke="var(--ecg-caliper)" strokeWidth="0.2" strokeDasharray="0.8 0.5" />
              </g>
            );
          })()}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-1.5 text-xs text-fg-subtle">
        <span className="font-mono">{t("speed")} · {t("gain")} · {record.fs} Hz</span>
        {caliper && dtMs > 0 && (
          <span className="font-mono text-accent" aria-live="polite">
            {t("measurement", { ms: Math.round(dtMs), bpm: Math.round(bpm), mv: dmv.toFixed(2) })}
          </span>
        )}
        {calipersOn && !caliper && <span>{t("calipersHint")}</span>}
      </div>
    </figure>
  );
}
