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
import { delay, getSimplePlatformName } from '../helpers/test-utils';
import { calculateMetrics, ChartData, PerformanceMetric } from '../helpers/perf-utils';
import * as fs from 'fs';
import { BpmnLoadMethod, PageTester } from '../helpers/visu/PageTester';

const platform = getSimplePlatformName();
const performanceDataFilePath = './performance/data/' + platform + '/data.js';
const metricsArray: Array<PerformanceMetric> = [];

describe.each([1, 2, 3, 4, 5])('zoom performance', run => {
  // to have mouse pointer visible during headless test - add 'showMousePointer=true' to queryParams
  const pageTester = new PageTester({ pageFileName: 'rendering-diagram', queryParams: [], expectedPageTitle: 'BPMN Visualization - Diagram Rendering' }, 'performance');

  const fileName = 'B.2.0';
  let viewportCenterX: number;
  let viewportCenterY: number;

  beforeEach(async () => {
    const bpmnContainerElementHandle = await pageTester.loadBPMNDiagramInRefreshedPage(fileName, BpmnLoadMethod.Url);
    const bounding_box = await bpmnContainerElementHandle.boundingBox();
    viewportCenterX = bounding_box.x + bounding_box.width / 2;
    viewportCenterY = bounding_box.y + bounding_box.height / 2;
  });

  it.each([30])(`ctrl + mouse: check performance while performing zoom in and zoom out [%s times]`, async (xTimes: number) => {
    const deltaX = -100;
    const metricsStart = await page.metrics();

    // simulate mouse+ctrl zoom
    await page.mouse.move(viewportCenterX + 200, viewportCenterY);
    await page.keyboard.down('Control');
    for (let i = 0; i < xTimes; i++) {
      await page.mouse.wheel({ deltaX: deltaX });
      if (i % 5 === 0) {
        await delay(30);
      }
    }
    await delay(100);
    for (let i = 0; i < xTimes; i++) {
      await page.mouse.wheel({ deltaX: -deltaX });
      if (i % 5 === 0) {
        await delay(30);
      }
    }
    await delay(100);
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
      zoom: oldData.zoom.concat(metricsArray),
      load: oldData.load,
    };
    fs.writeFileSync(performanceDataFilePath, 'const data = ' + JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
});
