import test from "node:test";
import assert from "node:assert/strict";
import {
  aiBaseUrl,
  chooseStrongestKmitlModel,
  extractChatCompletionText,
  modelCapabilityScore,
  withModelPrefix
} from "../src/lib/ai-provider.ts";

test("KMITL base URL normalization removes trailing slashes", () => {
  assert.equal(aiBaseUrl("https://api.ai.kmitl.ac.th/v1///"), "https://api.ai.kmitl.ac.th/v1");
});

test("explicit KMITL models receive openrouter prefix exactly once", () => {
  assert.equal(withModelPrefix("x-ai/grok-4.6", "openrouter/"), "openrouter/x-ai/grok-4.6");
  assert.equal(withModelPrefix("openrouter/moonshot/kimi-k3", "openrouter/"), "openrouter/moonshot/kimi-k3");
});

test("teacher-recommended KMITL models prefer Grok 4.6 for maximum capability", () => {
  const selected = chooseStrongestKmitlModel([
    { id: "openrouter/deepseek/deepseek-v4-flash", name: "Deepseek v4 Flash" },
    { id: "openrouter/moonshot/kimi-k3", name: "Kimi K3" },
    { id: "openrouter/x-ai/grok-4.6", name: "Grok 4.6" }
  ]);
  assert.equal(selected, "openrouter/x-ai/grok-4.6");
});

test("strongest-model discovery only selects models actually returned by KMITL", () => {
  const selected = chooseStrongestKmitlModel([
    { id: "openrouter/deepseek/deepseek-v4-pro", name: "Deepseek V4 Pro" },
    { id: "openrouter/moonshot/kimi-k3", name: "Kimi K3" }
  ]);
  assert.equal(selected, "openrouter/moonshot/kimi-k3");
});

test("capability table can prefer a stronger frontier model when KMITL exposes it", () => {
  assert.ok(
    modelCapabilityScore({ id: "openrouter/openai/gpt-5.6-sol" }) >
      modelCapabilityScore({ id: "openrouter/x-ai/grok-4.6" })
  );
  assert.ok(
    modelCapabilityScore({ id: "openrouter/x-ai/grok-4.6" }) >
      modelCapabilityScore({ id: "openrouter/deepseek/deepseek-v4-flash" })
  );
});

test("unknown model ids are not guessed as strongest", () => {
  assert.equal(chooseStrongestKmitlModel([{ id: "openrouter/vendor/new-model" }]), undefined);
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
