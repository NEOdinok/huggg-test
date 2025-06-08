// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },

  testPathIgnorePatterns: ["/node_modules/", "<rootDir>/vitest-tests/"],
};

export default config;
