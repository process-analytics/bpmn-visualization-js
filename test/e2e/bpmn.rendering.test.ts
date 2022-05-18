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
import type { Page } from 'playwright';
import { getBpmnDiagramNames } from './helpers/test-utils';
import type { StyleOptions } from './helpers/visu/bpmn-page-utils';
import { PageTester } from './helpers/visu/bpmn-page-utils';
import type { ImageSnapshotThresholdConfig } from './helpers/visu/image-snapshot-config';
import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    // chromium: max on macOS - the local diff was 0.00516920660650344%
    // threshold for webkit is taken from macOS only
    super({ chromium: 0.006 / 100, firefox: 0.02 / 100, webkit: 0.12 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'flows.message.02.labels.and.complex.paths',
        {
          macos: 0.05 / 100, // 0.04335117590119619%
          windows: 0.13 / 100, // 0.12203782032372823%
        },
      ],
      [
        'group.01.in.process.with.label',
        {
          macos: 0.02 / 100, // 0.01749142091445055%
          windows: 0.03 / 100, // 0.028794961672506947%
        },
      ],
      [
        'group.02.in.collaboration.with.label',
        {
          macos: 0.02 / 100, // 0.01128137033959975%
          windows: 0.04 / 100, // 0.03137680045437463%
        },
      ],
      // [
      //   'labels.01.general',
      //   {
      //     linux: 0.0005 / 100, // 0.00046159344679885805%
      //     macos: 0.55 / 100, // 0.5443537069607207%
      //     windows: 0.43 / 100, // 0.4279840696306825%
      //   },
      // ],
      [
        'labels.02.position.and.line.breaks',
        {
          linux: 0.009 / 100, // 0.008114783064627762%
          macos: 0.92 / 100, // 0.9143424811214107%
          windows: 0.59 / 100, // 0.5844660139573077%
        },
      ],
      [
        'labels.03.default.position',
        {
          linux: 0.002 / 100, // 0.0013799735258945844%
          macos: 0.36 / 100, // 0.35527645122680473%
          windows: 0.32 / 100, // 0.3125578154609565%
        },
      ],
      [
        'labels.04.fonts',
        {
          macos: 0.18 / 100, // 0.17224316335068268%
          windows: 0.21 / 100, // 0.2083830906789208%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          macos: 0.09 / 100, // 0.08291308761130267%
          windows: 0.23 / 100, // 0.21990738071808735%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          macos: 0.13 / 100, // 0.12482014769641389%
          windows: 0.14 / 100, // 0.13308164928160784%
        },
      ],
      [
        'pools.03.black.box',
        {
          macos: 0.095 / 100, // 0.0935782032063015%
          windows: 0.12 / 100, // 0.1184446265753869%
        },
      ],
      // tests without labels
      [
        'gateways',
        {
          macos: 0.000006, // 0.0005804554357724534%
        },
      ],
      [
        'events',
        {
          macos: 0.00001, // 0.000988153090064614%
        },
      ],
      [
        'call.activities',
        {
          macos: 0.000005, // 0.0004123713869708112%
        },
      ],
    ]);
  }

  protected override getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'flows.message.02.labels.and.complex.paths',
        {
          linux: 0.09 / 100, // 0.08377044926310973%
          macos: 0.13 / 100, // 0.12624011437493143%
          windows: 0.73 / 100, // 0.7275118149390969%
        },
      ],
      [
        'group.01.in.process.with.label',
        {
          windows: 0.2 / 100, // 0.19944779635067134%
        },
      ],
      [
        'group.02.in.collaboration.with.label',
        {
          windows: 0.24 / 100, // 0.23009823201961543%
        },
      ],
      // [
      //   'labels.01.general',
      //   {
      //     // high values due to font rendering discrepancies with chromium rendering
      //     linux: 2.06 / 100, // 2.0563192299700384%
      //     macos: 2.35 / 100, // 2.34547842662729%
      //     // very high threshold
      //     windows: 13.42 / 10, // 13.418682820755645%
      //   },
      // ],
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
        'pools.01.labels.and.lanes',
        {
          macos: 0.09 / 100, // 0.08552532456441721%
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
          linux: 0.08 / 100, // 0.07283646777227482%
          macos: 0.14 / 100, // 0.13474247576623632%
          windows: 0.66 / 100, // 0.6566433292574891%
        },
      ],
      // tests without labels
      [
        'associations.and.annotations.01.general',
        {
          linux: 0.074 / 100, // 0.07377888682271738%
          macos: 0.074 / 100, // 0.07377888682271738%
          windows: 0.074 / 100, // 0.07377888682271738%
        },
      ],
      [
        'markers.01.positioning',
        {
          linux: 0.00022, // 0.02063400006822036%
          macos: 0.00021, // 0.02063400006822036%
          windows: 0.00021, // 0.02063400006822036%
        },
      ],
      [
        'markers.02.different.tasks.sizes',
        {
          linux: 0.00026, // 0.02578305330844799%
          macos: 0.00026, // 0.02578305330844799%
          windows: 0.00026, // 0.02578305330844799%
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
          // TODO possible rendering issue so high threshold value
          macos: 1.25 / 100, // 1.2428419116196077%
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
          macos: 0.61 / 100, // 0.6044319789370367%
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
      // tests without labels
      [
        'events',
        {
          macos: 0.0014, // 0.1397832014147449%
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
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new ImageSnapshotThresholds(), 'bpmn');

  const diagramSubfolder = 'non-regression';
  const pageTester = new PageTester({ pageFileName: 'non-regression', expectedPageTitle: 'BPMN Visualization Non Regression', diagramSubfolder }, <Page>page);
  const bpmnDiagramNames = getBpmnDiagramNames(diagramSubfolder);

  it('check bpmn non-regression files availability', () => {
    expect(bpmnDiagramNames).toContain('gateways');
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
