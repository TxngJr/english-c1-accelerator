from pathlib import Path

path = Path("src/components/learning-app.tsx")
text = path.read_text(encoding="utf-8")
old = '''                    {due.map((item) => <SrsReviewCard key={item.id} item={item} onGrade={gradeReview} />)}\n                        </div>\n                      </div>\n                    ))}\n                  </div>'''
new = '''                    {due.map((item) => <SrsReviewCard key={item.id} item={item} onGrade={gradeReview} />)}\n                  </div>'''
count = text.count(old)
if count != 1:
    raise RuntimeError(f"review JSX: expected 1 occurrence, found {count}")
path.write_text(text.replace(old, new, 1), encoding="utf-8")
print("Review JSX repaired")
