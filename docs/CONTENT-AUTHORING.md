# Content authoring

All learner-facing content is TypeScript data in `src/lib/content/`. This keeps it type-checked,
diffable and reviewable, and makes bilingual authoring explicit: every string is a
`Localized` object `{ en, nl }`.

## Review metadata

Each module, lesson, case, assessment and library entry carries a `ContentReview`:

```ts
review: {
  medical:       { status: "in-review", reviewer?: string, date?: string, notes?: string },
  translationNl: { status: "draft",     reviewer?: string, date?: string, notes?: string },
  sourceVersion: 1,            // version of the English source the Dutch text was made from
  references: [ ... ]          // guideline / paper citations
}
```

The two reviews are independent by design: a cardiologist signs off the English medical content;
a separate medical translator/editor signs off the Dutch text against the approved source. When the
English source changes, bump `sourceVersion` and set `translationNl.status` back to `needs-revision`.
`npm run content:check` prints the status of every item; `--fail-on-draft` makes CI fail until
everything is approved.

## Curriculum

`curriculum/mNN-*.ts` each export a `Module` with ordered `lessons`. A lesson has:

- `objectives` — each tagged with one `CompetencyId` (see `competencies.ts`);
- `blocks` — `heading`, `paragraph`, `list`, `callout` (key / pitfall / pearl / clinical), `table`,
  `ecg` (by library id, with layout, focus leads and optional time annotations) and `check`
  (an in-lesson question; these are also collected into the module's formative practice set).

## ECG library

`library/ptbxl.ts` and `library/synthetic.ts` define `EcgLibraryEntry` items with an
`InterpretationKey`:

- numeric fields (`rate`, `pr`, `qrs`, `qtc`) with a tolerance — omit a field to leave it unscored,
  set `pr: null` to mean "not measurable";
- `findings` (required), `optionalFindings` (accepted, not required) and `distractors`
  (classic wrong answers, penalised more heavily);
- `diagnosis` (one or more) and `urgency`.

Keys for real recordings deliberately omit numeric intervals unless the diagnosis implies them;
learners measure with the calipers and compare to the revealed key.

## Cases

`cases/index.ts`: presentation (age, sex, setting, history, vitals), the ECG, the key and ordered
`steps` (`history` → `interpret` → `question` → `reveal`). Teasers must not give away the diagnosis.

## Assessments

`assessments/index.ts`: summative tests are hand-authored question banks with a `passMark`;
formative sets are generated from in-lesson checks per module.

## Style

- British English spelling; Dutch per the NHG/NVVC convention (`RBTB`, `LBTB`, `AES`, `VES`).
- Teaching claims cite guidelines (ESC 2019 SVT, 2021 pacing, 2022 VA, 2023 ACS, 2024 AF; the
  Fourth Universal Definition of MI; AHA/ACCF/HRS 2009 standardisation statements).
