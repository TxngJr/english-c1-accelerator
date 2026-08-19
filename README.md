# English C1 Accelerator — Personalized Edition

A local-first, speaking-first English learning system designed around this learner's diagnostic profile: practical A1+/early A2, speaking as the weakest skill, stronger passive grammar recognition than active production, and a long-term target of genuine CEFR C1 for university, software/IT work, presentations, international communication and advanced English use.

The project treats CEFR progression as an evidence problem, not a lesson-completion badge. Finishing days, earning XP or self-rating a checkpoint cannot by themselves establish a CEFR level.

## Course pathway

- **224 playable study days**
  - Days 1–14: accelerated foundation rebuild
  - Days 15–224: 30 modules × 7-day learning cycles from A2 through the C1 exit block
- **~618.8 hours** of scheduled structured curriculum
- **4,332 course exercises** + **34 C1 exit-assessment tasks**
- **6,341 uniquely identified lesson/content items**
- Every playable day includes retrieval, vocabulary/chunks, grammar production, listening, speaking, reading, writing, review and an exit check.

The nominal structure is four 8-week stages, but evidence and mastery control progression:

1. Accelerated Foundation Rebuild — A1+/A2- → strong A2
2. Functional Independence — A2 → B1
3. Independent Advanced User — B1 → B2
4. C1 Advanced Proficiency — B2 → C1

## Personalized learning behavior

The system intentionally does not allocate equal time to every skill.

- Speaking receives the highest baseline weight.
- Listening receives the second-highest weight.
- Grammar production is weighted above recognition to convert passive knowledge into usable language.
- Recurring Error Bank patterns raise future production/remediation priority.
- Programming, AI, software architecture, university, projects, gaming, travel and professional communication recur as motivating contexts while broad general English remains mandatory.
- Thai support now follows a CEFR-aware immersion policy: visible early, available on demand during transition, and English-first at higher levels.

See `src/content/personalized-program.ts`, `src/lib/immersion.ts` and `docs/PERSONALIZED_C1_EXECUTION.md`.

## Evidence-based progression

The app tracks separately:

- completed lessons and activities
- objective exercise attempts and accuracy
- CEFR estimates by skill
- structured workload evidence
- unscripted speaking recordings
- normal-speed listening exposure
- recurring production errors
- SRS retention/review history
- A2 / B1 / B2 / C1 checkpoint attempts
- independently verified checkpoint passes

Important integrity rules include:

- CEFR progress rolls correctly across level boundaries instead of getting stuck at 99%.
- Prerequisites are enforced in domain logic as well as the UI.
- A lesson with listening material cannot complete until each required listening block has actually finished at an eligible speed.
- Speaking evidence is credited only after the audio blob is successfully persisted.
- Pronunciation and baseline-retake recordings do not inflate unscripted-fluency duration gates.
- Error Bank mastery uses one 0–100 scale with migration for older state formats.
- Self-scored checkpoint rubrics are practice evidence only and never promote CEFR estimates.
- Verified CEFR promotion requires a passing checkpoint attributed to an identified qualified human evaluator.

## Core systems

- Responsive 13-section learning interface
- 224-day lesson engine
- Speaking ladder from short chunks to extended C1 discussion
- Browser microphone recording with IndexedDB persistence
- Speaking history with replayable stored evidence
- Pronunciation listen → imitate → record → replay practice
- Long-form original listening scripts with chunked browser Speech Synthesis fallback and speed control
- Transcript gating after first full listen
- Longer B2/C1 reading and listening progression
- Full C1 Exit Pack A: 3 long listening tasks, 2 demanding 1,200+ word readings, 4 speaking tasks and 3 writing/synthesis tasks
- Production-first vocabulary/chunk work
- SRS with typed retrieval, response-time evidence and multiple recall directions
- Derived retained-item mastery instead of farmable mastery points
- Personal Error Bank and targeted remediation
- Adaptive daily time prescription
- CEFR readiness reports with blockers
- Verified checkpoint state transitions
- Real-world missions that require explicit evidence
- Local-first progress persistence with migration
- Full progress backup/import including speaking audio
- Storage-health warning when local persistence fails
- Route/root error recovery boundaries

## C1 exit integrity

The final C1 rubric remains locked until the C1 Exit Pack has sufficient evidence, including all required tasks, all long listenings completed at normal speed, substantial recordings for every speaking task and at least one final speaking recording of 360 seconds.

Even after those requirements are met, self-rating does not unlock C1. Final readiness still requires the broader skill/evidence profile and an independently verified C1 checkpoint.

## Requirements

- **Node.js 22.6+**
- npm
- Modern browser
- Microphone permission for speaking evidence
- IndexedDB/localStorage enabled for normal local-first persistence

The core learning path does not require a paid AI, speech-to-text service or cloud account. A teacher/qualified independent evaluator is required for verified CEFR checkpoint promotion in the current implementation.

## Run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Required production verification

```bash
npm test
npm run validate:content
npm run typecheck
npm run lint
npm run build
```

GitHub Actions also runs a production dependency audit before the test/build gate. Pull requests should not be merged while this verification is failing.

The repository has now been validated in a real GitHub Actions environment with dependency installation, domain tests, curriculum validation, TypeScript checking, ESLint and an actual Next.js production build. See `docs/BUILD_STATUS.md` and `.github/workflows/ci.yml` for the current gate.

## Data safety

Progress is local-first. Settings → Data & backup can export one versioned JSON backup containing validated learner state and speaking-audio evidence. Import validates the file before replacing current progress and protects against missing/duplicate recording evidence.

Export a backup before changing browsers/devices, clearing site data or resetting progress.

## Production-readiness status

The project is materially hardened compared with the original V1, but it is **not yet declared fully production-complete**. Remaining work is tracked in `docs/PRODUCTION_READINESS.md` and currently includes browser-level E2E coverage, further component/module decomposition, richer lower-level integrated assessment material and broader real multi-speaker/accent listening assets beyond browser TTS fallback.

## Important interpretation

This project is designed to provide a serious pathway toward C1; it cannot guarantee C1 from passive completion. The learner must actually perform the speaking, listening, reading, writing, review and real-world tasks. The application is deliberately designed to avoid declaring C1 merely because lessons were completed.

See also:

- `SPEC.md` — original requirements
- `docs/PERSONALIZED_C1_EXECUTION.md` — personalized execution model
- `docs/C1_EVIDENCE_STANDARD.md` — final readiness standard
- `docs/ASSESSMENT_SYSTEM.md` — assessment architecture
- `docs/PROJECT_ARCHITECTURE.md` — application architecture
- `docs/PRODUCTION_READINESS.md` — production release gate and remaining hardening work
