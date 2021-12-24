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
import { PlaywrightTestArgs, test } from '@playwright/test';
import * as fs from 'fs';
import { getSimplePlatformName } from '../e2e/helpers/test-utils';
import { PageTester } from '../e2e/helpers/visu/bpmn-page-utils';
import { ChromiumMetricsCollector } from './helpers/metrics-chromium';
import { calculateMetrics, ChartData, PerformanceMetric } from './helpers/perf-utils';

const platform = getSimplePlatformName();
const performanceDataFilePath = './test/performance/data/' + platform + '/data.js';
const metricsArray: Array<PerformanceMetric> = [];

// to have mouse pointer visible during headless test - add 'showMousePointer: true' as parameter
let pageTester: PageTester;
let metricsCollector: ChromiumMetricsCollector;

const fileName = 'B.2.0';

for (const run of [1, 2, 3, 4, 5]) {
  test.describe(`load performance [${run} times]`, () => {
    test.beforeEach(async ({ page }: PlaywrightTestArgs) => {
      pageTester = new PageTester({ pageFileName: 'diagram-navigation', expectedPageTitle: 'BPMN Visualization - Diagram Navigation' }, page);
      metricsCollector = await ChromiumMetricsCollector.create(page);
    });

    test('check performance for file loading and displaying diagram with FitType.HorizontalVertical', async () => {
      const metricsStart = await metricsCollector.metrics();
      await pageTester.loadBPMNDiagramInRefreshedPage(fileName);
      const metricsEnd = await metricsCollector.metrics();

      const metric = { ...calculateMetrics(metricsStart, metricsEnd), run: run };
      metricsArray.push(metric);
      test.expect(true).toBe(true);
    });

    test.afterEach(async () => {
      await metricsCollector.destroy();
      try {
        const oldDataString = fs.readFileSync(performanceDataFilePath, 'utf8');
        const oldData = JSON.parse(oldDataString.substring('const data = '.length, oldDataString.length)) as ChartData;
        const data = {
          zoom: oldData.zoom,
          load: oldData.load.concat(metricsArray),
        };
        fs.writeFileSync(performanceDataFilePath, 'const data = ' + JSON.stringify(data));
      } catch (err) {
        console.error(err);
      }
    });
  });
}
