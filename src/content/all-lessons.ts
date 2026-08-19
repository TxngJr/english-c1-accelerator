import { lessons as foundationLessons } from "./days.ts";
import { extendedLessons } from "./extended-lessons.ts";

export const allLessons = [...foundationLessons, ...extendedLessons];

export const getAnyLesson = (id: string) => allLessons.find((lesson) => lesson.id === id) ?? allLessons[0];

export const nextLessonAfter = (day: number) => allLessons.find((lesson) => lesson.day === day + 1);
