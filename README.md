# English C1 Accelerator — Personalized Edition

A local-first, speaking-first English learning system built specifically around this learner's diagnostic profile: practical A1+/early A2, speaking as the weakest skill, reading relatively stronger, passive grammar knowledge ahead of active production, and a long-term target of genuine CEFR C1 for university, software/IT work, presentations, international communication and advanced English use.

## What is now implemented

### Full playable pathway

- **224 playable study days**
  - Days 1–14: fully authored accelerated foundation rebuild
  - Days 15–224: 30 modules × 7-day learning cycles from A2 through the C1 exit block
- **~618.8 hours of structured curriculum** in the shipped pathway
- **4,332 course exercises** + **34 full C1 exit-assessment tasks**
- **6,341 uniquely identified lesson/content items** in the 224-day course
- No duplicate content IDs in the validator
- Every playable day contains retrieval, vocabulary/chunks, grammar production, listening, speaking, reading, writing, review and an exit check

### Personalization for this learner

The system intentionally does **not** allocate equal time to every skill.

- Speaking receives the highest baseline weight.
- Listening receives the second-highest weight.
- Grammar **production** is weighted above grammar recognition because diagnostic evidence shows the learner can recognize some A2/B1 structures but still makes basic errors when producing language.
- Recurring errors automatically raise the future practice weight for the affected category.
- Programming, AI, software architecture, university, projects, gaming, travel and professional communication are used as recurring contexts while maintaining broad general-English coverage.
- Thai support is useful early and deliberately fades toward English-first B2/C1 work.

See `src/content/personalized-program.ts` and `docs/PERSONALIZED_C1_EXECUTION.md`.

## Evidence-based progression instead of "finish lessons = C1"

The app separates:

- course completion
- skill estimates
- structured workload evidence
- unscripted speaking recordings
- normal-speed listening exposure
- recurring-error trends
- A2 / B1 / B2 / C1 integrated checkpoints

A CEFR level is not considered ready just because enough hours or lessons were completed.

The final **C1 readiness gate** requires:

- all major skills near the C1 target profile
- extended unscripted speaking evidence
- natural-speed listening evidence
- no uncontrolled recurring foundation error pattern
- a passed integrated C1 checkpoint
- **independent final scoring by a teacher / qualified evaluator**; self-rating alone cannot unlock final C1 readiness. A future AI evaluator is allowed only when a real provider is connected—not by selecting a label in the UI.

This is intentionally stricter than the previous V1.

## 32-week nominal structure

The shipped course contains four 8-week blocks. These weeks are scheduling guidance only; mastery controls advancement.

1. **Accelerated Foundation Rebuild** — A1+/A2- → strong A2
2. **Functional Independence** — A2 → B1
3. **Independent Advanced User** — B1 → B2
4. **C1 Advanced Proficiency** — B2 → C1

The learner can move faster when evidence is strong and should remain longer when a gate is weak.

## Core systems

- Responsive dashboard and 13-section navigation
- 224-day lesson engine
- Speaking ladder from short chunks to 6–8 minute C1 discussion
- Browser audio recording/playback with recording blobs persisted locally in IndexedDB for later evidence review
- Original listening materials + chunked browser Speech Synthesis for reliable long-form playback + speed control
- Longer B2/C1 input progression (advanced reading/listening expands beyond the short A2/B1 format)
- Full **C1 Exit Pack A**: 3 long original listening tasks, 2 demanding 1,200+ word readings, 4 speaking tasks and 3 writing/synthesis tasks
- Production-first vocabulary/chunk work
- Grammar in context rather than rule memorization
- IT/programming English track
- Real-world missions that must be explicitly marked complete; opening the lesson does not credit the mission
- Personal Error Bank
- SRS with multiple recall directions
- Separate CEFR estimates by skill
- Adaptive daily time prescription
- CEFR readiness reports with blockers
- Integrated checkpoint rubric + attempt history
- Objective accuracy separated from open performance: speaking/writing submissions are stored as evidence and do **not** automatically count as correct
- Pronunciation progression for Thai learners
- Local-first progress persistence with V1 migration

## Requirements

- Node.js 20.9+
- npm
- Modern browser
- Microphone permission is strongly recommended because post-foundation lesson completion requires real speaking-record evidence

The core course does not require a paid AI, speech-to-text or cloud API. A teacher / qualified independent evaluator is required for **final independent C1 validation**, not for normal course use. The code can support an AI evaluator later, but the current UI intentionally does not offer a fake "AI" option without a configured provider.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm test
npm run validate:content
npm run typecheck
npm run lint
npm run build
```

Validation completed in the generation environment:

- **19/19 logic tests passing**
- **14 foundation lessons**
- **30 post-foundation modules**
- **210 generated playable post-foundation days**
- **224 total playable days**
- **~618.8 structured curriculum hours**
- **4,332 course exercises**
- **34 final C1 exit-assessment tasks**
- **3 C1 listening recordings/scripts: 751 / 740 / 769 words**
- **2 C1 reading texts: 1,214 / 1,307 words**
- **6,341 course content items**
- **0 duplicate content IDs**
- **0 day-sequence errors**
- **0 incomplete lessons**
- **0 missing module-material banks**

A real Next.js build still requires `npm install`. The generation environment could not reliably reach the npm registry, so the framework dependencies were not installed there. Logic/content validation does not depend on those downloads and was run successfully.

### Final C1 anti-shortcut lock

The C1 rubric cannot be saved as final evidence until **all 34 C1 Exit Pack A tasks are submitted**, **all 3 long listening inputs finish at normal speed**, **all 4 speaking tasks have substantial recordings**, and at least one final-assessment speaking recording reaches **360 seconds**. Even then, a self-scored rubric cannot unlock C1. The readiness engine still requires the broader skill/evidence profile and an independently scored final checkpoint from an identified evaluator.

## Important interpretation

This project is designed to provide a serious pathway to C1; it is not a magical guarantee that passive lesson completion creates C1 ability. The learner must actually perform the speaking, listening, reading, writing, review and real-world tasks. The app is deliberately built to prevent itself from declaring C1 from completion alone.

See:

- `SPEC.md` — original full requirements
- `docs/PERSONALIZED_C1_EXECUTION.md` — personalized execution model
- `docs/C1_EVIDENCE_STANDARD.md` — final readiness standard
- `docs/ASSESSMENT_SYSTEM.md` — assessment architecture
- `docs/PROJECT_ARCHITECTURE.md` — application architecture
