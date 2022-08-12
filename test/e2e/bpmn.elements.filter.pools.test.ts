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
import { AvailableTestPages, PageTester } from './helpers/visu/bpmn-page-utils';
import type { Page } from 'playwright';
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
    // chromium: 0.000598274637497731% max
    // firefox: 0.012128385807519404% max
    // webkit: 0.160355447672067% max
    new MultiBrowserImageSnapshotThresholds({ chromium: 0.0006 / 100, firefox: 0.013 / 100, webkit: 0.17 / 100 }),
    diagramSubfolder,
  );
  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder }, <Page>page);

  // Participant_1 start/task/end
  // Participant_2 black box pool
  it.each`
    name                                 | pools
    ${'none'}                            | ${undefined}
    ${'one-with-lane'}                   | ${'Participant_4'}
    ${'one-with-subprocess'}             | ${'Participant_3'}
    ${'one-with-expanded-call-activity'} | ${'Participant_5'}
    ${'all'}                             | ${['Participant_1', 'Participant_2', 'Participant_3', 'Participant_4', 'Participant_5']}
  `('Filter $name', async ({ name, pools }: { name: string; pools: string | string[] }) => {
    await pageTester.gotoPageAndLoadBpmnDiagram('pools', {
      poolIdsToFilter: pools,
    });
    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(name);
    expect(image).toMatchImageSnapshot(config);
  });

  it('Filter a not displayed pool (without shape) with elements', async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram('pools.not.displayed.with.elements', {
      poolIdsToFilter: 'participant_1',
    });
    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig('not-displayed-with-elements');
    expect(image).toMatchImageSnapshot(config);
  });
});
