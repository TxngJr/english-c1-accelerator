import type { CEFR, Exercise, LearnerState, Lesson, Skill } from "./types";

const levelOrder: CEFR[] = ["A1","A1+","A2-","A2","A2+","B1-","B1","B1+","B2-","B2","B2+","C1-","C1"];

export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ");
}

export function checkExerciseAnswer(exercise: Exercise, learnerAnswer: string): boolean {
  const candidate = normalizeAnswer(learnerAnswer);
  const answers = [
    ...(typeof exercise.answer === "string" ? [exercise.answer] : Array.isArray(exercise.answer) ? exercise.answer : []),
    ...(exercise.acceptedAnswers ?? [])
  ].map(normalizeAnswer);

  if (!answers.length) return learnerAnswer.trim().length > 0;
  return answers.includes(candidate);
}

export function lessonExerciseIds(lesson: Lesson): string[] {
  return [
    ...lesson.warmup.flatMap((a) => a.exercises ?? []),
    ...lesson.grammar.flatMap((a) => a.exercises ?? []),
    ...lesson.listening.flatMap((l) => l.detailQuestions),
    ...lesson.speaking,
    ...(lesson.reading?.flatMap((r) => r.questions) ?? []),
    ...(lesson.writing ?? []),
    ...lesson.review,
    ...lesson.exitCheck
  ].map((exercise) => exercise.id);
}

export function isObjectivelyScoredExercise(exercise: Exercise): boolean {
  return Boolean(exercise.choices?.length || exercise.answer || exercise.acceptedAnswers?.length);
}

function objectiveExercises(lesson: Lesson): Exercise[] {
  return [
    ...lesson.warmup.flatMap((activity) => activity.exercises ?? []),
    ...lesson.grammar.flatMap((activity) => activity.exercises ?? []),
    ...lesson.listening.flatMap((block) => block.detailQuestions),
    ...lesson.speaking,
    ...(lesson.reading?.flatMap((block) => block.questions) ?? []),
    ...(lesson.writing ?? []),
    ...lesson.review,
    ...lesson.exitCheck
  ].filter(isObjectivelyScoredExercise);
}

export function lessonAccuracy(state: LearnerState, lesson: Lesson): number {
  const objective = objectiveExercises(lesson);
  const results = objective.map((exercise) => state.exerciseResults[exercise.id]).filter(Boolean);
  if (!results.length) return 0;
  return results.reduce((sum, result) => sum + result.score, 0) / results.length;
}

export function canStartLesson(state: LearnerState, lesson: Lesson): boolean {
  return lesson.prerequisites.every((prerequisiteId) => state.completedLessonIds.includes(prerequisiteId));
}

export function canCompleteLesson(state: LearnerState, lesson: Lesson): boolean {
  if (!canStartLesson(state, lesson)) return false;

  const ids = lessonExerciseIds(lesson);
  const attempted = ids.filter((id) => Boolean(state.exerciseResults[id])).length;
  const attemptCoverage = ids.length ? attempted / ids.length : 0;
  const accuracy = lessonAccuracy(state, lesson);

  const groupCoverage = (exercises: Exercise[], minimum: number) => {
    if (!exercises.length) return true;
    const count = exercises.filter((exercise) => Boolean(state.exerciseResults[exercise.id])).length;
    return count / exercises.length >= minimum;
  };

  const warmupExercises = lesson.warmup.flatMap((activity) => activity.exercises ?? []);
  const grammarExercises = lesson.grammar.flatMap((activity) => activity.exercises ?? []);
  const listeningExercises = lesson.listening.flatMap((block) => block.detailQuestions);
  const readingExercises = lesson.reading?.flatMap((block) => block.questions) ?? [];
  const writingExercises = lesson.writing ?? [];

  const exitAttempted = lesson.exitCheck.every((exercise) => Boolean(state.exerciseResults[exercise.id]));
  const componentCoverage =
    groupCoverage(warmupExercises, 0.5) &&
    groupCoverage(grammarExercises, 0.67) &&
    groupCoverage(listeningExercises, 0.67) &&
    groupCoverage(lesson.speaking, 0.67) &&
    groupCoverage(readingExercises, 0.67) &&
    groupCoverage(writingExercises, 1) &&
    groupCoverage(lesson.review, 0.5);

  const objective = objectiveExercises(lesson);
  const objectiveAttempted = objective.length > 0 && objective.every((exercise) => Boolean(state.exerciseResults[exercise.id]));
  const productionObjective = objective.filter((exercise) => exercise.targetSkill === "grammarProduction" || exercise.targetSkill === "speaking");
  const productionResults = productionObjective.map((exercise) => state.exerciseResults[exercise.id]).filter(Boolean);
  const productionAccuracy = productionResults.length
    ? productionResults.reduce((sum, result) => sum + result.score, 0) / productionResults.length
    : accuracy;

  const records = state.speakingRecords.filter((record) => record.lessonId === lesson.id);
  const longest = Math.max(0, ...records.map((record) => record.durationSeconds));
  const isExtended = lesson.day >= 15;
  const isModuleGate = isExtended && (lesson.day - 15) % 7 === 6;
  const targetSpeaking = lesson.masteryCriteria.speakingSeconds ?? 30;
  const requiredRecordedSeconds = isModuleGate
    ? Math.max(45, Math.round(targetSpeaking * 0.6))
    : isExtended
      ? Math.min(60, Math.max(20, Math.round(targetSpeaking * 0.25)))
      : lesson.day >= 7
        ? Math.min(30, Math.max(15, Math.round(targetSpeaking * 0.35)))
        : Math.min(20, Math.max(10, Math.round(targetSpeaking * 0.25)));
  const speakingEvidence = longest >= requiredRecordedSeconds;

  const listeningEvidence = lesson.listening.every((block) =>
    state.completedActivityIds.includes(`${lesson.id}-listening-${block.id}`)
  );
  const missionEvidence = !lesson.realWorldMission || state.completedActivityIds.includes(`${lesson.id}-mission`);
  const productionFloor = lesson.masteryCriteria.minimumProductionAccuracy ?? lesson.masteryCriteria.minimumAccuracy;

  return (
    exitAttempted &&
    componentCoverage &&
    objectiveAttempted &&
    speakingEvidence &&
    listeningEvidence &&
    missionEvidence &&
    attemptCoverage >= 0.78 &&
    accuracy >= lesson.masteryCriteria.minimumAccuracy &&
    productionAccuracy >= productionFloor
  );
}

export function bumpSkillEstimate(
  state: LearnerState,
  skill: Skill,
  score: number
): LearnerState {
  const current = state.skillEstimates[skill];
  let progress = current.progress + (score >= 1 ? 0.7 : -1.4);
  let idx = Math.max(0, levelOrder.indexOf(current.level));

  while (progress >= 100 && idx < levelOrder.length - 1) {
    progress -= 100;
    idx += 1;
  }

  while (progress < 0 && idx > 0) {
    progress += 100;
    idx -= 1;
  }

  if (idx === levelOrder.length - 1) progress = Math.min(99.99, progress);
  if (idx === 0) progress = Math.max(0, progress);

  return {
    ...state,
    skillEstimates: {
      ...state.skillEstimates,
      [skill]: {
        level: levelOrder[idx],
        progress: Math.round(Math.max(0, Math.min(99.99, progress)) * 100) / 100
      }
    }
  };
}

export function recurringErrors(state: LearnerState) {
  const counts = new Map<string, number>();
  for (const err of state.errorBank) {
    counts.set(err.category, (counts.get(err.category) ?? 0) + err.recurrenceCount);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export function adaptivePriority(state: LearnerState): string {
  const recurring = recurringErrors(state);
  if (recurring[0]?.category) return `Reduce recurring ${recurring[0].category} errors through production drills.`;

  const skills = Object.entries(state.skillEstimates) as [Skill, LearnerState["skillEstimates"][Skill]][];
  skills.sort((a, b) => {
    const levelDiff = levelOrder.indexOf(a[1].level) - levelOrder.indexOf(b[1].level);
    return levelDiff || a[1].progress - b[1].progress;
  });

  const weakest = skills[0]?.[0] ?? "speaking";
  if (weakest === "speaking") return "Build automatic basic sentence production and increase response length.";
  return `Raise ${weakest.replace(/([A-Z])/g, " $1").toLowerCase()} through targeted retrieval and production.`;
}
