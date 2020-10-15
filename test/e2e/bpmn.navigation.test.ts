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
import { BpmnDiagramPreparation, ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, PageTester } from './helpers/visu-utils';

describe('diagram navigation', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(
    new Map<string, ImageSnapshotThresholdConfig>([
      [
        'simple-2_start_events-1_task',
        // minimal threshold to make test pass on Github Workflow
        // ubuntu:
        // macOS: Expected image to match or be a close match to snapshot but was 0.0008357925673774247%
        // windows:
        {
          linux: 0.000004,
          macos: 0.000009,
          windows: 0.000004,
        },
      ],
    ]),
  );

  // to have mouse pointer visible during headless test - add 'showMousePointer=true' to queryParams
  const bpmnDiagramPreparation = new BpmnDiagramPreparation(new Map(), { name: 'navigation-diagram', queryParams: [] }, 'navigation');

  const pageTester = new PageTester(bpmnDiagramPreparation, 'bpmn-viewport', 'BPMN Visualization - Diagram Navigation');

  it('mouse panning', async () => {
    const fileName = 'simple-2_start_events-1_task';
    const bpmnViewportElementHandle = await pageTester.expectBpmnDiagramToBeDisplayed(fileName);

    const bounding_box = await bpmnViewportElementHandle.boundingBox();

    // simulate mouse panning
    const viewportCenterX = bounding_box.x + bounding_box.width / 2;
    const viewportCenterY = bounding_box.y + bounding_box.height / 2;
    await page.mouse.move(viewportCenterX, viewportCenterY);
    await page.mouse.down();
    await page.mouse.move(viewportCenterX + 150, viewportCenterY + 40);
    await page.mouse.up();

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot(imageSnapshotConfigurator.getConfig(fileName));
  });
});
