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

// The type provided here could provide more guidance if it included types from @swc/jest
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  rootDir: '../..',
  roots: ['./test/unit'],
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  transform: {
    '^.+\\.ts?$': [
      // TODO add tsc check npm script
      // TODO update dependabot configuration
      // use https://github.com/process-analytics/bpmn-visualization-addons/pull/302/files as an example
      '@swc/jest',
      {
        // See https://swc.rs/docs/usage/jest
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: false,
          },
          target: 'es2020', // keep in sync with tsconfig.test.json
        },
      },
      // 'ts-jest',
      // {
      //   tsconfig: '<rootDir>/tsconfig.test.json',
      // },
    ],
  },
  moduleNameMapper,
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['/src/model/'],
  coverageReporters: ['lcov', 'text-summary'],
  coverageDirectory: 'build/test-report/unit',
  setupFilesAfterEnv: ['jest-extended/all'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'bpmn-visualization Unit Test Report',
        outputPath: 'build/test-report/unit/index.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
    [
      'jest-sonar',
      {
        outputDirectory: 'build/test-report/unit',
      },
    ],
  ],
};
