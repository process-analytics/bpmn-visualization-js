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

// https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
const { pathsToModuleNameMapper } = require('ts-jest');
// Cannot use const { compilerOptions } = require('../../tsconfig.test.json');
// parsing fails as the file contains comment, so use the following hack taken from https://stackoverflow.com/questions/61996234/requiring-a-json-with-comments-in-node-js
const fs = require('fs');
// let jsonTxt = fs.readFileSync('./tsconfig.json', 'utf8');
let jsonTxt = fs.readFileSync('../../tsconfig.test.json', 'utf8');
const JSON5 = require('json5');
const tsconfig = JSON5.parse(jsonTxt);
const compilerOptions = tsconfig.compilerOptions;

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: '../..',
  roots: ['./test/unit'],
  testMatch: ['**/?(*.)+(spec|test).[t]s'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
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
