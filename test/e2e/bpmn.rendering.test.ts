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
import type { Page } from 'playwright';
import { getBpmnDiagramNames } from '@test/shared/visu/test-utils';
import type { StyleOptions } from '@test/shared/visu/bpmn-page-utils';
import { AvailableTestPages, PageTester } from '@test/shared/visu/bpmn-page-utils';
import type { ImageSnapshotThresholdConfig } from './helpers/visu/image-snapshot-config';
import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    // threshold for webkit is taken from macOS only
    super({ chromium: 0.009 / 100, firefox: 0.02 / 100, webkit: 0.12 / 100 });
  }

  protected override getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on GitHub Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      // start with diagram including labels
      [
        'flows.message.02.labels.and.complex.paths',
        {
          linux: 0.03 / 100, // 0.021112197671391275%
          macos: 0.07 / 100, // 0.06413016822180982%
          windows: 0.15 / 100, // 0.1429326405050113%
        },
      ],
      [
        'group.01.in.process.with.label',
        {
          linux: 0.03 / 100, // 0.027579683731493443%
          macos: 0.05 / 100, // 0.04504221581033141%
          windows: 0.06 / 100, // 0.0563456027189768%
        },
      ],
      [
        'group.02.in.collaboration.with.label',
        {
          linux: 0.02 / 100, // 0.013564051057024518%
          macos: 0.03 / 100, // 0.024852910755979174%
          windows: 0.05 / 100, // 0.044700592690916086%
        },
      ],
      [
        'labels.01.general',
        {
          linux: 0.02 / 100, // 0.017198744741930838%
          macos: 0.8 / 100, // 0.7941577314545922%
          windows: 0.52 / 100, // 0.5122398889742197%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          linux: 0.05 / 100, // 0.04820572362378428%
          macos: 0.97 / 100, // 0.9608986974041889%
          windows: 0.63 / 100, // 0.6249408985672167%
        },
      ],
      [
        'labels.03.default.position',
        {
          linux: 0.02 / 100, // 0.012776491483779129%
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
          macos: 0.13 / 100, // 0.1226965940445024%
          windows: 0.23 / 100, // 0.21990738071808735%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          macos: 0.16 / 100, // 0.15541529608473773%
          windows: 0.14 / 100, // 0.13308164928160784%
        },
      ],
      [
        'pools.03.black.box',
        {
          macos: 0.11 / 100, // 0.10700131148185799%
          windows: 0.12 / 100, // 0.1184446265753869%
        },
      ],
      [
        'pools.04.not.displayed.with.elements',
        {
          macos: 0.011 / 100, // 0.010651827942065317%
        },
      ],
      // tests without labels
      [
        'associations.and.annotations.01.general',
        {
          macos: 0.032 / 100, // 0.03104752073704864%
        },
      ],
      [
        'associations.and.annotations.02.complex.paths',
        {
          linux: 0.015 / 100, // 0.014863828948641356%
          macos: 0.053 / 100, // 0.052455761998149164%
          windows: 0.015 / 100, // 0.014863828948641356%
        },
      ],
      [
        'associations.and.annotations.03.waypoints.01.inside.shape',
        {
          macos: 0.01 / 100, // 0.009821122543585137%
        },
      ],
      [
        'associations.and.annotations.03.waypoints.02.outside.shape',
        {
          macos: 0.046 / 100, // 0.04565435126099304%
        },
      ],
      [
        'associations.and.annotations.03.waypoints.03.none',
        {
          macos: 0.013 / 100, // 0.012421906075676947%
        },
      ],
      [
        'associations.and.annotations.04.target.edges',
        {
          macos: 0.013 / 100, // 0.012958722982014947%
        },
      ],
      [
        'associations.and.annotations.05.target.edges.no.waypoints',
        {
          macos: 0.013 / 100, // 0.012481029857225323%
        },
      ],
      [
        'call.activities',
        {
          macos: 0.015 / 100, // 0.014471908405144784%
        },
      ],
      [
        'events',
        {
          linux: 0.07 / 100, // 0.06873063882651965%
          macos: 0.15 / 100, // 0.1429705389616731%
          windows: 0.07 / 100, // 0.06873063882651965%
        },
      ],
      [
        'flows.message.01.icons',
        {
          macos: 0.09 / 100, // 0.08622016687080958%
        },
      ],
      [
        'flows.message.02.labels.and.complex.paths',
        {
          macos: 0.074 / 100, // 0.07351618297872786%
        },
      ],
      [
        'flows.message.03.waypoints.01.none',
        {
          macos: 0.014 / 100, // 0.013230216124793248%
        },
      ],
      [
        'flows.message.03.waypoints.02.inside',
        {
          macos: 0.018 / 100, // 0.017396505351174874%
        },
      ],
      [
        'flows.message.03.waypoints.03.outside',
        {
          macos: 0.018 / 100, // 0.017448981233758598%
        },
      ],
      [
        'flows.message.03.waypoints.04.outside.segments.no.intersection.with.shapes',
        {
          macos: 0.018 / 100, // 0.01705591121203831%
        },
      ],
      [
        'flows.sequence.01.kinds.and.complex.paths',
        {
          macos: 0.046 / 100, // 0.04525235200248945%
        },
      ],
      [
        'flows.sequence.02.events.from.to',
        {
          macos: 0.033 / 100, // 0.03252073308086523%
        },
      ],
      [
        'flows.sequence.03.gateways.from.to',
        {
          macos: 0.025 / 100, // 0.024563288410006656%
        },
      ],
      [
        'flows.sequence.04.waypoints.01.none',
        {
          linux: 0.013 / 100, // 0.012784947599830954%
          macos: 0.034 / 100, // 0.03348060921085638%
          windows: 0.013 / 100, // 0.012784947599830954%
        },
      ],
      [
        'flows.sequence.04.waypoints.02.terminal.inside.shapes',
        {
          macos: 0.032 / 100, // 0.03182084724950851%
        },
      ],
      [
        'flows.sequence.04.waypoints.03.terminal.outside.shapes.01.general',
        {
          macos: 0.026 / 100, // 0.025442484061721782%
        },
      ],
      [
        'flows.sequence.04.waypoints.03.terminal.outside.shapes.02.segments.no.intersection.with.shapes',
        {
          macos: 0.039 / 100, // 0.03833616437499687%
        },
      ],
      [
        'flows.sequence.04.waypoints.04.terminal.bonita.events',
        {
          linux: 0.013 / 100, // 0.012102508336264695%
          macos: 0.023 / 100, // 0.02240063479596044%
          windows: 0.013 / 100, // 0.012102508336264695%
        },
      ],
      [
        'flows.sequence.04.waypoints.05.terminal.bonita.gateways',
        {
          macos: 0.019 / 100, // 0.018518769555930792%
        },
      ],
      [
        'flows.sequence.05.markers',
        {
          macos: 0.031 / 100, // 0.030249892742950646%
        },
      ],
      [
        'gateways',
        {
          macos: 0.015 / 100, // 0.014442981030360347%
        },
      ],
      [
        'group.03.several.groups.different.size',
        {
          linux: 0.019 / 100, // 0.01833011862978351%
          macos: 0.037 / 100, // 0.03616235985035576%
          windows: 0.019 / 100, // 0.01833011862978351%
        },
      ],
      [
        'group.05.cross.pools',
        {
          linux: 0.017 / 100, // 0.016330929320085286%
          macos: 0.017 / 100, // 0.016330929320085286%
          windows: 0.017 / 100, // 0.016330929320085286%
        },
      ],
      [
        'markers.01.positioning',
        {
          linux: 0.08 / 100, // 0.0709857394639246%
          macos: 0.12 / 100, // 0.11335331404938032%
          windows: 0.08 / 100, // 0.0709857394639246%
        },
      ],
      [
        'markers.02.different.tasks.sizes',
        {
          macos: 0.02 / 100, // 0.018522656298003426%
        },
      ],
      [
        'subprocess.01.with.lanes',
        {
          macos: 0.05 / 100, // 0.04841555756042171%
        },
      ],
      [
        'subprocess.02.with.inner.subprocess',
        {
          macos: 0.03 / 100, // 0.029195380649782443%
        },
      ],
      [
        'subprocess.03.collapsed.with.elements',
        {
          linux: 0.013 / 100, // 0.01247161458035606%
          macos: 0.024 / 100, // 0.023238318327312157%
          windows: 0.013 / 100, // 0.01247161458035606%
        },
      ],
      [
        'subprocess.04.expanded.with.elements',
        {
          linux: 0.031 / 100, // 0.030667450146004693%
          macos: 0.04 / 100, // 0.039096596863918975%
          windows: 0.031 / 100, // 0.030667450146004693%
        },
      ],
      [
        'tasks',
        {
          macos: 0.05 / 100, // 0.04267935203429163%
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
      [
        'labels.01.general',
        {
          // high values due to font rendering discrepancies with chromium rendering
          linux: 1.15 / 100, // 1.1412952972301604%
          macos: 1.72 / 100, // 1.7113512021706412%
          windows: 12.85 / 100, // 12.8418857562695% - different word wrapping, see https://github.com/process-analytics/bpmn-visualization-js/pull/2790#issuecomment-1680765999
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
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new ImageSnapshotThresholds(), 'bpmn-rendering');

  const diagramSubfolder = 'bpmn-rendering';
  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder }, <Page>page);
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
