import type { Module } from "../types";
import { REFS, authored } from "./_shared";

export const MODULE_CONDUCTION: Module = {
  id: "m03",
  slug: "intervals-and-conduction",
  order: 3,
  level: 2,
  title: { en: "Intervals and conduction disease", nl: "Intervallen en geleidingsstoornissen" },
  description: {
    en: "AV blocks of every degree, bundle branch and fascicular blocks, and how to decide who needs a pacemaker.",
    nl: "AV-blokken van elke graad, bundeltak- en fasciculaire blokken, en hoe u bepaalt wie een pacemaker nodig heeft.",
  },
  competencies: ["intervals", "conduction-blocks", "bradyarrhythmia-pacing"],
  summativeTestSlug: "conduction-test",
  review: authored([REFS.aha2009, REFS.esc2021pacing]),
  lessons: [
    {
      id: "m03-l01",
      slug: "av-blocks",
      level: 2,
      estimatedMinutes: 25,
      title: { en: "Atrioventricular block", nl: "Atrioventriculair blok" },
      summary: { en: "First-, second- (Mobitz I and II, 2:1, high-grade) and third-degree block, and the level of the lesion.", nl: "Eerste-, tweede- (Mobitz I en II, 2:1, hooggradig) en derdegraads blok, en het niveau van de laesie." },
      competencies: ["conduction-blocks", "bradyarrhythmia-pacing"],
      objectives: [
        { id: "o1", competency: "conduction-blocks", text: { en: "Classify AV block by PR behaviour and P:QRS ratio.", nl: "AV-blok classificeren op basis van PR-gedrag en P:QRS-verhouding." } },
        { id: "o2", competency: "bradyarrhythmia-pacing", text: { en: "Infer nodal versus infranodal block from PR pattern, QRS width and escape rate, and state the pacing implications.", nl: "Nodaal versus infranodaal blok afleiden uit PR-patroon, QRS-breedte en escape-frequentie, en de pacing-implicaties benoemen." } },
      ],
      blocks: [
        { type: "table", header: [{ en: "Degree", nl: "Graad" }, { en: "ECG", nl: "ECG" }, { en: "Usual level", nl: "Gebruikelijk niveau" }, { en: "Management", nl: "Beleid" }],
          rows: [
            [{ en: "First", nl: "Eerste" }, { en: "PR > 200 ms, all P conducted", nl: "PR > 200 ms, alle P voortgeleid" }, { en: "AV node", nl: "AV-knoop" }, { en: "None; review drugs", nl: "Geen; medicatie herzien" }],
            [{ en: "Second, Mobitz I", nl: "Tweede, Mobitz I" }, { en: "Progressive PR lengthening then dropped QRS; grouped beating", nl: "Progressieve PR-verlenging, dan uitval van QRS; gegroepeerde slagen" }, { en: "AV node", nl: "AV-knoop" }, { en: "Observe; atropine if symptomatic", nl: "Observeren; atropine bij klachten" }],
            [{ en: "Second, Mobitz II", nl: "Tweede, Mobitz II" }, { en: "Fixed PR, sudden non-conducted P; often wide QRS", nl: "Vast PR, plotse niet-voortgeleide P; vaak breed QRS" }, { en: "His–Purkinje", nl: "His–Purkinje" }, { en: "Permanent pacemaker", nl: "Permanente pacemaker" }],
            [{ en: "2:1", nl: "2:1" }, { en: "Alternate P conducted; cannot be typed", nl: "Om en om P voortgeleid; niet te typeren" }, { en: "Either", nl: "Beide" }, { en: "Narrow QRS + normal PR → likely nodal; wide QRS → likely infranodal", nl: "Smal QRS + normaal PR → waarschijnlijk nodaal; breed QRS → waarschijnlijk infranodaal" }],
            [{ en: "Third (complete)", nl: "Derde (totaal)" }, { en: "AV dissociation with atrial rate > ventricular rate; regular escape", nl: "AV-dissociatie met atriale frequentie > kamerfrequentie; regelmatig escape" }, { en: "Node (narrow escape 40–60) or His–Purkinje (wide escape 20–40)", nl: "Knoop (smal escape 40–60) of His–Purkinje (breed escape 20–40)" }, { en: "Pacemaker unless reversible", nl: "Pacemaker tenzij reversibel" }],
          ] },
        { type: "ecg", ecgId: "synth-mobitz-1", layout: "3x4+rhythm", caption: { en: "Wenckebach 4:3: measure successive PR intervals on the rhythm strip and note the pause that is shorter than two PP intervals.", nl: "Wenckebach 4:3: meet opeenvolgende PR-intervallen op de ritmestrook en let op de pauze die korter is dan twee PP-intervallen." } },
        { type: "ecg", ecgId: "synth-mobitz-2", layout: "3x4+rhythm", caption: { en: "Mobitz II 3:2 with RBBB: the PR does not change before the dropped beat. Infranodal disease — pacing is indicated.", nl: "Mobitz II 3:2 met RBTB: het PR verandert niet vóór de uitgevallen slag. Infranodale ziekte — pacing is geïndiceerd." } },
        { type: "ecg", ecgId: "synth-chb", layout: "3x4+rhythm", caption: { en: "Complete heart block: mark the P waves with calipers and show that they march through the QRS complexes at their own rate.", nl: "Totaal AV-blok: markeer de P-toppen met de passer en laat zien dat ze in hun eigen tempo door de QRS-complexen heen lopen." } },
        { type: "callout", tone: "pearl", title: { en: "Vagal versus infranodal", nl: "Vagaal versus infranodaal" }, text: {
          en: "Block that improves with exercise or atropine is nodal. Block that worsens with exercise or atropine (because the atrial rate rises and more impulses hit a refractory His–Purkinje system) is infranodal. Both drug-induced block in a diseased conduction system and asymptomatic 2:1 block with wide QRS warrant electrophysiology review.",
          nl: "Blok dat verbetert bij inspanning of atropine is nodaal. Blok dat verergert bij inspanning of atropine (omdat de atriale frequentie stijgt en meer impulsen op een refractair His–Purkinje-systeem stuiten) is infranodaal. Zowel medicatiegeïnduceerd blok in een ziek geleidingssysteem als asymptomatisch 2:1-blok met breed QRS verdienen elektrofysiologische beoordeling.",
        } },
        { type: "check", question: {
          id: "m03-l01-q1", kind: "single", competency: "conduction-blocks", level: 2,
          stem: { en: "A rhythm strip shows P waves at 80/min, QRS complexes at 40/min and a constant PR of 200 ms on the conducted beats. QRS is 150 ms. Which is correct?", nl: "Een ritmestrook toont P-toppen op 80/min, QRS-complexen op 40/min en een constant PR van 200 ms bij de voortgeleide slagen. QRS 150 ms. Wat is juist?" },
          options: [
            { id: "a", text: { en: "This is Mobitz I and can be observed", nl: "Dit is Mobitz I en kan worden geobserveerd" }, correct: false },
            { id: "b", text: { en: "This is 2:1 AV block, probably infranodal given the wide QRS; pacing is indicated", nl: "Dit is 2:1 AV-blok, waarschijnlijk infranodaal gezien het brede QRS; pacing is geïndiceerd" }, correct: true },
            { id: "c", text: { en: "This is complete heart block", nl: "Dit is totaal AV-blok" }, correct: false, rationale: { en: "A constant PR on conducted beats proves AV association.", nl: "Een constant PR bij voortgeleide slagen bewijst AV-associatie." } },
            { id: "d", text: { en: "This is sinus bradycardia with first-degree block", nl: "Dit is sinusbradycardie met eerstegraads blok" }, correct: false },
          ],
          explanation: { en: "With 2:1 conduction the Wenckebach pattern cannot be seen. The wide QRS points to His–Purkinje disease, so this behaves like Mobitz II.", nl: "Bij 2:1-geleiding is het Wenckebach-patroon niet zichtbaar. Het brede QRS wijst op His–Purkinje-ziekte, dus dit gedraagt zich als Mobitz II." },
        } },
      ],
      review: authored([REFS.esc2021pacing]),
    },
    {
      id: "m03-l02",
      slug: "bundle-branch-and-fascicular-blocks",
      level: 2,
      estimatedMinutes: 25,
      title: { en: "Bundle branch and fascicular blocks", nl: "Bundeltak- en fasciculaire blokken" },
      summary: { en: "RBBB, LBBB, LAFB, LPFB and their combinations; what each does to repolarisation.", nl: "RBTB, LBTB, LAFB, LPFB en hun combinaties; wat elk doet met de repolarisatie." },
      competencies: ["conduction-blocks", "axis"],
      objectives: [
        { id: "o1", competency: "conduction-blocks", text: { en: "Apply the AHA/ACCF/HRS criteria for complete and incomplete RBBB and LBBB.", nl: "De AHA/ACCF/HRS-criteria voor compleet en incompleet RBTB en LBTB toepassen." } },
        { id: "o2", competency: "axis", text: { en: "Diagnose LAFB and LPFB from axis and QRS pattern after excluding other causes.", nl: "LAFB en LPFB diagnosticeren uit as en QRS-patroon na uitsluiting van andere oorzaken." } },
        { id: "o3", competency: "conduction-blocks", text: { en: "Explain why secondary ST-T changes are expected and how they interfere with ischaemia diagnosis.", nl: "Verklaren waarom secundaire ST-T-veranderingen verwacht zijn en hoe ze de ischemiediagnostiek beïnvloeden." } },
      ],
      blocks: [
        { type: "table", header: [{ en: "Block", nl: "Blok" }, { en: "QRS", nl: "QRS" }, { en: "Key morphology", nl: "Kernmorfologie" }, { en: "Repolarisation", nl: "Repolarisatie" }],
          rows: [
            [{ en: "RBBB", nl: "RBTB" }, { en: "≥ 120 ms", nl: "≥ 120 ms" }, { en: "rsR′ in V1–V2; broad S (> 40 ms) in I, aVL, V5–V6; R-peak time > 50 ms in V1", nl: "rsR′ in V1–V2; brede S (> 40 ms) in I, aVL, V5–V6; R-top-tijd > 50 ms in V1" }, { en: "T inverted V1–V2 (discordant to terminal R′)", nl: "T negatief V1–V2 (discordant aan terminale R′)" }],
            [{ en: "LBBB", nl: "LBTB" }, { en: "≥ 120 ms", nl: "≥ 120 ms" }, { en: "Broad notched/slurred R in I, aVL, V5–V6; absent q in those leads; QS or rS in V1–V3; R-peak time > 60 ms in V5–V6", nl: "Brede gekerfde R in I, aVL, V5–V6; afwezige q in die afleidingen; QS of rS in V1–V3; R-top-tijd > 60 ms in V5–V6" }, { en: "ST-T discordant to the QRS in all leads", nl: "ST-T discordant aan het QRS in alle afleidingen" }],
            [{ en: "LAFB", nl: "LAFB" }, { en: "< 120 ms", nl: "< 120 ms" }, { en: "Axis −45° to −90°; qR in aVL; rS in II, III, aVF; R-peak time in aVL ≥ 45 ms", nl: "As −45° tot −90°; qR in aVL; rS in II, III, aVF; R-top-tijd in aVL ≥ 45 ms" }, { en: "None", nl: "Geen" }],
            [{ en: "LPFB", nl: "LPFB" }, { en: "< 120 ms", nl: "< 120 ms" }, { en: "Axis +90° to +180°; rS in I, aVL; qR in III, aVF; exclude RVH, lateral MI, lung disease", nl: "As +90° tot +180°; rS in I, aVL; qR in III, aVF; sluit RVH, lateraal infarct en longziekte uit" }, { en: "None", nl: "Geen" }],
          ] },
        { type: "ecg", ecgId: "ptbxl-00621", layout: "3x4+rhythm", caption: { en: "Complete RBBB: rsR′ in V1 with a broad terminal S in I and V6. The initial 60 ms are normal, so Q waves and ST elevation remain interpretable.", nl: "Compleet RBTB: rsR′ in V1 met brede terminale S in I en V6. De eerste 60 ms zijn normaal, dus Q-golven en ST-elevatie blijven beoordeelbaar." } },
        { type: "ecg", ecgId: "ptbxl-00286", layout: "3x4+rhythm", caption: { en: "Complete LBBB: the whole QRS is abnormal. Expect ST elevation in V1–V3 and ST depression with T inversion in the lateral leads — this is not ischaemia.", nl: "Compleet LBTB: het hele QRS is abnormaal. Verwacht ST-elevatie in V1–V3 en ST-depressie met T-inversie in de laterale afleidingen — dit is geen ischemie." } },
        { type: "ecg", ecgId: "ptbxl-00041", layout: "3x4", caption: { en: "LAFB: marked left axis with narrow QRS, qR in aVL and rS inferiorly.", nl: "LAFB: sterke linker as met smal QRS, qR in aVL en rS inferieur." } },
        { type: "callout", tone: "clinical", title: { en: "Bifascicular and 'trifascicular' block", nl: "Bifasciculair en 'trifasciculair' blok" }, text: {
          en: "RBBB + LAFB (or LPFB) is bifascicular block. Add a prolonged PR and the term 'trifascicular' is often used, although the PR prolongation may be nodal. Asymptomatic bifascicular block does not need a pacemaker; with syncope and no other explanation, an electrophysiology study or empirical pacing is reasonable (ESC 2021).",
          nl: "RBTB + LAFB (of LPFB) is bifasciculair blok. Met een verlengd PR wordt vaak 'trifasciculair' gezegd, hoewel de PR-verlenging nodaal kan zijn. Asymptomatisch bifasciculair blok behoeft geen pacemaker; bij syncope zonder andere verklaring is een elektrofysiologisch onderzoek of empirische pacing redelijk (ESC 2021).",
        } },
        { type: "callout", tone: "pitfall", title: { en: "Ischaemia in LBBB and paced rhythm", nl: "Ischemie bij LBTB en gepacet ritme" }, text: {
          en: "Sgarbossa criteria: concordant ST elevation ≥ 1 mm (5 points), concordant ST depression ≥ 1 mm in V1–V3 (3 points), discordant ST elevation ≥ 5 mm (2 points); ≥ 3 points is specific but insensitive. The modified Smith rule replaces the last criterion with discordant ST elevation ≥ 25% of the preceding S-wave depth and improves sensitivity.",
          nl: "Sgarbossa-criteria: concordante ST-elevatie ≥ 1 mm (5 punten), concordante ST-depressie ≥ 1 mm in V1–V3 (3 punten), discordante ST-elevatie ≥ 5 mm (2 punten); ≥ 3 punten is specifiek maar weinig sensitief. De gemodificeerde regel van Smith vervangt het laatste criterium door discordante ST-elevatie ≥ 25% van de voorafgaande S-diepte en verbetert de sensitiviteit.",
        } },
        { type: "check", question: {
          id: "m03-l02-q1", kind: "multiple", competency: "conduction-blocks", level: 2,
          stem: { en: "Which findings are required for complete LBBB? Select all that apply.", nl: "Welke bevindingen zijn vereist voor compleet LBTB? Selecteer alle juiste antwoorden." },
          options: [
            { id: "a", text: { en: "QRS ≥ 120 ms", nl: "QRS ≥ 120 ms" }, correct: true },
            { id: "b", text: { en: "Broad, notched R in I, aVL, V5, V6", nl: "Brede, gekerfde R in I, aVL, V5, V6" }, correct: true },
            { id: "c", text: { en: "rsR′ pattern in V1", nl: "rsR′-patroon in V1" }, correct: false, rationale: { en: "That is RBBB.", nl: "Dat is RBTB." } },
            { id: "d", text: { en: "Absence of septal q waves in I, V5, V6", nl: "Afwezigheid van septale q-golven in I, V5, V6" }, correct: true },
            { id: "e", text: { en: "Left axis deviation", nl: "Linker asdeviatie" }, correct: false, rationale: { en: "Common but not required.", nl: "Vaak aanwezig maar niet vereist." } },
          ],
          explanation: { en: "LBBB reverses septal activation (hence no septal q) and delays the whole left ventricle (broad notched R, late R-peak time).", nl: "LBTB keert de septale activatie om (dus geen septale q) en vertraagt de hele linkerkamer (brede gekerfde R, late R-top-tijd)." },
        } },
      ],
      review: authored([REFS.aha2009, REFS.sgarbossa1996, REFS.smith2012]),
    },
  ],
};
