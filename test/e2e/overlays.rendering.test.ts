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
import { expect, PlaywrightTestArgs, test, Page } from '@playwright/test';
import { ensureIsArray } from '../../src/component/helpers/array-utils';
import { OverlayPosition } from '../../src/component/registry';
import { overlayEdgePositionValues, overlayShapePositionValues } from '../helpers/overlays';
import { clickOnButton, mousePanning, mouseZoom, Point } from './helpers/test-utils';
import { PageTester } from './helpers/visu/bpmn-page-utils';

async function addOverlays(page: Page, bpmnElementIds: string | string[], positions: OverlayPosition | OverlayPosition[]): Promise<void> {
  positions = ensureIsArray<OverlayPosition>(positions);
  for (const bpmnElementId of ensureIsArray<string>(bpmnElementIds)) {
    await page.fill('#bpmn-id-input', bpmnElementId);
    for (const position of positions) {
      await clickOnButton(page, position);
    }
  }
}

async function addStylingOverlay(page: Page, bpmnElementIds: string[], style: string): Promise<void> {
  for (const bpmnElementId of bpmnElementIds) {
    await page.fill('#bpmn-id-input', bpmnElementId);
    await clickOnButton(page, style);
  }
}

async function removeAllOverlays(page: Page, bpmnElementId: string): Promise<void> {
  await page.fill('#bpmn-id-input', bpmnElementId);
  await clickOnButton(page, 'clear');
}

function buildAddSnapshotPath(imageName: string, position?: OverlayPosition): string[] {
  const snapshotPath = ['add.overlay'];
  if (position) {
    snapshotPath.push('on.position', position);
  } else {
    snapshotPath.push('with.custom.style');
  }
  snapshotPath.push(`${imageName}.png`);

  return snapshotPath;
}

function buildRemoveAllSnapshotPath(imageName: string): string[] {
  return ['remove.all.overlays', `${imageName}.png`];
}

function buildNavigationSnapshotPath(imageName: string): string[] {
  return ['navigation', `${imageName}.png`];
}

// to have mouse pointer visible during headless test - add 'showMousePointer: true' as parameter
let pageTester: PageTester;
test.beforeEach(async ({ page }: PlaywrightTestArgs) => {
  pageTester = new PageTester({ pageFileName: 'overlays', expectedPageTitle: 'BPMN Visualization - Overlays' }, page);
});

test.describe('BPMN Shapes with overlays', () => {
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';

  for (const position of overlayShapePositionValues) {
    test(`add overlay on StartEvent, Gateway and Task on ${position}`, async ({ page }: PlaywrightTestArgs) => {
      await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

      await addOverlays(page, ['StartEvent_1', 'Activity_1', 'Gateway_1'], position);

      const image = await page.screenshot({ fullPage: true });
      await expect(image).toMatchSnapshot(buildAddSnapshotPath('on.shape', position));
    });
  }

  test(`remove all overlays of Shape`, async ({ page }: PlaywrightTestArgs) => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

    await addOverlays(page, 'Activity_1', ['top-left', 'bottom-left', 'middle-right']);
    await removeAllOverlays(page, 'Activity_1');

    const image = await page.screenshot({ fullPage: true });
    await expect(image).toMatchSnapshot(buildRemoveAllSnapshotPath('of.shape.png'));
  });
});

test.describe('BPMN Edges with overlays', () => {
  for (const { bpmnDiagramName, edgeKind, bpmnElementIds } of [
    {
      bpmnDiagramName: 'overlays.edges.associations.complex.paths',
      edgeKind: 'association',
      bpmnElementIds: ['Association_1opueuo', 'Association_0n43f9f', 'Association_01t0kyz'],
    },
    {
      bpmnDiagramName: 'overlays.edges.message.flows.complex.paths',
      edgeKind: 'message',
      bpmnElementIds: [
        // incoming and outgoing flows of the 2 pools starting from the right
        'Flow_0skfnol',
        'Flow_0ssridu',
        'Flow_0s4cl7e',
        'Flow_0zz7yh1',
        // flows in the middle of the diagram
        'Flow_0vsaa9d',
        'Flow_17olevz',
        'Flow_0qhtw2k',
        // flows on the right
        'Flow_0mmisr0',
        'Flow_1l8ze06',
      ],
    },
    {
      bpmnDiagramName: 'overlays.edges.sequence.flows.complex.paths',
      edgeKind: 'sequence',
      bpmnElementIds: ['Flow_039xs1c', 'Flow_0m2ldux', 'Flow_1r3oti3', 'Flow_1byeukq'],
    },
  ]) {
    test.describe(`diagram ${bpmnDiagramName}`, () => {
      for (const position of overlayEdgePositionValues) {
        test(`add overlay on ${edgeKind} flow on ${position}`, async ({ page }: PlaywrightTestArgs) => {
          await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

          await addOverlays(page, bpmnElementIds, position);

          const image = await page.screenshot({ fullPage: true });
          await expect(image).toMatchSnapshot(buildAddSnapshotPath(`on.${edgeKind}.flow`, position));
        });
      }

      test(`remove all overlays of ${edgeKind} flow`, async ({ page }: PlaywrightTestArgs) => {
        await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

        const id = bpmnElementIds.shift();
        await addOverlays(page, id, ['start', 'middle', 'end']);
        await removeAllOverlays(page, id);

        const image = await page.screenshot({ fullPage: true });
        await expect(image).toMatchSnapshot(buildRemoveAllSnapshotPath(`of.${edgeKind}.flow`));
      });
    });
  }
});

test.describe('Overlay navigation', () => {
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';
  let containerCenter: Point;

  test.beforeEach(async ({ page }: PlaywrightTestArgs) => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);
    containerCenter = await pageTester.getContainerCenter();

    await addOverlays(page, 'StartEvent_1', 'bottom-center');
    await addOverlays(page, 'Activity_1', 'middle-right');
    await addOverlays(page, 'Gateway_1', 'top-right');
    await addOverlays(page, 'Flow_1', 'start');
  });

  test('panning', async ({ page }: PlaywrightTestArgs) => {
    await mousePanning(page, { originPoint: containerCenter, destinationPoint: { x: containerCenter.x + 150, y: containerCenter.y + 40 } });

    const image = await page.screenshot({ fullPage: true });
    await expect(image).toMatchSnapshot(buildNavigationSnapshotPath('panning'));
  });

  test(`zoom out`, async ({ page }: PlaywrightTestArgs) => {
    await mouseZoom(page, 1, { x: containerCenter.x + 200, y: containerCenter.y }, 100);

    const image = await page.screenshot({ fullPage: true });
    await expect(image).toMatchSnapshot(buildNavigationSnapshotPath('zoom.out'));
  });
});

test.describe('Overlay style', () => {
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';

  for (const style of ['fill', 'font', 'stroke']) {
    test(`add overlay with custom ${style}`, async ({ page }: PlaywrightTestArgs) => {
      await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

      await addStylingOverlay(page, ['StartEvent_1', 'Activity_1', 'Gateway_1', 'Flow_1'], style);

      const image = await page.screenshot({ fullPage: true });
      await expect(image).toMatchSnapshot(buildAddSnapshotPath(style));
    });
  }
});
