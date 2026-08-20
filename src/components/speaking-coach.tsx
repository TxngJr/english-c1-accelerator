"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { saveRecordingBlob } from "@/lib/audio-store";
import { loadState, saveState } from "@/lib/storage";
import {
  analyzeSpeakingTranscript,
  localSpeakingCoachFeedback,
  speakingCoachTargets,
  transcriptEvidenceIsAuditable
} from "@/lib/speaking-coach";
import type { CEFR, SpeakingAIFeedback, SpeakingMetrics, SpeakingRecord } from "@/lib/types";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
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

interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error?: string;
  message?: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructorLike {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  }
}

type TranscriptSource = NonNullable<SpeakingRecord["transcriptSource"]>;

type CloudTranscriptionResponse = {
  text?: string;
  source?: "openai";
  error?: string;
  detail?: string;
};

type FeedbackResponse = {
  feedback?: SpeakingAIFeedback;
  error?: string;
  detail?: string;
};

function durationLabel(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function appendTranscript(previous: string, addition: string): string {
  const clean = addition.trim();
  if (!clean) return previous;
  return previous.trim() ? `${previous.trim()} ${clean}` : clean;
}

function auditableRecordCount(records: SpeakingRecord[]): number {
  return records.filter((record) =>
    record.transcriptVerified === true &&
    Boolean(record.transcript?.trim()) &&
    transcriptEvidenceIsAuditable(record.transcript ?? "", record.durationSeconds)
  ).length;
}

export function SpeakingCoach() {
  const [level, setLevel] = useState<CEFR>("A2");
  const target = speakingCoachTargets.find((item) => item.level === level) ?? speakingCoachTargets[0];
  const [prompt, setPrompt] = useState(target.prompt);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [transcriptSource, setTranscriptSource] = useState<TranscriptSource>("manual");
  const [reviewedTranscript, setReviewedTranscript] = useState(false);
  const [selfRating, setSelfRating] = useState(3);
  const [status, setStatus] = useState("Choose a level, read the prompt once, then speak from keywords only.");
  const [busyTranscribing, setBusyTranscribing] = useState(false);
  const [busyFeedback, setBusyFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<SpeakingAIFeedback>();
  const [saved, setSaved] = useState(false);
  const [savedEvidenceCount, setSavedEvidenceCount] = useState(0);
  const [browserSttAvailable, setBrowserSttAvailable] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);
  const recordingRef = useRef(false);
  const transcriptRef = useRef("");
  const audioUrlRef = useRef<string>();

  const metrics: SpeakingMetrics = useMemo(
    () => analyzeSpeakingTranscript(transcript, seconds || 1),
    [transcript, seconds]
  );
  const localFeedback = useMemo(
    () => localSpeakingCoachFeedback(metrics, level),
    [metrics, level]
  );
  const auditable = reviewedTranscript && transcriptEvidenceIsAuditable(transcript, seconds);

  useEffect(() => {
    const recognitionConstructor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    setBrowserSttAvailable(Boolean(recognitionConstructor));
    const state = loadState();
    setSavedEvidenceCount(auditableRecordCount(state.speakingRecords));
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

  const resetAttempt = (nextPrompt = prompt) => {
    recordingRef.current = false;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    recorderRef.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = undefined;
    setPrompt(nextPrompt);
    setRecording(false);
    setSeconds(0);
    secondsRef.current = 0;
    setAudioBlob(undefined);
    setAudioUrl(undefined);
    setTranscript("");
    transcriptRef.current = "";
    setInterimTranscript("");
    setTranscriptSource("manual");
    setReviewedTranscript(false);
    setAiFeedback(undefined);
    setSaved(false);
    setStatus("Ready. Speak from keywords rather than a full script.");
  };

  const handleLevelChange = (nextLevel: CEFR) => {
    const nextTarget = speakingCoachTargets.find((item) => item.level === nextLevel) ?? speakingCoachTargets[0];
    setLevel(nextLevel);
    resetAttempt(nextTarget.prompt);
  };

  const startBrowserRecognition = () => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
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
        setReviewedTranscript(false);
      }
      setInterimTranscript(interimText);
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setStatus("Browser speech recognition permission/service is unavailable. Your audio is still recording; use Cloud STT or correct the transcript manually after stopping.");
      }
    };
    recognition.onend = () => {
      if (!recordingRef.current) return;
      try {
        recognition.start();
      } catch {
        // Some browsers restart recognition themselves or temporarily reject a restart.
      }
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
    }
  };

  const startRecording = async () => {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      secondsRef.current = 0;
      setSeconds(0);
      setAudioBlob(undefined);
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = undefined;
      setAudioUrl(undefined);
      setTranscript("");
      transcriptRef.current = "";
      setInterimTranscript("");
      setTranscriptSource("manual");
      setReviewedTranscript(false);
      setAiFeedback(undefined);
      setSaved(false);

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
        if (!transcriptRef.current.trim()) {
          setStatus("Audio saved, but no transcript was captured. Use High-accuracy Cloud STT or type/correct the transcript manually.");
        } else {
          setStatus("Recording saved. Review the transcript for obvious STT mistakes before saving evidence.");
        }
      };

      recordingRef.current = true;
      setRecording(true);
      recorder.start(1000);
      startBrowserRecognition();
      intervalRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
      }, 1000);
      setStatus(browserSttAvailable
        ? "Recording + live browser transcription. Keep speaking even if interim text looks imperfect."
        : "Recording audio. This browser has no live STT; use Cloud STT after stopping.");
    } catch {
      setStatus("Microphone permission is required for speaking evidence. Check browser/site microphone permissions and try again.");
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
    if (!audioBlob) {
      setStatus("Record an attempt first.");
      return;
    }
    setBusyTranscribing(true);
    setStatus("Requesting high-accuracy transcription…");
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "speaking-sample.webm");
      const response = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await response.json() as CloudTranscriptionResponse;
      if (!response.ok || !data.text) {
        setStatus(data.error ?? data.detail ?? "Cloud transcription failed. Keep the browser/manual transcript instead.");
        return;
      }
      setTranscript(data.text);
      transcriptRef.current = data.text;
      setTranscriptSource("openai");
      setReviewedTranscript(false);
      setAiFeedback(undefined);
      setStatus("Cloud transcript ready. Read it once and fix only obvious STT mistakes before marking it reviewed.");
    } catch {
      setStatus("Cloud transcription could not be reached. Your local recording and manual transcript are still available.");
    } finally {
      setBusyTranscribing(false);
    }
  };

  const requestAiFeedback = async () => {
    if (!transcript.trim()) {
      setStatus("A transcript is required before AI feedback can analyze your language.");
      return;
    }
    setBusyFeedback(true);
    setStatus("Analyzing grammar, vocabulary, coherence, and transcript-based fluency evidence…");
    try {
      const response = await fetch("/api/speaking-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          prompt,
          level,
          durationSeconds: seconds,
          metrics
        })
      });
      const data = await response.json() as FeedbackResponse;
      if (!response.ok || !data.feedback) {
        setStatus(data.error ?? data.detail ?? "AI feedback is unavailable. Local metrics remain available below.");
        return;
      }
      setAiFeedback(data.feedback);
      setStatus("AI feedback ready. Use it to repeat the same prompt once before moving to a new prompt.");
    } catch {
      setStatus("AI feedback could not be reached. Use the local coach recommendations below.");
    } finally {
      setBusyFeedback(false);
    }
  };

  const saveEvidence = async () => {
    if (!audioBlob || seconds < 5) {
      setStatus("Record a real spoken attempt before saving evidence.");
      return;
    }
    if (!transcript.trim()) {
      setStatus("Add or generate a transcript before saving this as auditable speaking evidence.");
      return;
    }
    if (!reviewedTranscript) {
      setStatus("Review the transcript and confirm the checkbox first. STT errors must not become permanent learning evidence.");
      return;
    }

    const recordId = `speaking-coach-${Date.now()}`;
    try {
      await saveRecordingBlob(recordId, audioBlob);
    } catch {
      setStatus("Audio could not be stored in IndexedDB, so the attempt was not credited. Check browser storage permissions.");
      return;
    }

    const current = loadState();
    const record: SpeakingRecord = {
      id: recordId,
      lessonId: "speaking-coach",
      prompt,
      durationSeconds: seconds,
      createdAt: new Date().toISOString(),
      selfRating,
      notes: `Speaking Coach ${level} practice. Transcript reviewed by learner before evidence save.`,
      transcript: transcript.trim(),
      transcriptSource,
      transcriptVerified: true,
      speakingMetrics: metrics,
      aiFeedback
    };
    const next = {
      ...current,
      speakingRecords: [record, ...current.speakingRecords],
      evidence: {
        ...current.evidence,
        unscriptedSpeakingMinutes: current.evidence.unscriptedSpeakingMinutes + seconds / 60
      },
      xp: current.xp + Math.min(30, Math.max(5, Math.round(seconds / 10)))
    };

    if (!saveState(next)) {
      setStatus("Progress could not be saved to localStorage. Export/repair browser storage before continuing.");
      return;
    }

    setSaved(true);
    setSavedEvidenceCount(auditableRecordCount(next.speakingRecords));
    setStatus(auditable
      ? "Saved as auditable speaking evidence. Repeat the same prompt and try to improve one specific weakness."
      : "Saved, but this sample is too short/sparse to count as strong transcript evidence. Repeat it with a fuller response.");
  };

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="kicker">Speech → transcript → correction → repeat</div>
          <h1>Speaking Coach</h1>
        </div>
        <div className="top-actions">
          <span className="pill">{savedEvidenceCount} reviewed transcript samples</span>
          <a className="btn" href="/">← Back to course</a>
        </div>
      </div>

      <div className="card hero">
        <div>
          <div className="kicker">Target level · {level}</div>
          <h2>Train spontaneous English that can be audited, not just recorded.</h2>
          <p>
            Record a real answer, generate speech-to-text, correct obvious transcription errors, inspect fluency/language evidence,
            then repeat the same prompt. Transcript metrics are coaching evidence only; they never certify CEFR by themselves.
          </p>
          <div className="top-actions">
            {speakingCoachTargets.map((item) => (
              <button
                key={item.level}
                className={`btn small ${item.level === level ? "primary" : ""}`}
                onClick={() => handleLevelChange(item.level)}
                disabled={recording}
              >
                {item.level}
              </button>
            ))}
          </div>
        </div>
        <div className="hero-side">
          <div>
            <div className="small muted">Target duration</div>
            <div className="emphasis">{target.minimumSeconds}–{target.targetSeconds}s+</div>
          </div>
          <div>
            <div className="small muted">Today&apos;s focus</div>
            <div>{target.focus}</div>
          </div>
        </div>
      </div>

      <div className="section grid-2">
        <div className="card card-pad">
          <div className="section-header">
            <div><h2>1. Prompt</h2><p>Read once, then use keywords only.</p></div>
          </div>
          <textarea
            rows={6}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            disabled={recording}
          />
          <p className="small muted">Do not write a full answer. C1 requires retrieval, reformulation, and interaction under pressure.</p>
        </div>

        <div className="card card-pad">
          <div className="section-header">
            <div><h2>2. Record</h2><p>{status}</p></div>
            <span className={`pill ${recording ? "accent" : ""}`}>{durationLabel(seconds)}</span>
          </div>
          <div className="top-actions">
            {!recording ? (
              <button className="btn primary" onClick={() => { void startRecording(); }}>● Start speaking</button>
            ) : (
              <button className="btn danger" onClick={stopRecording}>■ Stop</button>
            )}
            <span className="pill">{browserSttAvailable ? "Live browser STT available" : "Live browser STT unavailable"}</span>
          </div>
          {audioUrl ? <audio controls src={audioUrl} style={{ width: "100%", marginTop: 16 }} /> : null}
          {interimTranscript ? <p className="small muted">Live: {interimTranscript}</p> : null}
        </div>
      </div>

      <div className="section card card-pad">
        <div className="section-header">
          <div><h2>3. Transcript</h2><p>Use cloud STT when browser recognition is missing or inaccurate, then correct only obvious STT errors.</p></div>
          <div className="top-actions">
            <span className="pill">source: {transcriptSource}</span>
            <button className="btn small" onClick={() => { void cloudTranscribe(); }} disabled={!audioBlob || busyTranscribing || recording}>
              {busyTranscribing ? "Transcribing…" : "High-accuracy Cloud STT"}
            </button>
          </div>
        </div>
        <textarea
          rows={10}
          value={transcript}
          placeholder="Your transcript will appear here. If STT is unavailable, type what you actually said—not an improved rewrite."
          onChange={(event) => {
            setTranscript(event.target.value);
            transcriptRef.current = event.target.value;
            setTranscriptSource(transcriptSource === "manual" ? "manual" : "edited");
            setReviewedTranscript(false);
            setAiFeedback(undefined);
          }}
        />
        <label className="mission-item" style={{ marginTop: 12 }}>
          <input
            type="checkbox"
            checked={reviewedTranscript}
            onChange={(event) => setReviewedTranscript(event.target.checked)}
          />
          <span>I reviewed this transcript and corrected only obvious speech-to-text mistakes. I did not rewrite my English to make the evidence look better.</span>
        </label>
      </div>

      <div className="section grid-4">
        <div className="stat"><div className="label">Words</div><div className="value">{metrics.wordCount}</div><div className="sub">actual transcript tokens</div></div>
        <div className="stat"><div className="label">Speaking rate</div><div className="value">{metrics.wordsPerMinute}</div><div className="sub">words/min · not a CEFR score</div></div>
        <div className="stat"><div className="label">Fillers</div><div className="value">{metrics.fillerRatePer100Words}</div><div className="sub">per 100 words</div></div>
        <div className="stat"><div className="label">Discourse markers</div><div className="value">{metrics.discourseMarkerCount}</div><div className="sub">contrast / cause / qualification / structure</div></div>
      </div>

      <div className="section grid-2">
        <div className="card card-pad">
          <div className="section-header"><div><h2>4. Local coach</h2><p>Works offline after transcription.</p></div></div>
          <ul>
            {localFeedback.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="grid-2 section">
            <div className="stat compact"><div className="label">Unique-word ratio</div><div className="value" style={{ fontSize: 20 }}>{Math.round(metrics.uniqueWordRatio * 100)}%</div></div>
            <div className="stat compact"><div className="label">Self-repairs</div><div className="value" style={{ fontSize: 20 }}>{metrics.selfRepairCount}</div></div>
            <div className="stat compact"><div className="label">Immediate repetitions</div><div className="value" style={{ fontSize: 20 }}>{metrics.repeatedWordCount}</div></div>
            <div className="stat compact"><div className="label">Avg sentence words</div><div className="value" style={{ fontSize: 20 }}>{metrics.averageSentenceWords}</div></div>
          </div>
        </div>

        <div className="card card-pad">
          <div className="section-header">
            <div><h2>5. AI language feedback</h2><p>Optional. Evaluates transcript language, never pronunciation from text.</p></div>
            <button className="btn small" onClick={() => { void requestAiFeedback(); }} disabled={!transcript.trim() || busyFeedback}>
              {busyFeedback ? "Analyzing…" : "Analyze this attempt"}
            </button>
          </div>
          {aiFeedback ? (
            <div className="stack">
              <div><strong>Overall</strong><p>{aiFeedback.overall}</p></div>
              {aiFeedback.estimatedCeiling ? <div className="pill">Transcript-only ceiling: {aiFeedback.estimatedCeiling}</div> : null}
              {aiFeedback.grammar.length ? <div><strong>Grammar</strong><ul>{aiFeedback.grammar.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
              {aiFeedback.vocabulary.length ? <div><strong>Vocabulary / collocation</strong><ul>{aiFeedback.vocabulary.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
              {aiFeedback.coherence.length ? <div><strong>Coherence / argument</strong><ul>{aiFeedback.coherence.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
              {aiFeedback.corrections.length ? (
                <div><strong>High-value corrections</strong><ul>{aiFeedback.corrections.map((item) => <li key={`${item.original}-${item.improved}`}><code>{item.original}</code> → <code>{item.improved}</code> · {item.reason}</li>)}</ul></div>
              ) : null}
              <div className="feedback correct"><strong>Next drill</strong>{aiFeedback.nextDrill}</div>
              <p className="small muted">{aiFeedback.limitation}</p>
            </div>
          ) : (
            <div className="empty">No AI feedback yet. The local coach above is always available. Configure OPENAI_API_KEY for optional transcript feedback.</div>
          )}
        </div>
      </div>

      <div className="section card card-pad">
        <div className="section-header">
          <div><h2>6. Save evidence → repeat</h2><p>C1 comes from repeated verified performance, not one good recording.</p></div>
          <span className={`pill ${auditable ? "success" : ""}`}>{auditable ? "AUDITABLE TRANSCRIPT" : "NOT YET AUDITABLE"}</span>
        </div>
        <label className="small muted">Self-rating for effort/control: {selfRating}/5</label>
        <input type="range" min="1" max="5" step="1" value={selfRating} onChange={(event) => setSelfRating(Number(event.target.value))} />
        <div className="top-actions" style={{ marginTop: 14 }}>
          <button className="btn primary" onClick={() => { void saveEvidence(); }} disabled={saved || recording || !audioBlob}>
            {saved ? "✓ Evidence saved" : "Save reviewed speaking evidence"}
          </button>
          <button className="btn" onClick={() => resetAttempt(prompt)} disabled={recording}>Repeat same prompt</button>
        </div>
        <p className="small muted" style={{ marginTop: 12 }}>
          Best practice: repeat the same prompt immediately, fix only 1–2 bottlenecks, then compare recordings. Do not memorize a full corrected script.
        </p>
      </div>
    </div>
  );
}
