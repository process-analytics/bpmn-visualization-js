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
module.exports = {
  roots: ['<rootDir>/test/unit/'],
  moduleNameMapper: {
    // mock files that jest doesn't support like CSS and SVG files
    '\\.css$': '<rootDir>/test/module-mock.js',
    '\\.svg$': '<rootDir>/test/module-mock.js',
  },
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  testPathIgnorePatterns: ['/node_modules/', 'dist'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['/node_modules/', 'dist', 'test'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['json', 'json-summary', 'lcov', 'text', 'text-summary', 'clover'],
  setupFiles: ['<rootDir>/test/unit/jest.globals.ts'],
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
  ],
};
