import type { Module } from "../types";
import { REFS, authored } from "./_shared";

export const MODULE_RATE_RHYTHM: Module = {
  id: "m02",
  slug: "rate-rhythm-ectopy",
  order: 2,
  level: 1,
  title: { en: "Sinus rhythms and ectopy", nl: "Sinusritmes en extrasystolie" },
  description: {
    en: "Sinus bradycardia, tachycardia and arrhythmia; atrial and ventricular premature complexes; recognising atrial fibrillation and flutter.",
    nl: "Sinusbradycardie, -tachycardie en -aritmie; atriale en ventriculaire extrasystolen; herkennen van atriumfibrilleren en -flutter.",
  },
  competencies: ["rate-rhythm", "narrow-complex-tachycardia"],
  summativeTestSlug: "rhythm-basics-test",
  review: authored([REFS.esc2024af]),
  lessons: [
    {
      id: "m02-l01",
      slug: "sinus-rhythm-variants",
      level: 1,
      estimatedMinutes: 15,
      title: { en: "Sinus rhythm and its variants", nl: "Sinusritme en zijn varianten" },
      summary: { en: "When a slow, fast or irregular sinus rhythm is physiological and when it is not.", nl: "Wanneer een traag, snel of onregelmatig sinusritme fysiologisch is en wanneer niet." },
      competencies: ["rate-rhythm"],
      objectives: [
        { id: "o1", competency: "rate-rhythm", text: { en: "Define sinus bradycardia, tachycardia and arrhythmia.", nl: "Sinusbradycardie, -tachycardie en -aritmie definiëren." } },
        { id: "o2", competency: "rate-rhythm", text: { en: "List common causes of each and identify those needing action.", nl: "Veelvoorkomende oorzaken van elk benoemen en de oorzaken die actie vereisen herkennen." } },
      ],
      blocks: [
        { type: "table", header: [{ en: "Rhythm", nl: "Ritme" }, { en: "Criteria", nl: "Criteria" }, { en: "Typical causes", nl: "Typische oorzaken" }],
          rows: [
            [{ en: "Sinus bradycardia", nl: "Sinusbradycardie" }, { en: "Sinus P waves, rate < 60/min", nl: "Sinus-P-toppen, frequentie < 60/min" }, { en: "Athletes, sleep, β-blockers, hypothyroidism, inferior MI, raised ICP, sick sinus syndrome", nl: "Sporters, slaap, bètablokkers, hypothyreoïdie, onderwandinfarct, verhoogde ICP, sick-sinussyndroom" }],
            [{ en: "Sinus tachycardia", nl: "Sinustachycardie" }, { en: "Sinus P waves, rate > 100/min, gradual onset", nl: "Sinus-P-toppen, frequentie > 100/min, geleidelijk begin" }, { en: "Pain, fever, anxiety, hypovolaemia, anaemia, PE, thyrotoxicosis, sympathomimetics", nl: "Pijn, koorts, angst, hypovolemie, anemie, longembolie, thyreotoxicose, sympathicomimetica" }],
            [{ en: "Sinus arrhythmia", nl: "Sinusaritmie" }, { en: "PP variation > 160 ms, same P morphology, constant PR", nl: "PP-variatie > 160 ms, zelfde P-morfologie, constant PR" }, { en: "Respiratory (normal, especially young); non-respiratory in sinus node disease", nl: "Respiratoir (normaal, vooral bij jongeren); niet-respiratoir bij sinusknoopziekte" }],
          ] },
        { type: "ecg", ecgId: "ptbxl-00002", layout: "3x4+rhythm", caption: { en: "Sinus bradycardia at 47/min in a 19-year-old: every P is a sinus P; this is physiological.", nl: "Sinusbradycardie 47/min bij een 19-jarige: elke P is een sinus-P; dit is fysiologisch." } },
        { type: "ecg", ecgId: "ptbxl-00037", layout: "3x4+rhythm", caption: { en: "Sinus arrhythmia: note the cyclic change in PP interval on the rhythm strip while the P wave and PR stay the same.", nl: "Sinusaritmie: let op de cyclische verandering van het PP-interval op de ritmestrook terwijl P-top en PR gelijk blijven." } },
        { type: "callout", tone: "pearl", text: {
          en: "At rates above ~140/min the P wave hides in the preceding T wave. Before calling 'sinus tachycardia' at 150/min, exclude 2:1 atrial flutter: look for flutter waves in V1 and the inferior leads, or slow AV conduction with a vagal manoeuvre or adenosine.",
          nl: "Bij frequenties boven ~140/min verbergt de P-top zich in de voorafgaande T. Sluit vóór de diagnose 'sinustachycardie' bij 150/min 2:1-atriumflutter uit: zoek flutter-golven in V1 en de inferieure afleidingen, of vertraag de AV-geleiding met een vagale manoeuvre of adenosine.",
        } },
        { type: "check", question: {
          id: "m02-l01-q1", kind: "single", competency: "rate-rhythm", level: 1,
          stem: { en: "Which feature best distinguishes sinus arrhythmia from second-degree AV block as a cause of an irregular rhythm?", nl: "Welk kenmerk onderscheidt sinusaritmie het best van tweedegraads AV-blok als oorzaak van een onregelmatig ritme?" },
          options: [
            { id: "a", text: { en: "The heart rate", nl: "De hartfrequentie" }, correct: false },
            { id: "b", text: { en: "Every P wave is followed by a QRS with a constant PR", nl: "Elke P-top wordt gevolgd door een QRS met constant PR" }, correct: true, rationale: { en: "In AV block some P waves are not conducted; in sinus arrhythmia conduction is intact and the PP interval itself varies.", nl: "Bij AV-blok worden sommige P-toppen niet voortgeleid; bij sinusaritmie is de geleiding intact en varieert het PP-interval zelf." } },
            { id: "c", text: { en: "The QRS width", nl: "De QRS-breedte" }, correct: false },
            { id: "d", text: { en: "The presence of U waves", nl: "De aanwezigheid van U-golven" }, correct: false },
          ],
          explanation: { en: "Map P waves to QRS complexes. If no P is ever left unconducted and the PR is constant, the irregularity originates in the sinus node.", nl: "Koppel de P-toppen aan de QRS-complexen. Als geen enkele P onvoortgeleid blijft en het PR constant is, ontstaat de onregelmatigheid in de sinusknoop." },
        } },
      ],
      review: authored(),
    },
    {
      id: "m02-l02",
      slug: "premature-complexes",
      level: 1,
      estimatedMinutes: 20,
      title: { en: "Premature atrial and ventricular complexes", nl: "Atriale en ventriculaire extrasystolen" },
      summary: { en: "Early beats: where they come from, how to tell them apart and when they matter.", nl: "Vroege slagen: waar ze vandaan komen, hoe u ze onderscheidt en wanneer ze ertoe doen." },
      competencies: ["rate-rhythm"],
      objectives: [
        { id: "o1", competency: "rate-rhythm", text: { en: "Differentiate PACs from PVCs using P-wave, QRS width and the pause.", nl: "AES van VES onderscheiden op basis van P-top, QRS-breedte en de pauze." } },
        { id: "o2", competency: "rate-rhythm", text: { en: "Recognise bigeminy, trigeminy, couplets and multifocal PVCs.", nl: "Bigeminie, trigeminie, coupletten en multifocale VES herkennen." } },
      ],
      blocks: [
        { type: "table", header: [{ en: "Feature", nl: "Kenmerk" }, { en: "PAC", nl: "AES" }, { en: "PVC", nl: "VES" }],
          rows: [
            [{ en: "Preceding P wave", nl: "Voorafgaande P-top" }, { en: "Yes, premature and of different shape (may be hidden in T)", nl: "Ja, prematuur en anders van vorm (kan in de T verborgen zijn)" }, { en: "No (retrograde P may follow)", nl: "Nee (retrograde P kan volgen)" }],
            [{ en: "QRS", nl: "QRS" }, { en: "Narrow, identical to sinus beats (unless aberrant)", nl: "Smal, identiek aan sinusslagen (tenzij aberrant)" }, { en: "Wide ≥ 120 ms, bizarre, discordant T", nl: "Breed ≥ 120 ms, bizar, discordante T" }],
            [{ en: "Pause", nl: "Pauze" }, { en: "Non-compensatory (sinus node reset)", nl: "Niet-compensatoir (sinusknoop gereset)" }, { en: "Usually full compensatory", nl: "Meestal volledig compensatoir" }],
          ] },
        { type: "ecg", ecgId: "ptbxl-00219", layout: "3x4+rhythm", caption: { en: "Sinus rhythm with PVCs: broad early complexes without a preceding P, followed by a pause.", nl: "Sinusritme met VES: brede vroege complexen zonder voorafgaande P, gevolgd door een pauze." } },
        { type: "ecg", ecgId: "synth-pac", layout: "3x4+rhythm", caption: { en: "A premature atrial complex: find the abnormal P riding on the preceding T wave, and the reset of the sinus cycle.", nl: "Een atriale extrasystole: zoek de afwijkende P op de voorafgaande T en de reset van de sinuscyclus." } },
        { type: "callout", tone: "clinical", title: { en: "When PVCs matter", nl: "Wanneer VES ertoe doen" }, text: {
          en: "Isolated PVCs in a structurally normal heart are benign. Red flags: PVC burden > 10–15% (PVC-induced cardiomyopathy), multifocal morphology, R-on-T, couplets or non-sustained VT in the setting of ischaemia, syncope or a family history of sudden death. Outflow-tract PVCs (LBBB morphology with inferior axis) are typically benign and ablatable.",
          nl: "Geïsoleerde VES bij een structureel normaal hart zijn onschuldig. Alarmsignalen: VES-burden > 10–15% (VES-geïnduceerde cardiomyopathie), multifocale morfologie, R-op-T, coupletten of niet-aanhoudende VT bij ischemie, syncope of familiaire plotse dood. Outflowtract-VES (LBTB-morfologie met inferieure as) zijn doorgaans onschuldig en ableerbaar.",
        } },
        { type: "check", question: {
          id: "m02-l02-q1", kind: "single", competency: "rate-rhythm", level: 1,
          stem: { en: "An early narrow QRS complex is preceded by a P wave of abnormal shape; the interval from the beat before the extrasystole to the beat after it is shorter than two sinus cycles. The most likely diagnosis is:", nl: "Een vroeg smal QRS-complex wordt voorafgegaan door een P-top met afwijkende vorm; het interval van de slag vóór de extrasystole tot de slag erna is korter dan twee sinuscycli. De meest waarschijnlijke diagnose is:" },
          options: [
            { id: "a", text: { en: "Premature ventricular complex", nl: "Ventriculaire extrasystole" }, correct: false, rationale: { en: "A PVC is wide and has no preceding P.", nl: "Een VES is breed en heeft geen voorafgaande P." } },
            { id: "b", text: { en: "Premature atrial complex", nl: "Atriale extrasystole" }, correct: true },
            { id: "c", text: { en: "Mobitz I block", nl: "Mobitz I-blok" }, correct: false },
            { id: "d", text: { en: "Sinus arrhythmia", nl: "Sinusaritmie" }, correct: false },
          ],
          explanation: { en: "Abnormal premature P, narrow QRS and a non-compensatory pause are the triad of a PAC.", nl: "Afwijkende premature P, smal QRS en een niet-compensatoire pauze vormen de trias van een AES." },
        } },
      ],
      review: authored(),
    },
    {
      id: "m02-l03",
      slug: "atrial-fibrillation-and-flutter",
      level: 1,
      estimatedMinutes: 25,
      title: { en: "Atrial fibrillation and atrial flutter", nl: "Atriumfibrilleren en atriumflutter" },
      summary: { en: "The two commonest sustained arrhythmias: recognition, pitfalls and the first management decisions.", nl: "De twee meest voorkomende aanhoudende aritmieën: herkenning, valkuilen en de eerste beleidsbeslissingen." },
      competencies: ["rate-rhythm", "narrow-complex-tachycardia", "clinical-integration"],
      objectives: [
        { id: "o1", competency: "rate-rhythm", text: { en: "Diagnose AF from the absence of P waves, irregularly irregular RR and fibrillatory baseline.", nl: "AF diagnosticeren op basis van afwezige P-toppen, onregelmatig onregelmatig RR en fibrillatoire basislijn." } },
        { id: "o2", competency: "narrow-complex-tachycardia", text: { en: "Recognise typical flutter waves and infer the conduction ratio.", nl: "Typische flutter-golven herkennen en de geleidingsverhouding afleiden." } },
        { id: "o3", competency: "clinical-integration", text: { en: "Outline the initial decisions: haemodynamic stability, rate vs rhythm control, anticoagulation.", nl: "De eerste beslissingen schetsen: hemodynamische stabiliteit, frequentie- versus ritmecontrole, antistolling." } },
      ],
      blocks: [
        { type: "ecg", ecgId: "ptbxl-04117", layout: "3x4+rhythm", caption: { en: "Atrial fibrillation with rapid ventricular response: no two RR intervals are the same and there are no P waves, only a fibrillatory baseline.", nl: "Atriumfibrilleren met snelle kamerrespons: geen twee RR-intervallen zijn gelijk en er zijn geen P-toppen, alleen een fibrillatoire basislijn." } },
        { type: "callout", tone: "pitfall", title: { en: "AF look-alikes", nl: "AF-lookalikes" }, text: {
          en: "Flutter with variable block, multifocal atrial tachycardia (three or more P morphologies, usually in COPD), frequent PACs and sinus rhythm with artefact all produce irregular rhythms. Flutter with variable block is the most common mislabel: look for the sawtooth and RR intervals that are multiples of ~200 ms.",
          nl: "Flutter met wisselend blok, multifocale atriale tachycardie (drie of meer P-morfologieën, meestal bij COPD), frequente AES en sinusritme met artefact geven allemaal onregelmatige ritmes. Flutter met wisselend blok wordt het vaakst verkeerd gelabeld: zoek de zaagtand en RR-intervallen die veelvouden van ~200 ms zijn.",
        } },
        { type: "ecg", ecgId: "synth-flutter-2-1", layout: "3x4+rhythm", caption: { en: "Typical flutter with 2:1 conduction: ventricular rate 150/min; the sawtooth is best seen in II, III, aVF and as positive deflections in V1.", nl: "Typische flutter met 2:1-geleiding: kamerfrequentie 150/min; de zaagtand is het best zichtbaar in II, III, aVF en als positieve uitslagen in V1." } },
        { type: "ecg", ecgId: "ptbxl-00023", layout: "3x4+rhythm", caption: { en: "Real flutter with 2:1 conduction, atrial rate slowed by antiarrhythmic drugs. Compare with the synthetic example.", nl: "Echte flutter met 2:1-geleiding, atriale frequentie vertraagd door antiaritmica. Vergelijk met het synthetische voorbeeld." } },
        { type: "heading", text: { en: "First decisions", nl: "Eerste beslissingen" } },
        { type: "list", ordered: true, items: [
          { en: "Unstable (shock, pulmonary oedema, ischaemia, syncope)? → synchronised cardioversion.", nl: "Instabiel (shock, longoedeem, ischemie, syncope)? → gesynchroniseerde cardioversie." },
          { en: "Stable: rate control (β-blocker or non-dihydropyridine calcium antagonist; digoxin in heart failure) targeting < 110/min initially.", nl: "Stabiel: frequentiecontrole (bètablokker of non-dihydropyridine-calciumantagonist; digoxine bij hartfalen) met initieel doel < 110/min." },
          { en: "Rhythm control if symptomatic, first episode or ≤ 48 h with low stroke risk; otherwise after 3 weeks of anticoagulation or TOE.", nl: "Ritmecontrole bij klachten, eerste episode of ≤ 48 uur met laag beroerterisico; anders na 3 weken antistolling of TEE." },
          { en: "Stroke prevention according to CHA₂DS₂-VA (2024 ESC); bleeding risk modifies management, not the decision to anticoagulate.", nl: "Beroertepreventie volgens CHA₂DS₂-VA (ESC 2024); het bloedingsrisico beïnvloedt het beleid, niet het besluit om te ontstollen." },
          { en: "Pre-excited AF (irregular, wide, very fast): no AV-nodal blockers; procainamide, ibutilide or cardioversion.", nl: "Pre-geëxciteerd AF (onregelmatig, breed, zeer snel): geen AV-knoopremmers; procaïnamide, ibutilide of cardioversie." },
        ] },
        { type: "check", question: {
          id: "m02-l03-q1", kind: "single", competency: "narrow-complex-tachycardia", level: 1,
          stem: { en: "A regular narrow-complex tachycardia at exactly 150/min with 'P waves' that look different in II and V1. The first diagnosis to exclude is:", nl: "Een regelmatige smal-complex tachycardie van precies 150/min met 'P-toppen' die er in II en V1 anders uitzien. De eerste diagnose die moet worden uitgesloten is:" },
          options: [
            { id: "a", text: { en: "Sinus tachycardia", nl: "Sinustachycardie" }, correct: false },
            { id: "b", text: { en: "Atrial flutter with 2:1 conduction", nl: "Atriumflutter met 2:1-geleiding" }, correct: true, rationale: { en: "A fixed rate near 150/min is the signature of 2:1 flutter from an atrial rate of ~300/min.", nl: "Een vaste frequentie rond 150/min is de handtekening van 2:1-flutter bij een atriale frequentie van ~300/min." } },
            { id: "c", text: { en: "Atrial fibrillation", nl: "Atriumfibrilleren" }, correct: false, rationale: { en: "AF is irregular.", nl: "AF is onregelmatig." } },
            { id: "d", text: { en: "Ventricular tachycardia", nl: "Ventriculaire tachycardie" }, correct: false, rationale: { en: "VT is wide-complex.", nl: "VT is breed-complex." } },
          ],
          explanation: { en: "The flutter circuit cycles at about 300/min; with 2:1 block the ventricles follow at 150/min. The second flutter wave is often hidden in the QRS or T.", nl: "Het fluttercircuit draait ongeveer 300/min; bij 2:1-blok volgen de kamers op 150/min. De tweede flutter-golf is vaak verborgen in het QRS of de T." },
        } },
      ],
      review: authored([REFS.esc2024af]),
    },
  ],
};
