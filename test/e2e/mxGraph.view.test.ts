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
import { loadBpmnContentForUrlQueryParam } from '../helpers/file-helper';
import { BpmnQuerySelectors } from '../../src/component/registry/bpmn-elements-registry';
import { ElementHandle } from 'puppeteer';

let bpmnContainerId = 'bpmn-container';
let bpmnQuerySelectors = new BpmnQuerySelectors(bpmnContainerId);

async function expectLabel(bpmnId: string, expectedText?: string): Promise<void> {
  if (!expectedText) {
    return;
  }
  const svgElementHandle = await page.waitForSelector(bpmnQuerySelectors.labelOfElement(bpmnId));
  // contains 3 div
  expect(await svgElementHandle.evaluate(node => (node.firstChild.firstChild.firstChild as HTMLElement).innerHTML)).toBe(expectedText);
}

async function expectEvent(bpmnId: string, expectedText: string, isStartEvent = true): Promise<void> {
  const svgElementHandle = await page.waitForSelector(bpmnQuerySelectors.element(bpmnId));
  await expectClassName(svgElementHandle, isStartEvent ? 'bpmn-start-event' : 'bpmn-end-event');
  await expectFirstChildNodeName(svgElementHandle, 'ellipse');
  await expectFirstChildAttribute(svgElementHandle, 'rx', '18');
  await expectFirstChildAttribute(svgElementHandle, 'ry', '18');

  await expectLabel(bpmnId, expectedText);
}

async function expectClassName(svgElementHandle: ElementHandle, className: string): Promise<void> {
  expect(await svgElementHandle.evaluate(node => node.getAttribute('class'))).toBe(className);
}

async function expectFirstChildNodeName(svgElementHandle: ElementHandle, nodeName: string): Promise<void> {
  expect(await svgElementHandle.evaluate(node => node.firstChild.nodeName)).toBe(nodeName);
}

async function expectFirstChildAttribute(svgElementHandle: ElementHandle, attributeName: string, value: string): Promise<void> {
  expect(
    await svgElementHandle.evaluate((node: Element, attribute: string) => {
      return (node.firstChild as SVGGElement).getAttribute(attribute);
    }, attributeName),
  ).toBe(value);
}

async function expectTask(bpmnId: string, expectedText: string): Promise<void> {
  const svgElementHandle = await page.waitForSelector(bpmnQuerySelectors.element(bpmnId));
  await expectClassName(svgElementHandle, 'bpmn-task');
  await expectFirstChildNodeName(svgElementHandle, 'rect');
  await expectFirstChildAttribute(svgElementHandle, 'width', '100');
  await expectFirstChildAttribute(svgElementHandle, 'height', '80');
  await expectLabel(bpmnId, expectedText);
}

async function expectSequenceFlow(bpmnId: string, expectedText?: string): Promise<void> {
  const svgElementHandle = await page.waitForSelector(bpmnQuerySelectors.element(bpmnId));
  await expectClassName(svgElementHandle, 'bpmn-sequence-flow');
  await expectFirstChildNodeName(svgElementHandle, 'path');
  await expectLabel(bpmnId, expectedText);
}

describe('demo page', () => {
  it('should display page title', async () => {
    await page.goto('http://localhost:10002');
    await page.waitForSelector(`#${bpmnContainerId}`);
    await expect(page.title()).resolves.toMatch('BPMN Visualization Demo');
  });

  it('should display diagram in page', async () => {
    await page.goto(`http://localhost:10002?bpmn=${loadBpmnContentForUrlQueryParam('../fixtures/bpmn/simple-start-task-end.bpmn')}`);

    await expectEvent('StartEvent_1', 'Start Event 1');
    await expectSequenceFlow('Flow_1', 'Sequence Flow 1');
    await expectTask('Activity_1', 'Task 1');
    await expectSequenceFlow('Flow_2');
    await expectEvent('EndEvent_1', 'End Event 1', false);
  });
});

describe('lib-integration page', () => {
  it('should display diagram in page', async () => {
    bpmnContainerId = 'bpmn-container-custom';
    bpmnQuerySelectors = new BpmnQuerySelectors(bpmnContainerId);

    await page.goto(`http://localhost:10002/lib-integration.html?bpmn=${loadBpmnContentForUrlQueryParam('../fixtures/bpmn/simple-start-only.bpmn')}`);
    await expect(page.title()).resolves.toMatch('BPMN Visualization Lib Integration');
    await page.waitForSelector(`#${bpmnContainerId}`);

    await expectEvent('StartEvent_1', 'Start Event Only');
  });
});
