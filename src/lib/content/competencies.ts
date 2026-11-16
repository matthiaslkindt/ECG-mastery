import type { Competency, CompetencyId } from "./types";

export const COMPETENCIES: Record<CompetencyId, Competency> = {
  "systematic-approach": {
    id: "systematic-approach",
    title: { en: "Systematic approach", nl: "Systematische benadering" },
    description: {
      en: "Reads every ECG in a fixed order (rate, rhythm, axis, intervals, morphology, conclusion) and reports it in structured form.",
      nl: "Beoordeelt elk ECG in vaste volgorde (frequentie, ritme, as, intervallen, morfologie, conclusie) en rapporteert gestructureerd.",
    },
  },
  "rate-rhythm": {
    id: "rate-rhythm",
    title: { en: "Rate & rhythm", nl: "Frequentie & ritme" },
    description: {
      en: "Determines rate accurately and recognises sinus and non-sinus rhythms, regularity and ectopy.",
      nl: "Bepaalt de frequentie nauwkeurig en herkent sinus- en niet-sinusritmes, regelmaat en extrasystolie.",
    },
  },
  axis: {
    id: "axis",
    title: { en: "Axis", nl: "Hartas" },
    description: {
      en: "Estimates the frontal QRS axis and interprets deviations in clinical context.",
      nl: "Schat de frontale QRS-as en interpreteert afwijkingen in klinische context.",
    },
  },
  intervals: {
    id: "intervals",
    title: { en: "Intervals", nl: "Intervallen" },
    description: {
      en: "Measures PR, QRS and QT/QTc correctly and knows their clinical thresholds.",
      nl: "Meet PR, QRS en QT/QTc correct en kent de klinische grenswaarden.",
    },
  },
  "conduction-blocks": {
    id: "conduction-blocks",
    title: { en: "Conduction blocks", nl: "Geleidingsstoornissen" },
    description: {
      en: "Diagnoses AV blocks, bundle branch and fascicular blocks and assesses their significance.",
      nl: "Diagnosticeert AV-blokken, bundeltak- en fasciculaire blokken en beoordeelt hun betekenis.",
    },
  },
  "chamber-enlargement": {
    id: "chamber-enlargement",
    title: { en: "Chamber enlargement", nl: "Kamer- en boezemvergroting" },
    description: {
      en: "Applies voltage and morphology criteria for atrial enlargement and ventricular hypertrophy.",
      nl: "Past voltage- en morfologiecriteria toe voor boezemvergroting en kamerhypertrofie.",
    },
  },
  "acute-ischaemia": {
    id: "acute-ischaemia",
    title: { en: "Acute ischaemia", nl: "Acute ischemie" },
    description: {
      en: "Recognises STEMI and its equivalents, localises the culprit territory and separates mimics.",
      nl: "Herkent STEMI en equivalenten, lokaliseert het betrokken gebied en onderscheidt mimics.",
    },
  },
  "chronic-ischaemia": {
    id: "chronic-ischaemia",
    title: { en: "Chronic ischaemia & infarction", nl: "Chronische ischemie & infarct" },
    description: {
      en: "Identifies pathological Q waves, old infarction and chronic ischaemic repolarisation changes.",
      nl: "Herkent pathologische Q-golven, oud infarct en chronische ischemische repolarisatiestoornissen.",
    },
  },
  "narrow-complex-tachycardia": {
    id: "narrow-complex-tachycardia",
    title: { en: "Narrow-complex tachycardia", nl: "Smal-complex tachycardie" },
    description: {
      en: "Differentiates AF, flutter, AVNRT/AVRT and atrial tachycardia and chooses acute management.",
      nl: "Onderscheidt AF, flutter, AVNRT/AVRT en atriale tachycardie en kiest de acute behandeling.",
    },
  },
  "wide-complex-tachycardia": {
    id: "wide-complex-tachycardia",
    title: { en: "Wide-complex tachycardia", nl: "Breed-complex tachycardie" },
    description: {
      en: "Applies VT criteria, recognises SVT with aberrancy and pre-excited tachycardia.",
      nl: "Past VT-criteria toe, herkent SVT met aberrantie en pre-geëxciteerde tachycardie.",
    },
  },
  "bradyarrhythmia-pacing": {
    id: "bradyarrhythmia-pacing",
    title: { en: "Bradyarrhythmia & pacing", nl: "Bradyaritmie & pacing" },
    description: {
      en: "Evaluates sinus node dysfunction, high-grade AV block and paced rhythms including malfunction.",
      nl: "Beoordeelt sinusknoopdisfunctie, hooggradig AV-blok en gepacete ritmes inclusief malfunctie.",
    },
  },
  "inherited-arrhythmia": {
    id: "inherited-arrhythmia",
    title: { en: "Inherited arrhythmia syndromes", nl: "Erfelijke aritmiesyndromen" },
    description: {
      en: "Recognises Brugada, long/short QT, WPW, ARVC and HCM patterns and their risk implications.",
      nl: "Herkent Brugada, lang/kort QT, WPW, ARVC- en HCM-patronen en hun risico-implicaties.",
    },
  },
  "systemic-metabolic": {
    id: "systemic-metabolic",
    title: { en: "Systemic & metabolic effects", nl: "Systemische & metabole effecten" },
    description: {
      en: "Identifies ECG effects of electrolytes, drugs, pericardial disease, pulmonary embolism and hypothermia.",
      nl: "Herkent ECG-effecten van elektrolyten, medicatie, pericardziekte, longembolie en hypothermie.",
    },
  },
  "clinical-integration": {
    id: "clinical-integration",
    title: { en: "Clinical integration", nl: "Klinische integratie" },
    description: {
      en: "Integrates the ECG with history, examination and prior tracings into a management decision.",
      nl: "Integreert het ECG met anamnese, onderzoek en eerdere registraties tot een beleidsbeslissing.",
    },
  },
};

export const COMPETENCY_IDS = Object.keys(COMPETENCIES) as CompetencyId[];
