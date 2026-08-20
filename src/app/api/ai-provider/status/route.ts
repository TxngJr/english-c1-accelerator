import { NextResponse } from "next/server";
import { aiApiKey, aiBaseUrl, resolveChatModel } from "@/lib/ai-provider";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = aiApiKey();
  const baseUrl = aiBaseUrl();

  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      provider: "kmitl-openai-compatible",
      baseUrl,
      model: null,
      message: "KMITL AI is not configured. Browser/local learning features remain available."
    });
  }

  const explicitModel = process.env.AI_CHAT_MODEL?.trim();
  const model = await resolveChatModel(apiKey, baseUrl, explicitModel);

  return NextResponse.json({
    configured: true,
    provider: "kmitl-openai-compatible",
    baseUrl,
    model: model ?? null,
    selection: explicitModel ? "explicit" : "strongest-available",
    ready: Boolean(model),
    message: model
      ? `KMITL AI ready with ${model}.`
      : "The token is configured, but no ranked compatible chat model could be selected. Set AI_CHAT_MODEL to an exact id returned by KMITL /models."
  });
}
