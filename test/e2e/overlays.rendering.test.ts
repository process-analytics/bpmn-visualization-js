/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import 'jest-playwright-preset';
import type { ImageSnapshotThresholdConfig } from './helpers/visu/image-snapshot-config';
import type { OverlayEdgePosition, OverlayPosition, OverlayShapePosition } from '@lib/component/registry';
import type { Point } from '@test/shared/visu/bpmn-page-utils';

import path from 'node:path';

import debugLogger from 'debug';

import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds, withCustomOutputDirectory } from './helpers/visu/image-snapshot-config';

import { ensureIsArray } from '@lib/component/helpers/array-utils';
import { ZoomType } from '@lib/component/options';
import { overlayEdgePositionValues, overlayShapePositionValues } from '@test/shared/overlays';
import { AvailableTestPages, PageTester } from '@test/shared/visu/bpmn-page-utils';

const log = debugLogger('bv:test:e2e:overlays');

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0.17 / 100, firefox: 0.44 / 100, webkit: 0.59 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'overlays.edges.associations.complex.paths',
        {
          linux: 0.31 / 100, // max 0.30203253615374015%
          macos: 0.31 / 100, // max 0.3006830880479039%
          windows: 0.31 / 100, // max 0.3013649459581602%
        },
      ],
      [
        'overlays.edges.message.flows.complex.paths',
        {
          linux: 0.18 / 100, // max 0.17328979983225468%
          macos: 0.39 / 100, // max 0.38845092259515157%
          windows: 0.2 / 100, // max 0.1989755797400572%
        },
      ],
      [
        'overlays.edges.sequence.flows.complex.paths',
        {
          linux: 0.24 / 100, // max 0.2311919361290271%
          macos: 0.24 / 100, // max 0.23432430740331073%
          windows: 0.24 / 100, // max 0.23406440064434042%
        },
      ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'overlays.start.flow.task.gateway',
        {
          macos: 1 / 100, // max 0.988038212529263%
        },
      ],
      [
        'overlays.edges.associations.complex.paths',
        {
          macos: 0.69 / 100, // max 0.6860492031835808%
        },
      ],
      [
        'overlays.edges.message.flows.complex.paths',
        {
          linux: 0.71 / 100, // 0.7075048726484345%
          macos: 0.72 / 100, // 0.7142164089951275%
          windows: 0.73 / 100, // 0.7201733271427924%
        },
      ],
      [
        'overlays.edges.sequence.flows.complex.paths',
        {
          macos: 0.51 / 100, // max 0.5010509935943763%
        },
      ],
    ]);
  }
}

const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new ImageSnapshotThresholds(), 'overlays');

class OverlaysPageTester extends PageTester {
  async addOverlays(bpmnElementIds: string | string[], positions: OverlayPosition | OverlayPosition[]): Promise<void> {
    positions = ensureIsArray<OverlayPosition>(positions);
    for (const bpmnElementId of ensureIsArray<string>(bpmnElementIds)) {
      await this.setBpmnElementId(bpmnElementId);
      for (const position of positions) {
        await this.clickOnButton(position);
      }
    }
  }

  async addStylingOverlay(bpmnElementIds: string[], style: string): Promise<void> {
    for (const bpmnElementId of bpmnElementIds) {
      await this.setBpmnElementId(bpmnElementId);
      await this.clickOnButton(style);
    }
  }

  async removeAllOverlays(bpmnElementId: string): Promise<void> {
    await this.setBpmnElementId(bpmnElementId);
    await this.clickOnButton('clear');
  }

  private async setBpmnElementId(id: string): Promise<void> {
    await this.page.fill('#bpmn-id-input', id);
  }
}

const pageTester = new OverlaysPageTester({ targetedPage: AvailableTestPages.OVERLAYS, diagramSubfolder: 'overlays' }, page);

function getEdgeDirectory(directory: string): string {
  return path.join(directory, `on.edge`);
}

function getEdgePositionDirectory(directory: string, position: OverlayEdgePosition): string {
  return path.join(getEdgeDirectory(directory), `on-position-${position}`);
}

function getShapeDirectory(directory: string): string {
  return path.join(directory, `on.shape`);
}

describe('BPMN Shapes with overlays', () => {
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';

  it.each(overlayShapePositionValues)(`add overlay on StartEvent, Gateway and Task on %s`, async (position: OverlayShapePosition) => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

    await pageTester.addOverlays(['StartEvent_1', 'Activity_1', 'Gateway_1'], position);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(
      withCustomOutputDirectory(
        {
          ...config,
          customSnapshotIdentifier: `add.overlay.on.position.${position}`,
          customSnapshotsDir: getShapeDirectory(config.customSnapshotsDir),
        },
        getShapeDirectory(config.customDiffDir),
      ),
    );
  });

  it(`remove all overlays of Shape`, async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

    await pageTester.addOverlays('Activity_1', ['top-left', 'bottom-left', 'middle-right']);
    await pageTester.removeAllOverlays('Activity_1');

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(
      withCustomOutputDirectory(
        {
          ...config,
          customSnapshotIdentifier: 'remove.all.overlays.of.shape',
          customSnapshotsDir: getShapeDirectory(config.customSnapshotsDir),
        },
        getShapeDirectory(config.customDiffDir),
      ),
    );
  });
});

describe('BPMN Edges with overlays', () => {
  describe.each([
    ['overlays.edges.associations.complex.paths', 'association', ['Association_1opueuo', 'Association_0n43f9f', 'Association_01t0kyz']],
    [
      'overlays.edges.message.flows.complex.paths',
      'message',
      [
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
    ],
    ['overlays.edges.sequence.flows.complex.paths', 'sequence', ['Flow_039xs1c', 'Flow_0m2ldux', 'Flow_1r3oti3', 'Flow_1byeukq']],
  ])('diagram %s', (bpmnDiagramName: string, edgeKind: string, bpmnElementIds: string[]) => {
    it.each(overlayEdgePositionValues)(`add overlay on ${edgeKind} flow on %s`, async (position: OverlayEdgePosition) => {
      await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

      await pageTester.addOverlays(bpmnElementIds, position);

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot(
        withCustomOutputDirectory(
          {
            ...config,
            customSnapshotIdentifier: `add.overlay.on.${edgeKind}.flow`,
            customSnapshotsDir: getEdgePositionDirectory(config.customSnapshotsDir, position),
          },
          getEdgePositionDirectory(config.customDiffDir, position),
        ),
      );
    });

    it(`remove all overlays of ${edgeKind} flow`, async () => {
      await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

      const id = bpmnElementIds.shift();
      await pageTester.addOverlays(id, ['start', 'middle', 'end']);
      await pageTester.removeAllOverlays(id);

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot(
        withCustomOutputDirectory(
          {
            ...config,
            customSnapshotIdentifier: `remove.all.overlays.of.${edgeKind}.flow`,
            customSnapshotsDir: getEdgeDirectory(config.customSnapshotsDir),
          },
          getEdgeDirectory(config.customDiffDir),
        ),
      );
    });
  });
});

describe('Overlay navigation', () => {
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';
  let containerCenter: Point;

  class OverlayNavigationImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
    constructor() {
      // don't set defaults as we defined thresholds for all style variants
      super({ chromium: 0.12 / 100, firefox: 0.23 / 100, webkit: 0.36 / 100 });
    }

    protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        [
          'overlays.start.flow.task.gateway',
          {
            macos: 0.9 / 100, // max 0.8524820644063569%
          },
        ],
      ]);
    }
  }

  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new OverlayNavigationImageSnapshotThresholds(), 'overlays');

  beforeEach(async () => {
    log("Start test: '%s' (test file path: '%s')", expect.getState().currentTestName, expect.getState().testPath);
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);
    containerCenter = await pageTester.getContainerCenter();

    log('Adding overlays');
    await pageTester.addOverlays('StartEvent_1', 'bottom-center');
    await pageTester.addOverlays('Activity_1', 'middle-right');
    await pageTester.addOverlays('Gateway_1', 'top-right');
    await pageTester.addOverlays('Flow_1', 'start');
    log('Overlays added');
  });

  afterEach(() => {
    log("End test: '%s' (test file path: '%s')", expect.getState().currentTestName, expect.getState().testPath);
  });

  it('panning', async () => {
    log('Starting mouse panning checks');
    log('Doing mouse panning');
    await pageTester.mousePanning({ originPoint: containerCenter, destinationPoint: { x: containerCenter.x + 150, y: containerCenter.y + 40 } });
    log('Mouse panning done');

    log('Checking image match');
    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'panning',
    });
    log('Image match OK');
  });

  it(`zoom out`, async () => {
    await pageTester.mouseZoom({ x: containerCenter.x + 200, y: containerCenter.y }, ZoomType.Out);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'zoom.out',
    });
  });
});

describe('Overlay style', () => {
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';
  const snapshotPath = 'with.custom.style';

  // Configure thresholds by types of overlay styles - we use the same bpmn diagram in all tests
  class OverlayStylesImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
    constructor() {
      // don't set defaults as we defined thresholds for all style variants
      super({ chromium: 0.03 / 100, firefox: 0.38 / 100, webkit: 0.33 / 100 });
    }

    protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      // if no dedicated information, set minimal threshold to make test pass on Github Workflow
      // linux threshold are set for Ubuntu
      return new Map<string, ImageSnapshotThresholdConfig>([
        [
          'fill',
          {
            linux: 0.13 / 100, // 0.12108823641220345%%
            macos: 0.15 / 100, // 0.14612951118292417%
            windows: 0.15 / 100, // 0.14250607890964326%
          },
        ],
        [
          'font',
          {
            macos: 0.56 / 100, // 0.5500536579274629%
            windows: 0.33 / 100, // 0.3231773603294519%
          },
        ],
        [
          'stroke',
          {
            linux: 0.04 / 100, // 0.03319006305509964%
            macos: 0.22 / 100, // 0.21534933042920423%
            windows: 0.24 / 100, // 0.23679453599644296%
          },
        ],
      ]);
    }

    protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        [
          'font',
          {
            linux: 0.7 / 100, // 0.6957363425958542%
            // TODO very large threshold on Firefox macOS for font overlay styles
            macos: 3 / 100, // 2.846090750730257%
          },
        ],
        [
          'fill',
          {
            macos: 0.6 / 100, // 0.409246460963808%
          },
        ],
      ]);
    }

    protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        [
          'font',
          {
            macos: 1.24 / 100, // 1.2343878983440026%
          },
        ],
      ]);
    }
  }

  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new OverlayStylesImageSnapshotThresholds(), 'overlays');

  it.each(['fill', 'font', 'stroke'])(`add overlay with custom %s`, async (style: string) => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

    await pageTester.addStylingOverlay(['StartEvent_1', 'Activity_1', 'Gateway_1', 'Flow_1'], style);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(style);
    expect(image).toMatchImageSnapshot(
      withCustomOutputDirectory(
        {
          ...config,
          customSnapshotIdentifier: `add.overlay.with.custom.${style}`,
          customSnapshotsDir: path.join(config.customSnapshotsDir, snapshotPath),
        },
        path.join(config.customDiffDir, snapshotPath),
      ),
    );
  });
});
