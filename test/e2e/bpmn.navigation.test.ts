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
import { join } from 'path';
import debugLogger from 'debug';
import { ChromiumBrowserContext } from 'playwright';
import { defaultChromiumFailureThreshold, ImageSnapshotConfigurator, ImageSnapshotThresholdConfig } from './helpers/visu/image-snapshot-config';
import { delay, getTestedBrowserFamily } from './helpers/test-utils';
import { PageTester } from './helpers/visu/PageTester';

const delayToWaitUntilZoomIsDone = 100;

async function chromiumZoom(xTimes: number, x: number, y: number, deltaX: number): Promise<void> {
  for (let i = 0; i < xTimes; i++) {
    await chromiumMouseWheel(x, y, deltaX);
    // delay here is needed to make the tests pass on MacOS, delay must be greater than debounce timing so it surely gets triggered
    await delay(delayToWaitUntilZoomIsDone);
  }
}

// workaround for https://github.com/microsoft/playwright/issues/1115 that only works with chromium
// inspired from https://github.com/microsoft/playwright/issues/2642#issuecomment-647846972
// https://github.com/microsoft/playwright/blob/v1.8.1/docs/src/api/class-cdpsession.md
async function chromiumMouseWheel(x: number, y: number, deltaX: number): Promise<void> {
  // possible improvement to investigate: can we access to the chromium server directly?
  // page._channel Proxy where Target is an EventEmitter
  // server Mouse https://github.com/microsoft/playwright/blob/v1.8.0/src/server/input.ts#L171
  // chromium server RawMouse: https://github.com/microsoft/playwright/blob/v1.8.0/src/server/chromium/crInput.ts#L95
  // RawMouse as a _client field

  // TODO try to find a way to use the same session
  // TODO if no reuse, detach session when done??? or reuse the client?
  const client = await (page.context() as ChromiumBrowserContext).newCDPSession(page);
  // for troubleshooting, see playwright protocol debug logs
  // example when performing panning (set DEBUG=pw:protocol env var)
  await client.send('Input.dispatchMouseEvent', {
    x: x,
    y: y,
    type: 'mouseWheel',
    deltaX: deltaX,
    deltaY: 0,
    modifiers: 2, // CTRL
  });
}

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

  // activate displaying browser console logs
  // this is from https://playwright.dev/docs/api/class-page#pageonconsole
  // see https://github.com/microsoft/playwright/issues/4498 and https://github.com/microsoft/playwright/issues/4125
  const browserLog = debugLogger('bv:e2e:browser');
  page.on('console', msg => browserLog('<%s> %s', msg.type(), msg.text()));

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

  // TODO activate tests relying on mousewheel events on non Chromium browsers when playwright will support it natively: https://github.com/microsoft/playwright/issues/1115
  // inspired from https://github.com/xtermjs/xterm.js/commit/7400b888df698d15864ab2c41ad0ed0262f812fb#diff-23460af115aa97331c36c0ce462cbc4dd8067c0ddbca1e9d3de560ebf44024ee
  // Wheel events are hacked using private API that is only available in Chromium
  const itMouseWheel = getTestedBrowserFamily() === 'chromium' ? it : it.skip;

  itMouseWheel.each(['zoom in', 'zoom out'])(`ctrl + mouse: %s`, async (zoomMode: string) => {
    const deltaX = zoomMode === 'zoom in' ? -100 : 100;
    await chromiumZoom(1, containerCenterX + 200, containerCenterY, deltaX);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: zoomMode === 'zoom in' ? 'mouse.zoom.in' : 'mouse.zoom.out',
    });
  });

  itMouseWheel.each([3, 5])(`ctrl + mouse: initial scale after zoom in and zoom out [%s times]`, async (xTimes: number) => {
    const deltaX = -100;
    // simulate mouse+ctrl zoom
    await page.mouse.move(containerCenterX + 200, containerCenterY);
    await chromiumZoom(xTimes, containerCenterX + 200, containerCenterY, deltaX);
    await chromiumZoom(xTimes, containerCenterX + 200, containerCenterY, -deltaX);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'initial.zoom',
      customDiffDir: join(config.customDiffDir, `${xTimes}-zoom-in-out`),
    });
  });
});
