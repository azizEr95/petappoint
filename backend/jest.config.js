/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  reporters: [
    "default",
  ],
  testMatch: ["**/(*.)+(test).?(m)[jt]s?(x)"],
  testEnvironmentOptions: { url: "http://localhost" },
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js,mjs,tsx,jsx,mts}'],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  coverageReporters: ["cobertura", "html", "text", "text-summary"],
  coveragePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/", "<rootDir>/tests/"],

  setupFilesAfterEnv: [
    '<rootDir>/testConfig/setupFile.ts',
    '<rootDir>/testConfig/integrationConfig.ts'
  ],
  testTimeout: 30000,
}