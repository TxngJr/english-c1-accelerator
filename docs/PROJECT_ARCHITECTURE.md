# Project Architecture

## Stack
- Next.js App Router
- TypeScript
- React
- Tailwind CSS + custom design tokens
- Browser localStorage for local-first persistence
- Browser SpeechSynthesis for original listening playback
- Browser MediaRecorder for speaking recording
- Browser IndexedDB for persistent local audio evidence

## Structure
- `src/content/` — authored lessons and CEFR roadmap
- `src/lib/` — types, persistence, SRS and mastery logic
- `src/components/` — interactive learning application
- `src/app/` — Next.js shell and global styles
- `docs/` — curriculum and system documentation
- `tests/` — logic tests

## Persistence
`LearnerState` stores progress, exercise results, SRS items, Error Bank, streak, settings, CEFR estimates and speaking record metadata. Audio blobs are stored separately in IndexedDB via `src/lib/audio-store.ts` so large recordings do not fill localStorage. Resetting progress clears both stores.

## AI provider boundary
The core app does not require paid AI. A later provider adapter can receive learner level, current lesson, weaknesses, recent errors, mastered vocabulary, target grammar and speaking level without coupling course content to a specific vendor.


## Assessment integrity boundary

- Open speaking/writing submissions are saved as evidence but are not automatically scored as linguistically correct.
- Deterministic lesson accuracy uses answer-keyed exercises only.
- Daily completion requires component coverage, objective recall/production, timed speaking evidence and any required real-world mission.
- C1 Exit Pack A is real assessment content, not a placeholder description.
- Final C1 rubric saving is locked until the pack is complete and a 360-second final speaking recording exists.
- Self-scoring cannot unlock C1; an identified independent assessor is required.
