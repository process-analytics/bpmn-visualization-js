/**
 * Copyright 2021 Bonitasoft S.A.
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
import { existsSync } from 'fs';
import { resolve } from 'path';
import { BpmnPageSvgTester } from '../e2e/helpers/bpmn-page-utils';

test.describe('bundles', () => {
  test.describe('All bundles have been generated', () => {
    const bundlesDirectoryPath = resolve(__dirname, '../../dist');

    for (const { file, bundleType } of [
      { file: 'bpmn-visualization.cjs.js', bundleType: 'CommonJS' },
      { file: 'bpmn-visualization.cjs.min.js', bundleType: 'CommonJS minified' },
      { file: 'bpmn-visualization.esm.js', bundleType: 'ESM' },
      { file: 'bpmn-visualization.esm.min.js', bundleType: 'ESM minified' },
      { file: 'bpmn-visualization.js', bundleType: 'IIFE' },
      { file: 'bpmn-visualization.min.js', bundleType: 'IIFE minified' },
    ]) {
      test(bundleType, () => {
        expect(existsSync(resolve(bundlesDirectoryPath, file))).toBe(true);
      });
    }
  });

  test('IIFE bundle - should generate BPMN Diagram SVG', async ({ page }: PlaywrightTestArgs) => {
    const pageTester = new BpmnStaticPageSvgTester(
      { pageFileName: 'lib-integration-iife', expectedPageTitle: 'BPMN Visualization IIFE bundle', bpmnContainerId: 'bpmn-container-for-iife-bundle' },
      page,
    );
    await pageTester.loadBPMNDiagramInRefreshedPage();

    await pageTester.expectEvent('StartEvent_1', 'Start Event 1');
    await pageTester.expectSequenceFlow('Flow_1', 'Sequence Flow 1');
    await pageTester.expectTask('Activity_1', 'Task 1');
    await pageTester.expectSequenceFlow('Flow_2');
    await pageTester.expectEvent('EndEvent_1', 'End Event 1', false);
  });
});

class BpmnStaticPageSvgTester extends BpmnPageSvgTester {
  override async loadBPMNDiagramInRefreshedPage(): Promise<void> {
    const url = `file://${resolve(__dirname, `static/${this.targetedPage.pageFileName}.html`)}`;
    await super.doLoadBPMNDiagramInRefreshedPage(url, false);
  }
}
