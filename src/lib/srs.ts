import type { SRSItem } from "./types";

export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5;

export function scheduleReview(item: SRSItem, grade: ReviewGrade, responseMs?: number): SRSItem {
  const failed = grade < 3;
  let intervalDays = item.intervalDays;
  let repetitions = item.repetitions;
  let lapses = item.lapses;
  let ease = item.ease;

  if (failed) {
    repetitions = 0;
    lapses += 1;
    intervalDays = 1;
    ease = Math.max(1.3, ease - 0.2);
  } else {
    repetitions += 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 3;
    else intervalDays = Math.max(1, Math.round(intervalDays * ease));

    const qualityDelta = grade === 5 ? 0.12 : grade === 4 ? 0.03 : -0.08;
    ease = Math.max(1.3, Math.min(3.0, ease + qualityDelta));
  }

  if (responseMs && item.averageResponseMs) {
    const speedRatio = responseMs / item.averageResponseMs;
    if (speedRatio > 1.8) intervalDays = Math.max(1, Math.floor(intervalDays * 0.75));
  }

  const due = new Date();
  due.setDate(due.getDate() + intervalDays);

  return {
    ...item,
    intervalDays,
    repetitions,
    lapses,
    ease,
    dueAt: due.toISOString(),
    confidence: Math.max(0, Math.min(1, grade / 5)),
    averageResponseMs: responseMs
      ? item.averageResponseMs
        ? Math.round((item.averageResponseMs * 2 + responseMs) / 3)
        : responseMs
      : item.averageResponseMs
  };
}

export function dueItems(items: SRSItem[], now = new Date()): SRSItem[] {
  return items
    .filter((item) => new Date(item.dueAt).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export function masteredSrsCount(items: SRSItem[]): number {
  return new Set(
    items
      .filter((item) => item.repetitions >= 3 && item.confidence >= 0.8)
      .map((item) => item.sourceId)
  ).size;
}

export function createSrsItem(
  sourceId: string,
  prompt: string,
  answer: string,
  direction: SRSItem["direction"] = "thai-to-english"
): SRSItem {
  return {
    id: `srs-${sourceId}-${Date.now()}`,
    sourceId,
    prompt,
    answer,
    direction,
    dueAt: new Date().toISOString(),
    intervalDays: 0,
    ease: 2.3,
    repetitions: 0,
    lapses: 0,
    confidence: 0
  };
}
