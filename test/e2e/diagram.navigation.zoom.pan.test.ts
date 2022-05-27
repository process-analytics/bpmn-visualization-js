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
import type { Page } from 'playwright';
import type { Point } from './helpers/visu/bpmn-page-utils';
import { PageTester } from './helpers/visu/bpmn-page-utils';
import type { ImageSnapshotThresholdConfig } from './helpers/visu/image-snapshot-config';
import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import { ZoomType } from '../../src/component/options';

class MouseNavigationImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0.0005 / 100, firefox: 0.04 / 100, webkit: 0 });
  }

  // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
  // linux threshold are set for Ubuntu
  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'simple.2.start.events.1.task',
        {
          macos: 0.001 / 100, // 0.0009247488045871499%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'simple.2.start.events.1.task',
        {
          macos: 0.02 / 100, // 0.012644054903632185%
        },
      ],
    ]);
  }
}

const pageTester = new PageTester({ pageFileName: 'diagram-navigation', expectedPageTitle: 'BPMN Visualization - Diagram Navigation', diagramSubfolder: 'navigation' }, <Page>page);
const bpmnDiagramName = 'simple.2.start.events.1.task';

describe('diagram navigation - zoom and pan with mouse', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new MouseNavigationImageSnapshotThresholds(), 'navigation');

  let containerCenter: Point;

  beforeEach(async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);
    containerCenter = await pageTester.getContainerCenter();
  });

  it('mouse panning', async () => {
    await pageTester.mousePanning({ originPoint: containerCenter, destinationPoint: { x: containerCenter.x + 150, y: containerCenter.y + 40 } });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'mouse.panning',
    });
  });

  it.each([ZoomType.In, ZoomType.Out])(`ctrl + mouse: zoom %s`, async (zoomType: ZoomType) => {
    await pageTester.mouseZoom({ x: containerCenter.x + 200, y: containerCenter.y }, zoomType);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: `mouse.zoom.${zoomType}`,
    });
  });

  it.each([3, 5])(`ctrl + mouse: initial scale after zoom in and zoom out [%s times]`, async (xTimes: number) => {
    const zoomPoint = { x: containerCenter.x + 200, y: containerCenter.y };
    await pageTester.mouseZoom(zoomPoint, ZoomType.In, xTimes);
    await pageTester.mouseZoom(zoomPoint, ZoomType.Out, xTimes);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'initial.zoom',
      customDiffDir: join(config.customDiffDir, `mouse-zoom-in-out-${xTimes}-times`),
    });
  });
});

async function doZoomWithButton(zoomType: ZoomType, xTimes = 1): Promise<void> {
  for (let i = 0; i < xTimes; i++) {
    await pageTester.clickOnButton(`zoom-${zoomType}`);
  }
}

describe('diagram navigation - zoom with buttons', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(
    new MultiBrowserImageSnapshotThresholds({
      chromium: 0.03 / 100, // max 0.029310570733620533%
      firefox: 0.03 / 100, // max 0.029286409410644865%
      webkit: 0.034 / 100, // max 0.03302199927066596%
    }),
    'navigation',
  );

  beforeEach(async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);
  });

  it.each([ZoomType.In, ZoomType.Out])(`zoom %s`, async (zoomType: ZoomType) => {
    await doZoomWithButton(zoomType);
    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: `button.zoom.${zoomType}`,
    });
  });

  it.each([3, 5, 20])(`initial scale after zoom in and zoom out [%s times]`, async (xTimes: number) => {
    await doZoomWithButton(ZoomType.In, xTimes);
    await doZoomWithButton(ZoomType.Out, xTimes);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'initial.zoom',
      customDiffDir: join(config.customDiffDir, `button-zoom-in-out-${xTimes}-times`),
    });
  });
});

describe('diagram navigation - zoom with buttons and mouse', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(
    new MultiBrowserImageSnapshotThresholds({
      chromium: 0.03 / 100, // max 0.029310570733620533%
      firefox: 0.03 / 100, // max 0.029286409410644865%
      webkit: 0.035 / 100, // max 0.03302199927066596%
    }),
    'navigation',
  );

  // only test with one Zoom call, otherwise the diff is too large
  // This may be caused by a difference in the container center computation
  // zoom api: mxgraph uses 'this.container.offsetWidth' (https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth)
  // https://github.com/jgraph/mxgraph/blob/v4.2.2/javascript/src/js/view/mxGraph.js#L8071
  // zoom mouse: use 'this.container.getBoundingClientRect()'
  const xTimes = 1;
  // the API zooms at the center of the container, so for identity zoom with mouse, do mouse zoom at the container center
  let containerCenter: Point;

  beforeEach(async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);
    containerCenter = await pageTester.getContainerCenter();
  });

  it.each`
    firstZoom       | secondZoom
    ${ZoomType.Out} | ${ZoomType.In}
    ${ZoomType.In}  | ${ZoomType.Out}
  `('buttons zoom $firstZoom then mouse zoom $secondZoom', async ({ firstZoom, secondZoom }: { firstZoom: ZoomType; secondZoom: ZoomType }) => {
    await doZoomWithButton(firstZoom, xTimes);
    await pageTester.mouseZoom(containerCenter, secondZoom, xTimes);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'initial.zoom',
      customDiffDir: join(config.customDiffDir, `zoom-button-then-mouse-${firstZoom}-then-${secondZoom}`),
    });
  });

  it.each`
    firstZoom       | secondZoom
    ${ZoomType.Out} | ${ZoomType.In}
    ${ZoomType.In}  | ${ZoomType.Out}
  `('mouse zoom $firstZoom then buttons zoom $secondZoom', async ({ firstZoom, secondZoom }: { firstZoom: ZoomType; secondZoom: ZoomType }) => {
    await pageTester.mouseZoom(containerCenter, firstZoom, xTimes);
    await doZoomWithButton(secondZoom, xTimes);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'initial.zoom',
      customDiffDir: join(config.customDiffDir, `zoom-mouse-then-button-${firstZoom}-then-${secondZoom}`),
    });
  });
});
