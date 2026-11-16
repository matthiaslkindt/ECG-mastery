import type { Module } from "../types";
import { REFS, authored } from "./_shared";

export const MODULE_HYPERTROPHY: Module = {
  id: "m04",
  slug: "chamber-enlargement",
  order: 4,
  level: 2,
  title: { en: "Atrial enlargement and ventricular hypertrophy", nl: "Boezemvergroting en kamerhypertrofie" },
  description: {
    en: "P-wave morphology, voltage criteria, strain patterns and the many reasons the criteria fail.",
    nl: "P-topmorfologie, voltagecriteria, strainpatronen en de vele redenen waarom de criteria falen.",
  },
  competencies: ["chamber-enlargement"],
  review: authored([REFS.aha2009lvh]),
  lessons: [
    {
      id: "m04-l01",
      slug: "atrial-abnormality",
      level: 2,
      estimatedMinutes: 15,
      title: { en: "Left and right atrial abnormality", nl: "Linker- en rechteratriumbelasting" },
      summary: { en: "Reading the P wave in II and V1.", nl: "De P-top beoordelen in II en V1." },
      competencies: ["chamber-enlargement"],
      objectives: [
        { id: "o1", competency: "chamber-enlargement", text: { en: "Apply P-wave duration, notching and V1 terminal-force criteria for left atrial abnormality.", nl: "P-duur, kerving en V1-terminale-krachtcriteria toepassen voor linkeratriumbelasting." } },
        { id: "o2", competency: "chamber-enlargement", text: { en: "Recognise P pulmonale and its associations.", nl: "P pulmonale en zijn associaties herkennen." } },
      ],
      blocks: [
        { type: "paragraph", text: {
          en: "The first half of the P wave is right atrial, the second half left atrial. Right atrial enlargement therefore makes the P taller (≥ 2.5 mm in II, III, aVF; ≥ 1.5 mm positive in V1) without prolonging it; left atrial enlargement makes it longer (≥ 120 ms), notched in II with peaks > 40 ms apart, and deepens the terminal negative deflection in V1 (≥ 1 mm × 40 ms, the Morris index).",
          nl: "De eerste helft van de P-top is rechteratriaal, de tweede helft linkeratriaal. Rechteratriumvergroting maakt de P dus hoger (≥ 2,5 mm in II, III, aVF; ≥ 1,5 mm positief in V1) zonder verlenging; linkeratriumvergroting maakt hem langer (≥ 120 ms), gekerfd in II met toppen > 40 ms uit elkaar, en verdiept de terminale negatieve uitslag in V1 (≥ 1 mm × 40 ms, de Morris-index).",
        } },
        { type: "ecg", ecgId: "ptbxl-06685", layout: "3x4+rhythm", focusLeads: ["II", "V1"], caption: { en: "Left atrial abnormality: inspect the P wave in II (broad, notched) and the deep terminal negativity in V1.", nl: "Linkeratriumbelasting: bekijk de P in II (breed, gekerfd) en de diepe terminale negativiteit in V1." } },
        { type: "callout", tone: "pearl", text: {
          en: "'Abnormality' is preferred over 'enlargement' because conduction delay in a normal-sized atrium produces the same ECG. Left atrial abnormality predicts AF and is a supporting criterion for LVH (Romhilt–Estes).",
          nl: "'Belasting/afwijking' heeft de voorkeur boven 'vergroting' omdat geleidingsvertraging in een normaal groot atrium hetzelfde ECG geeft. Linkeratriumbelasting voorspelt AF en is een ondersteunend criterium voor LVH (Romhilt–Estes).",
        } },
        { type: "check", question: {
          id: "m04-l01-q1", kind: "single", competency: "chamber-enlargement", level: 2,
          stem: { en: "Which finding supports left atrial abnormality?", nl: "Welke bevinding ondersteunt linkeratriumbelasting?" },
          options: [
            { id: "a", text: { en: "P wave 3 mm tall in lead II", nl: "P-top 3 mm hoog in afleiding II" }, correct: false, rationale: { en: "Tall P = right atrial.", nl: "Hoge P = rechteratriaal." } },
            { id: "b", text: { en: "Terminal negative P in V1 of 1 mm depth and 40 ms width", nl: "Terminale negatieve P in V1 van 1 mm diep en 40 ms breed" }, correct: true },
            { id: "c", text: { en: "PR interval 220 ms", nl: "PR-interval 220 ms" }, correct: false },
            { id: "d", text: { en: "Inverted P in aVR", nl: "Negatieve P in aVR" }, correct: false, rationale: { en: "Normal for sinus rhythm.", nl: "Normaal bij sinusritme." } },
          ],
          explanation: { en: "The terminal V1 force reflects delayed, posteriorly directed left atrial activation.", nl: "De terminale kracht in V1 weerspiegelt vertraagde, posterieur gerichte linkeratriale activatie." },
        } },
      ],
      review: authored([REFS.aha2009lvh]),
    },
    {
      id: "m04-l02",
      slug: "ventricular-hypertrophy",
      level: 2,
      estimatedMinutes: 25,
      title: { en: "Left and right ventricular hypertrophy", nl: "Linker- en rechterkamerhypertrofie" },
      summary: { en: "Sokolow–Lyon, Cornell and Romhilt–Estes; strain; RVH patterns.", nl: "Sokolow–Lyon, Cornell en Romhilt–Estes; strain; RVH-patronen." },
      competencies: ["chamber-enlargement"],
      objectives: [
        { id: "o1", competency: "chamber-enlargement", text: { en: "Calculate the Sokolow–Lyon and Cornell voltages and know their sex-specific thresholds.", nl: "De Sokolow–Lyon- en Cornell-voltages berekenen en hun geslachtsspecifieke drempels kennen." } },
        { id: "o2", competency: "chamber-enlargement", text: { en: "Identify the LVH strain pattern and distinguish it from ischaemia.", nl: "Het LVH-strainpatroon herkennen en onderscheiden van ischemie." } },
        { id: "o3", competency: "chamber-enlargement", text: { en: "Recognise RVH and its differential for a dominant R in V1.", nl: "RVH herkennen en de differentiaaldiagnose van een dominante R in V1 kennen." } },
      ],
      blocks: [
        { type: "table", caption: { en: "LVH criteria", nl: "LVH-criteria" }, header: [{ en: "Criterion", nl: "Criterium" }, { en: "Definition", nl: "Definitie" }, { en: "Note", nl: "Opmerking" }],
          rows: [
            [{ en: "Sokolow–Lyon", nl: "Sokolow–Lyon" }, { en: "S V1 + R V5 or V6 ≥ 35 mm; or R aVL ≥ 11 mm", nl: "S V1 + R V5 of V6 ≥ 35 mm; of R aVL ≥ 11 mm" }, { en: "Sensitivity ~25%, specificity ~95%; unreliable < 35 years", nl: "Sensitiviteit ~25%, specificiteit ~95%; onbetrouwbaar < 35 jaar" }],
            [{ en: "Cornell", nl: "Cornell" }, { en: "R aVL + S V3 > 28 mm (men), > 20 mm (women)", nl: "R aVL + S V3 > 28 mm (mannen), > 20 mm (vrouwen)" }, { en: "Better in obesity; used in LIFE trial", nl: "Beter bij obesitas; gebruikt in de LIFE-trial" }],
            [{ en: "Romhilt–Estes", nl: "Romhilt–Estes" }, { en: "Points for voltage (3), strain (3), LAA (3), LAD (2), QRS ≥ 90 ms (1), R-peak time (1)", nl: "Punten voor voltage (3), strain (3), LAB (3), linker as (2), QRS ≥ 90 ms (1), R-top-tijd (1)" }, { en: "≥ 5 definite, 4 probable", nl: "≥ 5 zeker, 4 waarschijnlijk" }],
          ] },
        { type: "ecg", ecgId: "ptbxl-00138", layout: "3x4", caption: { en: "LVH: add S in V1 to R in V5 with the calipers. Look for asymmetric ST depression and T inversion in V5–V6 (strain).", nl: "LVH: tel S in V1 op bij R in V5 met de passer. Zoek asymmetrische ST-depressie en T-inversie in V5–V6 (strain)." } },
        { type: "ecg", ecgId: "synth-lvh", layout: "3x4", caption: { en: "Synthetic LVH with strain and left atrial abnormality for comparison: the lateral ST-T changes slope downwards into an asymmetric inverted T.", nl: "Synthetische LVH met strain en linkeratriumbelasting ter vergelijking: de laterale ST-T-veranderingen lopen aflopend over in een asymmetrisch negatieve T." } },
        { type: "ecg", ecgId: "ptbxl-02417", layout: "3x4", caption: { en: "RVH: dominant R in V1, deep S in V6, widespread T inversion. Consider the differential of a dominant R in V1.", nl: "RVH: dominante R in V1, diepe S in V6, uitgebreide T-inversie. Overweeg de differentiaaldiagnose van een dominante R in V1." } },
        { type: "callout", tone: "pitfall", title: { en: "Voltage is not hypertrophy", nl: "Voltage is geen hypertrofie" }, text: {
          en: "High voltages are common in young, slim people, athletes and with thin chest walls; LVH is under-called in obesity and COPD. The ECG is a poor test for LV mass — echocardiography or MRI decides. Conversely, LVH with strain in a patient with chest pain can mimic or mask ischaemia; compare with an old ECG.",
          nl: "Hoge voltages zijn gebruikelijk bij jonge, slanke mensen, sporters en dunne thoraxwanden; LVH wordt ondergediagnosticeerd bij obesitas en COPD. Het ECG is een slechte test voor LV-massa — echocardiografie of MRI beslist. Omgekeerd kan LVH met strain bij een patiënt met pijn op de borst ischemie nabootsen of maskeren; vergelijk met een oud ECG.",
        } },
        { type: "check", question: {
          id: "m04-l02-q1", kind: "single", competency: "chamber-enlargement", level: 2,
          stem: { en: "A 68-year-old woman: R in aVL 9 mm, S in V3 14 mm, S in V1 15 mm, R in V5 22 mm. Which statement is correct?", nl: "Een 68-jarige vrouw: R in aVL 9 mm, S in V3 14 mm, S in V1 15 mm, R in V5 22 mm. Welke uitspraak is juist?" },
          options: [
            { id: "a", text: { en: "Neither Sokolow–Lyon nor Cornell criteria are met", nl: "Noch de Sokolow–Lyon- noch de Cornell-criteria zijn vervuld" }, correct: false },
            { id: "b", text: { en: "Sokolow–Lyon is met (37 mm) and Cornell is met for a woman (23 mm)", nl: "Sokolow–Lyon is vervuld (37 mm) en Cornell is vervuld voor een vrouw (23 mm)" }, correct: true },
            { id: "c", text: { en: "Only Sokolow–Lyon is met", nl: "Alleen Sokolow–Lyon is vervuld" }, correct: false, rationale: { en: "Cornell for women is > 20 mm; 9 + 14 = 23 mm.", nl: "Cornell bij vrouwen is > 20 mm; 9 + 14 = 23 mm." } },
            { id: "d", text: { en: "Only Cornell is met", nl: "Alleen Cornell is vervuld" }, correct: false },
          ],
          explanation: { en: "Sokolow–Lyon: 15 + 22 = 37 mm ≥ 35. Cornell: 9 + 14 = 23 mm > 20 (women).", nl: "Sokolow–Lyon: 15 + 22 = 37 mm ≥ 35. Cornell: 9 + 14 = 23 mm > 20 (vrouwen)." },
        } },
      ],
      review: authored([REFS.aha2009lvh]),
    },
  ],
};
