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
import { expect, Page } from '@playwright/test';
import { ElementHandle } from 'playwright';
import { FitType, LoadOptions } from '../../../src/component/options';
import { BpmnQuerySelectorsForTests } from '../../helpers/query-selectors';
import { Point } from './test-utils';

// PageWaitForSelectorOptions is not exported by playwright
export interface PageWaitForSelectorOptions {
  timeout?: number;
}

class BpmnPage {
  private bpmnQuerySelectors: BpmnQuerySelectorsForTests;

  constructor(private bpmnContainerId: string, private page: Page) {
    this.bpmnQuerySelectors = new BpmnQuerySelectorsForTests(this.bpmnContainerId);
  }

  async expectAvailableBpmnContainer(options?: PageWaitForSelectorOptions): Promise<void> {
    await expect(this.page.locator(`#${this.bpmnContainerId}`)).toHaveAttribute('style', /cursor: default/, options);
  }

  async expectPageTitle(title: string): Promise<void> {
    await expect(this.page.title()).resolves.toEqual(title);
  }

  /**
   * This checks that a least one BPMN element is available in the DOM as a SVG element. This ensure that the mxGraph rendering has been done.
   */
  async expectExistingBpmnElement(options?: PageWaitForSelectorOptions): Promise<void> {
    const locator = this.page.locator(this.bpmnQuerySelectors.existingElement()).first();
    await expect(locator).toBeVisible(options);
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
  theme?: string;
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
  constructor(readonly targetedPage: TargetedPage, protected page: Page) {
    const showMousePointer = targetedPage.showMousePointer ?? false;
    this.baseUrl = `/${targetedPage.pageFileName}.html?showMousePointer=${showMousePointer}`;
    this.bpmnContainerId = targetedPage.bpmnContainerId ?? 'bpmn-container';
    this.bpmnPage = new BpmnPage(this.bpmnContainerId, this.page);
  }

  async loadBPMNDiagramInRefreshedPage(bpmnDiagramName: string, pageOptions?: PageOptions): Promise<void> {
    const url = this.getPageUrl(bpmnDiagramName, pageOptions?.loadOptions ?? { fit: { type: FitType.HorizontalVertical } }, pageOptions?.styleOptions);
    await this.doLoadBPMNDiagramInRefreshedPage(url);
  }

  protected async doLoadBPMNDiagramInRefreshedPage(url: string, checkResponseStatus = true): Promise<void> {
    const response = await this.page.goto(url);
    if (checkResponseStatus) {
      expect(response.status()).toBe(200);
    }

    await this.bpmnPage.expectPageTitle(this.targetedPage.expectedPageTitle);

    const waitForSelectorOptions = { timeout: 5_000 };
    await this.bpmnPage.expectAvailableBpmnContainer(waitForSelectorOptions);
    await this.bpmnPage.expectExistingBpmnElement(waitForSelectorOptions);
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

    // style query parameters
    styleOptions?.sequenceFlow?.useLightColors && (url += `&style.seqFlow.light.colors=${styleOptions.sequenceFlow.useLightColors}`);
    styleOptions?.bpmnContainer?.useAlternativeBackgroundColor &&
      (url += `&style.container.alternative.background.color=${styleOptions.bpmnContainer.useAlternativeBackgroundColor}`);
    styleOptions?.theme && (url += `&style.theme=${styleOptions.theme}`);

    return url;
  }

  async getContainerCenter(): Promise<Point> {
    const containerElement: ElementHandle<SVGElement | HTMLElement> = await this.page.waitForSelector(`#${this.bpmnContainerId}`);
    const rect = await containerElement.boundingBox();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }
}

export class BpmnPageSvgTester extends PageTester {
  private bpmnQuerySelectors: BpmnQuerySelectorsForTests;

  constructor(targetedPage: TargetedPage, page: Page) {
    super(targetedPage, page);
    // TODO duplicated with BpmnPage
    this.bpmnQuerySelectors = new BpmnQuerySelectorsForTests(this.bpmnContainerId);
  }

  override async loadBPMNDiagramInRefreshedPage(bpmnDiagramName?: string): Promise<void> {
    await super.loadBPMNDiagramInRefreshedPage(bpmnDiagramName ?? 'not-used-dedicated-diagram-loaded-by-the-page', {
      loadOptions: {
        fit: {
          type: FitType.None,
        },
      },
    });
  }

  async expectEvent(bpmnId: string, expectedText: string, isStartEvent = true): Promise<void> {
    const selector = this.bpmnQuerySelectors.element(bpmnId);

    await expectClassAttribute(this.page, selector, `bpmn-type-event ${isStartEvent ? 'bpmn-start-event' : 'bpmn-end-event'} bpmn-event-def-none`);
    await expectFirstChildNodeName(this.page, selector, 'ellipse');
    await expectFirstChildAttribute(this.page, selector, 'rx', '18');
    await expectFirstChildAttribute(this.page, selector, 'ry', '18');
    await this.checkLabel(bpmnId, expectedText);
  }

  async expectTask(bpmnId: string, expectedText: string): Promise<void> {
    const selector = this.bpmnQuerySelectors.element(bpmnId);
    await expectClassAttribute(this.page, selector, 'bpmn-type-activity bpmn-type-task bpmn-task');
    await expectFirstChildNodeName(this.page, selector, 'rect');
    await expectFirstChildAttribute(this.page, selector, 'width', '100');
    await expectFirstChildAttribute(this.page, selector, 'height', '80');
    await this.checkLabel(bpmnId, expectedText);
  }

  async expectSequenceFlow(bpmnId: string, expectedText?: string): Promise<void> {
    const selector = this.bpmnQuerySelectors.element(bpmnId);
    await expectClassAttribute(this.page, selector, 'bpmn-type-flow bpmn-sequence-flow');
    await expectFirstChildNodeName(this.page, selector, 'path');
    await this.checkLabel(bpmnId, expectedText);
  }

  async checkLabel(bpmnId: string, expectedText?: string): Promise<void> {
    if (!expectedText) {
      return;
    }
    await expect(this.page.locator(this.bpmnQuerySelectors.labelLastDiv(bpmnId))).toHaveText(expectedText);
  }
}

async function expectClassAttribute(page: Page, selector: string, value: string): Promise<void> {
  await expect(page.locator(selector).first()).toHaveAttribute('class', value);
}

async function expectFirstChildNodeName(page: Page, selector: string, nodeName: string): Promise<void> {
  await expect(page.locator(selector).first().locator(`${nodeName}:first-child`)).toHaveCount(1);
}

async function expectFirstChildAttribute(page: Page, selector: string, attributeName: string, value: string): Promise<void> {
  await expect(page.locator(selector).first().locator(`:first-child`)).toHaveAttribute(attributeName, value);
}
