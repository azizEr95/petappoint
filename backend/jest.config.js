/** @type {import('ts-jest/dist/types').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: '',
  testEnvironmentOptions: { url: "http://localhost" },
  collectCoverage: true,
  reporters: [
    "default",
  ],
  testMatch: ["**/(*.)+(test).?(m)[jt]s?(x)"],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js,mjs,tsx,jsx,mts}'],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  coverageReporters: ["cobertura", "html", "text", "text-summary"],
  coveragePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/", "<rootDir>/tests/"],

  setupFilesAfterEnv: ['<rootDir>/testConfig/mockConfig.ts'],
}