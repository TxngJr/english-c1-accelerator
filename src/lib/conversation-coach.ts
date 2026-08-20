import type { CEFR } from "./types.ts";

export type ConversationChallengeType =
  | "clarify"
  | "example"
  | "reason"
  | "counterargument"
  | "hypothetical"
  | "reformulate"
  | "qualify"
  | "synthesize";

export type ConversationTopic = {
  id: string;
  label: string;
  level: CEFR;
  openingQuestion: string;
  goal: string;
};

export const conversationTopics: ConversationTopic[] = [
  {
    id: "a2-daily-life",
    label: "Daily life & study",
    level: "A2",
    openingQuestion: "Tell me about a normal study day. What do you usually do, and what did you do differently yesterday?",
    goal: "Use basic present/past language and answer simple follow-up questions without switching to Thai."
  },
  {
    id: "a2-travel-problem",
    label: "Travel problem",
    level: "A2",
    openingQuestion: "Imagine you arrived at a hotel, but your reservation is missing. Explain the problem and ask the staff for help.",
    goal: "Clarify a familiar problem, request help, and respond to new practical information."
  },
  {
    id: "b1-project",
    label: "Explain a project",
    level: "B1",
    openingQuestion: "Tell me about a project you built or want to build. What problem does it solve, and what has been difficult so far?",
    goal: "Sustain a connected explanation and handle clarification, causes, examples, and next steps."
  },
  {
    id: "b1-ai-study",
    label: "AI in education",
    level: "B1",
    openingQuestion: "Do you think students should use AI assistants for school or university work? Explain your position and one possible problem.",
    goal: "Give reasons, acknowledge a disadvantage, and respond to an alternative view."
  },
  {
    id: "b2-engineering-tradeoff",
    label: "Engineering tradeoff",
    level: "B2",
    openingQuestion: "A team can release a feature quickly with some technical debt, or delay it for a cleaner design. Which option would you choose and why?",
    goal: "Defend a position, qualify it, handle counterarguments, and reformulate technical reasoning."
  },
  {
    id: "b2-remote-work",
    label: "Remote work",
    level: "B2",
    openingQuestion: "Should a software company be remote-first, office-first, or hybrid? Build a balanced argument rather than listing simple pros and cons.",
    goal: "Organize an extended argument and respond flexibly when the assumptions change."
  },
  {
    id: "c1-ai-decisions",
    label: "AI decision-making",
    level: "C1",
    openingQuestion: "A company wants AI systems to make some decisions that currently require human judgment. Under what conditions could that be justified, and where should the boundary remain?",
    goal: "Qualify claims, reason about uncertainty, handle competing values, synthesize viewpoints, and reformulate under pressure."
  },
  {
    id: "c1-technology-policy",
    label: "Technology & society",
    level: "C1",
    openingQuestion: "When a technology creates clear economic benefits but also increases inequality or privacy risk, how should governments and companies divide responsibility?",
    goal: "Develop a nuanced position, challenge assumptions, distinguish levels of responsibility, and synthesize competing perspectives."
  }
];

const followUps: Record<ConversationChallengeType, string[]> = {
  clarify: [
    "Could you clarify what you mean by the most important part of that answer?",
    "You used a broad idea there. What exactly do you mean in this situation?"
  ],
  example: [
    "Can you give one concrete example that would make your point easier to understand?",
    "What would that look like in a real situation rather than in theory?"
  ],
  reason: [
    "Why do you think that factor matters more than the alternatives?",
    "What is the strongest reason for your position?"
  ],
  counterargument: [
    "Someone could reasonably disagree with you. What is the strongest argument against your position, and how would you respond?",
    "Suppose the opposite side says your solution creates a bigger problem elsewhere. How would you answer that?"
  ],
  hypothetical: [
    "How would your answer change if the cost became much higher than you expected?",
    "Imagine the main assumption behind your answer turns out to be false. What would you change?"
  ],
  reformulate: [
    "Explain the same idea again for someone with no technical background, without changing the underlying meaning.",
    "That explanation is fairly complex. Can you rephrase the core idea more simply and precisely?"
  ],
  qualify: [
    "Your claim sounds quite strong. What limitation or uncertainty would you add to make it more precise?",
    "Under what conditions would your argument no longer be true?"
  ],
  synthesize: [
    "Bring the strongest point from both sides together. What balanced recommendation follows from them?",
    "You have mentioned several factors. How do they interact, and what conclusion follows when you consider them together?"
  ]
};

export function challengeTypesForLevel(level: CEFR): ConversationChallengeType[] {
  if (level.startsWith("A1") || level.startsWith("A2")) return ["clarify", "example", "reason"];
  if (level.startsWith("B1")) return ["clarify", "example", "reason", "counterargument", "hypothetical"];
  if (level.startsWith("B2")) return ["reason", "counterargument", "hypothetical", "reformulate", "qualify"];
  return ["counterargument", "hypothetical", "reformulate", "qualify", "synthesize"];
}

export function localFollowUp(level: CEFR, turnIndex: number): { type: ConversationChallengeType; question: string } {
  const allowed = challengeTypesForLevel(level);
  const type = allowed[turnIndex % allowed.length];
  const options = followUps[type];
  const question = options[Math.floor(turnIndex / allowed.length) % options.length];
  return { type, question };
}

export function minimumConversationTurns(level: CEFR): number {
  if (level.startsWith("A1") || level.startsWith("A2")) return 3;
  if (level.startsWith("B1")) return 4;
  if (level.startsWith("B2")) return 5;
  return 6;
}
