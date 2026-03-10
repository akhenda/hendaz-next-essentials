import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.spec.{ts,tsx}",
      "tests/unit/**/*.test.{ts,tsx}",
      "tests/unit/**/*.spec.{ts,tsx}",
    ],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      thresholds: {
        statements: 95,
        functions: 95,
        branches: 90,
        lines: 95,
      },
    },
  },
});
