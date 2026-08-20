# Speaking Coach — Speech-to-Text Learning Protocol

The Speaking Coach exists to solve a specific weakness of audio-only practice: a long recording proves that the microphone was active, but it does not make the learner's actual language easy to inspect, correct, compare, or revisit.

## What the coach adds

- microphone recording stored in IndexedDB
- live browser speech recognition when the browser exposes `SpeechRecognition` / `webkitSpeechRecognition`
- optional high-accuracy cloud transcription through the server-side `/api/transcribe` route
- manual transcript correction fallback
- learner confirmation that the transcript was reviewed before it becomes auditable evidence
- speaking-rate, filler, repetition, discourse-marker, self-repair, lexical-variety, and sentence-length metrics
- optional AI transcript feedback for grammar, collocation, vocabulary precision, coherence, and transcript-based fluency evidence
- B2/C1 readiness gates that require reviewed transcribed speaking samples instead of accepting long audio alone

## Important limits

Speech-to-text is not a pronunciation score. A transcript can show what the recognizer understood, but it cannot reliably certify accent quality, stress, rhythm, intonation, or intelligibility. The application therefore does not convert STT output into a pronunciation CEFR score.

AI transcript feedback also cannot independently certify CEFR. Final C1 still requires the broader course evidence and an identified independent evaluator.

## Recommended learning loop

For each important speaking prompt:

1. Read the task once.
2. Prepare only 5–10 keywords, never a full script.
3. Record the complete response.
4. Generate or type the transcript.
5. Correct only obvious STT mistakes; do not rewrite your English yet.
6. Mark the transcript as reviewed.
7. Inspect the local metrics and, when configured, AI language feedback.
8. Pick only one or two bottlenecks to fix.
9. Repeat the same prompt immediately without reading a corrected script.
10. Save the stronger and weaker attempts so progress remains visible over time.

This repeat-after-feedback cycle is more important than collecting many one-off recordings.

## Stage targets

### A2

- 45–60 second familiar responses
- basic present/past/future control
- fewer long pauses caused by Thai-to-English word-by-word translation
- understandable high-frequency chunks

### B1

- 2–3 minute connected explanations
- project/problem narratives with sequence and cause/effect
- clarification and simple reformulation
- at least one reviewed transcript sample before B1 readiness is considered complete

### B2

- 4–5 minute arguments/explanations
- counterargument, limitation, register control, and follow-up pressure
- at least two reviewed transcript samples of 120 seconds or longer
- transcript evidence is a critical readiness criterion

### C1

- 6–8 minute nuanced discussion/presentation evidence
- qualification, synthesis, stance, counterargument, reformulation, and audience adaptation
- at least four reviewed transcript samples of 120 seconds or longer
- at least one reviewed transcribed sample of 360 seconds or longer
- independent evaluator still required for verified C1

## Optional OpenAI configuration

Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY` if you want cloud transcription and transcript-language feedback.

The key stays on the server. Never expose it through a `NEXT_PUBLIC_*` variable.

Default optional models:

- transcription: `gpt-4o-mini-transcribe`
- feedback: `gpt-5.6-luna`

Both can be overridden through environment variables.

The core learning path remains usable without a paid API: use browser STT when available, or type/correct the transcript manually.
