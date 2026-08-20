import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../src/app/api/lesson-tutor/route.ts";
import type { LessonTutorReply } from "../src/lib/lesson-tutor.ts";

type TutorRoutePayload = {
  reply?: LessonTutorReply;
  source?: string;
  reason?: string;
  error?: string;
};

function request(body: unknown) {
  return new Request("http://localhost/api/lesson-tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

test("lesson tutor rejects unknown lesson ids instead of silently using Day 1", async () => {
  const previous = process.env.AI_API_KEY;
  process.env.AI_API_KEY = "";
  try {
    const response = await POST(request({ lessonId: "not-a-real-lesson", mode: "integrated" }));
    const payload = await response.json() as TutorRoutePayload;
    assert.equal(response.status, 400);
    assert.match(payload.error ?? "", /Unknown lesson/i);
  } finally {
    if (previous === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = previous;
  }
});

test("local tutor API starts integrated practice with listen-first hidden transcript", async () => {
  const previous = process.env.AI_API_KEY;
  process.env.AI_API_KEY = "";
  try {
    const response = await POST(request({
      lessonId: "day-1",
      mode: "integrated",
      history: [],
      message: ""
    }));
    const payload = await response.json() as TutorRoutePayload;
    assert.equal(response.status, 200);
    assert.equal(payload.source, "local");
    assert.equal(payload.reply?.action, "listen");
    assert.equal(payload.reply?.hideTranscript, true);
  } finally {
    if (previous === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = previous;
  }
});

test("integrated API advances to speaking after the learner answers the listening turn", async () => {
  const previous = process.env.AI_API_KEY;
  process.env.AI_API_KEY = "";
  try {
    const response = await POST(request({
      lessonId: "day-1",
      mode: "integrated",
      history: [{ role: "assistant", content: "Listen first and answer the question." }],
      message: "I think the main point is that regular practice makes retrieval faster."
    }));
    const payload = await response.json() as TutorRoutePayload;
    assert.equal(payload.reply?.action, "speak");
    assert.equal(payload.reply?.targetSkill, "speaking");
  } finally {
    if (previous === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = previous;
  }
});