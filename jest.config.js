module.exports = {
  setupFiles: ['./tests/setup/setEnvironment.js'],
  transform: {
    '^.+\\.ts?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
};
