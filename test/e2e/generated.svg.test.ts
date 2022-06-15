/**
 * Copyright 2020 Bonitasoft S.A.
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
import 'jest-playwright-preset';
import type { Page } from 'playwright';
import { AvailableTestPages, BpmnPageSvgTester } from './helpers/visu/bpmn-page-utils';

const diagramSubfolder = 'svg';

describe('Check generated SVG in demo page', () => {
  it('should display diagram in page', async () => {
    const pageTester = new BpmnPageSvgTester({ targetedPage: AvailableTestPages.INDEX, diagramSubfolder }, <Page>page);
    await pageTester.gotoPageAndLoadBpmnDiagram('simple-start-task-end');

    await pageTester.expectEvent('StartEvent_1', 'Start Event 1');
    await pageTester.expectSequenceFlow('Flow_1', 'Sequence Flow 1');
    await pageTester.expectTask('Activity_1', 'Task 1');
    await pageTester.expectSequenceFlow('Flow_2');
    await pageTester.expectEvent('EndEvent_1', 'End Event 1', false);
  });
});

describe('Check generated SVG in lib-integration page', () => {
  it('should display diagram in page', async () => {
    const pageTester = new BpmnPageSvgTester(
      {
        targetedPage: AvailableTestPages.LIB_INTEGRATION,
        bpmnContainerId: 'bpmn-container-custom',
        diagramSubfolder,
      },
      <Page>page,
    );
    await pageTester.gotoPageAndLoadBpmnDiagram();

    await pageTester.expectEvent('StartEvent_1', 'Start Event Only');
  });
});
