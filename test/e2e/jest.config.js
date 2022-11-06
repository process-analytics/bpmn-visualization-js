/**
 * Copyright 2020 Bonitasoft S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
process.env.JEST_PLAYWRIGHT_CONFIG = './test/e2e/jest-playwright.config.js';

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'jest-playwright-preset',
  rootDir: '../..',
  roots: ['./test/e2e'],
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  testTimeout: 200000,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['/src/model'],
  coverageReporters: ['lcov', 'text-summary'],
  coverageDirectory: 'build/test-report/e2e',
  setupFilesAfterEnv: [
    'jest-extended/all',
    'expect-playwright',
    './test/config/jest.retries.ts',
    // jest-image-snapshot configuration doesn't work with setupFiles, fix with setupFilesAfterEnv: see https://github.com/testing-library/jest-dom/issues/122#issuecomment-650520461
    './test/config/jest.image.ts',
    // need playwright globals to be available, so after environment
    './test/config/playwright.browser.logs.ts',
  ],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'bpmn-visualization E2E Test Report',
        outputPath: 'build/test-report/e2e/index-single-page.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
    [
      'jest-html-reporters',
      {
        filename: 'index.html',
        hideIcon: true,
        pageTitle: 'bpmn-visualization E2E Test Report',
        publicPath: './build/test-report/e2e',
      },
    ],
    [
      'jest-sonar',
      {
        outputDirectory: 'build/test-report/e2e',
      },
    ],
  ],
};
