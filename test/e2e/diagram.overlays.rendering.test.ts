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
import {
  defaultChromiumFailureThreshold,
  ImageSnapshotConfigurator,
  ImageSnapshotThresholdConfig,
  MultiBrowserImageSnapshotThresholds,
} from './helpers/visu/image-snapshot-config';
import { PageTester } from './helpers/visu/PageTester';
import { join } from 'path';
import { OverlayEdgePosition, OverlayPosition, OverlayShapePosition } from '../../build/public/component/registry';
import { clickOnButton } from './helpers/test-utils';
import { MatchImageSnapshotOptions } from 'jest-image-snapshot';
import { ElementHandle } from 'playwright';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: defaultChromiumFailureThreshold, firefox: 0.00011 });
  }

  getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on Github Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'overlays.start.flow.task',
        {
          linux: 0.0023, // 0.2237761571968533%
          macos: 0.0008, // 0.0729159761465925%
          windows: 0.000004,
        },
      ],
    ]);
  }

  getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'overlays.start.flow.task',
        {
          linux: 0.0023, // 0.22444374007244416%
          macos: 0.0025, // 0.24420815130801188%
          windows: 0.007, // 0.6915678561497107%
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
  await bpmnContainerElementHandle.waitForSelector(`svg > g > g:nth-child(3) > g[data-bpmn-id="${bpmnElementId}"]`);
}

describe('BPMN elements with overlays', () => {
  const imageSnapshotThresholds = new ImageSnapshotThresholds();
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(imageSnapshotThresholds.getThresholds(), 'overlay', imageSnapshotThresholds.getDefault());

  const pageTester = new PageTester({ pageFileName: 'rendering-diagram', expectedPageTitle: 'BPMN Visualization - Diagram Rendering' });
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';

  it.each([<OverlayShapePosition>'top-left', <OverlayShapePosition>'top-right', <OverlayShapePosition>'bottom-left', <OverlayShapePosition>'bottom-right'])(
    `add overlay on StartEvent, Gateway and Task on %s`,
    async (position: OverlayShapePosition) => {
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
    },
  );

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
