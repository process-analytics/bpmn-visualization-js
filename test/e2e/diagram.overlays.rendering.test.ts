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
import { overlayEdgePositionValues, overlayShapePositionValues } from '../helpers/overlays';

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
      [
        'overlays.edges.associations.complex.paths',
        {
          linux: 0.00011, // 0.007011677278323525% / 0.010863716437259363% / 0.0103145588451925%
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

async function addOverlay(bpmnElementId: string, position: OverlayPosition): Promise<void> {
  await page.fill('#bpmn-id-input', bpmnElementId);
  await clickOnButton(position);
}

async function removeAllOverlays(bpmnElementId: string): Promise<void> {
  await page.fill('#bpmn-id-input', bpmnElementId);
  await clickOnButton('clear');
}

const imageSnapshotThresholds = new ImageSnapshotThresholds();
const imageSnapshotConfigurator = new ImageSnapshotConfigurator(imageSnapshotThresholds.getThresholds(), 'overlays', imageSnapshotThresholds.getDefault());

const pageTester = new PageTester({ pageFileName: 'overlays', expectedPageTitle: 'BPMN Visualization - Overlays' });

describe('BPMN Shapes with overlays', () => {
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';

  it.each(overlayShapePositionValues)(`add overlay on StartEvent, Gateway and Task on %s`, async (position: OverlayShapePosition) => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

    await addOverlay('StartEvent_1', position);
    await addOverlay('Activity_1', position);
    await addOverlay('Gateway_1', position);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'add.overlay.on.task.gateway.and.event',
      customSnapshotsDir: buildOverlaySnapshotDir(config, position),
    });
  });

  it(`remove all overlays of Shape`, async () => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

    await addOverlay('Activity_1', 'top-left');
    await addOverlay('Activity_1', 'bottom-left');
    await addOverlay('Activity_1', 'middle-right');

    await removeAllOverlays('Activity_1');

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'remove.all.overlays.of.shape',
    });
  });
});

describe('BPMN Edges with overlays', () => {
  const bpmnDiagramName = 'overlays.edges.associations.complex.paths';

  it.each(overlayEdgePositionValues)(`add overlay on Association on %s`, async (position: OverlayEdgePosition) => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

    await addOverlay('Association_1opueuo', position);
    await addOverlay('Association_0n43f9f', position);
    await addOverlay('Association_01t0kyz', position);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'add.overlay.on.association',
      customSnapshotsDir: buildOverlaySnapshotDir(config, position),
    });
  });

  it(`remove all overlays of Association`, async () => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

    await addOverlay('Association_1opueuo', 'start');
    await addOverlay('Association_1opueuo', 'end');

    await removeAllOverlays('Association_1opueuo');

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'remove.all.overlays.of.association',
    });
  });
});
