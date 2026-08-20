# Production Readiness

This document records the release gate for English C1 Accelerator. A feature is not production-ready merely because it renders successfully; learner progression must remain correct, persistent, recoverable and auditable.

## Required CI gate

Every change targeting `main` must pass:

1. `npm ci`
2. `npm audit --omit=dev --audit-level=high`
3. `npm test`
4. `npm run validate:content`
5. `npm run typecheck`
6. `npm run lint`
7. `npm run build`
8. `npm run test:e2e -- --reporter=line` in Chromium

A passing production build is not sufficient if the browser E2E suite is red. GitHub Actions used by the verification workflow are pinned to immutable commit SHAs. The workflow itself runs with read-only repository contents permission.

## Core invariants already enforced

- CEFR skill progress rolls across level boundaries without becoming stuck at 99%.
- Lesson prerequisites are enforced by domain logic, not only disabled UI.
- A lesson with listening material cannot complete until every required listening block has finished at an evidence-eligible speed.
- Speaking evidence counts only after its recording blob has been persisted successfully.
- Pronunciation/baseline practice recordings cannot inflate unscripted-fluency duration evidence.
- Advanced B2/C1 speaking readiness cannot be satisfied by recording duration alone; reviewed transcript evidence is required.
- C1 requires multiple reviewed transcribed speaking samples and at least one six-minute audio+transcript sample.
- Speech-to-text metrics never become a pronunciation score or an automatic CEFR certificate.
- Conversation Coach turns remain training evidence; AI/local follow-ups never substitute for independent C1 validation.
- Error Bank mastery uses one 0–100 scale across defaults, new records, migrations, remediation and readiness checks.
- Self-scored checkpoint rubrics are practice evidence and never directly promote CEFR skill estimates.
- Verified checkpoint promotion requires an identified qualified human evaluator.
- SRS mastery is derived from retained unique items; repeated clicks cannot farm mastery points.
- Review scheduling uses both recall quality and measured response time when available.
- Vocabulary review button state is derived from learner state and survives reload; the DOM is never the source of truth.
- Thai instructional support follows a CEFR-aware immersion policy rather than being a display-only setting.

## Speech-to-text / Speaking Coach integrity

The dedicated `/speaking-coach` workflow stores the real audio attempt in IndexedDB and transcript metadata in learner state. The learner must explicitly review the transcript before it can count as auditable advanced speaking evidence.

Three transcription paths exist:

1. browser Speech Recognition when available
2. optional server-side cloud transcription when `OPENAI_API_KEY` is configured
3. manual transcript correction/fallback

The application computes transcript-based coaching signals such as speaking rate, fillers, repetitions, discourse markers, self-repairs and lexical-variety evidence. These are diagnostic signals only. They do not directly promote CEFR skill estimates.

Optional AI feedback is constrained to transcript-language evidence such as grammar, collocation, vocabulary precision, organization and reformulation. It must not claim to score pronunciation, accent, stress, rhythm, intonation or microphone intelligibility from text.

## Conversation Coach integrity

The dedicated `/conversation-coach` workflow adds interaction pressure that a prepared monologue cannot provide. A2/B1/B2/C1 sessions progressively introduce clarification, examples/reasons, counterarguments, changed hypotheticals, qualification, reformulation and synthesis.

Each learner turn is recorded and requires the same reviewed-transcript rule before it is persisted as speaking evidence. When optional AI is configured, the follow-up is grounded in the learner's actual transcript. If the service is unavailable, a deterministic local challenge engine keeps the practice loop usable without a paid API.

Conversation Coach is still practice rather than certification. It cannot reproduce every property of real human interaction, such as overlapping speech, emotion, social relationship, unfamiliar accents, interruption timing or the accountability of an independent assessor. Those limitations are intentionally kept outside automatic CEFR promotion.

If paid cloud routes are enabled for an untrusted/public deployment, authentication and rate limiting are required before treating those routes as production-safe. The local personal-learning configuration remains usable without a paid API.

## Data compatibility and recovery

Current learner-state key: `english-c1-accelerator:v3-production`.

The loader migrates the previous v2 personalized state and v1 state. Historic fractional Error Bank mastery values are normalized to the current 0–100 scale without discarding progress.

The Settings screen supports a portable versioned backup containing validated learner state plus speaking-audio evidence. Imports validate state shape, CEFR values, backup version, recording identifiers, MIME/base64 data and speaking/audio referential integrity before replacing current progress.

Speaking transcript fields, transcript source, reviewed status and computed metrics are shape-validated during state migration. Malformed transcript metadata must be rejected instead of silently becoming readiness evidence.

Storage failures surface to the learner instead of being silently swallowed. Route/root error boundaries provide recovery UI without automatically resetting progress.

## Security baseline

- `poweredByHeader` disabled.
- `X-Content-Type-Options: nosniff`.
- `X-Frame-Options: DENY`.
- strict referrer policy.
- camera and geolocation disabled through Permissions Policy.
- microphone allowed only for the application origin because speaking evidence requires it.
- same-origin opener/resource policies.
- production dependency audit blocks high/critical runtime dependency findings in CI.
- optional OpenAI credentials remain server-side and are never exposed through `NEXT_PUBLIC_*` variables.

Security headers are regression-tested. This baseline does not replace a deployment-specific CSP once external media/API origins are finalized.

## Browser verification status

A Chromium Playwright critical-flow suite now covers initial rendering/security headers, the Speech-to-Text Speaking Coach entry surface, the Conversation Coach entry surface, persistent SRS add-to-review state, course prerequisite locks, transcript gating, incorrect SRS grading restrictions, self-scored checkpoint non-promotion, invalid backup recovery and mobile navigation.

The latest merged run on `main` before this audit was not fully green: 1/8 browser tests passed and 7/8 failed because the test selectors expected labels such as `Vocabulary` while the accessible button name included decorative icon text such as `Aa Vocabulary`. This was a test-harness selector defect, not evidence that the page failed to render. The selector correction and new speaking/conversation browser coverage are staged on `chatgpt/production-readiness-audit`; the branch must not be described as release-verified until its complete CI gate is confirmed green.

## Remaining hardening tracks

The following work still matters before declaring a broad public production release complete:

- expand browser/component E2E coverage beyond the current critical flows and add real media-device regression coverage where CI infrastructure permits it
- feature-module refactor of the current large client component to reduce blast radius and client bundle coupling
- richer integrated A2/B1/B2 assessment packs backed by actual in-app task evidence rather than primarily rubric metadata
- broader advanced listening audio with multiple real speakers/accents; browser TTS should remain a fallback, not the only advanced input source
- regular real-human interaction with teachers, peers, colleagues or language partners; the Conversation Coach is strong practice but not a substitute for all real social timing/accent/interruptions
- deployment-specific Content Security Policy after final media/API origins are known
- authentication/rate limiting before optional paid AI routes are exposed to untrusted public users
- branch protection / ruleset requiring the complete CI check before merge (repository administration setting)
- cross-browser smoke verification for Chrome, Edge, Safari and Firefox, especially MediaRecorder/SpeechRecognition/SpeechSynthesis/IndexedDB behavior

## Release rule

Do not label the application fully production-ready while a required CI check is failing, a P0 learner-progression invariant is unresolved, or a critical browser workflow lacks a tested recovery path. Do not merge a browser-test change merely because domain tests and `next build` are green if the E2E step is failing.
