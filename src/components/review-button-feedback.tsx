"use client";

import { useEffect } from "react";

/**
 * Compatibility feedback for vocabulary review buttons.
 *
 * The vocabulary action already writes to the learner SRS state, but the
 * current UI does not expose that state after the click. This small client
 * helper makes the action visible immediately while the VocabularyCard is
 * migrated to a state-aware button in the next component refactor.
 */
export function ReviewButtonFeedback() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest("button");
      if (!button || button.textContent?.trim() !== "＋ Add to review") return;

      // Run after the React click handler so the SRS update happens first.
      window.setTimeout(() => {
        button.textContent = "✓ Added to review";
        button.classList.add("success");
        button.setAttribute("aria-pressed", "true");
        button.setAttribute("disabled", "");
      }, 0);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
