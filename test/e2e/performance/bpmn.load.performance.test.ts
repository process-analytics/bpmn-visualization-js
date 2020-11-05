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
import { BpmnDiagramPreparation, BpmnLoadMethod, getSimplePlatformName, PageTester } from '../helpers/visu-utils';
import * as fs from 'fs';
import { calculateMetrics, ChartData } from '../helpers/perf-utils';
import { FitType } from '../../../src/component/Options';

interface PerformanceMetric {
  run: number;
  TaskDuration: number;
  ScriptDuration: number;
  RecalcStyleDuration: number;
  LayoutDuration: number;
}

const platform = getSimplePlatformName();
const performanceDataFilePath = './performance/data/' + platform + '/data.js';
const metricsArray: Array<PerformanceMetric> = [];

describe.each([1, 2, 3, 4, 5])('load performance', run => {
  // to have mouse pointer visible during headless test - add 'showMousePointer=true' to queryParams

  const fileName = 'B.2.0';

  it.each([1])('check performance for file loading and displaying diagram with FitType.Center', async () => {
    const metricsStart = await page.metrics();
    const bpmnDiagramPreparation = new BpmnDiagramPreparation(new Map([['B.2.0', BpmnLoadMethod.Url]]), { name: 'navigation-diagram', queryParams: [] }, 'performance', {
      fit: { type: FitType.Center },
    });
    const pageTester = new PageTester(bpmnDiagramPreparation, 'bpmn-viewport', 'BPMN Visualization - Diagram Navigation');
    await pageTester.expectBpmnDiagramToBeDisplayed(fileName);
    const metricsEnd = await page.metrics();

    const metric = { ...calculateMetrics(metricsStart, metricsEnd), run: run };
    metricsArray.push(metric);
    expect(true).toBe(true);
  });
});
afterAll(() => {
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
