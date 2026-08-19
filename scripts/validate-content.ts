import { allLessons } from "../src/content/all-lessons.ts";
import { lessons as foundationLessons } from "../src/content/days.ts";
import { extendedLessons } from "../src/content/extended-lessons.ts";
import { extendedModules } from "../src/content/extended.ts";
import { moduleMaterials } from "../src/content/module-materials.ts";
import { c1ExitListening, c1ExitReading, c1ExitSpeaking, c1ExitWriting } from "../src/content/c1-exit-pack.ts";
import type { Exercise, LessonActivity, ListeningBlock, ReadingBlock } from "../src/lib/types.ts";

function exerciseIds(exercises: Exercise[] = []): string[] {
  return exercises.map((exercise) => exercise.id);
}

function activityIds(activities: LessonActivity[]): string[] {
  return activities.flatMap((activity) => [activity.id, ...exerciseIds(activity.exercises)]);
}

function listeningIds(blocks: ListeningBlock[]): string[] {
  return blocks.flatMap((block) => [block.id, ...exerciseIds(block.detailQuestions)]);
}

function readingIds(blocks: ReadingBlock[] = []): string[] {
  return blocks.flatMap((block) => [block.id, ...exerciseIds(block.questions)]);
}

const exerciseOnlyIds = allLessons.flatMap((lesson) => [
  ...lesson.warmup.flatMap((activity) => exerciseIds(activity.exercises)),
  ...lesson.grammar.flatMap((activity) => exerciseIds(activity.exercises)),
  ...lesson.listening.flatMap((block) => exerciseIds(block.detailQuestions)),
  ...exerciseIds(lesson.speaking),
  ...(lesson.reading ?? []).flatMap((block) => exerciseIds(block.questions)),
  ...exerciseIds(lesson.writing),
  ...exerciseIds(lesson.review),
  ...exerciseIds(lesson.exitCheck)
]);

const allContentIds = allLessons.flatMap((lesson) => [
  lesson.id,
  ...activityIds(lesson.warmup),
  ...lesson.vocabulary.map((item) => item.id),
  ...activityIds(lesson.grammar),
  ...listeningIds(lesson.listening),
  ...exerciseIds(lesson.speaking),
  ...readingIds(lesson.reading),
  ...exerciseIds(lesson.writing),
  ...exerciseIds(lesson.review),
  ...exerciseIds(lesson.exitCheck)
]);

const duplicateContentIds = [...new Set(allContentIds.filter((id, index) => allContentIds.indexOf(id) !== index))];
const daySequenceErrors = allLessons
  .map((lesson, index) => ({ lesson, expected: index + 1 }))
  .filter(({ lesson, expected }) => lesson.day !== expected)
  .map(({ lesson, expected }) => `${lesson.id}: day=${lesson.day}, expected=${expected}`);

const incompleteLessons = allLessons
  .filter((lesson) =>
    lesson.warmup.length === 0 ||
    lesson.vocabulary.length === 0 ||
    lesson.grammar.length === 0 ||
    lesson.listening.length === 0 ||
    lesson.speaking.length === 0 ||
    !lesson.reading?.length ||
    !lesson.writing?.length ||
    lesson.review.length === 0 ||
    lesson.exitCheck.length === 0
  )
  .map((lesson) => lesson.id);

const missingMaterials = extendedModules.filter((module) => !moduleMaterials[module.id]).map((module) => module.id);
const totalMinutes = allLessons.reduce((sum, lesson) => sum + lesson.estimatedMinutes, 0);
const c1ExitIds = [
  ...listeningIds(c1ExitListening),
  ...readingIds(c1ExitReading),
  ...exerciseIds(c1ExitSpeaking),
  ...exerciseIds(c1ExitWriting)
];
const c1ExitTaskCount = c1ExitListening.reduce((sum, block) => sum + block.detailQuestions.length, 0)
  + c1ExitReading.reduce((sum, block) => sum + block.questions.length, 0)
  + c1ExitSpeaking.length
  + c1ExitWriting.length;
const c1ListeningWordCounts = c1ExitListening.map((block) => block.script.trim().split(/\s+/).length);
const c1ReadingWordCounts = c1ExitReading.map((block) => block.text.trim().split(/\s+/).length);
const c1ExitDuplicateIds = [...new Set(c1ExitIds.filter((id, index) => c1ExitIds.indexOf(id) !== index))];
const report = {
  foundationLessons: foundationLessons.length,
  extendedModules: extendedModules.length,
  extendedPlayableLessons: extendedLessons.length,
  totalPlayableDays: allLessons.length,
  estimatedStructuredHours: Math.round(totalMinutes / 6) / 10,
  exercises: exerciseOnlyIds.length,
  contentItems: allContentIds.length,
  duplicateContentIds,
  daySequenceErrors,
  incompleteLessons,
  missingMaterials,
  c1ExitAssessment: {
    listeningBlocks: c1ExitListening.length,
    listeningWords: c1ListeningWordCounts,
    readingTexts: c1ExitReading.length,
    readingWords: c1ReadingWordCounts,
    speakingTasks: c1ExitSpeaking.length,
    writingTasks: c1ExitWriting.length,
    totalTasks: c1ExitTaskCount,
    duplicateIds: c1ExitDuplicateIds
  }
};

console.log(JSON.stringify(report, null, 2));

if (
  foundationLessons.length < 14 ||
  extendedModules.length !== 30 ||
  extendedLessons.length !== 210 ||
  allLessons.length !== 224 ||
  duplicateContentIds.length > 0 ||
  daySequenceErrors.length > 0 ||
  incompleteLessons.length > 0 ||
  missingMaterials.length > 0 ||
  totalMinutes / 60 < 550 ||
  c1ExitListening.length !== 3 ||
  c1ListeningWordCounts.some((count) => count < 700) ||
  c1ExitReading.length !== 2 ||
  c1ReadingWordCounts.some((count) => count < 1200) ||
  c1ExitSpeaking.length < 4 ||
  c1ExitWriting.length < 3 ||
  c1ExitDuplicateIds.length > 0
) {
  process.exitCode = 1;
}
