import type { JestConfigWithTsJest } from 'ts-jest'
// import { defaults } from "jest-config";
import { jsWithTsESM } from "ts-jest/presets";

const config: JestConfigWithTsJest = {
  ...jsWithTsESM,
  clearMocks: true,
  verbose: true,
};

export default config;
