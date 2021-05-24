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

module.exports = {
  rootDir: '../..',
  roots: ['./test/e2e', './src'],
  preset: 'jest-playwright-preset',
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  testPathIgnorePatterns: ['/node_modules/', 'dev', 'dist', 'src'],
  testTimeout: 200000,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['/node_modules/', 'dev', 'dist', 'src/demo', 'src/model', 'test'],
  coverageReporters: ['lcov', 'text-summary'],
  coverageDirectory: 'build/test-report/e2e',
  setupFiles: ['./test/e2e/config/copy.bpmn.diagram.ts'],
  setupFilesAfterEnv: [
    // jest-image-snapshot configuration doesn't work with setupFiles, fix with setupFilesAfterEnv: see https://github.com/testing-library/jest-dom/issues/122#issuecomment-650520461
    './test/e2e/config/jest.image.ts',
    // need playwright globals to be available, so after environment
    './test/e2e/config/playwright.ts',
  ],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'bpmn-visualization E2E Test Report',
        outputPath: 'build/test-report/e2e/index.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
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
