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
import {
  defaultChromiumFailureThreshold,
  ImageSnapshotConfigurator,
  ImageSnapshotThresholdConfig,
  MultiBrowserImageSnapshotThresholds,
} from './helpers/visu/image-snapshot-config';
import { PageTester, StyleOptions } from './helpers/visu/bpmn-page-utils';
import { getBpmnDiagramNames } from './helpers/test-utils';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  // threshold for webkit is taken from macOS only
  constructor() {
    super({ chromium: defaultChromiumFailureThreshold, firefox: 0.00012, webkit: 0.001 });
  }

  getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on Github Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'flows.message.02.labels.and.complex.paths',
        {
          linux: 0.0007, // 0.06668052776724888%
          macos: 0.0018, // 0.17219315784514633%
          windows: 0.0047, // 0.46994372519594263%
        },
      ],
      [
        'group.01.in.process.with.label',
        {
          macos: 0.0002, // 0.017014812909055266%
          windows: 0.0003, // 0.026260389475118995%
        },
      ],
      [
        'group.02.in.collaboration.with.label',
        {
          macos: 0.0002, // 0.011733173038031008%
          windows: 0.0004, // 0.030760508478666626%
        },
      ],
      [
        'labels.01.general',
        {
          linux: 0.0063, // 0.6220830831694446%
          windows: 0.0095, // 0.9454259810923071%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          linux: 0.0089, // 0.8846259528850542%
          windows: 0.082, // 0.8197899179969159%
        },
      ],
      [
        'labels.03.default.position',
        {
          linux: 0.0033, // 0.3274740999744119%
          macos: 0.0073, // 0.7297300805459317%
          windows: 0.0064, // 0.6332698717012919%
        },
      ],
      [
        'labels.04.fonts',
        {
          macos: 0.0019, // 0.18334725431882193%
          windows: 0.0022, // 0.21203992685594475%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          macos: 0.0013, // 0.1232401834606045%
          windows: 0.0025, // 0.2049348246286553%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          linux: 0.0014, // 0.13132100299135807%
          macos: 0.0015, // 0.14776609441433664%
          windows: 0.002, // 0.1182792778311903%
        },
      ],
      [
        'pools.03.black.box',
        {
          linux: 0.0017, // 0.16083207782319198%
          macos: 0.0018, // 0.17300897532621654%
          windows: 0.0026, // 0.25283466417285183%
        },
      ],
      // tests without labels
      [
        'gateways',
        {
          macos: 0.000006, // 0.0005804554357724534%
        },
      ],
      // tests without labels
      [
        'events',
        {
          macos: 0.00001, // 0.000988153090064614%
        },
      ],
      // tests without labels
      [
        'call.activities',
        {
          macos: 0.000005, // 0.0004123713869708112%
        },
      ],
    ]);
  }

  getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'all.elements.fill.color',
        {
          linux: 0.00054, // 0.05379319393775671%
          macos: 0.00054, // 0.05379319393775671%
          windows: 0.00054, // 0.05379319393775671%
        },
      ],
      [
        'flows.message.02.labels.and.complex.paths',
        {
          linux: 0.0058, // 0.5661158485707474%
          macos: 0.0066, // 0.6597408179179087%
          // TODO possible rendering issue so high threshold value
          windows: 0.0139, // 1.3843493898232695%
        },
      ],
      [
        'group.01.in.process.with.label',
        {
          macos: 0.0002, // 0.017539672871980105%
          windows: 0.0022, // 0.21161062086058058%
        },
      ],
      [
        'group.02.in.collaboration.with.label',
        {
          macos: 0.0002, // 0.015546117401621373%
          windows: 0.0019, // 0.18223382519321207%
        },
      ],
      [
        'labels.01.general',
        {
          // TODO possible rendering issue so high threshold value
          linux: 0.0253, // 2.5290364964082106%
          macos: 0.0283, // 2.828212392182683%
          // very high threshold
          windows: 0.128, // 12.78746528557091%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          // TODO possible rendering issue so high threshold value
          linux: 0.031, // 3.08975009972805%
          macos: 0.025, // 2.478877395928847%
          // very high threshold
          windows: 0.156, // 15.594367802739583%
        },
      ],
      [
        'labels.03.default.position',
        {
          linux: 0.004, // 0.3963655373407038%
          macos: 0.0083, // 0.8247488633640443%
          // TODO possible rendering issue so high threshold value
          windows: 0.0249, // 2.4807342775750363%
        },
      ],
      [
        'labels.04.fonts',
        {
          // TODO possible rendering issue so high threshold value
          linux: 0.0146, // 1.4532908422839719%
          macos: 0.0091, // 0.9040360459040109%
          windows: 0.0173, // 1.72613291189182%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          macos: 0.0013, // 0.12722390111935544%
          windows: 0.0059, // 0.5809509822745972%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          linux: 0.0003, // 0.024310386980885834%
          macos: 0.0015, // 0.14753246729929392%
          windows: 0.0072, // 0.7100461008680559%
        },
      ],
      [
        'pools.03.black.box',
        {
          linux: 0.0023, // 0.22636282955619252%
          macos: 0.0022, // 0.21007470164219333%
          windows: 0.0059, // 0.5856398049701173%
        },
      ],

      // tests without labels
      [
        'associations.and.annotations.01.general',
        {
          linux: 0.00074, // 0.07374499414004586%
          macos: 0.00074, // 0.07374499414004586%
          windows: 0.00074, // 0.07374499414004586%
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

  protected getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'flows.message.02.labels.and.complex.paths',
        {
          macos: 0.0059, // 0.5877773370643435%
        },
      ],
      [
        'labels.01.general',
        {
          // TODO possible rendering issue so high threshold value
          macos: 0.0225, // 2.2494371693738913%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          // TODO possible rendering issue so high threshold value
          macos: 0.059, // 5.875189976297179%
        },
      ],
      [
        'labels.03.default.position',
        {
          macos: 0.006, // 0.5967754875071174%
        },
      ],
      [
        'labels.04.fonts',
        {
          macos: 0.00625, // 0.6237033609582054%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          macos: 0.0025, // 0.24229404068003557%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          macos: 0.0026, // 0.24229404068003557%
        },
      ],
      [
        'pools.03.black.box',
        {
          macos: 0.0023, // 0.2242640286478026%
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
    'all.elements.fill.color',
    {
      bpmnContainer: { useAlternativeBackgroundColor: true },
    },
  ],
  [
    'associations.and.annotations.04.target.edges',
    {
      sequenceFlow: { useLightColors: true },
    },
  ],
]);

describe('BPMN rendering', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new ImageSnapshotThresholds(), 'bpmn');

  const pageTester = new PageTester({ pageFileName: 'non-regression', expectedPageTitle: 'BPMN Visualization Non Regression' });
  const bpmnDiagramNames = getBpmnDiagramNames('non-regression');

  it('check bpmn non-regression files availability', () => {
    expect(bpmnDiagramNames).toContain('gateways');
  });

  it.each(bpmnDiagramNames)(`%s`, async (bpmnDiagramName: string) => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
      styleOptions: styleOptionsPerDiagram.get(bpmnDiagramName),
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(config);
  });
});
