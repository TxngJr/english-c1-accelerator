import type { LearnerState } from "./types.ts";
import { migrateLearnerState } from "./storage.ts";

export const BACKUP_FORMAT = "english-c1-accelerator-backup";
export const BACKUP_VERSION = 1;

export type LearnerBackup = {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  state: LearnerState;
};

export function createLearnerBackup(state: LearnerState, now = new Date()): LearnerBackup {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    state: structuredClone(state)
  };
}

export function serializeLearnerBackup(state: LearnerState, now = new Date()): string {
  return JSON.stringify(createLearnerBackup(state, now), null, 2);
}

export function parseLearnerBackup(raw: string): LearnerState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Backup file is not valid JSON.");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Backup file has an invalid root structure.");
  }

  const candidate = parsed as Partial<LearnerBackup>;
  if (candidate.format !== BACKUP_FORMAT) {
    throw new Error("This file is not an English C1 Accelerator backup.");
  }
  if (candidate.version !== BACKUP_VERSION) {
    throw new Error(`Unsupported backup version: ${String(candidate.version ?? "unknown")}.`);
  }
  if (typeof candidate.exportedAt !== "string" || Number.isNaN(Date.parse(candidate.exportedAt))) {
    throw new Error("Backup export timestamp is invalid.");
  }

  return migrateLearnerState(candidate.state);
}

export function backupFileName(now = new Date()): string {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  return `english-c1-progress-${stamp}.json`;
}
