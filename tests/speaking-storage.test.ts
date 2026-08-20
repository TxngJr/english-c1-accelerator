import test from "node:test";
import assert from "node:assert/strict";
import { defaultState, migrateLearnerState } from "../src/lib/storage.ts";

test("valid reviewed transcript evidence survives learner-state migration", () => {
  const state = structuredClone(defaultState);
  state.speakingRecords = [{
    id: "coach-1",
    lessonId: "speaking-coach",
    prompt: "Explain a tradeoff",
    durationSeconds: 180,
    createdAt: "2026-08-20T00:00:00.000Z",
    selfRating: 4,
    transcript: "I would distinguish between speed and reliability because the faster option creates a different operational risk.",
    transcriptSource: "openai",
    transcriptVerified: true,
    speakingMetrics: {
      wordCount: 16,
      wordsPerMinute: 90,
      uniqueWordRatio: 0.8,
      fillerCount: 0,
      fillerRatePer100Words: 0,
      discourseMarkerCount: 1,
      selfRepairCount: 0,
      repeatedWordCount: 0,
      averageSentenceWords: 16
    }
  }];

  const migrated = migrateLearnerState(state);
  assert.equal(migrated.speakingRecords[0]?.transcriptVerified, true);
  assert.equal(migrated.speakingRecords[0]?.transcriptSource, "openai");
});

test("malformed transcript data is rejected instead of crashing readiness later", () => {
  const state = structuredClone(defaultState) as unknown as Record<string, unknown>;
  state.speakingRecords = [{
    id: "bad",
    lessonId: "speaking-coach",
    prompt: "bad",
    durationSeconds: 100,
    createdAt: "2026-08-20T00:00:00.000Z",
    selfRating: 3,
    transcript: 12345,
    transcriptVerified: true
  }];

  assert.throws(() => migrateLearnerState(state), /transcript must be a string/);
});
