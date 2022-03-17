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
import { ensureIsArray } from '../../src/component/helpers/array-utils';
import type { OverlayEdgePosition, OverlayPosition, OverlayShapePosition } from '../../src/component/registry';
import { overlayEdgePositionValues, overlayShapePositionValues } from '../helpers/overlays';
import type { Point } from './helpers/visu/bpmn-page-utils';
import { PageTester } from './helpers/visu/bpmn-page-utils';
import type { ImageSnapshotThresholdConfig } from './helpers/visu/image-snapshot-config';
import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0.0005 / 100, firefox: 0.04 / 100, webkit: 0 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      // [
      //   'overlays.start.flow.task.gateway',
      //   {
      //     linux: 0.000006, // 0.0005352733299934798%
      //     macos: 0.001, // max 0.09371109158465839%
      //     windows: 0.0015, // max 0.11569306287013695%
      //   },
      // ],
      // [
      //   'overlays.edges.associations.complex.paths',
      //   {
      //     linux: 0.0026, // max 0.2541247067242236%
      //     macos: 0.0025, // max 0.2456999041707375%
      //     windows: 0.0024, // max 0.2350932032529674%
      //   },
      // ],
      // [
      //   'overlays.edges.message.flows.complex.paths',
      //   {
      //     linux: 0.0013, // 0.12872847155422917%
      //     macos: 0.0031, // 0.3000623172666472%
      //     windows: 0.0013, // 0.12965038147577657%
      //   },
      // ],
      // [
      //   'overlays.edges.sequence.flows.complex.paths',
      //   {
      //     linux: 0.0021, // max 0.20566996103513757%
      //     macos: 0.0019, // max 0.18540603435701633%
      //     windows: 0.0018, // max 0.17718145021319295%
      //   },
      // ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      // [
      //   'overlays.start.flow.task.gateway',
      //   {
      //     linux: 0.0044, // max 0.43536497668036356%
      //     macos: 0.0071, // max 0.7027949859673144%
      //     windows: 0.0027, // max 0.26051371171855736%
      //   },
      // ],
      // [
      //   'overlays.edges.associations.complex.paths',
      //   {
      //     linux: 0.0012, // max 0.11544442258832888%
      //     macos: 0.0029, // max 0.2883299813273288%
      //     windows: 0.0038, // max 0.37867717015809266%
      //   },
      // ],
      // [
      //   'overlays.edges.message.flows.complex.paths',
      //   {
      //     linux: 0.0032, // 0.29508961424412616%
      //     macos: 0.004, // 0.36434716534193834%
      //     windows: 0.004, // 0.37268987984115926%
      //   },
      // ],
      // [
      //   'overlays.edges.sequence.flows.complex.paths',
      //   {
      //     linux: 0.0014, // max 0.13950493094400107%
      //     macos: 0.0027, // max 0.26624249108074816%
      //     windows: 0.0026, // max 0.25710970853788373%
      //   },
      // ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'overlays.start.flow.task.gateway',
        {
          macos: 0.59 / 100, // max 0.5856189551567081%
        },
      ],
      [
        'overlays.edges.associations.complex.paths',
        {
          macos: 0.48 / 100, // max 0.4771582239915584%
        },
      ],
      [
        'overlays.edges.message.flows.complex.paths',
        {
          macos: 0.35 / 100, // max 0.3492043109226462%
        },
      ],
      [
        'overlays.edges.sequence.flows.complex.paths',
        {
          macos: 0.39 / 100, // max 0.3876107955861241%
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

const pageTester = new OverlaysPageTester({ pageFileName: 'overlays', expectedPageTitle: 'BPMN Visualization - Overlays', diagramSubfolder: 'overlays' }, <Page>page);

describe('BPMN Shapes with overlays', () => {
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';

  function getShapeDir(dir: string): string {
    return join(dir, `on.shape`);
  }

  it.each(overlayShapePositionValues)(`add overlay on StartEvent, Gateway and Task on %s`, async (position: OverlayShapePosition) => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

    await pageTester.addOverlays(['StartEvent_1', 'Activity_1', 'Gateway_1'], position);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: `add.overlay.on.position.${position}`,
      customSnapshotsDir: getShapeDir(config.customSnapshotsDir),
      customDiffDir: getShapeDir(config.customDiffDir),
    });
  });

  it(`remove all overlays of Shape`, async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

    await pageTester.addOverlays('Activity_1', ['top-left', 'bottom-left', 'middle-right']);
    await pageTester.removeAllOverlays('Activity_1');

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'remove.all.overlays.of.shape',
      customSnapshotsDir: getShapeDir(config.customSnapshotsDir),
      customDiffDir: getShapeDir(config.customDiffDir),
    });
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
    function getEdgeDir(dir: string): string {
      return join(dir, `on.edge`);
    }

    function getEdgePositionDir(dir: string, position: OverlayEdgePosition): string {
      return join(getEdgeDir(dir), `on-position-${position}`);
    }

    it.each(overlayEdgePositionValues)(`add overlay on ${edgeKind} flow on %s`, async (position: OverlayEdgePosition) => {
      await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

      await pageTester.addOverlays(bpmnElementIds, position);

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot({
        ...config,
        customSnapshotIdentifier: `add.overlay.on.${edgeKind}.flow`,
        customSnapshotsDir: getEdgePositionDir(config.customSnapshotsDir, position),
        customDiffDir: getEdgePositionDir(config.customDiffDir, position),
      });
    });

    it(`remove all overlays of ${edgeKind} flow`, async () => {
      await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

      const id = bpmnElementIds.shift();
      await pageTester.addOverlays(id, ['start', 'middle', 'end']);
      await pageTester.removeAllOverlays(id);

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot({
        ...config,
        customSnapshotIdentifier: `remove.all.overlays.of.${edgeKind}.flow`,
        customSnapshotsDir: getEdgeDir(config.customSnapshotsDir),
        customDiffDir: getEdgeDir(config.customDiffDir),
      });
    });
  });
});

describe('Overlay navigation', () => {
  const bpmnDiagramName = 'overlays.start.flow.task.gateway';
  let containerCenter: Point;

  class OverlayNavigationImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
    constructor() {
      // don't set defaults as we defined thresholds for all style variants
      super({ chromium: 0, firefox: 0, webkit: 0 });
    }

    protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        // [
        //   'overlays.start.flow.task.gateway',
        //   {
        //     linux: 0.16, // max 0.1564279230663268%
        //     macos: 0.0024, // max 0.23276321559646546%
        //     windows: 0.0027, // max 0.26345999990737834%
        //   },
        // ],
      ]);
    }

    protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        // [
        //   'overlays.start.flow.task.gateway',
        //   {
        //     linux: 0.0044, // max 0.43536497668036356%
        //     macos: 0.0071, // max 0.7027949859673144%
        //     windows: 0.0027, // max 0.26051371171855736%
        //   },
        // ],
      ]);
    }

    protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        // [
        //   'overlays.start.flow.task.gateway',
        //   {
        //     macos: 0.0059, // max 0.5852809894618671%
        //   },
        // ],
      ]);
    }
  }

  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new OverlayNavigationImageSnapshotThresholds(), 'overlays');

  beforeEach(async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);
    containerCenter = await pageTester.getContainerCenter();

    await pageTester.addOverlays('StartEvent_1', 'bottom-center');
    await pageTester.addOverlays('Activity_1', 'middle-right');
    await pageTester.addOverlays('Gateway_1', 'top-right');
    await pageTester.addOverlays('Flow_1', 'start');
  });

  it('panning', async () => {
    await pageTester.mousePanning({ originPoint: containerCenter, destinationPoint: { x: containerCenter.x + 150, y: containerCenter.y + 40 } });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: 'panning',
    });
  });

  it(`zoom out`, async () => {
    await pageTester.mouseZoom(1, { x: containerCenter.x + 200, y: containerCenter.y }, 100);

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
      super({ chromium: 0, firefox: 0, webkit: 0 });
    }

    protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      // if no dedicated information, set minimal threshold to make test pass on Github Workflow
      // linux threshold are set for Ubuntu
      return new Map<string, ImageSnapshotThresholdConfig>([
        // [
        //   'fill',
        //   {
        //     linux: 0.000008, // 0.0007321333538534702%
        //     macos: 0.0002, // 0.015144311713777281%
        //     windows: 0.0003, // 0.021176489211183203%
        //   },
        // ],
        // [
        //   'font',
        //   {
        //     linux: 0.0056, // 0.5527510139290981%
        //     macos: 0.0004, // 0.5500536579274629%
        //     windows: 0.0086, // 0.8581313833777582%
        //   },
        // ],
        // [
        //   'stroke',
        //   {
        //     linux: 0.000008, // 0.0007579143449953918%
        //     macos: 0.0018, // 0.1787779478926499%
        //     windows: 0.0022, // 0.21848079010937665%
        //   },
        // ],
      ]);
    }

    protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        // [
        //   'fill',
        //   {
        //     linux: 0.0016, // 0.15729572870969433
        //     macos: 0.0038, // 0.3723534417182983%
        //     windows: 0.0036, // 0.03575426016920735%
        //   },
        // ],
        // [
        //   // TODO very large thresholds on Firefox linux/macOS for font overlay styles
        //   'font',
        //   {
        //     linux: 0.013, // 1.233008755632492%
        //     macos: 0.014, // 1.3766390291200084%
        //     windows: 0.002, // 0.1956705895781785%
        //   },
        // ],
        // [
        //   'stroke',
        //   {
        //     linux: 0.0013, // 0.1259742349527526%
        //     macos: 0.0036, // 0.35056620525392157%
        //     windows: 0.0024, // 0.23796610634385656%
        //   },
        // ],
      ]);
    }

    protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        // [
        //   'fill',
        //   {
        //     macos: 0.0017, // 0.16625642718750555%
        //   },
        // ],
        // [
        //   'font',
        //   {
        //     macos: 0.0064, // 0.6363172807824835%
        //   },
        // ],
        // [
        //   'stroke',
        //   {
        //     macos: 0.0033, // 0.3243565433802331%
        //   },
        // ],
      ]);
    }
  }

  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new OverlayStylesImageSnapshotThresholds(), 'overlays');

  it.each(['fill', 'font', 'stroke'])(`add overlay with custom %s`, async (style: string) => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);

    await pageTester.addStylingOverlay(['StartEvent_1', 'Activity_1', 'Gateway_1', 'Flow_1'], style);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(style);
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: `add.overlay.with.custom.${style}`,
      customSnapshotsDir: join(config.customSnapshotsDir, snapshotPath),
      customDiffDir: join(config.customDiffDir, snapshotPath),
    });
  });
});
