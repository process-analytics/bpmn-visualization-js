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

import { findFiles } from '../helpers/file-helper';

describe('NPM package', () => {
  describe('Files in the dist directory', () => {
    const expectedFiles = [
      'bpmn-visualization.cjs.js', // CommonJS
      'bpmn-visualization.cjs.min.js', //CommonJS minified
      'bpmn-visualization.esm.js', // ESM
      'bpmn-visualization.esm.min.js', // ESM minified
      'bpmn-visualization.js', // IIFE
      'bpmn-visualization.min.js', // IIFE minified
      'bpmn-visualization.d.ts', // Type definitions
      'not-supported-ts-versions.d.ts', // Type definitions for TS versions that are not supported
    ];

    it('Files in the npm package', () => {
      const files: string[] = findFiles('../../dist');
      expect(files).toIncludeSameMembers(expectedFiles);
    });
  });
});
