from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src/components/learning-app.tsx"
LAYOUT = ROOT / "src/app/layout.tsx"
FEEDBACK = ROOT / "src/components/review-button-feedback.tsx"


def must_replace(text: str, old: str, new: str, label: str, count: int = 1) -> str:
    actual = text.count(old)
    if actual != count:
        raise RuntimeError(f"{label}: expected {count} occurrence(s), found {actual}")
    return text.replace(old, new, count)


text = APP.read_text(encoding="utf-8")

text = must_replace(
    text,
    'import { adaptivePriority, bumpSkillEstimate, canCompleteLesson, checkExerciseAnswer, isObjectivelyScoredExercise, lessonAccuracy, recurringErrors } from "@/lib/mastery";',
    'import { adaptivePriority, bumpSkillEstimate, canCompleteLesson, canStartLesson, checkExerciseAnswer, isObjectivelyScoredExercise, lessonAccuracy, normalizeAnswer, recurringErrors } from "@/lib/mastery";',
    "mastery imports",
)
text = must_replace(
    text,
    'import { createSrsItem, dueItems, scheduleReview, type ReviewGrade } from "@/lib/srs";',
    'import { createSrsItem, dueItems, masteredSrsCount, scheduleReview, type ReviewGrade } from "@/lib/srs";',
    "srs imports",
)
text = must_replace(
    text,
    'import type { CheckpointAttempt, CheckpointLevel, Exercise, LearnerState, ListeningBlock, ReadingBlock, Skill, SpeakingRecord, VocabularyItem } from "@/lib/types";',
    'import type { CheckpointAttempt, CheckpointLevel, Exercise, LearnerState, ListeningBlock, ReadingBlock, Skill, SpeakingRecord, SRSItem, VocabularyItem } from "@/lib/types";',
    "type imports",
)

text = must_replace(
    text,
    '''  useEffect(() => {\n    setAnswer("");\n    setStartedAt(Date.now());\n    setShowModel(false);\n  }, [exercise.id]);\n\n''',
    "",
    "ExerciseCard reset effect",
)

old_vocab_signature = '''function VocabularyCard({\n  item,\n  rate,\n  onAddReview\n}: {\n  item: VocabularyItem;\n  rate: number;\n  onAddReview: (item: VocabularyItem) => void;\n}) {'''
new_vocab_signature = '''function VocabularyCard({\n  item,\n  rate,\n  isInReview,\n  onAddReview\n}: {\n  item: VocabularyItem;\n  rate: number;\n  isInReview: boolean;\n  onAddReview: (item: VocabularyItem) => void;\n}) {'''
text = must_replace(text, old_vocab_signature, new_vocab_signature, "VocabularyCard signature")
text = must_replace(
    text,
    '      <button className="btn small" onClick={() => onAddReview(item)}>＋ Add to review</button>',
    '''      <button\n        className={`btn small ${isInReview ? "success" : ""}`}\n        onClick={() => onAddReview(item)}\n        disabled={isInReview}\n        aria-pressed={isInReview}\n      >\n        {isInReview ? "✓ Added to review" : "＋ Add to review"}\n      </button>''',
    "Vocabulary review button",
)

srs_component = r'''

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
'''
text = must_replace(text, "\nfunction ListeningCard({", srs_component + "\nfunction ListeningCard({", "insert SRS review card")

text = must_replace(
    text,
    '''  onSubmit,\n  onListeningFinished\n}: {\n  block: ListeningBlock;\n  rate: number;\n  results: LearnerState["exerciseResults"];\n  onSubmit: (exercise: Exercise, answer: string, responseMs?: number) => void;\n  onListeningFinished?: (block: ListeningBlock) => void;\n}) {''',
    '''  onSubmit,\n  onListeningFinished,\n  completed = false\n}: {\n  block: ListeningBlock;\n  rate: number;\n  results: LearnerState["exerciseResults"];\n  onSubmit: (exercise: Exercise, answer: string, responseMs?: number) => void;\n  onListeningFinished?: (block: ListeningBlock) => void;\n  completed?: boolean;\n}) {''',
    "ListeningCard signature",
)
text = must_replace(
    text,
    '''        <button className="btn small" onClick={() => setShowTranscript((value) => !value)}>\n          {showTranscript ? "Hide transcript" : "Third listen: show transcript"}\n        </button>''',
    '''        <button className="btn small" onClick={() => setShowTranscript((value) => !value)} disabled={!completed}>\n          {!completed ? "Finish first listen to unlock transcript" : showTranscript ? "Hide transcript" : "Third listen: show transcript"}\n        </button>''',
    "transcript gate",
)

text = must_replace(text, "assessor's name", "assessor&apos;s name", "escaped assessor apostrophe")
text = must_replace(text, "<div className=\"kicker\">Today's mission", "<div className=\"kicker\">Today&apos;s mission", "escaped today apostrophe")

text = must_replace(
    text,
    '''  useEffect(() => {\n    setLearner(loadState());\n    setHydrated(true);\n  }, []);''',
    '''  useEffect(() => {\n    const frame = window.requestAnimationFrame(() => {\n      setLearner(loadState());\n      setHydrated(true);\n    });\n    return () => window.cancelAnimationFrame(frame);\n  }, []);''',
    "hydration effect",
)

text = must_replace(
    text,
    '''  const selectLesson = (lessonId: string) => {\n    updateLearner((prev) => ({ ...prev, currentLessonId: lessonId }));\n    setTab("lesson");\n    window.scrollTo({ top: 0, behavior: "smooth" });\n  };''',
    '''  const selectLesson = (lessonId: string) => {\n    const targetLesson = getAnyLesson(lessonId);\n    if (!canStartLesson(learner, targetLesson)) return;\n    updateLearner((prev) => ({ ...prev, currentLessonId: lessonId }));\n    setTab("lesson");\n    window.scrollTo({ top: 0, behavior: "smooth" });\n  };''',
    "selectLesson guard",
)

text = must_replace(
    text,
    '''  const gradeReview = (id: string, grade: ReviewGrade) => {\n    updateLearner((prev) => ({\n      ...prev,\n      srsItems: prev.srsItems.map((item) => item.id === id ? scheduleReview(item, grade) : item),\n      masteredChunks: prev.masteredChunks + (grade >= 4 ? 1 : 0),\n      xp: prev.xp + (grade >= 4 ? 8 : 3)\n    }));\n  };''',
    '''  const gradeReview = (id: string, grade: ReviewGrade, responseMs: number) => {\n    updateLearner((prev) => {\n      const srsItems = prev.srsItems.map((item) => item.id === id ? scheduleReview(item, grade, responseMs) : item);\n      return {\n        ...prev,\n        srsItems,\n        masteredChunks: masteredSrsCount(srsItems),\n        xp: prev.xp + (grade >= 4 ? 8 : 3)\n      };\n    });\n  };''',
    "gradeReview evidence",
)

text = must_replace(
    text,
    '''  const saveSpeakingRecord = (exercise: Exercise, duration: number, blob: Blob) => {\n    const recordId = `speaking-${Date.now()}`;\n    void saveRecordingBlob(recordId, blob).catch(() => undefined);\n    updateLearner((prev) => {''',
    '''  const saveSpeakingRecord = async (exercise: Exercise, duration: number, blob: Blob) => {\n    const recordId = `speaking-${Date.now()}`;\n    try {\n      await saveRecordingBlob(recordId, blob);\n    } catch {\n      return;\n    }\n    updateLearner((prev) => {''',
    "transactional lesson audio",
)
text = must_replace(
    text,
    '''  const saveAssessmentSpeakingRecord = (exercise: Exercise, duration: number, blob: Blob) => {\n    const recordId = `c1-speaking-${Date.now()}`;\n    void saveRecordingBlob(recordId, blob).catch(() => undefined);\n    updateLearner((prev) => {''',
    '''  const saveAssessmentSpeakingRecord = async (exercise: Exercise, duration: number, blob: Blob) => {\n    const recordId = `c1-speaking-${Date.now()}`;\n    try {\n      await saveRecordingBlob(recordId, blob);\n    } catch {\n      return;\n    }\n    updateLearner((prev) => {''',
    "transactional assessment audio",
)

baseline_fn = r'''

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
'''
text = must_replace(text, "\n  const markMissionComplete = () => {", baseline_fn + "\n  const markMissionComplete = () => {", "baseline persistence")

text = must_replace(
    text,
    '''      if (!attempt.passed || (attempt.level === "C1" && (attempt.evaluator === "self" || !attempt.evaluatorName?.trim()))) return next;''',
    '''      const independentlyVerified = attempt.evaluator === "teacher" && Boolean(attempt.evaluatorName?.trim());\n      if (!attempt.passed || !independentlyVerified) return next;''',
    "checkpoint promotion integrity",
)

text = must_replace(
    text,
    '''                  <button key={item.id} className="lesson-row" onClick={() => selectLesson(item.id)}>''',
    '''                  <button key={item.id} className="lesson-row" onClick={() => selectLesson(item.id)} disabled={!canStartLesson(learner, item)}>''',
    "foundation lock button",
)
text = must_replace(
    text,
    '''                      {learner.completedLessonIds.includes(item.id) ? "Completed" : "Open"}''',
    '''                      {learner.completedLessonIds.includes(item.id) ? "Completed" : canStartLesson(learner, item) ? "Open" : "Locked"}''',
    "foundation lock label",
)
text = must_replace(
    text,
    '''                    <button className="lesson-row" key={module.id} onClick={() => selectLesson(`ext-day-${startDay}`)}>''',
    '''                    <button className="lesson-row" key={module.id} onClick={() => selectLesson(`ext-day-${startDay}`)} disabled={!canStartLesson(learner, getAnyLesson(`ext-day-${startDay}`))}>''',
    "extended lock button",
)

text = must_replace(
    text,
    '''                  <VocabularyCard key={item.id} item={item} rate={learner.settings.audioRate} onAddReview={addVocabularyReview} />''',
    '''                  <VocabularyCard key={item.id} item={item} rate={learner.settings.audioRate} isInReview={learner.srsItems.some((srs) => srs.sourceId === item.id)} onAddReview={addVocabularyReview} />''',
    "lesson vocabulary state",
)
text = must_replace(
    text,
    '''              {lesson.vocabulary.map((item) => <VocabularyCard key={item.id} item={item} rate={learner.settings.audioRate} onAddReview={addVocabularyReview} />)}''',
    '''              {lesson.vocabulary.map((item) => <VocabularyCard key={item.id} item={item} rate={learner.settings.audioRate} isInReview={learner.srsItems.some((srs) => srs.sourceId === item.id)} onAddReview={addVocabularyReview} />)}''',
    "vocabulary tab state",
)

text = must_replace(
    text,
    '''                  <ListeningCard key={block.id} block={block} rate={learner.settings.audioRate} results={learner.exerciseResults} onSubmit={submitExercise} onListeningFinished={markLessonListeningFinished} />''',
    '''                  <ListeningCard key={block.id} block={block} rate={learner.settings.audioRate} results={learner.exerciseResults} onSubmit={submitExercise} onListeningFinished={markLessonListeningFinished} completed={learner.completedActivityIds.includes(`${lesson.id}-listening-${block.id}`)} />''',
    "lesson listening state",
)
text = must_replace(
    text,
    '''              {lesson.listening.map((block) => <ListeningCard key={block.id} block={block} rate={learner.settings.audioRate} results={learner.exerciseResults} onSubmit={submitExercise} onListeningFinished={markLessonListeningFinished} />)}''',
    '''              {lesson.listening.map((block) => <ListeningCard key={block.id} block={block} rate={learner.settings.audioRate} results={learner.exerciseResults} onSubmit={submitExercise} onListeningFinished={markLessonListeningFinished} completed={learner.completedActivityIds.includes(`${lesson.id}-listening-${block.id}`)} />)}''',
    "listening tab state",
)
text = must_replace(
    text,
    '''                    <ListeningCard key={block.id} block={block} rate={Math.max(1, learner.settings.audioRate)} results={learner.exerciseResults} onSubmit={submitExercise} onListeningFinished={markC1ListeningFinished} />''',
    '''                    <ListeningCard key={block.id} block={block} rate={Math.max(1, learner.settings.audioRate)} results={learner.exerciseResults} onSubmit={submitExercise} onListeningFinished={markC1ListeningFinished} completed={learner.completedActivityIds.includes(`c1-exit-listening-${block.id}`)} />''',
    "C1 listening state",
)

start = text.index('                    {due.map((item) => (')
end_marker = '                    ))}'
end = text.index(end_marker, start) + len(end_marker)
old_due = text[start:end]
new_due = '                    {due.map((item) => <SrsReviewCard key={item.id} item={item} onGrade={gradeReview} />)}'
text = text[:start] + new_due + text[end:]

text = must_replace(
    text,
    '''                    <Recorder />''',
    '''                    <Recorder onSave={(duration, blob) => { void saveBaselineSpeakingRecord(prompt, duration, blob); }} />''',
    "baseline recorder",
)
text = must_replace(
    text,
    '''{record.lessonId === "c1-exit-assessment" ? "C1 Exit" : `Day ${getAnyLesson(record.lessonId).day}`}''',
    '''{record.lessonId === "c1-exit-assessment" ? "C1 Exit" : record.lessonId === "baseline-retest" ? "Baseline" : `Day ${getAnyLesson(record.lessonId).day}`}''',
    "speaking record badge",
)
text = must_replace(text, "{nav.slice(0, 6).map((item) => (", "{nav.map((item) => (", "mobile navigation completeness")

APP.write_text(text, encoding="utf-8")

layout = LAYOUT.read_text(encoding="utf-8")
layout = must_replace(layout, 'import { ReviewButtonFeedback } from "@/components/review-button-feedback";\n', "", "feedback import")
layout = must_replace(layout, '        <ReviewButtonFeedback />\n', "", "feedback component")
LAYOUT.write_text(layout, encoding="utf-8")

if FEEDBACK.exists():
    FEEDBACK.unlink()

print("UI hardening replacements applied successfully")
