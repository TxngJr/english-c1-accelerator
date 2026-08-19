import type { CurriculumStage } from "@/lib/types";

export const curriculumStages: CurriculumStage[] = [
  {
    id: "foundation",
    name: "Stage 1 — Foundation Rebuild",
    transition: "A1+ → strong A2",
    outcome: "Form basic English sentences automatically without translating every word.",
    capabilities: [
      "Introduce yourself and describe daily life",
      "Talk about university, programming, interests and simple problems",
      "Describe past events and future plans",
      "Ask and answer common questions",
      "Give simple opinions and reasons",
      "Maintain a short conversation",
      "Understand slow, clear everyday English"
    ],
    languageFocus: [
      "Sentence construction and word order",
      "be / do / have",
      "Present Simple / Present Continuous",
      "Past Simple",
      "basic future forms",
      "Present Perfect foundations",
      "questions and negatives",
      "articles, pronouns, prepositions",
      "high-frequency collocations"
    ],
    masteryGate: [
      "Speak for 45–60 seconds on familiar topics with limited Thai translation",
      "Use basic present/past/future forms with at least 80% production accuracy",
      "Understand one-minute A2 listening at normal speed with at least 75% comprehension",
      "Write a connected 80–120 word paragraph with understandable grammar"
    ]
  },
  {
    id: "functional",
    name: "Stage 2 — Functional Independence",
    transition: "A2 → B1",
    outcome: "Function independently in common academic, technical and social situations.",
    capabilities: [
      "Hold extended conversations",
      "Explain projects and programming problems",
      "Ask for clarification and give instructions",
      "Tell stories and discuss experiences",
      "Agree, disagree and give reasons",
      "Discuss advantages and disadvantages",
      "Handle travel situations",
      "Give 1–3 minute presentations"
    ],
    languageFocus: [
      "Present Perfect vs Past Simple",
      "Past Continuous / Past Perfect",
      "future forms",
      "conditionals",
      "passive voice",
      "relative clauses",
      "reported speech",
      "modal verbs",
      "gerunds / infinitives",
      "phrasal verbs",
      "linking words"
    ],
    masteryGate: [
      "Sustain a 3-minute guided conversation",
      "Explain a technical project for 1–2 minutes",
      "Understand everyday B1 listening at normal speed",
      "Read and summarize a short technical article",
      "Write a structured 150–180 word response"
    ]
  },
  {
    id: "independent-advanced",
    name: "Stage 3 — Independent Advanced User",
    transition: "B1 → B2",
    outcome: "Study, work, discuss technology and consume normal English content with substantial independence.",
    capabilities: [
      "Understand natural-speed listening",
      "Participate in longer conversations and technical discussions",
      "Explain systems and architecture",
      "Argue a position and respond to counterpoints",
      "Summarize and paraphrase",
      "Read documentation efficiently",
      "Write professional messages and structured essays",
      "Speak spontaneously for 3–5 minutes"
    ],
    languageFocus: [
      "advanced and mixed conditionals",
      "passives and reporting structures",
      "complex relative clauses",
      "modal deduction",
      "causatives",
      "participle clauses",
      "advanced linking and discourse markers",
      "collocation",
      "register",
      "idiomatic expressions and advanced phrasal verbs"
    ],
    masteryGate: [
      "Speak for 4–5 minutes with clear organization",
      "Understand most B2 natural-speed content on familiar topics",
      "Read complex documentation and infer meaning from context",
      "Write a coherent 250-word analytical response",
      "Use register appropriately in social and professional contexts"
    ]
  },
  {
    id: "c1",
    name: "Stage 4 — C1 Advanced Proficiency",
    transition: "B2 → C1",
    outcome: "Communicate fluently, flexibly and precisely in academic, professional, technical and social English.",
    capabilities: [
      "Build nuanced arguments",
      "Discuss abstract topics",
      "Understand implicit meaning, attitude and multiple accents",
      "Give professional presentations",
      "Debate and respond spontaneously",
      "Read advanced texts and synthesize multiple sources",
      "Write reports and analytical essays",
      "Shift tone/register and reformulate ideas precisely"
    ],
    languageFocus: [
      "inversion",
      "cleft sentences",
      "advanced modality and hedging",
      "subjunctive structures",
      "advanced conditionals",
      "participle clauses",
      "nominalization",
      "complex noun phrases",
      "advanced discourse markers",
      "sophisticated cohesion",
      "register shifting"
    ],
    masteryGate: [
      "Handle a 5–8 minute C1 discussion with follow-up questions",
      "Give a structured professional presentation and defend the position",
      "Understand natural-speed academic/professional material including implication",
      "Synthesize complex readings",
      "Write coherent C1 analytical and professional texts",
      "Demonstrate precision, nuance, stance and flexible reformulation"
    ]
  }
];

export const milestones = [
  "Speak for 30 seconds without Thai",
  "Describe yesterday using correct basic past tense",
  "Understand a one-minute A2 listening at normal speed",
  "Hold a 3-minute guided conversation",
  "Explain a programming project in English",
  "Watch a 5-minute English video and summarize the main idea",
  "Give a 3-minute presentation",
  "Read technical documentation without translating every sentence",
  "Participate in a B2 discussion",
  "Pass the C1 exit assessment"
];

export const baselinePrompts = [
  "Introduce yourself.",
  "Why do you want to improve your English?",
  "What did you do yesterday?",
  "What are you going to do next weekend?",
  "How has technology changed the way you learn or work?",
  "Is technological progress necessarily equivalent to social progress?"
];
