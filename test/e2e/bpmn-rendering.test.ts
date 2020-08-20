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

import { encodeUriXml, findFiles, linearizeXml, readFileSync } from '../helpers/file-helper';
// import debug from 'debug';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('test');

const graphContainerId = 'graph';

describe('no visual regression', () => {
  const defaultImageSnapshotConfig = {
    diffDirection: 'vertical',
    dumpDiffToConsole: true, // useful on CI (no need to retrieve the diff image, copy/paste image content from logs)
    // use SSIM to limit false positive
    // https://github.com/americanexpress/jest-image-snapshot#recommendations-when-using-ssim-comparison
    comparisonMethod: 'ssim',
  };

  function log(msg: string): void {
    debug(msg);
  }

  function getSimplePlatformName(): string {
    const platform = process.platform;
    debug(`This platform is ${platform}`);

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
      // ubuntu: Expected image to match or be a close match to snapshot but was 0.00036826842172432706%
      // macOS: Expected image to match or be a close match to snapshot but was 0.556652966856197%
      // windows: Expected image to match or be a close match to snapshot but was 0.40964885362031467%
      {
        linux: 0.00005,
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
    // ubuntu: 1 character change: 0.09905211491884058%%
    // macOS: ok with 0.0009 threshold
    // windows: Expected image to match or be a close match to snapshot but was 0.12200021675353723%
    [
      'pools.01.labels-and-lanes',
      {
        linux: 0.0009,
        macos: 0.0009,
        windows: 0.002,
      },
    ],
    // ubuntu: 1 character change: 0.015598049599618857%
    // macOS: Expected image to match or be a close match to snapshot but was 0.06612609365773682%
    // windows: Expected image to match or be a close match to snapshot but was 0.1182792778311903%
    [
      'pools.02.vertical',
      {
        linux: 0.0001,
        macos: 0.0007,
        windows: 0.002,
      },
    ],
  ]);

  function getImageSnapshotConfig(fileName: string): jest.ImageSnapshotConfig {
    const config = imageSnapshotThresholdConfig.get(fileName);
    if (config) {
      log(`Building dedicated image snapshot configuration for '${fileName}'`);
      const simplePlatformName = getSimplePlatformName();
      log(`Simple platform name: ${simplePlatformName}`);
      // we know here that we have property names related to the 'simple platform name' so ignoring TS complains.
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const failureThreshold = config[simplePlatformName];
      log(`ImageSnapshot - using failureThreshold: ${failureThreshold}`);
      return { ...defaultImageSnapshotConfig, failureThreshold: failureThreshold, failureThresholdType: 'percent' };
    }

    return defaultImageSnapshotConfig;
  }

  function bpmnContentForTestPage(fileName: string): string {
    log(`Preparing bpmn content for test '${fileName}'`);
    let rawBpmn = readFileSync(`../fixtures/bpmn/non-regression/${fileName}.bpmn`);
    log(`Original bpmn length: ${rawBpmn.length}`);

    rawBpmn = linearizeXml(rawBpmn);
    log(`bpmn length after linearize: ${rawBpmn.length}`);

    const uriEncodedBpmn = encodeUriXml(rawBpmn);
    log(`bpmn length in URI encoded form: ${uriEncodedBpmn.length}`);
    return uriEncodedBpmn;
  }

  const bpmnFiles = findFiles('../fixtures/bpmn/non-regression/');

  it('check bpmn non-regression files availability', () => {
    expect(bpmnFiles).toContain('gateways.bpmn');
  });

  const bpmnFileNames = bpmnFiles
    .filter(filename => {
      return filename.endsWith('.bpmn');
    })
    .map(filename => {
      return filename.split('.').slice(0, -1).join('.');
    });
  it.each(bpmnFileNames)(`%s`, async (fileName: string) => {
    const url = `http://localhost:10001/index-non-regression.html?fitOnLoad=true&bpmn=${bpmnContentForTestPage(fileName)}`;
    const response = await page.goto(url);
    // Uncomment the following in case of http error 400
    // eslint-disable-next-line no-console
    // await page.evaluate(() => console.log(`url is ${location.href}`));
    expect(response.status()).toBe(200);

    await page.waitForSelector(`#${graphContainerId}`, { timeout: 5_000 });
    await expect(page.title()).resolves.toMatch('BPMN Visualization Non Regression');

    const image = await page.screenshot({ fullPage: true });

    expect(image).toMatchImageSnapshot(getImageSnapshotConfig(fileName));
  });
});
