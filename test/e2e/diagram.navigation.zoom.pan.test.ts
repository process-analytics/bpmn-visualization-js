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
import { mousePanning, mouseZoom, Point } from './helpers/test-utils';
import { PageTester } from './helpers/visu/bpmn-page-utils';

function buildNavigationSnapshotPath(imageName: string): string[] {
  return [imageName, `${imageName}.png`];
}

test.describe.parallel('diagram navigation - zoom and pan', () => {
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
    await expect(image).toMatchSnapshot(buildNavigationSnapshotPath('mouse.panning'));
  });

  for (const zoomMode of ['zoom in', 'zoom out']) {
    test(`ctrl + mouse: ${zoomMode}`, async ({ page }: PlaywrightTestArgs) => {
      const deltaX = zoomMode === 'zoom in' ? -100 : 100;
      await mouseZoom(page, 1, { x: containerCenter.x + 200, y: containerCenter.y }, deltaX);

      const image = await page.screenshot({ fullPage: true });
      const snapshotName = zoomMode === 'zoom in' ? 'mouse.zoom.in' : 'mouse.zoom.out';
      await expect(image).toMatchSnapshot(buildNavigationSnapshotPath(snapshotName));
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
      await expect(image).toMatchSnapshot(buildNavigationSnapshotPath(`${xTimes}.mouse.zoom.in.out`));
    });
  }
});
