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
import { LoadOptions, FitType } from '../../../src/component/Options';

const log = debugLogger('test');

function getSimplePlatformName(): string {
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
  /**
   * <b>About `thresholdConfig`</b>
   *
   * Configure threshold by bpmn files.When introducing a new test, please don't add threshold until you get failures when running
   * on GitHub Workflow because of discrepancies depending of OS/machine (few pixels) and that are not visible by a human.
   * This is generally only required for diagram containing labels. If you are not testing the labels (value, position, ...) as part of the use case you want to cover, remove labels
   * from the BPMN diagram to avoid such discrepancies.
   */
  constructor(readonly thresholdConfig: Map<string, ImageSnapshotThresholdConfig>) {}

  getConfig(fileName: string): MatchImageSnapshotOptions {
    // minimal threshold to make tests for diagram renders pass on local
    // macOS: Expected image to match or be a close match to snapshot but was 0.00031509446166699817% different from snapshot
    let failureThreshold = 0.000004;

    const config = this.thresholdConfig.get(fileName);
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
    return { ...defaultImageSnapshotConfig, failureThreshold: failureThreshold, failureThresholdType: 'percent' };
  }
}

export enum BpmnLoadMethod {
  QueryParam = 'query param',
  Url = 'url',
}

export interface TargetedPage {
  name: string;
  queryParams?: string[];
}

export class BpmnDiagramPreparation {
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
  constructor(
    readonly bpmnLoadMethodConfig: Map<string, BpmnLoadMethod>,
    targetedPage: TargetedPage,
    readonly sourceBpmnFolderName: string,
    loadOptions: LoadOptions = { fitType: FitType.HorizontalVertical },
  ) {
    const params = targetedPage.queryParams?.join('&') ?? '';
    this.baseUrl = `http://localhost:10002/${targetedPage.name}.html?fitType=${FitType[loadOptions.fitType]}&${params}`;
  }

  /**
   * @param fileName the name of the BPMN file without extension
   */
  prepareTestResourcesAndGetPageUrl(fileName: string): string {
    let url = this.baseUrl;

    const bpmnLoadMethod = this.getBpmnLoadMethod(fileName);
    log(`Use '${bpmnLoadMethod}' as BPMN Load Method for '${fileName}'`);
    const relPathToBpmnFile = `../fixtures/bpmn/${this.sourceBpmnFolderName}/${fileName}.bpmn`;
    switch (bpmnLoadMethod) {
      case BpmnLoadMethod.QueryParam:
        const bpmnContent = loadBpmnContentForUrlQueryParam(relPathToBpmnFile);
        url += `&bpmn=${bpmnContent}`;
        break;
      case BpmnLoadMethod.Url:
        copyFileSync(relPathToBpmnFile, `../../dist/static/diagrams/`, `${fileName}.bpmn`);
        url += `&url=./static/diagrams/${fileName}.bpmn`;
        break;
    }
    return url;
  }

  private getBpmnLoadMethod(fileName: string): BpmnLoadMethod {
    return this.bpmnLoadMethodConfig.get(fileName) || BpmnLoadMethod.QueryParam;
  }
}

export class PageTester {
  constructor(readonly bpmnDiagramPreparation: BpmnDiagramPreparation, readonly bpmnViewportContainerId: string, readonly expectedPageTitle: string) {}

  async expectBpmnDiagramToBeDisplayed(fileName: string): Promise<ElementHandle<Element>> {
    const url = this.bpmnDiagramPreparation.prepareTestResourcesAndGetPageUrl(fileName);

    const response = await page.goto(url);
    // Uncomment the following in case of http error 400 (probably because of a too large bpmn file)
    // eslint-disable-next-line no-console
    // await page.evaluate(() => console.log(`url is ${location.href}`));
    expect(response.status()).toBe(200);

    const waitForSelectorOptions = { timeout: 5_000 };
    const bpmnViewportElementHandle = await page.waitForSelector(`#${this.bpmnViewportContainerId}`, waitForSelectorOptions);
    await expect(page.title()).resolves.toMatch(this.expectedPageTitle);

    // Prior loading a BPMN diagram, the DOM looks like
    // <div id="viewport" class="graph-container" style="touch-action: none;">
    //   <svg style="left: 0px; top: 0px; width: 100%; height: 100%; display: block; min-width: 1px; min-height: 1px;">
    //     <g>
    //       <g></g>
    //       <g></g>
    //       <g></g>
    //       <g></g>
    //     </g>
    //   </svg>
    // </div>
    //
    // After loading, the DOM looks like
    // <div id="viewport" class="graph-container" style="touch-action: none;">
    //   <svg style="left: 0px; top: 0px; width: 100%; height: 100%; display: block; min-width: 900px; min-height: 181px;">
    //     <g>
    //       <g></g>
    //       <g>
    //         <g style="" class="class-state-cell-style-pool-horizontal=0" data-cell-id="Participant_1">....</g>
    //       </g>
    //       <g></g>
    //       <g></g>
    //     </g>
    //   </svg>
    // </div>
    //
    // In the 2nd 'g' node, children 'g' nodes with the 'data-cell-id' attribute (extra attribute generated by the lib) are only available when the rendering is done
    await page.waitForSelector(`#${this.bpmnViewportContainerId} > svg > g > g > g[data-cell-id]`, waitForSelectorOptions);

    return bpmnViewportElementHandle;
  }
}

export function delay(time: number): Promise<unknown> {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
