// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
        // move any other ts-jest options here
      },
    ],
  },
};

export default config;
