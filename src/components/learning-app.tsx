"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { lessons } from "@/content/days";
import { getAnyLesson, nextLessonAfter } from "@/content/all-lessons";
import { finalCourseDay } from "@/content/extended-lessons";
import { baselinePrompts, curriculumStages, milestones } from "@/content/roadmap";
import { extendedModules } from "@/content/extended";
import { pronunciationTrack } from "@/content/pronunciation";
import { cefrAssessments } from "@/content/assessments";
import { c1ExitListening, c1ExitReading, c1ExitSpeaking, c1ExitWriting } from "@/content/c1-exit-pack";
import { adaptivePriority, bumpSkillEstimate, canCompleteLesson, canStartLesson, checkExerciseAnswer, isObjectivelyScoredExercise, lessonAccuracy, normalizeAnswer, recurringErrors } from "@/lib/mastery";
import { createSrsItem, dueItems, masteredSrsCount, scheduleReview, type ReviewGrade } from "@/lib/srs";
import { markErrorCorrect, upsertError } from "@/lib/errors";
import { defaultState, loadState, resetState, saveState } from "@/lib/storage";
import { adaptivePrescription, checkpointPass, levelIndex, programProgress, readinessReport, stageIdForDay } from "@/lib/adaptive";
import { learnerProfile, personalizedStages, totalProgramTargets } from "@/content/personalized-program";
import { clearRecordingBlobs, loadRecordingBlob, saveRecordingBlob } from "@/lib/audio-store";
import { c1ExitEvidenceStatus } from "@/lib/c1-evidence";
import type { CheckpointAttempt, CheckpointLevel, Exercise, LearnerState, ListeningBlock, ReadingBlock, Skill, SpeakingRecord, SRSItem, VocabularyItem } from "@/lib/types";

type Tab =
  | "today"
  | "course"
  | "lesson"
  | "speaking"
  | "listening"
  | "vocabulary"
  | "grammar"
  | "reading"
  | "writing"
  | "review"
  | "errors"
  | "progress"
  | "tests"
  | "settings";

const nav: { id: Tab; label: string; icon: string }[] = [
  { id: "today", label: "Today", icon: "◉" },
  { id: "course", label: "Course", icon: "◇" },
  { id: "speaking", label: "Speaking", icon: "◌" },
  { id: "listening", label: "Listening", icon: "◍" },
  { id: "vocabulary", label: "Vocabulary", icon: "Aa" },
  { id: "grammar", label: "Grammar", icon: "⌁" },
  { id: "reading", label: "Reading", icon: "▤" },
  { id: "writing", label: "Writing", icon: "✎" },
  { id: "review", label: "Review", icon: "↻" },
  { id: "errors", label: "Error Bank", icon: "!" },
  { id: "progress", label: "Progress", icon: "↗" },
  { id: "tests", label: "Tests", icon: "✓" },
  { id: "settings", label: "Settings", icon: "⚙" }
];

const skillLabels: Record<Skill, string> = {
  speaking: "Speaking",
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  grammarProduction: "Grammar Production",
  grammarRecognition: "Grammar Recognition",
  vocabulary: "Vocabulary",
  pronunciation: "Pronunciation"
};

function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function expectedAnswer(exercise: Exercise): string | undefined {
  if (typeof exercise.answer === "string") return exercise.answer;
  if (Array.isArray(exercise.answer)) return exercise.answer[0];
  return exercise.acceptedAnswers?.[0] ?? exercise.modelAnswer;
}

function todayStreak(state: LearnerState): LearnerState {
  const today = dayKey();
  if (state.lastStudyDate === today) return state;

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = dayKey(yesterdayDate);

  return {
    ...state,
    streak: state.lastStudyDate === yesterday ? state.streak + 1 : 1,
    lastStudyDate: today
  };
}

function SectionTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress-track" aria-label={`${value}% progress`}>
      <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function speechChunks(text: string, maxChars = 220): string[] {
  const sentences = text.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (!sentence) continue;
    if (sentence.length > maxChars) {
      if (current) { chunks.push(current); current = ""; }
      const words = sentence.split(" ");
      let part = "";
      for (const word of words) {
        const candidate = part ? `${part} ${word}` : word;
        if (candidate.length > maxChars && part) { chunks.push(part); part = word; }
        else part = candidate;
      }
      if (part) chunks.push(part);
      continue;
    }
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxChars && current) { chunks.push(current); current = sentence; }
    else current = candidate;
  }
  if (current) chunks.push(current);
  return chunks.length ? chunks : [text];
}

function SpeakButton({ text, rate = 1, onFinished }: { text: string; rate?: number; onFinished?: () => void }) {
  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const chunks = speechChunks(text);

    const speakChunk = (index: number) => {
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = "en-US";
      utterance.rate = rate;
      utterance.onend = () => {
        if (index + 1 < chunks.length) speakChunk(index + 1);
        else onFinished?.();
      };
      window.speechSynthesis.speak(utterance);
    };

    speakChunk(0);
  };
  return <button className="btn small" onClick={speak}>▶ Hear</button>;
}

function Recorder({ onSave }: { onSave?: (durationSeconds: number, blob: Blob) => void }) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(0);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>();

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const start = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        onSave?.(secondsRef.current, blob);
      };
      recorder.start();
      recorderRef.current = recorder;
      secondsRef.current = 0;
      setSeconds(0);
      setRecording(true);
      intervalRef.current = setInterval(() => {
        secondsRef.current += 1;
        setSeconds(secondsRef.current);
      }, 1000);
    } catch {
      // Permission denied or unavailable. The activity remains visible, but speaking evidence cannot be credited without a timed recording.
    }
  };

  const stop = () => {
    recorderRef.current?.stop();
    recorderRef.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRecording(false);
  };

  return (
    <div className="recorder">
      {!recording ? (
        <button className="btn small" onClick={start}>● Record</button>
      ) : (
        <button className="btn small danger" onClick={stop}>■ Stop</button>
      )}
      <span className="timer">{seconds}s</span>
      {audioUrl ? <audio controls src={audioUrl} /> : null}
    </div>
  );
}

function StoredRecording({ recordId }: { recordId: string }) {
  const [url, setUrl] = useState<string>();
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl: string | undefined;
    loadRecordingBlob(recordId)
      .then((blob) => {
        if (!active) return;
        if (!blob) {
          setMissing(true);
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => active && setMissing(true));
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [recordId]);

  if (url) return <audio controls src={url} />;
  return <span className="small muted">{missing ? "Audio file unavailable on this browser" : "Loading audio…"}</span>;
}

function ExerciseCard({
  exercise,
  result,
  onSubmit,
  onSpeakingSaved
}: {
  exercise: Exercise;
  result?: LearnerState["exerciseResults"][string];
  onSubmit: (exercise: Exercise, answer: string, responseMs?: number) => void;
  onSpeakingSaved?: (exercise: Exercise, duration: number, blob: Blob) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [showModel, setShowModel] = useState(false);

  const isSpeaking = ["speaking-prompt", "shadowing", "timed-response"].includes(exercise.type);
  const isLong = ["free-writing", "summary", "argumentation", "paraphrasing"].includes(exercise.type) || isSpeaking;
  const isObjective = isObjectivelyScoredExercise(exercise);
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).filter(Boolean).length : 0;
  const belowMinimum = !isSpeaking && Boolean(exercise.minWords) && wordCount < (exercise.minWords ?? 0);

  const submit = () => {
    if (!answer.trim() && !isSpeaking) return;
    if (belowMinimum) return;
    const payload = answer.trim() || "Completed spoken attempt";
    onSubmit(exercise, payload, Date.now() - startedAt);
    if (exercise.modelAnswer) setShowModel(true);
  };

  return (
    <div className="exercise">
      <div className="prompt">{exercise.prompt}</div>
      {exercise.instructionThai ? <div className="instruction">{exercise.instructionThai}</div> : null}
      {exercise.seconds ? <div className="pill accent" style={{ marginTop: 8 }}>Target: {exercise.seconds}s</div> : null}

      {exercise.choices ? (
        <div className="choice-wrap">
          {exercise.choices.map((choice) => (
            <button
              key={choice.value}
              className={`choice ${answer === choice.value ? "selected" : ""}`}
              onClick={() => setAnswer(choice.value)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      ) : null}

      {isSpeaking ? (
        <Recorder onSave={(duration, blob) => onSpeakingSaved?.(exercise, duration, blob)} />
      ) : null}

      {!exercise.choices ? (
        isLong ? (
          <textarea
            rows={isSpeaking ? 3 : 5}
            value={answer}
            placeholder={isSpeaking ? "Optional: type what you said for self-check..." : "Type your answer..."}
            onChange={(event) => setAnswer(event.target.value)}
          />
        ) : (
          <input
            value={answer}
            placeholder="Type your answer..."
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit();
            }}
          />
        )
      ) : null}

      {exercise.minWords && !isSpeaking ? <div className={`small ${belowMinimum ? "muted" : "emphasis"}`}>Word count: {wordCount}/{exercise.minWords} minimum</div> : null}

      <div className="top-actions" style={{ marginTop: 10 }}>
        <button className="btn primary small" onClick={submit} disabled={belowMinimum}>
          {isSpeaking ? "Mark attempt complete" : isObjective ? "Check answer" : "Save response"}
        </button>
        {exercise.modelAnswer && result ? (
          <button className="btn ghost small" onClick={() => setShowModel((value) => !value)}>
            {showModel ? "Hide model" : "Show model"}
          </button>
        ) : null}
      </div>

      {result ? (
        <div className={`feedback ${!isObjective || result.correct ? "correct" : "incorrect"}`}>
          <strong>{!isObjective ? "Attempt saved — this open response is not auto-scored" : result.correct ? "Correct" : "Needs correction"}</strong>
          {isObjective && !result.correct && expectedAnswer(exercise) ? <>Target: {expectedAnswer(exercise)}</> : null}
          {exercise.explanationThai ? <div>{exercise.explanationThai}</div> : null}
          {exercise.pattern ? <div><b>Pattern:</b> {exercise.pattern}</div> : null}
        </div>
      ) : null}

      {showModel && exercise.modelAnswer ? (
        <div className="feedback correct"><strong>Model answer</strong>{exercise.modelAnswer}</div>
      ) : null}
    </div>
  );
}

function VocabularyCard({
  item,
  rate,
  isInReview,
  onAddReview
}: {
  item: VocabularyItem;
  rate: number;
  isInReview: boolean;
  onAddReview: (item: VocabularyItem) => void;
}) {
  return (
    <div className="card flat vocab-card">
      <div className="lesson-header">
        <div>
          <h4>{item.wordOrChunk}</h4>
          <div className="thai">{item.meaningThai}</div>
        </div>
        <SpeakButton text={item.wordOrChunk} rate={rate} />
      </div>
      <p>{item.definitionEnglish}</p>
      {item.examples.slice(0, 2).map((example) => <div className="example" key={example}>{example}</div>)}
      {item.collocations?.length ? <p className="small"><b>Chunks:</b> {item.collocations.join(" · ")}</p> : null}
      {item.commonMistakes?.length ? <p className="small"><b>Avoid:</b> {item.commonMistakes.join(" · ")}</p> : null}
      <button
        className={`btn small ${isInReview ? "success" : ""}`}
        onClick={() => onAddReview(item)}
        disabled={isInReview}
        aria-pressed={isInReview}
      >
        {isInReview ? "✓ Added to review" : "＋ Add to review"}
      </button>
    </div>
  );
}


function SrsReviewCard({
  item,
  onGrade
}: {
  item: SRSItem;
  onGrade: (id: string, grade: ReviewGrade, responseMs: number) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const startedAt = useRef(Date.now());
  const responseMs = Math.max(1, Date.now() - startedAt.current);
  const correct = submitted && normalizeAnswer(answer) === normalizeAnswer(item.answer);

  const directionLabel: Record<SRSItem["direction"], string> = {
    "thai-to-english": "Thai → English",
    "english-to-meaning": "English → meaning",
    "fill-blank": "Fill the blank",
    speak: "Speak",
    create: "Create a sentence"
  };

  return (
    <div className="exercise">
      <div className="small muted">{directionLabel[item.direction]}</div>
      <div className="prompt">{item.prompt}</div>
      <input
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && answer.trim()) setSubmitted(true);
        }}
        placeholder="Recall first, then check..."
        disabled={submitted}
      />
      {!submitted ? (
        <button className="btn primary small" onClick={() => setSubmitted(true)} disabled={!answer.trim()}>
          Check recall
        </button>
      ) : (
        <>
          <div className={`feedback ${correct ? "correct" : "incorrect"}`}>
            <strong>{correct ? "Correct recall" : "Compare and correct"}</strong>
            Target: {item.answer}
          </div>
          <div className="choice-wrap">
            {([1, 3, 4, 5] as ReviewGrade[]).map((grade) => {
              const blocked = !correct && grade >= 4;
              return (
                <button
                  className="choice"
                  key={grade}
                  disabled={blocked}
                  onClick={() => onGrade(item.id, grade, responseMs)}
                >
                  {grade === 1 ? "Forgot" : grade === 3 ? "Hard" : grade === 4 ? "Good" : "Easy"}
                </button>
              );
            })}
          </div>
          <div className="small muted">Response time: {(responseMs / 1000).toFixed(1)}s</div>
        </>
      )}
    </div>
  );
}

function ListeningCard({
  block,
  rate,
  results,
  onSubmit,
  onListeningFinished,
  completed = false
}: {
  block: ListeningBlock;
  rate: number;
  results: LearnerState["exerciseResults"];
  onSubmit: (exercise: Exercise, answer: string, responseMs?: number) => void;
  onListeningFinished?: (block: ListeningBlock) => void;
  completed?: boolean;
}) {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="card card-pad">
      <div className="lesson-header">
        <div>
          <span className="kicker">Original listening</span>
          <h3>{block.title}</h3>
        </div>
        <SpeakButton text={block.script} rate={rate} onFinished={() => onListeningFinished?.(block)} />
      </div>

      <p><b>First listen:</b> {block.firstListenQuestion}</p>
      <p className="muted small">ฟังก่อนโดยไม่เปิด transcript แล้วจับใจความรวม จากนั้นฟังรอบสองเพื่อเก็บรายละเอียด</p>

      <div className="audio-controls">
        <button className="btn small" onClick={() => setShowTranscript((value) => !value)} disabled={!completed}>
          {!completed ? "Finish first listen to unlock transcript" : showTranscript ? "Hide transcript" : "Third listen: show transcript"}
        </button>
      </div>

      {showTranscript ? (
        <>
          <div className="transcript">{block.script}</div>
          <div className="section">
            <div className="small emphasis">Connected speech notes</div>
            {block.connectedSpeechNotes.map((note) => <div className="example" key={note}>{note}</div>)}
          </div>
        </>
      ) : null}

      <div className="section">
        <h4>Detail check</h4>
        {block.detailQuestions.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} result={results[exercise.id]} onSubmit={onSubmit} />
        ))}
      </div>
    </div>
  );
}

function ReadingCard({
  block,
  results,
  onSubmit
}: {
  block: ReadingBlock;
  results: LearnerState["exerciseResults"];
  onSubmit: (exercise: Exercise, answer: string, responseMs?: number) => void;
}) {
  return (
    <div className="card card-pad">
      <span className="kicker">Reading</span>
      <h3>{block.title}</h3>
      <div className="transcript">{block.text}</div>
      <div className="section">
        {block.questions.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} result={results[exercise.id]} onSubmit={onSubmit} />
        ))}
      </div>
    </div>
  );
}

function PageTop({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="topbar">
      <div>
        <div className="kicker">{kicker}</div>
        <h1>{title}</h1>
      </div>
      {children ? <div className="top-actions">{children}</div> : null}
    </div>
  );
}

function CheckpointScorer({
  level,
  onSave,
  locked = false,
  lockReason
}: {
  level: CheckpointLevel;
  onSave: (attempt: CheckpointAttempt) => void;
  locked?: boolean;
  lockReason?: string;
}) {
  const dimensions: { key: keyof CheckpointAttempt["scores"]; label: string }[] = [
    { key: "speaking", label: "Speaking: range · accuracy · fluency · coherence" },
    { key: "listening", label: "Listening: gist · detail · inference · attitude" },
    { key: "reading", label: "Reading: argument · inference · tone · synthesis" },
    { key: "writing", label: "Writing: organization · cohesion · precision · register" },
    { key: "languageUse", label: "Language use: grammar · collocation · lexical precision" },
    { key: "interaction", label: "Interaction: turn-taking · clarification · reformulation · follow-up" }
  ];
  const [scores, setScores] = useState<CheckpointAttempt["scores"]>({
    speaking: 3,
    listening: 3,
    reading: 3,
    writing: 3,
    languageUse: 3,
    interaction: 3
  });
  const [evaluator, setEvaluator] = useState<CheckpointAttempt["evaluator"]>("self");
  const [evaluatorName, setEvaluatorName] = useState("");
  const [notes, setNotes] = useState("");
  const passed = checkpointPass(scores, level);
  const independentFinal = level !== "C1" || (evaluator !== "self" && evaluatorName.trim().length >= 2);

  const save = () => {
    onSave({
      id: `checkpoint-${level}-${Date.now()}`,
      level,
      createdAt: new Date().toISOString(),
      scores,
      passed,
      evaluator,
      evaluatorName: evaluator !== "self" ? evaluatorName.trim() || undefined : undefined,
      notes: notes.trim() || undefined
    });
  };

  return (
    <details className="card card-pad checkpoint-card">
      <summary className="checkpoint-summary">
        <div>
          <span className="pill accent">{level}</span>
          <strong>{level} rubric scoring</strong>
        </div>
        <span className={`pill ${passed && independentFinal ? "success" : ""}`}>{passed ? (independentFinal ? "Rubric pass" : "Score passes · independent check required") : "Below gate"}</span>
      </summary>
      <p className="muted small">
        Score the actual integrated checkpoint performance from 1–5. Self-rating is useful for practice, but final C1 readiness requires an independent qualified evaluator. A future connected AI evaluator can be enabled only when a real provider is configured.
      </p>
      <div className="stack">
        {dimensions.map(({ key, label }) => (
          <label key={key} className="rubric-row">
            <span>{label}</span>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={scores[key]}
              onChange={(event) => setScores((prev) => ({ ...prev, [key]: Number(event.target.value) }))}
            />
            <b>{scores[key].toFixed(1)}</b>
          </label>
        ))}
      </div>
      <div className="grid-2 section">
        <label>
          <span className="small muted">Evaluator</span>
          <select className="field" value={evaluator} onChange={(event) => setEvaluator(event.target.value as CheckpointAttempt["evaluator"])}>
            <option value="self">Self-assessment (practice evidence only for C1)</option>
            <option value="teacher">Teacher / qualified human evaluator</option>
          </select>
        </label>
        {evaluator !== "self" ? (
          <label>
            <span className="small muted">Independent evaluator name</span>
            <input className="field" value={evaluatorName} onChange={(event) => setEvaluatorName(event.target.value)} placeholder="Name / assessor identifier" />
          </label>
        ) : (
          <label>
            <span className="small muted">Evidence notes</span>
            <input className="field" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="What task was assessed? What still broke down?" />
          </label>
        )}
      </div>
      {evaluator !== "self" ? (
        <label className="section" style={{ display: "block" }}>
          <span className="small muted">Evaluator evidence notes</span>
          <input className="field" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Tasks reviewed, evidence quality, weaknesses, follow-up notes" />
        </label>
      ) : null}
      {locked && lockReason ? <div className="feedback incorrect"><strong>Checkpoint locked.</strong>{lockReason}</div> : null}
      {level === "C1" && evaluator !== "self" && evaluatorName.trim().length < 2 ? <div className="feedback incorrect"><strong>Evaluator identity required.</strong>Enter the independent assessor&apos;s name or identifier before saving final C1 evidence.</div> : null}
      <button className="btn primary" onClick={save} disabled={locked || (level === "C1" && evaluator !== "self" && evaluatorName.trim().length < 2)}>Save {level} checkpoint evidence</button>
    </details>
  );
}

export function LearningApp() {
  const [tab, setTab] = useState<Tab>("today");
  const [learner, setLearner] = useState<LearnerState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setLearner(loadState());
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = learner.settings.theme;
    document.documentElement.style.fontSize = `${learner.settings.textScale * 100}%`;
    saveState(learner);
  }, [learner, hydrated]);

  const lesson = getAnyLesson(learner.currentLessonId);
  const prescription = useMemo(() => adaptivePrescription(learner, lesson.day), [learner, lesson.day]);
  const overallProgramProgress = useMemo(() => programProgress(learner), [learner]);
  const due = useMemo(() => dueItems(learner.srsItems), [learner.srsItems]);
  const topErrors = useMemo(() => recurringErrors(learner), [learner]);
  const errorReviewExercises = useMemo<Exercise[]>(() =>
    learner.errorBank.slice(0, 5).map((record) => ({
      id: `error-review-${record.id}`,
      type: "error-correction",
      prompt: `Correct your earlier sentence: ${record.original}`,
      answer: record.corrected,
      explanationThai: record.explanationThai,
      targetSkill: "grammarProduction",
      tags: [record.category]
    })), [learner.errorBank]);
  const accuracy = lessonAccuracy(learner, lesson);
  const completionReady = canCompleteLesson(learner, lesson);
  const macroSkills: Skill[] = ["speaking", "listening", "reading", "writing"];
  const weakestMacro = [...macroSkills].sort((a, b) => {
    const levelDiff = levelIndex(learner.skillEstimates[a].level) - levelIndex(learner.skillEstimates[b].level);
    return levelDiff || learner.skillEstimates[a].progress - learner.skillEstimates[b].progress;
  })[0];
  const currentMacroEstimate = learner.skillEstimates[weakestMacro];
  const guidedHours = learner.evidence.structuredMinutes / 60;
  const c1Evidence = useMemo(() => c1ExitEvidenceStatus(learner), [learner]);
  const c1ExitAnswered = c1Evidence.answeredTasks;
  const c1ExitSpeakingRecorded = c1Evidence.speakingRecorded;
  const c1ExitListeningCompleted = c1Evidence.listeningCompleted;
  const c1ExitLongestSpeaking = c1Evidence.longestSpeakingSeconds;
  const c1ExitEvidenceComplete = c1Evidence.complete;

  const updateLearner = (fn: (prev: LearnerState) => LearnerState) => {
    setLearner((prev) => {
      const next = fn(prev);
      return next;
    });
  };

  const selectLesson = (lessonId: string) => {
    const targetLesson = getAnyLesson(lessonId);
    if (!canStartLesson(learner, targetLesson)) return;
    updateLearner((prev) => ({ ...prev, currentLessonId: lessonId }));
    setTab("lesson");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitExercise = (exercise: Exercise, answer: string, responseMs?: number) => {
    const correct = checkExerciseAnswer(exercise, answer);
    const score = correct ? 1 : 0;

    updateLearner((prev) => {
      let next = todayStreak(prev);
      const firstAttempt = !prev.exerciseResults[exercise.id];
      next = {
        ...next,
        xp: next.xp + (firstAttempt ? (correct ? 12 : 5) : correct ? 3 : 1),
        exerciseResults: {
          ...next.exerciseResults,
          [exercise.id]: { correct, score, answer, responseMs, answeredAt: new Date().toISOString() }
        }
      };

      const hasObjectiveScoring = isObjectivelyScoredExercise(exercise);
      if (hasObjectiveScoring) next = bumpSkillEstimate(next, exercise.targetSkill, score);

      if (correct && exercise.id.startsWith("error-review-")) {
        const errorId = exercise.id.replace("error-review-", "");
        next = { ...next, errorBank: markErrorCorrect(next.errorBank, errorId) };
      }

      if (!correct) {
        const target = expectedAnswer(exercise);
        if (target) {
          const category =
            exercise.tags?.[0] ??
            (exercise.targetSkill === "grammarProduction" ? "Grammar Production" :
             exercise.targetSkill === "listening" ? "Listening Decoding" :
             exercise.targetSkill === "reading" ? "Reading Comprehension" : skillLabels[exercise.targetSkill]);

          next = {
            ...next,
            errorBank: upsertError(next.errorBank, {
              original: answer,
              corrected: target,
              category,
              explanationThai: exercise.explanationThai ?? "ทบทวน pattern นี้และลองสร้างประโยคใหม่ด้วยตัวเอง",
              severity: exercise.targetSkill === "grammarProduction" ? "high" : "medium"
            })
          };
        }
      }

      return next;
    });
  };

  const addVocabularyReview = (item: VocabularyItem) => {
    updateLearner((prev) => {
      if (prev.srsItems.some((srs) => srs.sourceId === item.id)) return prev;
      const prompt = item.meaningThai;
      const review = createSrsItem(item.id, prompt, item.wordOrChunk);
      return { ...prev, srsItems: [review, ...prev.srsItems], xp: prev.xp + 2 };
    });
  };

  const gradeReview = (id: string, grade: ReviewGrade, responseMs: number) => {
    updateLearner((prev) => {
      const srsItems = prev.srsItems.map((item) => item.id === id ? scheduleReview(item, grade, responseMs) : item);
      return {
        ...prev,
        srsItems,
        masteredChunks: masteredSrsCount(srsItems),
        xp: prev.xp + (grade >= 4 ? 8 : 3)
      };
    });
  };

  const markLessonListeningFinished = (block: ListeningBlock) => {
    if (learner.settings.audioRate < 0.9) return;
    const id = `${lesson.id}-listening-${block.id}`;
    updateLearner((prev) => prev.completedActivityIds.includes(id) ? prev : { ...prev, completedActivityIds: [...prev.completedActivityIds, id] });
  };

  const markC1ListeningFinished = (block: ListeningBlock) => {
    const id = `c1-exit-listening-${block.id}`;
    updateLearner((prev) => prev.completedActivityIds.includes(id) ? prev : { ...prev, completedActivityIds: [...prev.completedActivityIds, id], xp: prev.xp + 10 });
  };

  const saveSpeakingRecord = async (exercise: Exercise, duration: number, blob: Blob) => {
    const recordId = `speaking-${Date.now()}`;
    try {
      await saveRecordingBlob(recordId, blob);
    } catch {
      return;
    }
    updateLearner((prev) => {
      const record: SpeakingRecord = {
        id: recordId,
        lessonId: lesson.id,
        prompt: exercise.prompt,
        durationSeconds: duration,
        createdAt: new Date().toISOString(),
        selfRating: 3
      };
      const speakingMinutes = duration / 60;
      const next = todayStreak(prev);
      return {
        ...next,
        speakingRecords: [record, ...prev.speakingRecords],
        evidence: {
          ...prev.evidence,
          unscriptedSpeakingMinutes: prev.evidence.unscriptedSpeakingMinutes + speakingMinutes
        },
        xp: prev.xp + Math.min(20, Math.max(3, Math.round(duration / 3)))
      };
    });
  };

  const saveAssessmentSpeakingRecord = async (exercise: Exercise, duration: number, blob: Blob) => {
    const recordId = `c1-speaking-${Date.now()}`;
    try {
      await saveRecordingBlob(recordId, blob);
    } catch {
      return;
    }
    updateLearner((prev) => {
      const record: SpeakingRecord = {
        id: recordId,
        lessonId: "c1-exit-assessment",
        prompt: exercise.prompt,
        durationSeconds: duration,
        createdAt: new Date().toISOString(),
        selfRating: 3
      };
      return {
        ...todayStreak(prev),
        speakingRecords: [record, ...prev.speakingRecords],
        evidence: {
          ...prev.evidence,
          unscriptedSpeakingMinutes: prev.evidence.unscriptedSpeakingMinutes + duration / 60
        },
        xp: prev.xp + Math.min(30, Math.max(5, Math.round(duration / 5)))
      };
    });
  };


  const saveBaselineSpeakingRecord = async (prompt: string, duration: number, blob: Blob) => {
    const recordId = `baseline-speaking-${Date.now()}`;
    try {
      await saveRecordingBlob(recordId, blob);
    } catch {
      return;
    }
    updateLearner((prev) => ({
      ...todayStreak(prev),
      speakingRecords: [{
        id: recordId,
        lessonId: "baseline-retest",
        prompt,
        durationSeconds: duration,
        createdAt: new Date().toISOString(),
        selfRating: 3
      }, ...prev.speakingRecords],
      xp: prev.xp + 5
    }));
  };

  const markMissionComplete = () => {
    if (!lesson.realWorldMission) return;
    const missionId = `${lesson.id}-mission`;
    updateLearner((prev) => {
      if (prev.completedActivityIds.includes(missionId)) return prev;
      return {
        ...todayStreak(prev),
        completedActivityIds: [...prev.completedActivityIds, missionId],
        evidence: {
          ...prev.evidence,
          realWorldMissionsCompleted: prev.evidence.realWorldMissionsCompleted + 1
        },
        xp: prev.xp + 25
      };
    });
  };

  const completeCurrentLesson = () => {
    if (!completionReady) return;
    updateLearner((prev) => {
      const alreadyCompleted = prev.completedLessonIds.includes(lesson.id);
      const ids = alreadyCompleted ? prev.completedLessonIds : [...prev.completedLessonIds, lesson.id];
      const nextLesson = nextLessonAfter(lesson.day);
      if (alreadyCompleted) {
        return { ...prev, currentLessonId: nextLesson?.id ?? lesson.id };
      }

      const stageId = stageIdForDay(lesson.day);
      const allocation = adaptivePrescription(prev, lesson.day, lesson.estimatedMinutes).minutesBySkill;
      const writingIds = lesson.writing?.map((exercise) => exercise.id) ?? [];
      const writingWords = writingIds.reduce((sum, id) => {
        const text = prev.exerciseResults[id]?.answer ?? "";
        return sum + text.trim().split(/\s+/).filter(Boolean).length;
      }, 0);
      const readingWords = (lesson.reading ?? []).reduce((sum, block) => sum + block.text.trim().split(/\s+/).filter(Boolean).length, 0);
      const isNormalSpeed = prev.settings.audioRate >= 0.9;
      const listeningCompleted = lesson.listening.every((block) => prev.completedActivityIds.includes(`${lesson.id}-listening-${block.id}`));
      const plannedListening = allocation.listening;

      return {
        ...prev,
        completedLessonIds: ids,
        currentLessonId: nextLesson?.id ?? lesson.id,
        weeklyMinutes: prev.weeklyMinutes + lesson.estimatedMinutes,
        evidence: {
          ...prev.evidence,
          structuredMinutes: prev.evidence.structuredMinutes + lesson.estimatedMinutes,
          skillMinutes: (Object.keys(prev.evidence.skillMinutes) as Skill[]).reduce((acc, skill) => {
            acc[skill] = prev.evidence.skillMinutes[skill] + allocation[skill];
            return acc;
          }, { ...prev.evidence.skillMinutes }),
          stageMinutes: {
            ...prev.evidence.stageMinutes,
            [stageId]: prev.evidence.stageMinutes[stageId] + lesson.estimatedMinutes
          },
          listeningAtNormalSpeedMinutes: prev.evidence.listeningAtNormalSpeedMinutes + (isNormalSpeed && listeningCompleted ? plannedListening : 0),
          writingWords: prev.evidence.writingWords + writingWords,
          readingWords: prev.evidence.readingWords + readingWords,
          realWorldMissionsCompleted: prev.evidence.realWorldMissionsCompleted
        },
        xp: prev.xp + 80
      };
    });
    setTab("today");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveCheckpointAttempt = (attempt: CheckpointAttempt) => {
    updateLearner((prev) => {
      const next = {
        ...prev,
        checkpointAttempts: [attempt, ...prev.checkpointAttempts.filter((item) => item.id !== attempt.id)],
        xp: prev.xp + (attempt.passed ? 120 : 35)
      };
      const independentlyVerified = attempt.evaluator === "teacher" && Boolean(attempt.evaluatorName?.trim());
      if (!attempt.passed || !independentlyVerified) return next;

      const promote = (skill: Skill) => {
        const current = next.skillEstimates[skill];
        if (levelIndex(current.level) >= levelIndex(attempt.level)) return current;
        return { level: attempt.level, progress: 0 };
      };

      return {
        ...next,
        skillEstimates: {
          ...next.skillEstimates,
          speaking: promote("speaking"),
          listening: promote("listening"),
          reading: promote("reading"),
          writing: promote("writing"),
          grammarProduction: promote("grammarProduction"),
          vocabulary: promote("vocabulary")
        }
      };
    });
  };

  const reset = () => {
    void clearRecordingBlobs();
    const fresh = resetState();
    setLearner(fresh);
    setTab("today");
  };

  const content = (() => {
    switch (tab) {
      case "today":
        return (
          <>
            <PageTop kicker="Personal English OS" title="Today">
              <span className="pill">🔥 {learner.streak} day streak</span>
              <span className="pill accent">{learner.xp} XP</span>
            </PageTop>

            <div className="card hero">
              <div>
                <div className="kicker">Today&apos;s mission · Day {lesson.day}</div>
                <h2>{lesson.title}</h2>
                <p>
                  {lesson.focus}. Your priority is not memorizing more rules — it is turning useful English into
                  language you can retrieve and speak automatically.
                </p>
                <div className="top-actions">
                  <button className="btn primary" onClick={() => setTab("lesson")}>Start Day {lesson.day}</button>
                  <span className="pill">≈ {lesson.estimatedMinutes} min structured study</span>
                </div>
              </div>
              <div className="hero-side">
                <div>
                  <div className="small muted">Current priority</div>
                  <h3>{adaptivePriority(learner)}</h3>
                </div>
                <div>
                  <div className="small muted">First major milestone</div>
                  <div className="emphasis">Speak continuously for 30 seconds</div>
                </div>
              </div>
            </div>

            <div className="section card card-pad">
              <SectionTitle title="Why today's plan is personalized to you" subtitle="The engine starts from your diagnostic profile, then adapts from real errors and performance." />
              <div className="grid-2">
                <div>
                  <div className="small emphasis">Your starting pattern</div>
                  <p className="muted">Speaking {learnerProfile.diagnostic.speaking}; grammar recognition is stronger than grammar production. The system therefore spends more time on retrieval, sentence production and speaking than on rule memorization.</p>
                </div>
                <div>
                  <div className="small emphasis">Your real contexts</div>
                  <p className="muted">{learnerProfile.motivatingDomains.slice(0, 7).join(" · ")} — while still forcing broad general English so C1 is not limited to technology topics.</p>
                </div>
              </div>
            </div>

            <div className="section grid-4">
              <div className="stat"><div className="label">Weakest macro skill</div><div className="value">{currentMacroEstimate.level}</div><div className="sub">{skillLabels[weakestMacro]} · promotion follows the weakest important skill</div></div>
              <div className="stat"><div className="label">Course days</div><div className="value">{learner.completedLessonIds.length}/{finalCourseDay}</div><div className="sub">14 foundation + 210 post-foundation days</div></div>
              <div className="stat"><div className="label">Structured evidence</div><div className="value">{guidedHours.toFixed(1)}h</div><div className="sub">workload floor ≈ {totalProgramTargets.guidedHoursFloor}h; mastery still decides promotion</div></div>
              <div className="stat"><div className="label">C1 pathway progress</div><div className="value">{overallProgramProgress}%</div><div className="sub">hours + skill profile + passed checkpoints</div></div>
            </div>

            <div className="section card card-pad">
              <SectionTitle title="Your adaptive prescription" subtitle={`Built from your weakest skills, passive→active grammar gap, and Error Bank · ${prescription.totalMinutes} min target`} />
              <div className="grid-4">
                {(Object.keys(prescription.minutesBySkill) as Skill[]).map((skill) => (
                  <div className="stat compact" key={skill}>
                    <div className="label">{skillLabels[skill]}</div>
                    <div className="value" style={{ fontSize: 22 }}>{prescription.minutesBySkill[skill]}m</div>
                  </div>
                ))}
              </div>
              <div className="grid-2 section">
                <div>
                  <div className="small emphasis">Why today is weighted this way</div>
                  <ul>{prescription.priorities.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div>
                  <div className="small emphasis">Immersion outside the structured block</div>
                  <ul>{prescription.immersion.map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
              </div>
              {prescription.warning ? <div className="feedback incorrect"><strong>Do not grind more hours blindly.</strong>{prescription.warning}</div> : null}
            </div>

            <div className="section grid-2">
              <div className="card card-pad">
                <SectionTitle title="Today's work" subtitle="2–4 hours structured, with speaking first." />
                <ul className="mission-list">
                  {[
                    ["Retrieval warm-up", lesson.warmup.reduce((s, a) => s + a.estimatedMinutes, 0)],
                    ["Vocabulary & chunks", 15],
                    ["Grammar in context", lesson.grammar.reduce((s, a) => s + a.estimatedMinutes, 0)],
                    ["Listening", 30],
                    ["Speaking ladder", 30],
                    ["Reading", lesson.reading?.length ? 20 : 0],
                    ["Writing", lesson.writing?.length ? 20 : 0],
                    ["Review + exit check", 15]
                  ].filter(([, mins]) => Number(mins) > 0).map(([label, mins]) => (
                    <li className="mission-item" key={String(label)}>
                      <span className={`check ${learner.completedLessonIds.includes(lesson.id) ? "done" : ""}`}>
                        {learner.completedLessonIds.includes(lesson.id) ? "✓" : ""}
                      </span>
                      <span style={{ flex: 1 }}>{label}</span>
                      <span className="small muted">{mins} min</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card card-pad">
                <SectionTitle title="Current weaknesses" subtitle="Practice adapts from errors and skill estimates." />
                {topErrors.length ? (
                  <div className="stack">
                    {topErrors.map((item, index) => (
                      <div key={item.category}>
                        <div className="lesson-header">
                          <span>{index + 1}. {item.category}</span>
                          <b>{item.count}</b>
                        </div>
                        <ProgressBar value={Math.min(100, item.count * 8)} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty">No personal errors logged yet. The system will build this list from your real answers.</div>
                )}
              </div>
            </div>

            <div className="section card card-pad">
              <SectionTitle title="Skill map" subtitle="Recognition and production are tracked separately." right={<button className="btn small" onClick={() => setTab("progress")}>Full progress</button>} />
              {(Object.keys(learner.skillEstimates) as Skill[]).map((skill) => {
                const estimate = learner.skillEstimates[skill];
                return (
                  <div className="skill-row" key={skill}>
                    <div className="skill-name">{skillLabels[skill]}</div>
                    <div className="pill">{estimate.level}</div>
                    <ProgressBar value={estimate.progress} />
                    <div className="small muted">{estimate.progress}%</div>
                  </div>
                );
              })}
            </div>
          </>
        );

      case "course":
        return (
          <>
            <PageTop kicker="A1+/A2 → C1" title="Course" />
            <div className="card card-pad">
              <SectionTitle title="First 14 days" subtitle="Complete learning block — not placeholder lessons." />
              <div className="lesson-list">
                {lessons.map((item) => (
                  <button key={item.id} className="lesson-row" onClick={() => selectLesson(item.id)} disabled={!canStartLesson(learner, item)}>
                    <div className="day-badge">{item.day}</div>
                    <div style={{ textAlign: "left" }}>
                      <h4>{item.title}</h4>
                      <p>{item.focus} · {item.estimatedMinutes} min · {item.cefrLevel}</p>
                    </div>
                    <span className={`pill ${learner.completedLessonIds.includes(item.id) ? "success" : ""}`}>
                      {learner.completedLessonIds.includes(item.id) ? "Completed" : canStartLesson(learner, item) ? "Open" : "Locked"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="section">
              <SectionTitle title="Your personalized workload floors" subtitle="Time prevents under-training; it never overrides the mastery gate." />
              <div className="grid-2">
                {personalizedStages.map((stage) => {
                  const stageHours = learner.evidence.stageMinutes[stage.id] / 60;
                  return (
                    <div className="card roadmap-stage" key={stage.id}>
                      <div className="lesson-header">
                        <div>
                          <span className="pill accent">{stage.targetRange}</span>
                          <h3>{stage.label}</h3>
                        </div>
                        <div className="stat compact">
                          <div className="label">Evidence</div>
                          <div className="value" style={{ fontSize: 20 }}>{stageHours.toFixed(1)}h</div>
                          <div className="sub">floor {stage.guidedHoursFloor}h · target {stage.guidedHoursTarget}h</div>
                        </div>
                      </div>
                      <ProgressBar value={Math.min(100, stageHours / stage.guidedHoursTarget * 100)} />
                      <div className="small emphasis" style={{ marginTop: 14 }}>Exit evidence</div>
                      <ul>{stage.exitEvidence.map((item) => <li key={item}>{item}</li>)}</ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="section">
              <SectionTitle title="Full CEFR roadmap" subtitle="Progression is capability-based, not time-based." />
              <div className="grid-2">
                {curriculumStages.map((stage) => (
                  <div className="card roadmap-stage" key={stage.id}>
                    <span className="pill accent">{stage.transition}</span>
                    <h3>{stage.name}</h3>
                    <p className="muted">{stage.outcome}</p>
                    <div className="small emphasis">Capability targets</div>
                    <ul>{stage.capabilities.slice(0, 5).map((x) => <li key={x}>{x}</li>)}</ul>
                    <div className="small emphasis">Mastery gate</div>
                    <ul>{stage.masteryGate.map((x) => <li key={x}>{x}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <SectionTitle title="30 modules · 210 playable days after Day 14" subtitle="Each module is a seven-day cycle: launch → automaticity → listening → speaking → reading/writing → real-world transfer → mastery gate." />
              <div className="lesson-list">
                {extendedModules.map((module, index) => {
                  const startDay = 15 + index * 7;
                  const endDay = startDay + 6;
                  const ids = Array.from({ length: 7 }, (_, offset) => `ext-day-${startDay + offset}`);
                  const completed = ids.filter((id) => learner.completedLessonIds.includes(id)).length;
                  return (
                    <button className="lesson-row" key={module.id} onClick={() => selectLesson(`ext-day-${startDay}`)} disabled={!canStartLesson(learner, getAnyLesson(`ext-day-${startDay}`))}>
                      <div className="day-badge">{startDay}–{endDay}</div>
                      <div style={{ textAlign: "left" }}>
                        <h4>{module.level} · {module.title}</h4>
                        <p>{module.communicativeOutcome}</p>
                        <div className="top-actions" style={{ marginTop: 8 }}>
                          <span className="pill">Speaking: {module.speakingChallenge}</span>
                          <span className="pill">Gate: {module.masteryGate}</span>
                        </div>
                      </div>
                      <span className={`pill ${completed === 7 ? "success" : "accent"}`}>{completed}/7 days</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        );

      case "lesson":
        return (
          <>
            <PageTop kicker={`Day ${lesson.day} · ${lesson.cefrLevel}`} title={lesson.title}>
              <button className="btn" onClick={() => setTab("course")}>Course map</button>
            </PageTop>

            <div className="card card-pad">
              <div className="lesson-header">
                <div>
                  <span className="pill accent">{lesson.stage}</span>
                  <h2>{lesson.focus}</h2>
                  <div className="muted">Priority: {skillLabels[lesson.prioritySkill]} · ≈ {lesson.estimatedMinutes} min</div>
                </div>
                <div style={{ minWidth: 220 }}>
                  <div className="small muted">Measured lesson accuracy</div>
                  <div style={{ fontSize: 26, fontWeight: 800 }}>{Math.round(accuracy * 100)}%</div>
                  <ProgressBar value={accuracy * 100} />
                </div>
              </div>
              <ul className="objectives">{lesson.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
            </div>

            <div className="section">
              <SectionTitle title="1. Retrieval warm-up" subtitle="Recall first. Do not simply reread." />
              <div className="stack">
                {lesson.warmup.map((activity) => (
                  <div className="card activity-card" key={activity.id}>
                    <h3>{activity.title}</h3>
                    {activity.instructionsThai ? <p>{activity.instructionsThai}</p> : null}
                    {activity.exercises?.map((exercise) => (
                      <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} onSpeakingSaved={saveSpeakingRecord} />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <SectionTitle title="2. Vocabulary & chunks" subtitle="Learn usable phrases, not isolated translations." />
              <div className="vocab-grid">
                {lesson.vocabulary.map((item) => (
                  <VocabularyCard key={item.id} item={item} rate={learner.settings.audioRate} isInReview={learner.srsItems.some((srs) => srs.sourceId === item.id)} onAddReview={addVocabularyReview} />
                ))}
              </div>
            </div>

            <div className="section">
              <SectionTitle title="3. Grammar in context" subtitle="Short explanation, extensive production." />
              <div className="stack">
                {lesson.grammar.map((activity) => (
                  <div className="card activity-card" key={activity.id}>
                    <h3>{activity.title}</h3>
                    {activity.explanationThai ? <p>{activity.explanationThai}</p> : null}
                    {activity.examples?.map((example) => <div className="example" key={example}>{example}</div>)}
                    <div className="section">
                      {activity.exercises?.map((exercise) => (
                        <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <SectionTitle title="4. Listening" subtitle="First listen → details → transcript → final listen." />
              <div className="stack">
                {lesson.listening.map((block) => (
                  <ListeningCard key={block.id} block={block} rate={learner.settings.audioRate} results={learner.exerciseResults} onSubmit={submitExercise} onListeningFinished={markLessonListeningFinished} completed={learner.completedActivityIds.includes(`${lesson.id}-listening-${block.id}`)} />
                ))}
              </div>
            </div>

            <div className="section">
              <SectionTitle title="5. Speaking ladder" subtitle="Finish fluency attempts before correction. Record yourself if possible." />
              <div className="card card-pad">
                {lesson.speaking.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} onSpeakingSaved={saveSpeakingRecord} />
                ))}
              </div>
            </div>

            {lesson.reading?.length ? (
              <div className="section">
                <SectionTitle title="6. Reading" subtitle="Read for gist and detail without translating every word." />
                <div className="stack">
                  {lesson.reading.map((block) => <ReadingCard key={block.id} block={block} results={learner.exerciseResults} onSubmit={submitExercise} />)}
                </div>
              </div>
            ) : null}

            {lesson.writing?.length ? (
              <div className="section">
                <SectionTitle title="7. Writing" subtitle="Build accurate connected language from your current level." />
                <div className="card card-pad">
                  {lesson.writing.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} />)}
                </div>
              </div>
            ) : null}

            {lesson.realWorldMission ? (
              <div className="section card card-pad">
                <div className="kicker">Real-world mission · required evidence</div>
                <h2>{lesson.realWorldMission}</h2>
                <p className="small muted">ทำภารกิจจริงก่อน แล้วกดบันทึก ไม่ได้คะแนนจากการเปิดบทเฉย ๆ</p>
                <button
                  className={`btn ${learner.completedActivityIds.includes(`${lesson.id}-mission`) ? "success" : "primary"}`}
                  onClick={markMissionComplete}
                  disabled={learner.completedActivityIds.includes(`${lesson.id}-mission`)}
                >
                  {learner.completedActivityIds.includes(`${lesson.id}-mission`) ? "✓ Mission evidence saved" : "I completed this mission"}
                </button>
              </div>
            ) : null}

            <div className="section grid-2">
              <div className="card card-pad">
                <SectionTitle title="Review" subtitle="Revisit difficult patterns." />
                {lesson.review.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} onSpeakingSaved={saveSpeakingRecord} />)}
              </div>
              <div className="card card-pad">
                <SectionTitle title="Exit check" subtitle={`Gate: ≥ ${Math.round(lesson.masteryCriteria.minimumAccuracy * 100)}% measured accuracy`} />
                {lesson.exitCheck.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} onSpeakingSaved={saveSpeakingRecord} />)}
                <div className="section">
                  <button className="btn primary" disabled={!completionReady} onClick={completeCurrentLesson}>
                    {completionReady ? `Complete Day ${lesson.day}` : "Complete exit checks to unlock"}
                  </button>
                  {!completionReady ? <p className="small muted">If your score is low, the course should remediate the weak category instead of hiding the problem.</p> : null}
                </div>
              </div>
            </div>

          </>
        );

      case "speaking":
        return (
          <>
            <PageTop kicker="Highest priority" title="Speaking" />
            <div className="card hero">
              <div>
                <div className="kicker">Speaking ladder</div>
                <h2>From short chunks to spontaneous C1 discussion.</h2>
                <p>The target is not a perfect accent. The target is clear, intelligible English with faster retrieval, longer responses and better control.</p>
              </div>
              <div className="hero-side">
                <div className="small muted">Current target</div>
                <div className="value" style={{ fontSize: 30, fontWeight: 800 }}>{lesson.masteryCriteria.speakingSeconds ?? 20}s</div>
                <div className="small muted">without reading a script</div>
              </div>
            </div>

            <div className="section grid-3">
              {[
                ["1–3", "Chunk → sentence → two connected sentences"],
                ["4–6", "20–30s → 45–60s → 90s"],
                ["7–9", "2–3 min → 3–5 min → C1 debate/presentation"]
              ].map(([level, text]) => <div className="stat" key={level}><div className="label">Levels {level}</div><div className="sub" style={{ fontSize: 14, marginTop: 8 }}>{text}</div></div>)}
            </div>

            <div className="section card card-pad">
              <SectionTitle title={`Day ${lesson.day} speaking drills`} subtitle="Rapid response, guided production, then less support." />
              {lesson.speaking.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} onSpeakingSaved={saveSpeakingRecord} />
              ))}
            </div>

            <div className="section card card-pad">
              <SectionTitle title="Speaking records" subtitle="Duration is evidence of progress, not a score by itself." />
              {learner.speakingRecords.length ? (
                <div className="lesson-list">
                  {learner.speakingRecords.slice(0, 10).map((record) => (
                    <div className="lesson-row" key={record.id}>
                      <div className="day-badge">{record.durationSeconds}s</div>
                      <div style={{ flex: 1 }}><h4>{record.prompt}</h4><p>{new Date(record.createdAt).toLocaleString()}</p><StoredRecording recordId={record.id} /></div>
                      <span className="pill">{record.lessonId === "c1-exit-assessment" ? "C1 Exit" : record.lessonId === "baseline-retest" ? "Baseline" : `Day ${getAnyLesson(record.lessonId).day}`}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="empty">No recordings yet. Use the recorder inside a speaking activity.</div>}
            </div>

            <div className="section card card-pad">
              <SectionTitle title="Pronunciation track" subtitle="Practice sounds inside real phrases; intelligibility matters more than accent imitation." />
              <div className="grid-2">
                {pronunciationTrack.map((item) => (
                  <div className="stat" key={`${item.level}-${item.focus}`}>
                    <div className="label">{item.level}</div>
                    <div className="value" style={{ fontSize: 18 }}>{item.focus}</div>
                    <div className="sub">{item.goal}</div>
                    <div className="top-actions" style={{ marginTop: 8 }}>
                      {item.examples.map((example) => <span className="pill" key={example}>{example}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case "listening":
        return (
          <>
            <PageTop kicker="Decode real speech" title="Listening">
              <span className="pill">Speed {learner.settings.audioRate.toFixed(2)}×</span>
            </PageTop>
            <div className="card card-pad">
              <p className="muted">Use the four-pass method: gist without transcript → details → transcript + connected speech → final listen without transcript.</p>
            </div>
            <div className="section stack">
              {lesson.listening.map((block) => <ListeningCard key={block.id} block={block} rate={learner.settings.audioRate} results={learner.exerciseResults} onSubmit={submitExercise} onListeningFinished={markLessonListeningFinished} completed={learner.completedActivityIds.includes(`${lesson.id}-listening-${block.id}`)} />)}
            </div>
          </>
        );

      case "vocabulary":
        return (
          <>
            <PageTop kicker="Active language" title="Vocabulary">
              <span className="pill">{learner.masteredChunks} mastery points</span>
              <span className="pill accent">{due.length} due</span>
            </PageTop>
            <div className="card card-pad">
              <p className="muted">Priority: Thai → English retrieval, collocations, complete sentences and speaking. English → Thai recognition alone does not count as mastery.</p>
            </div>
            <div className="section vocab-grid">
              {lesson.vocabulary.map((item) => <VocabularyCard key={item.id} item={item} rate={learner.settings.audioRate} isInReview={learner.srsItems.some((srs) => srs.sourceId === item.id)} onAddReview={addVocabularyReview} />)}
            </div>
          </>
        );

      case "grammar":
        return (
          <>
            <PageTop kicker="Use, don't just recognize" title="Grammar" />
            <div className="card card-pad">
              <div className="grid-2">
                <div className="stat"><div className="label">Production</div><div className="value">{learner.skillEstimates.grammarProduction.level}</div><ProgressBar value={learner.skillEstimates.grammarProduction.progress} /></div>
                <div className="stat"><div className="label">Recognition</div><div className="value">{learner.skillEstimates.grammarRecognition.level}</div><ProgressBar value={learner.skillEstimates.grammarRecognition.progress} /></div>
              </div>
            </div>
            <div className="section stack">
              {lesson.grammar.map((activity) => (
                <div className="card activity-card" key={activity.id}>
                  <h3>{activity.title}</h3>
                  <p>{activity.explanationThai}</p>
                  {activity.examples?.map((example) => <div className="example" key={example}>{example}</div>)}
                  <div className="section">
                    {activity.exercises?.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} />)}
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "reading":
        return (
          <>
            <PageTop kicker="Gist → detail → inference" title="Reading" />
            <div className="card card-pad"><p className="muted">Do not translate every word. Identify the main idea, then details, then infer unfamiliar language from context when possible.</p></div>
            <div className="section stack">
              {lesson.reading?.length ? lesson.reading.map((block) => <ReadingCard key={block.id} block={block} results={learner.exerciseResults} onSubmit={submitExercise} />) : <div className="empty">No reading block in this lesson.</div>}
            </div>
          </>
        );

      case "writing":
        return (
          <>
            <PageTop kicker="Sentence → paragraph → professional" title="Writing" />
            <div className="card card-pad">
              <p className="muted">At this stage, accuracy and natural sentence patterns matter more than forcing long essays too early.</p>
            </div>
            <div className="section card card-pad">
              {lesson.writing?.length ? lesson.writing.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} />) : <div className="empty">No writing block in this lesson.</div>}
            </div>
          </>
        );

      case "review":
        return (
          <>
            <PageTop kicker="Spaced retrieval" title="Review">
              <span className="pill accent">{due.length} due now</span>
            </PageTop>

            <div className="grid-2">
              <div className="card card-pad">
                <SectionTitle title="SRS queue" subtitle="Grade recall quality, confidence and speed." />
                {due.length ? (
                  <div className="stack">
                    {due.map((item) => <SrsReviewCard key={item.id} item={item} onGrade={gradeReview} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="empty">Nothing is due right now. Add vocabulary from the lesson or return later.</div>}

                <div className="section">
                  <SectionTitle title="Personal error drills" subtitle="Recurring mistakes return as production tasks." />
                  {errorReviewExercises.length
                    ? errorReviewExercises.map((exercise) => (
                        <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} />
                      ))
                    : <div className="empty">No recurring errors to drill yet.</div>}
                </div>
              </div>

              <div className="card card-pad">
                <SectionTitle title={`Day ${lesson.day} review`} subtitle="Target today's difficult language." />
                {lesson.review.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} onSpeakingSaved={saveSpeakingRecord} />)}
              </div>
            </div>
          </>
        );

      case "errors":
        return (
          <>
            <PageTop kicker="Personal remediation" title="Error Bank">
              <span className="pill">{learner.errorBank.length} records</span>
            </PageTop>
            <div className="card card-pad">
              <p className="muted">An error is not considered fixed after one correct answer. Recurring categories should reappear in future retrieval, writing and speaking.</p>
            </div>
            <div className="section stack">
              {learner.errorBank.length ? learner.errorBank.map((record) => (
                <div className="card error-item" key={record.id}>
                  <div className="lesson-header">
                    <div>
                      <span className="pill">{record.category}</span>
                      <h3 style={{ marginBottom: 6 }}>Original: <code>{record.original}</code></h3>
                      <div><b>Corrected:</b> {record.corrected}</div>
                      <p className="muted">{record.explanationThai}</p>
                    </div>
                    <div className="stat" style={{ minWidth: 120 }}>
                      <div className="label">Recurrence</div>
                      <div className="value">{record.recurrenceCount}</div>
                    </div>
                  </div>
                </div>
              )) : <div className="empty">Your Error Bank is empty. Incorrect production answers with a clear target are stored here automatically.</div>}
            </div>
          </>
        );

      case "progress":
        return (
          <>
            <PageTop kicker="Evidence, not one vague score" title="Progress" />
            <div className="grid-4">
              <div className="stat"><div className="label">C1 pathway</div><div className="value">{overallProgramProgress}%</div><div className="sub">evidence-weighted progress, not a certificate</div></div>
              <div className="stat"><div className="label">Structured evidence</div><div className="value">{guidedHours.toFixed(1)}h</div><div className="sub">target band ≈ {totalProgramTargets.guidedHoursFloor}–{totalProgramTargets.guidedHoursTarget}h</div></div>
              <div className="stat"><div className="label">Unscripted speaking</div><div className="value">{learner.evidence.unscriptedSpeakingMinutes.toFixed(1)}m</div><div className="sub">recorded practice · longest {Math.max(0, ...learner.speakingRecords.map((x) => x.durationSeconds))}s</div></div>
              <div className="stat"><div className="label">Normal-speed listening</div><div className="value">{Math.round(learner.evidence.listeningAtNormalSpeedMinutes)}m</div><div className="sub">credited when lesson audio speed is ≥ 0.9×</div></div>
            </div>

            <div className="section card card-pad">
              <SectionTitle title="CEFR skill estimates" subtitle="Each skill moves independently." />
              {(Object.keys(learner.skillEstimates) as Skill[]).map((skill) => {
                const estimate = learner.skillEstimates[skill];
                return (
                  <div className="skill-row" key={skill}>
                    <div className="skill-name">{skillLabels[skill]}</div>
                    <div className="pill">{estimate.level}</div>
                    <ProgressBar value={estimate.progress} />
                    <div className="small muted">{estimate.progress}%</div>
                  </div>
                );
              })}
            </div>

            <div className="section">
              <SectionTitle title="CEFR readiness gates" subtitle="A level is unlocked by converging evidence: skill profile + speaking duration + workload floor + integrated checkpoint." />
              <div className="grid-2">
                {(["A2", "B1", "B2", "C1"] as CheckpointLevel[]).map((level) => {
                  const report = readinessReport(learner, level);
                  return (
                    <div className="card card-pad" key={level}>
                      <div className="lesson-header">
                        <div><span className="pill accent">{level}</span><h3>{level} readiness</h3></div>
                        <div className={`pill ${report.ready ? "success" : ""}`}>{report.score}% · {report.ready ? "READY" : "NOT YET"}</div>
                      </div>
                      <ProgressBar value={report.score} />
                      <div className="stack" style={{ marginTop: 14 }}>
                        {report.criteria.map((criterion) => (
                          <div className="mission-item" key={criterion.id}>
                            <span className={`check ${criterion.passed ? "done" : ""}`}>{criterion.passed ? "✓" : ""}</span>
                            <span style={{ flex: 1 }}>{criterion.label}<span className="small muted"> · {criterion.value} / {criterion.target}</span></span>
                            {criterion.critical ? <span className="pill">critical</span> : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="section">
              <SectionTitle title="Milestones" subtitle="Meaningful abilities, not decorative XP." />
              <div className="grid-2">
                {milestones.map((milestone, index) => {
                  const done =
                    index === 0 ? learner.speakingRecords.some((r) => r.durationSeconds >= 30) :
                    index === 1 ? learner.completedLessonIds.includes("day-10") :
                    index === 2 ? readinessReport(learner, "A2").ready :
                    index === 3 ? learner.speakingRecords.some((r) => r.durationSeconds >= 180) :
                    index === 4 ? learner.completedLessonIds.some((id) => id.startsWith("ext-day-")) :
                    index === 5 ? readinessReport(learner, "B1").ready :
                    index === 6 ? learner.speakingRecords.some((r) => r.durationSeconds >= 180) :
                    index === 7 ? readinessReport(learner, "B2").ready :
                    index === 8 ? readinessReport(learner, "B2").ready :
                    index === 9 ? readinessReport(learner, "C1").ready : false;
                  return (
                    <div className="mission-item" key={milestone}>
                      <span className={`check ${done ? "done" : ""}`}>{done ? "✓" : ""}</span>
                      <span>{milestone}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        );

      case "tests":
        return (
          <>
            <PageTop kicker="Mastery gates" title="Tests" />
            <div className="grid-2">
              <div className="card card-pad">
                <SectionTitle title="Baseline retest" subtitle="Keep the same prompts so progress is visible." />
                {baselinePrompts.map((prompt, index) => (
                  <div className="exercise" key={prompt}>
                    <div className="small muted">Baseline {index + 1}</div>
                    <div className="prompt">{prompt}</div>
                    <Recorder onSave={(duration, blob) => { void saveBaselineSpeakingRecord(prompt, duration, blob); }} />
                  </div>
                ))}
              </div>
              <div className="card card-pad">
                <SectionTitle title="CEFR checkpoints" subtitle="Productive skills are mandatory." />
                {(Object.entries(cefrAssessments) as [string, (typeof cefrAssessments)[keyof typeof cefrAssessments]][]).map(([level, assessment]) => (
                  <div className="stat" key={level} style={{ marginBottom: 10 }}>
                    <div className="label">{level} readiness</div>
                    <div className="sub" style={{ fontSize: 14, marginTop: 7 }}><b>Speaking:</b> {assessment.speaking.join(" · ")}</div>
                    <div className="sub" style={{ fontSize: 14, marginTop: 7 }}><b>Gate:</b> {assessment.gate.join(" · ")}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <SectionTitle title="C1 Exit Pack A — real assessment material" subtitle="Original long-form listening, demanding reading, synthesis, professional writing and unscripted speaking. Complete every task before the final C1 rubric can be saved." />
              <div className="card card-pad">
                <div className="lesson-header">
                  <div>
                    <span className="pill accent">Final integrated evidence</span>
                    <h3>{c1ExitAnswered}/{c1Evidence.totalTasks} tasks · speaking recordings {c1ExitSpeakingRecorded}/{c1ExitSpeaking.length} · completed listenings {c1ExitListeningCompleted}/{c1ExitListening.length}</h3>
                    <p className="muted">The scorer unlocks only after all tasks are answered, all three long listenings finish at normal speed, every speaking task has a substantial recording, and the longest final recording reaches 360 seconds.</p>
                  </div>
                  <span className={`pill ${c1ExitEvidenceComplete ? "success" : ""}`}>{c1ExitEvidenceComplete ? "PACK COMPLETE" : "INCOMPLETE"}</span>
                </div>
              </div>

              <details className="card card-pad section">
                <summary className="checkpoint-summary"><strong>Part A · Listening — 3 long original recordings</strong><span className="pill">natural speed</span></summary>
                <p className="muted small">First listen with the transcript hidden. Do not slow the first attempt. Complete gist, detail, inference, stance and synthesis tasks.</p>
                <div className="stack">
                  {c1ExitListening.map((block) => (
                    <ListeningCard key={block.id} block={block} rate={Math.max(1, learner.settings.audioRate)} results={learner.exerciseResults} onSubmit={submitExercise} onListeningFinished={markC1ListeningFinished} completed={learner.completedActivityIds.includes(`c1-exit-listening-${block.id}`)} />
                  ))}
                </div>
              </details>

              <details className="card card-pad section">
                <summary className="checkpoint-summary"><strong>Part B · Reading — 2 demanding texts</strong><span className="pill">1,200+ words each</span></summary>
                <p className="muted small">Read without sentence-by-sentence Thai translation. Answer argument, implication, paraphrase, critique and summary tasks.</p>
                <div className="stack">
                  {c1ExitReading.map((block) => (
                    <ReadingCard key={block.id} block={block} results={learner.exerciseResults} onSubmit={submitExercise} />
                  ))}
                </div>
              </details>

              <details className="card card-pad section">
                <summary className="checkpoint-summary"><strong>Part C · Speaking — spontaneous + presentation + discussion + reformulation</strong><span className="pill">recorded</span></summary>
                <p className="muted small">Use only brief keyword notes where allowed. The 6–8 minute discussion must include genuinely unprepared follow-up questions from the evaluator.</p>
                <div className="stack">
                  {c1ExitSpeaking.map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} onSpeakingSaved={saveAssessmentSpeakingRecord} />
                  ))}
                </div>
              </details>

              <details className="card card-pad section">
                <summary className="checkpoint-summary"><strong>Part D · Writing & synthesis</strong><span className="pill">analytical + professional</span></summary>
                <div className="stack">
                  {c1ExitWriting.map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} result={learner.exerciseResults[exercise.id]} onSubmit={submitExercise} />
                  ))}
                </div>
              </details>
            </div>

            <div className="section">
              <SectionTitle title="Score real checkpoint evidence" subtitle="Use the rubric after completing the tasks above. C1 final readiness requires independent scoring, not self-rating alone." />
              <div className="stack">
                {(["A2", "B1", "B2", "C1"] as CheckpointLevel[]).map((level) => (
                  <CheckpointScorer
                    key={level}
                    level={level}
                    onSave={saveCheckpointAttempt}
                    locked={level === "C1" && !c1ExitEvidenceComplete}
                    lockReason={level === "C1" && !c1ExitEvidenceComplete ? `Complete C1 Exit Pack A first: ${c1ExitAnswered}/${c1Evidence.totalTasks} tasks, ${c1ExitListeningCompleted}/${c1ExitListening.length} full normal-speed listenings, ${c1ExitSpeakingRecorded}/${c1ExitSpeaking.length} speaking recordings, longest ${c1ExitLongestSpeaking}s/360s.` : undefined}
                  />
                ))}
              </div>
            </div>

            <div className="section card card-pad">
              <SectionTitle title="Latest checkpoint history" subtitle="Failed attempts are useful: they identify exactly what should be remediated before retesting." />
              {learner.checkpointAttempts.length ? (
                <div className="lesson-list">
                  {learner.checkpointAttempts.slice(0, 12).map((attempt) => (
                    <div className="lesson-row" key={attempt.id}>
                      <div className="day-badge">{attempt.level}</div>
                      <div>
                        <h4>{attempt.passed ? "Passed rubric" : "Needs remediation"} · {attempt.evaluator}{attempt.evaluatorName ? ` · ${attempt.evaluatorName}` : ""}</h4>
                        <p>{new Date(attempt.createdAt).toLocaleString()} · speaking {attempt.scores.speaking.toFixed(1)} · listening {attempt.scores.listening.toFixed(1)} · reading {attempt.scores.reading.toFixed(1)} · writing {attempt.scores.writing.toFixed(1)}</p>
                      </div>
                      <span className={`pill ${attempt.passed ? "success" : ""}`}>{attempt.passed ? "PASS" : "RETEST"}</span>
                    </div>
                  ))}
                </div>
              ) : <div className="empty">No checkpoint has been scored yet.</div>}
            </div>
          </>
        );

      case "settings":
        return (
          <>
            <PageTop kicker="Local-first" title="Settings" />
            <div className="grid-2">
              <div className="card card-pad">
                <SectionTitle title="Appearance" />
                <label className="small muted">Theme</label>
                <select className="field" value={learner.settings.theme} onChange={(event) => updateLearner((prev) => ({ ...prev, settings: { ...prev.settings, theme: event.target.value as "light" | "dark" } }))}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
                <label className="small muted">Text scale</label>
                <input className="field" type="range" min="0.9" max="1.25" step="0.05" value={learner.settings.textScale} onChange={(event) => updateLearner((prev) => ({ ...prev, settings: { ...prev.settings, textScale: Number(event.target.value) } }))} />
              </div>

              <div className="card card-pad">
                <SectionTitle title="Learning" />
                <label className="small muted">Thai support / immersion</label>
                <select className="field" value={learner.settings.immersionLevel} onChange={(event) => updateLearner((prev) => ({ ...prev, settings: { ...prev.settings, immersionLevel: event.target.value as LearnerState["settings"]["immersionLevel"] } }))}>
                  <option value="thai-support">Thai support (A1/A2)</option>
                  <option value="balanced">Balanced (A2/B1)</option>
                  <option value="mostly-english">Mostly English (B2/C1)</option>
                </select>
                <label className="small muted">Default listening speed: {learner.settings.audioRate.toFixed(2)}×</label>
                <input className="field" type="range" min="0.6" max="1.25" step="0.05" value={learner.settings.audioRate} onChange={(event) => updateLearner((prev) => ({ ...prev, settings: { ...prev.settings, audioRate: Number(event.target.value) } }))} />
                <p className="small muted">The course should gradually discourage permanent slow-speed listening.</p>
              </div>
            </div>

            <div className="section card card-pad">
              <SectionTitle title="Locked learner profile" subtitle="These defaults come from your diagnostic and keep the course aligned with your actual goal." />
              <div className="grid-2">
                <div className="stat"><div className="label">Target</div><div className="value" style={{ fontSize: 22 }}>{learnerProfile.target}</div><div className="sub">Speaking → Listening → Reading → Writing are the top four priorities.</div></div>
                <div className="stat"><div className="label">Structured study</div><div className="value" style={{ fontSize: 22 }}>{learnerProfile.constraints.structuredMinutesPerDay.min}–{learnerProfile.constraints.structuredMinutesPerDay.max}m/day</div><div className="sub">Target ≈ {learnerProfile.constraints.structuredMinutesPerDay.target}m plus immersion.</div></div>
              </div>
            </div>

            <div className="section card card-pad">
              <SectionTitle title="Data" subtitle="Progress is stored in this browser." />
              <button className="btn danger" onClick={reset}>Reset all local progress</button>
            </div>
          </>
        );
    }
  })();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C1</div>
          <div><strong>English Accelerator</strong><span>speaking-first system</span></div>
        </div>
        <nav className="nav">
          {nav.map((item) => (
            <button key={item.id} className={`nav-button ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="tiny">Current path</div>
          <div style={{ fontWeight: 800, margin: "4px 0" }}>A1+/A2- → C1</div>
          <div className="tiny">Build automatic language before advanced test tricks.</div>
        </div>
      </aside>

      <main className="main">{content}</main>

      <nav className="mobile-nav">
        {nav.map((item) => (
          <button key={item.id} className={`nav-button ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
            <span className="nav-icon">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
