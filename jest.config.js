/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  workerThreads: false,
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/config/"],
};
