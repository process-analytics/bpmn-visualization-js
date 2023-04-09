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

import type { StyleOptions } from './helpers/visu/bpmn-page-utils';
import { AvailableTestPages, PageTester } from './helpers/visu/bpmn-page-utils';
import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import type { Page } from 'playwright';
import { getBpmnDiagramNames } from './helpers/test-utils';

describe('BPMN in color', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new MultiBrowserImageSnapshotThresholds({ chromium: 0 / 100, firefox: 0 / 100, webkit: 0 / 100 }), 'bpmn-colors');

  const diagramSubfolder = 'bpmn-in-color';
  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder }, <Page>page);
  const bpmnDiagramNames = getBpmnDiagramNames(diagramSubfolder);

  it.each(bpmnDiagramNames)(`%s`, async (bpmnDiagramName: string) => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(config);
  });
});
