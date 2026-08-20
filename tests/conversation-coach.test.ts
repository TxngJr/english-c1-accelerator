import test from "node:test";
import assert from "node:assert/strict";
import { challengeTypesForLevel, localFollowUp, minimumConversationTurns } from "../src/lib/conversation-coach.ts";

test("A2 conversation pressure stays familiar and simple", () => {
  const types = challengeTypesForLevel("A2");
  assert.deepEqual(types, ["clarify", "example", "reason"]);
  assert.equal(types.includes("synthesize"), false);
  assert.equal(minimumConversationTurns("A2"), 3);
});

test("C1 conversation pressure includes qualification, reformulation, and synthesis", () => {
  const types = challengeTypesForLevel("C1");
  assert.ok(types.includes("counterargument"));
  assert.ok(types.includes("reformulate"));
  assert.ok(types.includes("qualify"));
  assert.ok(types.includes("synthesize"));
  assert.equal(minimumConversationTurns("C1"), 6);
});

test("local follow-ups cycle deterministically so practice works without a paid API", () => {
  const first = localFollowUp("B2", 0);
  const second = localFollowUp("B2", 1);
  assert.notEqual(first.type, second.type);
  assert.ok(first.question.length > 10);
  assert.ok(second.question.length > 10);
});
