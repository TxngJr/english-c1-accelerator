# Personalized C1 Execution Plan

## Purpose

This document describes how the application should be used for this specific learner rather than for a generic English student.

The learner begins around practical **A1+/early A2**. Speaking production is approximately A1 and is the weakest skill. Reading is relatively stronger. Passive grammar recognition includes some A2/B1 knowledge, but active production still breaks down on basic forms such as Present Simple and Past Simple.

The central problem is therefore not "learn every grammar rule in order." It is:

> convert partially known English into fast, stable, independent language production while simultaneously raising listening, reading and writing to C1 breadth and control.

---

## Why this plan is different for this learner

### 1. Speaking receives the largest share

Default daily weighting starts around:

- Speaking: 29%
- Listening: 21%
- Reading: 13%
- Writing: 13%
- Grammar production: 10%
- Vocabulary: 7%
- Pronunciation: 4%
- Grammar recognition: 3%

These are starting weights, not fixed quotas. `src/lib/adaptive.ts` changes them using current skill estimates and the Error Bank.

### 2. Grammar recognition is deliberately underweighted

Diagnostic evidence shows an unusual gap: the learner can recognize structures such as conditionals, passive voice and past perfect in some multiple-choice contexts while still producing errors such as `I am go...` and `I do my homework yesterday.`

Therefore the system prioritizes:

1. retrieval
2. transformation
3. rapid response
4. speaking
5. writing
6. spaced recycling

rather than repeated long explanations.

### 3. Past-tense switching is treated as an automaticity problem

A time cue such as `yesterday` should increasingly trigger a past-tense frame automatically. The goal is not only to know that `do → did`; it is to retrieve `did` quickly enough for real conversation.

### 4. Reading is used as leverage, not as an escape

Because reading is relatively stronger, technical reading can provide high-quality input and vocabulary. However, the system must not allow the learner to spend most of the day reading because it feels easier than speaking.

### 5. Technical interests personalize motivation, not CEFR breadth

Programming, AI, web development, system architecture, startups and university projects recur throughout the curriculum. General English, travel, society, academic discussion, professional interaction and unfamiliar abstract topics are still mandatory because C1 is broad proficiency.

---

# Course Shape

## 224 playable days

The application ships with:

- Days 1–14: accelerated foundation rebuild
- 30 post-foundation modules
- 7 study days per module
- 210 post-foundation days
- 224 total days
- approximately 618.8 hours of scheduled structured work

The 30 modules are grouped into:

- 6 A2/A2+ modules
- 8 B1/B1+ modules
- 8 B2/B2+ modules
- 8 C1 modules

The complete nominal schedule is **32 weeks** at seven structured days per week.

This is not a promise that C1 occurs on Week 32. It is the shipped workload. If a gate fails, targeted remediation and retesting extend the timeline. If mastery is clearly demonstrated early, redundant drills can be shortened.

---

# Four 8-Week Blocks

## Block 1 — Accelerated Foundation Rebuild

**Days 1–56**  
**Target:** A1+/A2- → strong A2  
**Structured workload:** ~153 hours in the shipped curriculum

Main outcomes:

- start familiar speech in roughly 3–5 seconds
- produce routine/past/future language with much less Thai translation
- maintain 45–60 second familiar-topic speech
- understand short A2 listening at normal speed
- ask questions and repair misunderstandings
- write connected 100–150 word responses

Promotion evidence:

- A2 integrated checkpoint
- controlled basic-tense production around 80%+
- 45–60 second unscripted recording
- listening/reading at target difficulty
- recurring basic errors are improving rather than repeating unchanged

## Block 2 — Functional Independence

**Days 57–112**  
**Target:** A2 → B1  
**Structured workload:** ~155 hours

Main outcomes:

- explain projects and programming problems
- tell coherent stories
- give opinions and discuss simple tradeoffs
- follow normal B1 speech
- handle meetings, study, travel and clarification
- present for 2–3 minutes

Promotion evidence:

- B1 integrated checkpoint
- 2–3 minute independent project explanation
- successful follow-up interaction
- connected B1 writing
- normal-speed B1 comprehension without sentence-by-sentence Thai translation

## Block 3 — Independent Advanced User

**Days 113–168**  
**Target:** B1 → B2  
**Structured workload:** ~155 hours

Main outcomes:

- sustain 4–5 minute organized speaking
- explain architecture and technical tradeoffs
- summarize and paraphrase accurately
- understand natural-speed speech across multiple clear accents
- read documentation efficiently
- produce professional and analytical writing

Promotion evidence:

- B2 integrated checkpoint
- natural-speed listening with inference
- complex reading and paraphrase/synthesis control
- professional register
- sustained speaking under follow-up pressure

## Block 4 — C1 Advanced Proficiency

**Days 169–224**  
**Target:** B2 → C1  
**Structured workload:** ~155 hours plus remediation/immersion as needed

Main outcomes:

- nuanced stance and hedging
- complex argument architecture
- source synthesis
- reformulation across audiences
- implicit meaning and pragmatics
- advanced technical/business reasoning
- academic/analytical writing
- 6–8 minute spontaneous discussion with follow-up pressure

Final evidence:

- all major skill estimates around the C1 profile
- extensive normal-speed listening evidence
- extended unscripted speaking evidence
- no uncontrolled recurring foundation error pattern
- full C1 assessment battery (**C1 Exit Pack A is shipped as real material: 3 long listenings, 2 demanding readings, 4 speaking tasks, 3 writing/synthesis tasks**)
- rubric average ≥ 4.2/5 with no dimension below 3.8
- **independent final scoring by a teacher / qualified evaluator** (AI is allowed only if a real provider is later connected)

Self-rating alone cannot unlock final C1 readiness. The shipped final gate also requires completion of all 34 exit tasks, all three normal-speed long listenings, substantial recordings for all four final speaking tasks, and at least one 6-minute speaking recording before the rubric unlocks.

---

# Seven-Day Module Cycle

Every post-foundation module uses a deliberate seven-day cycle rather than seven identical lessons.

## Day 1 — Launch & Notice

- cold retrieval
- activate four core chunks
- notice target structures in meaningful input
- short speaking with support

## Day 2 — Automaticity Lab

- rapid retrieval
- grammar-to-production transformations
- response-time pressure
- reduce Thai sentence construction

## Day 3 — Listening Decode

- normal-speed first listen
- detail recovery
- transcript inspection
- connected-speech noticing
- shadowing
- return to normal speed

## Day 4 — Speaking Expansion

- rapid response
- guided outline
- longer unscripted turn
- follow-up pressure
- reformulation

## Day 5 — Read, Paraphrase, Write

- demanding module text; B2/C1 blocks expand into substantially longer original input than the A2/B1 format
- gist/inference
- paraphrase
- summary
- extended writing

## Day 6 — Real-World Transfer

- technical/professional/travel/academic scenario
- authentic mission
- mission evidence must be explicitly marked complete; lesson completion alone does not credit it
- application to the learner's own project or context

## Day 7 — Mastery Gate

- reduced support
- integrated speaking/listening/reading/writing
- module-specific mastery criterion
- speaking recording required
- remediation if weak

---

# Daily Operating Rule

The normal structured target is approximately **165 minutes**. The app recalculates skill allocation rather than forcing a fixed schedule.

A typical foundation day may include approximately:

- 45–55 min speaking
- 30–40 min listening
- 20–25 min reading
- 20–25 min writing
- 15–25 min grammar production
- 10–15 min vocabulary/SRS
- 5–10 min pronunciation

Grammar recognition should receive little separate time unless a new structure is genuinely not understood.

## Evidence accounting rules

- Open speaking/writing answers are completion evidence, **not automatic correctness**.
- Measured lesson accuracy uses only answer-keyed tasks.
- Each lesson requires coverage across grammar, listening, speaking, reading, writing, review and exit work.
- Speaking-first gates require real timed recordings.
- Real-world missions require explicit completion evidence.
- C1 self-rating can never promote the learner to final C1.

---

# Immersion Is Additional, Not a Substitute

Foundation:

- ~20 min comprehensible English audio/video
- 5 min English think-aloud
- one English search / README / interface task

B1:

- ~30 min normal English media
- 10 min spontaneous English
- one real English message/search/documentation task

B2:

- ~45 min natural-speed media
- 15 min unscripted speaking
- technical/documentation reading in English

C1:

- 60+ min varied natural English
- 20 min discussion/presentation practice
- advanced reading or professional English task

Passive media time is not counted as equivalent to structured retrieval/production.

---

# What "Personalized" Means in the App

The app modifies daily emphasis from:

1. weakest skill estimates
2. active-vs-passive grammar gap
3. Error Bank recurrence
4. current CEFR stage
5. speaking duration evidence
6. normal-speed listening evidence
7. checkpoint failures

If Past Simple keeps failing, the learner should see more Past Simple production. If vocabulary is recognized but not used, production prompts should rise. If reading is strong while listening lags, listening receives more time rather than repeating easy reading.

---

# External Reference Alignment

The pathway uses CEFR as an ability framework, especially the Council of Europe's emphasis on a profile of communicative activities and qualitative spoken performance rather than one vocabulary score.

Useful primary references:

- Council of Europe CEFR descriptors: `https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors`
- CEFR global scale: `https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale/`
- CEFR qualitative aspects of spoken language: `https://www.coe.int/en/web/common-european-framework-reference-languages/table-3-cefr-3.3-common-reference-levels-qualitative-aspects-of-spoken-language-use`

Cambridge English publishes approximate guided-learning-hour ranges and notes that the actual number varies by learner. Their current guidance places C1 at approximately 700–800 cumulative guided hours from complete beginner and roughly 200 hours per level as a broad rule of thumb. This learner is not a complete beginner, so the app ships roughly 619 structured hours while still requiring performance gates and allowing additional remediation.

Reference: `https://support.cambridgeenglish.org/hc/en-gb/articles/202838506-Guided-learning-hours`
