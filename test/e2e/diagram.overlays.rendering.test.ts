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
import { ensureIsArray } from '../../src/component/helpers/array-utils';

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
        'overlays.edges.message.flows.complex.paths',
        {
          linux: 0.0002, // 0.012292700871674445%
        },
      ],
      [
        'overlays.edges.associations.complex.paths',
        {
          linux: 0.0003, // 0.02042994297090095% / 0.028687210421007858% / 0.022131767755118048%
        },
      ],
      [
        'overlays.edges.sequence.flows.complex.paths',
        {
          linux: 0.00023, // 0.022730494717471128% / 0.01857098860091888% / 0.010326307039609794%
          macos: 0.0002, // 0.010791806455801023%
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
      [
        'overlays.edges.message.flows.complex.paths',
        {
          linux: 0.0032, // 0.31451721857130854%
        },
      ],
      [
        'overlays.edges.sequence.flows.complex.paths',
        {
          linux: 0.0014, // 0.08228072459832703% / 0.13226428690803482% / 0.05865724301086228%
          windows: 0.0024, // 0.23601194547107074%
          macos: 0.0026, // 0.25655896127774197%
        },
      ],
    ]);
  }
}

function buildOverlaySnapshotDir(config: MatchImageSnapshotOptions, position: OverlayPosition): string {
  return join(config.customSnapshotsDir, `on-position-${position}`);
}

function buildOverlayDiffDir(config: MatchImageSnapshotOptions, position: OverlayPosition): string {
  return join(config.customDiffDir, `on-position-${position}`);
}

async function addOverlays(bpmnElementIds: string | string[], positions: OverlayPosition | OverlayPosition[]): Promise<void> {
  positions = ensureIsArray<OverlayPosition>(positions);
  for (const bpmnElementId of ensureIsArray<string>(bpmnElementIds)) {
    await page.fill('#bpmn-id-input', bpmnElementId);
    for (const position of positions) {
      await clickOnButton(position);
    }
  }
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

    await addOverlays(['StartEvent_1', 'Activity_1', 'Gateway_1'], position);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'add.overlay.on.task.gateway.and.event',
      customSnapshotsDir: buildOverlaySnapshotDir(config, position),
      customDiffDir: buildOverlayDiffDir(config, position),
    });
  });

  it(`remove all overlays of Shape`, async () => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

    await addOverlays('Activity_1', ['top-left', 'bottom-left', 'middle-right']);

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
  const bpmnDiagramNameAssociations = 'overlays.edges.associations.complex.paths';
  const bpmnDiagramNameMessageFlows = 'overlays.edges.message.flows.complex.paths';
  const bpmnDiagramNameSequenceFlows = 'overlays.edges.sequence.flows.complex.paths';
  function getEdgeKindAndIds(bpmnDiagramName: string): [string, string[]] {
    let edgeKind: string;
    let ids: string[];
    switch (bpmnDiagramName) {
      case bpmnDiagramNameAssociations:
        edgeKind = 'association';
        ids = ['Association_1opueuo', 'Association_0n43f9f', 'Association_01t0kyz'];
        break;
      case bpmnDiagramNameSequenceFlows:
        edgeKind = 'sequence';
        ids = ['Flow_039xs1c', 'Flow_0m2ldux', 'Flow_1r3oti3', 'Flow_1byeukq'];
        break;
      case bpmnDiagramNameMessageFlows:
        edgeKind = 'message';
        ids = [
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
        ];
        break;
    }
    return [edgeKind, ids];
  }
  describe.each([bpmnDiagramNameSequenceFlows, bpmnDiagramNameAssociations, bpmnDiagramNameMessageFlows])('diagram %s', (bpmnDiagramName: string) => {
    const [edgeKind, ids] = getEdgeKindAndIds(bpmnDiagramName);
    it.each(overlayEdgePositionValues)(`add overlay on ${edgeKind} flow on %s`, async (position: OverlayEdgePosition) => {
      await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

      await addOverlays(ids, position);

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot({
        ...config,
        customSnapshotIdentifier: `add.overlay.on.${edgeKind}.flow`,
        customSnapshotsDir: buildOverlaySnapshotDir(config, position),
        customDiffDir: buildOverlayDiffDir(config, position),
      });
    });

    it(`remove all overlays of ${edgeKind} flow`, async () => {
      await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

      const id = ids.shift();
      await addOverlays(id, ['start', 'middle', 'end']);

      await removeAllOverlays(id);

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot({
        ...config,
        customSnapshotIdentifier: `remove.all.overlays.of.${edgeKind}.flow`,
      });
    });
  });
});
