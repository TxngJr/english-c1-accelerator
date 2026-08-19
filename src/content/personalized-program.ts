import type { Skill } from "@/lib/types";

export const learnerProfile = {
  target: "CEFR C1",
  startingPoint: "A1+ / early A2 practical English",
  priorities: [
    "speaking",
    "listening",
    "reading",
    "writing",
    "grammarProduction",
    "vocabulary",
    "pronunciation"
  ] as Skill[],
  strongestReportedSkill: "reading" as Skill,
  weakestReportedSkill: "speaking" as Skill,
  constraints: {
    studyDaysPerWeek: 7,
    structuredMinutesPerDay: { min: 120, target: 165, max: 240 },
    approach: "fastest realistic progression without advancing on time alone"
  },
  diagnostic: {
    speaking: "A1",
    writing: "A1+",
    grammarProduction: "A1+ to A2-",
    grammarRecognition: "A2 with isolated B1 knowledge",
    vocabulary: "A1+ to A2",
    reading: "A1+ to A2",
    listening: "A1 to A2",
    pronunciation: "requires ongoing diagnosis"
  },
  recurringRisks: [
    "translating from Thai before speaking",
    "slow vocabulary retrieval",
    "basic tense errors despite passive grammar knowledge",
    "word order and verb-form errors",
    "difficulty following normal spoken English",
    "hesitation and fear of mistakes",
    "unnatural collocation and phrasing",
    "weak phrasal verbs and idiomatic language"
  ],
  motivatingDomains: [
    "software engineering",
    "programming",
    "AI",
    "web applications",
    "startups",
    "university",
    "gaming",
    "manga/anime",
    "technology projects",
    "presentations",
    "travel",
    "career development"
  ]
} as const;

export type ProgramStageId = "foundation" | "a2-b1" | "b1-b2" | "b2-c1";

export type PersonalizedStage = {
  id: ProgramStageId;
  label: string;
  targetRange: string;
  nominalWeeks: number;
  guidedHoursFloor: number;
  guidedHoursTarget: number;
  speakingFloorMinutes: number;
  listeningFloorMinutes: number;
  outcomes: string[];
  exitEvidence: string[];
};

/**
 * Time is a workload floor, never the promotion rule.  The hours are deliberately
 * conservative for this learner's A1+/A2- starting profile and speaking weakness.
 * Advancement still requires the CEFR-style evidence gates in lib/adaptive.ts.
 */
export const personalizedStages: PersonalizedStage[] = [
  {
    id: "foundation",
    label: "Accelerated Foundation Rebuild",
    targetRange: "A1+/A2- → strong A2",
    nominalWeeks: 8,
    guidedHoursFloor: 120,
    guidedHoursTarget: 150,
    speakingFloorMinutes: 750,
    listeningFloorMinutes: 900,
    outcomes: [
      "Produce high-frequency present, past and future sentences without building them word-by-word in Thai.",
      "Start familiar answers within roughly 3–5 seconds.",
      "Speak for 45–60 seconds on familiar topics with understandable grammar.",
      "Understand short A2 listening at normal speed and recover key details.",
      "Write connected 100–150 word responses."
    ],
    exitEvidence: [
      "A2 checkpoint passed across speaking, listening, reading and writing.",
      "Basic tense production is at least 80% in controlled production tasks.",
      "A 45–60 second spontaneous recording is understandable without a script.",
      "High-severity foundation errors are falling rather than recurring unchanged."
    ]
  },
  {
    id: "a2-b1",
    label: "Functional Independence",
    targetRange: "A2 → B1",
    nominalWeeks: 8,
    guidedHoursFloor: 130,
    guidedHoursTarget: 155,
    speakingFloorMinutes: 1200,
    listeningFloorMinutes: 1500,
    outcomes: [
      "Handle common academic, social and travel situations independently.",
      "Explain programming problems, processes and projects in connected English.",
      "Maintain 2–3 minute speaking turns and answer follow-up questions.",
      "Follow normal B1 explanations and conversations.",
      "Write structured messages, summaries and 150–200 word responses."
    ],
    exitEvidence: [
      "B1 checkpoint passed across all four macro skills.",
      "A technical/project explanation is understandable for at least two minutes.",
      "The learner can repair misunderstandings and ask for clarification in English.",
      "Reading and listening do not depend on sentence-by-sentence Thai translation."
    ]
  },
  {
    id: "b1-b2",
    label: "Independent Advanced User",
    targetRange: "B1 → B2",
    nominalWeeks: 8,
    guidedHoursFloor: 140,
    guidedHoursTarget: 155,
    speakingFloorMinutes: 1800,
    listeningFloorMinutes: 2100,
    outcomes: [
      "Discuss technology and general topics with substantial independence.",
      "Speak spontaneously for 3–5 minutes with clear organization.",
      "Understand natural-speed speech across several clear accents.",
      "Read documentation and complex articles efficiently.",
      "Write professional and analytical texts with appropriate register."
    ],
    exitEvidence: [
      "B2 checkpoint passed with sustained speaking and natural-speed listening.",
      "A 4–5 minute argument includes reasons, counterpoints and reformulation.",
      "A complex technical text can be summarized without copying its wording.",
      "Writing demonstrates coherent paragraph architecture and register control."
    ]
  },
  {
    id: "b2-c1",
    label: "C1 Advanced Proficiency",
    targetRange: "B2 → C1",
    nominalWeeks: 8,
    guidedHoursFloor: 150,
    guidedHoursTarget: 160,
    speakingFloorMinutes: 2400,
    listeningFloorMinutes: 2700,
    outcomes: [
      "Communicate fluently and flexibly on academic, professional, technical and abstract topics.",
      "Recognize implication, stance and subtle disagreement in natural speech and writing.",
      "Construct nuanced arguments and synthesize multiple sources.",
      "Reformulate ideas for different audiences and registers.",
      "Produce extended analytical/professional writing with high control."
    ],
    exitEvidence: [
      "C1 exit assessment passed across speaking, listening, reading, writing and language use.",
      "A 6–8 minute discussion remains fluent, coherent and responsive under follow-up pressure.",
      "Natural-speed academic/professional listening includes successful inference and attitude recognition.",
      "Advanced reading is synthesized into an original argument rather than merely summarized.",
      "Writing shows precision, nuanced stance, cohesion and register control."
    ]
  }
];

export const totalProgramTargets = {
  nominalWeeks: personalizedStages.reduce((sum, stage) => sum + stage.nominalWeeks, 0),
  guidedHoursFloor: personalizedStages.reduce((sum, stage) => sum + stage.guidedHoursFloor, 0),
  guidedHoursTarget: personalizedStages.reduce((sum, stage) => sum + stage.guidedHoursTarget, 0),
  note: "Hours are workload guidance only. CEFR promotion is mastery/evidence based."
};

export const dailySkillBaseWeights: Record<Skill, number> = {
  speaking: 0.29,
  listening: 0.21,
  reading: 0.13,
  writing: 0.13,
  grammarProduction: 0.10,
  grammarRecognition: 0.03,
  vocabulary: 0.07,
  pronunciation: 0.04
};

export const personalizationRules = [
  "Speaking stays the largest daily block until it is no longer the weakest macro skill.",
  "Grammar recognition receives less time than grammar production because passive knowledge already exceeds active control.",
  "Any recurring tense, verb-form, word-order, article or preposition error is recycled into retrieval, speaking and writing rather than explained once and forgotten.",
  "Past Simple receives extra production weight until yesterday/last-week prompts trigger automatic past forms.",
  "Thai support is intentionally high in foundation explanations, then fades as familiar language becomes automatic.",
  "Programming/IT appears frequently because it increases relevance, but general English remains mandatory for CEFR breadth.",
  "Listening speed is progressively normalized; slow playback is a temporary decoding tool, not a permanent mode.",
  "C1 promotion requires performance on unfamiliar and abstract topics, not only familiar technology topics."
];

export const immersionMinimums = {
  foundation: ["20 min comprehensible English video/audio", "5 min think-aloud English", "one English search or README task"],
  "a2-b1": ["30 min normal English media", "10 min think-aloud or conversation", "one real English message/search/documentation task"],
  "b1-b2": ["45 min normal-speed media", "15 min unscripted speaking", "technical/documentation reading in English"],
  "b2-c1": ["60+ min varied natural English", "20 min discussion/presentation practice", "advanced reading or professional English task"]
} satisfies Record<ProgramStageId, string[]>;
