from pathlib import Path

path = Path("src/components/learning-app.tsx")
text = path.read_text(encoding="utf-8")


def replace_once(old: str, new: str, label: str):
    global text
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 occurrence, found {count}")
    text = text.replace(old, new, 1)

replace_once(
    'import { recordCheckpointAttempt } from "@/lib/checkpoints";',
    'import { recordCheckpointAttempt } from "@/lib/checkpoints";\nimport { DataManagement, StorageHealthBanner } from "@/components/data-management";',
    "data management import",
)
replace_once(
    '''  const reset = () => {\n    void clearRecordingBlobs();\n    const fresh = resetState();\n    setLearner(fresh);\n    setTab("today");\n  };''',
    '''  const reset = () => {\n    const approved = window.confirm("Reset all local progress and speaking recordings? Export a backup first if you may need this data later. This cannot be undone.");\n    if (!approved) return;\n    void clearRecordingBlobs();\n    const fresh = resetState();\n    setLearner(fresh);\n    setTab("today");\n  };''',
    "reset confirmation",
)
replace_once(
    '''            <div className="section card card-pad">\n              <SectionTitle title="Data" subtitle="Progress is stored in this browser." />\n              <button className="btn danger" onClick={reset}>Reset all local progress</button>\n            </div>''',
    '''            <div className="section card card-pad">\n              <SectionTitle title="Data & backup" subtitle="Protect long-term progress before changing browsers/devices or clearing site data." />\n              <DataManagement learner={learner} onImported={setLearner} />\n              <div className="section">\n                <div className="small muted">Danger zone</div>\n                <button className="btn danger" onClick={reset}>Reset all local progress</button>\n              </div>\n            </div>''',
    "settings data panel",
)
replace_once(
    '''      <main className="main">{content}</main>''',
    '''      <main className="main"><StorageHealthBanner />{content}</main>''',
    "global storage banner",
)

path.write_text(text, encoding="utf-8")
print("Data resilience UI applied")
