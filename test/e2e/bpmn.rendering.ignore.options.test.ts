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
    return new Map<string, ImageSnapshotThresholdConfig>();
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'activities.with.wrongly.positioned.labels.not-ignored',
        {
          linux: 0.23 / 100, // 0.2236111574782207%
        },
      ],
      [
        'activities.with.wrongly.positioned.labels.ignored',
        {
          linux: 0.85 / 100, // 0.8457215876566115%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>();
  }
}

class ImageSnapshotThresholdsLabelStyles extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0 / 100, firefox: 0 / 100, webkit: 0 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>();
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'labels.with.font.styles.not-ignored',
        {
          // very large number because of firefox rendering differences compared to chrome (font)
          // this test requires to use a dedicated reference screenshot, see https://github.com/process-analytics/bpmn-visualization-js/issues/2838
          linux: 2.4 / 100, // 2.3980839754224936%%
        },
      ],
      [
        'labels.with.font.styles.ignored',
        {
          linux: 0.06 / 100, // 0.05351232277721607%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>();
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
