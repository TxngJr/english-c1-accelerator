import test from "node:test";
import assert from "node:assert/strict";
import { localLessonTutorReply, parseLessonTutorReply } from "../src/lib/lesson-tutor.ts";

test("lesson tutor parser accepts valid structured reply", () => {
  const parsed = parseLessonTutorReply(JSON.stringify({
    message: "Explain your position and give one example.",
    coachingNote: "Do not restart after small mistakes.",
    targetSkill: "speaking",
    action: "speak",
    hideTranscript: false,
    suggestedSeconds: 90
  }));
  assert.equal(parsed?.action, "speak");
  assert.equal(parsed?.targetSkill, "speaking");
  assert.equal(parsed?.suggestedSeconds, 90);
});

test("lesson tutor parser rejects empty AI payload", () => {
  assert.equal(parseLessonTutorReply('{"message":""}'), undefined);
});

test("listening fallback hides transcript and asks for listening", () => {
  const reply = localLessonTutorReply({
    mode: "listening",
    level: "B1",
    lessonTitle: "Explaining a project",
    focus: "cause and effect",
    turnIndex: 0
  });
  assert.equal(reply.action, "listen");
  assert.equal(reply.hideTranscript, true);
  assert.equal(reply.targetSkill, "listening");
});

test("integrated fallback rotates the four macro skills", () => {
  const actions = Array.from({ length: 4 }, (_, turnIndex) => localLessonTutorReply({
    mode: "integrated",
    level: "B2",
    lessonTitle: "Tradeoffs",
    focus: "qualification",
    turnIndex
  }).action);
  assert.deepEqual(actions, ["listen", "speak", "read", "write"]);
});

test("C1 speaking fallback creates extended spontaneous pressure", () => {
  const reply = localLessonTutorReply({
    mode: "speaking",
    level: "C1",
    lessonTitle: "Nuance and stance",
    focus: "qualification",
    turnIndex: 1,
    learnerMessage: "I think this depends on the audience."
  });
  assert.equal(reply.action, "speak");
  assert.equal(reply.suggestedSeconds, 240);
  assert.match(reply.message, /limitation|exception/i);
});