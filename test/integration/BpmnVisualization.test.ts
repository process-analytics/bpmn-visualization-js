/**
 * Copyright 2021 Bonitasoft S.A.
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

import { readFileSync } from '../helpers/file-helper';
import { initializeBpmnVisualizationWithHtmlElement } from './helpers/bpmn-visualization-initialization';

const bpmnVisualization = initializeBpmnVisualizationWithHtmlElement('bpmn-container', true);

describe('BpmnVisualization', () => {
  describe('Load', () => {
    it('Load invalid diagram (text file)', async () => {
      expect(() => bpmnVisualization.load(readFileSync('../fixtures/bpmn/xml-parsing/special/text-only.txt'))).toThrow(
        `XML parsing failed. Unable to retrieve 'definitions' from the BPMN source.`,
      );
    });
    it('Load and filter one pool by id - non existing pool id', () => {
      expect(() =>
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'), {
          modelFilter: {
            includes: {
              pools: {
                ids: 'i_do_not_exist',
              },
            },
          },
        }),
      ).toThrow(`no existing pool with ids i_do_not_exist`);
    });
  });

  describe('Version', () => {
    it('lib version', () => {
      expect(bpmnVisualization.getVersion().lib).toBe(getLibVersionFromPackageJson());
    });
    it('mxGraph version', () => {
      expect(bpmnVisualization.getVersion().dependencies.get('mxGraph')).toBeDefined();
    });
    it('not modifiable version', () => {
      const initialVersion = bpmnVisualization.getVersion();
      initialVersion.lib = 'set by test';
      initialVersion.dependencies.set('extra', 'added in test');

      const newVersion = bpmnVisualization.getVersion();
      expect(newVersion.lib).not.toBe(initialVersion.lib);
      expect(newVersion.dependencies).not.toBe(initialVersion.dependencies);
    });
  });
});

function getLibVersionFromPackageJson(): string {
  const json = readFileSync('../../package.json');
  const pkg = JSON.parse(json);
  return pkg.version;
}
