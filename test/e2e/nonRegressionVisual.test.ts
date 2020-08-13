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

import { readFileSync } from '../helpers/file-helper';

const graphContainerId = 'graph';

describe('non regression visual tests', () => {
  // TODO for generalization
  // function that retrieve all files in a dedicated fixtures directory
  //    get the relative path to the file
  //    store everything in an array
  // forEach --> run parametrized test

  // TODO diff output: configure globally --> build/xxx/diff_outpout

  it.each(['events', 'gateways', 'labels', 'tasks'])(`%s`, async (fileName: string) => {
    // TODO we need to escape 'entities' in html to be able to pass the bpmn content in the url parameter
    // if a label contains a linefeed, the graph is blank (ex: the labels bpmn non regression file)
    await page.goto(`http://localhost:10001/index-non-regression.html?fitOnLoad=true&bpmn=${readFileSync(`../fixtures/bpmn/non-regression/${fileName}.bpmn`)}`);
    await page.waitForSelector(`#${graphContainerId}`);
    await expect(page.title()).resolves.toMatch('BPMN Visualization Non Regression');

    const image = await page.screenshot({ fullPage: true });

    // TODO 'customDiffDir' if an environment variable is set (for CI)
    expect(image).toMatchImageSnapshot({
      diffDirection: 'vertical',
      dumpDiffToConsole: true, // useful on CI (no need to retrieve the diff image, copy/paste image content from logs)
      // SSIM configuration, try to avoid false positive
      // https://github.com/americanexpress/jest-image-snapshot#recommendations-when-using-ssim-comparison
      comparisonMethod: 'ssim',
      // TODO probably only needed for the 'labels' diagrams as other are only svg (for labels, we use mxgraph htmlLabels for text wrapping)
      // TODO to restore after testing the impact of 'svg label' (no mxgraph htmlLabels)
      // failureThreshold: 0.01,
      // failureThresholdType: 'percent',
    });
  });
});
