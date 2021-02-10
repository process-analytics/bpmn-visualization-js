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
import 'jest-playwright-preset';

import { delay, getTestedBrowserFamily } from './helpers/test-utils';
import { join } from 'path';
import { defaultChromiumFailureThreshold, ImageSnapshotConfigurator, ImageSnapshotThresholdConfig } from './helpers/visu/image-snapshot-config';
import { PageTester } from './helpers/visu/PageTester';

const delayToWaitUntilZoomIsDone = 100;

async function zoom(xTimes: number, deltaX: number): Promise<void> {
  await page.keyboard.down('Control');

  for (let i = 0; i < xTimes; i++) {
    // await page.mouse.wheel({ deltaX: deltaX });
    await chromiumMouseWheel(deltaX);
    // delay here is needed to make the tests pass on MacOS, delay must be greater than debounce timing so it surely gets triggered
    await delay(delayToWaitUntilZoomIsDone);
  }
}

// WIP - workaround for https://github.com/microsoft/playwright/issues/1115
// only works with chromium
// taken from https://github.com/xtermjs/xterm.js/blob/23dba6aebd0d25180716ec45d106c6ac81d16153/test/api/MouseTracking.api.ts#L77
async function chromiumMouseWheel(deltaX: number): Promise<void> {
  // https://github.com/microsoft/playwright/blob/v1.8.0/src/server/input.ts#L171
  const self = page.mouse as any;
  return await self._raw._client.send('Input.dispatchMouseEvent', {
    type: 'mouseWheel',
    x: self._x,
    y: self._y,
    deltaX: deltaX,
    deltaY: 0,
    // deltaX: 0,
    // deltaY: -10,
  });
}
// async function wheelUp(deltaX: number): Promise<void> {
//   const self = page.mouse as any;
//   return await self._raw._client.send('Input.dispatchMouseEvent', {
//     type: 'mouseWheel',
//     x: self._x,
//     y: self._y,
//     deltaX: 0,
//     deltaY: -10,
//   });
// }
// async function wheelDown(deltaX: number): Promise<void> {
//   const self = page.mouse as any;
//   return await self._raw._client.send('Input.dispatchMouseEvent', {
//     type: 'mouseWheel',
//     x: self._x,
//     y: self._y,
//     deltaX: 0,
//     deltaY: 10,
//   });
// }
// END OF - WIP - workaround for https://github.com/microsoft/playwright/issues/1115

describe('diagram navigation', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(
    // if no dedicated information, set minimal threshold to make test pass on Github Workflow on Chromium
    // linux threshold are set for Ubuntu
    new Map<string, ImageSnapshotThresholdConfig>([
      [
        'simple.2.start.events.1.task',
        {
          linux: 0.0000095, // 0.0009247488045871499%
          macos: 0.0000095, // 0.0009247488045871499%
          windows: 0.0000095, // 0.0009247488045871499%
        },
      ],
    ]),
    'navigation',
    defaultChromiumFailureThreshold,
  );

  // to have mouse pointer visible during headless test - add 'showMousePointer: true' as parameter
  const pageTester = new PageTester({ pageFileName: 'rendering-diagram', expectedPageTitle: 'BPMN Visualization - Diagram Rendering' });

  const bpmnDiagramName = 'simple.2.start.events.1.task';
  let containerCenterX: number;
  let containerCenterY: number;
  beforeEach(async () => {
    const bpmnContainerElementHandle = await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);
    const bounding_box = await bpmnContainerElementHandle.boundingBox();
    containerCenterX = bounding_box.x + bounding_box.width / 2;
    containerCenterY = bounding_box.y + bounding_box.height / 2;
  });

  it('mouse panning', async () => {
    // simulate mouse panning
    await page.mouse.move(containerCenterX, containerCenterY);
    await page.mouse.down();
    await page.mouse.move(containerCenterX + 150, containerCenterY + 40);
    await page.mouse.up();

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'mouse.panning',
    });
  });

  // TODO do something like xtermjs to skip test on non chromium browser: https://github.com/xtermjs/xterm.js/commit/7400b888df698d15864ab2c41ad0ed0262f812fb#diff-23460af115aa97331c36c0ce462cbc4dd8067c0ddbca1e9d3de560ebf44024ee
  // TODO restore on Firefox when puppeteer will be able to manage such event
  // Mouse type is not supported: mouseWheel dispatchMouseEvent@chrome://remote/content/domains/parent/Input.jsm:118:13
  if (getTestedBrowserFamily() !== 'chromium') {
    console.warn('Skipping zoom tests because of `Mouse type is not supported: mouseWheel`');
    return;
  }

  it.each(['zoom in', 'zoom out'])(`ctrl + mouse: %s`, async (zoomMode: string) => {
    const deltaX = zoomMode === 'zoom in' ? -100 : 100;
    // simulate mouse+ctrl zoom
    await page.mouse.move(containerCenterX + 200, containerCenterY);
    await zoom(1, deltaX);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: zoomMode === 'zoom in' ? 'mouse.zoom.in' : 'mouse.zoom.out',
    });
  });

  it.each([3, 5])(`ctrl + mouse: initial scale after zoom in and zoom out [%s times]`, async (xTimes: number) => {
    const deltaX = -100;
    // simulate mouse+ctrl zoom
    await page.mouse.move(containerCenterX + 200, containerCenterY);
    await zoom(xTimes, deltaX);
    await zoom(xTimes, -deltaX);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'initial.zoom',
      customDiffDir: join(config.customDiffDir, `${xTimes}-zoom-in-out`),
    });
  });
});
