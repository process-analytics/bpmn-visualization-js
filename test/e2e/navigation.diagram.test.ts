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
import { BpmnDiagramPreparation, ImageSnapshotConfigurator } from './helpers/visu-utils';

const graphContainerId = 'bpmn-viewport';

describe('mouse panning', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new Map());

  // to have mouse pointer visible during headless test - add 'showMousePointer=true' in queryParams
  const bpmnDiagramPreparation = new BpmnDiagramPreparation(new Map(), { page: 'navigation-diagram', queryParams: [] });

  it.each(['gateways'])(`%s`, async (fileName: string) => {
    const url = bpmnDiagramPreparation.prepareTestResourcesAndGetPageUrl(fileName);

    const response = await page.goto(url);
    // Uncomment the following in case of http error 400 (probably because of a too large bpmn file)
    // eslint-disable-next-line no-console
    // await page.evaluate(() => console.log(`url is ${location.href}`));
    expect(response.status()).toBe(200);

    const waitForSelectorOptions = { timeout: 5_000 };
    const elementElementHandle = await page.waitForSelector(`#${graphContainerId}`, waitForSelectorOptions);
    await expect(page.title()).resolves.toMatch('BPMN Visualization - Diagram Navigation');

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

    const bounding_box = await elementElementHandle.boundingBox();

    const moveThreshold = 30;
    await page.mouse.move(bounding_box.x + bounding_box.width / 2, bounding_box.y + bounding_box.height / 2);
    await page.mouse.down();
    await page.mouse.move(bounding_box.x + bounding_box.width / 2 + moveThreshold, bounding_box.y + bounding_box.height / 2 + moveThreshold);
    await page.mouse.up();

    const image = await page.screenshot({ fullPage: true });

    expect(image).toMatchImageSnapshot(imageSnapshotConfigurator.getImageSnapshotConfig(fileName));
  });
});
