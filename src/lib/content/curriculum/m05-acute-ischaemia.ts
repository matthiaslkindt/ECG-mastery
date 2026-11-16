import type { Module } from "../types";
import { REFS, authored } from "./_shared";

export const MODULE_ACUTE_ISCHAEMIA: Module = {
  id: "m05",
  slug: "acute-coronary-syndromes",
  order: 5,
  level: 2,
  title: { en: "Acute coronary syndromes", nl: "Acute coronaire syndromen" },
  description: {
    en: "STEMI criteria and localisation, reciprocal change, STEMI equivalents and the mimics that send patients to the wrong place.",
    nl: "STEMI-criteria en lokalisatie, reciproke veranderingen, STEMI-equivalenten en de mimics die patiënten naar de verkeerde plek sturen.",
  },
  competencies: ["acute-ischaemia", "clinical-integration"],
  summativeTestSlug: "acs-test",
  review: authored([REFS.esc2023acs, REFS.umcd2018]),
  lessons: [
    {
      id: "m05-l01",
      slug: "stemi-criteria-and-localisation",
      level: 2,
      estimatedMinutes: 30,
      title: { en: "STEMI: criteria, territories and reciprocal change", nl: "STEMI: criteria, gebieden en reciproke veranderingen" },
      summary: { en: "Millimetre thresholds by lead, age and sex; mapping leads to arteries; why reciprocal depression is your friend.", nl: "Millimeterdrempels per afleiding, leeftijd en geslacht; afleidingen koppelen aan arteriën; waarom reciproke depressie uw vriend is." },
      competencies: ["acute-ischaemia"],
      objectives: [
        { id: "o1", competency: "acute-ischaemia", text: { en: "State the universal-definition ST-elevation thresholds for V2–V3 and other leads.", nl: "De ST-elevatiedrempels van de universele definitie voor V2–V3 en overige afleidingen benoemen." } },
        { id: "o2", competency: "acute-ischaemia", text: { en: "Localise the culprit artery from the leads involved and the reciprocal changes.", nl: "De culprit-arterie lokaliseren aan de hand van de betrokken afleidingen en de reciproke veranderingen." } },
        { id: "o3", competency: "acute-ischaemia", text: { en: "Recognise hyperacute T waves and the evolution of STEMI over hours to days.", nl: "Hyperacute T-toppen herkennen en de evolutie van STEMI over uren tot dagen kennen." } },
      ],
      blocks: [
        { type: "callout", tone: "key", title: { en: "ST elevation thresholds (J point, two contiguous leads)", nl: "ST-elevatiedrempels (J-punt, twee aangrenzende afleidingen)" }, text: {
          en: "V2–V3: ≥ 2.5 mm in men < 40 y, ≥ 2 mm in men ≥ 40 y, ≥ 1.5 mm in women. All other leads: ≥ 1 mm. Posterior leads V7–V9: ≥ 0.5 mm. V3R–V4R: ≥ 0.5 mm (≥ 1 mm in men < 30 y). Thresholds are a floor, not a ceiling: with a convincing story, reperfusion should not wait for the millimetres.",
          nl: "V2–V3: ≥ 2,5 mm bij mannen < 40 jaar, ≥ 2 mm bij mannen ≥ 40 jaar, ≥ 1,5 mm bij vrouwen. Alle overige afleidingen: ≥ 1 mm. Posterieure afleidingen V7–V9: ≥ 0,5 mm. V3R–V4R: ≥ 0,5 mm (≥ 1 mm bij mannen < 30 jaar). Drempels zijn een ondergrens, geen bovengrens: bij een overtuigend verhaal wacht reperfusie niet op de millimeters.",
        } },
        { type: "table", caption: { en: "Territories and culprit arteries", nl: "Gebieden en culprit-arteriën" }, header: [{ en: "Leads with ST elevation", nl: "Afleidingen met ST-elevatie" }, { en: "Territory", nl: "Gebied" }, { en: "Usual artery", nl: "Gebruikelijke arterie" }, { en: "Reciprocal leads", nl: "Reciproke afleidingen" }],
          rows: [
            [{ en: "II, III, aVF", nl: "II, III, aVF" }, { en: "Inferior", nl: "Onderwand" }, { en: "RCA (III > II, ST↓ in I/aVL) or LCx (II ≥ III, no ST↓ in I)", nl: "RCA (III > II, ST↓ in I/aVL) of LCx (II ≥ III, geen ST↓ in I)" }, { en: "I, aVL", nl: "I, aVL" }],
            [{ en: "V1–V4", nl: "V1–V4" }, { en: "Anteroseptal / anterior", nl: "Anteroseptaal / voorwand" }, { en: "LAD; proximal if also aVR/aVL elevation, new RBBB, inferior ST↓", nl: "LAD; proximaal bij ook aVR/aVL-elevatie, nieuw RBTB, inferieure ST↓" }, { en: "II, III, aVF (proximal)", nl: "II, III, aVF (proximaal)" }],
            [{ en: "I, aVL, V5–V6", nl: "I, aVL, V5–V6" }, { en: "Lateral", nl: "Lateraal" }, { en: "LCx or diagonal", nl: "LCx of diagonaal" }, { en: "III, aVF", nl: "III, aVF" }],
            [{ en: "ST↓ V1–V3 with tall R, upright T; ST↑ V7–V9", nl: "ST↓ V1–V3 met hoge R, positieve T; ST↑ V7–V9" }, { en: "Posterior", nl: "Posterior" }, { en: "LCx or RCA posterolateral branches", nl: "LCx of posterolaterale takken van RCA" }, { en: "V1–V3 (the depression IS the reciprocal change)", nl: "V1–V3 (de depressie IS de reciproke verandering)" }],
            [{ en: "V1, V3R–V4R with inferior STEMI", nl: "V1, V3R–V4R bij inferieur STEMI" }, { en: "Right ventricle", nl: "Rechterkamer" }, { en: "Proximal RCA", nl: "Proximale RCA" }, { en: "—", nl: "—" }],
          ] },
        { type: "ecg", ecgId: "synth-stemi-inferior", layout: "3x4+rhythm", caption: { en: "Inferior STEMI: ST elevation in II, III, aVF; the reciprocal depression in aVL is often the earliest and most specific sign. Note the bradycardia.", nl: "Inferieur STEMI: ST-elevatie in II, III, aVF; de reciproke depressie in aVL is vaak het vroegste en meest specifieke teken. Let op de bradycardie." } },
        { type: "ecg", ecgId: "synth-stemi-anterior", layout: "3x4+rhythm", caption: { en: "Anteroseptal STEMI with hyperacute T waves in V2–V4: broad-based, tall relative to the QRS, asymmetric.", nl: "Anteroseptaal STEMI met hyperacute T-toppen in V2–V4: brede basis, hoog ten opzichte van het QRS, asymmetrisch." } },
        { type: "ecg", ecgId: "ptbxl-00947", layout: "3x4+rhythm", caption: { en: "A real inferolateral infarction: compare the amplitude and shape of the ST segments in II, III, aVF with the synthetic example, and notice the low limb-lead voltages.", nl: "Een echt inferolateraal infarct: vergelijk amplitude en vorm van de ST-segmenten in II, III, aVF met het synthetische voorbeeld, en let op de lage extremiteitsvoltages." } },
        { type: "callout", tone: "pearl", title: { en: "Reciprocal change", nl: "Reciproke veranderingen" }, text: {
          en: "ST depression in leads facing away from the injured wall is present in most inferior and lateral STEMIs and in proximal LAD occlusion. Its presence makes pericarditis, early repolarisation and LV aneurysm unlikely. Its absence does not exclude STEMI, especially in anterior infarction.",
          nl: "ST-depressie in afleidingen die van de beschadigde wand af kijken is aanwezig bij de meeste inferieure en laterale STEMI's en bij proximale LAD-occlusie. Aanwezigheid maakt pericarditis, vroege repolarisatie en LV-aneurysma onwaarschijnlijk. Afwezigheid sluit STEMI niet uit, vooral niet bij voorwandinfarct.",
        } },
        { type: "check", question: {
          id: "m05-l01-q1", kind: "single", competency: "acute-ischaemia", level: 2,
          stem: { en: "ST elevation of 3 mm in III, 2 mm in II and aVF, ST depression in I and aVL, and 1 mm ST elevation in V1. Which additional recording is most important before giving nitrates?", nl: "ST-elevatie van 3 mm in III, 2 mm in II en aVF, ST-depressie in I en aVL, en 1 mm ST-elevatie in V1. Welke aanvullende registratie is het belangrijkst vóór het geven van nitraten?" },
          options: [
            { id: "a", text: { en: "Posterior leads V7–V9", nl: "Posterieure afleidingen V7–V9" }, correct: false },
            { id: "b", text: { en: "Right-sided leads V3R–V4R", nl: "Rechtszijdige afleidingen V3R–V4R" }, correct: true, rationale: { en: "III > II with ST elevation in V1 suggests proximal RCA occlusion with RV involvement; RV infarction is preload-dependent and nitrates can cause profound hypotension.", nl: "III > II met ST-elevatie in V1 wijst op proximale RCA-occlusie met RV-betrokkenheid; RV-infarct is preload-afhankelijk en nitraten kunnen diepe hypotensie geven." } },
            { id: "c", text: { en: "A repeat 12-lead in 10 minutes", nl: "Een herhaald 12-afleidingen-ECG na 10 minuten" }, correct: false },
            { id: "d", text: { en: "Lead aVR at double gain", nl: "Afleiding aVR met dubbele versterking" }, correct: false },
          ],
          explanation: { en: "ST elevation in V4R ≥ 1 mm identifies RV infarction in inferior STEMI; manage with fluids, avoid nitrates and diuretics.", nl: "ST-elevatie in V4R ≥ 1 mm identificeert RV-infarct bij inferieur STEMI; behandel met vocht, vermijd nitraten en diuretica." },
        } },
      ],
      review: authored([REFS.esc2023acs, REFS.umcd2018]),
    },
    {
      id: "m05-l02",
      slug: "stemi-equivalents-and-mimics",
      level: 3,
      estimatedMinutes: 30,
      title: { en: "STEMI equivalents and mimics", nl: "STEMI-equivalenten en mimics" },
      summary: { en: "Occlusion without classic elevation (posterior MI, de Winter, Wellens, aVR) and elevation without occlusion (pericarditis, early repolarisation, LVH, LBBB, Brugada, aneurysm).", nl: "Occlusie zonder klassieke elevatie (posterior infarct, de Winter, Wellens, aVR) en elevatie zonder occlusie (pericarditis, vroege repolarisatie, LVH, LBTB, Brugada, aneurysma)." },
      competencies: ["acute-ischaemia", "clinical-integration"],
      objectives: [
        { id: "o1", competency: "acute-ischaemia", text: { en: "Recognise the occlusion-MI patterns that do not meet STEMI millimetre criteria.", nl: "De occlusie-infarctpatronen herkennen die niet aan de STEMI-millimetercriteria voldoen." } },
        { id: "o2", competency: "acute-ischaemia", text: { en: "Separate pericarditis and early repolarisation from STEMI using shape, distribution, PR segment and ST/T ratio.", nl: "Pericarditis en vroege repolarisatie van STEMI onderscheiden op basis van vorm, verdeling, PR-segment en ST/T-ratio." } },
      ],
      blocks: [
        { type: "heading", text: { en: "Occlusion without 'STEMI'", nl: "Occlusie zonder 'STEMI'" } },
        { type: "list", items: [
          { en: "Posterior MI: horizontal ST depression V1–V3 with upright T and growing R; confirm with V7–V9 ≥ 0.5 mm.", nl: "Posterior infarct: horizontale ST-depressie V1–V3 met positieve T en toenemende R; bevestig met V7–V9 ≥ 0,5 mm." },
          { en: "De Winter pattern: upsloping ST depression at the J point with tall symmetric T in V1–V6, often slight aVR elevation — proximal LAD occlusion.", nl: "De Winter-patroon: oplopende ST-depressie bij het J-punt met hoge symmetrische T in V1–V6, vaak lichte aVR-elevatie — proximale LAD-occlusie." },
          { en: "Hyperacute T waves: the first minutes of occlusion, before ST elevation.", nl: "Hyperacute T-toppen: de eerste minuten van occlusie, vóór ST-elevatie." },
          { en: "Wellens: biphasic (type A) or deeply inverted (type B) T in V2–V4 after pain has resolved — reperfused but critical LAD lesion.", nl: "Wellens: bifasische (type A) of diep negatieve (type B) T in V2–V4 nadat de pijn is verdwenen — gereperfundeerde maar kritische LAD-laesie." },
          { en: "ST elevation in aVR ≥ 1 mm with diffuse ST depression: left main or three-vessel ischaemia, or any global supply–demand mismatch.", nl: "ST-elevatie in aVR ≥ 1 mm met diffuse ST-depressie: hoofdstam- of drievatsischemie, of elke globale vraag-aanbod-mismatch." },
          { en: "Sgarbossa-positive LBBB or paced rhythm.", nl: "Sgarbossa-positief LBTB of gepacet ritme." },
        ] },
        { type: "ecg", ecgId: "synth-posterior-mi", layout: "3x4", focusLeads: ["V1", "V2", "V3"], caption: { en: "Posterior MI: the ST depression in V1–V3 is the mirror image of posterior ST elevation. Flip the tracing mentally.", nl: "Posterior infarct: de ST-depressie in V1–V3 is het spiegelbeeld van posterieure ST-elevatie. Draai de registratie in gedachten om." } },
        { type: "ecg", ecgId: "ptbxl-01812", layout: "3x4", caption: { en: "Deep anterior T inversion in an 80-year-old woman. With a recent history of chest pain this is a Wellens pattern until angiography says otherwise.", nl: "Diepe anterieure T-inversie bij een 80-jarige vrouw. Met recente pijn op de borst is dit een Wellens-patroon tot angiografie het tegendeel bewijst." } },
        { type: "heading", text: { en: "Elevation without occlusion", nl: "Elevatie zonder occlusie" } },
        { type: "table", header: [{ en: "Mimic", nl: "Mimic" }, { en: "Clues", nl: "Aanwijzingen" }],
          rows: [
            [{ en: "Acute pericarditis", nl: "Acute pericarditis" }, { en: "Diffuse concave elevation ignoring territories; PR depression (PR elevation in aVR); no reciprocal change except aVR/V1; ST/T ratio in V6 > 0.25; pleuritic pain, rub", nl: "Diffuse concave elevatie zonder gebiedsverdeling; PR-depressie (PR-elevatie in aVR); geen reciproke veranderingen behalve aVR/V1; ST/T-ratio in V6 > 0,25; pleuritische pijn, wrijven" }],
            [{ en: "Early repolarisation", nl: "Vroege repolarisatie" }, { en: "Young, stable over time; J-point notch/slur; concave; tall T; most marked in V4; ST/T ratio < 0.25", nl: "Jong, stabiel in de tijd; J-punt-kerf/slur; concaaf; hoge T; het duidelijkst in V4; ST/T-ratio < 0,25" }],
            [{ en: "LVH / LBBB / paced", nl: "LVH / LBTB / gepacet" }, { en: "Discordant elevation in V1–V3 proportional to the S-wave depth", nl: "Discordante elevatie in V1–V3 evenredig met de S-diepte" }],
            [{ en: "LV aneurysm", nl: "LV-aneurysma" }, { en: "Persistent elevation with Q waves after old MI; T/QRS ratio < 0.36 in V1–V4", nl: "Persisterende elevatie met Q-golven na oud infarct; T/QRS-ratio < 0,36 in V1–V4" }],
            [{ en: "Brugada, hyperkalaemia, PE, takotsubo, SAH", nl: "Brugada, hyperkaliëmie, longembolie, takotsubo, SAB" }, { en: "Context; coved V1–V2; peaked T; S1Q3T3 with RV strain; apical pattern after stress", nl: "Context; koepelvormig V1–V2; spitse T; S1Q3T3 met RV-strain; apicaal patroon na stress" }],
          ] },
        { type: "ecg", ecgId: "synth-pericarditis", layout: "3x4", caption: { en: "Pericarditis: elevation in almost all leads, depression only in aVR — no coronary artery supplies this distribution.", nl: "Pericarditis: elevatie in bijna alle afleidingen, depressie alleen in aVR — geen enkele coronairarterie verzorgt deze verdeling." } },
        { type: "check", question: {
          id: "m05-l02-q1", kind: "single", competency: "acute-ischaemia", level: 3,
          stem: { en: "A 58-year-old with 40 minutes of crushing chest pain: ST depression 2 mm in V1–V3 with tall R waves and upright T waves; no ST elevation anywhere on the standard 12 leads. The best next step is:", nl: "Een 58-jarige met 40 minuten drukkende pijn op de borst: ST-depressie 2 mm in V1–V3 met hoge R-toppen en positieve T; nergens ST-elevatie op de standaard 12 afleidingen. De beste volgende stap is:" },
          options: [
            { id: "a", text: { en: "Treat as NSTEMI and plan angiography within 24 h", nl: "Behandelen als NSTEMI en angiografie binnen 24 uur plannen" }, correct: false },
            { id: "b", text: { en: "Record V7–V9 and, if ST elevation ≥ 0.5 mm, activate the cath lab for posterior STEMI", nl: "V7–V9 registreren en bij ST-elevatie ≥ 0,5 mm het cathlab activeren voor posterior STEMI" }, correct: true },
            { id: "c", text: { en: "Repeat troponin in 3 hours", nl: "Troponine herhalen na 3 uur" }, correct: false },
            { id: "d", text: { en: "Perform an exercise test", nl: "Een inspanningstest uitvoeren" }, correct: false },
          ],
          explanation: { en: "Isolated anterior ST depression in a patient with ongoing ischaemic pain is posterior STEMI until proven otherwise; ESC 2023 treats it as a STEMI equivalent.", nl: "Geïsoleerde anterieure ST-depressie bij een patiënt met aanhoudende ischemische pijn is posterior STEMI tot het tegendeel bewezen is; ESC 2023 beschouwt het als STEMI-equivalent." },
        } },
      ],
      review: authored([REFS.esc2023acs, REFS.wellens1982, REFS.smith2012]),
    },
  ],
};
