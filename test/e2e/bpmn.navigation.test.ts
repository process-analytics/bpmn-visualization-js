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
import { BpmnDiagramPreparation, delay, ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, PageTester } from './helpers/visu-utils';

describe('diagram navigation', () => {
  const delayToWaitUntilZoomIsDone = 100;
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(
    new Map<string, ImageSnapshotThresholdConfig>([
      [
        'simple-2_start_events-1_task',
        // minimal threshold to make test pass on Github Workflow
        // ubuntu: Expected image to match or be a close match to snapshot but was 0.0009247488045871499% different from snapshot
        // macOS: Expected image to match or be a close match to snapshot but was 0.0009247488045871499% different from snapshot
        // windows: Expected image to match or be a close match to snapshot but was 0.0009247488045871499% different from snapshot
        {
          linux: 0.0000095,
          macos: 0.0000095,
          windows: 0.0000095,
        },
      ],
    ]),
  );

  // to have mouse pointer visible during headless test - add 'showMousePointer=true' to queryParams
  const bpmnDiagramPreparation = new BpmnDiagramPreparation(new Map(), { name: 'rendering-diagram', queryParams: [] }, 'navigation');

  const pageTester = new PageTester(bpmnDiagramPreparation, 'bpmn-container', 'BPMN Visualization - Diagram Rendering');

  const fileName = 'simple-2_start_events-1_task';
  let viewportCenterX: number;
  let viewportCenterY: number;
  beforeEach(async () => {
    const bpmnViewportElementHandle = await pageTester.expectBpmnDiagramToBeDisplayed(fileName);
    const bounding_box = await bpmnViewportElementHandle.boundingBox();
    viewportCenterX = bounding_box.x + bounding_box.width / 2;
    viewportCenterY = bounding_box.y + bounding_box.height / 2;
  });

  it('mouse panning', async () => {
    // simulate mouse panning
    await page.mouse.move(viewportCenterX, viewportCenterY);
    await page.mouse.down();
    await page.mouse.move(viewportCenterX + 150, viewportCenterY + 40);
    await page.mouse.up();

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot(imageSnapshotConfigurator.getConfig(fileName));
  });

  it.each(['zoom in', 'zoom out'])(`ctrl + mouse: %s`, async (zoom: string) => {
    const deltaX = zoom === 'zoom in' ? -100 : 100;
    // simulate mouse+ctrl zoom
    await page.mouse.move(viewportCenterX + 200, viewportCenterY);
    await page.keyboard.down('Control');
    await page.mouse.wheel({ deltaX: deltaX });
    await delay(delayToWaitUntilZoomIsDone);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot(imageSnapshotConfigurator.getConfig(fileName));
  });

  // TODO Set customSnapshotIdentifier & customDiffDir to use the same snapshot like don in diagram rendering test
  it.each([3, 5])(`ctrl + mouse: initial scale after zoom in and zoom out [%s times]`, async (xTimes: number) => {
    const deltaX = -100;
    // simulate mouse+ctrl zoom
    await page.mouse.move(viewportCenterX + 200, viewportCenterY);
    await page.keyboard.down('Control');
    for (let i = 0; i < xTimes; i++) {
      await page.mouse.wheel({ deltaX: deltaX });
      // delay here is needed to make the tests pass on MacOS, delay must be greater than debounce timing so it surely gets triggered
      await delay(delayToWaitUntilZoomIsDone);
    }
    await delay(delayToWaitUntilZoomIsDone);
    for (let i = 0; i < xTimes; i++) {
      await page.mouse.wheel({ deltaX: -deltaX });
      // delay here is needed to make the tests pass on MacOS, delay must be greater than debounce timing so it surely gets triggered
      await delay(delayToWaitUntilZoomIsDone);
    }
    await delay(delayToWaitUntilZoomIsDone);
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot(imageSnapshotConfigurator.getConfig(fileName));
  });
});
