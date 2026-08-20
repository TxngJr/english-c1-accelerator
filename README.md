# English C1 Accelerator — Personalized Edition

A local-first, speaking-first English learning system designed to move a learner from practical A1+/early A2 toward genuine CEFR C1 through evidence, not lesson-completion badges.

Finishing days, earning XP, receiving AI feedback, or self-rating a checkpoint cannot by themselves establish a CEFR level.

## Course pathway

- **224 playable study days**
  - Days 1–14: accelerated foundation rebuild
  - Days 15–224: 30 modules × 7-day learning cycles from A2 through the C1 exit block
- **~618.8 hours** of scheduled structured curriculum
- **4,332 course exercises** + **34 C1 exit-assessment tasks**
- **6,341 uniquely identified lesson/content items**
- retrieval, vocabulary/chunks, grammar production, listening, speaking, reading, writing, review and exit checks

The nominal pathway is:

1. A1+/A2- → strong A2
2. A2 → B1
3. B1 → B2
4. B2 → C1

Progression remains evidence/mastery based rather than time based.

## Personalized learning behavior

- speaking has the highest baseline priority
- listening has the second-highest priority
- grammar production is weighted above grammar recognition
- recurring Error Bank patterns increase future remediation priority
- technical/university contexts are mixed with broad general English
- Thai support reduces progressively as CEFR level rises

## Evidence-based progression

The application tracks:

- completed lessons and activities
- objective exercise accuracy
- CEFR estimates by skill
- structured workload evidence
- unscripted speaking recordings
- reviewed speaking transcripts and transcript metrics
- normal-speed listening exposure
- recurring production errors
- SRS retention
- A2 / B1 / B2 / C1 checkpoint attempts
- independently verified checkpoint passes

Important integrity rules:

- prerequisites are enforced by domain logic
- listening evidence is required before applicable lessons can complete
- speaking evidence is credited only after audio persistence succeeds
- pronunciation/baseline recordings cannot inflate fluency gates
- B2/C1 readiness requires reviewed audio + transcript samples
- C1 requires at least one reviewed 360-second transcribed speaking sample
- self-scored checkpoints never promote CEFR
- verified CEFR promotion requires an identified qualified human evaluator

## Speaking Coach / Speech-to-Text

Open `/speaking-coach` or use the Speaking Coach entry from the main course.

Workflow:

1. speak from keywords, not a script
2. record the real attempt
3. transcribe through Browser STT, optional KMITL cloud STT, or manual fallback
4. correct only obvious STT mistakes
5. confirm that the transcript was reviewed
6. inspect words/minute, fillers, repetition, discourse markers, self-repairs and lexical-variety evidence
7. optionally request AI feedback for grammar, collocation, vocabulary precision and coherence
8. save audio + reviewed transcript
9. repeat the same prompt and improve one or two bottlenecks

Speech-to-text is **not** used as a pronunciation score. Text cannot directly certify accent, stress, rhythm, intonation or audio intelligibility.

## Conversation Coach

Open `/conversation-coach` for unscripted interaction practice.

A2→C1 sessions progressively train:

- clarification
- reasons and examples
- counterarguments
- changed hypotheticals
- qualification
- reformulation for another audience
- synthesis and trade-off discussion

When the KMITL AI provider is configured, the next question is grounded in what the learner actually said. If the provider is unavailable, a deterministic local challenge engine keeps the practice loop usable.

Conversation Coach remains training evidence, not independent C1 certification.

## KMITL OpenAI-compatible provider

The optional AI features now use the KMITL gateway instead of calling `api.openai.com` directly.

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Then configure locally:

```env
AI_API_KEY=your-real-kmitl-token
AI_BASE_URL=https://api.ai.kmitl.ac.th/v1
AI_MODEL_PREFIX=openrouter/
```

Never commit the real token and never expose it through a `NEXT_PUBLIC_*` variable.

### Chat models

Speaking feedback and Conversation Coach use the OpenAI-compatible:

```text
POST /chat/completions
```

Set an exact model if desired:

```env
AI_CHAT_MODEL=openrouter/<exact-model-id>
```

If `AI_CHAT_MODEL` is blank, the server queries `GET /models` and tries KMITL-recommended model families in this order:

1. Deepseek v4 Flash
2. Kimi K3
3. Grok 4.6

Purpose-specific overrides are available through `AI_FEEDBACK_MODEL` and `AI_CONVERSATION_MODEL`.

### Cloud STT

Cloud STT is optional because an OpenAI-compatible chat gateway does not necessarily expose `/audio/transcriptions`.

Configure `AI_TRANSCRIPTION_MODEL` only when KMITL provides a compatible transcription model. If the endpoint/model is unavailable, Browser Speech Recognition and manual transcript correction continue to work and the application does **not** fall back to OpenAI directly.

See `docs/KMITL_AI_PROVIDER.md` for the full setup guide.

## Core systems

- responsive learning interface
- 224-day lesson engine
- speaking ladder from basic chunks to extended C1 discussion
- Speech-to-Text Speaking Coach
- adaptive Conversation Coach
- microphone recording + IndexedDB persistence
- replayable speaking history
- pronunciation listen → imitate → record → replay practice
- long-form listening with browser Speech Synthesis fallback
- B2/C1 reading/listening progression
- C1 Exit Pack
- SRS vocabulary retrieval
- Error Bank remediation
- adaptive daily time prescription
- CEFR readiness blockers
- verified checkpoint transitions
- local-first progress persistence and migration
- full backup/import including speaking audio and transcript metadata
- storage-health warnings and recovery boundaries
- Chromium Playwright critical-flow coverage in CI

## Requirements

- Node.js 22.6+
- npm
- modern browser
- microphone permission for speaking evidence
- IndexedDB + localStorage enabled

The core learning path works without a paid AI provider. A teacher/qualified independent evaluator is still required for verified CEFR checkpoint promotion.

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
npx playwright install --with-deps chromium
npm run test:e2e -- --reporter=line
```

GitHub Actions also runs `npm audit --omit=dev --audit-level=high`.

## Data safety

Progress is local-first. Export a backup before changing browsers/devices, clearing site data or resetting progress. Speaking Coach transcript metadata and speaking audio are included in the backup workflow.

## Production-readiness status

The project is materially hardened but should not be called fully production-complete until the complete CI gate is green and the remaining hardening work in `docs/PRODUCTION_READINESS.md` is resolved.

Important remaining areas include:

- richer integrated A2/B1/B2 assessment packs
- broader real multi-speaker/accent listening assets
- cross-browser media/storage verification
- deployment-specific CSP
- authentication/rate limiting before exposing paid AI routes publicly
- regular real-human interaction in addition to AI conversation practice

## Important interpretation

This project is designed to provide a serious pathway toward C1; it cannot guarantee C1 from passive completion. The learner must actually perform speaking, listening, reading, writing, review, immersion and real-world interaction tasks.

See also:

- `docs/PERSONALIZED_C1_EXECUTION.md`
- `docs/C1_EVIDENCE_STANDARD.md`
- `docs/ASSESSMENT_SYSTEM.md`
- `docs/PROJECT_ARCHITECTURE.md`
- `docs/PRODUCTION_READINESS.md`
- `docs/SPEAKING_COACH.md`
- `docs/CONVERSATION_COACH.md`
- `docs/KMITL_AI_PROVIDER.md`
