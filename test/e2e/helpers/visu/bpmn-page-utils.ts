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

// in the future, we should find a solution to avoid using the reference everywhere in tests
// see https://github.com/jest-community/jest-extended/issues/367
/// <reference types="jest-extended" />

import 'expect-playwright';
import type { PageWaitForSelectorOptions } from 'expect-playwright';
import type { ElementHandle, Page } from 'playwright';
import { type LoadOptions, FitType, ZoomType } from '../../../../src/component/options';
import { BpmnQuerySelectorsForTests } from '../../../helpers/query-selectors';
import { delay } from '../test-utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore js file with commonjs export
import envUtils = require('../../../helpers/environment-utils.js');

class BpmnPage {
  private bpmnQuerySelectors: BpmnQuerySelectorsForTests;

  constructor(private bpmnContainerId: string, private page: Page) {
    this.bpmnQuerySelectors = new BpmnQuerySelectorsForTests(this.bpmnContainerId);
  }

  async expectAvailableBpmnContainer(options?: PageWaitForSelectorOptions): Promise<void> {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(this.page).toMatchAttribute(`#${this.bpmnContainerId}`, 'style', /cursor: default/, options);
  }

  async expectPageTitle(title: string): Promise<void> {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(this.page.title()).resolves.toEqual(title);
  }

  /**
   * This checks that a least one BPMN element is available in the DOM as a SVG element. This ensures that the mxGraph rendering has been done.
   */
  async expectExistingBpmnElement(options?: PageWaitForSelectorOptions): Promise<void> {
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(this.page).toHaveSelector(this.bpmnQuerySelectors.existingElement(), options);
  }
}

export interface TargetedPageConfiguration {
  /** the name of the page file without extension */
  pageFileName: string;
  /** the expected page title, checked after page loading */
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
  /** subfolder storing the diagram used during the test */
  diagramSubfolder: string;
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
  bpmnElementIdToCollapse?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface PanningOptions {
  originPoint: Point;
  destinationPoint: Point;
}

export class PageTester {
  private readonly baseUrl: string;
  protected bpmnPage: BpmnPage;
  protected bpmnContainerId: string;
  private readonly diagramSubfolder: string;

  /**
   * Configure how the BPMN file is loaded by the test page.
   */
  constructor(protected targetedPageConfiguration: TargetedPageConfiguration, protected page: Page) {
    const showMousePointer = targetedPageConfiguration.showMousePointer ?? false;
    this.baseUrl = `http://localhost:10001/dev/public/${targetedPageConfiguration.pageFileName}.html?showMousePointer=${showMousePointer}`;
    this.bpmnContainerId = targetedPageConfiguration.bpmnContainerId ?? 'bpmn-container';
    this.diagramSubfolder = targetedPageConfiguration.diagramSubfolder;
    this.bpmnPage = new BpmnPage(this.bpmnContainerId, this.page);
  }

  async gotoPageAndLoadBpmnDiagram(bpmnDiagramName: string, pageOptions?: PageOptions): Promise<void> {
    const url = this.computePageUrl(
      bpmnDiagramName,
      pageOptions?.loadOptions ?? { fit: { type: FitType.HorizontalVertical } },
      pageOptions?.styleOptions,
      pageOptions?.bpmnElementIdToCollapse,
    );
    await this.doGotoPageAndLoadBpmnDiagram(url);
  }

  protected async doGotoPageAndLoadBpmnDiagram(url: string, checkResponseStatus = true): Promise<void> {
    const response = await this.page.goto(url);
    if (checkResponseStatus) {
      // the Vite server can return http 304 for optimization
      // eslint-disable-next-line jest/no-standalone-expect
      expect(response.status()).toBeOneOf([200, 304]);
    }

    await this.bpmnPage.expectPageTitle(this.targetedPageConfiguration.expectedPageTitle);

    const waitForSelectorOptions = { timeout: 5_000 };
    await this.bpmnPage.expectAvailableBpmnContainer(waitForSelectorOptions);
    await this.bpmnPage.expectExistingBpmnElement(waitForSelectorOptions);
  }

  /**
   * @param bpmnDiagramName the name of the BPMN file without extension
   * @param loadOptions fit options
   * @param styleOptions optional style options
   * @param bpmndElementIdToCollapse optional bpmn element that will be collapsed
   */
  private computePageUrl(bpmnDiagramName: string, loadOptions: LoadOptions, styleOptions?: StyleOptions, bpmndElementIdToCollapse?: string | undefined): string {
    let url = this.baseUrl;
    url += `&url=/test/fixtures/bpmn/${this.diagramSubfolder}/${bpmnDiagramName}.bpmn`;

    // load query parameters
    loadOptions.fit?.type && (url += `&fitTypeOnLoad=${loadOptions.fit.type}`);
    loadOptions.fit?.margin && (url += `&fitMargin=${loadOptions.fit.margin}`);

    // style query parameters
    styleOptions?.sequenceFlow?.useLightColors && (url += `&style.seqFlow.light.colors=${styleOptions.sequenceFlow.useLightColors}`);
    styleOptions?.bpmnContainer?.useAlternativeBackgroundColor &&
      (url += `&style.container.alternative.background.color=${styleOptions.bpmnContainer.useAlternativeBackgroundColor}`);
    styleOptions?.theme && (url += `&style.theme=${styleOptions.theme}`);

    // elements to collapse
    bpmndElementIdToCollapse && (url += `&bpmn.element.id.collapsed=${bpmndElementIdToCollapse}`);

    return url;
  }

  async getContainerCenter(): Promise<Point> {
    const containerElement: ElementHandle<SVGElement | HTMLElement> = await this.page.waitForSelector(`#${this.bpmnContainerId}`);
    const rect = await containerElement.boundingBox();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  }

  async clickOnButton(buttonId: string): Promise<void> {
    await this.page.click(`#${buttonId}`);
    await this.page.mouse.click(0, 0); // Unselect the button
  }

  async mousePanning({ originPoint, destinationPoint }: PanningOptions): Promise<void> {
    await this.page.mouse.move(originPoint.x, originPoint.y);
    await this.page.mouse.down();
    await this.page.mouse.move(destinationPoint.x, destinationPoint.y);
    await this.page.mouse.up();
  }

  async mouseZoomNoDelay(point: Point, zoomType: ZoomType): Promise<void> {
    const deltaX = zoomType == ZoomType.In ? -100 : 100;
    await this.page.mouse.move(point.x, point.y);
    await this.page.keyboard.down('Control');
    await this.page.mouse.wheel(deltaX, 0);
    await this.page.keyboard.up('Control');
  }

  async mouseZoom(point: Point, zoomType: ZoomType, xTimes = 1): Promise<void> {
    for (let i = 0; i < xTimes; i++) {
      await this.mouseZoomNoDelay(point, zoomType);
      // delay here is needed to make the tests pass on macOS, delay must be greater than debounce timing, so it surely gets triggered
      await delay(envUtils.isRunningOnCISlowOS() ? 300 : 150);
    }
  }
}

export class BpmnPageSvgTester extends PageTester {
  private bpmnQuerySelectors: BpmnQuerySelectorsForTests;

  constructor(targetedPage: TargetedPageConfiguration, page: Page) {
    super(targetedPage, page);
    // TODO duplicated with BpmnPage
    this.bpmnQuerySelectors = new BpmnQuerySelectorsForTests(this.bpmnContainerId);
  }

  override async gotoPageAndLoadBpmnDiagram(bpmnDiagramName?: string): Promise<void> {
    await super.gotoPageAndLoadBpmnDiagram(bpmnDiagramName ?? 'not-used-dedicated-diagram-loaded-by-the-page', {
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
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(this.page).toMatchText(this.bpmnQuerySelectors.labelLastDiv(bpmnId), expectedText);
  }
}

async function expectClassAttribute(page: Page, selector: string, value: string): Promise<void> {
  await expect(page).toMatchAttribute(selector, 'class', value);
}

async function expectFirstChildNodeName(page: Page, selector: string, nodeName: string): Promise<void> {
  await expect(page).toHaveSelectorCount(`${selector} > ${nodeName}:first-child`, 1);
}

async function expectFirstChildAttribute(page: Page, selector: string, attributeName: string, value: string): Promise<void> {
  await expect(page).toMatchAttribute(`${selector} > :first-child`, attributeName, value);
}
