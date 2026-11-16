# Architecture

## Stack

- **Next.js 15 (App Router) + React 19 + TypeScript (strict)**. All pages are statically generated per
  locale (`generateStaticParams`), so the site can be deployed as static output behind a CDN or run
  on the Node server. Interactivity (viewer, forms, progress) lives in client components.
- **next-intl** for locale routing (`/en/...`, `/nl/...`), UI strings in `messages/*.json`.
  Learner-facing *content* is not in the message files: it is authored bilingually in TypeScript
  (see `docs/CONTENT-AUTHORING.md`) so English and Dutch sit side by side and can be reviewed together.
- **Tailwind CSS v4** with semantic design tokens defined as CSS variables in `src/app/globals.css`
  and remapped for dark mode (`.dark` class via `next-themes`). ECG paper colours are tokens too.
- **Zustand (persist)** for client-side progress; `src/lib/progress/types.ts` defines the
  `ProgressRepository` seam for a server implementation.
- **Vitest** for unit tests; **Playwright** (pre-installed in CI images) for visual checks.

## Folder map

```
src/
  app/[locale]/            route segments (home, curriculum, cases, library, assessments, progress)
  components/
    ecg/                   EcgViewer (SVG), EcgFigure (loader + provenance), geometry, useEcgRecord
    learning/              LessonBlocks, QuestionBlock, InterpretationForm, CaseRunner,
                           AssessmentRunner, ProgressDashboard, LibraryBrowser
    layout/                AppShell (sidebar/topbar), ThemeToggle, LocaleSwitcher, ReviewBadge
    ui/                    Button, Card, Badge, LevelBadge, ProgressBar, PageHeader, …
  lib/
    ecg/                   types, codec (int16 base64), wfdb (PhysioNet reader), measure (R-peak etc.)
    ecg/synth/             dipole model, lead geometry, rhythm scheduler, presets, seeded RNG
    content/               content types, competencies, curriculum/, cases/, assessments/, library/
    learning/scoring.ts    pure scoring for structured interpretation and MCQs
    progress/              store (zustand), competency mastery, repository types
    i18n/                  Locale, Localized<T>, pick()
  i18n/                    next-intl routing/request/navigation
  data/                    PTB-XL selection (ids, SCP codes, provenance)
public/ecg/ptbxl/          downloaded recordings (JSON) + ATTRIBUTION.md
scripts/                   fetch-ptbxl.ts, check-content.ts
tests/                     unit tests
```

## Data flow

1. A page (server component) resolves content by slug from the typed content modules.
2. `EcgFigure` (client) looks up the library entry by id and calls `useEcgRecord`:
   - PTB-XL → `fetch('/ecg/ptbxl/<id>.json')` → `decodeRecord` (int16 µV → Float32 mV), cached;
   - synthetic → `synthesize(preset.params, { seed })` in the browser (≈ 5 ms for 10 s × 12 leads).
3. `EcgViewer` builds panel geometry in millimetres (`geometry.ts`), renders traces as SVG paths
   (decimated to ~2 points per pixel while preserving extrema) over a 1 mm / 5 mm grid pattern, and
   converts pointer positions back to (time, mV) for the calipers.
4. Learner actions (`QuestionBlock`, `InterpretationForm`) are scored by pure functions in
   `lib/learning/scoring.ts` and recorded in the progress store with the competency tags of the
   lesson / case / library entry.
5. `computeMastery` folds attempts into a recency-weighted score per competency (45-day half-life)
   and a mastery level (novice → developing → competent → proficient).

## Extending to a server backend

Implement `ProgressRepository` (load/save/clear) against your API, hydrate the Zustand store from it
on login and write through on change. The content model is plain data, so a CMS or database can
replace the TypeScript modules by implementing the same types; the review metadata was designed to
map onto an editorial workflow (draft → in-review → approved / needs-revision, per language).

## Accessibility

- Semantic landmarks, skip link, `aria-current` navigation, keyboard-operable option buttons with
  `radio` / `checkbox` roles, live regions for scores, visible focus rings.
- The viewer is an `<svg role="img">` with a descriptive label; calipers work with mouse, pen and touch.
- Colour is never the only signal: statuses carry text labels; grid/trace contrast is tuned per theme.
