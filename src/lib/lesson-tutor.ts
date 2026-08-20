import type { CEFR, Skill } from "@/lib/types";

export type LessonTutorMode = "integrated" | "speaking" | "listening" | "reading" | "writing" | "grammar";
export type LessonTutorAction = "listen" | "speak" | "read" | "write" | "respond";

export type LessonTutorReply = {
  message: string;
  coachingNote?: string;
  targetSkill: Skill | "integrated";
  action: LessonTutorAction;
  hideTranscript: boolean;
  suggestedSeconds?: number;
  suggestedWords?: number;
};

export const lessonTutorModes: Array<{ id: LessonTutorMode; label: string; purpose: string }> = [
  { id: "integrated", label: "4-skill loop", purpose: "Listen → speak → read → write with adaptive follow-ups." },
  { id: "speaking", label: "Speaking", purpose: "Retrieval, fluency, clarification, argument and reformulation." },
  { id: "listening", label: "Listening", purpose: "Listen first with the transcript hidden, then answer from meaning." },
  { id: "reading", label: "Reading", purpose: "Gist, detail, inference, stance and synthesis at the lesson level." },
  { id: "writing", label: "Writing", purpose: "Produce, receive selective feedback, then rewrite from memory." },
  { id: "grammar", label: "Grammar", purpose: "Turn the lesson pattern into spontaneous production instead of rule recall." }
];

const validActions = new Set<LessonTutorAction>(["listen", "speak", "read", "write", "respond"]);
const validTargets = new Set<string>([
  "speaking", "listening", "reading", "writing", "grammarProduction", "grammarRecognition", "vocabulary", "pronunciation", "integrated"
]);

export function parseLessonTutorReply(text: string): LessonTutorReply | undefined {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object") return undefined;
  const value = parsed as Record<string, unknown>;
  const message = typeof value.message === "string" ? value.message.trim() : "";
  const action = typeof value.action === "string" && validActions.has(value.action as LessonTutorAction)
    ? value.action as LessonTutorAction
    : "respond";
  const targetSkill = typeof value.targetSkill === "string" && validTargets.has(value.targetSkill)
    ? value.targetSkill as Skill | "integrated"
    : "integrated";
  if (!message) return undefined;

  const seconds = typeof value.suggestedSeconds === "number" && Number.isFinite(value.suggestedSeconds)
    ? Math.max(10, Math.min(600, Math.round(value.suggestedSeconds)))
    : undefined;
  const words = typeof value.suggestedWords === "number" && Number.isFinite(value.suggestedWords)
    ? Math.max(10, Math.min(1000, Math.round(value.suggestedWords)))
    : undefined;

  return {
    message: message.slice(0, 8000),
    coachingNote: typeof value.coachingNote === "string" ? value.coachingNote.trim().slice(0, 1200) || undefined : undefined,
    targetSkill,
    action,
    hideTranscript: value.hideTranscript === true,
    suggestedSeconds: seconds,
    suggestedWords: words
  };
}

function speakingSeconds(level: CEFR): number {
  if (level === "A1" || level === "A2") return 45;
  if (level === "B1") return 90;
  if (level === "B2") return 150;
  return 240;
}

function writingWords(level: CEFR): number {
  if (level === "A1" || level === "A2") return 60;
  if (level === "B1") return 100;
  if (level === "B2") return 160;
  return 220;
}

export function localLessonTutorReply(input: {
  mode: LessonTutorMode;
  level: CEFR;
  lessonTitle: string;
  focus: string;
  turnIndex: number;
  learnerMessage?: string;
}): LessonTutorReply {
  const { mode, level, lessonTitle, focus, turnIndex } = input;
  const learnerHasAnswered = Boolean(input.learnerMessage?.trim());

  if (mode === "listening") {
    return {
      message: learnerHasAnswered
        ? `Listen again and answer one level deeper: what is the speaker's main point about ${focus}, and what detail supports it? Give the answer in your own English.`
        : `Today we are working on ${lessonTitle}. Listen without reading: explain one situation where ${focus} matters, then say what you would do and why.`,
      coachingNote: "The transcript stays hidden first. Focus on meaning, not individual words.",
      targetSkill: "listening",
      action: "listen",
      hideTranscript: true,
      suggestedSeconds: speakingSeconds(level)
    };
  }

  if (mode === "reading") {
    return {
      message: `Read this short lesson-linked text carefully:\n\nA learner improves fastest when practice is difficult enough to expose a real gap but focused enough to repeat. In today's lesson, ${focus} should not remain passive knowledge. The useful test is whether you can recognize the idea, explain it in your own words, apply it in a new situation, and notice when your first answer is too vague.\n\nQuestion: What is the writer's main claim, and how does it connect to today's lesson?`,
      coachingNote: turnIndex > 0 ? "After your answer, add one inference that is not stated directly." : "Answer from the text before translating sentence by sentence.",
      targetSkill: "reading",
      action: "read",
      hideTranscript: false
    };
  }

  if (mode === "writing") {
    return {
      message: learnerHasAnswered
        ? `Rewrite your previous answer without copying it. Make the logic clearer, improve one grammar choice, and add one precise example connected to ${focus}.`
        : `Write about ${focus} in the context of ${lessonTitle}. State one clear idea, support it with a concrete example, and finish with a consequence or conclusion.`,
      coachingNote: "Do not chase perfect prose on the first draft. Produce first, then rewrite from feedback.",
      targetSkill: "writing",
      action: "write",
      hideTranscript: false,
      suggestedWords: writingWords(level)
    };
  }

  if (mode === "grammar") {
    return {
      message: `Use today's language focus (${focus}) to produce three original examples: one about your real life, one about programming or study, and one hypothetical situation. Then explain which example was hardest to form and why.`,
      coachingNote: "This is production practice. Avoid copying a model sentence.",
      targetSkill: "grammarProduction",
      action: "respond",
      hideTranscript: false
    };
  }

  if (mode === "speaking") {
    return {
      message: learnerHasAnswered
        ? `Now answer again with more precision. Add a reason, one concrete example, and one limitation or exception related to ${focus}.`
        : `Speak about ${focus} without a script. Connect it to something you have actually studied, built, experienced, or decided, and explain why it matters.`,
      coachingNote: "Use keywords only. Keep going through small mistakes instead of restarting every sentence.",
      targetSkill: "speaking",
      action: "speak",
      hideTranscript: false,
      suggestedSeconds: speakingSeconds(level)
    };
  }

  const cycle: LessonTutorAction[] = ["listen", "speak", "read", "write"];
  const action = cycle[turnIndex % cycle.length];
  if (action === "listen") {
    return {
      message: `Listen first: in ${lessonTitle}, how could ${focus} change the way someone communicates or solves a problem? Give one reason and one example.`,
      coachingNote: "Integrated loop step 1/4: listen for meaning, then respond without seeing the transcript first.",
      targetSkill: "listening",
      action,
      hideTranscript: true,
      suggestedSeconds: speakingSeconds(level)
    };
  }
  if (action === "speak") {
    return {
      message: `Speak for ${speakingSeconds(level)} seconds: explain your answer again, but this time organize it as claim → reason → example → limitation.`,
      coachingNote: "Integrated loop step 2/4: spontaneous speaking under structure.",
      targetSkill: "speaking",
      action,
      hideTranscript: false,
      suggestedSeconds: speakingSeconds(level)
    };
  }
  if (action === "read") {
    return {
      message: `Read and respond: Strong language learning is not simply more exposure. It requires noticing gaps, retrieving language under pressure, receiving selective feedback, and trying again in a changed context. Which part of that cycle is most relevant to ${focus}, and why?`,
      coachingNote: "Integrated loop step 3/4: identify the claim, then connect it to the current lesson.",
      targetSkill: "reading",
      action,
      hideTranscript: false
    };
  }
  return {
    message: `Write a concise reflection on ${focus}: what you can now do, what still breaks down under pressure, and exactly what you will change on the next attempt.`,
    coachingNote: "Integrated loop step 4/4: write a controlled reflection, then start the cycle again at a harder level.",
    targetSkill: "writing",
    action,
    hideTranscript: false,
    suggestedWords: writingWords(level)
  };
}
