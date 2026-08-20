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
- Thai support follows a CEFR-aware immersion policy: visible early, available on demand during transition, and English-first at higher levels.

See `src/content/personalized-program.ts`, `src/lib/immersion.ts` and `docs/PERSONALIZED_C1_EXECUTION.md`.

## Evidence-based progression

The app tracks separately:

- completed lessons and activities
- objective exercise attempts and accuracy
- CEFR estimates by skill
- structured workload evidence
- unscripted speaking recordings
- reviewed speaking transcripts and transcript metrics
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
- B2/C1 readiness requires reviewed audio+transcript speaking samples; long audio alone is not enough.
- C1 requires at least one reviewed transcribed speaking sample of 360 seconds or longer.
- Error Bank mastery uses one 0–100 scale with migration for older state formats.
- Self-scored checkpoint rubrics are practice evidence only and never promote CEFR estimates.
- Verified CEFR promotion requires a passing checkpoint attributed to an identified qualified human evaluator.

## AI Lesson Tutor — available throughout the course

The main course now includes a floating **AI Tutor · 4 Skills** control. The tutor reloads the latest learner state when a round starts and grounds its coaching in the canonical current lesson on the server rather than trusting browser-supplied lesson text.

It can train six focused modes:

- **4-skill loop** — enforced `listen → speak → read → write` rotation, then repeat at higher difficulty
- **Speaking** — spontaneous explanation, clarification, evidence, counterargument, qualification and reformulation
- **Listening** — tutor speech plays while the transcript is hidden until the learner chooses to reveal it
- **Reading** — lesson-linked reading with gist/detail/inference/stance/synthesis questions scaled to CEFR
- **Writing** — first draft → selective high-value feedback → rewrite from memory
- **Grammar** — transform current lesson patterns into original production rather than rule recitation

The server builds a compact mode-specific digest from the lesson's vocabulary/chunks, grammar examples, listening material, speaking/writing prompts, reading material and real-world mission. Only relevant sections are sent for the active mode to reduce KMITL token usage.

The tutor also receives compact weak-skill signals and recurring Error Bank patterns, but it **cannot add CEFR points, pass exercises, complete lessons, create verified checkpoints or count browser STT as audited speaking evidence**. AI Tutor practice and mastery evidence remain deliberately separate.

If the KMITL provider is unavailable, a deterministic local coach preserves the learning loop. See `docs/AI_LESSON_TUTOR.md`.

## Speaking Coach / Speech-to-Text

Open `/speaking-coach` or use the floating **Speaking Coach** button from the main course.

The coach implements a repeatable production loop:

1. speak from keywords, not a full script
2. record the real attempt
3. transcribe with browser STT, optional KMITL cloud STT, or manual fallback
4. correct only obvious STT mistakes
5. explicitly confirm the transcript was reviewed
6. inspect speaking-rate, fillers, repetition, discourse markers, self-repairs and lexical-variety evidence
7. optionally request KMITL-backed AI feedback for grammar, collocation, vocabulary precision and coherence
8. save the audio + reviewed transcript
9. repeat the same prompt and improve one or two bottlenecks

Speech-to-text is deliberately **not** used as a pronunciation score. Transcript analysis cannot reliably certify accent, stress, rhythm, intonation or audio intelligibility. Final C1 still requires broader evidence and independent assessment.

## KMITL AI provider

The optional AI features use the KMITL OpenAI-compatible gateway instead of calling OpenAI directly:

```env
AI_API_KEY=your-real-kmitl-token
AI_BASE_URL=https://api.ai.kmitl.ac.th/v1
AI_MODEL_PREFIX=openrouter/
AI_CHAT_MODEL=
AI_TUTOR_MODEL=
```

Keep `AI_CHAT_MODEL` and `AI_TUTOR_MODEL` blank for the normal configuration. The server calls the authenticated `GET /models` endpoint and selects the strongest recognized model that the token actually exposes. It does not assume availability from a public model catalog.

For the teacher-recommended set, the capability preference is:

1. Grok 4.6
2. Kimi K3
3. DeepSeek V4 Pro, when available
4. DeepSeek V4 Flash

The selector also recognizes stronger frontier families if KMITL exposes them. Set `AI_CHAT_MODEL` only when intentionally overriding automatic selection. The safe endpoint `GET /api/ai-provider/status` reports the chosen model without returning the API key.

Speaking feedback, Conversation Coach and Course AI Tutor use the OpenAI-compatible:

```text
POST /chat/completions
```

Purpose-specific overrides are available through `AI_FEEDBACK_MODEL`, `AI_CONVERSATION_MODEL` and `AI_TUTOR_MODEL`.

### Cloud STT

Cloud STT is optional because an OpenAI-compatible chat gateway does not necessarily expose `/audio/transcriptions`.

Configure `AI_TRANSCRIPTION_MODEL` only when KMITL provides a compatible transcription model. If the endpoint/model is unavailable, Browser Speech Recognition and manual transcript correction continue to work and the application does **not** fall back to OpenAI directly.

See `docs/KMITL_AI_PROVIDER.md` for the full setup guide.

## Core systems

- responsive learning interface
- 224-day lesson engine
- embedded current-lesson AI Tutor with enforced four-skill deliberate-practice loop
- canonical server-side lesson grounding with mode-specific token budgeting
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

Progress is local-first. Export a backup before changing browsers/devices, clearing site data or resetting progress. Speaking Coach transcript metadata and speaking audio are included in the backup workflow. Course AI Tutor chat history is separate convenience state per lesson and is not mastery evidence.

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
- `docs/AI_LESSON_TUTOR.md`
- `docs/SPEAKING_COACH.md`
- `docs/CONVERSATION_COACH.md`
- `docs/KMITL_AI_PROVIDER.md`