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

import { AvailableTestPages, PageTester } from './helpers/visu/bpmn-page-utils';
import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import type { Page } from 'playwright';

describe('Style API', () => {
  // chromium max: no error
  // firefox max for all OS: 0.055281082087199604%
  // webkit max: 0.07085182506020306%
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new MultiBrowserImageSnapshotThresholds({ chromium: 0 / 100, firefox: 0.06 / 100, webkit: 0.08 / 100 }), 'style');

  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder: 'theme' }, <Page>page);

  it(`Update 'stroke.color'`, async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram('01.most.bpmn.types.without.label', {
      styleOptions: {
        styleUpdate: { stroke: { color: 'chartreuse' } },
      },
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig('stroke.color');
    expect(image).toMatchImageSnapshot(config);
  });

  it(`Update 'fill.color'`, async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram('01.most.bpmn.types.without.label', {
      styleOptions: {
        styleUpdate: { fill: { color: 'chartreuse' } },
      },
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig('fill.color');
    expect(image).toMatchImageSnapshot(config);
  });
});
