import type { SpeakingRecord } from "./types.ts";
import { transcriptEvidenceIsAuditable } from "./speaking-coach.ts";

const NON_READINESS_RECORD_TYPES = new Set(["pronunciation", "baseline-retest"]);

export function isReadinessSpeakingRecord(record: SpeakingRecord): boolean {
  return !NON_READINESS_RECORD_TYPES.has(record.lessonId) && record.durationSeconds > 0;
}

export function longestReadinessSpeakingSeconds(records: SpeakingRecord[]): number {
  return Math.max(0, ...records.filter(isReadinessSpeakingRecord).map((record) => record.durationSeconds));
}

export function isAuditableTranscribedSpeakingRecord(record: SpeakingRecord, minimumSeconds = 45): boolean {
  return Boolean(
    isReadinessSpeakingRecord(record) &&
    record.durationSeconds >= minimumSeconds &&
    record.transcriptVerified === true &&
    record.transcript?.trim() &&
    transcriptEvidenceIsAuditable(record.transcript, record.durationSeconds)
  );
}

export function transcribedReadinessSpeakingCount(records: SpeakingRecord[], minimumSeconds = 45): number {
  return records.filter((record) => isAuditableTranscribedSpeakingRecord(record, minimumSeconds)).length;
}

export function longestTranscribedReadinessSpeakingSeconds(records: SpeakingRecord[]): number {
  return Math.max(
    0,
    ...records
      .filter((record) => isAuditableTranscribedSpeakingRecord(record))
      .map((record) => record.durationSeconds)
  );
}
