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

import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import { PageTester } from './helpers/visu/bpmn-page-utils';
import type { Page } from 'playwright';
import { getBpmnDiagramNames } from './helpers/test-utils';

// key: diagram name
// values: the ids of the elements to collapse. The elements are collapsed one by one, in dedicated tests
const elementsToCollapsePerDiagram = new Map<string, Array<string>>([
  ['pools', ['Participant_1', 'Participant_2', 'Participant_3', 'Participant_4']],
  ['subprocess', ['SubProcess_1']],
]);

class CollapsedElementImageSnapshotConfigurator extends ImageSnapshotConfigurator {
  override getConfig(param: { fileName: string; collapsedElement: string }): MatchImageSnapshotOptions {
    const config = super.getConfig(param);
    config.customSnapshotIdentifier = `${param.fileName}-collapse-${param.collapsedElement}`;
    return config;
  }
}

const getElementsToCollapse = (bpmnDiagramName: string): Array<string> => {
  const elementsToCollapse = elementsToCollapsePerDiagram.get(bpmnDiagramName);
  // add 'none' to test the diagram rendering without collapsing any element. There is no element in diagrams with the 'none' id (in this case, the value is ignored  and there is no collapsing).
  return ['none', ...elementsToCollapse];
};

describe('Collapse BPMN elements', () => {
  const diagramSubfolder = 'collapse-expand';
  const imageSnapshotConfigurator = new CollapsedElementImageSnapshotConfigurator(
    // chrome: max 0.00019290318850062604%
    // firefox: max 0.10839637777485533%
    // webkit: max 0.14363687914162873%
    new MultiBrowserImageSnapshotThresholds({ chromium: 0.0002 / 100, firefox: 0.11 / 100, webkit: 0.15 / 100 }),
    diagramSubfolder,
  );
  const pageTester = new PageTester({ pageFileName: 'non-regression', expectedPageTitle: 'BPMN Visualization Non Regression', diagramSubfolder }, <Page>page);
  const bpmnDiagramNames = getBpmnDiagramNames(diagramSubfolder);

  describe.each(bpmnDiagramNames)(`%s`, (bpmnDiagramName: string) => {
    it.each(getElementsToCollapse(bpmnDiagramName))(`collapse %s`, async (bpmnElementIdToCollapse: string) => {
      await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName, {
        bpmnElementIdToCollapse: bpmnElementIdToCollapse,
      });
      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig({ fileName: bpmnDiagramName, collapsedElement: bpmnElementIdToCollapse });
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
