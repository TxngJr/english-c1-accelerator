import test from "node:test";
import assert from "node:assert/strict";
import { createSrsItem, dueItems, masteredSrsCount, scheduleReview } from "../src/lib/srs.ts";

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

test("slow responses shorten the next interval when a speed baseline exists", () => {
  const item = {
    ...createSrsItem("x", "ไทย", "English"),
    intervalDays: 10,
    repetitions: 3,
    ease: 2,
    averageResponseMs: 1000
  };
  const next = scheduleReview(item, 4, 2500);
  assert.equal(next.intervalDays, 15);
  assert.ok((next.averageResponseMs ?? 0) > 1000);
});

test("dueItems returns only due cards", () => {
  const now = new Date("2026-08-19T00:00:00Z");
  const a = { ...createSrsItem("a", "a", "A"), id: "a", dueAt: "2026-08-18T00:00:00Z" };
  const b = { ...createSrsItem("b", "b", "B"), id: "b", dueAt: "2026-08-20T00:00:00Z" };
  assert.deepEqual(dueItems([b, a], now).map((x) => x.id), ["a"]);
});

test("mastered count is derived from unique retained sources instead of mutable points", () => {
  const mastered = { ...createSrsItem("same-source", "ไทย", "English"), repetitions: 3, confidence: 0.8 };
  const duplicate = { ...mastered, id: "duplicate" };
  const learning = { ...createSrsItem("learning", "ไทย", "English"), repetitions: 2, confidence: 1 };
  assert.equal(masteredSrsCount([mastered, duplicate, learning]), 1);
});

test("SRS items can be created for production directions beyond Thai to English", () => {
  const item = createSrsItem("speak-1", "Explain this aloud", "target chunk", "speak");
  assert.equal(item.direction, "speak");
});
