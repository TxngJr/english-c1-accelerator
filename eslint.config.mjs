import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    // The monolithic client app predates the production-hardening refactor.
    // Keep exceptions narrowly scoped to this file; the feature-module refactor
    // will remove them rather than weakening lint rules across the repository.
    files: ["src/components/learning-app.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react/no-unescaped-entities": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
