import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

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
