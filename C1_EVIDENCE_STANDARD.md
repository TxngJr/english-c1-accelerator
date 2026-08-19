# C1 Evidence Standard

## Principle

The application must never display "C1 Ready" because the learner finished Day 224, collected XP, memorized advanced words or self-rated highly.

C1 readiness is an evidence claim.

The evidence model combines:

1. skill profile
2. extended spontaneous speaking
3. natural-speed listening
4. demanding reading
5. analytical/professional writing
6. advanced language control
7. interaction/reformulation
8. recurring-error control
9. workload sufficiency
10. independent integrated checkpoint scoring

---

# C1 Target Profile

## Speaking

The learner should be able to:

- speak fluently and spontaneously across familiar and abstract topics
- sustain a 6–8 minute discussion
- present a professional/technical argument
- qualify claims and express stance
- acknowledge and respond to counterarguments
- reformulate when a word or explanation fails
- answer unexpected follow-up questions
- manage turn-taking and clarification without collapsing into Thai

A Thai accent is not a failure criterion. Intelligibility, stress/rhythm, communicative control and listener effort matter.

## Listening

The learner should be able to:

- follow natural-speed professional/academic material
- understand a range of clear accents
- identify gist and relevant detail
- infer attitude and implied meaning
- follow relationships between speakers in discussion
- recover meaning despite reductions, linking and normal hesitation

## Reading

The learner should be able to:

- process demanding longer texts
- identify argument architecture
- infer implicit meaning and stance
- distinguish claim/evidence/qualification
- synthesize multiple sources
- read technical documentation efficiently without translating each sentence

## Writing

The learner should be able to:

- produce clear, well-structured analytical writing
- manage paragraph and whole-text cohesion
- qualify claims precisely
- use appropriate professional/academic register
- synthesize evidence or viewpoints
- revise for logic, precision, collocation, grammar and tone

## Language Use

C1 is not a checklist of exotic grammar.

Evidence should show:

- broad usable range
- high grammatical control
- lexical precision and collocation
- advanced cohesion/discourse management
- register shifting
- stance/hedging
- complex grammar when it serves meaning

Persistent uncontrolled A1/A2 error patterns are incompatible with a C1-ready decision even if some advanced structures are known.

---

# Integrated Final Battery

## Speaking

1. **Spontaneous abstract response** — 2 minutes
2. **Professional/technical presentation** — 5–7 minutes
3. **Abstract discussion/debate** — 6–8 minutes + follow-up questions
4. **Audience reformulation** — explain one concept to beginner / specialist / manager

## Listening

- two 5–8 minute natural-speed academic/professional recordings
- one discussion/panel-style recording
- questions on gist, detail, inference, attitude, implication and speaker relationship

## Reading

- two demanding 1200–1800 word texts from different genres
- argument/tone/inference tasks
- multi-source synthesis

## Writing

- 350–500 word analytical task
- 180–250 word professional task

---

# Rubric

Each dimension is scored 1–5:

- Speaking
- Listening
- Reading
- Writing
- Language Use
- Interaction

C1 rubric pass:

- average **≥ 4.2 / 5**
- no dimension **< 3.8 / 5**

In addition, the readiness engine requires the broader evidence profile, not only the rubric score.

---

# Independent Validation Rule

A self-assessment can be stored and used diagnostically, but **self-rating alone cannot unlock final C1 readiness**.

The final passed C1 checkpoint must currently be scored by a **teacher / qualified human evaluator**. The architecture may later accept an AI evaluator only when a real provider is connected and given the full task evidence; the current UI deliberately does not let a learner self-label an evaluation as "AI".

The core app remains usable without a paid AI provider; independent validation occurs only at the final readiness gate.

---

# Shipped C1 Exit Pack A

The repository now contains actual original assessment material in `src/content/c1-exit-pack.ts`, not only task descriptions:

- 3 listening blocks: **751 / 740 / 769 words**
- 2 demanding reading texts: **1,214 / 1,307 words**
- 4 recorded speaking tasks, including a 6–8 minute abstract discussion
- 3 writing/synthesis tasks
- 34 submitted tasks in total

The app locks the final C1 rubric until all 34 tasks are submitted, all 3 long listening inputs have completed at normal speed, all 4 speaking tasks have substantial recordings, and at least one final speaking recording reaches 360 seconds. Speaking audio is persisted locally in IndexedDB so the evidence can be replayed later on the same browser/device. Long browser-TTS passages are split into smaller utterance chunks so a 700+ word assessment script is less likely to stop midway. This completion lock is still only a prerequisite; quality is judged separately by the rubric and an identified independent evaluator.

# Automated Score Honesty

Open speaking and writing responses are **not** automatically marked linguistically correct. They are stored as performance evidence. Automated accuracy is calculated only from exercises with a deterministic answer key. Daily lesson completion additionally requires component coverage, objective items, timed speaking evidence, and any required real-world mission. This prevents long open answers from inflating the accuracy score merely because text was entered.

# Why This Is Stricter Than Course Completion

Course completion answers:

> Did the learner perform the scheduled training?

C1 readiness answers:

> Can the learner now perform demanding real communicative tasks at approximately C1 quality?

Those are not the same question.
