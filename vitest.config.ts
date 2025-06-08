// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      // any import that starts with "@/foo" => "<rootDir>/src/foo"
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    include: ["vitest-tests/**/*.test.ts"],
    environment: "node",
    // (you can leave other defaults as-is)
  },
});
