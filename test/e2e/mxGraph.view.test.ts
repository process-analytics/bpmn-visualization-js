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
import { BpmnElementSelector } from './helpers/visu-utils';
import { ElementHandle } from 'puppeteer';

let bpmnContainerId = 'bpmn-container';
let bpmnElementSelector = new BpmnElementSelector(bpmnContainerId);

async function expectLabel(cellId: string, expectedText?: string): Promise<void> {
  if (!expectedText) {
    return;
  }
  const svgElementHandle = await page.waitForSelector(bpmnElementSelector.labelOfFirstAvailableElement(cellId));
  // contains 3 div
  expect(await svgElementHandle.evaluate(node => (node.firstChild.firstChild.firstChild as HTMLElement).innerHTML)).toBe(expectedText);
}

async function expectEvent(cellId: string, expectedText: string): Promise<void> {
  const svgElementHandle = await page.waitForSelector(bpmnElementSelector.firstAvailableElement(cellId));
  // TODO do we test the class attribute?
  expect(await svgElementHandle.evaluate(node => node.firstChild.nodeName)).toBe('ellipse');
  expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('rx'))).toBe('18');
  expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('ry'))).toBe('18');
  await expectLabel(cellId, expectedText);
}

async function expectClassName(svgElementHandle: ElementHandle, className: string): Promise<void> {
  expect(await svgElementHandle.evaluate(node => node.getAttribute('class'))).toBe(className);
}

async function expectFirstChildNodeName(svgElementHandle: ElementHandle, nodeName: string): Promise<void> {
  expect(await svgElementHandle.evaluate(node => node.firstChild.nodeName)).toBe(nodeName);
}

async function expectFirstChildAttribute(svgElementHandle: ElementHandle, attribute: string, value: string): Promise<void> {
  expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute(attribute))).toBe(value);
}

async function expectTask(cellId: string, expectedText: string): Promise<void> {
  const svgElementHandle = await page.waitForSelector(bpmnElementSelector.firstAvailableElement(cellId));
  // expect(await svgElementHandle.evaluate(node => node.getAttribute('class'))).toBe('class-state-cell-style-task');
  // expect(await svgElementHandle.evaluate(node => node.firstChild.nodeName)).toBe('rect');
  // expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('width'))).toBe('100');
  // expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('height'))).toBe('80');
  await expectClassName(svgElementHandle, 'class-state-cell-style-task');
  await expectFirstChildNodeName(svgElementHandle, 'rect');
  expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('width'))).toBe('100');
  expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('height'))).toBe('80');
  // await expectFirstChildAttribute(svgElementHandle, 'width', '100');
  // await expectFirstChildAttribute(svgElementHandle, 'height', '801');
  await expectLabel(cellId, expectedText);
}

async function expectSequenceFlow(cellId: string, expectedText?: string): Promise<void> {
  const svgElementHandle = await page.waitForSelector(bpmnElementSelector.firstAvailableElement(cellId));
  // expect(await svgElementHandle.evaluate(node => node.getAttribute('class'))).toBe('class-state-cell-style-sequenceFlow-normal');
  // expect(await svgElementHandle.evaluate(node => node.firstChild.nodeName)).toBe('path');
  await expectClassName(svgElementHandle, 'class-state-cell-style-sequenceFlow-normal');
  await expectFirstChildNodeName(svgElementHandle, 'path');
  await expectLabel(cellId, expectedText);
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
    await expectEvent('EndEvent_1', 'End Event 1');
  });
});

describe('lib-integration page', () => {
  it('should display diagram in page', async () => {
    bpmnContainerId = 'bpmn-container-custom';
    bpmnElementSelector = new BpmnElementSelector(bpmnContainerId);

    await page.goto(`http://localhost:10002/lib-integration.html?bpmn=${loadBpmnContentForUrlQueryParam('../fixtures/bpmn/simple-start-only.bpmn')}`);
    await expect(page.title()).resolves.toMatch('BPMN Visualization Lib Integration');
    await page.waitForSelector(`#${bpmnContainerId}`);

    await expectEvent('StartEvent_1', 'Start Event Only');
  });
});
