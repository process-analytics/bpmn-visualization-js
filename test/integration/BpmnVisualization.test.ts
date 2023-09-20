/*
Copyright 2021 Bonitasoft S.A.

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

import type { FitType } from '@lib/component/options';

import {
  type GlobalOptionsWithoutContainer,
  initializeBpmnVisualizationWithContainerId,
  initializeBpmnVisualizationWithHtmlElement,
} from './helpers/bpmn-visualization-initialization';
import { allTestedFitTypes } from './helpers/fit-utils';

import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';
import { readFileSync } from '@test/shared/file-helper';

describe('BpmnVisualization initialization', () => {
  it.each`
    configName                          | config
    ${'undefined'}                      | ${undefined}
    ${'navigation disabled'}            | ${{ navigation: { enabled: false } }}
    ${'navigation without zoom config'} | ${{ navigation: { enabled: true } }}
    ${'navigation with zoom config'}    | ${{ navigation: { enabled: true, zoom: { throttleDelay: 20 } } }}
  `(`Verify correct initialization with '$configName' configuration`, ({ configName, config }: { configName: string; config: GlobalOptionsWithoutContainer }) => {
    initializeBpmnVisualizationWithContainerId(`bpmn-visualization-init-check-with-config-${configName}`, config);
  });
});

describe('BpmnVisualization API', () => {
  const bpmnVisualization = initializeBpmnVisualizationWithHtmlElement('bpmn-container', true);

  describe('Load', () => {
    it.each(allTestedFitTypes)('Fit type: %s', (fitType: string) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'), { fit: { type: fitType as FitType } });
    });

    it('Load invalid diagram (text file)', () => {
      expect(() => bpmnVisualization.load(readFileSync('../fixtures/bpmn/xml-parsing/special/text-only.txt'))).toThrow(
        `XML parsing failed. Unable to retrieve 'definitions' from the BPMN source.`,
      );
    });

    it('Load and filter pools by id - non existing pool id', () => {
      expect(() =>
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/filter/pools.bpmn'), {
          modelFilter: {
            pools: {
              id: 'i_do_not_exist',
            },
          },
        }),
      ).toThrow('No matching pools for ids [i_do_not_exist]');
    });
  });

  describe('Version', () => {
    it('lib version', () => {
      expect(bpmnVisualization.getVersion().lib).toBe(getLibraryVersionFromPackageJson());
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

  // The API should not fail
  describe('Registry access when no loaded diagram', () => {
    const bv = initializeBpmnVisualizationWithContainerId('bpmn-no-loaded-diagram');
    const bpmnElementsRegistry = bv.bpmnElementsRegistry;

    it('getElementsByIds', () => {
      expect(bpmnElementsRegistry.getElementsByIds('fake_id')).toHaveLength(0);
    });
    it('getElementsByKinds', () => {
      expect(bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.CALL_ACTIVITY)).toHaveLength(0);
    });
    it('CSS classes', () => {
      bpmnElementsRegistry.addCssClasses('fake_id_1', 'class1');
      bpmnElementsRegistry.removeCssClasses('fake_id_2', 'class2');
      bpmnElementsRegistry.toggleCssClasses('fake_id_3', 'class3');
      bpmnElementsRegistry.removeAllCssClasses('fake_id_4');
    });
    it('Overlays', () => {
      bpmnElementsRegistry.addOverlays('fake_id_1', { label: 'overlay', position: 'top-center' });
      bpmnElementsRegistry.removeAllOverlays('fake_id_2');
    });
    it('updateStyle', () => {
      bpmnElementsRegistry.updateStyle('fake_id', { fill: { color: 'red' } });
    });
    it('resetStyle', () => {
      bpmnElementsRegistry.resetStyle('fake_id');
    });
  });
});

function getLibraryVersionFromPackageJson(): string {
  const json = readFileSync('../../package.json');
  const packageJson = JSON.parse(json);
  return packageJson.version;
}
