/*
Copyright 2023 Bonitasoft S.A.

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

// Inspired from https://kulshekhar.github.io/ts-jest/docs/getting-started/paths-mapping/
const fs = require('fs');

const JSON5 = require('json5');
const { pathsToModuleNameMapper } = require('ts-jest');
// Cannot use const { compilerOptions } = require('../../tsconfig.test.json');
// parsing fails as the file contains comment, so use the following hack taken from https://stackoverflow.com/questions/61996234/requiring-a-json-with-comments-in-node-js

let jsonTxt;
try {
  jsonTxt = fs.readFileSync('./tsconfig.test.json', 'utf8');
} catch {
  // when running from IDE (IntelliJ/Webstrom, the working directory is not the project root dir
  // for instance it can be tsconfig: '<rootDir>/test/unit',
  // so give a try to an alternate file path
  jsonTxt = fs.readFileSync('../../tsconfig.test.json', 'utf8');
}

const tsconfig = JSON5.parse(jsonTxt);
const compilerOptions = tsconfig.compilerOptions;

exports.moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' });
