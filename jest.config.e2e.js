module.exports = {
  preset: 'jest-puppeteer',
  roots: ['<rootDir>/test/e2e/'],
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'jest-environment-puppeteer-jsdom',
  globalSetup: 'jest-environment-puppeteer-jsdom/setup',
  globalTeardown: 'jest-environment-puppeteer-jsdom/teardown',
};
