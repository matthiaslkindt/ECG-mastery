import type { Module } from "../types";
import { REFS, authored } from "./_shared";

export const MODULE_BRADY_PACING: Module = {
  id: "m09",
  slug: "bradyarrhythmias-and-pacing",
  order: 9,
  level: 3,
  title: { en: "Bradyarrhythmias and pacing", nl: "Bradyaritmieën en pacing" },
  description: {
    en: "Sinus node dysfunction, escape rhythms, pacemaker ECGs and recognising failure to capture, sense and pace.",
    nl: "Sinusknoopdisfunctie, escape-ritmes, pacemaker-ECG's en het herkennen van falende capture, sensing en pacing.",
  },
  competencies: ["bradyarrhythmia-pacing"],
  review: authored([REFS.esc2021pacing]),
  lessons: [
    {
      id: "m09-l01",
      slug: "sinus-node-dysfunction-and-escape",
      level: 3,
      estimatedMinutes: 20,
      title: { en: "Sinus node dysfunction and escape rhythms", nl: "Sinusknoopdisfunctie en escape-ritmes" },
      summary: { en: "Pauses, arrest, exit block, tachy-brady syndrome and the hierarchy of subsidiary pacemakers.", nl: "Pauzes, arrest, exit-blok, tachy-bradysyndroom en de hiërarchie van hulppacemakers." },
      competencies: ["bradyarrhythmia-pacing"],
      objectives: [
        { id: "o1", competency: "bradyarrhythmia-pacing", text: { en: "Differentiate sinus pause/arrest from sinoatrial exit block and blocked PACs.", nl: "Sinuspauze/-arrest onderscheiden van sinoatriaal exit-blok en geblokkeerde AES." } },
        { id: "o2", competency: "bradyarrhythmia-pacing", text: { en: "Identify junctional and ventricular escape rhythms by rate and QRS width.", nl: "Junctionele en ventriculaire escape-ritmes herkennen aan frequentie en QRS-breedte." } },
      ],
      blocks: [
        { type: "paragraph", text: {
          en: "The sinus node normally suppresses subsidiary pacemakers. When it fails, the AV junction escapes at 40–60/min with a narrow QRS (unless there is pre-existing bundle branch block); below that, the ventricular myocardium escapes at 20–40/min with a wide QRS. Pauses with no escape beat at all suggest diffuse conduction-system disease or drugs.",
          nl: "De sinusknoop onderdrukt normaal de hulppacemakers. Faalt hij, dan ontsnapt de AV-junctie met 40–60/min en een smal QRS (tenzij er al een bundeltakblok is); daaronder ontsnapt het kamermyocard met 20–40/min en een breed QRS. Pauzes zonder enige escape-slag wijzen op diffuse ziekte van het geleidingssysteem of op medicatie.",
        } },
        { type: "ecg", ecgId: "synth-sinus-arrest", layout: "3x4+rhythm", caption: { en: "A 3.2-second sinus pause ended by a junctional escape beat (narrow QRS, no preceding P). Check whether the pause is a multiple of the PP interval: if so, think of sinoatrial exit block.", nl: "Een sinuspauze van 3,2 seconden beëindigd door een junctionele escape-slag (smal QRS, geen voorafgaande P). Controleer of de pauze een veelvoud van het PP-interval is: zo ja, denk aan sinoatriaal exit-blok." } },
        { type: "callout", tone: "pitfall", title: { en: "Blocked PAC", nl: "Geblokkeerde AES" }, text: {
          en: "The commonest cause of an unexpected pause is a premature P wave hidden in the preceding T wave that finds the AV node refractory. Compare the T wave before the pause with other T waves before diagnosing sinus arrest.",
          nl: "De meest voorkomende oorzaak van een onverwachte pauze is een premature P-top verborgen in de voorafgaande T die de AV-knoop refractair aantreft. Vergelijk de T vóór de pauze met andere T-toppen voordat u sinusarrest diagnosticeert.",
        } },
        { type: "callout", tone: "clinical", title: { en: "Who gets a pacemaker (ESC 2021)", nl: "Wie krijgt een pacemaker (ESC 2021)" }, text: {
          en: "Sinus node disease: only when symptoms are clearly attributable to bradycardia. AV block: Mobitz II, 2:1 with wide QRS, high-grade or complete block regardless of symptoms unless reversible; Mobitz I only if symptomatic or infranodal. Always exclude reversible causes: drugs, hyperkalaemia, hypothyroidism, Lyme carditis, inferior MI, sleep apnoea.",
          nl: "Sinusknoopziekte: alleen als klachten duidelijk aan bradycardie zijn toe te schrijven. AV-blok: Mobitz II, 2:1 met breed QRS, hooggradig of totaal blok ongeacht klachten tenzij reversibel; Mobitz I alleen bij klachten of infranodale lokalisatie. Sluit altijd reversibele oorzaken uit: medicatie, hyperkaliëmie, hypothyreoïdie, Lyme-carditis, onderwandinfarct, slaapapneu.",
        } },
        { type: "check", question: {
          id: "m09-l01-q1", kind: "single", competency: "bradyarrhythmia-pacing", level: 3,
          stem: { en: "A regular rhythm at 45/min with narrow QRS complexes and no visible P waves before them; small negative deflections appear just after each QRS in II, III and aVF. This is:", nl: "Een regelmatig ritme van 45/min met smalle QRS-complexen zonder zichtbare P-toppen ervoor; kleine negatieve deflecties verschijnen net na elk QRS in II, III en aVF. Dit is:" },
          options: [
            { id: "a", text: { en: "Sinus bradycardia", nl: "Sinusbradycardie" }, correct: false },
            { id: "b", text: { en: "Junctional escape rhythm with retrograde atrial activation", nl: "Junctioneel escape-ritme met retrograde atriale activatie" }, correct: true },
            { id: "c", text: { en: "Idioventricular rhythm", nl: "Idioventriculair ritme" }, correct: false, rationale: { en: "Ventricular escape is wide and slower.", nl: "Ventriculair escape is breed en trager." } },
            { id: "d", text: { en: "Atrial fibrillation with slow response", nl: "Atriumfibrilleren met trage respons" }, correct: false, rationale: { en: "AF would be irregular.", nl: "AF zou onregelmatig zijn." } },
          ],
          explanation: { en: "Narrow QRS at 40–60/min with inverted P waves after the QRS (retrograde conduction) is the signature of a junctional rhythm.", nl: "Smal QRS op 40–60/min met negatieve P-toppen na het QRS (retrograde geleiding) is de handtekening van een junctioneel ritme." },
        } },
      ],
      review: authored([REFS.esc2021pacing]),
    },
    {
      id: "m09-l02",
      slug: "paced-rhythms",
      level: 3,
      estimatedMinutes: 20,
      title: { en: "Reading the paced ECG", nl: "Het gepacete ECG lezen" },
      summary: { en: "Pacing modes, expected morphology and the three malfunctions.", nl: "Pacingmodi, verwachte morfologie en de drie malfuncties." },
      competencies: ["bradyarrhythmia-pacing"],
      objectives: [
        { id: "o1", competency: "bradyarrhythmia-pacing", text: { en: "Identify atrial, ventricular and dual-chamber pacing from spike position and QRS morphology.", nl: "Atriale, ventriculaire en tweekamerpacing herkennen aan spike-positie en QRS-morfologie." } },
        { id: "o2", competency: "bradyarrhythmia-pacing", text: { en: "Recognise failure to capture, undersensing and oversensing.", nl: "Falende capture, undersensing en oversensing herkennen." } },
      ],
      blocks: [
        { type: "ecg", ecgId: "ptbxl-00144", layout: "3x4+rhythm", caption: { en: "Ventricular pacing: a spike before each wide QRS at a fixed 70/min. RV apical pacing produces an LBBB-like pattern with a left/superior axis.", nl: "Ventriculaire pacing: een spike vóór elk breed QRS met vaste 70/min. RV-apicale pacing geeft een LBTB-achtig patroon met een linker/superieure as." } },
        { type: "table", header: [{ en: "Problem", nl: "Probleem" }, { en: "ECG", nl: "ECG" }, { en: "Common causes", nl: "Veelvoorkomende oorzaken" }],
          rows: [
            [{ en: "Failure to capture", nl: "Falende capture" }, { en: "Spikes without a following P/QRS (outside refractory periods)", nl: "Spikes zonder volgende P/QRS (buiten refractaire perioden)" }, { en: "Lead dislodgement, high threshold (fibrosis, hyperkalaemia, flecainide), battery depletion", nl: "Leaddislocatie, hoge drempel (fibrose, hyperkaliëmie, flecaïnide), batterijuitputting" }],
            [{ en: "Undersensing", nl: "Undersensing" }, { en: "Spikes at inappropriate times despite intrinsic activity (competing rhythm)", nl: "Spikes op ongepaste momenten ondanks intrinsieke activiteit (concurrerend ritme)" }, { en: "Lead problem, low-amplitude intrinsic signal, magnet mode", nl: "Leadprobleem, intrinsiek signaal met lage amplitude, magneetmodus" }],
            [{ en: "Oversensing", nl: "Oversensing" }, { en: "Missing spikes with pauses longer than the lower rate interval", nl: "Ontbrekende spikes met pauzes langer dan het laagste-frequentie-interval" }, { en: "Myopotentials, electromagnetic interference, lead fracture, T-wave sensing", nl: "Myopotentialen, elektromagnetische interferentie, leadbreuk, T-top-sensing" }],
          ] },
        { type: "callout", tone: "pearl", text: {
          en: "A paced QRS with RBBB morphology (positive in V1) suggests a left-ventricular or septal lead (CRT, conduction-system pacing) — or, if unexpected, lead perforation or inadvertent LV placement via a patent foramen ovale.",
          nl: "Een gepacet QRS met RBTB-morfologie (positief in V1) wijst op een linkerkamer- of septale lead (CRT, geleidingssysteem-pacing) — of, indien onverwacht, op leadperforatie of onbedoelde LV-plaatsing via een open foramen ovale.",
        } },
        { type: "check", question: {
          id: "m09-l02-q1", kind: "single", competency: "bradyarrhythmia-pacing", level: 3,
          stem: { en: "A VVI pacemaker set at 60/min: the strip shows pacing spikes every second, each followed by a wide QRS, except two spikes that fall shortly after intrinsic QRS complexes and are not followed by a QRS. The most likely problem is:", nl: "Een VVI-pacemaker op 60/min: de strook toont elke seconde een spike, elk gevolgd door een breed QRS, behalve twee spikes die kort na intrinsieke QRS-complexen vallen en niet door een QRS worden gevolgd. Het meest waarschijnlijke probleem is:" },
          options: [
            { id: "a", text: { en: "Failure to capture", nl: "Falende capture" }, correct: false, rationale: { en: "Spikes landing in the ventricular refractory period cannot capture; the problem is that they were delivered at all.", nl: "Spikes in de ventriculaire refractaire periode kunnen niet capturen; het probleem is dat ze überhaupt werden afgegeven." } },
            { id: "b", text: { en: "Undersensing", nl: "Undersensing" }, correct: true },
            { id: "c", text: { en: "Oversensing", nl: "Oversensing" }, correct: false },
            { id: "d", text: { en: "Normal function with fusion beats", nl: "Normale functie met fusieslagen" }, correct: false },
          ],
          explanation: { en: "The pacemaker failed to see the intrinsic beats and paced on schedule; the spikes fell in the refractory period and could not capture.", nl: "De pacemaker zag de intrinsieke slagen niet en pacete volgens schema; de spikes vielen in de refractaire periode en konden niet capturen." },
        } },
      ],
      review: authored([REFS.esc2021pacing]),
    },
  ],
};
