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
import { defaultChromiumFailureThreshold, ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  // threshold for webkit is taken from macOS only
  constructor() {
    super({ chromium: defaultChromiumFailureThreshold, firefox: 0.02 / 100, webkit: 0.12 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'flows.message.02.labels.and.complex.paths',
        {
          // macos: 0.05 / 100, // 0.042940114894829406%
          // windows: 0.13 / 100, // 0.12414788622622241%
        },
      ],
      [
        'group.01.in.process.with.label',
        {
          // macos: 0.0002, // 0.017014812909055266%
          // windows: 0.0003, // 0.026260389475118995%
        },
      ],
      [
        'group.02.in.collaboration.with.label',
        {
          // macos: 0.0002, // 0.011733173038031008%
          // windows: 0.0004, // 0.030760508478666626%
        },
      ],
      [
        'labels.01.general',
        {
          linux: 0.0005 / 100, // 0.00046159344679885805%
          // macos: 0.63 / 100, // 0.6225356945699145%
          // windows: 0.48 / 100, // 0.4794467924774448%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          linux: 0.009 / 100, // 0.008114783064627762%
          // windows: 0.082, // 0.8197899179969159%
        },
      ],
      [
        'labels.03.default.position',
        {
          linux: 0.002 / 100, // 0.0013799735258945844%
          // macos: 0.47 / 100, // 0.46761316449689394%
          // windows: 0.32 / 100, // 0.31624569609181025%
        },
      ],
      [
        'labels.04.fonts',
        {
          // macos: 0.19 / 100, // 0.18334725431882193%
          // windows: 0.22 / 100, // 0.21293572507528058%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          // macos: 0.13 / 100, // 0.1232401834606045%
          // windows: 0.25 / 100, // 0.20513086293463267%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          // linux: 0.0014, // 0.13132100299135807%
          // macos: 0.0015, // 0.14776609441433664%
          // windows: 0.002, // 0.1182792778311903%
        },
      ],
      [
        'pools.03.black.box',
        {
          // linux: 0.0017, // 0.16083207782319198%
          // macos: 0.0018, // 0.17300897532621654%
          // windows: 0.0026, // 0.25283466417285183%
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
          // linux: 0.09 / 100, // 0.0833293935339152%
          // macos: 0.13 / 100, // 0.12587692325856104%
          // windows: 0.71 / 100, // 0.7024096538645774%
        },
      ],
      [
        'group.01.in.process.with.label',
        {
          // macos: 0.0002, // 0.017539672871980105%
          // windows: 0.0022, // 0.21161062086058058%
        },
      ],
      [
        'group.02.in.collaboration.with.label',
        {
          // macos: 0.0002, // 0.015546117401621373%
          // windows: 0.0019, // 0.18223382519321207%
        },
      ],
      [
        'labels.01.general',
        {
          // high values due to font rendering discrepancies with chromium rendering
          // linux: 2 / 100, // 1.99314755236637%
          // macos: 2.35 / 100, // 2.342807360599164%
          // // very high threshold
          // windows: 13.53, // 13.521318196938303%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          // TODO possible rendering issue so high threshold value
          // linux: 0.031, // 3.08975009972805%
          // macos: 0.025, // 2.478877395928847%
          // // very high threshold
          // windows: 0.156, // 15.594367802739583%
        },
      ],
      [
        'labels.03.default.position',
        {
          // linux: 0.41 / 100, // 0.40701080345780793%
          // macos: 0.82 / 100, // 0.8111318088812269%
          // // TODO possible rendering issue so high threshold value
          // windows: 2.73, // 2.722838502156999%
        },
      ],
      [
        'labels.04.fonts',
        {
          // high values due to font rendering discrepancies with chromium rendering
          // linux: 1.46 / 100, // 1.4556545630196482%
          // macos: 0.91 / 100, // 0.904039586436256%
          // windows: 1.73, // 1.7261364524240324%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          // macos: 0.13 / 100, // 0.1272045431662927%
          // windows: 0.59 / 100, // 0.5809316243215457%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          // linux: 0.0003, // 0.024310386980885834%
          // macos: 0.0015, // 0.14753246729929392%
          // windows: 0.0072, // 0.7100461008680559%
        },
      ],
      [
        'pools.03.black.box',
        {
          // linux: 0.0023, // 0.22636282955619252%
          // macos: 0.0022, // 0.21007470164219333%
          // windows: 0.0059, // 0.5856398049701173%
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
          // macos: 0.41 / 100, // 0.40016434760490327%
        },
      ],
      [
        'labels.01.general',
        {
          // TODO possible rendering issue so high threshold value
          // macos: 2.61 / 100, // 2.606652827219813%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          // TODO possible rendering issue so high threshold value
          // macos: 0.059, // 5.875189976297179%
        },
      ],
      [
        'labels.03.default.position',
        {
          // macos: 0.85 / 100, // 0.843063100064223%
        },
      ],
      [
        'labels.04.fonts',
        {
          // macos: 0.63 / 100, // 0.6255817109336315%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          // macos: 0.25 / 100, // 0.2428126684001386%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          // macos: 0.0026, // 0.24229404068003557%
        },
      ],
      [
        'pools.03.black.box',
        {
          // macos: 0.0023, // 0.2242640286478026%
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
