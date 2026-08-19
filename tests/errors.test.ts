import test from "node:test";
import assert from "node:assert/strict";
import { markErrorCorrect, normalizeErrorMasteryScore, upsertError } from "../src/lib/errors.ts";

test("Error Bank creates a new recurring error record on the 0-100 mastery scale", () => {
  const bank = upsertError([], {
    original: "I do my homework yesterday.",
    corrected: "I did my homework yesterday.",
    category: "Past Simple",
    explanationThai: "finished past time needs Past Simple",
    severity: "high",
    now: "2026-08-19T00:00:00Z"
  });
  assert.equal(bank.length, 1);
  assert.equal(bank[0].recurrenceCount, 1);
  assert.equal(bank[0].masteryScore, 20);
});

test("same error pattern increments recurrence and lowers mastery", () => {
  const first = upsertError([], {
    original: "I do my homework yesterday.",
    corrected: "I did my homework yesterday.",
    category: "Past Simple",
    explanationThai: "finished past time needs Past Simple",
    severity: "high",
    now: "2026-08-19T00:00:00Z"
  });
  const second = upsertError(first, {
    original: "I do my homework yesterday.",
    corrected: "I did my homework yesterday.",
    category: "Past Simple",
    explanationThai: "finished past time needs Past Simple",
    severity: "high",
    now: "2026-08-20T00:00:00Z"
  });
  assert.equal(second.length, 1);
  assert.equal(second[0].recurrenceCount, 2);
  assert.equal(second[0].masteryScore, 12);
});

test("legacy fractional mastery values migrate to the 0-100 scale", () => {
  assert.equal(normalizeErrorMasteryScore(0.2), 20);
  assert.equal(normalizeErrorMasteryScore(0.85), 85);
  assert.equal(normalizeErrorMasteryScore(15), 15);
});

test("correct error retrieval raises mastery and caps at 100", () => {
  const bank = [{
    id: "e1",
    original: "I do it yesterday.",
    corrected: "I did it yesterday.",
    category: "Past Simple",
    explanationThai: "Use Past Simple.",
    severity: "high" as const,
    firstSeenAt: "2026-08-19T00:00:00Z",
    lastSeenAt: "2026-08-19T00:00:00Z",
    recurrenceCount: 2,
    masteryScore: 95
  }];
  assert.equal(markErrorCorrect(bank, "e1")[0].masteryScore, 100);
});
