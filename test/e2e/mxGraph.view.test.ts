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
import { readFileSync } from './e2e-helpers';

const graphContainerId = 'graph';

async function expectLabel(cellId: string, expectedText?: string): Promise<void> {
  if (!expectedText) {
    return;
  }
  const svgElementHandle = await page.waitForSelector(`#${graphContainerId} svg g g[data-cell-id="${cellId}"] g foreignObject`);
  // contains 3 div
  expect(await svgElementHandle.evaluate(node => (node.firstChild.firstChild.firstChild as HTMLElement).innerHTML)).toBe(expectedText);
}

async function expectEvent(cellId: string, expectedText: string): Promise<void> {
  const svgElementHandle = await page.waitForSelector(`#${graphContainerId} svg g g[data-cell-id="${cellId}"]`);
  // TODO do we test class?
  expect(await svgElementHandle.evaluate(node => node.firstChild.nodeName)).toBe('ellipse');
  expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('rx'))).toBe('18');
  expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('ry'))).toBe('18');
  await expectLabel(cellId, expectedText);
}

async function expectTask(cellId: string, expectedText: string): Promise<void> {
  const svgElementHandle = await page.waitForSelector(`#${graphContainerId} svg g g[data-cell-id="${cellId}"]`);
  expect(await svgElementHandle.evaluate(node => node.getAttribute('class'))).toBe('class-state-cell-style-task');
  expect(await svgElementHandle.evaluate(node => node.firstChild.nodeName)).toBe('rect');
  expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('width'))).toBe('100');
  expect(await svgElementHandle.evaluate(node => (node.firstChild as SVGGElement).getAttribute('height'))).toBe('80');
  await expectLabel(cellId, expectedText);
}

async function expectSequenceFlow(cellId: string, expectedText?: string): Promise<void> {
  const svgElementHandle = await page.waitForSelector(`#${graphContainerId} svg g g[data-cell-id="${cellId}"]`);
  expect(await svgElementHandle.evaluate(node => node.getAttribute('class'))).toBe('class-state-cell-style-normal');
  expect(await svgElementHandle.evaluate(node => node.firstChild.nodeName)).toBe('path');
  await expectLabel(cellId, expectedText);
}

describe('BpmnVisu view', () => {
  it('should display page title', async () => {
    await page.goto('http://localhost:10001');
    await page.waitForSelector(`#${graphContainerId}`);
    await expect(page.title()).resolves.toMatch('BPMN Visualization Demo');
  });

  it('should display graph in page', async () => {
    await page.goto(`http://localhost:10001?bpmn=${readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn')}`);

    await expectEvent('StartEvent_1', 'Start Event 1');
    await expectSequenceFlow('Flow_1', 'Sequence Flow 1');
    await expectTask('Activity_1', 'Task 1');
    await expectSequenceFlow('Flow_2');
    await expectEvent('EndEvent_1', 'End Event 1');
  });
});
