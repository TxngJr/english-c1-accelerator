import test from "node:test";
import assert from "node:assert/strict";
import { upsertError } from "../src/lib/errors.ts";

test("Error Bank creates a new recurring error record", () => {
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
});

test("same error pattern increments recurrence", () => {
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
});
