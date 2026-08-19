import test from "node:test";
import assert from "node:assert/strict";
import { adaptivePrescription, checkpointPass, readinessReport } from "../src/lib/adaptive.ts";
import { defaultState } from "../src/lib/storage.ts";
import type { CheckpointAttempt, LearnerState } from "../src/lib/types.ts";

function cloneState(): LearnerState {
  return structuredClone(defaultState);
}

test("personalized prescription keeps speaking above grammar recognition for this learner", () => {
  const prescription = adaptivePrescription(cloneState(), 1, 165);
  assert.ok(prescription.minutesBySkill.speaking > prescription.minutesBySkill.grammarRecognition);
  assert.ok(prescription.priorities.some((item) => item.includes("passive grammar")));
});

test("C1 checkpoint rubric has a strict floor", () => {
  const strong: CheckpointAttempt["scores"] = {
    speaking: 4.5,
    listening: 4.4,
    reading: 4.3,
    writing: 4.2,
    languageUse: 4.2,
    interaction: 4.4
  };
  const weakWriting = { ...strong, writing: 3.5 };
  assert.equal(checkpointPass(strong, "C1"), true);
  assert.equal(checkpointPass(weakWriting, "C1"), false);
});

test("course hours alone never produce C1 readiness", () => {
  const state = cloneState();
  state.evidence.structuredMinutes = 700 * 60;
  state.evidence.listeningAtNormalSpeedMinutes = 3000;
  const report = readinessReport(state, "C1");
  assert.equal(report.ready, false);
  assert.ok(report.blockers.some((blocker) => blocker.includes("integrated checkpoint")));
});

test("C1 self-rating alone is not accepted as independent final validation", () => {
  const state = cloneState();
  for (const skill of ["speaking", "listening", "reading", "writing"] as const) state.skillEstimates[skill] = { level: "C1", progress: 20 };
  state.skillEstimates.grammarProduction = { level: "C1-", progress: 20 };
  state.skillEstimates.vocabulary = { level: "C1-", progress: 20 };
  state.skillEstimates.pronunciation = { level: "B2+", progress: 20 };
  state.evidence.structuredMinutes = 600 * 60;
  state.evidence.listeningAtNormalSpeedMinutes = 2500;
  state.speakingRecords = [{
    id: "s1",
    lessonId: "ext-day-224",
    prompt: "C1 discussion",
    durationSeconds: 480,
    createdAt: new Date().toISOString(),
    selfRating: 4
  }];
  state.checkpointAttempts = [{
    id: "c1-self",
    level: "C1",
    createdAt: new Date().toISOString(),
    evaluator: "self",
    passed: true,
    scores: { speaking: 4.5, listening: 4.5, reading: 4.5, writing: 4.5, languageUse: 4.5, interaction: 4.5 }
  }];
  const report = readinessReport(state, "C1");
  assert.equal(report.ready, false);
  assert.ok(report.blockers.some((blocker) => blocker.includes("Independent C1 validation")));
});


test("C1 teacher label without evaluator identity is not accepted as independent validation", () => {
  const state = cloneState();
  for (const skill of ["speaking", "listening", "reading", "writing"] as const) state.skillEstimates[skill] = { level: "C1", progress: 20 };
  state.skillEstimates.grammarProduction = { level: "C1-", progress: 20 };
  state.skillEstimates.vocabulary = { level: "C1-", progress: 20 };
  state.skillEstimates.pronunciation = { level: "B2+", progress: 20 };
  state.evidence.structuredMinutes = 600 * 60;
  state.evidence.listeningAtNormalSpeedMinutes = 2500;
  state.speakingRecords = [{ id: "s2", lessonId: "c1-exit-assessment", prompt: "C1 discussion", durationSeconds: 480, createdAt: new Date().toISOString(), selfRating: 4 }];
  state.checkpointAttempts = [{
    id: "c1-unnamed",
    level: "C1",
    createdAt: new Date().toISOString(),
    evaluator: "teacher",
    passed: true,
    scores: { speaking: 4.5, listening: 4.5, reading: 4.5, writing: 4.5, languageUse: 4.5, interaction: 4.5 }
  }];
  const report = readinessReport(state, "C1");
  assert.equal(report.ready, false);
  assert.ok(report.blockers.some((blocker) => blocker.includes("Independent C1 validation")));
});

test("a valid independent C1 pass remains the readiness evidence even after later self-practice", () => {
  const state = cloneState();
  for (const skill of ["speaking", "listening", "reading", "writing"] as const) state.skillEstimates[skill] = { level: "C1", progress: 20 };
  state.skillEstimates.grammarProduction = { level: "C1-", progress: 20 };
  state.skillEstimates.vocabulary = { level: "C1-", progress: 20 };
  state.skillEstimates.pronunciation = { level: "B2+", progress: 20 };
  state.evidence.structuredMinutes = 600 * 60;
  state.evidence.listeningAtNormalSpeedMinutes = 2500;
  state.speakingRecords = [{ id: "s3", lessonId: "c1-exit-assessment", prompt: "C1 discussion", durationSeconds: 480, createdAt: new Date().toISOString(), selfRating: 4 }];
  state.checkpointAttempts = [
    {
      id: "later-self-practice",
      level: "C1",
      createdAt: new Date(Date.now() + 1000).toISOString(),
      evaluator: "self",
      passed: false,
      scores: { speaking: 3.5, listening: 3.5, reading: 3.5, writing: 3.5, languageUse: 3.5, interaction: 3.5 }
    },
    {
      id: "independent-pass",
      level: "C1",
      createdAt: new Date().toISOString(),
      evaluator: "teacher",
      evaluatorName: "Independent assessor",
      passed: true,
      scores: { speaking: 4.5, listening: 4.4, reading: 4.4, writing: 4.3, languageUse: 4.3, interaction: 4.4 }
    }
  ];
  const report = readinessReport(state, "C1");
  assert.equal(report.latestCheckpoint?.id, "independent-pass");
  assert.equal(report.blockers.some((blocker) => blocker.includes("Independent C1 validation")), false);
});
