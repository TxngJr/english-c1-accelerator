import test from "node:test";
import assert from "node:assert/strict";
import { c1ExitListening, c1ExitReading, c1ExitSpeaking, c1ExitWriting } from "../src/content/c1-exit-pack.ts";
import { c1ExitEvidenceStatus } from "../src/lib/c1-evidence.ts";
import { defaultState } from "../src/lib/storage.ts";
import type { LearnerState } from "../src/lib/types.ts";

function cloneState(): LearnerState {
  return structuredClone(defaultState);
}

function submitAllTasks(state: LearnerState) {
  const exercises = [
    ...c1ExitListening.flatMap((block) => block.detailQuestions),
    ...c1ExitReading.flatMap((block) => block.questions),
    ...c1ExitSpeaking,
    ...c1ExitWriting
  ];
  for (const exercise of exercises) {
    state.exerciseResults[exercise.id] = {
      answer: "submitted evidence",
      correct: false,
      score: 0,
      answeredAt: new Date().toISOString()
    };
  }
}

test("submitting all C1 exit text fields is not enough without listening and speaking evidence", () => {
  const state = cloneState();
  submitAllTasks(state);
  const status = c1ExitEvidenceStatus(state);
  assert.equal(status.answeredTasks, status.totalTasks);
  assert.equal(status.complete, false);
});

test("C1 exit pack completes only with all tasks, all long listenings and substantial recordings for every speaking task", () => {
  const state = cloneState();
  submitAllTasks(state);
  state.completedActivityIds.push(...c1ExitListening.map((block) => `c1-exit-listening-${block.id}`));
  state.speakingRecords = c1ExitSpeaking.map((exercise, index) => ({
    id: `c1-record-${index}`,
    lessonId: "c1-exit-assessment",
    prompt: exercise.prompt,
    durationSeconds: index === 2 ? 420 : Math.max(60, Math.round((exercise.seconds ?? 120) * 0.65)),
    createdAt: new Date().toISOString(),
    selfRating: 4
  }));
  const status = c1ExitEvidenceStatus(state);
  assert.equal(status.listeningCompleted, status.listeningRequired);
  assert.equal(status.speakingRecorded, status.speakingRequired);
  assert.ok(status.longestSpeakingSeconds >= 360);
  assert.equal(status.complete, true);
});
