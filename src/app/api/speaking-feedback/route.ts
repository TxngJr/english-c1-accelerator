import { NextResponse } from "next/server";
import type { SpeakingAIFeedback, SpeakingMetrics } from "@/lib/types";

export const runtime = "nodejs";

const MAX_TRANSCRIPT_CHARS = 20_000;

function extractResponseText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const object = data as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ type?: unknown; text?: unknown }> }>;
  };
  if (typeof object.output_text === "string") return object.output_text;
  for (const item of object.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string").slice(0, 8);
}

function parseFeedback(text: string): SpeakingAIFeedback | undefined {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return undefined;
  }
  if (!parsed || typeof parsed !== "object") return undefined;
  const value = parsed as Record<string, unknown>;
  if (typeof value.overall !== "string" || typeof value.nextDrill !== "string") return undefined;
  const corrections = Array.isArray(value.corrections)
    ? value.corrections
        .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
        .map((item) => ({
          original: typeof item.original === "string" ? item.original : "",
          improved: typeof item.improved === "string" ? item.improved : "",
          reason: typeof item.reason === "string" ? item.reason : ""
        }))
        .filter((item) => item.original && item.improved)
        .slice(0, 8)
    : [];

  return {
    overall: value.overall,
    estimatedCeiling: typeof value.estimatedCeiling === "string" ? value.estimatedCeiling : undefined,
    grammar: asStringArray(value.grammar),
    vocabulary: asStringArray(value.vocabulary),
    coherence: asStringArray(value.coherence),
    fluency: asStringArray(value.fluency),
    corrections,
    nextDrill: value.nextDrill,
    limitation: typeof value.limitation === "string"
      ? value.limitation
      : "Transcript-only AI feedback cannot directly judge pronunciation, accent, stress, rhythm, or audio intelligibility."
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI feedback is not configured. Local speaking metrics still work without an API key.", code: "feedback_not_configured" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request." }, { status: 400 });
  }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const input = body as Record<string, unknown>;
  const transcript = typeof input.transcript === "string" ? input.transcript.trim() : "";
  const prompt = typeof input.prompt === "string" ? input.prompt.trim() : "";
  const level = typeof input.level === "string" ? input.level.trim() : "";
  const durationSeconds = typeof input.durationSeconds === "number" && Number.isFinite(input.durationSeconds)
    ? input.durationSeconds
    : 0;
  const metrics = input.metrics as SpeakingMetrics | undefined;

  if (!transcript) return NextResponse.json({ error: "Transcript is required." }, { status: 400 });
  if (transcript.length > MAX_TRANSCRIPT_CHARS) return NextResponse.json({ error: "Transcript is too large." }, { status: 413 });

  const evaluatorPrompt = `You are a rigorous CEFR-oriented English speaking coach for a Thai learner whose speaking is weaker than passive grammar recognition. Evaluate ONLY what can reasonably be inferred from the transcript and timing metadata. Do not pretend to judge pronunciation, accent, stress, rhythm, microphone quality, or listening ability from text. Do not award an official CEFR level or certification. Treat any estimated level as a ceiling suggested by this sample, not a verified level.

Target practice level: ${level || "unknown"}
Speaking task: ${prompt || "unspecified"}
Duration: ${Math.round(durationSeconds)} seconds
Local metrics: ${JSON.stringify(metrics ?? {})}
Transcript:
${transcript}

Return JSON only with this exact shape:
{
  "overall": "2-4 sentences describing the strongest evidence and biggest bottleneck",
  "estimatedCeiling": "e.g. B1/B2-ish ceiling from transcript only, or omit",
  "grammar": ["specific production observations"],
  "vocabulary": ["precision/collocation/range observations"],
  "coherence": ["organization, qualification, synthesis, reformulation observations"],
  "fluency": ["timing/filler/repetition observations based only on provided metrics/transcript"],
  "corrections": [{"original":"short exact learner phrase","improved":"natural improved phrase","reason":"brief reason"}],
  "nextDrill": "one concrete 5-15 minute drill for the next attempt",
  "limitation": "Transcript-only analysis cannot directly score pronunciation/accent/stress/rhythm/audio intelligibility."
}
Use no more than 8 items per array. Preserve the learner's intended meaning when correcting. Prioritize errors or habits that most limit spontaneous C1 communication.`;

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_FEEDBACK_MODEL?.trim() || "gpt-5.6-luna",
        input: evaluatorPrompt
      }),
      cache: "no-store"
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the AI feedback service." }, { status: 502 });
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return NextResponse.json(
      { error: "AI feedback failed.", detail: detail.slice(0, 500) || `Upstream status ${response.status}.` },
      { status: 502 }
    );
  }

  const raw = await response.json() as unknown;
  const text = extractResponseText(raw);
  const feedback = parseFeedback(text);
  if (!feedback) {
    return NextResponse.json({ error: "AI feedback returned an invalid response format." }, { status: 502 });
  }

  return NextResponse.json({ feedback });
}
