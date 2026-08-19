import { expect, test } from "@playwright/test";
import { defaultState, STORAGE_KEY } from "../src/lib/storage.ts";
import type { LearnerState, Skill } from "../src/lib/types.ts";

async function openTab(page: import("@playwright/test").Page, name: string) {
  await page.getByRole("button", { name, exact: true }).click();
}

async function seedState(page: import("@playwright/test").Page, state: LearnerState) {
  await page.addInitScript(({ key, value }) => {
    window.localStorage.setItem(key, value);
  }, { key: STORAGE_KEY, value: JSON.stringify(state) });
}

async function persistedState(page: import("@playwright/test").Page): Promise<LearnerState> {
  return page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? "null") as LearnerState, STORAGE_KEY);
}

test("renders the app and serves the hardened security headers", async ({ page, request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["permissions-policy"]).toContain("microphone=(self)");

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Today", exact: true })).toBeVisible();
});

test("Add to review is React-state driven and survives reload", async ({ page }) => {
  await page.goto("/");
  await openTab(page, "Vocabulary");

  await page.getByRole("button", { name: "＋ Add to review" }).first().click();
  await expect(page.getByRole("button", { name: "✓ Added to review" }).first()).toBeDisabled();
  await expect.poll(async () => (await persistedState(page)).srsItems.length).toBe(1);

  await page.reload();
  await openTab(page, "Vocabulary");
  await expect(page.getByRole("button", { name: "✓ Added to review" }).first()).toBeDisabled();
});

test("course prerequisites remain locked in the browser UI", async ({ page }) => {
  await page.goto("/");
  await openTab(page, "Course");

  const foundationDays = page.locator("button.lesson-row");
  await expect(foundationDays.nth(0)).toBeEnabled();
  await expect(foundationDays.nth(1)).toBeDisabled();
  await expect(foundationDays.nth(1)).toContainText("Locked");
});

test("listening transcript is locked before the first full listen", async ({ page }) => {
  await page.goto("/");
  await openTab(page, "Listening");
  await expect(page.getByRole("button", { name: "Finish first listen to unlock transcript" }).first()).toBeDisabled();
});

test("incorrect SRS recall cannot be graded Good or Easy", async ({ page }) => {
  await page.goto("/");
  await openTab(page, "Vocabulary");
  await page.getByRole("button", { name: "＋ Add to review" }).first().click();
  await expect.poll(async () => (await persistedState(page)).srsItems.length).toBe(1);

  await openTab(page, "Review");
  const recall = page.getByPlaceholder("Recall first, then check...").first();
  await recall.fill("definitely not the target answer");
  await page.getByRole("button", { name: "Check recall" }).first().click();

  await expect(page.getByRole("button", { name: "Good" }).first()).toBeDisabled();
  await expect(page.getByRole("button", { name: "Easy" }).first()).toBeDisabled();
  await expect(page.getByText("Compare and correct").first()).toBeVisible();
});

test("self-scored A2 checkpoint stays practice-only in the real UI", async ({ page }) => {
  const state = structuredClone(defaultState);
  for (const skill of ["speaking", "listening", "reading", "writing", "grammarProduction", "vocabulary"] as Skill[]) {
    state.skillEstimates[skill] = { level: "A2", progress: 40 };
  }
  state.evidence.structuredMinutes = 130 * 60;
  state.evidence.listeningAtNormalSpeedMinutes = 240;
  state.speakingRecords = [{
    id: "e2e-a2-speaking",
    lessonId: "day-1",
    prompt: "A2 evidence",
    durationSeconds: 60,
    createdAt: "2026-08-19T00:00:00.000Z",
    selfRating: 4
  }];
  await seedState(page, state);

  await page.goto("/");
  await openTab(page, "Tests");

  const scorer = page.locator("details.checkpoint-card").filter({ hasText: "A2 rubric scoring" });
  await scorer.locator("summary").click();
  const sliders = scorer.locator('input[type="range"]');
  for (let index = 0; index < await sliders.count(); index += 1) {
    await sliders.nth(index).focus();
    await page.keyboard.press("End");
    await expect(sliders.nth(index)).toHaveValue("5");
  }
  await scorer.getByRole("button", { name: "Save A2 checkpoint evidence" }).click();
  await expect(page.getByText(/Passed rubric · self/).first()).toBeVisible();
  await expect.poll(async () => (await persistedState(page)).checkpointAttempts.length).toBe(1);

  await openTab(page, "Progress");
  const readiness = page.locator(".card.card-pad").filter({ hasText: "A2 readiness" }).first();
  await expect(readiness.getByText(/NOT YET/)).toBeVisible();
  await expect(readiness.getByText(/no verified pass/)).toBeVisible();
});

test("invalid backup import surfaces an error without replacing existing progress", async ({ page }) => {
  const state = structuredClone(defaultState);
  state.xp = 321;
  await seedState(page, state);

  await page.goto("/");
  await openTab(page, "Settings");

  const fileInput = page.locator('input[type="file"][accept*="json"]');
  await fileInput.setInputFiles({
    name: "broken-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from("{this-is-not-json")
  });

  await expect(page.getByText("Backup failed.")).toBeVisible();
  await expect(page.getByText("Backup file is not valid JSON.")).toBeVisible();
  await expect.poll(async () => (await persistedState(page)).xp).toBe(321);
});

test("mobile navigation exposes all learning sections", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const mobileNav = page.locator(".mobile-nav");
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.locator("button.nav-button")).toHaveCount(13);
  await mobileNav.getByRole("button", { name: "Settings", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Settings", exact: true })).toBeVisible();
});
