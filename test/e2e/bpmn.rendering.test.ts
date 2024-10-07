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
import type { StyleOptions } from '@test/shared/visu/bpmn-page-utils';

import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

import { AvailableTestPages, PageTester } from '@test/shared/visu/bpmn-page-utils';
import { getBpmnDiagramNames } from '@test/shared/visu/test-utils';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    // threshold for webkit is taken from macOS only
    super({ chromium: 0.16 / 100, firefox: 0.09 / 100, webkit: 0.14 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      // start with diagram including labels
      [
        'labels.01.general',
        {
          macos: 0.8 / 100, // 0.7941577314545922%
          windows: 0.52 / 100, // 0.5122398889742197%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          macos: 0.97 / 100, // 0.9608986974041889%
          windows: 0.63 / 100, // 0.6249408985672167%
        },
      ],
      [
        'labels.03.default.position',
        {
          macos: 0.38 / 100, // 0.37323579648680383%
          windows: 0.33 / 100, // 0.3203254635281927%
        },
      ],
      [
        'labels.04.fonts',
        {
          macos: 0.2 / 100, // 0.1880729042500584%
          windows: 0.22 / 100, // 0.2109362424737582%
        },
      ],
      [
        'labels.05.default.position.activities',
        {
          macos: 0.35 / 100, // 0.3364682783477235%
          windows: 0.47 / 100, // 0.46907051252580434%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          windows: 0.23 / 100, // 0.21990738071808735%
        },
      ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'flows.message.02.labels.and.complex.paths',
        {
          macos: 0.13 / 100, // 0.12624011437493143%
          windows: 0.73 / 100, // 0.7275118149390969%
        },
      ],
      [
        'group.01.in.process.with.label',
        {
          windows: 0.23 / 100, // 0.2264593859631736%
        },
      ],
      [
        'group.02.in.collaboration.with.label',
        {
          windows: 0.25 / 100, // 0.2433767377079566%
        },
      ],
      [
        'labels.01.general',
        {
          // high values due to font rendering discrepancies with chromium rendering
          linux: 1.15 / 100, // 1.1412952972301604%
          macos: 1.72 / 100, // 1.7113512021706412%
          windows: 12.87 / 100, // 12.860171896489781% - different word wrapping, see https://github.com/process-analytics/bpmn-visualization-js/pull/2790#issuecomment-1680765999
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          // TODO possible rendering issue so high threshold value
          linux: 2.54 / 100, // 2.5316594800931735%
          macos: 3.22 / 100, // 3.213605890318172%
          // very high threshold
          windows: 15.75 / 100, // 15.741601399131824%
        },
      ],
      [
        'labels.03.default.position',
        {
          linux: 0.64 / 100, // 0.6356854597329709%
          macos: 0.9 / 100, // 0.8910384426042195%
          // TODO possible rendering issue so high threshold value
          windows: 2.35 / 100, // 2.3456231064214905%
        },
      ],
      [
        'labels.04.fonts',
        {
          // high values due to font rendering discrepancies with chromium rendering
          linux: 1.43 / 100, // 1.4296226221777508%
          macos: 0.88 / 100, // 0.8747774724672697%
          windows: 1.68 / 100, // 1.6735128438225666%
        },
      ],
      [
        'labels.05.default.position.activities',
        {
          linux: 0.46 / 100, // 0.45753886693361556%
          macos: 0.7 / 100, // 0.6908428450721038%
          // high value due to font rendering discrepancies with chromium rendering
          windows: 2.87 / 100, // 2.869412475926314%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          windows: 0.56 / 100, // 0.5571042176931162%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          macos: 0.13 / 100, // 0.1257657147324509%
          windows: 0.75 / 100, // 0.7432204108300144%
        },
      ],
      [
        'pools.03.black.box',
        {
          macos: 0.14 / 100, // 0.13474247576623632%
          windows: 0.66 / 100, // 0.6566433292574891%
        },
      ],
    ]);
  }

  protected override getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'flows.message.02.labels.and.complex.paths',
        {
          macos: 0.41 / 100, // 0.40487233108913445%
        },
      ],
      [
        'labels.01.general',
        {
          // high value due to font rendering discrepancies with chromium rendering
          macos: 1.79 / 100, // 1.7833883910028492%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          // TODO possible rendering issue so high threshold value
          macos: 6.11 / 100, // 6.105183205727094%
        },
      ],
      [
        'labels.03.default.position',
        {
          macos: 0.64 / 100, // 0.6346061558805904%
        },
      ],
      [
        'labels.04.fonts',
        {
          macos: 0.71 / 100, // 0.703880504764276%
        },
      ],
      [
        'labels.05.default.position.activities',
        {
          macos: 1.2 / 100, // 1.192492604936246%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          macos: 0.21 / 100, // 0.20749068678074245%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          macos: 0.24 / 100, // 0.23336351480325318%
        },
      ],
      [
        'pools.03.black.box',
        {
          macos: 0.36 / 100, // 0.3576987596416892%
        },
      ],
    ]);
  }
}

const styleOptionsPerDiagram = new Map<string, StyleOptions>([
  [
    'associations.and.annotations.04.target.edges',
    {
      sequenceFlow: { useLightColors: true },
    },
  ],
]);

describe('BPMN rendering', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new ImageSnapshotThresholds(), 'bpmn-rendering');

  const diagramSubfolder = 'bpmn-rendering';
  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder }, page);
  const bpmnDiagramNames = getBpmnDiagramNames(diagramSubfolder);

  describe('BPMN diagram files are present', () => {
    // non exhaustive list
    it.each(['gateways', 'events'])('%s', (bpmnDiagramName: string) => {
      expect(bpmnDiagramNames).toContain(bpmnDiagramName);
    });
  });

  it.each(bpmnDiagramNames)(`%s`, async (bpmnDiagramName: string) => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName, {
      styleOptions: styleOptionsPerDiagram.get(bpmnDiagramName),
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(config);
  });
});
