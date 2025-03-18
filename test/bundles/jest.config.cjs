/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const { moduleNameMapper } = require('../config/ts-jest.cjs');

process.env.JEST_PLAYWRIGHT_CONFIG = './test/bundles/jest-playwright.config.cjs';

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'jest-playwright-preset',
  rootDir: '../..',
  roots: ['./test/bundles'],
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  testTimeout: 20 * 1000,
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  moduleNameMapper,
  setupFilesAfterEnv: ['jest-extended/all', 'expect-playwright', './test/config/jest.retries.ts'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'bpmn-visualization bundles Test Report',
        outputPath: 'build/test-report/bundles/index.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],
};
