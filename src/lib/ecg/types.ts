/**
 * Core ECG data model.
 *
 * Every ECG shown in the platform — whether a real recording from an open database or a
 * synthesized teaching tracing — is normalised into an `EcgRecord`: 12 leads sampled at a
 * fixed rate, stored in millivolts. Rendering, calipers and measurements all work on this
 * single representation, so the viewer never needs to know where a tracing came from.
 */

export const LEAD_NAMES = [
  "I", "II", "III", "aVR", "aVL", "aVF",
  "V1", "V2", "V3", "V4", "V5", "V6",
] as const;

export type LeadName = (typeof LEAD_NAMES)[number];

export type EcgSource =
  | {
      kind: "ptbxl";
      ecgId: number;
      /** PTB-XL SCP-ECG statement codes with likelihoods (0–100). */
      scpCodes: Record<string, number>;
      age?: number;
      sex?: "M" | "F";
      license: "CC BY 4.0";
      citation: string;
    }
  | {
      kind: "synthetic";
      presetId: string;
      seed: number;
      /** Human-readable description of the generating model parameters. */
      modelNotes?: string;
    };

export interface EcgRecord {
  id: string;
  /** Sampling frequency in Hz. */
  fs: number;
  /** Duration in seconds. */
  durationSec: number;
  /** Signals in millivolts, one Float32Array per lead, all the same length. */
  leads: Record<LeadName, Float32Array>;
  source: EcgSource;
}

/** Serialised form stored under /public/ecg — compact, base64 int16 microvolts. */
export interface EcgRecordFile {
  id: string;
  fs: number;
  durationSec: number;
  units: "uV";
  encoding: "int16le-base64";
  leads: LeadName[];
  data: Record<LeadName, string>;
  source: EcgSource;
}

/** Time-anchored teaching annotation drawn over the tracing. */
export interface EcgAnnotation {
  id: string;
  /** Start time in seconds from the beginning of the record. */
  t0: number;
  /** Optional end time (interval annotation). */
  t1?: number;
  /** Restrict to specific leads; omit for all leads. */
  leads?: LeadName[];
  label: { en: string; nl: string };
  tone?: "info" | "warning" | "danger" | "success";
}
