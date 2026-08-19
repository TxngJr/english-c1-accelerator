import test from "node:test";
import assert from "node:assert/strict";
import { checkpointScoresAreValid, isVerifiedCheckpointAttempt, latestVerifiedCheckpoint, recordCheckpointAttempt } from "../src/lib/checkpoints.ts";
import { defaultState } from "../src/lib/storage.ts";
import type { CheckpointAttempt, LearnerState } from "../src/lib/types.ts";

function cloneState(): LearnerState {
  return structuredClone(defaultState);
}

function attempt(overrides: Partial<CheckpointAttempt> = {}): CheckpointAttempt {
  return {
    id: "checkpoint-test",
    level: "B1",
    createdAt: "2026-08-19T12:00:00.000Z",
    scores: {
      speaking: 4,
      listening: 4,
      reading: 4,
      writing: 4,
      languageUse: 4,
      interaction: 4
    },
    passed: true,
    evaluator: "self",
    ...overrides
  };
}

test("checkpoint scores must stay inside the 1-5 rubric range", () => {
  assert.equal(checkpointScoresAreValid(attempt().scores), true);
  assert.equal(checkpointScoresAreValid({ ...attempt().scores, writing: 5.1 }), false);
  assert.equal(checkpointScoresAreValid({ ...attempt().scores, speaking: Number.NaN }), false);
});

test("self-assessment is practice evidence and never a verified checkpoint", () => {
  const item = attempt({ level: "B2", evaluator: "self" });
  assert.equal(isVerifiedCheckpointAttempt(item), false);

  const state = recordCheckpointAttempt(cloneState(), item);
  assert.equal(state.checkpointAttempts[0].passed, true);
  assert.equal(state.skillEstimates.speaking.level, defaultState.skillEstimates.speaking.level);
  assert.equal(state.skillEstimates.writing.level, defaultState.skillEstimates.writing.level);
});

test("teacher label without an assessor identifier cannot promote skills", () => {
  const item = attempt({ level: "B2", evaluator: "teacher", evaluatorName: "   " });
  const state = recordCheckpointAttempt(cloneState(), item);
  assert.equal(isVerifiedCheckpointAttempt(state.checkpointAttempts[0]), false);
  assert.equal(state.skillEstimates.speaking.level, defaultState.skillEstimates.speaking.level);
});

test("identified teacher pass promotes assessed skills including pronunciation without downgrading stronger skills", () => {
  const state = cloneState();
  state.skillEstimates.reading = { level: "B2+", progress: 30 };
  const item = attempt({ level: "B2", evaluator: "teacher", evaluatorName: "Assessor 01" });
  const next = recordCheckpointAttempt(state, item);

  assert.equal(isVerifiedCheckpointAttempt(next.checkpointAttempts[0]), true);
  assert.equal(next.skillEstimates.speaking.level, "B2");
  assert.equal(next.skillEstimates.writing.level, "B2");
  assert.deepEqual(next.skillEstimates.reading, { level: "B2+", progress: 30 });
  assert.equal(next.skillEstimates.pronunciation.level, "B2");
});

test("invalid out-of-range rubric scores cannot remain a passing attempt", () => {
  const state = recordCheckpointAttempt(cloneState(), attempt({ scores: { ...attempt().scores, speaking: 6 } }));
  assert.equal(state.checkpointAttempts[0].passed, false);
});

test("latestVerifiedCheckpoint ignores newer self-practice and returns newest verified pass", () => {
  const state = cloneState();
  state.checkpointAttempts = [
    attempt({ id: "new-self", evaluator: "self", createdAt: "2026-08-21T00:00:00.000Z" }),
    attempt({ id: "older-teacher", evaluator: "teacher", evaluatorName: "A", createdAt: "2026-08-20T00:00:00.000Z" }),
    attempt({ id: "oldest-teacher", evaluator: "teacher", evaluatorName: "B", createdAt: "2026-08-19T00:00:00.000Z" })
  ];
  assert.equal(latestVerifiedCheckpoint(state, "B1")?.id, "older-teacher");
});
