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

import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import { PageTester } from './helpers/visu/bpmn-page-utils';
import type { Page } from 'playwright';
// import { getBpmnDiagramNames } from './helpers/test-utils';
// import type { OverlayPosition } from '../../src/component/registry';
// import type { MxGraphCustomOverlayPosition } from '../../src/component/mxgraph/overlay/custom-overlay';
import type { MatchImageSnapshotOptions } from 'jest-image-snapshot';

class FilterPoolsImageSnapshotConfigurator extends ImageSnapshotConfigurator {
  override getConfig(name: string): MatchImageSnapshotOptions {
    const config = super.getConfig(name);
    config.customSnapshotIdentifier = `pools-filter-${name}`;
    return config;
  }
}

describe('Filter pools', () => {
  const diagramSubfolder = 'filter';
  const imageSnapshotConfigurator = new FilterPoolsImageSnapshotConfigurator(
    // chromium: max
    // firefox: max
    // webkit: max
    new MultiBrowserImageSnapshotThresholds({ chromium: 0 / 100, firefox: 0 / 100, webkit: 0 / 100 }),
    diagramSubfolder,
  );
  const pageTester = new PageTester({ pageFileName: 'non-regression', expectedPageTitle: 'BPMN Visualization Non Regression', diagramSubfolder }, <Page>page);
  // const bpmnDiagramNames = getBpmnDiagramNames(diagramSubfolder);
  const bpmnDiagramName = 'pools';

  const filterPoolsParameters = [
    ['no-filter', undefined],
    ['one-with-lane', 'Participant_4'],
    ['one-with-subprocess', 'Participant_3'],
    // Participant_1 start/task/end
    // Participant_2 black box pool
    ['all', ['Participant_1', 'Participant_2', 'Participant_3', 'Participant_4']],
  ];

  // TODO improve types in signature
  it.each(filterPoolsParameters as [[string, string | string[]]])('Filter %s', async (name: string, poolIdsToFilter: string | string[]) => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName, {
      poolIdsToFilter: poolIdsToFilter,
    });
    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(name);
    expect(image).toMatchImageSnapshot(config);
  });
});
