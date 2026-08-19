from pathlib import Path

path = Path("src/components/learning-app.tsx")
text = path.read_text(encoding="utf-8")

replacements = [
    (
        'import { longestReadinessSpeakingSeconds } from "@/lib/speaking-evidence";',
        'import { longestReadinessSpeakingSeconds } from "@/lib/speaking-evidence";\nimport { createEvidenceId } from "@/lib/ids";',
        "id helper import",
    ),
    (
        '    const recordId = `pronunciation-${trackIndex}-${Date.now()}`;',
        '    const recordId = createEvidenceId(`pronunciation-${trackIndex}`);',
        "pronunciation record id",
    ),
]

for old, new, label in replacements:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 occurrence, found {count}")
    text = text.replace(old, new, 1)

path.write_text(text, encoding="utf-8")
print("Pronunciation id generation repaired")
