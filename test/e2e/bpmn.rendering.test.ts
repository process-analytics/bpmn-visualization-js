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

// TODO use 'jest-image-snapshot' definition types when the lib will be updated
// The type lib does not support setting config for ssim (4.2.0 released on july 2020)
// typescript integration: https://github.com/americanexpress/jest-image-snapshot#usage-in-typescript
//
// inspired from https://medium.com/javascript-in-plain-english/jest-how-to-use-extend-with-typescript-4011582a2217
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchImageSnapshot(imageSnapshotConfig?: ImageSnapshotConfig): R;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ImageSnapshotConfig {}
  }
}

import { copyFileSync, findFiles, loadBpmnContentForUrlQueryParam } from '../helpers/file-helper';
import debugLogger from 'debug';

const log = debugLogger('test');
const graphContainerId = 'viewport';

describe('no visual regression', () => {
  const defaultImageSnapshotConfig = {
    diffDirection: 'vertical',
    dumpDiffToConsole: true, // useful on CI (no need to retrieve the diff image, copy/paste image content from logs)
    // use SSIM to limit false positive
    // https://github.com/americanexpress/jest-image-snapshot#recommendations-when-using-ssim-comparison
    comparisonMethod: 'ssim',
  };

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

  interface ImageSnapshotThresholdConfig {
    linux: number;
    macos: number;
    windows: number;
  }

  /**
   * Configure threshold by bpmn files. When introducing a new test, please don't add threshold until you get failures when running
   * on GitHub Workflow because of discrepancies depending of OS/machine (few pixels) and that are not visible by a human.
   * This is generally only required for diagram containing labels. If you are not testing the labels (value, position, ...) as part of the use case you want to cover, remove labels
   * from the BPMN diagram to avoid such discrepancies.
   */
  const imageSnapshotThresholdConfig = new Map<string, ImageSnapshotThresholdConfig>([
    [
      'labels.01.general', // minimal threshold to make test pass on Github Workflow
      // ubuntu: Expected image to match or be a close match to snapshot but was 0.019162386876825366%
      // macOS: Expected image to match or be a close match to snapshot but was 0.556652966856197%
      // windows: Expected image to match or be a close match to snapshot but was 0.40964885362031467%
      {
        linux: 0.0002,
        macos: 0.006,
        windows: 0.005,
      },
    ],
    [
      'labels.02.position-and-line-breaks',
      // ubuntu:  1 character change: 0.09528559852869378%
      // macOS: Expected image to match or be a close match to snapshot but was 0.766651632718518%
      // windows: Expected image to match or be a close match to snapshot but was 0.6363888273688278%
      {
        linux: 0.0009,
        macos: 0.008,
        windows: 0.007,
      },
    ],
    // ubuntu: Expected image to match or be a close match to snapshot but was 0.19665548561466073%
    // macOS: Expected image to match or be a close match to snapshot but was 0.15006201878846603%
    // windows: Expected image to match or be a close match to snapshot but was 0.12200021675353723%
    [
      'pools.01.labels-and-lanes',
      {
        linux: 0.002,
        macos: 0.0016,
        windows: 0.002,
      },
    ],
    // ubuntu: Expected image to match or be a close match to snapshot but was 0.13132100299135807%
    // macOS: Expected image to match or be a close match to snapshot but was 0.14776609441433664%
    // windows: Expected image to match or be a close match to snapshot but was 0.1182792778311903%
    [
      'pools.02.vertical.with-lanes',
      {
        linux: 0.0014,
        macos: 0.0015,
        windows: 0.002,
      },
    ],
    // ubuntu: Expected image to match or be a close match to snapshot but was 0.0043243364134193385% different from snapshot
    // macOS: Expected image to match or be a close match to snapshot but was 0.07646269456225152% different from snapshot
    // windows: Expected image to match or be a close match to snapshot but was 0.11539494876845469% different from snapshot
    [
      'pools.03.black-box',
      {
        linux: 0.00005,
        macos: 0.0008,
        windows: 0.0012,
      },
    ],
  ]);

  function getImageSnapshotConfig(fileName: string): jest.ImageSnapshotConfig {
    // minimal threshold to make tests for diagram renders pass on local
    // macOS: Expected image to match or be a close match to snapshot but was 0.00031509446166699817% different from snapshot
    let failureThreshold = 0.000003151;

    const config = imageSnapshotThresholdConfig.get(fileName);
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

  enum BpmnLoadMethod {
    QueryParam = 'query param',
    Url = 'url',
  }

  /**
   * Configure how the BPMN file is loaded by the test page.
   *
   * When introducing a new test, there is generally no need to add configuration here as the default is OK. You only need configuration when the file content becomes larger (in
   * that case, the test server returns an HTTP 400 error).
   *
   * Prior adding a config here, review your file to check if it is not too large because it contains too much elements, in particular, some elements not related to what you want to
   * test.
   */
  const bpmnLoadMethodConfig = new Map<string, BpmnLoadMethod>([['events', BpmnLoadMethod.Url]]);

  function getBpmnLoadMethod(fileName: string): BpmnLoadMethod {
    return bpmnLoadMethodConfig.get(fileName) || BpmnLoadMethod.QueryParam;
  }

  function prepareTestResourcesAndGetPageUrl(fileName: string): string {
    let url = 'http://localhost:10002/non-regression.html?fitOnLoad=true';

    const bpmnLoadMethod = getBpmnLoadMethod(fileName);
    log(`Use '${bpmnLoadMethod}' as BPMN Load Method for '${fileName}'`);
    const relPathToBpmnFile = `../fixtures/bpmn/non-regression/${fileName}.bpmn`;
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

  const bpmnFileNames = findFiles('../fixtures/bpmn/non-regression/')
    .filter(filename => {
      return filename.endsWith('.bpmn');
    })
    .map(filename => {
      return filename.split('.').slice(0, -1).join('.');
    });

  it('check bpmn non-regression files availability', () => {
    expect(bpmnFileNames).toContain('gateways');
  });

  it.each(bpmnFileNames)(`%s`, async (fileName: string) => {
    const url = prepareTestResourcesAndGetPageUrl(fileName);

    const response = await page.goto(url);
    // Uncomment the following in case of http error 400 (probably because of a too large bpmn file)
    // eslint-disable-next-line no-console
    // await page.evaluate(() => console.log(`url is ${location.href}`));
    expect(response.status()).toBe(200);

    const waitForSelectorOptions = { timeout: 5_000 };
    await page.waitForSelector(`#${graphContainerId}`, waitForSelectorOptions);
    await expect(page.title()).resolves.toMatch('BPMN Visualization Non Regression');

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
    await page.waitForSelector(`#${graphContainerId} > svg > g > g > g[data-cell-id]`, waitForSelectorOptions);

    const image = await page.screenshot({ fullPage: true });

    expect(image).toMatchImageSnapshot(getImageSnapshotConfig(fileName));
  });
});
