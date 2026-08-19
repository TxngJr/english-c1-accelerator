export type AssessmentSpec = {
  speaking: string[];
  listening: string[];
  reading: string[];
  writing: string[];
  languageUse?: string[];
  interaction?: string[];
  gate: string[];
};

export const cefrAssessments: Record<"A2" | "B1" | "B2" | "C1", AssessmentSpec> = {
  A2: {
    speaking: [
      "45–60s: introduce yourself, study, interests and current routine without reading.",
      "45–60s: describe yesterday using basic Past Simple.",
      "45–60s: describe next weekend using an appropriate future form.",
      "2–3 min role-play: request help, clarify a misunderstanding, and solve a familiar service/travel problem."
    ],
    listening: [
      "Two original 60–90s A2 dialogues at normal speed: gist + 5 key details.",
      "One short announcement/instruction task with numbers, times or directions."
    ],
    reading: [
      "Two 200–300 word A2 texts: gist, detail, reference words and vocabulary from context.",
      "One short practical text such as instructions, schedule or support message."
    ],
    writing: [
      "100–150 words on a familiar topic with connected sentences and basic paragraph control.",
      "A short practical message/request that communicates all required information."
    ],
    languageUse: ["Basic present/past/future choice, questions, negatives, comparisons, requests and high-frequency chunks in production."],
    interaction: ["Can ask for repetition/clarification and keep a short interaction moving."],
    gate: [
      "Basic present/past/future production ≥ 80% in controlled production tasks.",
      "45–60s understandable spontaneous speech on familiar topics.",
      "Listening and reading ≥ 75% on target-level tasks.",
      "Integrated rubric average ≥ 3.6/5 with no dimension below 3.2."
    ]
  },
  B1: {
    speaking: [
      "2–3 min: explain a real project, its goal, current progress and a problem.",
      "2 min: discuss advantages/disadvantages of a familiar technology or study choice.",
      "Interactive follow-up: clarify, repair misunderstanding and answer unprepared questions."
    ],
    listening: [
      "Two 2–3 min normal-speed B1 conversations/explanations: gist, detail, sequence and speaker attitude.",
      "One clear international-accent task with confirmation/inference questions."
    ],
    reading: [
      "A 500–700 word general/technical text with inference, structure and summary tasks.",
      "A README/support/documentation-style text requiring information location rather than full translation."
    ],
    writing: [
      "150–200 word structured opinion, narrative or project explanation.",
      "Professional message/update with suitable tone and clear next steps."
    ],
    languageUse: ["Connected tense use, conditionals, modals, relative clauses, passives, linking and common phrasal/collocational language."],
    interaction: ["Can sustain interaction, ask follow-up questions, recover from a gap and reformulate a simple idea."],
    gate: [
      "Independent interaction across familiar academic, technical, social and travel contexts.",
      "Clear 2–3 minute project explanation.",
      "Normal-speed B1 comprehension without sentence-by-sentence Thai translation.",
      "Integrated rubric average ≥ 3.8/5 with no dimension below 3.2."
    ]
  },
  B2: {
    speaking: [
      "4–5 min argument with a clear position, support, limitation/counterpoint and conclusion.",
      "4–5 min technical system explanation for an informed listener.",
      "Presentation + Q&A with unprepared follow-ups and at least one reformulation."
    ],
    listening: [
      "Natural-speed 4–6 min material with multiple clear accents across tasks: gist, detail, inference and attitude.",
      "One unscripted-style discussion containing reductions, overlap/hesitation or informal discourse markers."
    ],
    reading: [
      "Two 800–1200 word complex texts/documentation sections: argument, tone, inference and efficient information retrieval.",
      "Paraphrase and summary tasks that preserve meaning without copying structure."
    ],
    writing: [
      "220–300 word analytical response with clear paragraph architecture.",
      "Professional task requiring deliberate register choice and concise escalation/explanation."
    ],
    languageUse: ["Wide B2 grammar, collocation, discourse markers, modality, complex clauses, paraphrase and register control."],
    interaction: ["Can maintain natural turn-taking, qualify a claim, challenge a point appropriately and repair wording without abandoning the message."],
    gate: [
      "Sustained organized 4–5 minute speaking under follow-up pressure.",
      "Substantial independence with natural-speed English and demanding texts.",
      "Appropriate professional/general register and reliable paraphrasing.",
      "Integrated rubric average ≥ 4.0/5 with no dimension below 3.2."
    ]
  },
  C1: {
    speaking: [
      "2 min spontaneous response to an unfamiliar abstract question with no preparation beyond 30 seconds.",
      "5–7 min professional/technical presentation with a coherent line of reasoning.",
      "6–8 min abstract discussion: position, competing viewpoint, qualification, counterargument, synthesis and spontaneous follow-ups.",
      "Reformulation task: explain the same complex idea to a beginner, specialist and manager without changing the underlying meaning."
    ],
    listening: [
      "Two 5–8 min natural-speed academic/professional recordings with varied clear accents: global meaning, detail, inference, attitude and implied stance.",
      "One discussion/panel-style recording in which the learner identifies agreement, qualified disagreement and what is implied rather than stated directly."
    ],
    reading: [
      "Two demanding 1200–1800 word texts from different genres: argument, implication, tone, stance and rhetorical organization.",
      "Multi-source synthesis task: identify convergence/divergence and build one independent integrated account."
    ],
    writing: [
      "350–500 word analytical essay/report with thesis, development, counterpoint, nuanced stance and controlled cohesion.",
      "180–250 word professional task requiring precise register, reformulation and concise decision-oriented communication."
    ],
    languageUse: [
      "Advanced grammar is judged through meaningful use: modality/hedging, complex noun phrases, cohesion, conditionals, participle structures, emphasis and register—not isolated trick questions.",
      "Lexical assessment prioritizes precision, collocation, reformulation and appropriate idiomatic/discourse language."
    ],
    interaction: [
      "Can take/keep the floor naturally, relate contributions to others, clarify ambiguity, disagree diplomatically, reformulate and respond to unexpected follow-up questions."
    ],
    gate: [
      "Fluent, flexible communication without routinely restricting intended meaning because of language limitations.",
      "High grammatical control; remaining errors do not form a persistent basic pattern.",
      "Successful inference, stance/attitude recognition and source synthesis.",
      "Integrated rubric average ≥ 4.2/5 with no dimension below 3.8.",
      "Final C1 readiness must be independently scored by a teacher or connected AI evaluator; self-rating alone cannot unlock C1."
    ]
  }
};
