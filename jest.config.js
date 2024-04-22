module.exports = {
    testEnvironment: 'node', // Use Node.js environment for testing
    testMatch: ['**/*.test.js'], // Match test files ending with .test.js
    collectCoverage: true, // Enable code coverage reporting
    coverageDirectory: 'coverage', // Output directory for coverage reports
    collectCoverageFrom: ['test/*.js', '!**/node_modules/**', '!**/coverage/**'], // Files to include in coverage report
  };