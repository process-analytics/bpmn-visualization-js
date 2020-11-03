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
import { BpmnDiagramPreparation, BpmnLoadMethod, delay, getSimplePlatformName, PageTester } from '../helpers/visu-utils';
import { calculateMetrics, ChartData, PerformanceMetric } from '../helpers/perf-utils';
import { Mouse } from 'puppeteer';
import * as fs from 'fs';
// FIXME - to be fixed when new release of puppeteer comes out
// wheel is added in version @types/puppeteer 2.1.5 but for some reason not in 3.0.2
// perhaps will be soon available in 3.0.3
// @see https://github.com/puppeteer/puppeteer/pull/6141/files
interface MouseWheelOptions {
  /**
   * X delta in CSS pixels for mouse wheel event (default: 0). Positive values emulate a scroll up and negative values a scroll down event.
   * @default 0
   */
  deltaX?: number;
  /**
   *  Y delta in CSS pixels for mouse wheel event (default: 0). Positive values emulate a scroll right and negative values a scroll left event.
   * @default 0
   */
  deltaY?: number;
}
interface MouseWithWheel extends Mouse {
  /**
   * Dispatches a `mousewheel` event.
   * @param options The mouse wheel options.
   */
  wheel(options?: MouseWheelOptions): Promise<void>;
}

const platform = getSimplePlatformName();
const performanceDataFilePath = './performance/data/' + platform + '/data.js';
const metricsArray: Array<PerformanceMetric> = [];

describe.each([1, 2, 3, 4, 5])('diagram navigation performance', run => {
  // to have mouse pointer visible during headless test - add 'showMousePointer=true' to queryParams
  const bpmnDiagramPreparation = new BpmnDiagramPreparation(new Map([['B.2.0', BpmnLoadMethod.Url]]), { name: 'navigation-diagram', queryParams: [] }, 'performance');

  const pageTester = new PageTester(bpmnDiagramPreparation, 'bpmn-viewport', 'BPMN Visualization - Diagram Navigation');

  const fileName = 'B.2.0';
  let viewportCenterX: number;
  let viewportCenterY: number;

  beforeEach(async () => {
    const bpmnViewportElementHandle = await pageTester.expectBpmnDiagramToBeDisplayed(fileName);
    const bounding_box = await bpmnViewportElementHandle.boundingBox();
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
      await (<MouseWithWheel>page.mouse).wheel({ deltaX: deltaX });
      if (i % 5 === 0) {
        await delay(30);
      }
    }
    await delay(100);
    for (let i = 0; i < xTimes; i++) {
      await (<MouseWithWheel>page.mouse).wheel({ deltaX: -deltaX });
      if (i % 5 === 0) {
        await delay(30);
      }
    }
    await delay(100);
    const metricsEnd = await page.metrics();

    const metric = { ...calculateMetrics(metricsStart, metricsEnd), run: run };
    metricsArray.push(metric);
    // eslint-disable-next-line no-console
    console.info(metric.run, metric.TaskDuration, metric.ScriptDuration, metric.RecalcStyleDuration, metric.LayoutDuration);
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
