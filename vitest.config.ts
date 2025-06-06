// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Look under src/vitest-tests/ instead of vitest-tests/ at the root:
    include: ["vitest-tests/**/*.test.ts"],

    // (You can leave the default excludes alone, or explicitly override them here if needed.)
    // exclude: ["**/node_modules/**", "**/dist/**", ...],
  },
});
