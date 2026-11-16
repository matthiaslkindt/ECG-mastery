import type { Module } from "../types";
import { REFS, authored } from "./_shared";

export const MODULE_NARROW_TACHY: Module = {
  id: "m07",
  slug: "narrow-complex-tachycardias",
  order: 7,
  level: 3,
  title: { en: "Narrow-complex tachycardias", nl: "Smal-complex tachycardieën" },
  description: {
    en: "A systematic algorithm for regular and irregular narrow tachycardias: P-wave position, RP interval, response to adenosine.",
    nl: "Een systematisch algoritme voor regelmatige en onregelmatige smalle tachycardieën: positie van de P-top, RP-interval, respons op adenosine.",
  },
  competencies: ["narrow-complex-tachycardia", "clinical-integration"],
  review: authored([REFS.esc2019svt]),
  lessons: [
    {
      id: "m07-l01",
      slug: "regular-narrow-tachycardia",
      level: 3,
      estimatedMinutes: 30,
      title: { en: "Regular narrow-complex tachycardia", nl: "Regelmatige smal-complex tachycardie" },
      summary: { en: "AVNRT, AVRT, atrial tachycardia, flutter and sinus tachycardia: how the RP interval sorts them.", nl: "AVNRT, AVRT, atriale tachycardie, flutter en sinustachycardie: hoe het RP-interval ze sorteert." },
      competencies: ["narrow-complex-tachycardia"],
      objectives: [
        { id: "o1", competency: "narrow-complex-tachycardia", text: { en: "Classify a regular narrow tachycardia as short-RP, long-RP or no-visible-P and list the differential for each.", nl: "Een regelmatige smalle tachycardie classificeren als kort-RP, lang-RP of geen-zichtbare-P en de differentiaaldiagnose van elk benoemen." } },
        { id: "o2", competency: "narrow-complex-tachycardia", text: { en: "Interpret the response to vagal manoeuvres and adenosine diagnostically.", nl: "De respons op vagale manoeuvres en adenosine diagnostisch interpreteren." } },
      ],
      blocks: [
        { type: "table", header: [{ en: "P-wave position", nl: "Positie P-top" }, { en: "Differential", nl: "Differentiaaldiagnose" }, { en: "Clues", nl: "Aanwijzingen" }],
          rows: [
            [{ en: "Not visible (buried in QRS)", nl: "Niet zichtbaar (in QRS verborgen)" }, { en: "Typical AVNRT", nl: "Typische AVNRT" }, { en: "Pseudo-r′ in V1 or pseudo-S in II, III, aVF absent on sinus ECG", nl: "Pseudo-r′ in V1 of pseudo-S in II, III, aVF die op het sinus-ECG ontbreken" }],
            [{ en: "Short RP (RP < PR, RP > 70 ms)", nl: "Kort RP (RP < PR, RP > 70 ms)" }, { en: "Orthodromic AVRT, atypical AVNRT, atrial tachycardia with long PR", nl: "Orthodrome AVRT, atypische AVNRT, atriale tachycardie met lang PR" }, { en: "Retrograde P in ST segment; QRS alternans favours AVRT", nl: "Retrograde P in ST-segment; QRS-alternans pleit voor AVRT" }],
            [{ en: "Long RP (RP > PR)", nl: "Lang RP (RP > PR)" }, { en: "Atrial tachycardia, sinus tachycardia, atypical AVNRT, PJRT", nl: "Atriale tachycardie, sinustachycardie, atypische AVNRT, PJRT" }, { en: "P morphology differs from sinus in AT; warm-up/cool-down in sinus/AT", nl: "P-morfologie wijkt af van sinus bij AT; warm-up/cool-down bij sinus/AT" }],
            [{ en: "Sawtooth, 2:1", nl: "Zaagtand, 2:1" }, { en: "Atrial flutter", nl: "Atriumflutter" }, { en: "Ventricular rate ~150; F waves in II, III, aVF, V1", nl: "Kamerfrequentie ~150; F-golven in II, III, aVF, V1" }],
          ] },
        { type: "ecg", ecgId: "ptbxl-02051", layout: "3x4+rhythm", caption: { en: "Real PSVT at 155/min: no P waves visible between the complexes; narrow QRS; regular. Vagal manoeuvres first.", nl: "Echte PSVT van 155/min: geen P-toppen zichtbaar tussen de complexen; smal QRS; regelmatig. Eerst vagale manoeuvres." } },
        { type: "ecg", ecgId: "synth-avnrt", layout: "3x4+rhythm", focusLeads: ["II", "V1"], caption: { en: "AVNRT with the retrograde P at the end of the QRS: a pseudo-S in II and a pseudo-r′ in V1 that would vanish on the sinus ECG.", nl: "AVNRT met de retrograde P aan het einde van het QRS: een pseudo-S in II en een pseudo-r′ in V1 die op het sinus-ECG verdwijnen." } },
        { type: "callout", tone: "key", title: { en: "Adenosine as a diagnostic test", nl: "Adenosine als diagnostische test" }, text: {
          en: "Termination with a P wave last → AVNRT or AVRT (node-dependent). Transient AV block revealing ongoing atrial activity → flutter or atrial tachycardia. Gradual slowing then re-acceleration → sinus tachycardia. No effect → inadequate dose or VT. Record a continuous 12-lead during administration; have a defibrillator ready in pre-excitation.",
          nl: "Terminatie met als laatste een P-top → AVNRT of AVRT (knoopafhankelijk). Tijdelijk AV-blok dat doorgaande atriale activiteit toont → flutter of atriale tachycardie. Geleidelijke vertraging en daarna weer versnelling → sinustachycardie. Geen effect → onvoldoende dosis of VT. Registreer continu een 12-afleidingen-ECG tijdens toediening; houd een defibrillator gereed bij pre-excitatie.",
        } },
        { type: "check", question: {
          id: "m07-l01-q1", kind: "single", competency: "narrow-complex-tachycardia", level: 3,
          stem: { en: "During a regular narrow tachycardia at 170/min, adenosine produces 3 seconds of AV block during which regular atrial deflections continue at 170/min. The diagnosis is:", nl: "Tijdens een regelmatige smalle tachycardie van 170/min geeft adenosine 3 seconden AV-blok waarin regelmatige atriale deflecties doorgaan op 170/min. De diagnose is:" },
          options: [
            { id: "a", text: { en: "AVNRT", nl: "AVNRT" }, correct: false, rationale: { en: "AVNRT terminates with AV block because the node is part of the circuit.", nl: "AVNRT termineert bij AV-blok omdat de knoop deel uitmaakt van het circuit." } },
            { id: "b", text: { en: "Orthodromic AVRT", nl: "Orthodrome AVRT" }, correct: false },
            { id: "c", text: { en: "Atrial tachycardia (or flutter)", nl: "Atriale tachycardie (of flutter)" }, correct: true },
            { id: "d", text: { en: "Sinus tachycardia", nl: "Sinustachycardie" }, correct: false, rationale: { en: "Sinus rate would slow transiently.", nl: "De sinusfrequentie zou tijdelijk dalen." } },
          ],
          explanation: { en: "An arrhythmia that continues in the atria while the ventricles pause does not depend on the AV node: atrial tachycardia or flutter.", nl: "Een aritmie die in de atria doorgaat terwijl de kamers pauzeren, is niet afhankelijk van de AV-knoop: atriale tachycardie of flutter." },
        } },
      ],
      review: authored([REFS.esc2019svt]),
    },
  ],
};
