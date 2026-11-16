import type { ContentReview } from "../types";

/** Default review state for newly authored lessons: medical review pending, translation draft. */
export const authored = (refs: string[] = []): ContentReview => ({
  medical: { status: "in-review", notes: "Authored from guideline sources; awaiting cardiologist sign-off." },
  translationNl: { status: "draft", notes: "Author translation; awaiting independent editorial review." },
  sourceVersion: 1,
  references: refs,
});

export const REFS = {
  esc2023acs: "Byrne RA et al. 2023 ESC Guidelines for the management of acute coronary syndromes. Eur Heart J. 2023;44:3720–3826.",
  esc2021pacing: "Glikson M et al. 2021 ESC Guidelines on cardiac pacing and cardiac resynchronization therapy. Eur Heart J. 2022;43:3427–3520.",
  esc2024af: "Van Gelder IC et al. 2024 ESC Guidelines for the management of atrial fibrillation. Eur Heart J. 2024;45:3314–3414.",
  esc2022va: "Zeppenfeld K et al. 2022 ESC Guidelines for the management of patients with ventricular arrhythmias and the prevention of sudden cardiac death. Eur Heart J. 2022;43:3997–4126.",
  esc2019svt: "Brugada J et al. 2019 ESC Guidelines for the management of patients with supraventricular tachycardia. Eur Heart J. 2020;41:655–720.",
  aha2009: "Surawicz B et al. AHA/ACCF/HRS Recommendations for the Standardization and Interpretation of the Electrocardiogram, Part III: Intraventricular conduction disturbances. J Am Coll Cardiol. 2009;53:976–981.",
  aha2009lvh: "Hancock EW et al. AHA/ACCF/HRS Recommendations, Part V: Electrocardiogram changes associated with cardiac chamber hypertrophy. J Am Coll Cardiol. 2009;53:992–1002.",
  brugada1991: "Brugada P et al. A new approach to the differential diagnosis of a regular tachycardia with a wide QRS complex. Circulation. 1991;83:1649–1659.",
  sgarbossa1996: "Sgarbossa EB et al. Electrocardiographic diagnosis of evolving acute myocardial infarction in the presence of left bundle-branch block. N Engl J Med. 1996;334:481–487.",
  smith2012: "Smith SW et al. Diagnosis of ST-elevation myocardial infarction in the presence of left bundle branch block with the ST-elevation to S-wave ratio in a modified Sgarbossa rule. Ann Emerg Med. 2012;60:766–776.",
  umcd2018: "Thygesen K et al. Fourth universal definition of myocardial infarction (2018). Eur Heart J. 2019;40:237–269.",
  wellens1982: "de Zwaan C, Bär FW, Wellens HJ. Characteristic electrocardiographic pattern indicating a critical stenosis high in left anterior descending coronary artery. Am Heart J. 1982;103:730–736.",
};
