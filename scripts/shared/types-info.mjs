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

import assert from 'node:assert';
// generate warning when running with Node 18
// (node:75278) ExperimentalWarning: Importing JSON modules is an experimental feature. This feature could change at any time
import packageJSON from '../../package.json' assert { type: 'json' };

export const getTypeFilesInformation = () => {
  const notSupportedTSVersionsFilePath = packageJSON.types;
  const supportedTSVersions = Object.keys(packageJSON.typesVersions);
  assert(supportedTSVersions.length === 1, 'Property "typesVersions" should have exactly one key in the "package.json" file.');

  const key = supportedTSVersions[0];
  const typesFilePath = packageJSON.typesVersions[key]['*'][0];

  return {
    supportedTSVersions: supportedTSVersions[0],
    typesFilePath,
    notSupportedTSVersionsFilePath,
  };
};
