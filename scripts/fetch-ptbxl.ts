/**
 * Downloads a curated subset of PTB-XL (PhysioNet, CC BY 4.0) at 500 Hz and converts each
 * record into the platform's compact JSON format under public/ecg/ptbxl/.
 *
 * Usage: npm run ecg:fetch-ptbxl
 *
 * Citation:
 *   Wagner, P., Strodthoff, N., Bousseljot, R., Samek, W., & Schaeffter, T. (2022).
 *   PTB-XL, a large publicly available electrocardiography dataset (version 1.0.3). PhysioNet.
 *   https://doi.org/10.13026/kfzx-aw45
 *   Goldberger, A., et al. (2000). PhysioBank, PhysioToolkit, and PhysioNet. Circulation 101(23), e215–e220.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseHeader, parseSignals } from "../src/lib/ecg/wfdb";
import { encodeRecord } from "../src/lib/ecg/codec";
import { PTBXL_SELECTION } from "../src/data/ptbxl-selection";
import type { EcgRecord } from "../src/lib/ecg/types";

const BASE = "https://physionet.org/files/ptb-xl/1.0.3/";
const OUT_DIR = path.join(process.cwd(), "public", "ecg", "ptbxl");
const CITATION =
  "Wagner P, Strodthoff N, Bousseljot R, Samek W, Schaeffter T. PTB-XL, a large publicly available electrocardiography dataset (v1.0.3). PhysioNet, 2022. https://doi.org/10.13026/kfzx-aw45";

async function fetchBytes(url: string): Promise<Uint8Array> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
      return new Uint8Array(await res.arrayBuffer());
    } catch (err) {
      if (attempt === 4) throw err;
      await new Promise((r) => setTimeout(r, 1500 * attempt));
    }
  }
  throw new Error("unreachable");
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest: Array<{ key: string; id: string; ecgId: number; file: string }> = [];
  for (const [key, sel] of Object.entries(PTBXL_SELECTION)) {
    const id = `ptbxl-${String(sel.ecgId).padStart(5, "0")}`;
    const heaText = new TextDecoder().decode(await fetchBytes(`${BASE}${sel.file}.hea`));
    const header = parseHeader(heaText);
    const dat = await fetchBytes(`${BASE}${sel.file}.dat`);
    const leads = parseSignals(header, dat);
    const record: EcgRecord = {
      id,
      fs: header.fs,
      durationSec: header.nSamples / header.fs,
      leads,
      source: {
        kind: "ptbxl",
        ecgId: sel.ecgId,
        scpCodes: sel.scp,
        age: sel.age,
        sex: sel.sex,
        license: "CC BY 4.0",
        citation: CITATION,
      },
    };
    const file = `${id}.json`;
    await writeFile(path.join(OUT_DIR, file), JSON.stringify(encodeRecord(record)));
    manifest.push({ key, id, ecgId: sel.ecgId, file: `/ecg/ptbxl/${file}` });
    console.log(`✓ ${key.padEnd(8)} ${id} (${header.fs} Hz, ${header.nSamples} samples)`);
  }
  await writeFile(
    path.join(OUT_DIR, "ATTRIBUTION.md"),
    `# PTB-XL attribution\n\nThe recordings in this folder are a curated subset of the PTB-XL dataset, redistributed under the Creative Commons Attribution 4.0 International licence (CC BY 4.0).\n\n${CITATION}\n\nGoldberger A, Amaral L, Glass L, et al. PhysioBank, PhysioToolkit, and PhysioNet: Components of a new research resource for complex physiologic signals. Circulation. 2000;101(23):e215–e220.\n\nSignals are stored as little-endian int16 microvolts (base64) at 500 Hz, unchanged from the source apart from unit conversion.\n`,
  );
  await writeFile(path.join(process.cwd(), "src", "data", "ptbxl-manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`\nWrote ${manifest.length} records to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
