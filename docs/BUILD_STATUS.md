# Build Status — Personalized C1 Edition

## Implemented

- 224 playable study days (14 authored foundation days + 210 post-foundation days)
- 30 seven-day modules from A2 through C1
- approximately 618.8 scheduled structured hours
- 4,332 course exercises / 6,341 uniquely identified course content items
- 34-task C1 Exit Pack A
- 3 long C1 listening scripts (751 / 740 / 769 words)
- 2 long C1 reading texts (1,214 / 1,307 words)
- 4 final speaking tasks and 3 final writing/synthesis tasks
- speaking-first adaptive prescription for this learner
- diagnostic Error Bank seeded from the learner's real production errors
- objective answer scoring separated from open performance evidence
- SRS, mastery gates, real-world mission evidence and CEFR readiness blockers
- local audio persistence in IndexedDB
- chunked browser speech synthesis for long listening inputs
- final C1 gate that requires task completion, normal-speed listening completion, substantial recordings for every speaking task, a 360-second final speaking record, and identified independent scoring

## Validation performed in the generation environment

- `npm test`: **19/19 passing**
- `npm run validate:content`: passing
- content ID duplicates: **0**
- day sequence errors: **0**
- incomplete lessons: **0**
- missing module materials: **0**
- TypeScript/TSX syntax transpilation: **0 syntax diagnostics** across source/tests/scripts

## Environment limitation

The generation environment could not reliably reach the npm registry, so Next.js/React dependencies could not be installed. Because of that, a dependency-complete `npm run typecheck`, `npm run lint` and `npm run build` could not be certified here. The raw `tsc` command reports the expected missing `next`, `react`, JSX and Node type declarations when dependencies are absent.

After downloading the project in a normal internet-connected development environment, run:

```bash
npm install
npm test
npm run validate:content
npm run typecheck
npm run lint
npm run build
npm run dev
```

A successful framework build is still required before treating the repository as deployment-ready.
