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
import { ElementHandle, Page } from 'playwright';
import { BpmnQuerySelectorsForTests } from '../../../helpers/query-selectors';
import 'jest-playwright-preset';
import { FitType, LoadOptions } from '../../../../src/component/options';

// PageWaitForSelectorOptions is not exported by playwright
export interface PageWaitForSelectorOptions {
  timeout?: number;
}

class BpmnPage {
  private bpmnQuerySelectors: BpmnQuerySelectorsForTests;

  constructor(private bpmnContainerId: string, private currentPage: Page) {
    this.bpmnQuerySelectors = new BpmnQuerySelectorsForTests(this.bpmnContainerId);
  }

  async expectAvailableBpmnContainer(options?: PageWaitForSelectorOptions): Promise<ElementHandle<SVGElement | HTMLElement>> {
    const bpmnContainer = await this.currentPage.waitForSelector(`#${this.bpmnContainerId}`, options);
    await expect(bpmnContainer.getAttribute('style')).resolves.toContain('cursor: default');
    return bpmnContainer;
  }

  async expectPageTitle(title: string): Promise<void> {
    await expect(this.currentPage.title()).resolves.toEqual(title);
  }

  /**
   * This checks that a least one BPMN element is available in the DOM as a SVG element. This ensure that the mxGraph rendering has been done.
   */
  async expectExistingBpmnElement(options?: PageWaitForSelectorOptions): Promise<void> {
    await this.currentPage.waitForSelector(this.bpmnQuerySelectors.existingElement(), options);
  }
}

export interface TargetedPage {
  /** the name of the page file without extension */
  pageFileName: string;
  /** the expected of the page title after the page loading */
  expectedPageTitle: string;
  /**
   * Id of the container in the page attached to bpmn-visualization
   * @default bpmn-container
   */
  bpmnContainerId?: string;
  /**
   * Set to `true` to display the mouse pointer after the page loading
   * @default false
   */
  showMousePointer?: boolean;
}

export interface StyleOptions {
  bpmnContainer?: {
    useAlternativeBackgroundColor?: boolean;
  };
  sequenceFlow?: {
    useLightColors?: boolean;
  };
}

export interface PageOptions {
  loadOptions?: LoadOptions;
  styleOptions?: StyleOptions;
}

export class PageTester {
  private readonly baseUrl: string;
  protected bpmnPage: BpmnPage;
  protected bpmnContainerId: string;

  /**
   * Configure how the BPMN file is loaded by the test page.
   */
  constructor(readonly targetedPage: TargetedPage) {
    const showMousePointer = targetedPage.showMousePointer ?? false;
    this.baseUrl = `http://localhost:10002/${targetedPage.pageFileName}.html?showMousePointer=${showMousePointer}`;
    this.bpmnContainerId = targetedPage.bpmnContainerId ?? 'bpmn-container';
    this.bpmnPage = new BpmnPage(this.bpmnContainerId, <Page>page);
  }

  async loadBPMNDiagramInRefreshedPage(bpmnDiagramName: string, pageOptions?: PageOptions): Promise<ElementHandle<SVGElement | HTMLElement>> {
    const url = this.getPageUrl(bpmnDiagramName, pageOptions?.loadOptions ?? { fit: { type: FitType.HorizontalVertical } }, pageOptions?.styleOptions);
    return this.doLoadBPMNDiagramInRefreshedPage(url);
  }

  protected async doLoadBPMNDiagramInRefreshedPage(url: string, checkResponseStatus = true): Promise<ElementHandle<SVGElement | HTMLElement>> {
    const response = await page.goto(url);
    if (checkResponseStatus) {
      expect(response.status()).toBe(200);
    }

    await this.bpmnPage.expectPageTitle(this.targetedPage.expectedPageTitle);

    const waitForSelectorOptions = { timeout: 5_000 };
    const elementHandle = await this.bpmnPage.expectAvailableBpmnContainer(waitForSelectorOptions);
    await this.bpmnPage.expectExistingBpmnElement(waitForSelectorOptions);
    return elementHandle;
  }

  /**
   * @param bpmnDiagramName the name of the BPMN file without extension
   * @param loadOptions optional fit options
   * @param styleOptions optional style options
   */
  private getPageUrl(bpmnDiagramName: string, loadOptions: LoadOptions, styleOptions?: StyleOptions): string {
    let url = this.baseUrl;
    url += `&fitTypeOnLoad=${loadOptions.fit?.type}&fitMargin=${loadOptions.fit?.margin}`;
    url += `&url=./static/diagrams/${bpmnDiagramName}.bpmn`;
    url += `&style.seqFlow.light.colors=${styleOptions?.sequenceFlow?.useLightColors}`;
    url += `&style.container.alternative.background.color=${styleOptions?.bpmnContainer?.useAlternativeBackgroundColor}`;
    return url;
  }
}

export class BpmnPageSvgTester extends PageTester {
  private bpmnQuerySelectors: BpmnQuerySelectorsForTests;

  constructor(targetedPage: TargetedPage, private currentPage: Page) {
    super(targetedPage);
    // TODO duplicated with BpmnPage
    this.bpmnQuerySelectors = new BpmnQuerySelectorsForTests(this.bpmnContainerId);
  }

  override async loadBPMNDiagramInRefreshedPage(bpmnDiagramName?: string): Promise<ElementHandle<SVGElement | HTMLElement>> {
    return super.loadBPMNDiagramInRefreshedPage(bpmnDiagramName ?? 'not-used-dedicated-diagram-loaded-by-the-page', {
      loadOptions: {
        fit: {
          type: FitType.None,
        },
      },
    });
  }

  async expectLabel(bpmnId: string, expectedText?: string): Promise<void> {
    if (!expectedText) {
      return;
    }
    const labelLastDivElementHandle = await this.currentPage.waitForSelector(this.bpmnQuerySelectors.labelLastDiv(bpmnId));
    expect(await labelLastDivElementHandle.evaluate(node => node.innerHTML)).toBe(expectedText);
  }

  async expectEvent(bpmnId: string, expectedText: string, isStartEvent = true): Promise<void> {
    const svgElementHandle = await this.currentPage.waitForSelector(this.bpmnQuerySelectors.element(bpmnId));
    await expectClassAttribute(svgElementHandle, `bpmn-type-event ${isStartEvent ? 'bpmn-start-event' : 'bpmn-end-event'} bpmn-event-def-none`);
    await expectFirstChildNodeName(svgElementHandle, 'ellipse');
    await expectFirstChildAttribute(svgElementHandle, 'rx', '18');
    await expectFirstChildAttribute(svgElementHandle, 'ry', '18');

    await this.expectLabel(bpmnId, expectedText);
  }

  async expectTask(bpmnId: string, expectedText: string): Promise<void> {
    const svgElementHandle = await this.currentPage.waitForSelector(this.bpmnQuerySelectors.element(bpmnId));
    await expectClassAttribute(svgElementHandle, 'bpmn-type-activity bpmn-type-task bpmn-task');
    await expectFirstChildNodeName(svgElementHandle, 'rect');
    await expectFirstChildAttribute(svgElementHandle, 'width', '100');
    await expectFirstChildAttribute(svgElementHandle, 'height', '80');
    await this.expectLabel(bpmnId, expectedText);
  }

  async expectSequenceFlow(bpmnId: string, expectedText?: string): Promise<void> {
    const svgElementHandle = await this.currentPage.waitForSelector(this.bpmnQuerySelectors.element(bpmnId));
    await expectClassAttribute(svgElementHandle, 'bpmn-type-flow bpmn-sequence-flow');
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

async function expectFirstChildAttribute(svgElementHandle: ElementHandle, attributeName: string, value: string): Promise<void> {
  expect(await svgElementHandle.evaluate((node: Element, attribute: string) => (node.firstChild as SVGGElement).getAttribute(attribute), attributeName)).toBe(value);
}
