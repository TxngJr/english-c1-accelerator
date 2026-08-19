from pathlib import Path


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 occurrence, found {count}")
    return text.replace(old, new, 1)

adaptive_path = Path("src/lib/adaptive.ts")
adaptive = adaptive_path.read_text(encoding="utf-8")
adaptive = replace_once(
    adaptive,
    'import type { CEFR, CheckpointAttempt, CheckpointLevel, LearnerState, Skill } from "./types";',
    'import type { CEFR, CheckpointAttempt, CheckpointLevel, LearnerState, Skill } from "./types";\nimport { latestVerifiedCheckpoint } from "./checkpoints.ts";',
    "adaptive checkpoint import",
)
adaptive = replace_once(
    adaptive,
    '''function latestCheckpoint(state: LearnerState, level: CheckpointLevel): CheckpointAttempt | undefined {\n  if (level === "C1") {\n    const independentlyPassed = state.checkpointAttempts.find((attempt) =>\n      attempt.level === "C1" &&\n      attempt.passed &&\n      attempt.evaluator !== "self" &&\n      Boolean(attempt.evaluatorName?.trim())\n    );\n    if (independentlyPassed) return independentlyPassed;\n  }\n  return state.checkpointAttempts.find((attempt) => attempt.level === level);\n}''',
    '''function latestCheckpoint(state: LearnerState, level: CheckpointLevel): CheckpointAttempt | undefined {\n  return latestVerifiedCheckpoint(state, level);\n}''',
    "verified checkpoint selection",
)
adaptive = replace_once(
    adaptive,
    '''    label: `${level} integrated checkpoint`,\n    passed: Boolean(checkpoint?.passed),\n    value: checkpoint ? `${checkpoint.passed ? "passed" : "not passed"} · ${checkpoint.evaluator}` : "not attempted",\n    target: "pass speaking + listening + reading + writing + language use",''',
    '''    label: `${level} verified integrated checkpoint`,\n    passed: Boolean(checkpoint),\n    value: checkpoint ? `passed · ${checkpoint.evaluator} · ${checkpoint.evaluatorName}` : "no verified pass",\n    target: "identified independent pass across speaking + listening + reading + writing + language use",''',
    "readiness checkpoint criterion",
)
adaptive_path.write_text(adaptive, encoding="utf-8")

app_path = Path("src/components/learning-app.tsx")
app = app_path.read_text(encoding="utf-8")
app = replace_once(
    app,
    'import { c1ExitEvidenceStatus } from "@/lib/c1-evidence";',
    'import { c1ExitEvidenceStatus } from "@/lib/c1-evidence";\nimport { recordCheckpointAttempt } from "@/lib/checkpoints";',
    "checkpoint service import",
)
app = replace_once(
    app,
    '''  const independentFinal = level !== "C1" || (evaluator !== "self" && evaluatorName.trim().length >= 2);''',
    '''  const hasEvaluatorIdentity = evaluator === "self" || evaluatorName.trim().length >= 2;\n  const verifiedPass = passed && evaluator === "teacher" && evaluatorName.trim().length >= 2;''',
    "checkpoint identity state",
)
app = replace_once(
    app,
    '''        <span className={`pill ${passed && independentFinal ? "success" : ""}`}>{passed ? (independentFinal ? "Rubric pass" : "Score passes · independent check required") : "Below gate"}</span>''',
    '''        <span className={`pill ${verifiedPass ? "success" : ""}`}>{verifiedPass ? "Verified rubric pass" : passed ? "Practice pass · verification required" : "Below gate"}</span>''',
    "checkpoint status pill",
)
app = replace_once(
    app,
    '''        Score the actual integrated checkpoint performance from 1–5. Self-rating is useful for practice, but final C1 readiness requires an independent qualified evaluator. A future connected AI evaluator can be enabled only when a real provider is configured.''',
    '''        Score the actual integrated checkpoint performance from 1–5. Self-rating is practice evidence only at every CEFR level and never promotes your CEFR estimate. Verified promotion requires an identified qualified human evaluator. A connected AI evaluator may be enabled later only when a real provider and evidence-verification flow exist.''',
    "checkpoint explanation",
)
app = replace_once(
    app,
    '''            <option value="self">Self-assessment (practice evidence only for C1)</option>''',
    '''            <option value="self">Self-assessment (practice only · never promotes CEFR)</option>''',
    "self option",
)
app = replace_once(
    app,
    '''      {level === "C1" && evaluator !== "self" && evaluatorName.trim().length < 2 ? <div className="feedback incorrect"><strong>Evaluator identity required.</strong>Enter the independent assessor&apos;s name or identifier before saving final C1 evidence.</div> : null}\n      <button className="btn primary" onClick={save} disabled={locked || (level === "C1" && evaluator !== "self" && evaluatorName.trim().length < 2)}>Save {level} checkpoint evidence</button>''',
    '''      {evaluator !== "self" && !hasEvaluatorIdentity ? <div className="feedback incorrect"><strong>Evaluator identity required.</strong> Enter the independent assessor&apos;s name or identifier before saving verified evidence.</div> : null}\n      <button className="btn primary" onClick={save} disabled={locked || !hasEvaluatorIdentity}>Save {level} checkpoint evidence</button>''',
    "identity enforcement",
)
old_save = '''  const saveCheckpointAttempt = (attempt: CheckpointAttempt) => {\n    updateLearner((prev) => {\n      const next = {\n        ...prev,\n        checkpointAttempts: [attempt, ...prev.checkpointAttempts.filter((item) => item.id !== attempt.id)],\n        xp: prev.xp + (attempt.passed ? 120 : 35)\n      };\n      const independentlyVerified = attempt.evaluator === "teacher" && Boolean(attempt.evaluatorName?.trim());\n      if (!attempt.passed || !independentlyVerified) return next;\n\n      const promote = (skill: Skill) => {\n        const current = next.skillEstimates[skill];\n        if (levelIndex(current.level) >= levelIndex(attempt.level)) return current;\n        return { level: attempt.level, progress: 0 };\n      };\n\n      return {\n        ...next,\n        skillEstimates: {\n          ...next.skillEstimates,\n          speaking: promote("speaking"),\n          listening: promote("listening"),\n          reading: promote("reading"),\n          writing: promote("writing"),\n          grammarProduction: promote("grammarProduction"),\n          vocabulary: promote("vocabulary")\n        }\n      };\n    });\n  };'''
new_save = '''  const saveCheckpointAttempt = (attempt: CheckpointAttempt) => {\n    updateLearner((prev) => recordCheckpointAttempt(prev, attempt));\n  };'''
app = replace_once(app, old_save, new_save, "checkpoint state transition")
app_path.write_text(app, encoding="utf-8")

print("Assessment integrity migration applied")
