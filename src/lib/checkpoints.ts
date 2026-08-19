import type { CEFR, CheckpointAttempt, LearnerState, Skill } from "./types.ts";

const LEVEL_ORDER: CEFR[] = ["A1", "A1+", "A2-", "A2", "A2+", "B1-", "B1", "B1+", "B2-", "B2", "B2+", "C1-", "C1"];
const PROMOTED_SKILLS: Skill[] = [
  "speaking",
  "listening",
  "reading",
  "writing",
  "grammarProduction",
  "vocabulary",
  "pronunciation"
];

function levelIndex(level: CEFR): number {
  return Math.max(0, LEVEL_ORDER.indexOf(level));
}

export function checkpointScoresAreValid(scores: CheckpointAttempt["scores"]): boolean {
  const values = Object.values(scores);
  return values.length > 0 && values.every((value) => Number.isFinite(value) && value >= 1 && value <= 5);
}

export function isVerifiedCheckpointAttempt(attempt: CheckpointAttempt): boolean {
  return (
    attempt.passed &&
    checkpointScoresAreValid(attempt.scores) &&
    attempt.evaluator === "teacher" &&
    Boolean(attempt.evaluatorName?.trim())
  );
}

export function latestVerifiedCheckpoint(
  state: LearnerState,
  level: CheckpointAttempt["level"]
): CheckpointAttempt | undefined {
  return state.checkpointAttempts
    .filter((attempt) => attempt.level === level && isVerifiedCheckpointAttempt(attempt))
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
}

export function recordCheckpointAttempt(
  state: LearnerState,
  attempt: CheckpointAttempt
): LearnerState {
  const normalizedAttempt: CheckpointAttempt = {
    ...attempt,
    passed: attempt.passed && checkpointScoresAreValid(attempt.scores),
    evaluatorName: attempt.evaluator === "self" ? undefined : attempt.evaluatorName?.trim() || undefined
  };

  const next: LearnerState = {
    ...state,
    checkpointAttempts: [
      normalizedAttempt,
      ...state.checkpointAttempts.filter((item) => item.id !== normalizedAttempt.id)
    ],
    xp: state.xp + (normalizedAttempt.passed ? 120 : 35)
  };

  if (!isVerifiedCheckpointAttempt(normalizedAttempt)) return next;

  const skillEstimates = { ...next.skillEstimates };
  for (const skill of PROMOTED_SKILLS) {
    const current = skillEstimates[skill];
    if (levelIndex(current.level) < levelIndex(normalizedAttempt.level)) {
      skillEstimates[skill] = { level: normalizedAttempt.level, progress: 0 };
    }
  }

  return { ...next, skillEstimates };
}
