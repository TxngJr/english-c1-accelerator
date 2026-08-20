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
- Error Bank mastery uses one 0–100 scale across defaults, new records, migrations, remediation and readiness checks.
- Self-scored checkpoint rubrics are practice evidence and never directly promote CEFR skill estimates.
- Verified checkpoint promotion requires an identified qualified human evaluator.
- SRS mastery is derived from retained unique items; repeated clicks cannot farm mastery points.
- Review scheduling uses both recall quality and measured response time when available.
- Vocabulary review button state is derived from learner state and survives reload; the DOM is never the source of truth.
- Thai instructional support follows a CEFR-aware immersion policy rather than being a display-only setting.

## Data compatibility and recovery

Current learner-state key: `english-c1-accelerator:v3-production`.

The loader migrates the previous v2 personalized state and v1 state. Historic fractional Error Bank mastery values are normalized to the current 0–100 scale without discarding progress.

The Settings screen supports a portable versioned backup containing validated learner state plus speaking-audio evidence. Imports validate state shape, CEFR values, backup version, recording identifiers, MIME/base64 data and speaking/audio referential integrity before replacing current progress.

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

Security headers are regression-tested. This baseline does not replace a deployment-specific CSP once external media/API origins are finalized.

## Browser verification status

A Chromium Playwright critical-flow suite now exists and covers initial rendering/security headers, persistent SRS add-to-review state, course prerequisite locks, transcript gating, incorrect SRS grading restrictions, self-scored checkpoint non-promotion, invalid backup recovery and mobile navigation.

The latest merged run on `main` was not fully green: 1/8 browser tests passed and 7/8 failed because the test selectors expected labels such as `Vocabulary` while the accessible button name included decorative icon text such as `Aa Vocabulary`. This is a test-harness selector defect, not evidence that the page failed to render. The selector correction is staged on `chatgpt/production-readiness-audit`; the release remains unverified until the full gate is confirmed green.

## Remaining hardening tracks

The following work still matters before declaring a broad public production release complete:

- expand browser/component E2E coverage beyond the current critical flows and add regression cases for later-course/C1 workflows
- feature-module refactor of the current large client component to reduce blast radius and client bundle coupling
- richer integrated A2/B1/B2 assessment packs backed by actual in-app task evidence rather than primarily rubric metadata
- broader advanced listening audio with multiple real speakers/accents; browser TTS should remain a fallback, not the only advanced input source
- deployment-specific Content Security Policy after final media/API origins are known
- branch protection / ruleset requiring the complete CI check before merge (repository administration setting)
- cross-browser smoke verification for Chrome, Edge, Safari and Firefox, especially MediaRecorder/SpeechSynthesis/IndexedDB behavior

## Release rule

Do not label the application fully production-ready while a required CI check is failing, a P0 learner-progression invariant is unresolved, or a critical browser workflow lacks a tested recovery path. Do not merge a browser-test change merely because domain tests and `next build` are green if the E2E step is failing.
