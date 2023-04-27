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

const { pathsToModuleNameMapper } = require('ts-jest');
// Cannot use const { compilerOptions } = require('../../tsconfig.test.json');
// parsing fails as the file contains comment, so use the following hack taken from https://stackoverflow.com/questions/61996234/requiring-a-json-with-comments-in-node-js
const fs = require('fs');
// let jsonTxt = fs.readFileSync('./tsconfig.json', 'utf8');
// TODO only works with npm, not in IntelliJ when running an individual test
let jsonTxt = fs.readFileSync('./tsconfig.test.json', 'utf8');
const JSON5 = require('json5');
const tsconfig = JSON5.parse(jsonTxt);
const compilerOptions = tsconfig.compilerOptions;

exports.moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' });
