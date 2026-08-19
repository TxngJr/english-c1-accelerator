import test from "node:test";
import assert from "node:assert/strict";
import {
  bumpSkillEstimate,
  canCompleteLesson,
  canStartLesson,
  checkExerciseAnswer,
  isObjectivelyScoredExercise,
  lessonAccuracy,
  lessonExerciseIds,
  normalizeAnswer
} from "../src/lib/mastery.ts";
import { extendedLessons } from "../src/content/extended-lessons.ts";
import { defaultState } from "../src/lib/storage.ts";
import type { LearnerState, Lesson } from "../src/lib/types.ts";

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

function cloneState(): LearnerState {
  return structuredClone(defaultState);
}

function attemptAllExercises(state: LearnerState, lesson: Lesson) {
  for (const id of lessonExerciseIds(lesson)) {
    state.exerciseResults[id] = { correct: true, score: 1, answer: "completed", answeredAt: new Date().toISOString() };
  }
}

function satisfyPrerequisites(state: LearnerState, lesson: Lesson) {
  state.completedLessonIds.push(...lesson.prerequisites.filter((id) => !state.completedLessonIds.includes(id)));
}

function satisfyListening(state: LearnerState, lesson: Lesson) {
  for (const block of lesson.listening) {
    state.completedActivityIds.push(`${lesson.id}-listening-${block.id}`);
  }
}

function satisfySpeaking(state: LearnerState, lesson: Lesson, seconds = 240) {
  state.speakingRecords.push({
    id: `rec-${lesson.id}`,
    lessonId: lesson.id,
    prompt: lesson.speaking[0]?.prompt ?? "speaking evidence",
    durationSeconds: seconds,
    createdAt: new Date().toISOString(),
    selfRating: 3
  });
}

test("extended lesson completion requires real recorded speaking evidence", () => {
  const lesson = extendedLessons.find((item) => !item.realWorldMission)!;
  const state = cloneState();
  attemptAllExercises(state, lesson);
  satisfyPrerequisites(state, lesson);
  satisfyListening(state, lesson);
  assert.equal(canCompleteLesson(state, lesson), false);
  satisfySpeaking(state, lesson);
  assert.equal(canCompleteLesson(state, lesson), true);
});

test("open responses do not inflate measured lesson accuracy", () => {
  const lesson = extendedLessons[0];
  const state = cloneState();
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
  const state = cloneState();
  attemptAllExercises(state, lesson);
  satisfyPrerequisites(state, lesson);
  satisfyListening(state, lesson);
  satisfySpeaking(state, lesson);
  assert.equal(canCompleteLesson(state, lesson), false);
  state.completedActivityIds.push(`${lesson.id}-mission`);
  assert.equal(canCompleteLesson(state, lesson), true);
});

test("lesson prerequisites are enforced by the domain gate", () => {
  const lesson = extendedLessons.find((item) => item.prerequisites.length > 0 && !item.realWorldMission)!;
  const state = cloneState();
  attemptAllExercises(state, lesson);
  satisfyListening(state, lesson);
  satisfySpeaking(state, lesson);
  assert.equal(canStartLesson(state, lesson), false);
  assert.equal(canCompleteLesson(state, lesson), false);

  satisfyPrerequisites(state, lesson);
  assert.equal(canStartLesson(state, lesson), true);
  assert.equal(canCompleteLesson(state, lesson), true);
});

test("lesson cannot complete until every listening block has actually finished", () => {
  const lesson = extendedLessons.find((item) => item.listening.length > 0 && !item.realWorldMission)!;
  const state = cloneState();
  attemptAllExercises(state, lesson);
  satisfyPrerequisites(state, lesson);
  satisfySpeaking(state, lesson);
  assert.equal(canCompleteLesson(state, lesson), false);

  satisfyListening(state, lesson);
  assert.equal(canCompleteLesson(state, lesson), true);
});

test("skill progress can roll past 99 percent into the next CEFR band", () => {
  let state = cloneState();
  state.skillEstimates.speaking = { level: "A1", progress: 99 };

  state = bumpSkillEstimate(state, "speaking", 1);
  assert.equal(state.skillEstimates.speaking.level, "A1");
  assert.equal(state.skillEstimates.speaking.progress, 99.7);

  state = bumpSkillEstimate(state, "speaking", 1);
  assert.equal(state.skillEstimates.speaking.level, "A1+");
  assert.equal(state.skillEstimates.speaking.progress, 0.4);
});
