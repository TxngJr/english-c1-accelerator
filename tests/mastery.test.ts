import test from "node:test";
import assert from "node:assert/strict";
import { checkExerciseAnswer, normalizeAnswer } from "../src/lib/mastery.ts";

test("normalizeAnswer ignores case, final punctuation and repeated spaces", () => {
  assert.equal(normalizeAnswer("  I   study English. "), "i study english");
});

test("exact production answer can be checked", () => {
  assert.equal(checkExerciseAnswer({
    id: "x",
    type: "thai-to-english",
    prompt: "ฉันเขียนโค้ดได้",
    answer: "I can write code.",
    targetSkill: "grammarProduction"
  }, "i can write code"), true);
});

test("accepted natural alternatives are supported", () => {
  assert.equal(checkExerciseAnswer({
    id: "x",
    type: "error-correction",
    prompt: "Fix it",
    acceptedAnswers: ["I'm learning English.", "I'm trying to improve my English."],
    targetSkill: "grammarProduction"
  }, "I'm trying to improve my English!"), true);
});

import { canCompleteLesson, lessonExerciseIds } from "../src/lib/mastery.ts";
import { extendedLessons } from "../src/content/extended-lessons.ts";
import { defaultState } from "../src/lib/storage.ts";

test("extended lesson completion requires real recorded speaking evidence", () => {
  const lesson = extendedLessons[0];
  const state = structuredClone(defaultState);
  for (const id of lessonExerciseIds(lesson)) {
    state.exerciseResults[id] = { correct: true, score: 1, answer: "completed", answeredAt: new Date().toISOString() };
  }
  assert.equal(canCompleteLesson(state, lesson), false);
  state.speakingRecords.push({
    id: "rec",
    lessonId: lesson.id,
    prompt: lesson.speaking[0].prompt,
    durationSeconds: 30,
    createdAt: new Date().toISOString(),
    selfRating: 3
  });
  assert.equal(canCompleteLesson(state, lesson), true);
});

test("open responses do not inflate measured lesson accuracy", async () => {
  const { lessonAccuracy, isObjectivelyScoredExercise } = await import("../src/lib/mastery.ts");
  const lesson = extendedLessons[0];
  const state = structuredClone(defaultState);
  const exercises = [
    ...lesson.warmup.flatMap((activity) => activity.exercises ?? []),
    ...lesson.grammar.flatMap((activity) => activity.exercises ?? []),
    ...lesson.listening.flatMap((block) => block.detailQuestions),
    ...lesson.speaking,
    ...(lesson.reading?.flatMap((block) => block.questions) ?? []),
    ...(lesson.writing ?? []),
    ...lesson.review,
    ...lesson.exitCheck
  ];
  for (const exercise of exercises.filter((item) => !isObjectivelyScoredExercise(item))) {
    state.exerciseResults[exercise.id] = { correct: true, score: 1, answer: "anything", answeredAt: new Date().toISOString() };
  }
  assert.equal(lessonAccuracy(state, lesson), 0);
});

test("a real-world mission must be explicitly completed before the lesson unlocks", () => {
  const lesson = extendedLessons.find((item) => item.realWorldMission)!;
  const state = structuredClone(defaultState);
  for (const id of lessonExerciseIds(lesson)) {
    state.exerciseResults[id] = { correct: true, score: 1, answer: "completed", answeredAt: new Date().toISOString() };
  }
  state.speakingRecords.push({
    id: "mission-rec",
    lessonId: lesson.id,
    prompt: lesson.speaking[0].prompt,
    durationSeconds: 180,
    createdAt: new Date().toISOString(),
    selfRating: 3
  });
  assert.equal(canCompleteLesson(state, lesson), false);
  state.completedActivityIds.push(`${lesson.id}-mission`);
  assert.equal(canCompleteLesson(state, lesson), true);
});
