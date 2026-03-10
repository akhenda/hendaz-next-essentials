import { fileURLToPath } from "node:url";

import { defineConfig, defineProject } from "vitest/config";

const convexRoot = fileURLToPath(new URL("./convex/", import.meta.url));
const srcRoot = fileURLToPath(new URL("./src/", import.meta.url));
const sharedRoot = fileURLToPath(new URL("./shared/", import.meta.url));

const alias = {
  "@/app": `${srcRoot}app`,
  "@/components": `${srcRoot}components`,
  "@/convex": convexRoot,
  "@/lib": `${srcRoot}lib`,
  "@/modules": `${srcRoot}modules`,
  "@/shared": sharedRoot,
  "@/src": srcRoot,
  "@/types": `${srcRoot}types`,
  "@/utils": `${srcRoot}utils`,
};

export default defineConfig({
  resolve: {
    alias,
  },
  test: {
    coverage: {
      provider: "v8",
      include: [
        "src/**/*.ts",
        "src/**/*.tsx",
        "shared/**/*.ts",
        "convex/**/*.ts",
      ],
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.test.tsx",
        "src/**/*.spec.ts",
        "src/**/*.spec.tsx",
        "tests/unit/**/*.test.ts",
        "tests/unit/**/*.test.tsx",
        "tests/unit/**/*.spec.ts",
        "tests/unit/**/*.spec.tsx",
        "shared/**/*.test.ts",
        "shared/**/*.spec.ts",
        "convex/**/*.test.ts",
        "convex/**/*.spec.ts",
        "convex/_generated/**",
        "convex/test.setup.ts",
        "src/app/**/page.tsx",
        "src/app/layout.tsx",
      ],
      thresholds: {
        statements: 95,
        functions: 95,
        branches: 90,
        lines: 95,
      },
    },
    exclude: ["tests/e2e/**/*.ts"],
    passWithNoTests: true,
    projects: [
      defineProject({
        resolve: {
          alias,
        },
        test: {
          environment: "jsdom",
          exclude: ["tests/e2e/**/*.ts", "convex/**/*.test.ts", "convex/**/*.spec.ts"],
          include: [
            "src/**/*.test.ts",
            "src/**/*.test.tsx",
            "src/**/*.spec.ts",
            "src/**/*.spec.tsx",
            "tests/unit/**/*.test.ts",
            "tests/unit/**/*.test.tsx",
            "tests/unit/**/*.spec.ts",
            "tests/unit/**/*.spec.tsx",
            "shared/**/*.test.ts",
            "shared/**/*.spec.ts",
          ],
          name: "app",
        },
      }),
      defineProject({
        resolve: {
          alias,
        },
        test: {
          environment: "edge-runtime",
          include: ["convex/**/*.test.ts", "convex/**/*.spec.ts"],
          name: "convex",
          server: {
            deps: {
              inline: ["convex-test"],
            },
          },
        },
      }),
    ],
  },
});
