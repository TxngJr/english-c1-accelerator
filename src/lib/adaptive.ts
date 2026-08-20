import { dailySkillBaseWeights, immersionMinimums, personalizedStages, type ProgramStageId } from "../content/personalized-program.ts";
import type { CEFR, CheckpointAttempt, CheckpointLevel, LearnerState, Skill } from "./types";
import { latestVerifiedCheckpoint } from "./checkpoints.ts";
import {
  longestReadinessSpeakingSeconds,
  longestTranscribedReadinessSpeakingSeconds,
  transcribedReadinessSpeakingCount
} from "./speaking-evidence.ts";

export const levelOrder: CEFR[] = ["A1", "A1+", "A2-", "A2", "A2+", "B1-", "B1", "B1+", "B2-", "B2", "B2+", "C1-", "C1"];

export function levelIndex(level: CEFR): number {
  return Math.max(0, levelOrder.indexOf(level));
}

export function atLeast(actual: CEFR, minimum: CEFR): boolean {
  return levelIndex(actual) >= levelIndex(minimum);
}

export function stageIdForDay(day: number): ProgramStageId {
  if (day <= 56) return "foundation";
  if (day <= 112) return "a2-b1";
  if (day <= 168) return "b1-b2";
  return "b2-c1";
}

export function stageIdForLevel(level: CheckpointLevel): ProgramStageId {
  if (level === "A2") return "foundation";
  if (level === "B1") return "a2-b1";
  if (level === "B2") return "b1-b2";
  return "b2-c1";
}

const thresholdByLevel: Record<CheckpointLevel, Partial<Record<Skill, CEFR>>> = {
  A2: {
    speaking: "A2-",
    listening: "A2-",
    reading: "A2",
    writing: "A2-",
    grammarProduction: "A2-",
    vocabulary: "A2-"
  },
  B1: {
    speaking: "B1-",
    listening: "B1-",
    reading: "B1",
    writing: "B1-",
    grammarProduction: "B1-",
    vocabulary: "B1-"
  },
  B2: {
    speaking: "B2-",
    listening: "B2-",
    reading: "B2-",
    writing: "B2-",
    grammarProduction: "B1+",
    vocabulary: "B2-"
  },
  C1: {
    speaking: "C1-",
    listening: "C1-",
    reading: "C1-",
    writing: "C1-",
    grammarProduction: "B2+",
    vocabulary: "B2+",
    pronunciation: "B2"
  }
};

const speakingDurationFloor: Record<CheckpointLevel, number> = {
  A2: 45,
  B1: 120,
  B2: 240,
  C1: 360
};

const transcribedSampleFloor: Record<CheckpointLevel, number> = {
  A2: 0,
  B1: 1,
  B2: 2,
  C1: 4
};

const transcribedSampleMinimumSeconds: Record<CheckpointLevel, number> = {
  A2: 45,
  B1: 60,
  B2: 120,
  C1: 120
};

const cumulativeGuidedHourFloors: Record<CheckpointLevel, number> = {
  A2: 120,
  B1: 250,
  B2: 390,
  C1: 540
};

const normalSpeedListeningMinutesFloor: Record<CheckpointLevel, number> = {
  A2: 180,
  B1: 600,
  B2: 1200,
  C1: 1800
};

export type ReadinessCriterion = {
  id: string;
  label: string;
  passed: boolean;
  value: string;
  target: string;
  critical: boolean;
};

export type ReadinessReport = {
  level: CheckpointLevel;
  score: number;
  ready: boolean;
  criteria: ReadinessCriterion[];
  blockers: string[];
  latestCheckpoint?: CheckpointAttempt;
};

function latestCheckpoint(state: LearnerState, level: CheckpointLevel): CheckpointAttempt | undefined {
  return latestVerifiedCheckpoint(state, level);
}

export function readinessReport(state: LearnerState, level: CheckpointLevel): ReadinessReport {
  const criteria: ReadinessCriterion[] = [];
  const thresholds = thresholdByLevel[level];

  for (const [skill, minimum] of Object.entries(thresholds) as [Skill, CEFR][]) {
    const current = state.skillEstimates[skill];
    criteria.push({
      id: `skill-${skill}`,
      label: `${skill.replace(/([A-Z])/g, " $1")} estimate`,
      passed: atLeast(current.level, minimum),
      value: `${current.level} (${current.progress}%)`,
      target: `≥ ${minimum}`,
      critical: ["speaking", "listening", "reading", "writing"].includes(skill)
    });
  }

  const longestSpeaking = longestReadinessSpeakingSeconds(state.speakingRecords);
  criteria.push({
    id: "speaking-duration",
    label: "Longest unscripted speaking evidence",
    passed: longestSpeaking >= speakingDurationFloor[level],
    value: `${longestSpeaking}s`,
    target: `≥ ${speakingDurationFloor[level]}s`,
    critical: true
  });

  const requiredTranscribedSamples = transcribedSampleFloor[level];
  if (requiredTranscribedSamples > 0) {
    const minimumSeconds = transcribedSampleMinimumSeconds[level];
    const transcribedSamples = transcribedReadinessSpeakingCount(state.speakingRecords, minimumSeconds);
    criteria.push({
      id: "transcribed-speaking-samples",
      label: "Reviewed transcribed speaking samples",
      passed: transcribedSamples >= requiredTranscribedSamples,
      value: `${transcribedSamples} sample(s) ≥ ${minimumSeconds}s`,
      target: `≥ ${requiredTranscribedSamples} reviewed sample(s) with audio + auditable transcript`,
      critical: level === "B2" || level === "C1"
    });
  }

  if (level === "C1") {
    const longestTranscribed = longestTranscribedReadinessSpeakingSeconds(state.speakingRecords);
    criteria.push({
      id: "c1-long-transcribed-speaking",
      label: "Long C1 speaking sample with reviewed transcript",
      passed: longestTranscribed >= 360,
      value: `${longestTranscribed}s`,
      target: "≥ 360s audio + reviewed transcript",
      critical: true
    });
  }

  const guidedHours = state.evidence.structuredMinutes / 60;
  criteria.push({
    id: "guided-hours",
    label: "Structured curriculum evidence",
    passed: guidedHours >= cumulativeGuidedHourFloors[level],
    value: `${guidedHours.toFixed(1)}h`,
    target: `≥ ${cumulativeGuidedHourFloors[level]}h workload floor`,
    critical: false
  });

  criteria.push({
    id: "normal-listening",
    label: "Normal-speed listening practice",
    passed: state.evidence.listeningAtNormalSpeedMinutes >= normalSpeedListeningMinutesFloor[level],
    value: `${state.evidence.listeningAtNormalSpeedMinutes} min`,
    target: `≥ ${normalSpeedListeningMinutesFloor[level]} min`,
    critical: level === "B2" || level === "C1"
  });

  const highSeverityRecurring = state.errorBank.filter((error) => error.severity === "high" && error.recurrenceCount >= 5 && error.masteryScore < 70).length;
  criteria.push({
    id: "recurring-errors",
    label: "Unresolved high-severity recurring errors",
    passed: highSeverityRecurring <= (level === "C1" ? 1 : 3),
    value: String(highSeverityRecurring),
    target: level === "C1" ? "≤ 1 persistent high-severity pattern" : "≤ 3 persistent high-severity patterns",
    critical: level === "C1"
  });

  const checkpoint = latestCheckpoint(state, level);
  criteria.push({
    id: "checkpoint",
    label: `${level} verified integrated checkpoint`,
    passed: Boolean(checkpoint),
    value: checkpoint ? `passed · ${checkpoint.evaluator} · ${checkpoint.evaluatorName}` : "no verified pass",
    target: "identified independent pass across speaking + listening + reading + writing + language use",
    critical: true
  });

  if (level === "C1") {
    criteria.push({
      id: "external-validation",
      label: "Independent C1 validation",
      passed: Boolean(checkpoint?.passed && checkpoint.evaluator !== "self" && checkpoint.evaluatorName?.trim()),
      value: checkpoint ? `${checkpoint.evaluator}${checkpoint.evaluatorName ? ` · ${checkpoint.evaluatorName}` : " · unnamed"}` : "none",
      target: "a passed C1 checkpoint scored by an identified independent evaluator",
      critical: true
    });
  }

  const critical = criteria.filter((criterion) => criterion.critical);
  const passedCritical = critical.filter((criterion) => criterion.passed).length;
  const score = Math.round((criteria.filter((criterion) => criterion.passed).length / criteria.length) * 100);
  const ready = passedCritical === critical.length && score >= (level === "C1" ? 90 : 82);

  return {
    level,
    score,
    ready,
    criteria,
    blockers: criteria.filter((criterion) => !criterion.passed).map((criterion) => `${criterion.label}: ${criterion.value} → ${criterion.target}`),
    latestCheckpoint: checkpoint
  };
}

export function checkpointPass(scores: CheckpointAttempt["scores"], level: CheckpointLevel): boolean {
  const values = Object.values(scores);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const min = Math.min(...values);
  const requiredAverage = level === "C1" ? 4.2 : level === "B2" ? 4.0 : level === "B1" ? 3.8 : 3.6;
  const requiredMinimum = level === "C1" ? 3.8 : 3.2;
  return average >= requiredAverage && min >= requiredMinimum;
}

export type Prescription = {
  totalMinutes: number;
  stageId: ProgramStageId;
  priorities: string[];
  minutesBySkill: Record<Skill, number>;
  immersion: string[];
  warning?: string;
};

function normalizeWeights(weights: Record<Skill, number>): Record<Skill, number> {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  return Object.fromEntries(Object.entries(weights).map(([skill, value]) => [skill, value / total])) as Record<Skill, number>;
}

export function adaptivePrescription(state: LearnerState, currentDay: number, totalMinutes = 165): Prescription {
  const weights = { ...dailySkillBaseWeights };
  const priorities: string[] = [];
  const skills = (Object.keys(state.skillEstimates) as Skill[]).sort((a, b) => {
    const levelDiff = levelIndex(state.skillEstimates[a].level) - levelIndex(state.skillEstimates[b].level);
    return levelDiff || state.skillEstimates[a].progress - state.skillEstimates[b].progress;
  });

  for (const skill of skills.slice(0, 2)) {
    weights[skill] *= 1.35;
    priorities.push(`Raise ${skill.replace(/([A-Z])/g, " $1").toLowerCase()} because it is currently among the weakest skills.`);
  }

  // This learner has unusually strong grammar recognition relative to production.
  if (levelIndex(state.skillEstimates.grammarRecognition.level) > levelIndex(state.skillEstimates.grammarProduction.level)) {
    weights.grammarRecognition *= 0.55;
    weights.grammarProduction *= 1.4;
    priorities.push("Convert passive grammar knowledge into production; do not spend extra time re-memorizing rules.");
  }

  const recurring = [...state.errorBank].sort((a, b) => b.recurrenceCount - a.recurrenceCount);
  if (recurring[0]) {
    const category = recurring[0].category.toLowerCase();
    if (/tense|verb|word order|article|preposition|grammar/.test(category)) weights.grammarProduction *= 1.25;
    priorities.push(`Recycle the recurring “${recurring[0].category}” pattern through retrieval, speaking, and writing.`);
  } else {
    priorities.push("Build automatic sentence production while the Error Bank gathers real personal patterns.");
  }

  if (state.skillEstimates.speaking.level === "A1" || state.skillEstimates.speaking.level === "A1+") weights.speaking *= 1.2;

  const normalized = normalizeWeights(weights);
  const minutesBySkill = Object.fromEntries(
    Object.entries(normalized).map(([skill, weight]) => [skill, Math.max(4, Math.round(totalMinutes * weight))])
  ) as Record<Skill, number>;

  // Keep total near the requested budget after minimum rounding.
  const diff = totalMinutes - Object.values(minutesBySkill).reduce((sum, value) => sum + value, 0);
  minutesBySkill.speaking = Math.max(10, minutesBySkill.speaking + diff);

  const stageId = stageIdForDay(currentDay);
  const stage = personalizedStages.find((item) => item.id === stageId)!;
  const stageHours = state.evidence.stageMinutes[stageId] / 60;

  return {
    totalMinutes,
    stageId,
    priorities: priorities.slice(0, 4),
    minutesBySkill,
    immersion: immersionMinimums[stageId],
    warning: stageHours >= stage.guidedHoursTarget
      ? `You have reached the nominal ${stage.guidedHoursTarget}h workload for this stage. Do not add more broad study if the gate is still weak; remediate the failed criteria directly.`
      : undefined
  };
}

export function programProgress(state: LearnerState): number {
  const targetHours = personalizedStages.reduce((sum, stage) => sum + stage.guidedHoursTarget, 0);
  const cappedHours = Math.min(targetHours, state.evidence.structuredMinutes / 60);
  const hourComponent = (cappedHours / targetHours) * 55;
  const skillComponent = (["speaking", "listening", "reading", "writing"] as Skill[])
    .map((skill) => levelIndex(state.skillEstimates[skill].level) / levelIndex("C1"))
    .reduce((sum, value) => sum + value, 0) / 4 * 35;
  const passedCheckpoints = ["A2", "B1", "B2", "C1"].filter((level) => latestCheckpoint(state, level as CheckpointLevel)?.passed).length;
  const checkpointComponent = passedCheckpoints / 4 * 10;
  return Math.min(100, Math.round(hourComponent + skillComponent + checkpointComponent));
}
