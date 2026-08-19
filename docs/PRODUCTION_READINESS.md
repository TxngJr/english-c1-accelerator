# Production Readiness

This document records the release gate for English C1 Accelerator. A feature is not considered production-ready because it renders successfully; learner progression must remain correct, persistent, and auditable.

## Required CI gate

Every change targeting `main` must pass:

1. `npm ci`
2. `npm test`
3. `npm run validate:content`
4. `npm run typecheck`
5. `npm run lint`
6. `npm run build`

## Core invariants

- CEFR skill progress must roll across level boundaries without becoming stuck at 99%.
- Lesson prerequisites must be enforced by domain logic, not only by disabled UI.
- A lesson with listening material cannot complete until every required listening block has finished at an evidence-eligible speed.
- Speaking evidence counts only after its recording blob has been persisted successfully.
- Error Bank mastery uses one 0–100 scale across defaults, new records, migrations, remediation and readiness checks.
- Self-scored checkpoint rubrics are practice evidence and must not directly promote CEFR skill estimates.
- SRS mastery is derived from retained unique items; repeated clicks cannot farm mastery points.
- Review scheduling uses both recall quality and measured response time when available.
- Vocabulary review button state is derived from learner state and survives reload; the DOM is never the source of truth.

## Data compatibility

Current learner-state key: `english-c1-accelerator:v3-production`.

The loader migrates the previous v2 personalized state and v1 state. Historic fractional Error Bank mastery values are normalized to the current 0–100 scale without discarding progress.

## Remaining hardening tracks

The following tracks should be completed before a public production release:

- persistent structured storage with export/import and schema validation
- integrated A2/B1/B2 assessments backed by actual task evidence
- real pronunciation practice/evidence rather than display-only guidance
- adaptive immersion policy that changes instructional language by level
- broader advanced listening audio with multiple speakers/accents, keeping browser TTS as fallback
- component and browser E2E tests for critical learning flows
- feature-module refactor of the current large client component
- branch protection requiring the CI check before merge

## Release rule

Do not label the application production-ready while a required CI check is failing or while a P0 learner-progression invariant is unresolved.
