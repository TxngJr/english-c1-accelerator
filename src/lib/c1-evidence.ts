import { c1ExitListening, c1ExitReading, c1ExitSpeaking, c1ExitWriting } from "../content/c1-exit-pack.ts";
import type { LearnerState } from "./types.ts";

export type C1ExitEvidenceStatus = {
  totalTasks: number;
  answeredTasks: number;
  listeningRequired: number;
  listeningCompleted: number;
  speakingRequired: number;
  speakingRecorded: number;
  longestSpeakingSeconds: number;
  complete: boolean;
};

export function c1ExitEvidenceStatus(state: LearnerState): C1ExitEvidenceStatus {
  const exerciseIds = [
    ...c1ExitListening.flatMap((block) => block.detailQuestions.map((exercise) => exercise.id)),
    ...c1ExitReading.flatMap((block) => block.questions.map((exercise) => exercise.id)),
    ...c1ExitSpeaking.map((exercise) => exercise.id),
    ...c1ExitWriting.map((exercise) => exercise.id)
  ];
  const answeredTasks = exerciseIds.filter((id) => Boolean(state.exerciseResults[id])).length;
  const assessmentRecords = state.speakingRecords.filter((record) => record.lessonId === "c1-exit-assessment");
  const longestSpeakingSeconds = Math.max(0, ...assessmentRecords.map((record) => record.durationSeconds));
  const speakingRecorded = c1ExitSpeaking.filter((exercise) =>
    assessmentRecords.some((record) =>
      record.prompt === exercise.prompt &&
      record.durationSeconds >= Math.max(60, Math.round((exercise.seconds ?? 120) * 0.6))
    )
  ).length;
  const listeningCompleted = c1ExitListening.filter((block) =>
    state.completedActivityIds.includes(`c1-exit-listening-${block.id}`)
  ).length;

  return {
    totalTasks: exerciseIds.length,
    answeredTasks,
    listeningRequired: c1ExitListening.length,
    listeningCompleted,
    speakingRequired: c1ExitSpeaking.length,
    speakingRecorded,
    longestSpeakingSeconds,
    complete:
      answeredTasks === exerciseIds.length &&
      speakingRecorded === c1ExitSpeaking.length &&
      listeningCompleted === c1ExitListening.length &&
      longestSpeakingSeconds >= 360
  };
}
