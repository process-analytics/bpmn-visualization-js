import { PageTester, StyleOptions } from './helpers/visu/bpmn-page-utils';
import { ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import { Page } from 'playwright';
import { getBpmnDiagramNames } from './helpers/test-utils';

/**
 * Copyright 2022 Bonitasoft S.A.
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

// TODO change to do it per use case
const styleOptionsPerDiagram = new Map<string, StyleOptions>([
  [
    'all.elements.fill.color',
    {
      bpmnContainer: { useAlternativeBackgroundColor: true },
    },
  ],
]);

class NoSpecificThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: 0, firefox: 0, webkit: 0 });
  }
  protected getChromiumThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return undefined;
  }

  protected getFirefoxThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return undefined;
  }

  protected getWebkitThresholds(): Map<string, ImageSnapshotThresholdConfig> {
    return undefined;
  }
}

describe('BPMN theme', () => {
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new NoSpecificThresholds(), 'bpmn');

  const pageTester = new PageTester({ pageFileName: 'non-regression', expectedPageTitle: 'BPMN Visualization Non Regression' }, <Page>page);
  const bpmnDiagramNames = getBpmnDiagramNames('theme');

  it.each(bpmnDiagramNames)(`%s`, async (bpmnDiagramName: string) => {
    await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
      styleOptions: styleOptionsPerDiagram.get(bpmnDiagramName),
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(bpmnDiagramName);
    expect(image).toMatchImageSnapshot(config);
  });
});
