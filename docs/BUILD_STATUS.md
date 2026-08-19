# Build Status — Production-Hardened Personalized C1 Edition

## Current implemented scope

- 224 playable study days (14 authored foundation days + 210 post-foundation days)
- 30 seven-day modules from A2 through C1
- approximately 618.8 scheduled structured hours
- 4,332 course exercises / 6,341 uniquely identified course content items
- 34-task C1 Exit Pack A
- 3 long C1 listening scripts (751 / 740 / 769 words)
- 2 long C1 reading texts (1,214 / 1,307 words)
- 4 final speaking tasks and 3 final writing/synthesis tasks
- speaking-first adaptive prescription for this learner
- diagnostic Error Bank seeded from real production errors
- objective answer scoring separated from open performance evidence
- prerequisite/listening/speaking/mission mastery gates
- verified checkpoint promotion; self-scoring cannot promote CEFR
- SRS with real typed retrieval, response-time evidence and derived unique mastery
- transactional local audio persistence in IndexedDB
- full progress + speaking-audio backup/import
- schema/state validation and migration from earlier learner-state formats
- adaptive CEFR-aware Thai support / English-first immersion
- pronunciation listen → imitate → record → replay practice
- pronunciation/baseline recordings excluded from fluency-duration gates
- chunked browser speech synthesis fallback for long listening inputs
- C1 anti-shortcut evidence gate with identified independent scoring
- route/root error recovery boundaries and storage-health warning
- security response-header baseline

## Current automated production gate

GitHub Actions executes from a clean checkout on Node 22 and requires all of the following:

1. `npm ci`
2. `npm audit --omit=dev --audit-level=high`
3. `npm test`
4. `npm run validate:content`
5. `npm run typecheck`
6. `npm run lint`
7. `npm run build`

The workflow uses read-only repository contents permission and pins third-party GitHub Actions by immutable commit SHA.

## Latest verified result

Latest PR verification in GitHub Actions:

- dependency install: **passing**
- production dependency audit: **0 vulnerabilities reported**
- domain/regression tests: **49/49 passing**
- curriculum validator: **passing**
- foundation lessons: **14**
- post-foundation modules: **30**
- generated post-foundation playable days: **210**
- total playable days: **224**
- estimated structured curriculum: **618.8 hours**
- exercises: **4,332**
- uniquely identified course content items: **6,341**
- duplicate content IDs: **0**
- day-sequence errors: **0**
- incomplete lessons: **0**
- missing module materials: **0**
- C1 listening block word counts: **751 / 740 / 769**
- C1 reading text word counts: **1,214 / 1,307**
- TypeScript typecheck: **passing**
- ESLint / Next.js rules: **passing**
- Next.js production build: **passing**

## Runtime requirements

- Node.js **22.6+**
- npm
- modern browser with localStorage + IndexedDB
- microphone permission for speaking-evidence workflows

## What this status does not prove yet

A green build does not mean all public-production quality work is finished. The important remaining gaps are tracked in `docs/PRODUCTION_READINESS.md`, especially:

- browser/component E2E coverage of critical workflows
- cross-browser media/storage verification
- decomposition of the large client learning component
- fuller integrated A2/B1/B2 assessment packs
- broader real multi-speaker/accent advanced listening assets beyond browser TTS fallback
- deployment-specific CSP after final external origins are known
- repository branch protection/ruleset requiring CI before merge

Until those are resolved, describe the application as **production-hardened and build-verified**, not fully production-complete.
