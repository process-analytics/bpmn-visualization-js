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
import { PageTester } from './helpers/visu/PageTester';

class ImageSnapshotThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: defaultChromiumFailureThreshold, firefox: 0.00011 });
  }

  getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    // if no dedicated information, set minimal threshold to make test pass on Github Workflow
    // linux threshold are set for Ubuntu
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'overlays.start.flow.task',
        {
          linux: 0.0024, // 0.2237761571968533%
          macos: 0.0008, // 0.0729159761465925%
          windows: 0.000004,
        },
      ],
    ]);
  }

  getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return new Map<string, ImageSnapshotThresholdConfig>([
      [
        'overlays.start.flow.task',
        {
          linux: 0.000004,
          macos: 0.000004,
          windows: 0.000004,
        },
      ],
    ]);
  }
}

describe('BPMN elements with overlays', () => {
  const imageSnapshotThresholds = new ImageSnapshotThresholds();
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(imageSnapshotThresholds.getThresholds(), 'overlays', imageSnapshotThresholds.getDefault());

  const pageTester = new PageTester({ pageFileName: 'overlays', expectedPageTitle: 'BPMN Visualization Overlays' });
  const bpmnDiagramName = 'overlays.start.flow.task';

  it('Check badges are present on StartEvent, Flow, Task', async () => {
    const bpmnContainerElementHandle = await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName);
    await bpmnContainerElementHandle.waitForSelector('svg > g > g:nth-child(3) > g[data-bpmn-id="StartEvent_1"]');
    await bpmnContainerElementHandle.waitForSelector('svg > g > g:nth-child(3) > g[data-bpmn-id="Flow_1"]');
    await bpmnContainerElementHandle.waitForSelector('svg > g > g:nth-child(3) > g[data-bpmn-id="Activity_1"]');

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(config);
  });
});
