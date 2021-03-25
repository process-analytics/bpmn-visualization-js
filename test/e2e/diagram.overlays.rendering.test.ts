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
import { ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import { PageTester } from './helpers/visu/PageTester';
import { join } from 'path';
import { OverlayEdgePosition, OverlayPosition, OverlayShapePosition } from '../../build/public/component/registry';
import { clickOnButton } from './helpers/test-utils';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { ElementHandle } from 'playwright';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0.000005, firefox: 0.0004 });
  }

  getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on Github Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'overlays.start.flow.task.gateway',
        {
          linux: 0.001, // 0.09368089665046096%
          windows: 0.0003, // 0.025623788967854555%
        },
      ],
    ]);
  }

  getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'overlays.start.flow.task.gateway',
        {
          linux: 0.0053, // 0.5229417116423329%
          macos: 0.0061, // 0.6026399523082704%
        },
      ],
    ]);
  }
}

function buildOverlaySnapshotDir(config: MatchImageSnapshotOptions, position: OverlayPosition): string {
  return join(config.customSnapshotsDir, `on-position-${position}`);
}

async function addOverlay(bpmnContainerElementHandle: ElementHandle<Element>, bpmnElementId: string, position: OverlayPosition): Promise<void> {
  await page.fill('#bpmn-id-input', bpmnElementId);
  await clickOnButton(position);
}

describe('BPMN elements with overlays', () => {
  const imageSnapshotThresholds = new ImageSnapshotThresholds();
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(imageSnapshotThresholds.getThresholds(), 'overlays', imageSnapshotThresholds.getDefault());

  const pageTester = new PageTester({ pageFileName: 'overlays', expectedPageTitle: 'BPMN Visualization - Overlays' });
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';

  it.each([
    <OverlayShapePosition>'top-left',
    <OverlayShapePosition>'top-center',
    <OverlayShapePosition>'top-right',
    <OverlayShapePosition>'bottom-left',
    <OverlayShapePosition>'bottom-center',
    <OverlayShapePosition>'bottom-right',
    <OverlayShapePosition>'middle-left',
    <OverlayShapePosition>'middle-right',
  ])(`add overlay on StartEvent, Gateway and Task on %s`, async (position: OverlayShapePosition) => {
    const bpmnContainerElementHandle = await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

    await addOverlay(bpmnContainerElementHandle, 'StartEvent_1', position);
    await addOverlay(bpmnContainerElementHandle, 'Activity_1', position);
    await addOverlay(bpmnContainerElementHandle, 'Gateway_1', position);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'add.overlay.on.task.gateway.and.event',
      customSnapshotsDir: buildOverlaySnapshotDir(config, position),
    });
  });

  // TODO tests will be added with https://github.com/process-analytics/bpmn-visualization-js/issues/1166
  it.skip.each([<OverlayEdgePosition>'start', <OverlayEdgePosition>'middle', <OverlayEdgePosition>'end'])(
    `add overlay on SequenceFlow on %s`,
    async (position: OverlayEdgePosition) => {
      const bpmnContainerElementHandle = await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

      await addOverlay(bpmnContainerElementHandle, 'Flow_1', position);

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot({
        ...config,
        customSnapshotIdentifier: 'add.overlay.on.sequence.flow',
        customSnapshotsDir: buildOverlaySnapshotDir(config, position),
      });
    },
  );
});
