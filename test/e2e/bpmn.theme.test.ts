import { PageTester, StyleOptions } from './helpers/visu/bpmn-page-utils';
import { ImageSnapshotConfigurator, ImageSnapshotThresholdConfig, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import { Page } from 'playwright';

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

const styleOptionsPerUseCase = new Map<string, StyleOptions>([
  [
    'container-background',
    {
      bpmnContainer: { useAlternativeBackgroundColor: true },
    },
  ],
  [
    'theme-dark',
    {
      theme: 'dark',
    },
  ],
  [
    'theme-brown',
    {
      theme: 'brown',
    },
  ],
]);

const miniThreshold = 0.000000002;
class NoSpecificThresholds extends MultiBrowserImageSnapshotThresholds {
  constructor() {
    super({ chromium: miniThreshold, firefox: 0.06 / 100, webkit: miniThreshold });
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
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(new NoSpecificThresholds(), 'theme');

  const pageTester = new PageTester({ pageFileName: 'non-regression', expectedPageTitle: 'BPMN Visualization Non Regression' }, <Page>page);
  const useCases = Array.from(styleOptionsPerUseCase.keys());

  it.each(useCases)(`Use case %s`, async (useCase: string) => {
    await pageTester.loadBPMNDiagramInRefreshedPage('01.no.labels.most.bpmn.types', {
      styleOptions: styleOptionsPerUseCase.get(useCase),
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(useCase);
    expect(image).toMatchImageSnapshot(config);
  });
});
