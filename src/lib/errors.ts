import type { ErrorRecord } from "./types";

export const ERROR_MASTERY_RESOLVED = 70;

/** Normalize all historical Error Bank values onto one 0–100 scale. */
export function normalizeErrorMasteryScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const normalized = value >= 0 && value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, normalized));
}

export function upsertError(
  errorBank: ErrorRecord[],
  input: Omit<ErrorRecord, "id" | "firstSeenAt" | "lastSeenAt" | "recurrenceCount" | "masteryScore">
    & { now?: string }
): ErrorRecord[] {
  const now = input.now ?? new Date().toISOString();
  const index = errorBank.findIndex(
    (record) =>
      record.original.trim().toLowerCase() === input.original.trim().toLowerCase() &&
      record.category === input.category
  );

  if (index >= 0) {
    const copy = [...errorBank];
    copy[index] = {
      ...copy[index],
      corrected: input.corrected,
      explanationThai: input.explanationThai,
      severity: input.severity,
      lastSeenAt: now,
      recurrenceCount: copy[index].recurrenceCount + 1,
      masteryScore: Math.max(0, normalizeErrorMasteryScore(copy[index].masteryScore) - 8)
    };
    return copy;
  }

  return [
    {
      id: `error-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      original: input.original,
      corrected: input.corrected,
      category: input.category,
      explanationThai: input.explanationThai,
      severity: input.severity,
      firstSeenAt: now,
      lastSeenAt: now,
      recurrenceCount: 1,
      masteryScore: 20
    },
    ...errorBank
  ];
}

export function markErrorCorrect(errorBank: ErrorRecord[], id: string): ErrorRecord[] {
  return errorBank.map((record) =>
    record.id === id
      ? {
          ...record,
          masteryScore: Math.min(100, normalizeErrorMasteryScore(record.masteryScore) + 15),
          lastSeenAt: new Date().toISOString()
        }
      : record
  );
}
