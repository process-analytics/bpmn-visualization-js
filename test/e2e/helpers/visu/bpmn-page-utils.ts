/**
 * Copyright 2021 Bonitasoft S.A.
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
import { BpmnQuerySelectors } from '../../../../src/component/registry/query-selectors';
import { ElementHandle, Page } from 'playwright';

export class BpmnPage {
  private bpmnQuerySelectors: BpmnQuerySelectors;

  constructor(private bpmnContainerId: string, private currentPage: Page) {
    this.bpmnQuerySelectors = new BpmnQuerySelectors(this.bpmnContainerId);
  }

  async expectAvailableBpmnContainer(): Promise<void> {
    await this.currentPage.waitForSelector(`#${this.bpmnContainerId}`);
  }

  async expectPageTitle(title: string): Promise<void> {
    await expect(this.currentPage.title()).resolves.toMatch(title);
  }

  async expectLabel(bpmnId: string, expectedText?: string): Promise<void> {
    if (!expectedText) {
      return;
    }
    const svgElementHandle = await this.currentPage.waitForSelector(this.bpmnQuerySelectors.labelOfElement(bpmnId));
    // contains 3 div
    expect(await svgElementHandle.evaluate(node => (node.firstChild.firstChild.firstChild as HTMLElement).innerHTML)).toBe(expectedText);
  }

  async expectEvent(bpmnId: string, expectedText: string, isStartEvent = true): Promise<void> {
    const svgElementHandle = await this.currentPage.waitForSelector(this.bpmnQuerySelectors.element(bpmnId));
    await expectClassAttribute(svgElementHandle, isStartEvent ? 'bpmn-start-event' : 'bpmn-end-event');
    await expectFirstChildNodeName(svgElementHandle, 'ellipse');
    await this.expectFirstChildAttribute(svgElementHandle, 'rx', '18');
    await this.expectFirstChildAttribute(svgElementHandle, 'ry', '18');

    await this.expectLabel(bpmnId, expectedText);
  }

  private async expectFirstChildAttribute(svgElementHandle: ElementHandle, attributeName: string, value: string): Promise<void> {
    expect(
      await svgElementHandle.evaluate((node: Element, attribute: string) => {
        return (node.firstChild as SVGGElement).getAttribute(attribute);
      }, attributeName),
    ).toBe(value);
  }

  async expectTask(bpmnId: string, expectedText: string): Promise<void> {
    const svgElementHandle = await this.currentPage.waitForSelector(this.bpmnQuerySelectors.element(bpmnId));
    await expectClassAttribute(svgElementHandle, 'bpmn-task');
    await expectFirstChildNodeName(svgElementHandle, 'rect');
    await this.expectFirstChildAttribute(svgElementHandle, 'width', '100');
    await this.expectFirstChildAttribute(svgElementHandle, 'height', '80');
    await this.expectLabel(bpmnId, expectedText);
  }

  async expectSequenceFlow(bpmnId: string, expectedText?: string): Promise<void> {
    const svgElementHandle = await this.currentPage.waitForSelector(this.bpmnQuerySelectors.element(bpmnId));
    await expectClassAttribute(svgElementHandle, 'bpmn-sequence-flow');
    await expectFirstChildNodeName(svgElementHandle, 'path');
    await this.expectLabel(bpmnId, expectedText);
  }
}

async function expectClassAttribute(svgElementHandle: ElementHandle<Element>, value: string): Promise<void> {
  expect(await svgElementHandle.evaluate(node => node.getAttribute('class'))).toBe(value);
}

async function expectFirstChildNodeName(svgElementHandle: ElementHandle, nodeName: string): Promise<void> {
  expect(await svgElementHandle.evaluate(node => node.firstChild.nodeName)).toBe(nodeName);
}
