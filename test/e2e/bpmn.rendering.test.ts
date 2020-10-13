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
import { findFiles } from '../helpers/file-helper';
import { BpmnDiagramPreparation, BpmnLoadMethod, ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, PageTester } from './helpers/visu-utils';

describe('no visual regression', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(
    new Map<string, ImageSnapshotThresholdConfig>([
      [
        'flows.message.02.labels-and-complex-paths', // minimal threshold to make test pass on Github Workflow
        // ubuntu: Expected image to match or be a close match to snapshot but was 0.00018742700883533914%
        // macOS: Expected image to match or be a close match to snapshot but was 0.10865713972554311%
        // windows: Expected image to match or be a close match to snapshot but was 0.11321398812403904%
        {
          linux: 0.000002,
          macos: 0.0011,
          windows: 0.0012,
        },
      ],
      [
        'labels.01.general', // minimal threshold to make test pass on Github Workflow
        // ubuntu: Expected image to match or be a close match to snapshot but was 0.46065520175824215%
        // macOS: Expected image to match or be a close match to snapshot but was 0.733363909363971%
        // windows: Expected image to match or be a close match to snapshot but was 0.40964885362031467%
        {
          linux: 0.0047,
          macos: 0.0074,
          windows: 0.005,
        },
      ],
      [
        'labels.02.position-and-line-breaks',
        // ubuntu:  1 character change: 0.09528559852869378%
        // macOS: Expected image to match or be a close match to snapshot but was 0.766651632718518%
        // windows: Expected image to match or be a close match to snapshot but was 0.6363888273688278%
        {
          linux: 0.0009,
          macos: 0.008,
          windows: 0.007,
        },
      ],
      [
        'labels.03.default.position',
        {
          // Expected image to match or be a close match to snapshot but was 0.0008459985669673209%
          linux: 0.000009,
          // Expected image to match or be a close match to snapshot but was 0.4666976128188338%
          macos: 0.005,
          // Expected image to match or be a close match to snapshot but was 0.2970500950379207%
          windows: 0.003,
        },
      ],
      // ubuntu: Expected image to match or be a close match to snapshot but was 0.19665548561466073%
      // macOS: Expected image to match or be a close match to snapshot but was 0.15006201878846603%
      // windows: Expected image to match or be a close match to snapshot but was 0.12200021675353723%
      [
        'pools.01.labels-and-lanes',
        {
          linux: 0.002,
          macos: 0.0016,
          windows: 0.002,
        },
      ],
      // ubuntu: Expected image to match or be a close match to snapshot but was 0.13132100299135807%
      // macOS: Expected image to match or be a close match to snapshot but was 0.14776609441433664%
      // windows: Expected image to match or be a close match to snapshot but was 0.1182792778311903%
      [
        'pools.02.vertical.with-lanes',
        {
          linux: 0.0014,
          macos: 0.0015,
          windows: 0.002,
        },
      ],
      // ubuntu: Expected image to match or be a close match to snapshot but was 0.0043243364134193385% different from snapshot
      // macOS: Expected image to match or be a close match to snapshot but was 0.07646269456225152% different from snapshot
      // windows: Expected image to match or be a close match to snapshot but was 0.11539494876845469% different from snapshot
      [
        'pools.03.black-box',
        {
          linux: 0.00005,
          macos: 0.0008,
          windows: 0.0012,
        },
      ],
    ]),
  );

  const bpmnDiagramPreparation = new BpmnDiagramPreparation(
    new Map<string, BpmnLoadMethod>([
      ['events', BpmnLoadMethod.Url],
      ['markers.01.positioning', BpmnLoadMethod.Url],
    ]),
    { name: 'non-regression' },
    'non-regression',
  );

  const pageTester = new PageTester(bpmnDiagramPreparation, 'viewport', 'BPMN Visualization Non Regression');

  const bpmnFileNames = findFiles('../fixtures/bpmn/non-regression/')
    .filter(filename => {
      return filename.endsWith('.bpmn');
    })
    .map(filename => {
      return filename.split('.').slice(0, -1).join('.');
    });

  it('check bpmn non-regression files availability', () => {
    expect(bpmnFileNames).toContain('gateways');
  });

  it.each(bpmnFileNames)(`%s`, async (fileName: string) => {
    await pageTester.expectBpmnDiagramToBeDisplayed(fileName);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot(imageSnapshotConfigurator.getConfig(fileName));
  });
});
