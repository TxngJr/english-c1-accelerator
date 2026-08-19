from pathlib import Path

path = Path("src/components/learning-app.tsx")
text = path.read_text(encoding="utf-8")

replacements = [
    (
        '  const [startedAt, setStartedAt] = useState<number>(() => Date.now());',
        '  const [startedAt] = useState<number>(() => Date.now());',
        'unused ExerciseCard setter',
    ),
    (
        '''  const [answer, setAnswer] = useState("");\n  const [submitted, setSubmitted] = useState(false);\n  const startedAt = useRef(Date.now());\n  const responseMs = Math.max(1, Date.now() - startedAt.current);\n  const correct = submitted && normalizeAnswer(answer) === normalizeAnswer(item.answer);''',
        '''  const [answer, setAnswer] = useState("");\n  const [submitted, setSubmitted] = useState(false);\n  const [startedAt] = useState(() => Date.now());\n  const [responseMs, setResponseMs] = useState<number>();\n  const correct = submitted && normalizeAnswer(answer) === normalizeAnswer(item.answer);\n\n  const submitRecall = () => {\n    if (!answer.trim()) return;\n    setResponseMs(Math.max(1, Date.now() - startedAt));\n    setSubmitted(true);\n  };''',
        'SRS timer state',
    ),
    (
        '''          if (event.key === "Enter" && answer.trim()) setSubmitted(true);''',
        '''          if (event.key === "Enter") submitRecall();''',
        'SRS Enter submit',
    ),
    (
        '''        <button className="btn primary small" onClick={() => setSubmitted(true)} disabled={!answer.trim()}>''',
        '''        <button className="btn primary small" onClick={submitRecall} disabled={!answer.trim()}>''',
        'SRS button submit',
    ),
    (
        '''                  onClick={() => onGrade(item.id, grade, responseMs)}''',
        '''                  onClick={() => onGrade(item.id, grade, responseMs ?? 1)}''',
        'SRS grade response time',
    ),
    (
        '''          <div className="small muted">Response time: {(responseMs / 1000).toFixed(1)}s</div>''',
        '''          <div className="small muted">Response time: {((responseMs ?? 0) / 1000).toFixed(1)}s</div>''',
        'SRS response display',
    ),
]

for old, new, label in replacements:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected 1 occurrence, found {count}")
    text = text.replace(old, new, 1)

path.write_text(text, encoding="utf-8")
print("UI lint cleanup applied")
