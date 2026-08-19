export type Skill =
  | "speaking"
  | "listening"
  | "reading"
  | "writing"
  | "grammarProduction"
  | "grammarRecognition"
  | "vocabulary"
  | "pronunciation";

export type CEFR = "A1" | "A1+" | "A2-" | "A2" | "A2+" | "B1-" | "B1" | "B1+" | "B2-" | "B2" | "B2+" | "C1-" | "C1";

export type ActivityKind =
  | "retrieval"
  | "vocabulary"
  | "grammar"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "review"
  | "assessment"
  | "mission";

export type ExerciseType =
  | "multiple-choice"
  | "fill-blank"
  | "sentence-reorder"
  | "error-correction"
  | "thai-to-english"
  | "english-to-thai"
  | "matching"
  | "dictation"
  | "listening-comprehension"
  | "sentence-transformation"
  | "word-form"
  | "collocation"
  | "build-sentence"
  | "free-writing"
  | "timed-response"
  | "speaking-prompt"
  | "shadowing"
  | "reading-comprehension"
  | "paraphrasing"
  | "summary"
  | "argumentation";

export type Choice = {
  label: string;
  value: string;
};

export type Exercise = {
  id: string;
  type: ExerciseType;
  prompt: string;
  instructionThai?: string;
  answer?: string | string[];
  acceptedAnswers?: string[];
  choices?: Choice[];
  explanationThai?: string;
  pattern?: string;
  example?: string;
  targetSkill: Skill;
  seconds?: number;
  minWords?: number;
  modelAnswer?: string;
  tags?: string[];
};

export type VocabularyItem = {
  id: string;
  wordOrChunk: string;
  meaningThai: string;
  definitionEnglish: string;
  level: CEFR;
  pronunciation?: string;
  partOfSpeech?: string;
  collocations?: string[];
  examples: string[];
  learnerExample?: string;
  commonMistakes?: string[];
  tags?: string[];
};

export type ListeningBlock = {
  id: string;
  title: string;
  script: string;
  firstListenQuestion: string;
  detailQuestions: Exercise[];
  connectedSpeechNotes: string[];
};

export type ReadingBlock = {
  id: string;
  title: string;
  text: string;
  questions: Exercise[];
};

export type LessonActivity = {
  id: string;
  kind: ActivityKind;
  title: string;
  estimatedMinutes: number;
  instructionsThai?: string;
  explanationThai?: string;
  examples?: string[];
  exercises?: Exercise[];
};

export type MasteryCriteria = {
  minimumAccuracy: number;
  minimumProductionAccuracy?: number;
  maximumResponseSeconds?: number;
  speakingSeconds?: number;
  notes: string[];
};

export type Lesson = {
  id: string;
  day: number;
  title: string;
  cefrLevel: CEFR;
  stage: string;
  focus: string;
  prioritySkill: Skill;
  objectives: string[];
  estimatedMinutes: number;
  warmup: LessonActivity[];
  vocabulary: VocabularyItem[];
  grammar: LessonActivity[];
  listening: ListeningBlock[];
  speaking: Exercise[];
  reading?: ReadingBlock[];
  writing?: Exercise[];
  review: Exercise[];
  exitCheck: Exercise[];
  realWorldMission?: string;
  prerequisites: string[];
  masteryCriteria: MasteryCriteria;
};

export type ErrorRecord = {
  id: string;
  original: string;
  corrected: string;
  category: string;
  explanationThai: string;
  severity: "low" | "medium" | "high";
  firstSeenAt: string;
  lastSeenAt: string;
  recurrenceCount: number;
  masteryScore: number;
};

export type SRSItem = {
  id: string;
  sourceId: string;
  prompt: string;
  answer: string;
  direction: "thai-to-english" | "english-to-meaning" | "fill-blank" | "speak" | "create";
  dueAt: string;
  intervalDays: number;
  ease: number;
  repetitions: number;
  lapses: number;
  confidence: number;
  averageResponseMs?: number;
};

export type SpeakingRecord = {
  id: string;
  lessonId: string;
  prompt: string;
  durationSeconds: number;
  createdAt: string;
  selfRating: number;
  notes?: string;
};

export type SkillEstimate = {
  level: CEFR;
  progress: number;
};


export type StudyEvidence = {
  structuredMinutes: number;
  skillMinutes: Record<Skill, number>;
  stageMinutes: Record<"foundation" | "a2-b1" | "b1-b2" | "b2-c1", number>;
  listeningAtNormalSpeedMinutes: number;
  unscriptedSpeakingMinutes: number;
  writingWords: number;
  readingWords: number;
  realWorldMissionsCompleted: number;
};

export type CheckpointLevel = "A2" | "B1" | "B2" | "C1";

export type CheckpointAttempt = {
  id: string;
  level: CheckpointLevel;
  createdAt: string;
  scores: {
    speaking: number;
    listening: number;
    reading: number;
    writing: number;
    languageUse: number;
    interaction: number;
  };
  passed: boolean;
  evaluator: "self" | "teacher" | "ai";
  evaluatorName?: string;
  notes?: string;
};

export type LearnerState = {
  completedLessonIds: string[];
  completedActivityIds: string[];
  currentLessonId: string;
  xp: number;
  streak: number;
  lastStudyDate?: string;
  weeklyMinutes: number;
  masteredChunks: number;
  errorBank: ErrorRecord[];
  srsItems: SRSItem[];
  speakingRecords: SpeakingRecord[];
  skillEstimates: Record<Skill, SkillEstimate>;
  exerciseResults: Record<string, { correct: boolean; score: number; answer?: string; responseMs?: number; answeredAt: string }>;
  evidence: StudyEvidence;
  checkpointAttempts: CheckpointAttempt[];
  settings: {
    theme: "light" | "dark";
    textScale: number;
    immersionLevel: "thai-support" | "balanced" | "mostly-english";
    audioRate: number;
  };
};

export type CurriculumStage = {
  id: string;
  name: string;
  transition: string;
  outcome: string;
  capabilities: string[];
  languageFocus: string[];
  masteryGate: string[];
};
