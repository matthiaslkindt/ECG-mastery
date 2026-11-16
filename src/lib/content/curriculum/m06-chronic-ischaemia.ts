import type { Module } from "../types";
import { REFS, authored } from "./_shared";

export const MODULE_CHRONIC_ISCHAEMIA: Module = {
  id: "m06",
  slug: "infarction-and-chronic-ischaemia",
  order: 6,
  level: 2,
  title: { en: "Old infarction and chronic ischaemic change", nl: "Oud infarct en chronische ischemische veranderingen" },
  description: {
    en: "Pathological Q waves, R-wave loss, T-wave inversion and non-specific ST-T change: what is scar, what is ischaemia and what is noise.",
    nl: "Pathologische Q-golven, R-verlies, T-inversie en aspecifieke ST-T-veranderingen: wat is litteken, wat is ischemie en wat is ruis.",
  },
  competencies: ["chronic-ischaemia"],
  review: authored([REFS.umcd2018]),
  lessons: [
    {
      id: "m06-l01",
      slug: "q-waves-and-scar",
      level: 2,
      estimatedMinutes: 20,
      title: { en: "Q waves and infarct scar", nl: "Q-golven en infarctlitteken" },
      summary: { en: "Definitions from the universal definition of MI, localisation of old infarcts and Q-wave look-alikes.", nl: "Definities uit de universele infarctdefinitie, lokalisatie van oude infarcten en Q-golf-lookalikes." },
      competencies: ["chronic-ischaemia"],
      objectives: [
        { id: "o1", competency: "chronic-ischaemia", text: { en: "Apply the Fourth Universal Definition criteria for pathological Q waves.", nl: "De criteria van de Vierde Universele Definitie voor pathologische Q-golven toepassen." } },
        { id: "o2", competency: "chronic-ischaemia", text: { en: "List the non-infarct causes of Q waves and poor R-wave progression.", nl: "De niet-infarctoorzaken van Q-golven en slechte R-progressie benoemen." } },
      ],
      blocks: [
        { type: "callout", tone: "key", title: { en: "Pathological Q (4th universal definition)", nl: "Pathologische Q (4e universele definitie)" }, text: {
          en: "Any Q ≥ 20 ms in V2–V3, or QS in V2–V3; Q ≥ 30 ms and ≥ 1 mm deep (or QS) in any two contiguous leads of I/aVL, V4–V6, II/III/aVF; R ≥ 40 ms in V1–V2 with R/S ≥ 1 and upright T (posterior infarct equivalent), in the absence of conduction defect.",
          nl: "Elke Q ≥ 20 ms in V2–V3, of QS in V2–V3; Q ≥ 30 ms en ≥ 1 mm diep (of QS) in twee aangrenzende afleidingen van I/aVL, V4–V6, II/III/aVF; R ≥ 40 ms in V1–V2 met R/S ≥ 1 en positieve T (posterior-infarctequivalent), bij afwezigheid van een geleidingsstoornis.",
        } },
        { type: "ecg", ecgId: "ptbxl-00290", layout: "3x4", focusLeads: ["II", "III", "aVF"], caption: { en: "Old inferior infarction: measure the Q-wave width in III and aVF. The ST segments are flat — this is scar, not acute injury.", nl: "Oud onderwandinfarct: meet de Q-breedte in III en aVF. De ST-segmenten zijn vlak — dit is litteken, geen acute schade." } },
        { type: "ecg", ecgId: "ptbxl-15865", layout: "3x4", focusLeads: ["V1", "V2", "V3"], caption: { en: "Old anteroseptal infarction: loss of R-wave forces in V1–V3.", nl: "Oud anteroseptaal infarct: verlies van R-krachten in V1–V3." } },
        { type: "table", caption: { en: "Q waves that are not infarction", nl: "Q-golven die geen infarct zijn" }, header: [{ en: "Cause", nl: "Oorzaak" }, { en: "Clue", nl: "Aanwijzing" }],
          rows: [
            [{ en: "Normal septal q", nl: "Normale septale q" }, { en: "< 30 ms, < 25% of R, in I, aVL, V5–V6", nl: "< 30 ms, < 25% van R, in I, aVL, V5–V6" }],
            [{ en: "Isolated Q in III or aVL", nl: "Geïsoleerde Q in III of aVL" }, { en: "Disappears with deep inspiration (III); positional", nl: "Verdwijnt bij diepe inspiratie (III); positioneel" }],
            [{ en: "LBBB, WPW", nl: "LBTB, WPW" }, { en: "Wide QRS; delta wave; short PR", nl: "Breed QRS; deltagolf; kort PR" }],
            [{ en: "HCM", nl: "HCM" }, { en: "Deep narrow 'dagger' Q in lateral/inferior leads with tall R", nl: "Diepe smalle 'dolk'-Q in laterale/inferieure afleidingen met hoge R" }],
            [{ en: "High lead placement, COPD, LVH", nl: "Hoge elektrodeplaatsing, COPD, LVH" }, { en: "Poor R progression V1–V3 without true Q; compare previous ECGs", nl: "Slechte R-progressie V1–V3 zonder echte Q; vergelijk eerdere ECG's" }],
          ] },
        { type: "check", question: {
          id: "m06-l01-q1", kind: "single", competency: "chronic-ischaemia", level: 2,
          stem: { en: "Which Q wave meets the universal-definition criterion for pathology?", nl: "Welke Q-golf voldoet aan het criterium voor pathologie van de universele definitie?" },
          options: [
            { id: "a", text: { en: "Q of 25 ms, 1 mm deep, in V6 only", nl: "Q van 25 ms, 1 mm diep, alleen in V6" }, correct: false, rationale: { en: "Too narrow and not in two contiguous leads.", nl: "Te smal en niet in twee aangrenzende afleidingen." } },
            { id: "b", text: { en: "Q of 20 ms in V2 and V3", nl: "Q van 20 ms in V2 en V3" }, correct: true, rationale: { en: "Any Q ≥ 20 ms in V2–V3 is pathological.", nl: "Elke Q ≥ 20 ms in V2–V3 is pathologisch." } },
            { id: "c", text: { en: "Q of 35 ms, 1 mm deep, in lead III alone", nl: "Q van 35 ms, 1 mm diep, alleen in afleiding III" }, correct: false, rationale: { en: "Needs a second contiguous lead (aVF or II).", nl: "Vereist een tweede aangrenzende afleiding (aVF of II)." } },
            { id: "d", text: { en: "Q of 20 ms, 0.5 mm deep, in I and aVL", nl: "Q van 20 ms, 0,5 mm diep, in I en aVL" }, correct: false },
          ],
          explanation: { en: "V2–V3 have stricter duration criteria (≥ 20 ms) because normal hearts have no Q waves there at all.", nl: "V2–V3 hebben striktere duurcriteria (≥ 20 ms) omdat normale harten daar helemaal geen Q-golven hebben." },
        } },
      ],
      review: authored([REFS.umcd2018]),
    },
    {
      id: "m06-l02",
      slug: "t-wave-and-st-changes",
      level: 3,
      estimatedMinutes: 20,
      title: { en: "T-wave inversion and non-specific ST-T change", nl: "T-inversie en aspecifieke ST-T-veranderingen" },
      summary: { en: "Normal variants, ischaemia, strain, memory and the non-cardiac causes.", nl: "Normale varianten, ischemie, strain, geheugen-T en de niet-cardiale oorzaken." },
      competencies: ["chronic-ischaemia", "clinical-integration"],
      objectives: [
        { id: "o1", competency: "chronic-ischaemia", text: { en: "Distinguish benign T inversion (V1–V3 in young women, III, aVL, persistent juvenile pattern) from pathological patterns.", nl: "Onschuldige T-inversie (V1–V3 bij jonge vrouwen, III, aVL, persisterend juveniel patroon) onderscheiden van pathologische patronen." } },
        { id: "o2", competency: "clinical-integration", text: { en: "Generate a differential for new T inversion and ST depression that includes non-coronary causes.", nl: "Een differentiaaldiagnose opstellen voor nieuwe T-inversie en ST-depressie die niet-coronaire oorzaken omvat." } },
      ],
      blocks: [
        { type: "paragraph", text: {
          en: "Ischaemic T inversion is symmetric, often deep, and clusters in a coronary territory. Strain T inversion is asymmetric with a gently sloping downstroke and accompanies tall R waves. Cardiac memory T inversion follows periods of abnormal activation (pacing, WPW, intermittent LBBB) and sits in the leads where the QRS was negative. Non-coronary causes include pulmonary embolism (V1–V4 with inferior leads), subarachnoid haemorrhage (giant, wide), takotsubo, myocarditis, HCM and ARVC (V1–V3 with epsilon waves).",
          nl: "Ischemische T-inversie is symmetrisch, vaak diep, en clustert in een coronair gebied. Strain-T-inversie is asymmetrisch met een geleidelijk aflopende flank en gaat gepaard met hoge R-toppen. Geheugen-T-inversie volgt op perioden van abnormale activatie (pacing, WPW, intermitterend LBTB) en zit in de afleidingen waar het QRS negatief was. Niet-coronaire oorzaken zijn longembolie (V1–V4 met inferieure afleidingen), subarachnoïdale bloeding (reusachtig, breed), takotsubo, myocarditis, HCM en ARVC (V1–V3 met epsilongolven).",
        } },
        { type: "ecg", ecgId: "ptbxl-09718", layout: "3x4", caption: { en: "Inferior T inversion in a 19-year-old woman. Without symptoms, Q waves or family history this is most likely a normal variant.", nl: "Inferieure T-inversie bij een 19-jarige vrouw. Zonder klachten, Q-golven of familieanamnese is dit hoogstwaarschijnlijk een normale variant." } },
        { type: "ecg", ecgId: "ptbxl-00167", layout: "3x4", focusLeads: ["I", "aVL", "V5", "V6"], caption: { en: "High lateral T-wave change in a 54-year-old man: compare with previous ECGs and ask about symptoms before labelling it ischaemic.", nl: "Hoog-laterale T-topverandering bij een 54-jarige man: vergelijk met eerdere ECG's en vraag naar klachten voordat u het ischemisch noemt." } },
        { type: "callout", tone: "clinical", text: {
          en: "'Non-specific ST-T changes' is a legitimate conclusion when changes are < 1 mm, do not follow a territory and have no clear cause. It is not a licence to stop thinking: document the comparison with prior tracings and the clinical question.",
          nl: "'Aspecifieke ST-T-veranderingen' is een legitieme conclusie als de veranderingen < 1 mm zijn, geen gebied volgen en geen duidelijke oorzaak hebben. Het is geen vrijbrief om te stoppen met denken: documenteer de vergelijking met eerdere registraties en de klinische vraag.",
        } },
        { type: "check", question: {
          id: "m06-l02-q1", kind: "single", competency: "chronic-ischaemia", level: 3,
          stem: { en: "A patient with a dual-chamber pacemaker has T inversion in V1–V4 on an ECG recorded during intrinsic conduction. The most likely explanation is:", nl: "Een patiënt met een tweekamerpacemaker heeft T-inversie in V1–V4 op een ECG geregistreerd tijdens intrinsieke geleiding. De meest waarschijnlijke verklaring is:" },
          options: [
            { id: "a", text: { en: "Wellens syndrome", nl: "Wellens-syndroom" }, correct: false },
            { id: "b", text: { en: "Cardiac memory from prior ventricular pacing", nl: "Cardiaal geheugen door eerdere ventriculaire pacing" }, correct: true },
            { id: "c", text: { en: "Pulmonary embolism", nl: "Longembolie" }, correct: false },
            { id: "d", text: { en: "Pacemaker malfunction", nl: "Pacemakermalfunctie" }, correct: false },
          ],
          explanation: { en: "Memory T waves appear in leads where the paced QRS was negative (V1–V4 with RV pacing); unlike Wellens they are not accompanied by chest pain and resolve over weeks if pacing stops.", nl: "Geheugen-T-toppen verschijnen in afleidingen waar het gepacete QRS negatief was (V1–V4 bij RV-pacing); anders dan bij Wellens gaan ze niet gepaard met pijn op de borst en verdwijnen ze over weken als de pacing stopt." },
        } },
      ],
      review: authored(),
    },
  ],
};
