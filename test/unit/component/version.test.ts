/**
 * @jest-environment jsdom
 */
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

import { getVersion } from '@lib/component/version';
import { readFileSync } from '@test/shared/file-helper';

const getLibraryVersionFromPackageJson = (): string => {
  const json = readFileSync('../../package.json');
  const packageJson = JSON.parse(json);
  return packageJson.version;
};

describe('Version', () => {
  test('lib version', () => {
    expect(getVersion().lib).toBe(getLibraryVersionFromPackageJson());
  });

  test('mxGraph version', () => {
    expect(getVersion().dependencies.get('mxGraph')).toBeDefined();
  });

  test('not modifiable version', () => {
    const initialVersion = getVersion();
    initialVersion.lib = 'set by test';
    initialVersion.dependencies.set('extra', 'added in test');

    const newVersion = getVersion();
    expect(newVersion.lib).not.toBe(initialVersion.lib);
    expect(newVersion.dependencies).not.toBe(initialVersion.dependencies);
  });
});
