import test from "node:test";
import assert from "node:assert/strict";
import { readinessReport } from "../src/lib/adaptive.ts";
import { defaultState } from "../src/lib/storage.ts";
import type { LearnerState, SpeakingRecord } from "../src/lib/types.ts";

function cloneState(): LearnerState {
  return structuredClone(defaultState);
}

function reviewedSample(id: string, seconds: number): SpeakingRecord {
  return {
    id,
    lessonId: "speaking-coach",
    prompt: "Extended speaking sample",
    durationSeconds: seconds,
    createdAt: "2026-08-20T00:00:00.000Z",
    selfRating: 4,
    transcript: Array.from({ length: Math.ceil(seconds * 0.8) }, (_, index) => `word${index % 40}`).join(" "),
    transcriptSource: "openai",
    transcriptVerified: true
  };
}

test("B2 readiness reports missing reviewed transcript samples even when a long audio record exists", () => {
  const state = cloneState();
  state.speakingRecords = [{
    id: "audio-only",
    lessonId: "ext-day-160",
    prompt: "B2 discussion",
    durationSeconds: 300,
    createdAt: "2026-08-20T00:00:00.000Z",
    selfRating: 4
  }];

  const report = readinessReport(state, "B2");
  assert.ok(report.blockers.some((blocker) => blocker.includes("Reviewed transcribed speaking samples")));
});

test("C1 transcript gates accept four reviewed extended samples including one six-minute sample", () => {
  const state = cloneState();
  state.speakingRecords = [
    reviewedSample("c1-1", 360),
    reviewedSample("c1-2", 180),
    reviewedSample("c1-3", 150),
    reviewedSample("c1-4", 140)
  ];

  const report = readinessReport(state, "C1");
  assert.equal(report.blockers.some((blocker) => blocker.includes("Reviewed transcribed speaking samples")), false);
  assert.equal(report.blockers.some((blocker) => blocker.includes("Long C1 speaking sample with reviewed transcript")), false);
});
