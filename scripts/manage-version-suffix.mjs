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

import * as fs from 'fs';

log('Managing version suffix in configuration files');
const currentVersion = getCurrentVersion();
log('Current version', currentVersion);

const newVersion = addOrRemoveVersionSuffix(currentVersion);
log('New version', newVersion);

updateVersionInNpmFile('./package.json', currentVersion, newVersion);
updateVersionInNpmFile('./package-lock.json', currentVersion, newVersion);
updateVersionInSonarFile('./sonar-project.properties', currentVersion, newVersion);

log('Configuration files have been updated');

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function log(...data) {
  // eslint-disable-next-line no-console
  console.info(...data);
}

function getCurrentVersion() {
  const json = fs.readFileSync('./package.json', 'utf8').toString();
  const pkg = JSON.parse(json);
  return pkg.version;
}

function addOrRemoveVersionSuffix(version) {
  return version.endsWith('-post') ? version.replace(/-post$/, '') : `${version}-post`;
}

function updateVersionInNpmFile(path, currentVersion, newVersion) {
  const content = fs.readFileSync(path, 'utf8').toString();
  const updatedContent = content.replace(`"version": "${currentVersion}"`, `"version": "${newVersion}"`);
  fs.writeFileSync(path, updatedContent);
}

function updateVersionInSonarFile(path, currentVersion, newVersion) {
  const content = fs.readFileSync(path, 'utf8').toString();
  const updatedContent = content.replace(`sonar.projectVersion=${currentVersion}`, `sonar.projectVersion=${newVersion}`);
  fs.writeFileSync(path, updatedContent);
}
