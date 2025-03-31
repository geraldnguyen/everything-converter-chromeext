export default {
  transform: {},
  extensionsToTreatAsEsm: [],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: [
    "**/__tests__/**/*.js",
    "**/?(*.)+(spec|test).js"
  ],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "lcov"],
  moduleDirectories: ["node_modules", "ext"]
};