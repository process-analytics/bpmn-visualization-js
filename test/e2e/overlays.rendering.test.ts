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
import { join } from 'node:path';
import type { Page } from 'playwright';
import { ensureIsArray } from '../../src/component/helpers/array-utils';
import type { OverlayEdgePosition, OverlayPosition, OverlayShapePosition } from '../../src/component/registry';
import { ZoomType } from '../../src/component/options';
import { overlayEdgePositionValues, overlayShapePositionValues } from '../helpers/overlays';
import type { Point } from './helpers/visu/bpmn-page-utils';
import { AvailableTestPages, PageTester } from './helpers/visu/bpmn-page-utils';
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
      [
        'overlays.start.flow.task.gateway',
        {
          macos: 0.1 / 100, // max 0.09371109158465839%
          windows: 0.12 / 100, // max 0.11574540756377205%
        },
      ],
      [
        'overlays.edges.associations.complex.paths',
        {
          macos: 0.31 / 100, // max 0.3006830880479039%
          windows: 0.31 / 100, // max 0.3013649459581602%
        },
      ],
      [
        'overlays.edges.message.flows.complex.paths',
        {
          macos: 0.17 / 100, // 0.16085016564131302%
          windows: 0.08 / 100, // 0.07293820549113537%
        },
      ],
      [
        'overlays.edges.sequence.flows.complex.paths',
        {
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
          linux: 0.44 / 100, // max 0.435363088442553%
          macos: 0.71 / 100, // max 0.7027880077090211%
          windows: 0.14 / 100, // max 0.13629575601151744%
        },
      ],
      [
        'overlays.edges.associations.complex.paths',
        {
          linux: 0.4 / 100, // max 0.3964089055703668%
          macos: 0.53 / 100, // max 0.5254958628580608%
          windows: 0.43 / 100, // max 0.42268320684041294%
        },
      ],
      [
        'overlays.edges.message.flows.complex.paths',
        {
          linux: 0.58 / 100, // 0.5794594395932884%
          macos: 0.67 / 100, // 0.6654738557991036%
          windows: 0.66 / 100, // 0.6524091603189786%
        },
      ],
      [
        'overlays.edges.sequence.flows.complex.paths',
        {
          linux: 0.36 / 100, // max 0.35664699175183%
          macos: 0.44 / 100, // max 0.43144267510022427%
          windows: 0.3 / 100, // max 0.2931831722714717%
        },
      ],
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

const pageTester = new OverlaysPageTester({ targetedPage: AvailableTestPages.OVERLAYS, diagramSubfolder: 'overlays' }, <Page>page);

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
        [
          'overlays.start.flow.task.gateway',
          {
            linux: 0.00005 / 100, // max 0.00004084062452669457%
            macos: 0.09 / 100, // max 0.08430877145797488%
            windows: 0.12 / 100, // max 0.11213898282994572%
          },
        ],
      ]);
    }

    protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        [
          'overlays.start.flow.task.gateway',
          {
            linux: 0.23 / 100, // max 0.22238155947217342%
            macos: 0.58 / 100, // max 0.5781644435027378%
            windows: 0.12 / 100, // max 0.11775550254274902%
          },
        ],
      ]);
    }

    protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        [
          'overlays.start.flow.task.gateway',
          {
            macos: 0.36 / 100, // max 0.35907994310595553%
          },
        ],
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
      super({ chromium: 0, firefox: 0, webkit: 0 });
    }

    protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      // if no dedicated information, set minimal threshold to make test pass on Github Workflow
      // linux threshold are set for Ubuntu
      return new Map<string, ImageSnapshotThresholdConfig>([
        [
          'fill',
          {
            linux: 0.00001 / 100, // 0.00000905269291751054%
            macos: 0.016 / 100, // 0.01515942258121239%
            windows: 0.03 / 100, // 0.021221138510052473%
          },
        ],
        [
          'font',
          {
            linux: 0.0004 / 100, // 0.00032830846258269375%
            macos: 0.56 / 100, // 0.5500536579274629%
            windows: 0.33 / 100, // 0.3231773603294519%
          },
        ],
        [
          'stroke',
          {
            linux: 0.00002 / 100, // 0.000015810628772872093%
            macos: 0.18 / 100, // 0.1787876617120987%
            windows: 0.22 / 100, // 0.2184761338537622%
          },
        ],
      ]);
    }

    protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        [
          'fill',
          {
            linux: 0.16 / 100, // 0.15701274621052752
            macos: 0.38 / 100, // 0.37208408401212534%
            windows: 0.036 / 100, // 0.03540156823378382%
          },
        ],
        [
          'font',
          {
            linux: 0.7 / 100, // 0.6957363425958542%
            // TODO very large threshold on Firefox macOS for font overlay styles
            macos: 2.01 / 100, // 2.0033547194979073%
            windows: 0.34 / 100, // 0.33890377031536856%
          },
        ],
        [
          'stroke',
          {
            linux: 0.13 / 100, // 0.12558613624870096%
            macos: 0.36 / 100, // 0.35018722925578283%
            windows: 0.24 / 100, // 0.23760788536359984%
          },
        ],
      ]);
    }

    protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
      return new Map<string, ImageSnapshotThresholdConfig>([
        [
          'fill',
          {
            macos: 0.17 / 100, // 0.1664526237549535%
          },
        ],
        [
          'font',
          {
            macos: 1.24 / 100, // 1.2343878983440026%
          },
        ],
        [
          'stroke',
          {
            macos: 0.33 / 100, // 0.325165957934348%
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
    expect(image).toMatchImageSnapshot({
      ...config,
      customSnapshotIdentifier: `add.overlay.with.custom.${style}`,
      customSnapshotsDir: join(config.customSnapshotsDir, snapshotPath),
      customDiffDir: join(config.customDiffDir, snapshotPath),
    });
  });
});
