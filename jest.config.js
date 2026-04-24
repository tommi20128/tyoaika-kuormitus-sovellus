module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js"
  ],
  testMatch: ["**/tests/**/*.test.ts?(x)"],
};