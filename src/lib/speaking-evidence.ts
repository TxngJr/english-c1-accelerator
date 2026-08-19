import type { SpeakingRecord } from "./types.ts";

const NON_READINESS_RECORD_TYPES = new Set(["pronunciation", "baseline-retest"]);

export function isReadinessSpeakingRecord(record: SpeakingRecord): boolean {
  return !NON_READINESS_RECORD_TYPES.has(record.lessonId) && record.durationSeconds > 0;
}

export function longestReadinessSpeakingSeconds(records: SpeakingRecord[]): number {
  return Math.max(0, ...records.filter(isReadinessSpeakingRecord).map((record) => record.durationSeconds));
}
