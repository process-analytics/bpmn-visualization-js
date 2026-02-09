/*
Copyright 2025 Bonitasoft S.A.

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

import type { ImageSnapshotThresholdConfig } from './helpers/visu/image-snapshot-config';

import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

import { AvailableTestPages, PageTester } from '@test/shared/visu/bpmn-page-utils';

class ImageSnapshotThresholdsActivityLabelBounds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0 / 100, firefox: 0 / 100, webkit: 0 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'activities.with.wrongly.positioned.labels.not-ignored',
        {
          macos: 0.19 / 100, // 0.18413140767182812%
          windows: 0.22 / 100, // 0.21177195104159496%
        },
      ],
      [
        'activities.with.wrongly.positioned.labels.ignored',
        {
          macos: 0.29 / 100, // 0.28115982788768923%
          windows: 0.28 / 100, // 0.27545483944123594%
        },
      ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'activities.with.wrongly.positioned.labels.not-ignored',
        {
          linux: 0.23 / 100, // 0.2236111574782207%
          macos: 0.36 / 100, // 0.35012765743468455%
          windows: 1.32 / 100, // 1.3103779470739596%
        },
      ],
      [
        'activities.with.wrongly.positioned.labels.ignored',
        {
          linux: 0.85 / 100, // 0.8457215876566115%
          macos: 0.64 / 100, // 0.634897664634726%
          windows: 1.90 / 100, // 1.8900990794732508%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'activities.with.wrongly.positioned.labels.not-ignored',
        {
          macos: 0.44 / 100, // 0.4382175377357411%
        },
      ],
      [
        'activities.with.wrongly.positioned.labels.ignored',
        {
          macos: 1.50 / 100, // 1.4951298719464878%
        },
      ],
    ]);
  }
}

class ImageSnapshotThresholdsLabelStyles extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0 / 100, firefox: 0 / 100, webkit: 0 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'labels.with.font.styles.not-ignored',
        {
          macos: 0.17 / 100, // 0.16518659366272503%
          windows: 0.16 / 100, // 0.1578221549419112%
        },
      ],
      [
        'labels.with.font.styles.ignored',
        {
          macos: 0.21 / 100, // 0.20961855005547925%
          windows: 0.29 / 100, // 0.2864761242524328%
        },
      ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'labels.with.font.styles.not-ignored',
        {
          // very large number because of firefox rendering differences compared to chrome (font)
          // this test requires to use a dedicated reference screenshot, see https://github.com/process-analytics/bpmn-visualization-js/issues/2838
          linux: 4.53 / 100, // 4.529968414713514%
          macos: 0.50 / 100, // 0.49100385220669507%
          windows: 2.10 / 100, // 2.096414153407533%
        },
      ],
      [
        'labels.with.font.styles.ignored',
        {
          linux: 0.06 / 100, // 0.05351232277721607%
          macos: 0.26 / 100, // 0.2513269855389466%
          windows: 1.64 / 100, // 1.637503468193735%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'labels.with.font.styles.not-ignored',
        {
          macos: 0.31 / 100, // 0.30621380597637415%
        },
      ],
      [
        'labels.with.font.styles.ignored',
        {
          macos: 0.38 / 100, // 0.37988509633168904%
        },
      ],
    ]);
  }
}

describe('BPMN rendering - ignore options', () => {
  const diagramSubfolder = 'bpmn-rendering-ignore-options';
  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder }, page);

  function getConfigName(bpmnDiagramName: string, ignoredOption: boolean): string {
    return bpmnDiagramName + '.' + (ignoredOption ? 'ignored' : 'not-ignored');
  }

  describe('Ignore activity label bounds', () => {
    const bpmnDiagramName = 'activities.with.wrongly.positioned.labels';

    describe.each([false, true])('ignoreBpmnActivityLabelBounds: %s', (ignoreBpmnActivityLabelBounds: boolean) => {
      const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new ImageSnapshotThresholdsActivityLabelBounds(), 'bpmn-rendering-ignore-options');

      it(`${bpmnDiagramName}`, async () => {
        await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName, {
          rendererIgnoreBpmnActivityLabelBounds: ignoreBpmnActivityLabelBounds,
        });

        const image = await page.screenshot({ fullPage: true });
        const config = imageSnapshotConfigurator.getConfig(getConfigName(bpmnDiagramName, ignoreBpmnActivityLabelBounds));
        expect(image).toMatchImageSnapshot(config);
      });
    });
  });

  describe('Ignore label styles', () => {
    const bpmnDiagramName = 'labels.with.font.styles';

    describe.each([false, true])('ignoreBpmnLabelStyles: %s', (ignoreBpmnLabelStyles: boolean) => {
      const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new ImageSnapshotThresholdsLabelStyles(), 'bpmn-rendering-ignore-options');

      it(`${bpmnDiagramName}`, async () => {
        await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName, {
          rendererIgnoreBpmnLabelStyles: ignoreBpmnLabelStyles,
        });

        const image = await page.screenshot({ fullPage: true });
        const config = imageSnapshotConfigurator.getConfig(getConfigName(bpmnDiagramName, ignoreBpmnLabelStyles));
        expect(image).toMatchImageSnapshot(config);
      });
    });
  });
});
