import type { CEFR, LearnerState } from "./types.ts";

export type ThaiSupportMode = "full" | "fallback" | "english-first";
export type ImmersionPreference = LearnerState["settings"]["immersionLevel"];

const LEVEL_ORDER: CEFR[] = ["A1", "A1+", "A2-", "A2", "A2+", "B1-", "B1", "B1+", "B2-", "B2", "B2+", "C1-", "C1"];

function rank(level: CEFR): number {
  return Math.max(0, LEVEL_ORDER.indexOf(level));
}

export function thaiSupportMode(level: CEFR, preference: ImmersionPreference): ThaiSupportMode {
  const current = rank(level);
  const a2Plus = rank("A2+");
  const b1Minus = rank("B1-");
  const b2Minus = rank("B2-");

  if (preference === "thai-support") {
    if (current <= a2Plus) return "full";
    if (current < b2Minus) return "fallback";
    return "english-first";
  }

  if (preference === "balanced") {
    if (current < rank("A2-")) return "full";
    if (current < b2Minus) return "fallback";
    return "english-first";
  }

  if (current < b1Minus) return "fallback";
  return "english-first";
}

export function showThaiByDefault(level: CEFR, preference: ImmersionPreference): boolean {
  return thaiSupportMode(level, preference) === "full";
}

export function immersionLabel(mode: ThaiSupportMode): string {
  if (mode === "full") return "Thai support on";
  if (mode === "fallback") return "English first · Thai available";
  return "English-first immersion";
}
