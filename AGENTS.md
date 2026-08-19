# Agent Instructions — English C1 Accelerator Personalized Edition

## Mission
Keep this application capable of moving the specified learner from practical A1+/early A2 toward genuine CEFR C1, with spontaneous speaking automaticity as the highest priority. `SPEC.md` is the original product/pedagogy source of truth; `docs/PERSONALIZED_C1_EXECUTION.md` is the current personalized execution standard.

## Learner-specific facts that must shape decisions
- Speaking is weakest and must remain the highest-priority production skill until evidence says otherwise.
- Listening is priority #2 and should normalize toward natural speed.
- Reading is relatively stronger and can be used to bootstrap vocabulary and technical language without stealing time from speaking.
- Passive grammar recognition exceeds active grammar production. Do not respond to production errors by adding long rule lectures.
- Known high-value remediation categories: basic tense switching, verb forms, word order, collocation, questions, articles/prepositions, speaking hesitation.
- High-motivation domains: programming, software engineering, AI, projects, university, startups, gaming, technical documentation, presentations, travel and professional communication.
- Broad general English remains mandatory; do not make the entire curriculum technical.

## Current course architecture
- `src/content/days.ts` — Days 1–14
- `src/content/extended.ts` — 30 A2→C1 module definitions
- `src/content/module-materials.ts` — hand-authored module listening/reading/discussion/transfer banks
- `src/content/advanced-inputs.ts` — longer B2/C1 source material extensions
- `src/content/extended-lessons.ts` — seven-day cycle generator, producing Days 15–224
- `src/content/all-lessons.ts` — complete playable lesson registry
- `src/content/personalized-program.ts` — learner profile, workload floors and skill weighting
- `src/lib/adaptive.ts` — adaptive prescription and CEFR readiness evidence gates
- `src/content/assessments.ts` — A2/B1/B2/C1 integrated checkpoint specifications
- `src/content/c1-exit-pack.ts` — actual final C1 listening/reading/speaking/writing material
- `src/lib/audio-store.ts` — IndexedDB persistence for speaking evidence

## Non-negotiables
- Never replace real learning content with placeholders.
- Never make "lesson complete" equivalent to "CEFR level achieved".
- Never promote on hours alone.
- Never let self-rated C1 be treated as final independent validation. An independent evaluator must be identified, and a future AI label is valid only when a real provider is connected.
- Prefer retrieval, production, interaction and transfer over rereading/recognition-only work.
- Keep the Error Bank recursive: important errors must reappear later.
- Preserve real timed speaking-record evidence; audio blobs are stored in IndexedDB and metadata in LearnerState.
- Paid APIs must remain optional adapters; the core course must work locally.
- Do not punish Thai accent; train intelligibility, stress, rhythm, linking and difficult Thai-English contrasts.
- Avoid hundreds of content-free template drills. Generator variants need a pedagogical reason and module-specific input.
- Never count an open speaking/writing response as automatically correct. Objective accuracy comes only from answer-keyed items.
- Real-world missions require explicit evidence; lesson completion must not auto-credit them.
- Keep C1 Exit Pack A locked behind complete task evidence and a substantial final speaking recording before rubric scoring.

## Content-quality rule
When extending the 224-day pathway, add new source material, scenarios, prompts or transfer contexts — do not increase exercise count simply by cloning the same sentence pattern. Prefer fewer high-value drills plus repeated retrieval across time.

## Before finishing a change
Run when dependencies are available:

```bash
npm test
npm run validate:content
npm run typecheck
npm run lint
npm run build
```

Without dependencies, `npm test` and `npm run validate:content` still provide dependency-independent logic/content checks.
