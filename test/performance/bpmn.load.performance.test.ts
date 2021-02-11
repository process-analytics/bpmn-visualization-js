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
import { getSimplePlatformName } from '../e2e/helpers/test-utils';
import * as fs from 'fs';
import { calculateMetrics, ChartData, getPageMetrics, PerformanceMetric } from './helpers/perf-utils';
import { PageTester } from '../e2e/helpers/visu/PageTester';
import { chromiumMetrics } from './helpers/metrics-chromium';

const platform = getSimplePlatformName();
const performanceDataFilePath = './test/performance/data/' + platform + '/data.js';
const metricsArray: Array<PerformanceMetric> = [];

describe.each([1])('load performance', run => {
  // to have mouse pointer visible during headless test - add 'showMousePointer: true' as parameter
  const pageTester = new PageTester({ pageFileName: 'rendering-diagram', expectedPageTitle: 'BPMN Visualization - Diagram Rendering' });
  const fileName = 'B.2.0';

  it.each([1])('check performance for file loading and displaying diagram with FitType.HorizontalVertical', async () => {
    const metricsStart = await chromiumMetrics(page);
    // const metricsStart = await getPageMetrics(page);
    await pageTester.loadBPMNDiagramInRefreshedPage(fileName);
    const metricsEnd = await chromiumMetrics(page);
    // const metricsEnd = await getPageMetrics(page);

    // const metric = { ...calculateMetrics(metricsStart, metricsEnd), run: run };
    // metricsArray.push(metric);
    expect(true).toBe(true);
  });
});
// afterAll(() => {
//   try {
//     const oldDataString = fs.readFileSync(performanceDataFilePath, 'utf8');
//     const oldData = JSON.parse(oldDataString.substring('const data = '.length, oldDataString.length)) as ChartData;
//     const data = {
//       zoom: oldData.zoom,
//       load: oldData.load.concat(metricsArray),
//     };
//     fs.writeFileSync(performanceDataFilePath, 'const data = ' + JSON.stringify(data));
//   } catch (err) {
//     console.error(err);
//   }
// });
