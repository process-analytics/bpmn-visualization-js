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
import { PageTester } from './helpers/visu/bpmn-page-utils';
import { getBpmnDiagramNames } from './helpers/test-utils';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  // threshold for webkit is taken from macOS only
  constructor() {
    super({ chromium: defaultChromiumFailureThreshold, firefox: 0.00011, webkit: 0.001 });
  }

  getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on Github Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'flows.message.02.labels.and.complex.paths',
        {
          macos: 0.0011, // 0.10876549756859696%
          windows: 0.004, // 0.39686093001266576%
        },
      ],
      [
        'labels.01.general',
        {
          linux: 0.0047, // 0.46065520175824215%
          macos: 0.0074, // 0.733363909363971%
          windows: 0.005, // 0.40964885362031467%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          linux: 0.0009, // ubuntu: 1 character change: 0.09528559852869378%
          macos: 0.008, // 0.766651632718518%
          windows: 0.007, // 0.6363888273688278%
        },
      ],
      [
        'labels.03.default.position',
        {
          linux: 0.000009, // 0.0008459985669673209%
          macos: 0.005, // 0.4666976128188338%
          windows: 0.0032, // 0.3130780811589351%
        },
      ],
      [
        'labels.04.fonts',
        {
          linux: 0.000002, // 0.00019304876757164635%
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
          linux: 0.00005, // 0.0043243364134193385%
          macos: 0.0008, // 0.07646269456225152%
          windows: 0.0013, // 0.12511544978087707%
        },
      ],
      // tests without labels
      [
        'events',
        {
          macos: 0.00002, // 0.001366648725187325%
        },
      ],
      [
        'gateways',
        {
          macos: 0.000006, // 0.0005804554357724534%
        },
      ],
      [
        'call.activities',
        {
          macos: 0.000013, // 0.0012877039801018064%
          windows: 0.000013, // 0.0012877039801018064%
          linux: 0.000013, // 0.0012877039801018064%
        },
      ],
    ]);
  }

  getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
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
        'labels.01.general',
        {
          // TODO possible rendering issue so high threshold value
          linux: 0.0302, // 3.015066046429382%
          macos: 0.0315, // 3.1499673414102203%
          // very high threshold
          windows: 0.1358, // 13.577390503131248%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          // TODO possible rendering issue so high threshold value
          linux: 0.0611, // 6.103097407124536%
          macos: 0.0664, // 6.638739310743825%
          // very high threshold
          windows: 0.1521, // 15.20945839043877%
        },
      ],
      [
        'labels.03.default.position',
        {
          linux: 0.0041, // 0.4028583275889175%
          macos: 0.0083, // 0.8248769578137805%
          // TODO possible rendering issue so high threshold value
          windows: 0.0249, // 2.4808623720247835%
        },
      ],
      [
        'labels.04.fonts',
        {
          // TODO possible rendering issue so high threshold value
          linux: 0.0146, // 1.453465508401064%
          macos: 0.0091, // 0.904210646859438%
          windows: 0.0174, // 1.730192454959012%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          linux: 0.0003, // 0.024310386980885834%
          macos: 0.0013, // 0.12676895564825985%
          windows: 0.0059, // 0.5890989610360386%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          linux: 0.0003, // 0.024310386980885834%
          macos: 0.0015, // 0.14753246729929392%
          windows: 0.007, // 0.6917918122653188%
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
          linux: 0.00085, // 0.08411807630511749%
          macos: 0.00085, // 0.08411807630511749%
          windows: 0.00085, // 0.08411807630511749%
        },
      ],
      [
        'markers.01.positioning',
        {
          linux: 0.00022, // 0.021276591755792218%
          macos: 0.00022, // 0.021276591755792218%
          windows: 0.00022, // 0.021276591755792218%
        },
      ],
      [
        'markers.02.different.tasks.sizes',
        {
          linux: 0.00021, // 0.020843383822821693%
          macos: 0.00021, // 0.020843383822821693%
          windows: 0.00021, // 0.020843383822821693%
        },
      ],
      [
        'subprocess.03.collapsed.with.elements',
        {
          linux: 0.0025, // 0.24225262309340861%
          macos: 0.0025, // 0.24225262309340861%
          windows: 0.0025, // 0.24225262309340861%
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
          macos: 0.0243, // 2.4291837017836326%
        },
      ],
      [
        'labels.02.position.and.line.breaks',
        {
          // TODO possible rendering issue so high threshold value
          macos: 0.011, // 1.095951298813913%
        },
      ],
      [
        'labels.03.default.position',
        {
          macos: 0.006, // 0.596780142516129%
        },
      ],
      [
        'labels.04.fonts',
        {
          macos: 0.00625, // 0.6239949108655218%
        },
      ],
      [
        'pools.01.labels.and.lanes',
        {
          macos: 0.0025, // 0.24222621302452113%
        },
      ],
      [
        'pools.02.vertical.with.lanes',
        {
          macos: 0.0026, // 0.2507885782029983%
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
          macos: 0.0014, // 0.13948026408254768%
        },
      ],
    ]);
  }
}

const useSequenceFlowLightColorOptions = new Map<string, boolean>([['associations.and.annotations.04.target.edges', true]]);

describe('BPMN rendering', () => {
  const imageSnapshotThresholds = new ImageSnapshotThresholds();
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(imageSnapshotThresholds.getThresholds(), 'bpmn', imageSnapshotThresholds.getDefault());

  const pageTester = new PageTester({ pageFileName: 'non-regression', expectedPageTitle: 'BPMN Visualization Non Regression' });
  const bpmnDiagramNames = getBpmnDiagramNames('non-regression');

  it('check bpmn non-regression files availability', () => {
    expect(bpmnDiagramNames).toContain('gateways');
  });

  it.each(bpmnDiagramNames)(`%s`, async (bpmnDiagramName: string) => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
      styleOptions: { sequenceFlow: { useLightColors: useSequenceFlowLightColorOptions.get(bpmnDiagramName) ?? false } },
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(config);
  });
});
