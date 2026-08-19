import type { LearnerState } from "./types.ts";
import type { StoredRecordingBlob } from "./audio-store.ts";
import { migrateLearnerState } from "./storage.ts";

export const BACKUP_FORMAT = "english-c1-accelerator-backup";
export const BACKUP_VERSION = 2;

export type RecordingBackup = {
  id: string;
  mimeType: string;
  base64: string;
};

export type LearnerBackup = {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  state: LearnerState;
  recordings: RecordingBackup[];
};

export type ParsedLearnerBackup = {
  state: LearnerState;
  recordings: RecordingBackup[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isBase64(value: string): boolean {
  return value.length === 0 || /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value);
}

export async function recordingBlobToBackup(entry: StoredRecordingBlob): Promise<RecordingBackup> {
  const bytes = new Uint8Array(await entry.blob.arrayBuffer());
  const chunkSize = 0x8000;
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return {
    id: entry.id,
    mimeType: entry.blob.type || "audio/webm",
    base64: btoa(binary)
  };
}

export function recordingBackupToBlob(entry: RecordingBackup): StoredRecordingBlob {
  const binary = atob(entry.base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return { id: entry.id, blob: new Blob([bytes], { type: entry.mimeType }) };
}

export function createLearnerBackup(
  state: LearnerState,
  recordings: RecordingBackup[],
  now = new Date()
): LearnerBackup {
  const recordingIds = new Set(recordings.map((recording) => recording.id));
  const safeState = structuredClone(state);
  safeState.speakingRecords = safeState.speakingRecords.filter((record) => recordingIds.has(record.id));

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    state: safeState,
    recordings
  };
}

export function serializeLearnerBackup(
  state: LearnerState,
  recordings: RecordingBackup[],
  now = new Date()
): string {
  return JSON.stringify(createLearnerBackup(state, recordings, now), null, 2);
}

export function parseLearnerBackup(raw: string): ParsedLearnerBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Backup file is not valid JSON.");
  }

  if (!isRecord(parsed)) throw new Error("Backup file has an invalid root structure.");
  if (parsed.format !== BACKUP_FORMAT) throw new Error("This file is not an English C1 Accelerator backup.");
  if (parsed.version !== BACKUP_VERSION) throw new Error(`Unsupported backup version: ${String(parsed.version ?? "unknown")}.`);
  if (typeof parsed.exportedAt !== "string" || Number.isNaN(Date.parse(parsed.exportedAt))) {
    throw new Error("Backup export timestamp is invalid.");
  }
  if (!Array.isArray(parsed.recordings)) throw new Error("Backup recordings must be an array.");

  const recordings = parsed.recordings.map((item, index): RecordingBackup => {
    if (!isRecord(item) || typeof item.id !== "string" || !item.id.trim()) {
      throw new Error(`Backup recording ${index + 1} has an invalid id.`);
    }
    if (typeof item.mimeType !== "string" || !item.mimeType.startsWith("audio/")) {
      throw new Error(`Backup recording ${index + 1} has an invalid audio MIME type.`);
    }
    if (typeof item.base64 !== "string" || !isBase64(item.base64)) {
      throw new Error(`Backup recording ${index + 1} contains invalid base64 data.`);
    }
    return { id: item.id, mimeType: item.mimeType, base64: item.base64 };
  });

  const recordingIds = new Set(recordings.map((recording) => recording.id));
  if (recordingIds.size !== recordings.length) throw new Error("Backup contains duplicate recording ids.");

  const state = migrateLearnerState(parsed.state);
  const missingAudio = state.speakingRecords.filter((record) => !recordingIds.has(record.id));
  if (missingAudio.length) {
    throw new Error(`Backup is missing ${missingAudio.length} speaking recording file(s).`);
  }

  return { state, recordings };
}

export function backupFileName(now = new Date()): string {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  return `english-c1-progress-${stamp}.json`;
}
