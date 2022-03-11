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

if (process.env.IS_RELEASING) {
  updateVersionInFilesOnRelease();
} else {
  manageVersionSuffixInFiles();
}

function updateVersionInFilesOnRelease() {
  log('Updating version in files on release');
  const currentVersion = getCurrentVersion();
  log('Current version', currentVersion);
  updateVersionInSourceFile(currentVersion);
  log('Files have been updated');
}

function manageVersionSuffixInFiles() {
  log('Managing version suffix in files');
  const currentVersion = getCurrentVersion();
  log('Current version', currentVersion);

  const newVersion = addOrRemoveVersionSuffix(currentVersion);
  log('New version', newVersion);

  updateVersionInNpmFile('./package.json', newVersion);
  updateVersionInNpmFile('./package-lock.json', newVersion);
  updateVersionInSonarFile(newVersion);
  updateVersionInSourceFile(newVersion);

  log('Files have been updated');
}

function log(...data) {
  // eslint-disable-next-line no-console
  console.info(...data);
}

function readFileContent(path) {
  return fs.readFileSync(path, 'utf8').toString();
}

function getCurrentVersion() {
  const json = readFileContent('./package.json');
  const pkg = JSON.parse(json);
  return pkg.version;
}

function addOrRemoveVersionSuffix(version) {
  return version.endsWith('-post') ? version.replace(/-post$/, '') : `${version}-post`;
}

function updateVersionInNpmFile(path, newVersion) {
  const json = readFileContent(path);
  const pkg = JSON.parse(json);
  pkg.version = newVersion;
  fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
}

function updateVersionInSonarFile(newVersion) {
  const path = './sonar-project.properties';
  const content = readFileContent(path);
  // replace the 1st occurrence, is ok as a key appears only once in the file
  const updatedContent = content.replace(/sonar\.projectVersion=.*/, `sonar.projectVersion=${newVersion}`);
  fs.writeFileSync(path, updatedContent);
}

function updateVersionInSourceFile(newVersion) {
  const path = 'src/component/version.ts';
  const content = readFileContent(path);
  // replace the 1st occurrence, is ok as the constant appears only once in the file
  const updatedContent = content.replace(/const libVersion =.*/, `const libVersion = '${newVersion}';`);
  fs.writeFileSync(path, updatedContent);
}
