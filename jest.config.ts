import type { JestConfigWithTsJest } from 'ts-jest'
import tsJestPresets from "ts-jest/presets/index.js";

const config: JestConfigWithTsJest = {
  ...tsJestPresets.jsWithTsESM,
  clearMocks: true,
  verbose: true,
  transformIgnorePatterns: [
    "node_modules/(?!.*(mime|globby|string-env-interpolation|micromatch)/)"
  ],
  transform: {
    "^.+\\.m?[tj]sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.test.json",
        useESM: true,
      },
    ],
  },
};

export default config;
