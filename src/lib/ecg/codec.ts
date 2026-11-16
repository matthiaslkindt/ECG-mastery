import { LEAD_NAMES, type EcgRecord, type EcgRecordFile, type LeadName } from "./types";

/* Base64 helpers that work in both Node and the browser without Buffer. */
function bytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin);
}

function base64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== "undefined") return new Uint8Array(Buffer.from(b64, "base64"));
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Encode a record into the compact on-disk file format (int16 microvolts, base64). */
export function encodeRecord(rec: EcgRecord): EcgRecordFile {
  const data = {} as Record<LeadName, string>;
  for (const lead of LEAD_NAMES) {
    const sig = rec.leads[lead];
    const i16 = new Int16Array(sig.length);
    for (let i = 0; i < sig.length; i++) {
      const uv = Math.round(sig[i]! * 1000);
      i16[i] = Math.max(-32768, Math.min(32767, uv));
    }
    data[lead] = bytesToBase64(new Uint8Array(i16.buffer, i16.byteOffset, i16.byteLength));
  }
  return {
    id: rec.id,
    fs: rec.fs,
    durationSec: rec.durationSec,
    units: "uV",
    encoding: "int16le-base64",
    leads: [...LEAD_NAMES],
    data,
    source: rec.source,
  };
}

/** Decode a file back into a record with Float32 millivolt signals. */
export function decodeRecord(file: EcgRecordFile): EcgRecord {
  const leads = {} as Record<LeadName, Float32Array>;
  for (const lead of LEAD_NAMES) {
    const bytes = base64ToBytes(file.data[lead]);
    // Ensure 2-byte alignment for the Int16Array view.
    const aligned = new Uint8Array(bytes.length);
    aligned.set(bytes);
    const i16 = new Int16Array(aligned.buffer, 0, aligned.length >> 1);
    const f32 = new Float32Array(i16.length);
    for (let i = 0; i < i16.length; i++) f32[i] = i16[i]! / 1000;
    leads[lead] = f32;
  }
  return { id: file.id, fs: file.fs, durationSec: file.durationSec, leads, source: file.source };
}
