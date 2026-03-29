export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/integration/setup-env.ts"],
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/tests/integration/**/*.test.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "NodeNext",
          moduleResolution: "NodeNext",
        },
      },
    ],
  },
};
