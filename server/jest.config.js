/**
 * Jest config for Test Generator (TypeScript, node environment)
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/unit/**/*.test.ts',
    '**/tests/integration/**/*.test.ts'
  ],
  setupFilesAfterEnv: [],
};
