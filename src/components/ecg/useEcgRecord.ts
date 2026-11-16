"use client";

import { useEffect, useMemo, useState } from "react";
import { decodeRecord } from "@/lib/ecg/codec";
import { synthesize, SYNTH_PRESETS } from "@/lib/ecg/synth";
import type { EcgRecord, EcgRecordFile } from "@/lib/ecg/types";
import type { EcgLibraryEntry } from "@/lib/content/types";

const cache = new Map<string, Promise<EcgRecord>>();

async function loadPtbxl(file: string, id: string): Promise<EcgRecord> {
  const existing = cache.get(id);
  if (existing) return existing;
  const p = fetch(file)
    .then((r) => {
      if (!r.ok) throw new Error(`Failed to load ${file}: ${r.status}`);
      return r.json() as Promise<EcgRecordFile>;
    })
    .then(decodeRecord);
  cache.set(id, p);
  return p;
}

/** Resolve a library entry to a decoded record: fetched for PTB-XL, synthesized in-browser otherwise. */
export function useEcgRecord(entry: EcgLibraryEntry | undefined) {
  const [state, setState] = useState<{ status: "idle" | "loading" | "ready" | "error"; record?: EcgRecord; error?: string }>({ status: "idle" });

  const synthetic = useMemo(() => {
    if (!entry || entry.source.kind !== "synthetic") return undefined;
    const preset = SYNTH_PRESETS[entry.source.presetId];
    if (!preset) return undefined;
    return synthesize(preset.params, { seed: entry.source.seed, presetId: preset.id, id: entry.id });
  }, [entry]);

  useEffect(() => {
    if (!entry) return;
    if (entry.source.kind === "synthetic") {
      setState(synthetic ? { status: "ready", record: synthetic } : { status: "error", error: "Unknown preset" });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });
    loadPtbxl(entry.source.file, entry.id)
      .then((record) => !cancelled && setState({ status: "ready", record }))
      .catch((e: Error) => !cancelled && setState({ status: "error", error: e.message }));
    return () => {
      cancelled = true;
    };
  }, [entry, synthetic]);

  return state;
}
