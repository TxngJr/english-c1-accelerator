import test from "node:test";
import assert from "node:assert/strict";
import { showThaiByDefault, thaiSupportMode } from "../src/lib/immersion.ts";

test("Thai-support preference keeps Thai visible through A2 but fades later", () => {
  assert.equal(thaiSupportMode("A1+", "thai-support"), "full");
  assert.equal(thaiSupportMode("A2+", "thai-support"), "full");
  assert.equal(thaiSupportMode("B1", "thai-support"), "fallback");
  assert.equal(thaiSupportMode("B2", "thai-support"), "english-first");
});

test("balanced mode becomes English-first at B2", () => {
  assert.equal(thaiSupportMode("A1", "balanced"), "full");
  assert.equal(thaiSupportMode("A2", "balanced"), "fallback");
  assert.equal(thaiSupportMode("B1+", "balanced"), "fallback");
  assert.equal(thaiSupportMode("B2-", "balanced"), "english-first");
});

test("mostly-English mode still allows Thai fallback at foundation level", () => {
  assert.equal(thaiSupportMode("A1+", "mostly-english"), "fallback");
  assert.equal(thaiSupportMode("A2", "mostly-english"), "fallback");
  assert.equal(thaiSupportMode("B1", "mostly-english"), "english-first");
  assert.equal(showThaiByDefault("A1+", "mostly-english"), false);
});
