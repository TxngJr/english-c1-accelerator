# Conversation Coach — Interaction Under Pressure

The Conversation Coach complements the Speech-to-Text Speaking Coach. A learner can produce a polished monologue while still struggling when another person interrupts, challenges an assumption, asks for clarification, or changes the scenario. C1 therefore needs interaction practice as well as long-form speaking.

## Training loop

1. Choose A2, B1, B2 or C1 and a topic.
2. Listen to/read one partner question.
3. Answer from ideas and keywords only.
4. Record audio and capture a transcript.
5. Review only obvious STT mistakes; do not rewrite the answer into better English.
6. Submit the turn.
7. Receive an unexpected follow-up based on the learner's actual answer.
8. Repeat until the target number of turns is met.

Every submitted learner turn is stored as normal speaking evidence with audio, reviewed transcript and local fluency metrics.

## Challenge progression

- **A2:** clarification, examples, simple reasons — target at least 3 turns.
- **B1:** adds simple counterarguments and changed hypotheticals — target at least 4 turns.
- **B2:** counterargument, changed assumptions, qualification and reformulation — target at least 5 turns.
- **C1:** counterargument, uncertainty/qualification, audience-aware reformulation and synthesis — target at least 6 turns.

## Offline/local fallback

If `OPENAI_API_KEY` is not configured or the AI follow-up route is unavailable, the app uses a deterministic local challenge bank. The learning loop therefore remains usable without a paid API.

When an API key is configured, `/api/conversation-follow-up` asks for one level-appropriate question grounded in what the learner actually said. Learner transcript/history is delimited as content and is not treated as system instructions.

## CEFR integrity

Conversation Coach is practice evidence, not an independent examiner. It improves spontaneous turn-taking, clarification, counterargument and reformulation, but verified C1 still requires the complete macro-skill evidence profile plus an identified independent evaluator.

For true C1 robustness, AI practice should be supplemented with real conversations with teachers, peers, colleagues or language partners, especially where interruption, accent variation, emotion, social nuance and unpredictable timing matter.
