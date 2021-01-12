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
import { FitType, LoadOptions } from '../../../../src/component/options';
import { ElementHandle } from 'puppeteer';
import { BpmnQuerySelectors } from '../../../../src/component/registry/bpmn-elements-registry';

/**
 * @param pageFileName the name of the page file without extension
 * @param expectedPageTitle the expected of the page title after the page loading
 * @param showMousePointer true if the mouse pointer is display, false else, after the page loading
 **/
export interface TargetedPage {
  pageFileName: string;
  expectedPageTitle: string;
  showMousePointer?: boolean;
}

export class PageTester {
  private readonly baseUrl: string;

  /**
   * Configure how the BPMN file is loaded by the test page.
   *
   * <b>About `bpmnLoadMethodConfig`</b>
   *
   * When introducing a new test, there is generally no need to add configuration here as the default is OK. You only need configuration when the file content becomes larger (in
   * that case, the test server returns an HTTP 400 error).
   *
   * Prior adding a config here, review your file to check if it is not too large because it contains too much elements, in particular, some elements not related to what you want to
   * test.
   */
  constructor(readonly targetedPage: TargetedPage) {
    const showMousePointer = targetedPage.showMousePointer ?? false;
    this.baseUrl = `http://localhost:10002/${targetedPage.pageFileName}.html?showMousePointer=${showMousePointer}`;
  }

  async loadBPMNDiagramInRefreshedPage(bpmnDiagramName: string, loadOptions?: LoadOptions): Promise<ElementHandle<Element>> {
    const url = this.getPageUrl(bpmnDiagramName, loadOptions);
    const response = await page.goto(url);
    // Uncomment the following in case of http error 400 (probably because of a too large bpmn file)
    // eslint-disable-next-line no-console
    // await page.evaluate(() => console.log(`url is ${location.href}`));

    expect(response.status()).toBe(200);
    await expect(page.title()).resolves.toMatch(this.targetedPage.expectedPageTitle);

    const waitForSelectorOptions = { timeout: 5_000 };
    const bpmnContainerId = 'bpmn-container';
    const elementHandle = await page.waitForSelector(`#${bpmnContainerId}`, waitForSelectorOptions);
    await page.waitForSelector(new BpmnQuerySelectors(bpmnContainerId).existingElement(), waitForSelectorOptions);
    return elementHandle;
  }

  /**
   * @param bpmnDiagramName the name of the BPMN file without extension
   */
  private getPageUrl(bpmnDiagramName: string, loadOptions: LoadOptions = { fit: { type: FitType.HorizontalVertical } }): string {
    let url = this.baseUrl;
    url += `&fitTypeOnLoad=${loadOptions.fit?.type}&fitMargin=${loadOptions.fit?.margin}`;
    url += `&url=./static/diagrams/${bpmnDiagramName}.bpmn`;
    return url;
  }
}
