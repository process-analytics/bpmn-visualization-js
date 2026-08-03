/*
Copyright 2026 Bonitasoft S.A.

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

import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

import { AvailableTestPages, PageTester } from '@test/shared/visu/bpmn-page-utils';
import { getBpmnDiagramNames } from '@test/shared/visu/test-utils';

class ImageSnapshotThresholdsBonitaConnector extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    // No dedicated threshold: they are only added when a test actually fails on CI.
    super({ chromium: 0 / 100, firefox: 0 / 100, webkit: 0 / 100 });
  }
}

describe('Bonita connector', () => {
  const diagramSubfolder = 'bonita-connector';
  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder }, page);
  const bpmnDiagramNames = getBpmnDiagramNames(diagramSubfolder);
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new ImageSnapshotThresholdsBonitaConnector(), 'bonita-connector');

  it.each(bpmnDiagramNames)(`%s`, async (bpmnDiagramName: string) => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(config);
  });
});
