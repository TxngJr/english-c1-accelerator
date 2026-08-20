import test from "node:test";
import assert from "node:assert/strict";
import {
  isAuditableTranscribedSpeakingRecord,
  isReadinessSpeakingRecord,
  longestReadinessSpeakingSeconds,
  longestTranscribedReadinessSpeakingSeconds,
  transcribedReadinessSpeakingCount
} from "../src/lib/speaking-evidence.ts";
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

function transcribedRecord(seconds: number, reviewed = true): SpeakingRecord {
  return {
    ...record("speaking-coach", seconds),
    transcript: Array.from({ length: Math.max(100, Math.ceil(seconds * 0.8)) }, (_, index) => `word${index % 20}`).join(" "),
    transcriptSource: "browser",
    transcriptVerified: reviewed
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

test("advanced transcript evidence requires a reviewed auditable transcript", () => {
  const reviewed = transcribedRecord(180, true);
  const unreviewed = transcribedRecord(240, false);
  const tooShort = transcribedRecord(30, true);

  assert.equal(isAuditableTranscribedSpeakingRecord(reviewed, 120), true);
  assert.equal(isAuditableTranscribedSpeakingRecord(unreviewed, 120), false);
  assert.equal(isAuditableTranscribedSpeakingRecord(tooShort, 120), false);
  assert.equal(transcribedReadinessSpeakingCount([reviewed, unreviewed, tooShort], 120), 1);
  assert.equal(longestTranscribedReadinessSpeakingSeconds([reviewed, unreviewed]), 180);
});
