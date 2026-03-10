import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environmentMatchGlobs: [
      ["convex/**", "edge-runtime"],
      ["**", "jsdom"],
    ],
    server: {
      deps: {
        inline: ["convex-test"],
      },
    },
    include: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "tests/unit/**/*.test.{ts,tsx}",
      "tests/unit/**/*.spec.{ts,tsx}",
      "convex/**/*.test.ts",
      "convex/**/*.spec.ts",
    ],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}", "convex/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "tests/unit/**/*.test.{ts,tsx}",
        "tests/unit/**/*.spec.{ts,tsx}",
        "convex/**/*.test.ts",
        "convex/**/*.spec.ts",
        "convex/_generated/**",
      ],
      thresholds: {
        statements: 95,
        functions: 95,
        branches: 90,
        lines: 95,
      },
    },
  },
});
