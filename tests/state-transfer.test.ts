import test from "node:test";
import assert from "node:assert/strict";
import { BACKUP_FORMAT, BACKUP_VERSION, createLearnerBackup, parseLearnerBackup, serializeLearnerBackup } from "../src/lib/state-transfer.ts";
import { defaultState, migrateLearnerState } from "../src/lib/storage.ts";

test("backup export round-trips learner progress", () => {
  const state = structuredClone(defaultState);
  state.xp = 1234;
  state.completedLessonIds = ["day-1", "day-2"];
  state.skillEstimates.speaking = { level: "A2", progress: 44 };
  const raw = serializeLearnerBackup(state, [], new Date("2026-08-19T12:00:00.000Z"));
  const restored = parseLearnerBackup(raw);
  assert.equal(restored.state.xp, 1234);
  assert.deepEqual(restored.state.completedLessonIds, ["day-1", "day-2"]);
  assert.deepEqual(restored.state.skillEstimates.speaking, { level: "A2", progress: 44 });
  assert.deepEqual(restored.recordings, []);
});

test("backup creation drops speaking metadata whose audio blob is missing", () => {
  const state = structuredClone(defaultState);
  state.speakingRecords = [{
    id: "recording-present",
    lessonId: "day-1",
    prompt: "Speak",
    durationSeconds: 20,
    createdAt: "2026-08-19T00:00:00.000Z",
    selfRating: 3
  }, {
    id: "recording-missing",
    lessonId: "day-1",
    prompt: "Speak again",
    durationSeconds: 30,
    createdAt: "2026-08-19T00:01:00.000Z",
    selfRating: 3
  }];
  const backup = createLearnerBackup(state, [{ id: "recording-present", mimeType: "audio/webm", base64: "AA==" }]);
  assert.deepEqual(backup.state.speakingRecords.map((record) => record.id), ["recording-present"]);
});

test("backup parser rejects ordinary JSON that is not an app backup", () => {
  assert.throws(() => parseLearnerBackup(JSON.stringify({ hello: "world" })), /not an English C1 Accelerator backup/);
});

test("backup parser rejects invalid learner state instead of silently resetting", () => {
  const raw = JSON.stringify({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: "2026-08-19T12:00:00.000Z",
    state: { completedLessonIds: "not-an-array" },
    recordings: []
  });
  assert.throws(() => parseLearnerBackup(raw), /completedLessonIds must be an array/);
});

test("backup parser rejects speaking evidence without its audio file", () => {
  const state = structuredClone(defaultState);
  state.speakingRecords = [{
    id: "missing-audio",
    lessonId: "day-1",
    prompt: "Speak",
    durationSeconds: 20,
    createdAt: "2026-08-19T00:00:00.000Z",
    selfRating: 3
  }];
  const raw = JSON.stringify({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: "2026-08-19T12:00:00.000Z",
    state,
    recordings: []
  });
  assert.throws(() => parseLearnerBackup(raw), /missing 1 speaking recording/);
});

test("backup parser rejects duplicate audio recording ids", () => {
  const raw = JSON.stringify({
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: "2026-08-19T12:00:00.000Z",
    state: defaultState,
    recordings: [
      { id: "dup", mimeType: "audio/webm", base64: "AA==" },
      { id: "dup", mimeType: "audio/webm", base64: "AA==" }
    ]
  });
  assert.throws(() => parseLearnerBackup(raw), /duplicate recording ids/);
});

test("state migration rejects impossible CEFR progress", () => {
  assert.throws(() => migrateLearnerState({ skillEstimates: { speaking: { level: "A2", progress: 101 } } }), /progress must be <= 100/);
});

test("state migration rejects unknown CEFR labels", () => {
  assert.throws(() => migrateLearnerState({ skillEstimates: { speaking: { level: "Z9", progress: 20 } } }), /level is invalid/);
});

test("legacy fractional Error Bank mastery is normalized during import", () => {
  const state = migrateLearnerState({
    errorBank: [{
      id: "legacy-error",
      original: "I do it yesterday.",
      corrected: "I did it yesterday.",
      category: "Past Simple",
      explanationThai: "Past tense",
      severity: "high",
      firstSeenAt: "2026-08-01T00:00:00.000Z",
      lastSeenAt: "2026-08-01T00:00:00.000Z",
      recurrenceCount: 1,
      masteryScore: 0.7
    }]
  });
  assert.equal(state.errorBank[0].masteryScore, 70);
});
