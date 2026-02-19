import { defineVitestProject } from "@nuxt/test-utils/config";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      enabled: true,
      provider: "v8",
    },
    projects: [
      {
        test: {
          environment: "node",
          include: ["test/unit/**/*.{test,spec}.ts"],
          name: "unit",
          setupFiles: ["test/unit/stores/setup.ts"],
        },
      },
      await defineVitestProject({
        test: {
          environment: "nuxt",
          environmentOptions: {
            nuxt: {
              domEnvironment: "happy-dom",
              rootDir: fileURLToPath(new URL(".", import.meta.url)),
            },
          },
          include: ["test/nuxt/*.{test,spec}.ts"],
          name: "nuxt",
        },
      }),
    ],
  },
});
