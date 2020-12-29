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
import { ElementHandle } from 'puppeteer';
import debugLogger from 'debug';
import { copyFileSync, loadBpmnContentForUrlQueryParam } from '../../helpers/file-helper';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { FitType, LoadOptions } from '../../../src/component/options';
import BpmnVisualization from '../../../src/component/BpmnVisualization';
import { dirname, join } from 'path';
import { BpmnQuerySelectors } from '../../../src/component/registry/bpmn-elements-registry';

const log = debugLogger('test');

export function getSimplePlatformName(): string {
  const platform = process.platform;
  log(`This platform is ${platform}`);

  if (platform.startsWith('win')) {
    return 'windows';
  } else if (platform.startsWith('darwin')) {
    return 'macos';
  }
  // we don't support other platform than linux, so hardcode it
  return 'linux';
}

export interface ImageSnapshotThresholdConfig {
  linux: number;
  macos: number;
  windows: number;
}

const defaultImageSnapshotConfig: MatchImageSnapshotOptions = {
  diffDirection: 'vertical',
  dumpDiffToConsole: true, // useful on CI (no need to retrieve the diff image, copy/paste image content from logs)
  // use SSIM to limit false positive
  // https://github.com/americanexpress/jest-image-snapshot#recommendations-when-using-ssim-comparison
  comparisonMethod: 'ssim',
};

export class ImageSnapshotConfigurator {
  protected readonly defaultCustomDiffDir: string;
  protected readonly defaultCustomSnapshotsDir: string;
  /**
   * <b>About `thresholdConfig`</b>
   *
   * Configure threshold by bpmn files.When introducing a new test, please don't add threshold until you get failures when running
   * on GitHub Workflow because of discrepancies depending of OS/machine (few pixels) and that are not visible by a human.
   * This is generally only required for diagram containing labels. If you are not testing the labels (value, position, ...) as part of the use case you want to cover, remove labels
   * from the BPMN diagram to avoid such discrepancies.
   */
  constructor(readonly thresholdConfig: Map<string, ImageSnapshotThresholdConfig>, private customDirName: string, readonly defaultFailureThreshold = 0.000004) {
    this.defaultCustomDiffDir = join(ImageSnapshotConfigurator.getDiffDir(), customDirName);
    this.defaultCustomSnapshotsDir = join(ImageSnapshotConfigurator.getSnapshotsDir(), customDirName);
  }

  // minimal threshold to make tests for diagram renders pass on local
  // macOS: Expected image to match or be a close match to snapshot but was 0.00031509446166699817% different from snapshot
  getConfig(param: string | { fileName: string }): MatchImageSnapshotOptions {
    const fileName = typeof param === 'string' ? param : param.fileName;
    const config = this.thresholdConfig.get(fileName);
    let failureThreshold = this.defaultFailureThreshold;
    if (config) {
      log(`Building dedicated image snapshot configuration for '${fileName}'`);
      const simplePlatformName = getSimplePlatformName();
      log(`Simple platform name: ${simplePlatformName}`);
      // we know here that we have property names related to the 'simple platform name' so ignoring TS complains.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      failureThreshold = config[simplePlatformName];
    }

    log(`ImageSnapshot - using failureThreshold: ${failureThreshold}`);
    return {
      ...defaultImageSnapshotConfig,
      failureThreshold: failureThreshold,
      failureThresholdType: 'percent',
      customSnapshotIdentifier: fileName,
      customSnapshotsDir: this.defaultCustomSnapshotsDir,
      customDiffDir: this.defaultCustomDiffDir,
    };
  }

  static getSnapshotsDir(): string {
    return join(dirname(expect.getState().testPath), '__image_snapshots__');
  }

  static getDiffDir(): string {
    return join(ImageSnapshotConfigurator.getSnapshotsDir(), '__diff_output__');
  }
}

export enum BpmnLoadMethod {
  QueryParam = 'query param',
  Url = 'url',
}

export interface TargetedPage {
  pageFileName: string;
  queryParams?: string[];
  expectedPageTitle: string;
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
  constructor(readonly targetedPage: TargetedPage, readonly sourceBpmnFolderName: string) {
    const params = targetedPage.queryParams?.join('&') ?? '';

    this.baseUrl = `http://localhost:10002/${targetedPage.pageFileName}.html?${params}`;
  }

  async loadBPMNDiagramInRefreshedPage(bpmnDiagramFileName: string, bpmnLoadMethod?: BpmnLoadMethod, loadParams?: LoadOptions): Promise<ElementHandle<Element>> {
    const url = this.getPageUrl(bpmnDiagramFileName, bpmnLoadMethod, loadParams);
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
   * @param fileName the name of the BPMN file without extension
   */
  private getPageUrl(
    fileName: string,
    bpmnLoadMethod: BpmnLoadMethod = BpmnLoadMethod.QueryParam,
    loadOptions: LoadOptions = { fit: { type: FitType.HorizontalVertical } },
  ): string {
    log(`Use '${bpmnLoadMethod}' as BPMN Load Method for '${fileName}'`);

    let url = this.baseUrl;
    url += `&fitTypeOnLoad=${loadOptions?.fit?.type}&fitMargin=${loadOptions?.fit?.margin}`;
    url += `&${this.getUrlParameterForBPMNContent(fileName, bpmnLoadMethod)}`;
    return url;
  }

  private getUrlParameterForBPMNContent(fileName: string, bpmnLoadMethod: BpmnLoadMethod): string {
    const relPathToBpmnFile = `../fixtures/bpmn/${this.sourceBpmnFolderName}/${fileName}.bpmn`;
    switch (bpmnLoadMethod) {
      case BpmnLoadMethod.QueryParam:
        const bpmnContent = loadBpmnContentForUrlQueryParam(relPathToBpmnFile);
        return `bpmn=${bpmnContent}`;
      case BpmnLoadMethod.Url:
        copyFileSync(relPathToBpmnFile, `../../dist/static/diagrams/`, `${fileName}.bpmn`);
        return `url=./static/diagrams/${fileName}.bpmn`;
    }
  }
}

export function delay(time: number): Promise<unknown> {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export class HtmlElementLookup {
  constructor(private bpmnVisualization: BpmnVisualization) {}

  private findSvgElement(bpmnId: string): HTMLElement {
    const bpmnElements = this.bpmnVisualization.bpmnElementsRegistry.getElementsByIds(bpmnId);
    return bpmnElements.length == 0 ? undefined : bpmnElements[0].htmlElement;
  }

  expectEvent(bpmnId: string): void {
    expectSvgEvent(this.findSvgElement(bpmnId));
  }

  expectTask(bpmnId: string): void {
    expectSvgTask(this.findSvgElement(bpmnId));
  }
}

export function expectSvgEvent(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'ellipse');
}

export function expectSvgTask(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'rect');
}

export function expectSvgPool(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'path');
}

export function expectSvgSequenceFlow(svgGroupElement: HTMLElement): void {
  expectSvgFirstChildNodeName(svgGroupElement, 'path');
}

// TODO duplication with puppeteer expects in mxGraph.view.test.ts
// we expect a SVGGElement as HTMLElement parameter
function expectSvgFirstChildNodeName(svgGroupElement: HTMLElement, name: string): void {
  expect(svgGroupElement).not.toBeUndefined();
  const firstChild = svgGroupElement.firstChild as SVGGeometryElement;
  expect(firstChild.nodeName).toEqual(name);
}
