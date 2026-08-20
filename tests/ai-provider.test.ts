import test from "node:test";
import assert from "node:assert/strict";
import {
  aiBaseUrl,
  chooseRecommendedKmitlModel,
  extractChatCompletionText,
  withModelPrefix
} from "../src/lib/ai-provider.ts";

test("KMITL base URL normalization removes trailing slashes", () => {
  assert.equal(aiBaseUrl("https://api.ai.kmitl.ac.th/v1///"), "https://api.ai.kmitl.ac.th/v1");
});

test("explicit KMITL models receive openrouter prefix exactly once", () => {
  assert.equal(withModelPrefix("deepseek/deepseek-v4-flash", "openrouter/"), "openrouter/deepseek/deepseek-v4-flash");
  assert.equal(withModelPrefix("openrouter/kimi/k3", "openrouter/"), "openrouter/kimi/k3");
});

test("recommended model discovery prefers Deepseek v4 Flash before Kimi and Grok", () => {
  const selected = chooseRecommendedKmitlModel([
    { id: "openrouter/x-ai/grok-4.6", name: "Grok 4.6" },
    { id: "openrouter/moonshot/kimi-k3", name: "Kimi K3" },
    { id: "openrouter/deepseek/deepseek-v4-flash", name: "Deepseek v4 Flash" }
  ]);
  assert.equal(selected, "openrouter/deepseek/deepseek-v4-flash");
});

test("chat completion parser accepts normal OpenAI-compatible content", () => {
  assert.equal(
    extractChatCompletionText({ choices: [{ message: { content: "  Follow-up question?  " } }] }),
    "Follow-up question?"
  );
});

test("chat completion parser also accepts content-part arrays", () => {
  assert.equal(
    extractChatCompletionText({ choices: [{ message: { content: [{ type: "text", text: "Hello" }, { type: "text", text: "world" }] } }] }),
    "Hello\nworld"
  );
});
