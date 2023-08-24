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

import 'jest-playwright-preset';
import { resolve } from 'node:path';
import type { Page } from 'playwright';
import type { TargetedPageConfiguration } from '@test/shared/visu/bpmn-page-utils';
import { BpmnPageSvgTester } from '@test/shared/visu/bpmn-page-utils';

describe('bundles', () => {
  it('IIFE bundle - should generate BPMN Diagram SVG', async () => {
    const pageTester = new BpmnStaticPageSvgTester(
      {
        targetedPage: {
          pageFileName: 'lib-integration-iife',
          expectedPageTitle: 'bpmn-visualization IIFE bundle',
        },
        bpmnContainerId: 'bpmn-container-for-iife-bundle',
      },
      page,
    );
    await pageTester.gotoPageAndLoadBpmnDiagram();

    await pageTester.expectEvent('StartEvent_1', 'Start Event 1');
    await pageTester.expectSequenceFlow('Flow_1', 'Sequence Flow 1');
    await pageTester.expectTask('Activity_1', 'Task 1');
    await pageTester.expectSequenceFlow('Flow_2');
    await pageTester.expectEvent('EndEvent_1', 'End Event 1', false);
  });
});

type SvgTargetedPageConfiguration = Omit<TargetedPageConfiguration, 'diagramSubfolder'>;

class BpmnStaticPageSvgTester extends BpmnPageSvgTester {
  constructor(targetedPageConfiguration: SvgTargetedPageConfiguration, page: Page) {
    // In the tests here, we are loading the diagram provided by the page, it is not possible to specify a diagram
    // So the diagram configuration is useless, and we pass fake values
    super({ ...targetedPageConfiguration, diagramSubfolder: 'none' }, page);
  }
  override async gotoPageAndLoadBpmnDiagram(): Promise<void> {
    const url = `file://${resolve(__dirname, `static/${this.targetedPageConfiguration.targetedPage.pageFileName}.html`)}`;
    await super.doGotoPageAndLoadBpmnDiagram(url, false);
  }
}
