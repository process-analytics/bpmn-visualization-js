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
import { expect, PlaywrightTestArgs, test } from '@playwright/test';
import { getBpmnDiagramNames } from './helpers/test-utils';
import { PageTester, StyleOptions } from './helpers/bpmn-page-utils';

const styleOptionsPerDiagram = new Map<string, StyleOptions>([
  [
    'associations.and.annotations.04.target.edges',
    {
      sequenceFlow: { useLightColors: true },
    },
  ],
]);

test.describe.parallel('BPMN rendering', () => {
  let pageTester: PageTester;
  const bpmnDiagramNames = getBpmnDiagramNames('non-regression');

  test.beforeEach(async ({ page }: PlaywrightTestArgs) => {
    pageTester = new PageTester({ pageFileName: 'non-regression', expectedPageTitle: 'BPMN Visualization Non Regression' }, page);
  });

  test('check bpmn non-regression files availability', () => {
    expect(bpmnDiagramNames).toContain('gateways');
  });

  for (const bpmnDiagramName of bpmnDiagramNames) {
    test(bpmnDiagramName, async ({ page }: PlaywrightTestArgs) => {
      await pageTester.loadBPMNDiagramInRefreshedPage(bpmnDiagramName, {
        styleOptions: styleOptionsPerDiagram.get(bpmnDiagramName),
      });

      const image = await page.screenshot({ fullPage: true });
      await expect(image).toMatchSnapshot([bpmnDiagramName, `${bpmnDiagramName}.png`]);
    });
  }
});
