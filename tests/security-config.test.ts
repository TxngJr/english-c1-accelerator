import test from "node:test";
import assert from "node:assert/strict";
import { securityHeaders } from "../next.config.ts";

const headers = new Map(securityHeaders.map((header) => [header.key, header.value]));

test("security headers include core browser protections", () => {
  assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
  assert.equal(headers.get("X-Frame-Options"), "DENY");
  assert.equal(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
  assert.equal(headers.get("Cross-Origin-Opener-Policy"), "same-origin");
  assert.equal(headers.get("Cross-Origin-Resource-Policy"), "same-origin");
});

test("permissions policy allows only the microphone capability needed by the app", () => {
  const policy = headers.get("Permissions-Policy") ?? "";
  assert.match(policy, /camera=\(\)/);
  assert.match(policy, /geolocation=\(\)/);
  assert.match(policy, /microphone=\(self\)/);
});
