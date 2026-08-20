import type { CEFR, SpeakingMetrics } from "./types.ts";

const FILLER_PATTERNS: RegExp[] = [
  /\bum+\b/gi,
  /\buh+\b/gi,
  /\berm+\b/gi,
  /\bhmm+\b/gi,
  /\byou know\b/gi
];

const DISCOURSE_MARKERS = [
  "however",
  "therefore",
  "although",
  "whereas",
  "on the other hand",
  "that said",
  "in other words",
  "for example",
  "for instance",
  "as a result",
  "from my perspective",
  "to some extent",
  "taken together",
  "more importantly",
  "in contrast",
  "overall",
  "ultimately",
  "nevertheless",
  "consequently",
  "what this means is"
] as const;

const SELF_REPAIR_MARKERS = [
  "i mean",
  "let me rephrase",
  "more precisely",
  "what i mean is",
  "to put that another way",
  "rather"
] as const;

export type SpeakingTarget = {
  level: CEFR;
  minimumSeconds: number;
  targetSeconds: number;
  prompt: string;
  focus: string;
};

export const speakingCoachTargets: SpeakingTarget[] = [
  {
    level: "A2",
    minimumSeconds: 45,
    targetSeconds: 60,
    prompt: "Introduce yourself, explain what you study or do, and describe one thing you did yesterday.",
    focus: "Basic tense control, clear sentences, and starting without translating every word from Thai."
  },
  {
    level: "B1",
    minimumSeconds: 120,
    targetSeconds: 180,
    prompt: "Explain a real project or problem: the goal, what happened, what you tried, and what you will do next.",
    focus: "Connected explanation, sequencing, clarification, and useful project vocabulary."
  },
  {
    level: "B2",
    minimumSeconds: 240,
    targetSeconds: 300,
    prompt: "Argue whether AI coding assistants improve software engineering. Give a position, evidence, a counterargument, a limitation, and a conclusion.",
    focus: "Sustained argument, counterpoint, register, reformulation, and natural-speed retrieval."
  },
  {
    level: "C1",
    minimumSeconds: 360,
    targetSeconds: 480,
    prompt: "A company wants to replace part of its human decision process with AI. Discuss benefits, hidden risks, competing viewpoints, uncertainty, safeguards, and a balanced recommendation. Reformulate one complex point for a non-technical listener.",
    focus: "Nuanced stance, qualification, synthesis, precise vocabulary, spontaneous reformulation, and coherent extended speech."
  }
];

export function wordsInTranscript(transcript: string): string[] {
  return transcript.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? [];
}

function countPatternMatches(text: string, pattern: RegExp): number {
  return [...text.matchAll(pattern)].length;
}

function countPhrases(text: string, phrases: readonly string[]): number {
  const normalized = text.toLowerCase();
  return phrases.reduce((sum, phrase) => {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return sum + countPatternMatches(normalized, new RegExp(`\\b${escaped.replace(/\\ /g, "\\s+")}\\b`, "g"));
  }, 0);
}

function repeatedWordCount(words: string[]): number {
  let count = 0;
  for (let index = 1; index < words.length; index += 1) {
    if (words[index].toLowerCase() === words[index - 1].toLowerCase()) count += 1;
  }
  return count;
}

export function analyzeSpeakingTranscript(transcript: string, durationSeconds: number): SpeakingMetrics {
  const words = wordsInTranscript(transcript);
  const normalizedWords = words.map((word) => word.toLowerCase());
  const uniqueWordRatio = words.length ? new Set(normalizedWords).size / words.length : 0;
  const minutes = Math.max(durationSeconds / 60, 1 / 60);
  const wordsPerMinute = words.length / minutes;
  const fillerCount = FILLER_PATTERNS.reduce((sum, pattern) => sum + countPatternMatches(transcript, pattern), 0);
  const fillerRatePer100Words = words.length ? fillerCount / words.length * 100 : 0;
  const discourseMarkerCount = countPhrases(transcript, DISCOURSE_MARKERS);
  const selfRepairCount = countPhrases(transcript, SELF_REPAIR_MARKERS);
  const sentenceWordCounts = transcript
    .split(/[.!?]+/)
    .map((sentence) => wordsInTranscript(sentence).length)
    .filter((count) => count > 0);
  const averageSentenceWords = sentenceWordCounts.length
    ? sentenceWordCounts.reduce((sum, count) => sum + count, 0) / sentenceWordCounts.length
    : words.length;

  return {
    wordCount: words.length,
    wordsPerMinute: Math.round(wordsPerMinute * 10) / 10,
    uniqueWordRatio: Math.round(uniqueWordRatio * 1000) / 1000,
    fillerCount,
    fillerRatePer100Words: Math.round(fillerRatePer100Words * 10) / 10,
    discourseMarkerCount,
    selfRepairCount,
    repeatedWordCount: repeatedWordCount(words),
    averageSentenceWords: Math.round(averageSentenceWords * 10) / 10
  };
}

export function localSpeakingCoachFeedback(metrics: SpeakingMetrics, level: CEFR): string[] {
  const feedback: string[] = [];
  const isAdvanced = level.startsWith("B2") || level.startsWith("C1");

  if (metrics.wordCount < 20) {
    feedback.push("Build a longer sample before judging fluency. Aim to finish the whole idea rather than stopping after one or two sentences.");
  }

  if (metrics.wordsPerMinute < 70) {
    feedback.push("Retrieval is still slow. Repeat the same prompt once more using only keywords, not a written script, and try to reduce silent planning time.");
  } else if (metrics.wordsPerMinute > 190) {
    feedback.push("Your rate is very fast. Slow slightly and prioritize intelligibility, stress, and complete phrasing over raw speed.");
  } else {
    feedback.push("Your speaking rate is within a workable conversational range; keep the focus on accuracy, phrasing, and idea development rather than speaking faster.");
  }

  if (metrics.fillerRatePer100Words > 7) {
    feedback.push("Filler frequency is high. Replace fillers with a short silent pause or a deliberate reformulation phrase such as “Let me rephrase that.”");
  }

  if (isAdvanced && metrics.discourseMarkerCount < 3) {
    feedback.push("For B2/C1, make the argument easier to follow with explicit relationships: contrast, cause, qualification, example, and conclusion.");
  }

  if (level.startsWith("C1") && metrics.selfRepairCount === 0) {
    feedback.push("C1 interaction includes flexible reformulation. Practice correcting or reframing one idea naturally instead of abandoning it when the first wording is imperfect.");
  }

  if (metrics.wordCount >= 120 && metrics.uniqueWordRatio < 0.32) {
    feedback.push("Lexical variety is narrow in this sample. Before repeating, prepare 5–8 precise collocations or synonyms, not a full script.");
  }

  if (metrics.repeatedWordCount >= 5) {
    feedback.push("There are several immediate word repetitions. Practice chunking whole phrases so you retrieve groups of words rather than restarting individual words.");
  }

  return feedback;
}

export function transcriptEvidenceIsAuditable(transcript: string, durationSeconds: number): boolean {
  const metrics = analyzeSpeakingTranscript(transcript, durationSeconds);
  if (durationSeconds < 45) return metrics.wordCount >= 20;
  return metrics.wordCount >= Math.max(35, Math.floor(durationSeconds * 0.7));
}

export function targetSimilarity(target: string, transcript: string): number {
  const targetWords = wordsInTranscript(target).map((word) => word.toLowerCase());
  const spokenWords = wordsInTranscript(transcript).map((word) => word.toLowerCase());
  if (!targetWords.length || !spokenWords.length) return 0;

  const targetCounts = new Map<string, number>();
  for (const word of targetWords) targetCounts.set(word, (targetCounts.get(word) ?? 0) + 1);
  let matched = 0;
  for (const word of spokenWords) {
    const remaining = targetCounts.get(word) ?? 0;
    if (remaining > 0) {
      matched += 1;
      targetCounts.set(word, remaining - 1);
    }
  }

  return Math.round(matched / targetWords.length * 100);
}
