import type { Module } from "../types";
import { REFS, authored } from "./_shared";

export const MODULE_WIDE_TACHY: Module = {
  id: "m08",
  slug: "wide-complex-tachycardias",
  order: 8,
  level: 3,
  title: { en: "Wide-complex tachycardias", nl: "Breed-complex tachycardieën" },
  description: {
    en: "VT versus SVT with aberrancy versus pre-excited tachycardia: Brugada, Vereckei and aVR algorithms, and what to do when unsure.",
    nl: "VT versus SVT met aberrantie versus pre-geëxciteerde tachycardie: de algoritmen van Brugada, Vereckei en aVR, en wat te doen bij twijfel.",
  },
  competencies: ["wide-complex-tachycardia", "clinical-integration"],
  review: authored([REFS.brugada1991, REFS.esc2022va]),
  lessons: [
    {
      id: "m08-l01",
      slug: "vt-versus-svt",
      level: 3,
      estimatedMinutes: 30,
      title: { en: "VT or SVT with aberrancy?", nl: "VT of SVT met aberrantie?" },
      summary: { en: "Pre-test probability, the four Brugada steps, the Vereckei aVR algorithm and morphology criteria.", nl: "Voorafkans, de vier stappen van Brugada, het aVR-algoritme van Vereckei en morfologiecriteria." },
      competencies: ["wide-complex-tachycardia"],
      objectives: [
        { id: "o1", competency: "wide-complex-tachycardia", text: { en: "Apply the Brugada algorithm step by step.", nl: "Het Brugada-algoritme stap voor stap toepassen." } },
        { id: "o2", competency: "wide-complex-tachycardia", text: { en: "Recognise AV dissociation, capture and fusion beats.", nl: "AV-dissociatie, capture- en fusieslagen herkennen." } },
        { id: "o3", competency: "clinical-integration", text: { en: "Manage a wide-complex tachycardia of uncertain origin safely.", nl: "Een breed-complex tachycardie van onzekere oorsprong veilig behandelen." } },
      ],
      blocks: [
        { type: "callout", tone: "key", text: {
          en: "Prior probability first: a wide-complex tachycardia in a patient with previous MI, cardiomyopathy or an ICD is VT in > 90% of cases. No algorithm beats that. When unsure, treat as VT: procainamide or amiodarone if stable, synchronised cardioversion if not. Verapamil can kill a patient in VT.",
          nl: "Eerst de voorafkans: een breed-complex tachycardie bij een patiënt met eerder infarct, cardiomyopathie of ICD is in > 90% van de gevallen VT. Geen enkel algoritme verslaat dat. Bij twijfel: behandel als VT — procaïnamide of amiodaron indien stabiel, gesynchroniseerde cardioversie indien niet. Verapamil kan een patiënt met VT doden.",
        } },
        { type: "list", ordered: true, items: [
          { en: "Brugada step 1: absence of an RS complex in all precordial leads → VT.", nl: "Brugada stap 1: geen RS-complex in enige precordiale afleiding → VT." },
          { en: "Step 2: RS interval (R onset to S nadir) > 100 ms in any precordial lead → VT.", nl: "Stap 2: RS-interval (begin R tot nadir S) > 100 ms in enige precordiale afleiding → VT." },
          { en: "Step 3: AV dissociation (more QRS than P; capture or fusion beats) → VT.", nl: "Stap 3: AV-dissociatie (meer QRS dan P; capture- of fusieslagen) → VT." },
          { en: "Step 4: morphology criteria for VT in both V1–V2 and V6 (e.g. with RBBB-like pattern: monophasic R or qR in V1, R/S < 1 in V6; with LBBB-like pattern: broad R > 30 ms or notched S downstroke in V1, any Q in V6) → VT; otherwise SVT with aberrancy.", nl: "Stap 4: morfologiecriteria voor VT in zowel V1–V2 als V6 (bijv. bij RBTB-achtig patroon: monofasische R of qR in V1, R/S < 1 in V6; bij LBTB-achtig patroon: brede R > 30 ms of gekerfde S-neergang in V1, elke Q in V6) → VT; anders SVT met aberrantie." },
        ] },
        { type: "paragraph", text: {
          en: "Vereckei's aVR algorithm adds: an initial R wave in aVR, an initial r or q > 40 ms, a notch on the descending limb of a negative QRS, or a Vi/Vt ratio ≤ 1 each indicate VT. Additional VT clues: QRS > 160 ms, extreme (north-west) axis, positive or negative concordance across V1–V6, and a QRS that differs from a known bundle branch block pattern on the sinus ECG.",
          nl: "Het aVR-algoritme van Vereckei voegt toe: een initiële R in aVR, een initiële r of q > 40 ms, een kerf op de neergaande flank van een negatief QRS, of een Vi/Vt-ratio ≤ 1 wijzen elk op VT. Aanvullende VT-aanwijzingen: QRS > 160 ms, extreme (noordwest) as, positieve of negatieve concordantie over V1–V6, en een QRS dat afwijkt van een bekend bundeltakblokpatroon op het sinus-ECG.",
        } },
        { type: "ecg", ecgId: "synth-vt", layout: "3x4+rhythm", caption: { en: "Monomorphic VT: negative concordance in the precordial leads, north-west axis, positive aVR, and dissociated P waves marching through the rhythm strip.", nl: "Monomorfe VT: negatieve concordantie in de precordiale afleidingen, noordwest-as, positief aVR, en gedissocieerde P-toppen die door de ritmestrook lopen." } },
        { type: "ecg", ecgId: "ptbxl-18101", layout: "3x4+rhythm", caption: { en: "A wide-complex tachycardia that is NOT VT: atrial tachycardia with 2:1 block conducted with RBBB. The typical rSR′ in V1 and the atrial activity give it away.", nl: "Een breed-complex tachycardie die GEEN VT is: atriale tachycardie met 2:1-blok, voortgeleid met RBTB. De typische rSR′ in V1 en de atriale activiteit verraden het." } },
        { type: "callout", tone: "pitfall", title: { en: "Pre-excited tachycardia", nl: "Pre-geëxciteerde tachycardie" }, text: {
          en: "Irregular, very fast (> 200/min), wide complexes of varying width: AF conducted over an accessory pathway. AV-nodal blockers (adenosine, verapamil, β-blockers, digoxin) can accelerate conduction and precipitate VF. Use procainamide, ibutilide or electrical cardioversion.",
          nl: "Onregelmatig, zeer snel (> 200/min), brede complexen van wisselende breedte: AF voortgeleid over een accessoire bundel. AV-knoopremmers (adenosine, verapamil, bètablokkers, digoxine) kunnen de geleiding versnellen en VF uitlokken. Gebruik procaïnamide, ibutilide of elektrische cardioversie.",
        } },
        { type: "check", question: {
          id: "m08-l01-q1", kind: "multiple", competency: "wide-complex-tachycardia", level: 3,
          stem: { en: "Which findings during a regular wide-complex tachycardia favour VT? Select all that apply.", nl: "Welke bevindingen tijdens een regelmatige breed-complex tachycardie pleiten voor VT? Selecteer alle juiste antwoorden." },
          options: [
            { id: "a", text: { en: "Fusion beats", nl: "Fusieslagen" }, correct: true },
            { id: "b", text: { en: "Typical rSR′ in V1 with a terminal S in V6 identical to the sinus ECG", nl: "Typische rSR′ in V1 met terminale S in V6, identiek aan het sinus-ECG" }, correct: false, rationale: { en: "Identical morphology to a known RBBB favours SVT with aberrancy.", nl: "Identieke morfologie aan een bekend RBTB pleit voor SVT met aberrantie." } },
            { id: "c", text: { en: "Negative concordance in V1–V6", nl: "Negatieve concordantie in V1–V6" }, correct: true },
            { id: "d", text: { en: "RS interval of 120 ms in V3", nl: "RS-interval van 120 ms in V3" }, correct: true },
            { id: "e", text: { en: "Termination by adenosine", nl: "Terminatie door adenosine" }, correct: false, rationale: { en: "Favours SVT, although some idiopathic VTs (RVOT) are adenosine-sensitive.", nl: "Pleit voor SVT, hoewel sommige idiopathische VT's (RVOT) adenosinegevoelig zijn." } },
          ],
          explanation: { en: "Fusion/capture beats prove AV dissociation; concordance and a long RS interval reflect slow myocardial (non-Purkinje) activation.", nl: "Fusie-/captureslagen bewijzen AV-dissociatie; concordantie en een lang RS-interval weerspiegelen trage myocardiale (niet-Purkinje) activatie." },
        } },
      ],
      review: authored([REFS.brugada1991, REFS.esc2022va]),
    },
  ],
};
