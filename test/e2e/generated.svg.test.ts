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
import { loadBpmnContentForUrlQueryParam } from '../helpers/file-helper';
import { BpmnPlaywright } from './helpers/visu/bpmn-playwright-utils';
import { browserConsoleSupport } from './helpers/visu/playwright-utils';

let bpmnPlaywright = new BpmnPlaywright('bpmn-container', page);

beforeAll(() => {
  browserConsoleSupport();
});
describe('demo page', () => {
  it('should display page title', async () => {
    await page.goto('http://localhost:10002');
    await bpmnPlaywright.expectPageTitle('BPMN Visualization Demo');
    await bpmnPlaywright.expectAvailableBpmnContainer();
  });

  it('should display diagram in page', async () => {
    await page.goto(`http://localhost:10002?bpmn=${loadBpmnContentForUrlQueryParam('../fixtures/bpmn/simple-start-task-end.bpmn')}`);

    await bpmnPlaywright.expectEvent('StartEvent_1', 'Start Event 1');
    await bpmnPlaywright.expectSequenceFlow('Flow_1', 'Sequence Flow 1');
    await bpmnPlaywright.expectTask('Activity_1', 'Task 1');
    await bpmnPlaywright.expectSequenceFlow('Flow_2');
    await bpmnPlaywright.expectEvent('EndEvent_1', 'End Event 1', false);
  });
});

describe('lib-integration page', () => {
  it('should display diagram in page', async () => {
    bpmnPlaywright = new BpmnPlaywright('bpmn-container-custom', page);

    await page.goto(`http://localhost:10002/lib-integration.html?bpmn=${loadBpmnContentForUrlQueryParam('../fixtures/bpmn/simple-start-only.bpmn')}`);
    await bpmnPlaywright.expectPageTitle('BPMN Visualization Lib Integration');
    await bpmnPlaywright.expectAvailableBpmnContainer();

    await bpmnPlaywright.expectEvent('StartEvent_1', 'Start Event Only');
  });
});
