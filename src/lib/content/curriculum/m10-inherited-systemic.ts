import type { Module } from "../types";
import { REFS, authored } from "./_shared";

export const MODULE_INHERITED_SYSTEMIC: Module = {
  id: "m10",
  slug: "inherited-and-systemic",
  order: 10,
  level: 4,
  title: { en: "Inherited syndromes, electrolytes and drugs", nl: "Erfelijke syndromen, elektrolyten en medicatie" },
  description: {
    en: "Brugada, long QT, WPW, HCM and ARVC patterns; potassium, calcium, digoxin, sodium-channel blockers, hypothermia and pulmonary embolism.",
    nl: "Brugada-, lang-QT-, WPW-, HCM- en ARVC-patronen; kalium, calcium, digoxine, natriumkanaalblokkers, hypothermie en longembolie.",
  },
  competencies: ["inherited-arrhythmia", "systemic-metabolic", "intervals"],
  review: authored([REFS.esc2022va]),
  lessons: [
    {
      id: "m10-l01",
      slug: "channelopathies-and-pre-excitation",
      level: 4,
      estimatedMinutes: 30,
      title: { en: "Channelopathies and pre-excitation", nl: "Kanalopathieën en pre-excitatie" },
      summary: { en: "Brugada type 1, QT prolongation and shortening, WPW localisation and sudden-death risk markers.", nl: "Brugada type 1, QT-verlenging en -verkorting, WPW-lokalisatie en markers voor plotse dood." },
      competencies: ["inherited-arrhythmia", "intervals"],
      objectives: [
        { id: "o1", competency: "inherited-arrhythmia", text: { en: "Distinguish the diagnostic Brugada type 1 pattern from RBBB, early repolarisation and high lead placement.", nl: "Het diagnostische Brugada type 1-patroon onderscheiden van RBTB, vroege repolarisatie en hoge elektrodeplaatsing." } },
        { id: "o2", competency: "intervals", text: { en: "Measure QTc correctly at slow and fast rates and recognise LQT1/2/3 T-wave morphologies.", nl: "QTc correct meten bij lage en hoge frequenties en LQT1/2/3-T-topmorfologieën herkennen." } },
        { id: "o3", competency: "inherited-arrhythmia", text: { en: "Localise an accessory pathway approximately from the delta-wave polarity in V1 and the inferior leads.", nl: "Een accessoire bundel globaal lokaliseren aan de polariteit van de deltagolf in V1 en de inferieure afleidingen." } },
      ],
      blocks: [
        { type: "ecg", ecgId: "synth-brugada", layout: "3x4", focusLeads: ["V1", "V2"], caption: { en: "Brugada type 1: coved ST elevation ≥ 2 mm with a slowly descending ST that ends in a negative T. There is no broad S in I or V6, distinguishing it from RBBB.", nl: "Brugada type 1: koepelvormige ST-elevatie ≥ 2 mm met een langzaam dalend ST dat eindigt in een negatieve T. Er is geen brede S in I of V6, wat het onderscheidt van RBTB." } },
        { type: "table", caption: { en: "Long QT subtypes", nl: "Lang-QT-subtypen" }, header: [{ en: "Type", nl: "Type" }, { en: "Channel", nl: "Kanaal" }, { en: "T wave", nl: "T-top" }, { en: "Trigger", nl: "Trigger" }],
          rows: [
            [{ en: "LQT1", nl: "LQT1" }, { en: "KCNQ1 (IKs)", nl: "KCNQ1 (IKs)" }, { en: "Broad-based", nl: "Brede basis" }, { en: "Exercise, swimming", nl: "Inspanning, zwemmen" }],
            [{ en: "LQT2", nl: "LQT2" }, { en: "KCNH2 (IKr)", nl: "KCNH2 (IKr)" }, { en: "Low-amplitude, notched", nl: "Lage amplitude, gekerfd" }, { en: "Sudden noise, post-partum", nl: "Plots geluid, post-partum" }],
            [{ en: "LQT3", nl: "LQT3" }, { en: "SCN5A (INa)", nl: "SCN5A (INa)" }, { en: "Late-onset, long isoelectric ST", nl: "Laat begin, lang iso-elektrisch ST" }, { en: "Sleep, bradycardia", nl: "Slaap, bradycardie" }],
          ] },
        { type: "ecg", ecgId: "synth-long-qt", layout: "3x4+rhythm", caption: { en: "QTc ≈ 540 ms. Use the tangent method in II or V5: draw a line along the steepest downslope of the T to the baseline.", nl: "QTc ≈ 540 ms. Gebruik de tangentmethode in II of V5: trek een lijn langs de steilste neergaande flank van de T naar de basislijn." } },
        { type: "ecg", ecgId: "ptbxl-02145", layout: "3x4", caption: { en: "Real pre-excitation: positive delta in V1 and negative delta in III suggest a left posteroseptal / posterolateral pathway (Arruda algorithm).", nl: "Echte pre-excitatie: positieve delta in V1 en negatieve delta in III wijzen op een links-posteroseptale / posterolaterale bundel (Arruda-algoritme)." } },
        { type: "callout", tone: "clinical", title: { en: "Risk markers worth an immediate referral", nl: "Risicomarkers die directe verwijzing rechtvaardigen" }, text: {
          en: "Spontaneous type 1 Brugada pattern with syncope; QTc > 500 ms or any QTc prolongation with syncope; pre-excitation with a shortest pre-excited RR < 250 ms in AF; epsilon waves or T inversion V1–V3 in an adult with ventricular arrhythmia (ARVC); deep lateral Q or giant T inversion with LVH (HCM).",
          nl: "Spontaan type 1 Brugada-patroon met syncope; QTc > 500 ms of elke QTc-verlenging met syncope; pre-excitatie met kortste pre-geëxciteerd RR < 250 ms tijdens AF; epsilongolven of T-inversie V1–V3 bij een volwassene met kameraritmie (ARVC); diepe laterale Q of reusachtige T-inversie met LVH (HCM).",
        } },
        { type: "check", question: {
          id: "m10-l01-q1", kind: "single", competency: "inherited-arrhythmia", level: 4,
          stem: { en: "Which feature argues for a Brugada type 1 pattern rather than RBBB?", nl: "Welk kenmerk pleit voor een Brugada type 1-patroon in plaats van RBTB?" },
          options: [
            { id: "a", text: { en: "QRS duration of 130 ms", nl: "QRS-duur van 130 ms" }, correct: false },
            { id: "b", text: { en: "Absence of a wide terminal S wave in I and V6", nl: "Afwezigheid van een brede terminale S in I en V6" }, correct: true },
            { id: "c", text: { en: "A positive deflection at the end of the QRS in V1", nl: "Een positieve deflectie aan het einde van het QRS in V1" }, correct: false, rationale: { en: "Both have this; in Brugada it is a J-wave that descends into a coved ST rather than a true R′.", nl: "Beide hebben dit; bij Brugada is het een J-golf die overgaat in een koepelvormig ST in plaats van een echte R′." } },
            { id: "d", text: { en: "Inverted T wave in V1", nl: "Negatieve T in V1" }, correct: false },
          ],
          explanation: { en: "RBBB delays right-ventricular activation and produces a broad terminal S in the lateral leads; the Brugada pattern is a repolarisation/depolarisation abnormality confined to the RV outflow leads.", nl: "RBTB vertraagt de rechterkameractivatie en geeft een brede terminale S in de laterale afleidingen; het Brugada-patroon is een repolarisatie-/depolarisatiestoornis beperkt tot de RV-outflow-afleidingen." },
        } },
      ],
      review: authored([REFS.esc2022va]),
    },
    {
      id: "m10-l02",
      slug: "electrolytes-drugs-systemic",
      level: 3,
      estimatedMinutes: 25,
      title: { en: "Electrolytes, drugs and systemic disease", nl: "Elektrolyten, medicatie en systeemziekten" },
      summary: { en: "Potassium and calcium, digoxin, sodium-channel blockade, hypothermia, pulmonary embolism, pericardial effusion and raised intracranial pressure.", nl: "Kalium en calcium, digoxine, natriumkanaalblokkade, hypothermie, longembolie, pericardeffusie en verhoogde intracraniële druk." },
      competencies: ["systemic-metabolic"],
      objectives: [
        { id: "o1", competency: "systemic-metabolic", text: { en: "Describe the ECG progression of hyper- and hypokalaemia and the emergency treatment thresholds.", nl: "De ECG-progressie van hyper- en hypokaliëmie en de drempels voor spoedbehandeling beschrijven." } },
        { id: "o2", competency: "systemic-metabolic", text: { en: "Recognise digoxin effect versus toxicity, sodium-channel blocker toxicity and hypothermia.", nl: "Digoxine-effect versus -toxiciteit, natriumkanaalblokker-toxiciteit en hypothermie herkennen." } },
      ],
      blocks: [
        { type: "ecg", ecgId: "synth-hyperkalaemia", layout: "3x4", caption: { en: "Hyperkalaemia: tall, narrow, 'tented' T waves — symmetric and pointed, unlike the broad hyperacute T of ischaemia. P waves flatten and the QRS begins to widen.", nl: "Hyperkaliëmie: hoge, smalle, 'tentvormige' T-toppen — symmetrisch en spits, anders dan de brede hyperacute T van ischemie. P-toppen vlakken af en het QRS begint te verbreden." } },
        { type: "ecg", ecgId: "synth-hypokalaemia", layout: "3x4", caption: { en: "Hypokalaemia: flat T, prominent U, slight ST depression — the T–U fusion mimics a long QT.", nl: "Hypokaliëmie: vlakke T, prominente U, lichte ST-depressie — de T–U-fusie bootst een lang QT na." } },
        { type: "table", header: [{ en: "Condition", nl: "Aandoening" }, { en: "Signature", nl: "Kenmerk" }],
          rows: [
            [{ en: "Hypercalcaemia / hypocalcaemia", nl: "Hypercalciëmie / hypocalciëmie" }, { en: "Short QT (short ST) / long QT (long ST, normal T)", nl: "Kort QT (kort ST) / lang QT (lang ST, normale T)" }],
            [{ en: "Digoxin effect", nl: "Digoxine-effect" }, { en: "'Reverse-tick' sagging ST depression, short QT, flattened T; toxicity: any arrhythmia, classically atrial tachycardia with block and bidirectional VT", nl: "'Omgekeerd vinkje' doorzakkende ST-depressie, kort QT, afgevlakte T; toxiciteit: elke aritmie, klassiek atriale tachycardie met blok en bidirectionele VT" }],
            [{ en: "Sodium-channel blockade (TCA, flecainide)", nl: "Natriumkanaalblokkade (TCA, flecaïnide)" }, { en: "Wide QRS, terminal R in aVR > 3 mm, right axis; QRS > 100 ms predicts seizures, > 160 ms arrhythmia (TCA)", nl: "Breed QRS, terminale R in aVR > 3 mm, rechter as; QRS > 100 ms voorspelt insulten, > 160 ms aritmie (TCA)" }],
            [{ en: "Hypothermia", nl: "Hypothermie" }, { en: "Osborn (J) waves, bradycardia, long intervals, shivering artefact, AF", nl: "Osborn (J)-golven, bradycardie, lange intervallen, rillingsartefact, AF" }],
            [{ en: "Pulmonary embolism", nl: "Longembolie" }, { en: "Sinus tachycardia (commonest), S1Q3T3, T inversion V1–V4, new RBBB, right axis; normal ECG does not exclude PE", nl: "Sinustachycardie (meest voorkomend), S1Q3T3, T-inversie V1–V4, nieuw RBTB, rechter as; een normaal ECG sluit longembolie niet uit" }],
            [{ en: "Pericardial effusion", nl: "Pericardeffusie" }, { en: "Low voltage, sinus tachycardia, electrical alternans", nl: "Laag voltage, sinustachycardie, elektrisch alternans" }],
            [{ en: "Raised intracranial pressure", nl: "Verhoogde intracraniële druk" }, { en: "Giant wide T inversion, long QT, bradycardia", nl: "Reusachtige brede T-inversie, lang QT, bradycardie" }],
          ] },
        { type: "ecg", ecgId: "synth-low-voltage", layout: "3x4", caption: { en: "Low voltage with sinus tachycardia: QRS < 5 mm in every limb lead. Request an echocardiogram.", nl: "Laag voltage met sinustachycardie: QRS < 5 mm in elke extremiteitsafleiding. Vraag een echocardiogram aan." } },
        { type: "callout", tone: "key", text: {
          en: "Hyperkalaemia with any QRS widening, loss of P waves or bradyarrhythmia is a 'calcium-now' emergency: 10 ml 10% calcium gluconate (or chloride) IV, then insulin–glucose, salbutamol and definitive removal. Do not wait for the laboratory value.",
          nl: "Hyperkaliëmie met enige QRS-verbreding, verlies van P-toppen of bradyaritmie is een 'nu calcium'-noodsituatie: 10 ml calciumgluconaat 10% (of -chloride) IV, daarna insuline-glucose, salbutamol en definitieve verwijdering. Wacht niet op de labwaarde.",
        } },
        { type: "check", question: {
          id: "m10-l02-q1", kind: "single", competency: "systemic-metabolic", level: 3,
          stem: { en: "A dialysis patient presents with weakness. The ECG shows a sine-wave-like rhythm at 50/min with no discernible P waves. The first intervention is:", nl: "Een dialysepatiënt presenteert zich met zwakte. Het ECG toont een sinusgolfachtig ritme van 50/min zonder herkenbare P-toppen. De eerste interventie is:" },
          options: [
            { id: "a", text: { en: "Intravenous calcium", nl: "Intraveneus calcium" }, correct: true },
            { id: "b", text: { en: "Amiodarone", nl: "Amiodaron" }, correct: false },
            { id: "c", text: { en: "Transcutaneous pacing", nl: "Transcutane pacing" }, correct: false, rationale: { en: "Pacing often fails to capture in severe hyperkalaemia; stabilise the membrane first.", nl: "Pacing captureert vaak niet bij ernstige hyperkaliëmie; stabiliseer eerst de membraan." } },
            { id: "d", text: { en: "Wait for the potassium result", nl: "Wachten op de kaliumuitslag" }, correct: false },
          ],
          explanation: { en: "The sine-wave pattern is pre-arrest hyperkalaemia; calcium antagonises the membrane effects within minutes and buys time for shifting and removal.", nl: "Het sinusgolfpatroon is pre-arrest hyperkaliëmie; calcium antagoneert de membraaneffecten binnen minuten en koopt tijd voor verschuiving en verwijdering." },
        } },
      ],
      review: authored(),
    },
  ],
};
