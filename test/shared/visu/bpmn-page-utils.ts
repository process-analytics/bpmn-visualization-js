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

// in the future, we should find a solution to avoid using the reference everywhere in tests
// see https://github.com/jest-community/jest-extended/issues/367
/// <reference types="jest-extended" />

import debugLogger from 'debug';
import 'expect-playwright';
import type { PageWaitForSelectorOptions } from 'expect-playwright';
import type { ElementHandle, Page } from 'playwright';
import { type LoadOptions, FitType, ZoomType } from '@lib/component/options';
import type { ShapeStyleUpdate } from '@lib/component/registry';
import type { StyleUpdate } from '@lib/component/registry';
import { BpmnQuerySelectorsForTests } from '@test/shared/query-selectors';
import { delay } from './test-utils';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore js file with commonjs export
import envUtils = require('../environment-utils.js');

const pageCheckLog = debugLogger('bv:test:page-check');

class BpmnPage {
  private bpmnQuerySelectors = new BpmnQuerySelectorsForTests();

  constructor(private bpmnContainerId: string, private page: Page) {}

  async expectAvailableBpmnContainer(options?: PageWaitForSelectorOptions): Promise<void> {
    pageCheckLog('Expecting the BPMN container available (confirm bpmn-visualization initialization)');
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(this.page).toMatchAttribute(`#${this.bpmnContainerId}`, 'style', /cursor: default/, options);
    pageCheckLog('BPMN container available');
  }

  async expectPageTitle(title: string): Promise<void> {
    pageCheckLog('Checking page title');
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(this.page.title()).resolves.toEqual(title);
    pageCheckLog('Page title OK');
  }

  /**
   * This checks that at least one BPMN element is available in the DOM as an SVG element. This ensures that the mxGraph rendering has been done.
   */
  async expectExistingBpmnElement(options?: PageWaitForSelectorOptions): Promise<void> {
    pageCheckLog('Expecting the BPMN elements present in the page');
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(this.page).toHaveSelector(this.bpmnQuerySelectors.existingElement(), options);
    pageCheckLog('BPMN elements present in the page');
  }
}

export class AvailableTestPages {
  static readonly BPMN_RENDERING: AvailableTestPage = {
    pageFileName: 'bpmn-rendering',
    expectedPageTitle: 'bpmn-visualization - BPMN rendering',
  };

  static readonly DIAGRAM_NAVIGATION: AvailableTestPage = {
    pageFileName: 'diagram-navigation',
    expectedPageTitle: 'bpmn-visualization - Diagram Navigation',
  };

  static readonly INDEX: AvailableTestPage = {
    pageFileName: 'index',
    expectedPageTitle: 'bpmn-visualization - Demo',
  };

  static readonly LIB_INTEGRATION: AvailableTestPage = {
    pageFileName: 'lib-integration',
    expectedPageTitle: 'bpmn-visualization - Library Integration',
  };

  static readonly OVERLAYS: AvailableTestPage = {
    pageFileName: 'overlays',
    expectedPageTitle: 'bpmn-visualization - Overlays',
  };
}

interface AvailableTestPage {
  /** the name of the page file without extension */
  pageFileName: string;
  /** the expected page title, checked after page loading */
  expectedPageTitle: string;
}

export interface TargetedPageConfiguration {
  /** The HTML page used during the tests. */
  targetedPage: AvailableTestPage;
  /**
   * ID of the container in the page attached to bpmn-visualization
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
  /**
   * Let style BPMN elements using {@link BpmnElementsRegistry.updateStyle}
   */
  styleUpdate?: StyleUpdate;
}

export interface PageOptions {
  loadOptions?: LoadOptions;
  styleOptions?: StyleOptions;
  bpmnElementIdToCollapse?: string;
  poolIdsToFilter?: string | string[];
  rendererIgnoreBpmnColors?: boolean;
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
    this.baseUrl = `http://localhost:10001/dev/public/${targetedPageConfiguration.targetedPage.pageFileName}.html?showMousePointer=${showMousePointer}`;
    this.bpmnContainerId = targetedPageConfiguration.bpmnContainerId ?? 'bpmn-container';
    this.diagramSubfolder = targetedPageConfiguration.diagramSubfolder;
    this.bpmnPage = new BpmnPage(this.bpmnContainerId, this.page);
  }

  async gotoPageAndLoadBpmnDiagram(bpmnDiagramName: string, pageOptions?: PageOptions): Promise<void> {
    const url = this.computePageUrl(bpmnDiagramName, pageOptions?.loadOptions ?? { fit: { type: FitType.HorizontalVertical } }, pageOptions?.styleOptions, pageOptions);
    await this.doGotoPageAndLoadBpmnDiagram(url);
  }

  protected async doGotoPageAndLoadBpmnDiagram(url: string, checkResponseStatus = true): Promise<void> {
    pageCheckLog('Goto page %s', url);
    const response = await this.page.goto(url);
    pageCheckLog('On page %s', url);
    if (checkResponseStatus) {
      // the Vite server can return http 304 for optimization
      // eslint-disable-next-line jest/no-standalone-expect
      expect(response.status()).toBeOneOf([200, 304]);
      pageCheckLog('HTTP response status OK');
    }

    await this.bpmnPage.expectPageTitle(this.targetedPageConfiguration.targetedPage.expectedPageTitle);

    const waitForSelectorOptions = { timeout: 5_000 };
    await this.bpmnPage.expectAvailableBpmnContainer(waitForSelectorOptions);
    await this.bpmnPage.expectExistingBpmnElement(waitForSelectorOptions);

    pageCheckLog('Page detected as fully loaded, with BPMN elements');
  }

  /**
   * @param bpmnDiagramName the name of the BPMN file without extension
   * @param loadOptions fit options
   * @param styleOptions optional style options
   * @param otherPageOptions other page options
   */
  private computePageUrl(bpmnDiagramName: string, loadOptions: LoadOptions, styleOptions?: StyleOptions, otherPageOptions?: PageOptions): string {
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

    // Manage all styleUpdate properties (the implementation will be generalized when more properties will be supported)
    const styleUpdate = styleOptions?.styleUpdate;
    if (styleUpdate) {
      const stroke = styleUpdate.stroke;
      if (stroke) {
        stroke.color && (url += `&style.api.stroke.color=${stroke.color}`);
      }

      const font = styleUpdate.font;
      if (font) {
        font.color && (url += `&style.api.font.color=${font.color}`);
        font.opacity && (url += `&style.api.font.opacity=${font.opacity}`);
      }

      if ('fill' in styleUpdate) {
        const fill = (<ShapeStyleUpdate>styleUpdate).fill;
        fill.color && (url += `&style.api.fill.color=${fill.color}`);
        fill.opacity && (url += `&style.api.fill.opacity=${fill.opacity}`);
      }
    }

    // other options
    otherPageOptions?.bpmnElementIdToCollapse && (url += `&bpmn.element.id.collapsed=${otherPageOptions.bpmnElementIdToCollapse}`);
    // the array is transformed into string with the 'comma' separator, as expected by the page
    otherPageOptions?.poolIdsToFilter && (url += `&bpmn.filter.pool.ids=${otherPageOptions.poolIdsToFilter}`);
    // renderer options
    otherPageOptions?.rendererIgnoreBpmnColors !== undefined && (url += `&renderer.ignore.bpmn.colors=${otherPageOptions.rendererIgnoreBpmnColors}`);

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
  private bpmnQuerySelectors = new BpmnQuerySelectorsForTests();

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
