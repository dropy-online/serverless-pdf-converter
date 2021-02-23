module.exports = {
  setupFiles: ['./tests/setup/setEnvironment.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
};
