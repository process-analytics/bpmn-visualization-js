/**
 * Copyright 2022 Bonitasoft S.A.
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

import assert from 'node:assert';
import * as fs from 'node:fs';
// generate warning when running with Node 16
// (node:75278) ExperimentalWarning: Importing JSON modules is an experimental feature. This feature could change at any time
import packageJSON from '../package.json' assert { type: 'json' };

// generate a definition file for not supported TS versions. It provokes syntax error to show an explicit message about what are the supported versions.
// inspired from https://github.com/graphql/graphql-js/blob/743f42b6ef6006d35bf9e0b45e3b70d6e9100596/resources/build-npm.ts#L86-L97
// found with https://github.com/microsoft/TypeScript/issues/32166

const supportedTSVersions = Object.keys(packageJSON.typesVersions);
assert(supportedTSVersions.length === 1, 'Property "typesVersions" should have exactly one key in the "package.json" file.');
// TODO revisit 'not supported ts versions' once TS implements https://github.com/microsoft/TypeScript/issues/32166
const notSupportedTSVersionsFilePath = packageJSON.types;

const destinationDirectoryPath = getDirectorOfPath(notSupportedTSVersionsFilePath);
// we cannot use the 'ensureDirSync' function from 'fs-extra' as this package only provides a CommonJS bundle
if (!fs.existsSync(destinationDirectoryPath)) {
  fs.mkdirSync(destinationDirectoryPath);
}
fs.writeFileSync(
  notSupportedTSVersionsFilePath,
  `// When using an unsupported version of TypeScript, this file is used and it generates a more explicit error message than what TypeScript provides out of the box.
// error TS1003: Identifier expected.
// "Package 'bpmn-visualization' supports only TypeScript versions that are >=x.y.z"
"Package 'bpmn-visualization' supports only TypeScript versions that are ${supportedTSVersions[0]}".`,
);

function getDirectorOfPath(path) {
  const delimiter = '/';
  const substrings = path.split(delimiter);

  return substrings.length === 1
    ? value // delimiter is not part of the string
    : substrings.slice(0, -1).join(delimiter);
}
