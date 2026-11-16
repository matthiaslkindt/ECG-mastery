import type { Assessment, Question } from "../types";
import { CURRICULUM } from "../curriculum";
import { authored, REFS } from "../curriculum/_shared";

/** Questions embedded in lessons, collected per module for formative practice. */
function lessonChecks(moduleId: string): Question[] {
  const m = CURRICULUM.find((x) => x.id === moduleId);
  if (!m) return [];
  return m.lessons.flatMap((l) => l.blocks.flatMap((b) => (b.type === "check" ? [b.question] : [])));
}

const summative = (
  id: string,
  slug: string,
  moduleId: string,
  title: Assessment["title"],
  description: Assessment["description"],
  level: Assessment["level"],
  competencies: Assessment["competencies"],
  questions: Question[],
  refs: string[] = [],
): Assessment => ({
  id, slug, kind: "summative", moduleId, title, description, level, competencies, questions,
  passMark: 0.7, timeLimitMinutes: Math.max(10, questions.length * 2),
  review: authored(refs),
});

const FOUNDATIONS_QUESTIONS: Question[] = [
  {
    id: "ft-1", kind: "single", competency: "intervals", level: 1,
    stem: { en: "At 25 mm/s, a PR interval spanning 5.5 small squares measures:", nl: "Bij 25 mm/s meet een PR-interval van 5,5 kleine hokjes:" },
    options: [
      { id: "a", text: { en: "110 ms", nl: "110 ms" }, correct: false },
      { id: "b", text: { en: "220 ms", nl: "220 ms" }, correct: true },
      { id: "c", text: { en: "275 ms", nl: "275 ms" }, correct: false },
      { id: "d", text: { en: "550 ms", nl: "550 ms" }, correct: false },
    ],
    explanation: { en: "Each small square is 40 ms: 5.5 × 40 = 220 ms, a first-degree AV block.", nl: "Elk klein hokje is 40 ms: 5,5 × 40 = 220 ms, een eerstegraads AV-blok." },
  },
  {
    id: "ft-2", kind: "single", competency: "rate-rhythm", level: 1, ecgId: "ptbxl-00003",
    stem: { en: "Using the rhythm strip of the ECG shown, the heart rate is closest to:", nl: "Op basis van de ritmestrook van het getoonde ECG ligt de hartfrequentie het dichtst bij:" },
    options: [
      { id: "a", text: { en: "50/min", nl: "50/min" }, correct: false },
      { id: "b", text: { en: "65/min", nl: "65/min" }, correct: true },
      { id: "c", text: { en: "85/min", nl: "85/min" }, correct: false },
      { id: "d", text: { en: "100/min", nl: "100/min" }, correct: false },
    ],
    explanation: { en: "Count the complexes on the 10-second strip and multiply by six, or divide 1500 by the number of small squares between R waves.", nl: "Tel de complexen op de strook van 10 seconden en vermenigvuldig met zes, of deel 1500 door het aantal kleine hokjes tussen de R-toppen." },
  },
  {
    id: "ft-3", kind: "single", competency: "axis", level: 1,
    stem: { en: "The QRS is isoelectric in aVL and tallest in lead II. The axis is approximately:", nl: "Het QRS is iso-elektrisch in aVL en het hoogst in afleiding II. De as is ongeveer:" },
    options: [
      { id: "a", text: { en: "−30°", nl: "−30°" }, correct: false },
      { id: "b", text: { en: "0°", nl: "0°" }, correct: false },
      { id: "c", text: { en: "+60°", nl: "+60°" }, correct: true },
      { id: "d", text: { en: "+120°", nl: "+120°" }, correct: false },
    ],
    explanation: { en: "The axis is perpendicular to the isoelectric lead (aVL at −30° → perpendicular at +60° or −120°) and points towards the lead with the tallest R (II, +60°).", nl: "De as staat loodrecht op de iso-elektrische afleiding (aVL op −30° → loodrecht op +60° of −120°) en wijst naar de afleiding met de hoogste R (II, +60°)." },
  },
  {
    id: "ft-4", kind: "single", competency: "systematic-approach", level: 1,
    stem: { en: "A tracing shows a positive QRS in aVR, a negative QRS in lead I and an inverted P in lead I. The most likely explanation is:", nl: "Een registratie toont een positief QRS in aVR, een negatief QRS in afleiding I en een negatieve P in afleiding I. De meest waarschijnlijke verklaring is:" },
    options: [
      { id: "a", text: { en: "Ventricular tachycardia", nl: "Ventriculaire tachycardie" }, correct: false },
      { id: "b", text: { en: "Left–right arm lead reversal (or dextrocardia if precordial R progression is also reversed)", nl: "Links–rechts armelektrodeverwisseling (of dextrocardie als ook de precordiale R-progressie is omgekeerd)" }, correct: true },
      { id: "c", text: { en: "Inferior myocardial infarction", nl: "Onderwandinfarct" }, correct: false },
      { id: "d", text: { en: "Normal variant", nl: "Normale variant" }, correct: false },
    ],
    explanation: { en: "Swapping the arm electrodes inverts lead I and exchanges II with III and aVR with aVL. Normal R progression in the chest leads distinguishes reversal from dextrocardia.", nl: "Verwisselen van de armelektroden inverteert afleiding I en wisselt II met III en aVR met aVL. Normale R-progressie in de borstafleidingen onderscheidt verwisseling van dextrocardie." },
  },
  {
    id: "ft-5", kind: "single", competency: "intervals", level: 1,
    stem: { en: "QT 440 ms at a heart rate of 50/min (RR 1.2 s). QTc by Bazett is approximately:", nl: "QT 440 ms bij een hartfrequentie van 50/min (RR 1,2 s). QTc volgens Bazett is ongeveer:" },
    options: [
      { id: "a", text: { en: "367 ms", nl: "367 ms" }, correct: false },
      { id: "b", text: { en: "402 ms", nl: "402 ms" }, correct: true },
      { id: "c", text: { en: "440 ms", nl: "440 ms" }, correct: false },
      { id: "d", text: { en: "482 ms", nl: "482 ms" }, correct: false },
    ],
    explanation: { en: "QTc = 440 / √1.2 = 440 / 1.095 ≈ 402 ms. At slow rates Bazett shortens the QTc; Fridericia would give 440 / ∛1.2 ≈ 414 ms.", nl: "QTc = 440 / √1,2 = 440 / 1,095 ≈ 402 ms. Bij lage frequenties verkort Bazett de QTc; Fridericia zou 440 / ∛1,2 ≈ 414 ms geven." },
  },
];

const ACS_QUESTIONS: Question[] = [
  {
    id: "acs-1", kind: "single", competency: "acute-ischaemia", level: 2, ecgId: "synth-stemi-anterior",
    stem: { en: "The ECG shown is from a 54-year-old man with 30 minutes of chest pain. The culprit artery is most likely:", nl: "Het getoonde ECG is van een 54-jarige man met 30 minuten pijn op de borst. De culprit-arterie is het meest waarschijnlijk:" },
    options: [
      { id: "a", text: { en: "Right coronary artery", nl: "Rechter coronairarterie" }, correct: false },
      { id: "b", text: { en: "Left anterior descending artery", nl: "Linker anterior descendens" }, correct: true },
      { id: "c", text: { en: "Left circumflex artery", nl: "Linker circumflex" }, correct: false },
      { id: "d", text: { en: "No culprit — this is pericarditis", nl: "Geen culprit — dit is pericarditis" }, correct: false },
    ],
    explanation: { en: "ST elevation confined to V1–V4 with hyperacute T waves localises to the LAD territory.", nl: "ST-elevatie beperkt tot V1–V4 met hyperacute T-toppen lokaliseert naar het LAD-gebied." },
  },
  {
    id: "acs-2", kind: "single", competency: "acute-ischaemia", level: 2,
    stem: { en: "In a 45-year-old woman, which ST elevation in V2–V3 meets the STEMI threshold?", nl: "Welke ST-elevatie in V2–V3 voldoet bij een 45-jarige vrouw aan de STEMI-drempel?" },
    options: [
      { id: "a", text: { en: "1.0 mm", nl: "1,0 mm" }, correct: false },
      { id: "b", text: { en: "1.5 mm", nl: "1,5 mm" }, correct: true },
      { id: "c", text: { en: "2.0 mm", nl: "2,0 mm" }, correct: false, rationale: { en: "That is the threshold for men ≥ 40 years.", nl: "Dat is de drempel voor mannen ≥ 40 jaar." } },
      { id: "d", text: { en: "2.5 mm", nl: "2,5 mm" }, correct: false, rationale: { en: "That is the threshold for men < 40 years.", nl: "Dat is de drempel voor mannen < 40 jaar." } },
    ],
    explanation: { en: "Women: ≥ 1.5 mm in V2–V3; all other leads ≥ 1 mm in two contiguous leads.", nl: "Vrouwen: ≥ 1,5 mm in V2–V3; alle overige afleidingen ≥ 1 mm in twee aangrenzende afleidingen." },
  },
  {
    id: "acs-3", kind: "single", competency: "acute-ischaemia", level: 3, ecgId: "synth-pericarditis",
    stem: { en: "A 28-year-old with sharp chest pain worse lying flat, one week after a viral illness. The ECG shown supports:", nl: "Een 28-jarige met scherpe pijn op de borst, erger bij platliggen, een week na een virale infectie. Het getoonde ECG ondersteunt:" },
    options: [
      { id: "a", text: { en: "Inferolateral STEMI — activate the cath lab", nl: "Inferolateraal STEMI — activeer het cathlab" }, correct: false },
      { id: "b", text: { en: "Acute pericarditis — diffuse concave elevation, depression only in aVR", nl: "Acute pericarditis — diffuse concave elevatie, depressie alleen in aVR" }, correct: true },
      { id: "c", text: { en: "Early repolarisation", nl: "Vroege repolarisatie" }, correct: false },
      { id: "d", text: { en: "Hyperkalaemia", nl: "Hyperkaliëmie" }, correct: false },
    ],
    explanation: { en: "Elevation that ignores coronary territories, absent reciprocal change (except aVR) and the clinical picture make pericarditis the diagnosis; troponin may be raised in myopericarditis.", nl: "Elevatie die coronaire gebieden negeert, afwezige reciproke veranderingen (behalve aVR) en het klinische beeld maken pericarditis de diagnose; troponine kan verhoogd zijn bij myopericarditis." },
  },
  {
    id: "acs-4", kind: "multiple", competency: "acute-ischaemia", level: 3,
    stem: { en: "Which patterns are considered STEMI equivalents warranting immediate reperfusion strategy (ESC 2023)? Select all that apply.", nl: "Welke patronen worden beschouwd als STEMI-equivalenten die een directe reperfusiestrategie rechtvaardigen (ESC 2023)? Selecteer alle juiste antwoorden." },
    options: [
      { id: "a", text: { en: "Isolated ST depression V1–V3 with posterior ST elevation", nl: "Geïsoleerde ST-depressie V1–V3 met posterieure ST-elevatie" }, correct: true },
      { id: "b", text: { en: "De Winter pattern", nl: "De Winter-patroon" }, correct: true },
      { id: "c", text: { en: "Isolated first-degree AV block", nl: "Geïsoleerd eerstegraads AV-blok" }, correct: false },
      { id: "d", text: { en: "LBBB meeting modified Sgarbossa criteria", nl: "LBTB dat aan de gemodificeerde Sgarbossa-criteria voldoet" }, correct: true },
      { id: "e", text: { en: "Non-specific T-wave flattening", nl: "Aspecifieke T-topafvlakking" }, correct: false },
    ],
    explanation: { en: "Occlusion MI can present without classic ST elevation; posterior MI, de Winter and Sgarbossa-positive LBBB/paced rhythm all merit emergency angiography.", nl: "Occlusie-infarct kan zich presenteren zonder klassieke ST-elevatie; posterior infarct, de Winter en Sgarbossa-positief LBTB/gepacet ritme verdienen alle spoedangiografie." },
  },
  {
    id: "acs-5", kind: "single", competency: "chronic-ischaemia", level: 2, ecgId: "ptbxl-00290",
    stem: { en: "The ECG shown in an asymptomatic 73-year-old at a pre-operative assessment demonstrates:", nl: "Het getoonde ECG bij een asymptomatische 73-jarige bij een preoperatieve beoordeling toont:" },
    options: [
      { id: "a", text: { en: "Acute inferior STEMI", nl: "Acuut inferieur STEMI" }, correct: false },
      { id: "b", text: { en: "Old inferior infarction", nl: "Oud onderwandinfarct" }, correct: true },
      { id: "c", text: { en: "Left anterior fascicular block", nl: "Linker anterieur fasciculair blok" }, correct: false },
      { id: "d", text: { en: "Normal ECG", nl: "Normaal ECG" }, correct: false },
    ],
    explanation: { en: "Q waves in II, III, aVF without ST elevation indicate established scar; it changes the perioperative risk assessment but needs no emergency action.", nl: "Q-golven in II, III, aVF zonder ST-elevatie wijzen op gevestigd litteken; dit verandert de perioperatieve risico-inschatting maar vereist geen spoedactie." },
  },
];

const CONDUCTION_QUESTIONS: Question[] = [
  {
    id: "cd-1", kind: "single", competency: "conduction-blocks", level: 2, ecgId: "synth-mobitz-1",
    stem: { en: "The ECG shown demonstrates:", nl: "Het getoonde ECG toont:" },
    options: [
      { id: "a", text: { en: "Mobitz I second-degree AV block", nl: "Mobitz I tweedegraads AV-blok" }, correct: true },
      { id: "b", text: { en: "Mobitz II second-degree AV block", nl: "Mobitz II tweedegraads AV-blok" }, correct: false },
      { id: "c", text: { en: "Blocked premature atrial complexes", nl: "Geblokkeerde atriale extrasystolen" }, correct: false },
      { id: "d", text: { en: "Sinus arrhythmia", nl: "Sinusaritmie" }, correct: false },
    ],
    explanation: { en: "Progressive PR prolongation followed by a non-conducted P wave in a regular PP sequence defines Wenckebach.", nl: "Progressieve PR-verlenging gevolgd door een niet-voortgeleide P in een regelmatige PP-reeks definieert Wenckebach." },
  },
  {
    id: "cd-2", kind: "single", competency: "conduction-blocks", level: 2, ecgId: "ptbxl-00621",
    stem: { en: "The conduction abnormality in the ECG shown is:", nl: "De geleidingsstoornis in het getoonde ECG is:" },
    options: [
      { id: "a", text: { en: "LBBB", nl: "LBTB" }, correct: false },
      { id: "b", text: { en: "RBBB", nl: "RBTB" }, correct: true },
      { id: "c", text: { en: "LAFB", nl: "LAFB" }, correct: false },
      { id: "d", text: { en: "WPW", nl: "WPW" }, correct: false },
    ],
    explanation: { en: "rSR′ in V1 with a broad S in I and V6 and QRS ≥ 120 ms.", nl: "rSR′ in V1 met brede S in I en V6 en QRS ≥ 120 ms." },
  },
  {
    id: "cd-3", kind: "single", competency: "bradyarrhythmia-pacing", level: 2,
    stem: { en: "Which of the following is a class I indication for permanent pacing irrespective of symptoms?", nl: "Welke van de volgende is een klasse I-indicatie voor permanente pacing ongeacht klachten?" },
    options: [
      { id: "a", text: { en: "First-degree AV block with PR 280 ms", nl: "Eerstegraads AV-blok met PR 280 ms" }, correct: false },
      { id: "b", text: { en: "Asymptomatic Mobitz I block with narrow QRS", nl: "Asymptomatisch Mobitz I-blok met smal QRS" }, correct: false },
      { id: "c", text: { en: "Mobitz II block", nl: "Mobitz II-blok" }, correct: true },
      { id: "d", text: { en: "Sinus bradycardia at 45/min in an athlete", nl: "Sinusbradycardie van 45/min bij een sporter" }, correct: false },
    ],
    explanation: { en: "ESC 2021: Mobitz II, high-grade and complete AV block are indications regardless of symptoms once reversible causes are excluded.", nl: "ESC 2021: Mobitz II, hooggradig en totaal AV-blok zijn indicaties ongeacht klachten zodra reversibele oorzaken zijn uitgesloten." },
  },
  {
    id: "cd-4", kind: "single", competency: "axis", level: 2, ecgId: "ptbxl-00041",
    stem: { en: "The ECG shown has a narrow QRS and an axis of about −60° with qR in aVL and rS in II, III and aVF. This represents:", nl: "Het getoonde ECG heeft een smal QRS en een as van ongeveer −60° met qR in aVL en rS in II, III en aVF. Dit vertegenwoordigt:" },
    options: [
      { id: "a", text: { en: "Left anterior fascicular block", nl: "Linker anterieur fasciculair blok" }, correct: true },
      { id: "b", text: { en: "Left bundle branch block", nl: "Linkerbundeltakblok" }, correct: false },
      { id: "c", text: { en: "Inferior myocardial infarction", nl: "Onderwandinfarct" }, correct: false },
      { id: "d", text: { en: "Left posterior fascicular block", nl: "Linker posterieur fasciculair blok" }, correct: false },
    ],
    explanation: { en: "LAFB is diagnosed by the axis and the qR/rS pattern with a normal QRS duration, once inferior MI and other causes of left axis are excluded.", nl: "LAFB wordt gediagnosticeerd op de as en het qR/rS-patroon met normale QRS-duur, nadat onderwandinfarct en andere oorzaken van linker as zijn uitgesloten." },
  },
];

const RHYTHM_QUESTIONS: Question[] = [
  {
    id: "rh-1", kind: "single", competency: "rate-rhythm", level: 1, ecgId: "ptbxl-04117",
    stem: { en: "The rhythm shown is:", nl: "Het getoonde ritme is:" },
    options: [
      { id: "a", text: { en: "Sinus tachycardia with PACs", nl: "Sinustachycardie met AES" }, correct: false },
      { id: "b", text: { en: "Atrial fibrillation", nl: "Atriumfibrilleren" }, correct: true },
      { id: "c", text: { en: "Atrial flutter with 2:1 conduction", nl: "Atriumflutter met 2:1-geleiding" }, correct: false },
      { id: "d", text: { en: "Multifocal atrial tachycardia", nl: "Multifocale atriale tachycardie" }, correct: false },
    ],
    explanation: { en: "Irregularly irregular, no P waves, fibrillatory baseline.", nl: "Onregelmatig onregelmatig, geen P-toppen, fibrillatoire basislijn." },
  },
  {
    id: "rh-2", kind: "single", competency: "rate-rhythm", level: 1, ecgId: "synth-pvc",
    stem: { en: "The premature beats in the ECG shown are:", nl: "De premature slagen in het getoonde ECG zijn:" },
    options: [
      { id: "a", text: { en: "Premature atrial complexes", nl: "Atriale extrasystolen" }, correct: false },
      { id: "b", text: { en: "Premature ventricular complexes", nl: "Ventriculaire extrasystolen" }, correct: true },
      { id: "c", text: { en: "Junctional escape beats", nl: "Junctionele escape-slagen" }, correct: false },
      { id: "d", text: { en: "Fusion beats", nl: "Fusieslagen" }, correct: false },
    ],
    explanation: { en: "Wide, bizarre, no preceding P, discordant T and a full compensatory pause.", nl: "Breed, bizar, geen voorafgaande P, discordante T en een volledige compensatoire pauze." },
  },
  {
    id: "rh-3", kind: "single", competency: "narrow-complex-tachycardia", level: 1, ecgId: "synth-flutter-2-1",
    stem: { en: "A regular narrow tachycardia at 150/min with the pattern shown. The atrial mechanism is:", nl: "Een regelmatige smalle tachycardie van 150/min met het getoonde patroon. Het atriale mechanisme is:" },
    options: [
      { id: "a", text: { en: "Sinus tachycardia", nl: "Sinustachycardie" }, correct: false },
      { id: "b", text: { en: "Typical atrial flutter", nl: "Typische atriumflutter" }, correct: true },
      { id: "c", text: { en: "AVNRT", nl: "AVNRT" }, correct: false },
      { id: "d", text: { en: "Atrial fibrillation", nl: "Atriumfibrilleren" }, correct: false },
    ],
    explanation: { en: "Negative sawtooth in the inferior leads at 300/min with 2:1 conduction.", nl: "Negatieve zaagtand in de inferieure afleidingen op 300/min met 2:1-geleiding." },
  },
];

export const ASSESSMENTS: Assessment[] = [
  summative("foundations-test", "foundations-test", "m01",
    { en: "Foundations test", nl: "Toets Grondslagen" },
    { en: "Calibration, rate, axis and lead placement.", nl: "Kalibratie, frequentie, as en elektrodeplaatsing." },
    1, ["systematic-approach", "rate-rhythm", "axis", "intervals"], FOUNDATIONS_QUESTIONS),
  summative("rhythm-basics-test", "rhythm-basics-test", "m02",
    { en: "Rhythm basics test", nl: "Toets Ritmebasis" },
    { en: "Sinus variants, ectopy, AF and flutter.", nl: "Sinusvarianten, extrasystolie, AF en flutter." },
    1, ["rate-rhythm", "narrow-complex-tachycardia"], RHYTHM_QUESTIONS, [REFS.esc2024af]),
  summative("conduction-test", "conduction-test", "m03",
    { en: "Conduction test", nl: "Toets Geleiding" },
    { en: "AV blocks, bundle branch and fascicular blocks, pacing indications.", nl: "AV-blokken, bundeltak- en fasciculaire blokken, pacing-indicaties." },
    2, ["conduction-blocks", "bradyarrhythmia-pacing", "axis"], CONDUCTION_QUESTIONS, [REFS.esc2021pacing]),
  summative("acs-test", "acs-test", "m05",
    { en: "Acute coronary syndromes test", nl: "Toets Acute coronaire syndromen" },
    { en: "STEMI criteria, localisation, equivalents and mimics.", nl: "STEMI-criteria, lokalisatie, equivalenten en mimics." },
    2, ["acute-ischaemia", "chronic-ischaemia"], ACS_QUESTIONS, [REFS.esc2023acs]),
  ...CURRICULUM.map<Assessment>((m) => ({
    id: `${m.id}-practice`,
    slug: `${m.slug}-practice`,
    kind: "formative",
    moduleId: m.id,
    title: { en: `Practice: ${m.title.en}`, nl: `Oefenen: ${m.title.nl}` },
    description: { en: "All in-lesson checks of this module, with full rationales.", nl: "Alle tussentijdse vragen van deze module, met volledige toelichting." },
    level: m.level,
    competencies: m.competencies,
    questions: lessonChecks(m.id),
    review: m.review,
  })),
];

export function getAssessment(slug: string): Assessment | undefined {
  return ASSESSMENTS.find((a) => a.slug === slug);
}
