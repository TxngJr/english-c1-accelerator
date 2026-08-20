import { NextResponse } from "next/server";

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
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "High-accuracy cloud transcription is not configured. Browser speech recognition and manual transcript correction remain available.",
        code: "transcription_not_configured"
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

  const upstream = new FormData();
  upstream.append("file", audio, audio.name || "speaking-sample.webm");
  upstream.append("model", process.env.OPENAI_TRANSCRIPTION_MODEL?.trim() || "gpt-4o-mini-transcribe");
  upstream.append("language", "en");
  upstream.append(
    "prompt",
    "English learner speaking practice. Transcribe what was actually spoken in English. Preserve meaningful repetitions, self-repairs, and common fillers such as um, uh, erm, and you know when they are audible. Do not silently rewrite grammar into more correct English."
  );

  let response: Response;
  try {
    response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      body: upstream,
      cache: "no-store"
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the transcription service." }, { status: 502 });
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const safeDetail = detail.slice(0, 500);
    return NextResponse.json(
      { error: "Transcription failed.", detail: safeDetail || `Upstream status ${response.status}.` },
      { status: 502 }
    );
  }

  const data = await response.json() as { text?: unknown };
  const text = typeof data.text === "string" ? data.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "The transcription service returned no text." }, { status: 502 });
  }

  return NextResponse.json({ text, source: "openai" as const });
}
