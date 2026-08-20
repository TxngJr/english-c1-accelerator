import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeSpeakingTranscript,
  localSpeakingCoachFeedback,
  targetSimilarity,
  transcriptEvidenceIsAuditable,
  wordsInTranscript
} from "../src/lib/speaking-coach.ts";

test("speaking metrics compute rate, fillers, discourse markers, and repairs", () => {
  const transcript = "Um I think this approach is useful. However, the main limitation is cost. I mean, let me rephrase that: the benefit depends on the team. Therefore, I would test it first.";
  const metrics = analyzeSpeakingTranscript(transcript, 30);

  assert.equal(metrics.wordCount, wordsInTranscript(transcript).length);
  assert.ok(metrics.wordsPerMinute > 40);
  assert.ok(metrics.fillerCount >= 1);
  assert.ok(metrics.discourseMarkerCount >= 2);
  assert.ok(metrics.selfRepairCount >= 2);
});

test("C1 local feedback asks for reformulation when none appears", () => {
  const transcript = Array.from({ length: 150 }, (_, index) => index % 20 === 0 ? "however" : `idea${index % 30}`).join(" ");
  const metrics = analyzeSpeakingTranscript(transcript, 90);
  const feedback = localSpeakingCoachFeedback(metrics, "C1");
  assert.ok(feedback.some((item) => item.includes("reformulation")));
});

test("auditable transcript evidence rejects sparse audio-only style samples", () => {
  assert.equal(transcriptEvidenceIsAuditable("hello world", 120), false);
  const full = Array.from({ length: 100 }, () => "English").join(" ");
  assert.equal(transcriptEvidenceIsAuditable(full, 120), true);
});

test("target similarity is a bounded intelligibility aid rather than exact string matching", () => {
  assert.equal(targetSimilarity("I want to improve my English", "I want to improve my English"), 100);
  const partial = targetSimilarity("I want to improve my English", "I want improve English");
  assert.ok(partial > 50 && partial < 100);
});
