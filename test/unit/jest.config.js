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

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  rootDir: '../..',
  roots: ['./test/unit', './src'],
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  // TODO temp removed but useless and has side effect if the path of project contains 'development' for instance
  //testPathIgnorePatterns: ['/node_modules/', 'dev', 'dist', 'src'],
  transform: {
    // TODO check if we can limit the path to src and test/unit to speedup the JS transpilation or update the ts-jest configuration
    '^.+\\.ts?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.jest.json',
    },
  },
  collectCoverageFrom: ['**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['/node_modules/', 'dev', 'dist', 'src/model', 'test'],
  coverageReporters: ['lcov', 'text-summary'],
  coverageDirectory: 'build/test-report/unit',
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
