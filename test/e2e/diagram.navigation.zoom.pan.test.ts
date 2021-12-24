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
import { expect, PlaywrightTestArgs, test } from '@playwright/test';
import { join } from 'path';
import { mousePanning, mouseZoom, Point } from './helpers/test-utils';
import { PageTester } from './helpers/visu/bpmn-page-utils';
import { ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0.000005, firefox: 0.0004, webkit: 0 });
  }

  // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
  // linux threshold are set for Ubuntu
  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'simple.2.start.events.1.task',
        {
          macos: 0.00001, // 0.0009247488045871499%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'simple.2.start.events.1.task',
        {
          macos: 0.0002, // 0.012644054903632185%
        },
      ],
    ]);
  }
}

test.describe('diagram navigation - zoom and pan', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new ImageSnapshotThresholds(), 'navigation');

  const bpmnDiagramName = 'simple.2.start.events.1.task';

  // to have mouse pointer visible during headless test - add 'showMousePointer: true' as parameter
  let pageTester: PageTester;
  let containerCenter: Point;

  test.beforeEach(async ({ page }: PlaywrightTestArgs) => {
    pageTester = new PageTester({ pageFileName: 'diagram-navigation', expectedPageTitle: 'BPMN Visualization - Diagram Navigation' }, page);
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);
    containerCenter = await pageTester.getContainerCenter();
  });

  test('mouse panning', async ({ page }: PlaywrightTestArgs) => {
    await mousePanning(page, { originPoint: containerCenter, destinationPoint: { x: containerCenter.x + 150, y: containerCenter.y + 40 } });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'mouse.panning',
    });
  });

  for (const zoomMode of ['zoom in', 'zoom out']) {
    test(`ctrl + mouse: ${zoomMode}`, async ({ page }: PlaywrightTestArgs) => {
      const deltaX = zoomMode === 'zoom in' ? -100 : 100;
      await mouseZoom(page, 1, { x: containerCenter.x + 200, y: containerCenter.y }, deltaX);

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot({
        ...config,
        customSnapshotIdentifier: zoomMode === 'zoom in' ? 'mouse.zoom.in' : 'mouse.zoom.out',
      });
    });
  }

  for (const xTimes of [3, 5]) {
    test(`ctrl + mouse: initial scale after zoom in and zoom out [${xTimes} times]`, async ({ page }: PlaywrightTestArgs) => {
      const deltaX = -100;
      // simulate mouse+ctrl zoom
      await page.mouse.move(containerCenter.x + 200, containerCenter.y);
      await mouseZoom(page, xTimes, { x: containerCenter.x + 200, y: containerCenter.y }, deltaX);
      await mouseZoom(page, xTimes, { x: containerCenter.x + 200, y: containerCenter.y }, -deltaX);

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot({
        ...config,
        customSnapshotIdentifier: 'initial.zoom',
        customDiffDir: join(config.customDiffDir, `${xTimes}-zoom-in-out`),
      });
    });
  }
});
