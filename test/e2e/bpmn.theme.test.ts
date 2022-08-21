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
import type { StyleOptions } from './helpers/visu/bpmn-page-utils';
import { AvailableTestPages, PageTester } from './helpers/visu/bpmn-page-utils';
import { ImageSnapshotConfigurator, MultiBrowserImageSnapshotThresholds } from './helpers/visu/image-snapshot-config';
import type { Page } from 'playwright';

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
  [
    'theme-light-blue',
    {
      theme: 'light-blue',
    },
  ],
]);

describe('BPMN theme', () => {
  // chromium max: 0.000039994806566578944%
  // firefox max for all OS: 0.05276323813941941%
  // webkit max: 0.08257897420939077%
  const imageSnapshotConfigurator = new ImageSnapshotConfigurator(
    new MultiBrowserImageSnapshotThresholds({ chromium: 0.00004 / 100, firefox: 0.053 / 100, webkit: 0.083 / 100 }),
    'theme',
  );

  const pageTester = new PageTester({ targetedPage: AvailableTestPages.BPMN_RENDERING, diagramSubfolder: 'theme' }, <Page>page);
  const useCases = Array.from(styleOptionsPerUseCase.keys());

  it.each(useCases)(`Use case %s`, async (useCase: string) => {
    await pageTester.gotoPageAndLoadBpmnDiagram('01.most.bpmn.types.without.label', {
      styleOptions: styleOptionsPerUseCase.get(useCase),
    });

    const image = await page.screenshot({ fullPage: true });
    const config = imageSnapshotConfigurator.getConfig(useCase);
    expect(image).toMatchImageSnapshot(config);
  });
});
