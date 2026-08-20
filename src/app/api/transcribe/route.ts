import { NextResponse } from "next/server";
import { aiApiKey, aiBaseUrl, withModelPrefix } from "@/lib/ai-provider";

export const runtime = "nodejs";

const MAX_AUDIO_BYTES = 20 * 1024 * 1024;
const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/flac",
  "audio/m4a",
  "audio/mp3",
  "audio/mp4",
  "audio/mpeg",
  "audio/mpga",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "video/mp4"
]);

function baseMimeType(type: string): string {
  return type.toLowerCase().split(";")[0].trim();
}

export async function POST(request: Request) {
  const apiKey = aiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Cloud transcription is not configured. Set AI_API_KEY in .env.local. Browser speech recognition and manual transcript correction remain available.",
        code: "transcription_not_configured"
      },
      { status: 503 }
    );
  }

  const configuredModel = process.env.AI_TRANSCRIPTION_MODEL?.trim();
  if (!configuredModel) {
    return NextResponse.json(
      {
        error: "No cloud transcription model is configured for the KMITL gateway. Set AI_TRANSCRIPTION_MODEL only if your KMITL account exposes a model compatible with /audio/transcriptions. Browser STT remains available.",
        code: "transcription_model_not_configured"
      },
      { status: 503 }
    );
  }

  let input: FormData;
  try {
    input = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart form data." }, { status: 400 });
  }

  const audio = input.get("file");
  if (!(audio instanceof File)) {
    return NextResponse.json({ error: "An audio file is required." }, { status: 400 });
  }
  if (audio.size <= 0) {
    return NextResponse.json({ error: "The audio file is empty." }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json({ error: "The audio file is too large. Keep each speaking sample below 20 MB." }, { status: 413 });
  }

  const mime = baseMimeType(audio.type || "audio/webm");
  if (!SUPPORTED_AUDIO_TYPES.has(mime)) {
    return NextResponse.json({ error: `Unsupported audio type: ${mime || "unknown"}.` }, { status: 415 });
  }

  const baseUrl = aiBaseUrl();
  const model = withModelPrefix(configuredModel);
  const upstream = new FormData();
  upstream.append("file", audio, audio.name || "speaking-sample.webm");
  upstream.append("model", model);
  upstream.append("language", "en");
  upstream.append(
    "prompt",
    "English learner speaking practice. Transcribe what was actually spoken in English. Preserve meaningful repetitions, self-repairs, and common fillers such as um, uh, erm, and you know when they are audible. Do not silently rewrite grammar into more correct English."
  );

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/audio/transcriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: upstream,
      cache: "no-store"
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the configured KMITL-compatible transcription service." }, { status: 502 });
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const code = response.status === 404 || response.status === 405
      ? "transcription_endpoint_unsupported"
      : "transcription_failed";
    return NextResponse.json(
      {
        error: code === "transcription_endpoint_unsupported"
          ? "The configured KMITL gateway does not expose a compatible /audio/transcriptions endpoint for this model. Use Browser STT/manual transcript instead."
          : "Transcription failed.",
        code,
        detail: detail.slice(0, 500) || `Upstream status ${response.status}.`
      },
      { status: 502 }
    );
  }

  const data = await response.json() as { text?: unknown };
  const text = typeof data.text === "string" ? data.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "The transcription service returned no text." }, { status: 502 });
  }

  return NextResponse.json({ text, source: "kmitl" as const, model });
}
