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

// TODO fail with f-x-p 5.0.1
// check if we can run with ESM support, currently execution fails
// f-x-p is supposed to provide a CommonJS support, see https://github.com/NaturalIntelligence/fast-xml-parser/issues/713
//     Cannot find module 'fast-xml-parser' from 'src/component/parser/xml/BpmnXmlParser.ts'
//
//     Require stack:
//       src/component/parser/xml/BpmnXmlParser.ts
//       test/unit/component/parser/xml/BpmnXmlParser.omnitracker-bpmn.11_5.test.ts
//
//       18 | import type { ParserOptions } from '../../options';
//       19 |
//     > 20 | import { XMLParser, type X2jOptions } from 'fast-xml-parser';
//          | ^
//       21 |
//       22 | type Replacement = {
//       23 |   regex: RegExp;

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
