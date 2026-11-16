import type { EcgLibraryEntry } from "../types";
import { PTBXL_LIBRARY } from "./ptbxl";
import { SYNTHETIC_LIBRARY } from "./synthetic";

export const ECG_LIBRARY: EcgLibraryEntry[] = [...PTBXL_LIBRARY, ...SYNTHETIC_LIBRARY];

const byId = new Map(ECG_LIBRARY.map((e) => [e.id, e]));

export function getEcgEntry(id: string): EcgLibraryEntry | undefined {
  return byId.get(id);
}
