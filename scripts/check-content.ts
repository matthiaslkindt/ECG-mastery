/**
 * Editorial status report: prints the medical and Dutch-translation review state of every
 * content item so editors can see what still needs independent sign-off.
 *
 * Usage: npm run content:check [-- --fail-on-draft]
 */
import { CURRICULUM } from "../src/lib/content/curriculum";
import { CASES } from "../src/lib/content/cases";
import { ASSESSMENTS } from "../src/lib/content/assessments";
import { ECG_LIBRARY } from "../src/lib/content/library";
import type { ContentReview } from "../src/lib/content/types";

interface Row { kind: string; id: string; title: string; medical: string; nl: string; sourceVersion: number }
const rows: Row[] = [];
const push = (kind: string, id: string, title: string, r: ContentReview) => rows.push({ kind, id, title, medical: r.medical.status, nl: r.translationNl.status, sourceVersion: r.sourceVersion });

for (const m of CURRICULUM) {
  push("module", m.id, m.title.en, m.review);
  for (const l of m.lessons) push("lesson", l.id, l.title.en, l.review);
}
for (const c of CASES) push("case", c.id, c.title.en, c.review);
for (const a of ASSESSMENTS.filter((x) => x.kind === "summative")) push("assessment", a.id, a.title.en, a.review);
for (const e of ECG_LIBRARY) push("ecg", e.id, e.title.en, e.review);

const pad = (s: string, n: number) => s.padEnd(n).slice(0, n);
console.log(`${pad("kind", 11)}${pad("id", 24)}${pad("medical", 16)}${pad("nl", 16)}title`);
for (const r of rows) console.log(`${pad(r.kind, 11)}${pad(r.id, 24)}${pad(r.medical, 16)}${pad(r.nl, 16)}${r.title}`);

const tally = (f: (r: Row) => string) => rows.reduce<Record<string, number>>((acc, r) => ((acc[f(r)] = (acc[f(r)] ?? 0) + 1), acc), {});
console.log("\nMedical review:", tally((r) => r.medical));
console.log("Dutch translation:", tally((r) => r.nl));

if (process.argv.includes("--fail-on-draft")) {
  const drafts = rows.filter((r) => r.medical !== "approved" || r.nl !== "approved");
  if (drafts.length) {
    console.error(`\n${drafts.length} item(s) not fully approved.`);
    process.exit(1);
  }
}
