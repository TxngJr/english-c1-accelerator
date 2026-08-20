"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { saveRecordingBlob } from "@/lib/audio-store";
import { conversationTopics, localFollowUp, minimumConversationTurns, type ConversationChallengeType } from "@/lib/conversation-coach";
import { analyzeSpeakingTranscript, localSpeakingCoachFeedback, transcriptEvidenceIsAuditable } from "@/lib/speaking-coach";
import { loadState, saveState } from "@/lib/storage";
import type { CEFR, SpeakingRecord } from "@/lib/types";

type PracticeLevel = "A2" | "B1" | "B2" | "C1";
type TranscriptSource = NonNullable<SpeakingRecord["transcriptSource"]>;

type ConversationMessage = {
  role: "partner" | "learner";
  text: string;
  challengeType?: ConversationChallengeType;
};

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
}
interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface SpeechRecognitionConstructorLike {
  new (): SpeechRecognitionLike;
}

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructorLike;
  webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
};

function appendTranscript(previous: string, addition: string): string {
  const clean = addition.trim();
  if (!clean) return previous;
  return previous.trim() ? `${previous.trim()} ${clean}` : clean;
}

function durationLabel(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes}:${String(totalSeconds % 60).padStart(2, "0")}`;
}

function historyText(messages: ConversationMessage[]): string {
  return messages.slice(-10).map((message) => `${message.role === "partner" ? "Partner" : "Learner"}: ${message.text}`).join("\n");
}

export function ConversationCoach() {
  const [level, setLevel] = useState<PracticeLevel>("A2");
  const topics = useMemo(() => conversationTopics.filter((topic) => topic.level === level), [level]);
  const [topicId, setTopicId] = useState(conversationTopics.find((topic) => topic.level === "A2")?.id ?? "a2-daily-life");
  const topic = conversationTopics.find((item) => item.id === topicId) ?? topics[0];
  const [messages, setMessages] = useState<ConversationMessage[]>([
    { role: "partner", text: topic?.openingQuestion ?? "Tell me about yourself." }
  ]);
  const [turns, setTurns] = useState(0);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [transcriptSource, setTranscriptSource] = useState<TranscriptSource>("manual");
  const [reviewed, setReviewed] = useState(false);
  const [busyTranscribing, setBusyTranscribing] = useState(false);
  const [busyFollowUp, setBusyFollowUp] = useState(false);
  const [status, setStatus] = useState("Listen to the question, answer without a script, then review the transcript before submitting the turn.");
  const [browserSttAvailable, setBrowserSttAvailable] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const secondsRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingRef = useRef(false);
  const transcriptRef = useRef("");
  const audioUrlRef = useRef<string>();

  const currentQuestion = [...messages].reverse().find((message) => message.role === "partner")?.text ?? topic.openingQuestion;
  const metrics = useMemo(() => analyzeSpeakingTranscript(transcript, seconds || 1), [transcript, seconds]);
  const coachFeedback = useMemo(() => localSpeakingCoachFeedback(metrics, level as CEFR), [metrics, level]);
  const auditable = reviewed && transcriptEvidenceIsAuditable(transcript, seconds);
  const targetTurns = minimumConversationTurns(level as CEFR);

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    setBrowserSttAvailable(Boolean(speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition));
    return () => {
      recordingRef.current = false;
      recognitionRef.current?.abort();
      if (intervalRef.current) clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const clearTurn = () => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = undefined;
    setAudioUrl(undefined);
    setAudioBlob(undefined);
    setTranscript("");
    transcriptRef.current = "";
    setInterimTranscript("");
    setTranscriptSource("manual");
    setReviewed(false);
    setSeconds(0);
    secondsRef.current = 0;
  };

  const resetSession = (nextLevel: PracticeLevel, nextTopicId?: string) => {
    const nextTopics = conversationTopics.filter((item) => item.level === nextLevel);
    const nextTopic = conversationTopics.find((item) => item.id === nextTopicId) ?? nextTopics[0];
    setLevel(nextLevel);
    setTopicId(nextTopic.id);
    setMessages([{ role: "partner", text: nextTopic.openingQuestion }]);
    setTurns(0);
    clearTurn();
    setStatus("New conversation ready. Answer from ideas and keywords, not a memorized script.");
  };

  const speakPartnerQuestion = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion);
    utterance.lang = "en-US";
    utterance.rate = level === "A2" ? 0.92 : 1;
    window.speechSynthesis.speak(utterance);
  };

  const startRecognition = () => {
    const speechWindow = window as SpeechWindow;
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const candidate = result[0]?.transcript ?? "";
        if (result.isFinal) finalText = appendTranscript(finalText, candidate);
        else interimText = appendTranscript(interimText, candidate);
      }
      if (finalText) {
        setTranscript((previous) => {
          const next = appendTranscript(previous, finalText);
          transcriptRef.current = next;
          return next;
        });
        setTranscriptSource("browser");
        setReviewed(false);
      }
      setInterimTranscript(interimText);
    };
    recognition.onerror = () => {
      setStatus("Live browser STT stopped, but the audio recorder is still active. Use cloud STT or manual transcript after stopping.");
    };
    recognition.onend = () => {
      if (!recordingRef.current) return;
      try { recognition.start(); } catch { /* browser may restart internally */ }
    };
    recognitionRef.current = recognition;
    try { recognition.start(); } catch { recognitionRef.current = null; }
  };

  const startRecording = async () => {
    if (recordingRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      clearTurn();
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
        const nextUrl = URL.createObjectURL(blob);
        audioUrlRef.current = nextUrl;
        setAudioUrl(nextUrl);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setInterimTranscript("");
        setStatus(transcriptRef.current.trim()
          ? "Review the transcript, then submit your turn."
          : "No transcript was captured. Use cloud STT or type exactly what you said before submitting.");
      };
      secondsRef.current = 0;
      recordingRef.current = true;
      setRecording(true);
      recorder.start(1000);
      startRecognition();
      intervalRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
      }, 1000);
      setStatus(browserSttAvailable ? "Recording with live STT…" : "Recording audio… live browser STT is unavailable on this browser.");
    } catch {
      setStatus("Microphone permission is required. Check site microphone permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (!recordingRef.current) return;
    recordingRef.current = false;
    setRecording(false);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    const recorder = recorderRef.current;
    recorderRef.current = null;
    if (recorder && recorder.state !== "inactive") recorder.stop();
  };

  const cloudTranscribe = async () => {
    if (!audioBlob) return;
    setBusyTranscribing(true);
    setStatus("Requesting high-accuracy transcription…");
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "conversation-turn.webm");
      const response = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await response.json() as { text?: string; error?: string; detail?: string };
      if (!response.ok || !data.text) {
        setStatus(data.error ?? data.detail ?? "Cloud STT unavailable. Use the browser/manual transcript.");
        return;
      }
      setTranscript(data.text);
      transcriptRef.current = data.text;
      setTranscriptSource("openai");
      setReviewed(false);
      setStatus("Cloud transcript ready. Correct only obvious STT mistakes, then confirm review.");
    } catch {
      setStatus("Cloud STT could not be reached. Your local recording is still safe in this page until you leave/reset.");
    } finally {
      setBusyTranscribing(false);
    }
  };

  const getNextQuestion = async (nextMessages: ConversationMessage[], learnerText: string, nextTurnIndex: number) => {
    setBusyFollowUp(true);
    try {
      const response = await fetch("/api/conversation-follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level,
          topic: `${topic.label}: ${topic.goal}`,
          latestTranscript: learnerText,
          history: historyText(nextMessages),
          turnIndex: nextTurnIndex
        })
      });
      const data = await response.json() as { question?: string };
      if (response.ok && data.question) return { question: data.question, type: undefined as ConversationChallengeType | undefined, source: "AI" };
    } catch {
      // Fall through to deterministic local challenge.
    } finally {
      setBusyFollowUp(false);
    }
    const fallback = localFollowUp(level as CEFR, nextTurnIndex);
    return { question: fallback.question, type: fallback.type, source: "local" };
  };

  const submitTurn = async () => {
    if (!audioBlob || seconds < 5) {
      setStatus("Record a real spoken answer before submitting this turn.");
      return;
    }
    if (!transcript.trim() || !reviewed) {
      setStatus("Review the actual transcript before submitting. Do not rewrite it into better English first.");
      return;
    }

    const recordId = `conversation-coach-${Date.now()}`;
    try {
      await saveRecordingBlob(recordId, audioBlob);
    } catch {
      setStatus("Could not persist the audio evidence. This turn was not credited.");
      return;
    }

    const state = loadState();
    const record: SpeakingRecord = {
      id: recordId,
      lessonId: "conversation-coach",
      prompt: currentQuestion,
      durationSeconds: seconds,
      createdAt: new Date().toISOString(),
      selfRating: 3,
      notes: `Interactive ${level} conversation practice · topic ${topic.label}`,
      transcript: transcript.trim(),
      transcriptSource,
      transcriptVerified: true,
      speakingMetrics: metrics
    };
    const nextState = {
      ...state,
      speakingRecords: [record, ...state.speakingRecords],
      evidence: {
        ...state.evidence,
        unscriptedSpeakingMinutes: state.evidence.unscriptedSpeakingMinutes + seconds / 60
      },
      xp: state.xp + Math.min(20, Math.max(5, Math.round(seconds / 8)))
    };
    if (!saveState(nextState)) {
      setStatus("Audio was stored but learner state could not be saved. Fix browser storage before continuing.");
      return;
    }

    const learnerText = transcript.trim();
    const learnerMessage: ConversationMessage = { role: "learner", text: learnerText };
    const nextMessages = [...messages, learnerMessage];
    const nextTurnIndex = turns + 1;
    setMessages(nextMessages);
    setTurns(nextTurnIndex);
    setStatus("Building an unexpected follow-up from what you actually said…");

    const followUp = await getNextQuestion(nextMessages, learnerText, nextTurnIndex);
    setMessages([...nextMessages, { role: "partner", text: followUp.question, challengeType: followUp.type }]);
    clearTurn();
    setStatus(`${followUp.source} follow-up ready. Answer it without preparing a full script.`);
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="kicker">Unprepared follow-ups · turn-taking · reformulation</div>
          <h1>Conversation Coach</h1>
        </div>
        <div className="top-actions">
          <span className={`pill ${turns >= targetTurns ? "success" : ""}`}>{turns}/{targetTurns} target turns</span>
          <a className="btn" href="/speaking-coach">Speaking Coach</a>
          <a className="btn" href="/">Course</a>
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-pad">
          <div className="section-header"><div><h2>Session</h2><p>{topic.goal}</p></div></div>
          <label className="small muted">Target level</label>
          <select className="field" value={level} onChange={(event) => resetSession(event.target.value as PracticeLevel)} disabled={recording || busyFollowUp}>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
          <label className="small muted">Topic</label>
          <select className="field" value={topicId} onChange={(event) => resetSession(level, event.target.value)} disabled={recording || busyFollowUp}>
            {topics.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <div className="section feedback correct">
            <strong>Training rule</strong>
            Prepare ideas or keywords only. The partner will change the pressure after every answer, so a memorized script will not help.
          </div>
        </div>

        <div className="card card-pad">
          <div className="section-header">
            <div><h2>Current question</h2><p>Listen once or read once, then answer.</p></div>
            <button className="btn small" onClick={speakPartnerQuestion}>▶ Hear question</button>
          </div>
          <div className="prompt">{currentQuestion}</div>
          <p className="small muted">{status}</p>
          <div className="top-actions">
            {!recording ? (
              <button className="btn primary" onClick={() => { void startRecording(); }} disabled={busyFollowUp}>● Start answer</button>
            ) : (
              <button className="btn danger" onClick={stopRecording}>■ Stop</button>
            )}
            <span className="pill">{durationLabel(seconds)}</span>
            <span className="pill">{browserSttAvailable ? "live STT" : "audio + fallback STT"}</span>
          </div>
          {audioUrl ? <audio controls src={audioUrl} style={{ width: "100%", marginTop: 14 }} /> : null}
          {interimTranscript ? <p className="small muted">Live: {interimTranscript}</p> : null}
        </div>
      </div>

      <div className="section grid-2">
        <div className="card card-pad">
          <div className="section-header">
            <div><h2>Transcript</h2><p>Keep the language you actually produced.</p></div>
            <button className="btn small" onClick={() => { void cloudTranscribe(); }} disabled={!audioBlob || busyTranscribing || recording}>
              {busyTranscribing ? "Transcribing…" : "Cloud STT"}
            </button>
          </div>
          <textarea
            rows={9}
            value={transcript}
            placeholder="Transcript appears here. If STT fails, type what you actually said."
            onChange={(event) => {
              setTranscript(event.target.value);
              transcriptRef.current = event.target.value;
              setTranscriptSource(transcriptSource === "manual" ? "manual" : "edited");
              setReviewed(false);
            }}
          />
          <label className="mission-item" style={{ marginTop: 10 }}>
            <input type="checkbox" checked={reviewed} onChange={(event) => setReviewed(event.target.checked)} />
            <span>I checked the transcript for STT mistakes only; I did not rewrite my answer into better English.</span>
          </label>
          <div className="top-actions" style={{ marginTop: 12 }}>
            <span className={`pill ${auditable ? "success" : ""}`}>{auditable ? "auditable" : "needs fuller/reviewed transcript"}</span>
            <span className="pill">source: {transcriptSource}</span>
          </div>
        </div>

        <div className="card card-pad">
          <div className="section-header"><div><h2>Turn diagnostics</h2><p>Use one fix on the next turn, not ten.</p></div></div>
          <div className="grid-2">
            <div className="stat compact"><div className="label">Words</div><div className="value" style={{ fontSize: 20 }}>{metrics.wordCount}</div></div>
            <div className="stat compact"><div className="label">Words/min</div><div className="value" style={{ fontSize: 20 }}>{metrics.wordsPerMinute}</div></div>
            <div className="stat compact"><div className="label">Fillers / 100</div><div className="value" style={{ fontSize: 20 }}>{metrics.fillerRatePer100Words}</div></div>
            <div className="stat compact"><div className="label">Self-repairs</div><div className="value" style={{ fontSize: 20 }}>{metrics.selfRepairCount}</div></div>
          </div>
          <ul>{coachFeedback.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
          <button className="btn primary" onClick={() => { void submitTurn(); }} disabled={!audioBlob || !reviewed || !transcript.trim() || recording || busyFollowUp}>
            {busyFollowUp ? "Generating follow-up…" : "Submit turn & get unexpected follow-up"}
          </button>
        </div>
      </div>

      <div className="section card card-pad">
        <div className="section-header">
          <div><h2>Conversation transcript</h2><p>Each learner turn saved here also persists its audio + reviewed transcript as speaking evidence.</p></div>
          <span className={`pill ${turns >= targetTurns ? "success" : ""}`}>{turns >= targetTurns ? "SESSION TARGET MET" : "KEEP GOING"}</span>
        </div>
        <div className="stack">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className="mission-item" style={{ alignItems: "flex-start" }}>
              <span className="pill">{message.role === "partner" ? "Partner" : "You"}</span>
              <span style={{ flex: 1 }}>{message.text}</span>
              {message.challengeType ? <span className="pill accent">{message.challengeType}</span> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="section card card-pad">
        <strong>C1 integrity note</strong>
        <p className="muted">
          This coach is deliberate training for spontaneous interaction, but it is not an independent C1 examiner. Verified C1 still requires the full listening/reading/writing/speaking evidence profile and an identified independent evaluator.
        </p>
      </div>
    </div>
  );
}
