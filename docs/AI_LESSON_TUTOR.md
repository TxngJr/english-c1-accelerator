# AI Lesson Tutor — Four-Skill Deliberate Practice

The Course AI Tutor is embedded on the main course surface so it is available while studying every lesson. It is not a generic chatbot and it does not replace the course mastery engine.

## Purpose

The tutor turns the current lesson into interactive deliberate practice across all four macro skills:

1. **Listening** — the tutor can speak a task while the transcript remains hidden. The learner listens for gist/detail/inference first and reveals the text only after attempting.
2. **Speaking** — browser Speech Recognition can convert a spontaneous answer into text so the tutor can challenge, clarify, counterargue, ask for evidence, or require reformulation.
3. **Reading** — the tutor can generate original level-appropriate passages connected to the lesson and ask one focused gist/detail/inference/stance/synthesis question at a time.
4. **Writing** — the learner produces a first draft, receives selective high-value feedback, and rewrites rather than copying a polished answer.

Grammar and vocabulary are trained inside those skills, with a separate Grammar mode for production-heavy drills.

## Lesson context

Every time a tutor round starts or the learner sends a message, the client reloads the latest learner state and supplies a compact context to `/api/lesson-tutor`:

- current lesson id/day/title/CEFR/focus/objectives
- weakest current skill estimates
- highest-frequency Error Bank patterns
- selected tutor mode
- recent tutor conversation
- the learner's latest answer

This makes the tutor lesson-aware without coupling it to the internal React state of the large course component.

## Modes

### 4-skill loop

The default mode deliberately rotates:

`listen → speak → read → write → harder repeat`

The KMITL AI may adapt the next task from the learner's actual answer while preserving that integrated-practice goal. The deterministic local fallback follows the same four-skill cycle when the provider is unavailable.

### Speaking

- keywords rather than scripts
- progressively longer answers by CEFR
- reasons and examples at B1
- evidence/counterargument/qualification at B2
- nuance/synthesis/register/audience reformulation at C1
- browser STT is input convenience only; it does not become audited speaking evidence by itself

Use the dedicated Speaking Coach recorder when an audio + reviewed-transcript sample must count toward advanced readiness gates.

### Listening

Listening tasks return `hideTranscript=true`. The UI plays the tutor response with browser Speech Synthesis while hiding its text. The learner can replay it and reveal the transcript after attempting.

Browser TTS remains a practical fallback, not a substitute for the course's future multi-speaker/multi-accent real-audio track.

### Reading

When a passage is useful, the tutor is instructed to scale approximate passage length with CEFR and ask only one clear question at a time. Higher levels move from gist/detail toward inference, stance, implicit meaning and synthesis.

### Writing

The tutor should not immediately rewrite the learner's whole answer. It normally surfaces only 1–3 high-impact issues, then asks for a new attempt from memory. This protects productive retrieval and reduces passive copying.

### Grammar

Grammar mode turns the current lesson pattern into original production in multiple contexts. It is intentionally different from memorizing a rule explanation.

## KMITL provider

The tutor uses the same KMITL OpenAI-compatible provider layer as Speaking Feedback and Conversation Coach.

Environment variables:

```env
AI_API_KEY=your-real-kmitl-token
AI_BASE_URL=https://api.ai.kmitl.ac.th/v1
AI_MODEL_PREFIX=openrouter/
AI_CHAT_MODEL=
AI_TUTOR_MODEL=
```

Leave `AI_TUTOR_MODEL` and `AI_CHAT_MODEL` blank to use strongest-available model discovery from authenticated `GET /models`.

A real API key must never be committed. The token is server-side only.

## Local fallback

`/api/lesson-tutor` returns a deterministic local coaching task when:

- no KMITL key is configured
- a model cannot be resolved
- the provider is unreachable
- the upstream request fails
- the model returns an invalid structured response

The learner can therefore continue the learning loop without losing the lesson.

## CEFR integrity

AI Tutor activity does **not**:

- add CEFR skill-estimate points
- auto-complete exercises
- auto-complete lessons
- satisfy recorded speaking evidence
- create verified checkpoint passes
- certify C1

This separation is deliberate. AI conversation can be useful practice but is not reliable independent evidence of mastery.

## Privacy and persistence

Recent AI tutor conversation is stored locally per lesson under a separate localStorage key. It is convenience state, not mastery evidence. The app caps stored conversation length.

The server receives only the compact context required for the current tutor request; it does not receive the entire local learner-state object.

## Recommended use inside each lesson

A strong daily pattern is:

1. complete the lesson material normally
2. open **AI Tutor · 4 Skills**
3. run one integrated cycle
4. switch to the weakest skill for a focused round
5. apply feedback in the real lesson exercise / Speaking Coach recording
6. complete the normal evidence gates

At B2/C1, prioritize speaking/listening interaction and reformulation rather than spending the whole API budget asking explanatory questions.
