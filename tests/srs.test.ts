import test from "node:test";
import assert from "node:assert/strict";
import { createSrsItem, dueItems, scheduleReview } from "../src/lib/srs.ts";

test("failed SRS review resets interval and increments lapses", () => {
  const item = { ...createSrsItem("x", "ไทย", "English"), intervalDays: 8, repetitions: 3, ease: 2.4 };
  const next = scheduleReview(item, 1);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.repetitions, 0);
  assert.equal(next.lapses, 1);
});

test("successful review expands after repeated retrieval", () => {
  const item = { ...createSrsItem("x", "ไทย", "English"), intervalDays: 3, repetitions: 2, ease: 2 };
  const next = scheduleReview(item, 4);
  assert.equal(next.repetitions, 3);
  assert.equal(next.intervalDays, 6);
});

test("dueItems returns only due cards", () => {
  const now = new Date("2026-08-19T00:00:00Z");
  const a = { ...createSrsItem("a", "a", "A"), id: "a", dueAt: "2026-08-18T00:00:00Z" };
  const b = { ...createSrsItem("b", "b", "B"), id: "b", dueAt: "2026-08-20T00:00:00Z" };
  assert.deepEqual(dueItems([b, a], now).map((x) => x.id), ["a"]);
});
