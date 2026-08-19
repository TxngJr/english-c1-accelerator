import type { LearnerState } from "./types";
import { normalizeErrorMasteryScore } from "./errors";

export const STORAGE_KEY = "english-c1-accelerator:v3-production";
const LEGACY_KEYS = ["english-c1-accelerator:v2-personalized", "english-c1-accelerator:v1"];

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
      masteryScore: 0.15
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
      masteryScore: 0.1
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
      masteryScore: 0.1
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
      masteryScore: 0.1
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
      masteryScore: 0.2
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

function mergeState(parsed: Partial<LearnerState>): LearnerState {
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
  return mergeState(JSON.parse(raw) as Partial<LearnerState>);
}

export function loadState(): LearnerState {
  if (typeof window === "undefined") return structuredClone(defaultState);
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) return parseState(current);

    for (const legacyKey of LEGACY_KEYS) {
      const legacy = localStorage.getItem(legacyKey);
      if (legacy) {
        const migrated = parseState(legacy);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
    return structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

export function saveState(state: LearnerState): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function resetState(): LearnerState {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    for (const key of LEGACY_KEYS) localStorage.removeItem(key);
  }
  return structuredClone(defaultState);
}
