/*
Copyright 2023 Bonitasoft S.A.

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
import { getBpmnDiagramNames } from '@test/shared/visu/test-utils';
import type { Page } from 'playwright';

class ImageSnapshotThresholdsModelColors extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    // threshold for webkit is taken from macOS only
    super({ chromium: 0.07 / 100, firefox: 0.006 / 100, webkit: 0.07 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'elements.colors.02.labels',
        {
          macos: 0.16 / 100, // 0.15342106983194936%
          windows: 0.13 / 100, // 0.1213310788226063%
        },
      ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'elements.colors.02.labels',
        {
          linux: 0.06 / 100, // 0.053125174438761746%
          macos: 0.31 / 100, // 0.3043122668906051%
          windows: 1.76 / 100, // 1.7546495847922894%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'elements.colors.02.labels',
        {
          macos: 0.41 / 100, // 0.40831372531949794%
        },
      ],
    ]);
  }
}

class ImageSnapshotThresholdsIgnoreBpmnColors extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    // threshold for webkit is taken from macOS only
    super({ chromium: 0.07 / 100, firefox: 0.007 / 100, webkit: 0.07 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'elements.colors.02.labels',
        {
          macos: 0.13 / 100, // 0.1212088519104926%
          windows: 0.13 / 100, // 0.1213310788226063%
        },
      ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'elements.colors.02.labels',
        {
          linux: 0.06 / 100, // 0.05323299012142124%
          macos: 0.16 / 100, // 0.15175768637681886%
          windows: 1.91 / 100, // 1.9033668295464934%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'elements.colors.02.labels',
        {
          macos: 0.49 / 100, // 0.483122009334358%
        },
      ],
    ]);
  }
}

describe('BPMN in color', () => {
  const diagramSubfolder = 'bpmn-in-color';
  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder }, <Page>page);
  const bpmnDiagramNames = getBpmnDiagramNames(diagramSubfolder);

  describe.each([false, true])('Ignore BPMN colors: %s', (ignoreBpmnColors: boolean) => {
    const imageSnapshotConfigurator = ignoreBpmnColors
      ? new ImageSnapshotConfigurator(new ImageSnapshotThresholdsIgnoreBpmnColors(), 'bpmn-colors/ignored')
      : new ImageSnapshotConfigurator(new ImageSnapshotThresholdsModelColors(), 'bpmn-colors/enabled');

    it.each(bpmnDiagramNames)(`%s`, async (bpmnDiagramName: string) => {
      await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName, {
        rendererIgnoreBpmnColors: ignoreBpmnColors,
      });

      const image = await page.screenshot({ fullPage: true });
      const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
      expect(image).toMatchImageSnapshot(config);
    });
  });
});
