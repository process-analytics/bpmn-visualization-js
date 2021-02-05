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
import { ImageSnapshotConfigurator, ImageSnapshotThresholdConfig } from './helpers/visu/ImageSnapshotConfigurator';
import { PageTester } from './helpers/visu/PageTester';
import { getBpmnDiagramNames, getSimplePlatformName, getTestedBrowserFamily } from './helpers/test-utils';

function getChromiumImageSnapshotThresholdConfig(): Map<string, ImageSnapshotThresholdConfig> {
  // if no dedicated information, set minimal threshold to make test pass on Github Workflow
  // linux threshold are set for Ubuntu
  return new Map<string, ImageSnapshotThresholdConfig>([
    [
      'flows.message.02.labels.and.complex.paths',
      {
        linux: 0.000002, // 0.00018742700883533914%
        macos: 0.0011, // 0.10865713972554311%
        windows: 0.0012, // 0.11321398812403904%
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
        windows: 0.003, // 0.2970500950379207%
      },
    ],
    [
      'labels.04.fonts',
      {
        linux: 0.000002, // 0.00019304876757164635%
        macos: 0.0019, // 0.18334725431882193%
        windows: 0.0019, // 0.18553107384994272%
      },
    ],
    [
      'pools.01.labels.and.lanes',
      {
        linux: 0.002, // 0.19665548561466073%
        macos: 0.0016, // 0.15006201878846603%
        windows: 0.002, // 0.12200021675353723%
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
        windows: 0.0012, // 0.11539494876845469%
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
  ]);
}

function getFirefoxImageSnapshotThresholdConfig(): Map<string, ImageSnapshotThresholdConfig> {
  return new Map<string, ImageSnapshotThresholdConfig>([
    [
      'flows.message.02.labels.and.complex.paths',
      {
        linux: 0.0057, // 0.5659391676214987%
        macos: 0.0066, // 0.6594568058992278%
        // TODO issue here
        windows: 0.0138, // 1.3758143022190916%
      },
    ],
    [
      'labels.01.general',
      {
        // TODO we have an issue here, a break line is added in a sequence flow label
        linux: 0.0302, // 3.015066046429382%
        macos: 0.0315, // 3.1499673414102203%
        // TODO very big issue here!
        windows: 0.1358, // 13.577390503131248%
      },
    ],
    [
      'labels.02.position.and.line.breaks',
      {
        // TODO issue here
        linux: 0.0611, // 6.103097407124536%
        macos: 0.0664, // 6.638739310743825%
        // TODO very big issue here!
        windows: 0.1521, // 15.20945839043877%
      },
    ],
    [
      'labels.03.default.position',
      {
        linux: 0.004, // 0.39649363179047326%
        macos: 0.0083, // 0.8248769578137805%
        // TODO issue here
        windows: 0.0249, // 2.4808623720247835%
      },
    ],
    [
      'labels.04.fonts',
      {
        // TODO issue here
        linux: 0.0146, // 1.453465508401064%
        macos: 0.0091, // 0.904210646859438%
        windows: 0.0173, // 1.726307512847236%
      },
    ],
    [
      'pools.01.labels.and.lanes',
      {
        linux: 0.0021, // 0.2005349024704728%
        macos: 0.0016, // 0.1551411970842409%
        windows: 0.0058, // 0.5719640300611561%
      },
    ],
    [
      'pools.02.vertical.with.lanes',
      {
        macos: 0.0013, // 0.12998660434810907%
        windows: 0.007, // 0.6925002379168488%
      },
    ],
    [
      'pools.03.black.box',
      {
        linux: 0.0023, // 0.22636282955619252%
        macos: 0.0022, // 0.21007470164219333%
        windows: 0.0058, // 0.573840178860785%
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

function getImageSnapshotThresholdConfig(): Map<string, ImageSnapshotThresholdConfig> {
  switch (getTestedBrowserFamily()) {
    case 'chromium':
      return getChromiumImageSnapshotThresholdConfig();
    case 'firefox':
      return getFirefoxImageSnapshotThresholdConfig();
    default:
      return new Map<string, ImageSnapshotThresholdConfig>();
  }
}

function getDefaultFailureThreshold(): number | undefined {
  switch (getTestedBrowserFamily()) {
    case 'firefox':
      return 0.00011;
    // for chromium, use the default set in ImageSnapshotConfigurator
    case 'chromium':
    default:
      return undefined;
  }
}

describe('no BPMN elements visual regression', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(getImageSnapshotThresholdConfig(), 'bpmn', getDefaultFailureThreshold());

  const pageTester = new PageTester({ pageFileName: 'non-regression', expectedPageTitle: 'BPMN Visualization Non Regression' });
  const bpmnDiagramNames = getBpmnDiagramNames('non-regression');

  it('check bpmn non-regression files availability', () => {
    expect(bpmnDiagramNames).toContain('gateways');
  });

  it.each(bpmnDiagramNames)(`%s`, async (bpmnDiagramName: string) => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(config);
  });
});
