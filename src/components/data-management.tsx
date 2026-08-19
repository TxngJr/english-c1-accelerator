"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { LearnerState } from "@/lib/types";
import { listRecordingBlobs, replaceRecordingBlobs } from "@/lib/audio-store";
import { replaceStoredState } from "@/lib/storage";
import { backupFileName, parseLearnerBackup, recordingBackupToBlob, recordingBlobToBackup, serializeLearnerBackup } from "@/lib/state-transfer";
import { getServerStorageError, getStorageError, subscribeStorageStatus } from "@/lib/storage-status";

export function StorageHealthBanner() {
  const error = useSyncExternalStore(subscribeStorageStatus, getStorageError, getServerStorageError);
  if (!error) return null;

  return (
    <div className="feedback incorrect" role="alert" style={{ marginBottom: 16 }}>
      <strong>Local progress storage needs attention.</strong>
      {error} Export a backup from Settings before continuing if possible.
    </div>
  );
}

export function DataManagement({
  learner,
  onImported
}: {
  learner: LearnerState;
  onImported: (state: LearnerState) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error" | "warning"; text: string }>();

  const exportBackup = async () => {
    setBusy(true);
    setMessage(undefined);
    try {
      const stored = await listRecordingBlobs();
      const recordings = await Promise.all(stored.map(recordingBlobToBackup));
      const linkedAudioIds = new Set(recordings.map((recording) => recording.id));
      const missingCount = learner.speakingRecords.filter((record) => !linkedAudioIds.has(record.id)).length;
      const raw = serializeLearnerBackup(learner, recordings);
      const blob = new Blob([raw], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = backupFileName();
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setMessage(missingCount
        ? { kind: "warning", text: `Backup exported. ${missingCount} old speaking record(s) had no stored audio and were excluded so they cannot become false evidence after restore.` }
        : { kind: "success", text: `Backup exported with ${recordings.length} speaking audio file(s).` });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Could not export the backup." });
    } finally {
      setBusy(false);
    }
  };

  const importBackup = async (file: File) => {
    setBusy(true);
    setMessage(undefined);
    try {
      const parsed = parseLearnerBackup(await file.text());
      const approved = window.confirm(
        `Restore this backup?\n\nLessons: ${parsed.state.completedLessonIds.length}\nSpeaking recordings: ${parsed.recordings.length}\nXP: ${parsed.state.xp}\n\nThis will replace progress currently stored in this browser.`
      );
      if (!approved) return;

      const previousRecordings = await listRecordingBlobs();
      const restoredRecordings = parsed.recordings.map(recordingBackupToBlob);
      await replaceRecordingBlobs(restoredRecordings);

      if (!replaceStoredState(parsed.state)) {
        await replaceRecordingBlobs(previousRecordings);
        throw new Error("The restored progress could not be committed. Existing audio was restored and your current progress was left unchanged.");
      }

      onImported(parsed.state);
      setMessage({ kind: "success", text: `Backup restored successfully with ${restoredRecordings.length} speaking audio file(s).` });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Could not restore the backup." });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setBusy(false);
    }
  };

  return (
    <div className="stack">
      <div>
        <p className="muted">
          Export a portable backup before changing browsers/devices or resetting progress. The backup includes validated learner state and every speaking recording that still exists in IndexedDB.
        </p>
        <div className="top-actions">
          <button className="btn" onClick={() => void exportBackup()} disabled={busy}>
            {busy ? "Working…" : "Export full backup"}
          </button>
          <button className="btn" onClick={() => fileInputRef.current?.click()} disabled={busy}>
            Import backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importBackup(file);
            }}
          />
        </div>
      </div>
      {message ? (
        <div className={`feedback ${message.kind === "success" ? "correct" : message.kind === "error" ? "incorrect" : ""}`} role="status">
          <strong>{message.kind === "success" ? "Done." : message.kind === "error" ? "Backup failed." : "Backup warning."}</strong>
          {message.text}
        </div>
      ) : null}
    </div>
  );
}
