/**
 * Curated PTB-XL records used by the platform. Selection criteria: validated by a human
 * cardiologist, no baseline drift / static noise / burst noise / electrode problems flagged,
 * and the target SCP statement present with 100% likelihood (rhythm statements excepted).
 *
 * `report` is the original free-text clinical report from PTB-XL (German, Swedish or English);
 * it is kept verbatim for provenance and is NOT shown to learners.
 */
export interface PtbxlSelection {
  ecgId: number;
  age: number;
  sex: "M" | "F";
  axis: string;
  scp: Record<string, number>;
  file: string;
  report: string;
}

export const PTBXL_SELECTION: Record<string, PtbxlSelection> = {
  "norm-1": { ecgId: 3, age: 37, sex: "F", axis: "", scp: {"NORM":100,"SR":0}, file: "records500/00000/00003_hr", report: "sinusrhythmus normales ekg" },
  "norm-2": { ecgId: 10, age: 22, sex: "F", axis: "", scp: {"NORM":100,"SR":0}, file: "records500/00000/00010_hr", report: "sinusrhythmus normales ekg" },
  "sbrad": { ecgId: 2, age: 19, sex: "M", axis: "", scp: {"NORM":80,"SBRAD":0}, file: "records500/00000/00002_hr", report: "sinusbradykardie sonst normales ekg" },
  "stach": { ecgId: 698, age: 64, sex: "M", axis: "", scp: {"NORM":100,"STACH":0}, file: "records500/00000/00698_hr", report: "sinus tachycardia. normal ecg." },
  "sarrh": { ecgId: 37, age: 25, sex: "F", axis: "", scp: {"NORM":80,"SARRH":0}, file: "records500/00000/00037_hr", report: "sinus arrhythmie sonst normales ekg" },
  "afib": { ecgId: 4117, age: 39, sex: "M", axis: "AXR", scp: {"AFIB":100}, file: "records500/04000/04117_hr", report: "slt tachykardes vorhofflimmern sves hohes t in v2-4 pathologisches ekg" },
  "aflt": { ecgId: 23, age: 56, sex: "M", axis: "", scp: {"AFLT":100}, file: "records500/00000/00023_hr", report: "2:1 Überleitung bei vorhofflattern,jetzt unter 3x1  cordichin + 1x1 novodigal 0,2 etwas langsamer hf von 140 auf 128,sonst unverÄndert." },
  "1avb": { ecgId: 2509, age: 80, sex: "M", axis: "", scp: {"SR":0,"1AVB":100}, file: "records500/02000/02509_hr", report: "sinusrytm a-v block i vÄnster el-axel ospecifik t-fÖrÄndringconsensus label derived from: {'1AVB': 100.0, 'NDT': 100.0, 'SR': 0.0},{'1AVB': 100.0, 'SR': 0.0}" },
  "2avb": { ecgId: 18101, age: 75, sex: "M", axis: "LAD", scp: {"CRBBB":100,"2AVB":100}, file: "records500/18000/18101_hr", report: "rhythm is atrial tachycardia with 2:1 av block and rapid ventricular response. left axis deviation. right bundle branch block." },
  "3avb": { ecgId: 4827, age: 80, sex: "M", axis: "MID", scp: {"IMI":100,"3AVB":100}, file: "records500/04000/04827_hr", report: "kammer-rhythmus lagetyp normal av-block iii. grades intraventr. leitungsstÖrung in avf sicher subakuter inferiorer-posteriorer infarkt path. ekg" },
  "clbbb": { ecgId: 286, age: 81, sex: "F", axis: "LAD", scp: {"CLBBB":100,"SR":0}, file: "records500/00000/00286_hr", report: "sinus rhythm. left axis deviation. left bundle branch block, this is most commonly due to    ischaemic heart disease." },
  "crbbb": { ecgId: 621, age: 70, sex: "M", axis: "", scp: {"CRBBB":100,"SR":0}, file: "records500/00000/00621_hr", report: "sinus rhythm. right bundle branch block. Edit: ASMI 50, CRBBB, MI5,4% BBB 82%, (CRBBB)" },
  "lafb": { ecgId: 41, age: 42, sex: "M", axis: "ALAD", scp: {"LAFB":100,"SR":0}, file: "records500/00000/00041_hr", report: "sinusrhythmus ueberdrehter linkstyp linksanteriorer hemiblock" },
  "imi": { ecgId: 290, age: 73, sex: "M", axis: "", scp: {"IMI":100,"SR":0}, file: "records500/00000/00290_hr", report: "sinus rhythm. possible old inferior myocardial infarction." },
  "ami": { ecgId: 15865, age: 52, sex: "M", axis: "", scp: {"AMI":100,"SR":0}, file: "records500/15000/15865_hr", report: "sinusrytm gammal anteroseptal infarkt diskordant t-vÅg i avl, sÅsom vid hÖg lateral myokardaffektion." },
  "asmi": { ecgId: 177, age: 73, sex: "M", axis: "", scp: {"ASMI":100,"SR":0}, file: "records500/00000/00177_hr", report: "sinusrytm extrem vÄnster el-axel avvikande qrs(t) fÖrlopp    anteroseptal infarkt     mÖjligen fÄrsk t-fÖrÄndring, sÅsom vid    anterior myokardaffektion" },
  "ilmi": { ecgId: 947, age: 71, sex: "F", axis: "", scp: {"ILMI":100,"SR":0}, file: "records500/00000/00947_hr", report: "sinus rhythm. rightward axis. low limb lead voltage. st segments are elevated in ii, iii, avf, v4,5,6. consistent with inferolateral myocardial infarction which appears recent." },
  "lvh": { ecgId: 138, age: 74, sex: "F", axis: "", scp: {"LVH":100,"SR":0}, file: "records500/00000/00138_hr", report: "sinusrytm vÄnster kammarhypertrofi" },
  "rvh": { ecgId: 2417, age: 78, sex: "F", axis: "MID", scp: {"RVH":100,"SR":0}, file: "records500/02000/02417_hr", report: "sinusrhythmus lagetyp normal kammerhypertrophie rvh t neg in v1-v6,ii,iii,avf qt-zeit verlÄngert (medikamente) path. ekg" },
  "lae": { ecgId: 6685, age: 74, sex: "M", axis: "LAD", scp: {"LAO/LAE":100,"SR":0}, file: "records500/06000/06685_hr", report: "sinusrhythmus vorhofsueberlastung links linkstyp pathologisch" },
  "wpw": { ecgId: 2145, age: 55, sex: "F", axis: "", scp: {"WPW":100}, file: "records500/02000/02145_hr", report: "trace only requested." },
  "pvc": { ecgId: 219, age: 78, sex: "F", axis: "", scp: {"NORM":50,"PVC":100,"SR":0}, file: "records500/00000/00219_hr", report: "ventrikulÄre extrasystole(n) sinusrhythmus linkstyp vorhofsueberlastung links" },
  "bigu": { ecgId: 4637, age: 47, sex: "M", axis: "ALAD", scp: {"PVC":100,"BIGU":100}, file: "records500/04000/04637_hr", report: "interponierte ventrikulÄre extrasystole(n) supraventrikulÄre extrasystole(n), bigeminus sinusrhythmus a-v block i p-sinistrocardiale ueberdrehter linkstyp rechtsschenkelblock" },
  "pac": { ecgId: 4478, age: 74, sex: "F", axis: "", scp: {"NORM":100,"PAC":100,"SR":0}, file: "records500/04000/04478_hr", report: "premature atrial contraction(s). sinus rhythm. otherwise normal ecg." },
  "pace": { ecgId: 144, age: 81, sex: "M", axis: "", scp: {"PACE":100}, file: "records500/00000/00144_hr", report: "pacemaker ekg" },
  "psvt": { ecgId: 2051, age: 72, sex: "F", axis: "", scp: {"PSVT":100}, file: "records500/02000/02051_hr", report: "trace only requested." },
  "lngqt": { ecgId: 320, age: 79, sex: "M", axis: "", scp: {"LNGQT":100,"SR":0}, file: "records500/00000/00320_hr", report: "sinus rhythm. compared with tracing of 12:9:91, it is not  significantly changed." },
  "irbbb": { ecgId: 709, age: 34, sex: "M", axis: "", scp: {"NORM":50,"IRBBB":100,"SR":0}, file: "records500/00000/00709_hr", report: "sinus rhythm. incomplete right bundle branch block, this is probably    a normal variant. otherwise normal ecg." },
  "iscal": { ecgId: 167, age: 54, sex: "M", axis: "", scp: {"ISCAL":100,"SR":0}, file: "records500/00000/00167_hr", report: "sinusrytm t-fÖrÄndring, sÅsom vid    hÖg lateral myokardaffektion" },
  "iscin": { ecgId: 9718, age: 19, sex: "F", axis: "MID", scp: {"ISCIN":100,"SR":0}, file: "records500/09000/09718_hr", report: "sinusrhythmus lagetyp normal t abnorm in inferioren ableitungen" },
  "injas": { ecgId: 4175, age: 87, sex: "M", axis: "MID", scp: {"INJAS":100,"SR":0}, file: "records500/04000/04175_hr", report: "sinusrhythmus verdacht auf p-sinistrocardiale lagetyp normal st & t abnormal, wahrscheinlich    anteriore ischÄmie oder linksbelastung pathologisch Edit: INJAS, (INJAS)" },
  "injal": { ecgId: 1812, age: 80, sex: "F", axis: "", scp: {"INJAS":100,"INJAL":100,"SR":0}, file: "records500/01000/01812_hr", report: "sinus rhythm. t waves are flat in limb leads and inverted in v2-6. findings are likely to be due to ischaemic heart    disease. they may represent subendocardial infarction of uncertain age. it is difficult to determine whether any changes are recent. Edit: INJAS, INJAL, Sokolow 2,5(INJAS, INJAL)" },
  "pmi": { ecgId: 15059, age: 81, sex: "M", axis: "LAD", scp: {"PMI":100,"IMI":100,"1AVB":100,"SR":0}, file: "records500/15000/15059_hr", report: "sinusrhythmus a-v block i linkstyp infarkt posterior akut moeglich st- hebung avl, v1 st- senkung v3 - v6,i , avl t-veraenderungen neg v3 - v6,i , avl ekg pathologisch" },
  "el": { ecgId: 16101, age: 68, sex: "F", axis: "LAD", scp: {"EL":100,"SR":0}, file: "records500/16000/16101_hr", report: "sinusrhythmus llt diskrete st-senkung in i, v4 biphasische t in f,v3-5 elektrolytstÖrungen pathologisches ekg" },
};
