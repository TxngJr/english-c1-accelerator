import type { ErrorRecord } from "./types";

export const ERROR_MASTERY_RESOLVED = 0.7;

export function normalizeErrorMasteryScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const normalized = value > 1 ? value / 100 : value;
  return Math.max(0, Math.min(1, normalized));
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
      masteryScore: Math.max(0, normalizeErrorMasteryScore(copy[index].masteryScore) - 0.08)
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
      masteryScore: 0.2
    },
    ...errorBank
  ];
}

export function markErrorCorrect(errorBank: ErrorRecord[], id: string): ErrorRecord[] {
  return errorBank.map((record) =>
    record.id === id
      ? {
          ...record,
          masteryScore: Math.min(1, normalizeErrorMasteryScore(record.masteryScore) + 0.15),
          lastSeenAt: new Date().toISOString()
        }
      : record
  );
}
