import type { CEFR, LearnerState, Skill } from "./types";
import { normalizeErrorMasteryScore } from "./errors.ts";
import { clearStorageError, reportStorageError } from "./storage-status.ts";

export const STORAGE_KEY = "english-c1-accelerator:v3-production";
const LEGACY_KEYS = ["english-c1-accelerator:v2-personalized", "english-c1-accelerator:v1"];
const CEFR_LEVELS: CEFR[] = ["A1", "A1+", "A2-", "A2", "A2+", "B1-", "B1", "B1+", "B2-", "B2", "B2+", "C1-", "C1"];
const SKILLS: Skill[] = ["speaking", "listening", "reading", "writing", "grammarProduction", "grammarRecognition", "vocabulary", "pronunciation"];
const TRANSCRIPT_SOURCES = ["browser", "openai", "manual", "edited"] as const;

export const defaultState: LearnerState = {
  completedLessonIds: [],
  completedActivityIds: [],
  currentLessonId: "day-1",
  xp: 0,
  streak: 0,
  weeklyMinutes: 0,
  masteredChunks: 0,
  errorBank: [
    {
      id: "baseline-present-simple-be",
      original: "I am go to school.",
      corrected: "I go to school.",
      category: "Present Simple / be-do confusion",
      explanationThai: "Present Simple ของกริยาทั่วไปไม่ใช้ am/is/are หน้า verb: I go, I study, I work.",
      severity: "high",
      firstSeenAt: "2026-08-19T00:00:00.000Z",
      lastSeenAt: "2026-08-19T00:00:00.000Z",
      recurrenceCount: 1,
      masteryScore: 15
    },
    {
      id: "baseline-past-simple",
      original: "I do my homework yesterday.",
      corrected: "I did my homework yesterday.",
      category: "Past Simple automaticity",
      explanationThai: "เมื่อมี finished past time เช่น yesterday ให้สลับกริยาเป็น Past Simple โดยอัตโนมัติ: do → did.",
      severity: "high",
      firstSeenAt: "2026-08-19T00:00:00.000Z",
      lastSeenAt: "2026-08-19T00:00:00.000Z",
      recurrenceCount: 1,
      masteryScore: 10
    },
    {
      id: "baseline-interested-gerund",
      original: "I interests about reads manga.",
      corrected: "I'm interested in reading manga.",
      category: "Collocation + verb form",
      explanationThai: "ใช้ be interested in + noun/-ing: I'm interested in reading manga.",
      severity: "high",
      firstSeenAt: "2026-08-19T00:00:00.000Z",
      lastSeenAt: "2026-08-19T00:00:00.000Z",
      recurrenceCount: 1,
      masteryScore: 10
    },
    {
      id: "baseline-learning-english",
      original: "I try to learing an english.",
      corrected: "I'm trying to learn English.",
      category: "Verb form + natural chunk",
      explanationThai: "ใช้ try to + base verb และ English ไม่ใช้ a/an: I'm trying to learn English.",
      severity: "high",
      firstSeenAt: "2026-08-19T00:00:00.000Z",
      lastSeenAt: "2026-08-19T00:00:00.000Z",
      recurrenceCount: 1,
      masteryScore: 10
    },
    {
      id: "baseline-programming-collocation",
      original: "I do a programing language.",
      corrected: "I practice programming.",
      category: "Natural programming collocation",
      explanationThai: "ภาษาอังกฤษธรรมชาติใช้ practice programming / write code / work on programming projects มากกว่า do a programming language.",
      severity: "medium",
      firstSeenAt: "2026-08-19T00:00:00.000Z",
      lastSeenAt: "2026-08-19T00:00:00.000Z",
      recurrenceCount: 1,
      masteryScore: 20
    }
  ],
  srsItems: [],
  speakingRecords: [],
  exerciseResults: {},
  evidence: {
    structuredMinutes: 0,
    skillMinutes: {
      speaking: 0,
      listening: 0,
      reading: 0,
      writing: 0,
      grammarProduction: 0,
      grammarRecognition: 0,
      vocabulary: 0,
      pronunciation: 0
    },
    stageMinutes: {
      foundation: 0,
      "a2-b1": 0,
      "b1-b2": 0,
      "b2-c1": 0
    },
    listeningAtNormalSpeedMinutes: 0,
    unscriptedSpeakingMinutes: 0,
    writingWords: 0,
    readingWords: 0,
    realWorldMissionsCompleted: 0
  },
  checkpointAttempts: [],
  skillEstimates: {
    speaking: { level: "A1", progress: 25 },
    listening: { level: "A1+", progress: 35 },
    reading: { level: "A2-", progress: 20 },
    writing: { level: "A1+", progress: 30 },
    grammarProduction: { level: "A1+", progress: 35 },
    grammarRecognition: { level: "A2", progress: 55 },
    vocabulary: { level: "A2-", progress: 25 },
    pronunciation: { level: "A1+", progress: 20 }
  },
  settings: {
    theme: "dark",
    textScale: 1,
    immersionLevel: "thai-support",
    audioRate: 1
  }
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function assertArray(value: unknown, field: string): asserts value is unknown[] {
  if (!Array.isArray(value)) throw new Error(`${field} must be an array.`);
}

function assertFiniteNumber(value: unknown, field: string, minimum = 0): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < minimum) {
    throw new Error(`${field} must be a finite number >= ${minimum}.`);
  }
}

function validateSpeakingRecords(value: unknown): void {
  assertArray(value, "speakingRecords");
  value.forEach((item, index) => {
    if (!isRecord(item)) throw new Error(`speakingRecords.${index} must be an object.`);
    for (const field of ["id", "lessonId", "prompt", "createdAt"] as const) {
      if (typeof item[field] !== "string" || !String(item[field]).trim()) {
        throw new Error(`speakingRecords.${index}.${field} must be a non-empty string.`);
      }
    }
    assertFiniteNumber(item.durationSeconds, `speakingRecords.${index}.durationSeconds`);
    assertFiniteNumber(item.selfRating, `speakingRecords.${index}.selfRating`);
    if ((item.selfRating as number) > 5) throw new Error(`speakingRecords.${index}.selfRating must be <= 5.`);

    if (item.notes !== undefined && typeof item.notes !== "string") {
      throw new Error(`speakingRecords.${index}.notes must be a string.`);
    }
    if (item.transcript !== undefined) {
      if (typeof item.transcript !== "string") throw new Error(`speakingRecords.${index}.transcript must be a string.`);
      if (item.transcript.length > 50_000) throw new Error(`speakingRecords.${index}.transcript is too large.`);
    }
    if (item.transcriptSource !== undefined && !TRANSCRIPT_SOURCES.includes(item.transcriptSource as (typeof TRANSCRIPT_SOURCES)[number])) {
      throw new Error(`speakingRecords.${index}.transcriptSource is invalid.`);
    }
    if (item.transcriptVerified !== undefined && typeof item.transcriptVerified !== "boolean") {
      throw new Error(`speakingRecords.${index}.transcriptVerified must be boolean.`);
    }
    if (item.speakingMetrics !== undefined) {
      if (!isRecord(item.speakingMetrics)) throw new Error(`speakingRecords.${index}.speakingMetrics must be an object.`);
      for (const metric of ["wordCount", "wordsPerMinute", "uniqueWordRatio", "fillerCount", "fillerRatePer100Words", "discourseMarkerCount", "selfRepairCount", "repeatedWordCount", "averageSentenceWords"] as const) {
        assertFiniteNumber(item.speakingMetrics[metric], `speakingRecords.${index}.speakingMetrics.${metric}`);
      }
      if ((item.speakingMetrics.uniqueWordRatio as number) > 1) {
        throw new Error(`speakingRecords.${index}.speakingMetrics.uniqueWordRatio must be <= 1.`);
      }
    }
    if (item.aiFeedback !== undefined && !isRecord(item.aiFeedback)) {
      throw new Error(`speakingRecords.${index}.aiFeedback must be an object.`);
    }
  });
}

function validateStateShape(input: unknown): Partial<LearnerState> {
  if (!isRecord(input)) throw new Error("Learner state must be an object.");

  for (const field of ["completedLessonIds", "completedActivityIds", "errorBank", "srsItems", "checkpointAttempts"] as const) {
    if (input[field] !== undefined) assertArray(input[field], field);
  }
  if (input.speakingRecords !== undefined) validateSpeakingRecords(input.speakingRecords);

  if (input.currentLessonId !== undefined && typeof input.currentLessonId !== "string") {
    throw new Error("currentLessonId must be a string.");
  }

  for (const field of ["xp", "streak", "weeklyMinutes", "masteredChunks"] as const) {
    if (input[field] !== undefined) assertFiniteNumber(input[field], field);
  }

  if (input.exerciseResults !== undefined && !isRecord(input.exerciseResults)) {
    throw new Error("exerciseResults must be an object.");
  }

  if (input.skillEstimates !== undefined) {
    if (!isRecord(input.skillEstimates)) throw new Error("skillEstimates must be an object.");
    for (const skill of SKILLS) {
      const estimate = input.skillEstimates[skill];
      if (estimate === undefined) continue;
      if (!isRecord(estimate) || !CEFR_LEVELS.includes(estimate.level as CEFR)) {
        throw new Error(`skillEstimates.${skill}.level is invalid.`);
      }
      assertFiniteNumber(estimate.progress, `skillEstimates.${skill}.progress`);
      if ((estimate.progress as number) > 100) throw new Error(`skillEstimates.${skill}.progress must be <= 100.`);
    }
  }

  if (input.evidence !== undefined && !isRecord(input.evidence)) {
    throw new Error("evidence must be an object.");
  }

  if (input.settings !== undefined) {
    if (!isRecord(input.settings)) throw new Error("settings must be an object.");
    if (input.settings.theme !== undefined && !["light", "dark"].includes(String(input.settings.theme))) {
      throw new Error("settings.theme is invalid.");
    }
    if (input.settings.immersionLevel !== undefined && !["thai-support", "balanced", "mostly-english"].includes(String(input.settings.immersionLevel))) {
      throw new Error("settings.immersionLevel is invalid.");
    }
    if (input.settings.textScale !== undefined) assertFiniteNumber(input.settings.textScale, "settings.textScale", 0.5);
    if (input.settings.audioRate !== undefined) assertFiniteNumber(input.settings.audioRate, "settings.audioRate", 0.25);
  }

  return input as Partial<LearnerState>;
}

export function migrateLearnerState(input: unknown): LearnerState {
  const parsed = validateStateShape(input);
  return {
    ...defaultState,
    ...parsed,
    completedLessonIds: parsed.completedLessonIds ?? [],
    completedActivityIds: parsed.completedActivityIds ?? [],
    errorBank: (parsed.errorBank ?? defaultState.errorBank).map((record) => ({
      ...record,
      masteryScore: normalizeErrorMasteryScore(record.masteryScore)
    })),
    srsItems: parsed.srsItems ?? [],
    speakingRecords: parsed.speakingRecords ?? [],
    exerciseResults: parsed.exerciseResults ?? {},
    skillEstimates: { ...defaultState.skillEstimates, ...(parsed.skillEstimates ?? {}) },
    evidence: {
      ...defaultState.evidence,
      ...(parsed.evidence ?? {}),
      skillMinutes: { ...defaultState.evidence.skillMinutes, ...(parsed.evidence?.skillMinutes ?? {}) },
      stageMinutes: { ...defaultState.evidence.stageMinutes, ...(parsed.evidence?.stageMinutes ?? {}) }
    },
    checkpointAttempts: parsed.checkpointAttempts ?? [],
    settings: { ...defaultState.settings, ...(parsed.settings ?? {}) }
  };
}

function parseState(raw: string): LearnerState {
  return migrateLearnerState(JSON.parse(raw));
}

export function loadState(): LearnerState {
  if (typeof window === "undefined") return structuredClone(defaultState);
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      const state = parseState(current);
      clearStorageError();
      return state;
    }

    for (const legacyKey of LEGACY_KEYS) {
      const legacy = localStorage.getItem(legacyKey);
      if (legacy) {
        const migrated = parseState(legacy);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        clearStorageError();
        return migrated;
      }
    }
    clearStorageError();
    return structuredClone(defaultState);
  } catch (error) {
    reportStorageError(error instanceof Error ? `Progress could not be loaded safely: ${error.message}` : "Progress could not be loaded safely.");
    return structuredClone(defaultState);
  }
}

export function saveState(state: LearnerState): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    clearStorageError();
    return true;
  } catch (error) {
    reportStorageError(error instanceof Error ? `Progress could not be saved: ${error.message}` : "Progress could not be saved.");
    return false;
  }
}

export function replaceStoredState(state: LearnerState): boolean {
  return saveState(migrateLearnerState(state));
}

export function resetState(): LearnerState {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    for (const key of LEGACY_KEYS) localStorage.removeItem(key);
  }
  clearStorageError();
  return structuredClone(defaultState);
}
