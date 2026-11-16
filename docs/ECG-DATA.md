# ECG data

## Real recordings: PTB-XL

- Source: PTB-XL v1.0.3, PhysioNet (Wagner et al. 2022, DOI 10.13026/kfzx-aw45), licence CC BY 4.0.
- Selection (`src/data/ptbxl-selection.ts`): records validated by a human cardiologist, without
  baseline drift / static noise / burst noise / electrode problems flagged, with the target SCP
  statement at 100 % likelihood (rhythm statements excepted). Two of the 34 downloaded records
  (04175, 15059) were judged too ambiguous to key reliably and are not in the library.
- Format (`public/ecg/ptbxl/*.json`): 500 Hz, 10 s, 12 leads, int16 microvolts base64-encoded
  (`EcgRecordFile`), ~150 kB each. The original free-text clinical report is kept in the selection
  file for provenance only and is never shown to learners.
- Re-download with `npm run ecg:fetch-ptbxl` (uses Node's fetch with `NODE_USE_ENV_PROXY=1`).

## Synthetic tracings

`src/lib/ecg/synth/` implements a teaching synthesizer:

1. **Dipole model.** Each wave (P right/left atrial components, septal q, main R, terminal S, bundle
   branch terminal forces, ST injury plateau, T, U, pacing spike) is an asymmetric Gaussian in time
   with a 3-D amplitude vector (x = left, y = inferior, z = anterior).
2. **Projection.** The summed dipole is projected onto 12 lead vectors (`leads.ts`): limb leads at
   their hexaxial angles; precordial leads in the horizontal plane with a proximity gain. This
   reproduces R-wave progression, a negative aVR, reciprocal ST changes and axis shifts without any
   per-lead hand-tuning.
3. **Rhythm engine.** `buildSchedule` produces P and QRS events for sinus (with variability and
   respiratory arrhythmia), AF (log-normal RR, fibrillatory baseline), flutter (sawtooth, fixed or
   variable block), Mobitz I/II, complete block with escape, PVC/PAC/bigeminy with correct pauses,
   SVT with retrograde P, VT with AV dissociation, pacing and sinus arrest.
4. **Pathology presets** (`presets.ts`): 40 named parameter sets. Every tracing is deterministic for a
   given seed, so library ids are stable.
5. **Noise.** Respiratory baseline wander and low-amplitude muscle noise, both seeded.

Limitations: the model is designed for recognisable, internally consistent teaching patterns, not for
biophysical fidelity. Pericarditis PR depression, pre-excited AF and polymorphic VT are not modelled yet.
All synthetic tracings are labelled "Synthetic" in the UI.

## Measurement helpers

`src/lib/ecg/measure.ts` contains a deliberately simple R-peak detector (Pan–Tompkins-lite with an
amplitude gate) used by tests and the library builder. Authored keys, not the detector, are the
source of truth for assessment.
