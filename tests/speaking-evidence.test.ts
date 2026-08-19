import test from "node:test";
import assert from "node:assert/strict";
import { isReadinessSpeakingRecord, longestReadinessSpeakingSeconds } from "../src/lib/speaking-evidence.ts";
import type { SpeakingRecord } from "../src/lib/types.ts";

function record(lessonId: string, seconds: number): SpeakingRecord {
  return {
    id: `${lessonId}-${seconds}`,
    lessonId,
    prompt: "Test prompt",
    durationSeconds: seconds,
    createdAt: "2026-08-19T00:00:00.000Z",
    selfRating: 3
  };
}

test("pronunciation and baseline recordings cannot inflate CEFR speaking duration", () => {
  assert.equal(isReadinessSpeakingRecord(record("pronunciation", 600)), false);
  assert.equal(isReadinessSpeakingRecord(record("baseline-retest", 600)), false);
  assert.equal(isReadinessSpeakingRecord(record("ext-day-120", 180)), true);
  assert.equal(longestReadinessSpeakingSeconds([
    record("pronunciation", 600),
    record("baseline-retest", 500),
    record("ext-day-120", 180)
  ]), 180);
});
