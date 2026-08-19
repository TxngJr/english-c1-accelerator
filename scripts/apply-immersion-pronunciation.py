from pathlib import Path

app_path = Path("src/components/learning-app.tsx")
adaptive_path = Path("src/lib/adaptive.ts")
app = app_path.read_text(encoding="utf-8")
adaptive = adaptive_path.read_text(encoding="utf-8")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 occurrence, found {count}")
    return text.replace(old, new, 1)


adaptive = replace_once(
    adaptive,
    'import { latestVerifiedCheckpoint } from "./checkpoints.ts";',
    'import { latestVerifiedCheckpoint } from "./checkpoints.ts";\nimport { longestReadinessSpeakingSeconds } from "./speaking-evidence.ts";',
    "adaptive speaking evidence import",
)
adaptive = replace_once(
    adaptive,
    '  const longestSpeaking = Math.max(0, ...state.speakingRecords.map((record) => record.durationSeconds));',
    '  const longestSpeaking = longestReadinessSpeakingSeconds(state.speakingRecords);',
    "readiness speaking filter",
)
adaptive_path.write_text(adaptive, encoding="utf-8")

app = replace_once(
    app,
    'import { useEffect, useMemo, useRef, useState } from "react";',
    'import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";',
    "React context imports",
)
app = replace_once(
    app,
    'import { DataManagement, StorageHealthBanner } from "@/components/data-management";',
    'import { DataManagement, StorageHealthBanner } from "@/components/data-management";\nimport { immersionLabel, thaiSupportMode, type ThaiSupportMode } from "@/lib/immersion";\nimport { longestReadinessSpeakingSeconds } from "@/lib/speaking-evidence";',
    "immersion imports",
)

marker = '''const skillLabels: Record<Skill, string> = {\n  speaking: "Speaking",\n  listening: "Listening",\n  reading: "Reading",\n  writing: "Writing",\n  grammarProduction: "Grammar Production",\n  grammarRecognition: "Grammar Recognition",\n  vocabulary: "Vocabulary",\n  pronunciation: "Pronunciation"\n};'''
insert = marker + r'''

const ImmersionContext = createContext<ThaiSupportMode>("full");

function ThaiHelp({ text, compact = false }: { text?: string; compact?: boolean }) {
  const mode = useContext(ImmersionContext);
  if (!text) return null;
  if (mode === "full") return <div className={compact ? "thai" : "instruction"}>{text}</div>;

  return (
    <details className={compact ? "thai-help compact" : "thai-help"}>
      <summary>{mode === "fallback" ? "Thai help" : "Need Thai help?"}</summary>
      <div className={compact ? "thai" : "instruction"}>{text}</div>
    </details>
  );
}'''
app = replace_once(app, marker, insert, "Thai support context")

app = replace_once(
    app,
    '      {exercise.instructionThai ? <div className="instruction">{exercise.instructionThai}</div> : null}',
    '      <ThaiHelp text={exercise.instructionThai} />',
    "exercise Thai instruction",
)
app = replace_once(
    app,
    '          {exercise.explanationThai ? <div>{exercise.explanationThai}</div> : null}',
    '          <ThaiHelp text={exercise.explanationThai} />',
    "exercise Thai explanation",
)
app = replace_once(
    app,
    '          <div className="thai">{item.meaningThai}</div>',
    '          <ThaiHelp text={item.meaningThai} compact />',
    "vocabulary Thai meaning",
)
app = replace_once(
    app,
    '      <p className="muted small">ฟังก่อนโดยไม่เปิด transcript แล้วจับใจความรวม จากนั้นฟังรอบสองเพื่อเก็บรายละเอียด</p>',
    '      <ThaiHelp text="ฟังก่อนโดยไม่เปิด transcript แล้วจับใจความรวม จากนั้นฟังรอบสองเพื่อเก็บรายละเอียด" />',
    "listening Thai guidance",
)
app = replace_once(
    app,
    '{activity.instructionsThai ? <p>{activity.instructionsThai}</p> : null}',
    '<ThaiHelp text={activity.instructionsThai} />',
    "warmup Thai instructions",
)
app = replace_once(
    app,
    '{activity.explanationThai ? <p>{activity.explanationThai}</p> : null}',
    '<ThaiHelp text={activity.explanationThai} />',
    "lesson grammar Thai explanation",
)
app = replace_once(
    app,
    '<p>{activity.explanationThai}</p>',
    '<ThaiHelp text={activity.explanationThai} />',
    "grammar tab Thai explanation",
)
app = replace_once(
    app,
    '<p className="small muted">ทำภารกิจจริงก่อน แล้วกดบันทึก ไม่ได้คะแนนจากการเปิดบทเฉย ๆ</p>',
    '<ThaiHelp text="ทำภารกิจจริงก่อน แล้วกดบันทึก ไม่ได้คะแนนจากการเปิดบทเฉย ๆ" />',
    "mission Thai guidance",
)
app = replace_once(
    app,
    '<p className="muted">{record.explanationThai}</p>',
    '<ThaiHelp text={record.explanationThai} />',
    "Error Bank Thai explanation",
)

app = replace_once(
    app,
    '{ key: "speaking", label: "Speaking: range · accuracy · fluency · coherence" },',
    '{ key: "speaking", label: "Speaking: range · accuracy · fluency · coherence · intelligibility/pronunciation" },',
    "checkpoint pronunciation criterion label",
)

app = replace_once(
    app,
    '  const c1ExitEvidenceComplete = c1Evidence.complete;',
    '''  const c1ExitEvidenceComplete = c1Evidence.complete;\n  const immersionMode = useMemo(() => thaiSupportMode(lesson.cefrLevel, learner.settings.immersionLevel), [lesson.cefrLevel, learner.settings.immersionLevel]);\n  const pronunciationCompleted = pronunciationTrack.filter((_, index) => learner.completedActivityIds.includes(`pronunciation-${index}`)).length;''',
    "derived immersion and pronunciation progress",
)

pronunciation_save = r'''

  const savePronunciationRecord = async (trackIndex: number, focus: string, duration: number, blob: Blob) => {
    if (duration < 2) return;
    const recordId = `pronunciation-${trackIndex}-${Date.now()}`;
    try {
      await saveRecordingBlob(recordId, blob);
    } catch {
      return;
    }
    updateLearner((prev) => {
      const activityId = `pronunciation-${trackIndex}`;
      const alreadyCompleted = prev.completedActivityIds.includes(activityId);
      const record: SpeakingRecord = {
        id: recordId,
        lessonId: "pronunciation",
        prompt: focus,
        durationSeconds: duration,
        createdAt: new Date().toISOString(),
        selfRating: 3,
        notes: "Pronunciation listen-record-compare practice; not counted as unscripted fluency evidence."
      };
      return {
        ...todayStreak(prev),
        speakingRecords: [record, ...prev.speakingRecords],
        completedActivityIds: alreadyCompleted ? prev.completedActivityIds : [...prev.completedActivityIds, activityId],
        xp: prev.xp + (alreadyCompleted ? 2 : 8)
      };
    });
  };
'''
app = replace_once(app, '\n  const saveBaselineSpeakingRecord = async', pronunciation_save + '\n  const saveBaselineSpeakingRecord = async', "pronunciation persistence")

app = replace_once(
    app,
    '''<span className="pill">{record.lessonId === "c1-exit-assessment" ? "C1 Exit" : record.lessonId === "baseline-retest" ? "Baseline" : `Day ${getAnyLesson(record.lessonId).day}`}</span>''',
    '''<span className="pill">{record.lessonId === "c1-exit-assessment" ? "C1 Exit" : record.lessonId === "baseline-retest" ? "Baseline" : record.lessonId === "pronunciation" ? "Pronunciation" : `Day ${getAnyLesson(record.lessonId).day}`}</span>''',
    "pronunciation history badge",
)

old_pronunciation = '''            <div className="section card card-pad">\n              <SectionTitle title="Pronunciation track" subtitle="Practice sounds inside real phrases; intelligibility matters more than accent imitation." />\n              <div className="grid-2">\n                {pronunciationTrack.map((item) => (\n                  <div className="stat" key={`${item.level}-${item.focus}`}>\n                    <div className="label">{item.level}</div>\n                    <div className="value" style={{ fontSize: 18 }}>{item.focus}</div>\n                    <div className="sub">{item.goal}</div>\n                    <div className="top-actions" style={{ marginTop: 8 }}>\n                      {item.examples.map((example) => <span className="pill" key={example}>{example}</span>)}\n                    </div>\n                  </div>\n                ))}\n              </div>\n            </div>'''
new_pronunciation = r'''            <div className="section card card-pad">
              <SectionTitle
                title="Pronunciation practice"
                subtitle="Listen → imitate → record → replay and compare. Practice recordings do not inflate unscripted speaking evidence."
                right={<span className="pill accent">{pronunciationCompleted}/{pronunciationTrack.length} practiced</span>}
              />
              <ProgressBar value={pronunciationCompleted / pronunciationTrack.length * 100} />
              <div className="grid-2 section">
                {pronunciationTrack.map((item, index) => {
                  const completed = learner.completedActivityIds.includes(`pronunciation-${index}`);
                  return (
                    <div className="stat" key={`${item.level}-${item.focus}`}>
                      <div className="lesson-header">
                        <div>
                          <div className="label">{item.level}</div>
                          <div className="value" style={{ fontSize: 18 }}>{item.focus}</div>
                        </div>
                        <span className={`pill ${completed ? "success" : ""}`}>{completed ? "Practiced" : "Practice"}</span>
                      </div>
                      <div className="sub">{item.goal}</div>
                      <div className="stack" style={{ marginTop: 10 }}>
                        {item.examples.map((example) => (
                          <div className="lesson-header" key={example}>
                            <span className="pill">{example}</span>
                            <SpeakButton text={example.replaceAll("_", " ")} rate={Math.min(1, learner.settings.audioRate)} />
                          </div>
                        ))}
                      </div>
                      <p className="small muted">Listen twice, say the examples naturally, then record one short attempt and replay it before moving on.</p>
                      <Recorder onSave={(duration, blob) => { void savePronunciationRecord(index, item.focus, duration, blob); }} />
                    </div>
                  );
                })}
              </div>
            </div>'''
app = replace_once(app, old_pronunciation, new_pronunciation, "pronunciation practice UI")

app = replace_once(
    app,
    '''<div className="sub">recorded practice · longest {Math.max(0, ...learner.speakingRecords.map((x) => x.durationSeconds))}s</div>''',
    '''<div className="sub">recorded fluency practice · longest eligible {longestReadinessSpeakingSeconds(learner.speakingRecords)}s</div>''',
    "progress speaking duration",
)

app = replace_once(
    app,
    '''              <span className="pill">🔥 {learner.streak} day streak</span>\n              <span className="pill accent">{learner.xp} XP</span>''',
    '''              <span className="pill">🔥 {learner.streak} day streak</span>\n              <span className="pill">{immersionLabel(immersionMode)}</span>\n              <span className="pill accent">{learner.xp} XP</span>''',
    "immersion status pill",
)

app = replace_once(
    app,
    '''                <p className="small muted">The course should gradually discourage permanent slow-speed listening.</p>''',
    '''                <p className="small muted">The course should gradually discourage permanent slow-speed listening.</p>\n                <p className="small muted">Current lesson language policy: <b>{immersionLabel(immersionMode)}</b>. Thai explanations are shown automatically only when the policy calls for full support; otherwise they remain available on demand.</p>''',
    "settings immersion status",
)

app = replace_once(
    app,
    '''  return (\n    <div className="app-shell">''',
    '''  return (\n    <ImmersionContext.Provider value={immersionMode}>\n    <div className="app-shell">''',
    "immersion provider open",
)
app = replace_once(
    app,
    '''      </nav>\n    </div>\n  );\n}''',
    '''      </nav>\n    </div>\n    </ImmersionContext.Provider>\n  );\n}''',
    "immersion provider close",
)

app_path.write_text(app, encoding="utf-8")
print("Immersion and pronunciation migration applied")
