"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getAnyLesson } from "@/content/all-lessons";
import { AIProviderStatus } from "@/components/ai-provider-status";
import { loadState } from "@/lib/storage";
import {
  lessonTutorModes,
  localLessonTutorReply,
  type LessonTutorAction,
  type LessonTutorMode,
  type LessonTutorReply
} from "@/lib/lesson-tutor";
import type { CEFR, Lesson, LearnerState, Skill } from "@/lib/types";

type TutorContext = {
  lesson: Lesson;
  weakSkills: string[];
  recurringErrors: string[];
  audioRate: number;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  hidden?: boolean;
  revealed?: boolean;
  coachingNote?: string;
  action?: LessonTutorAction;
  suggestedSeconds?: number;
  suggestedWords?: number;
  source?: "kmitl" | "local";
  model?: string;
};

type TutorApiResponse = {
  reply?: LessonTutorReply;
  source?: "kmitl" | "local";
  model?: string;
  reason?: string;
  error?: string;
};

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

const levelRank: Record<CEFR, number> = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };
const skillLabels: Record<Skill, string> = {
  speaking: "Speaking",
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  grammarProduction: "Grammar production",
  grammarRecognition: "Grammar recognition",
  vocabulary: "Vocabulary",
  pronunciation: "Pronunciation"
};

function messageId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sessionKey(lessonId: string) {
  return `english-c1-accelerator:lesson-ai-tutor:v1:${lessonId}`;
}

function weakSkillNames(state: LearnerState): string[] {
  return (Object.keys(state.skillEstimates) as Skill[])
    .sort((a, b) => {
      const aValue = state.skillEstimates[a];
      const bValue = state.skillEstimates[b];
      return levelRank[aValue.level] - levelRank[bValue.level] || aValue.progress - bValue.progress;
    })
    .slice(0, 4)
    .map((skill) => `${skillLabels[skill]} ${state.skillEstimates[skill].level} ${state.skillEstimates[skill].progress}%`);
}

function contextFromState(): TutorContext {
  const state = loadState();
  return {
    lesson: getAnyLesson(state.currentLessonId),
    weakSkills: weakSkillNames(state),
    recurringErrors: [...state.errorBank]
      .sort((a, b) => b.recurrenceCount - a.recurrenceCount)
      .slice(0, 6)
      .map((error) => `${error.category}: ${error.original} → ${error.corrected}`),
    audioRate: state.settings.audioRate
  };
}

function speechChunks(text: string, maxChars = 190): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxChars && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

function speakText(text: string, rate: number) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const chunks = speechChunks(text);
  const speakChunk = (index: number) => {
    if (index >= chunks.length) return;
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = "en-US";
    utterance.rate = Math.max(0.75, Math.min(1.25, rate));
    utterance.onend = () => speakChunk(index + 1);
    window.speechSynthesis.speak(utterance);
  };
  speakChunk(0);
}

function storageMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is ChatMessage => Boolean(item) && typeof item === "object" && (item as ChatMessage).role !== undefined && typeof (item as ChatMessage).content === "string")
    .slice(-24)
    .map((item) => ({ ...item, revealed: item.revealed ?? false }));
}

export function CourseAITutor() {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<TutorContext>();
  const [mode, setMode] = useState<LessonTutorMode>("integrated");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [interim, setInterim] = useState("");
  const [busy, setBusy] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [autoPlayListening, setAutoPlayListening] = useState(true);
  const [storageReady, setStorageReady] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const activeMode = useMemo(() => lessonTutorModes.find((item) => item.id === mode) ?? lessonTutorModes[0], [mode]);
  const wordCount = input.trim() ? input.trim().split(/\s+/).filter(Boolean).length : 0;

  const refreshContext = (loadSaved = true) => {
    const next = contextFromState();
    setContext(next);
    if (loadSaved && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(sessionKey(next.lesson.id));
        if (raw) {
          const parsed = JSON.parse(raw) as { mode?: unknown; messages?: unknown };
          if (typeof parsed.mode === "string" && lessonTutorModes.some((item) => item.id === parsed.mode)) {
            setMode(parsed.mode as LessonTutorMode);
          }
          setMessages(storageMessages(parsed.messages));
        } else {
          setMode("integrated");
          setMessages([]);
        }
      } catch {
        setMessages([]);
      }
    }
    setStorageReady(true);
    return next;
  };

  useEffect(() => {
    if (!open) return;
    refreshContext(true);
    const onFocus = () => refreshContext(false);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [open]);

  useEffect(() => {
    if (!storageReady || !context || typeof window === "undefined") return;
    try {
      localStorage.setItem(sessionKey(context.lesson.id), JSON.stringify({ mode, messages: messages.slice(-24) }));
    } catch {
      // Tutor history is convenience state only; learner mastery must never depend on it.
    }
  }, [context, messages, mode, storageReady]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => () => {
    recognitionRef.current?.abort();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const changeMode = (nextMode: LessonTutorMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setMessages([]);
    setInput("");
    setInterim("");
  };

  const appendReply = (reply: LessonTutorReply, source: "kmitl" | "local", model?: string) => {
    const message: ChatMessage = {
      id: messageId("assistant"),
      role: "assistant",
      content: reply.message,
      hidden: reply.hideTranscript,
      revealed: !reply.hideTranscript,
      coachingNote: reply.coachingNote,
      action: reply.action,
      suggestedSeconds: reply.suggestedSeconds,
      suggestedWords: reply.suggestedWords,
      source,
      model
    };
    setMessages((prev) => [...prev, message]);
    if (autoPlayListening && reply.action === "listen") {
      speakText(reply.message, context?.audioRate ?? 1);
    }
  };

  const requestTutor = async (learnerMessage = "") => {
    const freshContext = refreshContext(false);
    if (busy) return;
    const trimmed = learnerMessage.trim();
    const currentHistory = messages.slice(-12);
    if (trimmed) {
      setMessages((prev) => [...prev, { id: messageId("user"), role: "user", content: trimmed }]);
      setInput("");
      setInterim("");
    }
    setBusy(true);

    try {
      const response = await fetch("/api/lesson-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson: {
            id: freshContext.lesson.id,
            day: freshContext.lesson.day,
            title: freshContext.lesson.title,
            cefrLevel: freshContext.lesson.cefrLevel,
            focus: freshContext.lesson.focus,
            objectives: freshContext.lesson.objectives
          },
          mode,
          message: trimmed,
          history: currentHistory.map((item) => ({ role: item.role, content: item.content })),
          weakSkills: freshContext.weakSkills,
          recurringErrors: freshContext.recurringErrors
        })
      });
      const data = await response.json() as TutorApiResponse;
      if (data.reply) {
        appendReply(data.reply, data.source === "kmitl" ? "kmitl" : "local", data.model);
      } else {
        throw new Error(data.error || "Tutor response unavailable");
      }
    } catch {
      const fallback = localLessonTutorReply({
        mode,
        level: freshContext.lesson.cefrLevel,
        lessonTitle: freshContext.lesson.title,
        focus: freshContext.lesson.focus,
        turnIndex: currentHistory.filter((item) => item.role === "user").length,
        learnerMessage: trimmed
      });
      appendReply(fallback, "local");
    } finally {
      setBusy(false);
    }
  };

  const startMicrophone = () => {
    if (micActive || typeof window === "undefined") return;
    const browser = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructorLike;
      webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
    };
    const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    if (!Constructor) return;

    const recognition = new Constructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result?.[0]?.transcript ?? "";
        if (result?.isFinal) finalText += `${text} `;
        else interimText += text;
      }
      if (finalText.trim()) {
        setInput((prev) => `${prev}${prev.trim() ? " " : ""}${finalText.trim()}`);
      }
      setInterim(interimText.trim());
    };
    recognition.onerror = () => setMicActive(false);
    recognition.onend = () => {
      setMicActive(false);
      setInterim("");
    };
    recognitionRef.current = recognition;
    setMicActive(true);
    recognition.start();
  };

  const stopMicrophone = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setMicActive(false);
  };

  const resetSession = () => {
    if (context && typeof window !== "undefined") localStorage.removeItem(sessionKey(context.lesson.id));
    setMessages([]);
    setInput("");
    setInterim("");
  };

  const reveal = (id: string) => {
    setMessages((prev) => prev.map((item) => item.id === id ? { ...item, revealed: true } : item));
  };

  if (!open) {
    return (
      <button
        className="btn primary"
        onClick={() => setOpen(true)}
        style={{ position: "fixed", right: 18, bottom: 18, zIndex: 80, boxShadow: "var(--shadow)" }}
        aria-label="Open AI lesson tutor"
      >
        🤖 AI Tutor · 4 Skills
      </button>
    );
  }

  return (
    <section
      aria-label="AI lesson tutor"
      style={{
        position: "fixed",
        right: 12,
        bottom: 12,
        zIndex: 90,
        width: "min(520px, calc(100vw - 24px))",
        height: "min(780px, calc(100vh - 24px))",
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        boxShadow: "var(--shadow)",
        overflow: "hidden"
      }}
    >
      <header style={{ padding: 14, borderBottom: "1px solid var(--border)", display: "grid", gap: 8 }}>
        <div className="lesson-header">
          <div>
            <div className="kicker">AI Lesson Tutor</div>
            <strong>{context ? `Day ${context.lesson.day} · ${context.lesson.cefrLevel}` : "Loading lesson…"}</strong>
            <div className="small muted">{context?.lesson.title}</div>
          </div>
          <button className="btn small ghost" onClick={() => setOpen(false)} aria-label="Close AI tutor">✕</button>
        </div>
        <div className="top-actions">
          <AIProviderStatus />
          <span className="pill">AI cannot auto-pass CEFR</span>
        </div>
      </header>

      <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", overflowX: "auto" }}>
        <div className="top-actions" style={{ flexWrap: "nowrap" }}>
          {lessonTutorModes.map((item) => (
            <button
              key={item.id}
              className={`btn small ${mode === item.id ? "primary" : "ghost"}`}
              onClick={() => changeMode(item.id)}
              title={item.purpose}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="small muted" style={{ marginTop: 6 }}>{activeMode.purpose}</div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 12, display: "grid", gap: 10 }}>
        {!messages.length ? (
          <div className="card card-pad">
            <div className="kicker">Context-aware practice</div>
            <h3 style={{ marginTop: 4 }}>{context?.lesson.focus ?? "Current lesson"}</h3>
            <p className="small muted">
              The tutor reads your current lesson, weak skill estimates and recurring Error Bank patterns. It trains you without changing mastery scores or pretending to certify C1.
            </p>
            {context?.weakSkills.length ? <div className="small"><b>Weakest signals:</b> {context.weakSkills.join(" · ")}</div> : null}
            <button className="btn primary" style={{ marginTop: 12 }} disabled={busy || !context} onClick={() => void requestTutor("")}>
              {busy ? "Building round…" : "Start guided round"}
            </button>
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className="card card-pad"
            style={{ marginLeft: message.role === "user" ? 44 : 0, marginRight: message.role === "assistant" ? 20 : 0 }}
          >
            <div className="lesson-header">
              <span className={`pill ${message.role === "assistant" ? "accent" : ""}`}>{message.role === "assistant" ? "Tutor" : "You"}</span>
              {message.role === "assistant" ? (
                <button className="btn small ghost" onClick={() => speakText(message.content, context?.audioRate ?? 1)}>▶ Hear</button>
              ) : null}
            </div>

            {message.hidden && !message.revealed ? (
              <div style={{ padding: "18px 4px", textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>🎧</div>
                <strong>Transcript hidden for listening practice</strong>
                <p className="small muted">Listen for meaning first. Replay if needed, answer, then reveal the text.</p>
                <div className="top-actions" style={{ justifyContent: "center" }}>
                  <button className="btn small" onClick={() => speakText(message.content, context?.audioRate ?? 1)}>▶ Replay</button>
                  <button className="btn small ghost" onClick={() => reveal(message.id)}>Reveal transcript</button>
                </div>
              </div>
            ) : (
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.65, marginTop: 8 }}>{message.content}</div>
            )}

            {message.coachingNote ? <div className="feedback correct"><strong>Coach note</strong>{message.coachingNote}</div> : null}
            <div className="top-actions" style={{ marginTop: 8 }}>
              {message.suggestedSeconds ? <span className="pill">Target {message.suggestedSeconds}s</span> : null}
              {message.suggestedWords ? <span className="pill">Target {message.suggestedWords} words</span> : null}
              {message.source ? <span className="small muted">{message.source === "kmitl" ? `KMITL AI${message.model ? ` · ${message.model.replace(/^openrouter\//, "")}` : ""}` : "Local fallback"}</span> : null}
            </div>
          </div>
        ))}

        {busy ? <div className="small muted">Tutor is adapting the next task to this lesson and your latest answer…</div> : null}
      </div>

      <footer style={{ borderTop: "1px solid var(--border)", padding: 12, display: "grid", gap: 8 }}>
        <div className="top-actions">
          <button className={`btn small ${micActive ? "danger" : ""}`} onClick={micActive ? stopMicrophone : startMicrophone}>
            {micActive ? "■ Stop speaking" : "🎙 Speak answer"}
          </button>
          <label className="small muted" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <input type="checkbox" checked={autoPlayListening} onChange={(event) => setAutoPlayListening(event.target.checked)} />
            Auto-play listening
          </label>
          <button className="btn small ghost" onClick={resetSession}>Clear</button>
        </div>

        <textarea
          rows={3}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={mode === "speaking" ? "Speak with the mic or type what you want to say…" : mode === "writing" ? "Write your draft here…" : "Answer the tutor or ask about this lesson…"}
        />
        {interim ? <div className="small muted">Listening… {interim}</div> : null}
        <div className="lesson-header">
          <div className="small muted">
            {mode === "writing" ? `${wordCount} words` : "Mic STT is practice input only; use recorded Speaking Coach evidence for audited speaking readiness."}
          </div>
          <button className="btn primary" disabled={busy || (!input.trim() && !interim.trim())} onClick={() => void requestTutor(`${input}${interim ? `${input.trim() ? " " : ""}${interim}` : ""}`)}>
            Send
          </button>
        </div>
      </footer>
    </section>
  );
}
