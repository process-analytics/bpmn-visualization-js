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
import { BpmnDiagramPreparation, BpmnLoadMethod, delay, PageTester } from './helpers/visu-utils';
import { Metrics, Mouse } from 'puppeteer';
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

interface PerformanceMetric {
  run: number;
  TaskDuration: number;
  ScriptDuration: number;
  RecalcStyleDuration: number;
  LayoutDuration: number;
}

const metricsArray: Array<PerformanceMetric> = [];

describe.each([1, 2, 3, 4, 5])('diagram navigation performance', run => {
  // to have mouse pointer visible during headless test - add 'showMousePointer=true' to queryParams

  const fileName = 'B.2.0';

  function calculateMetrics(metricsStart: Metrics, metricsEnd: Metrics): Metrics {
    return {
      Timestamp: metricsEnd.Timestamp - metricsStart.Timestamp,
      Documents: metricsEnd.Documents - metricsStart.Documents,
      Frames: metricsEnd.Frames - metricsStart.Frames,
      JSEventListeners: metricsEnd.JSEventListeners - metricsStart.JSEventListeners,
      Nodes: metricsEnd.Nodes - metricsStart.Nodes,
      LayoutCount: metricsEnd.LayoutCount - metricsStart.LayoutCount,
      RecalcStyleCount: metricsEnd.RecalcStyleCount - metricsStart.RecalcStyleCount,
      LayoutDuration: metricsEnd.LayoutDuration - metricsStart.LayoutDuration,
      RecalcStyleDuration: metricsEnd.RecalcStyleDuration - metricsStart.RecalcStyleDuration,
      ScriptDuration: metricsEnd.ScriptDuration - metricsStart.ScriptDuration,
      TaskDuration: metricsEnd.TaskDuration - metricsStart.TaskDuration,
      JSHeapUsedSize: metricsEnd.JSHeapUsedSize - metricsStart.JSHeapUsedSize,
      JSHeapTotalSize: metricsEnd.JSHeapTotalSize - metricsStart.JSHeapTotalSize,
    };
  }

  it.each([1])(`ctrl + mouse: check performance while performing zoom in and zoom out [%s times]`, async (xTimes: number) => {
    const metricsStart = await page.metrics();
    const bpmnDiagramPreparation = new BpmnDiagramPreparation(new Map([['B.2.0', BpmnLoadMethod.Url]]), { name: 'navigation-diagram', queryParams: [] }, 'performance');
    const pageTester = new PageTester(bpmnDiagramPreparation, 'bpmn-viewport', 'BPMN Visualization - Diagram Navigation');
    await pageTester.expectBpmnDiagramToBeDisplayed(fileName);
    const metricsEnd = await page.metrics();

    const metric = { ...calculateMetrics(metricsStart, metricsEnd), run: run };
    metricsArray.push(metric);
    // eslint-disable-next-line no-console
    console.info(metric.run, metric.TaskDuration, metric.ScriptDuration, metric.RecalcStyleDuration, metric.LayoutDuration);
    expect(true).toBe(true);
  });
});
afterAll(() => {
  for (let i = 0; i < metricsArray.length; i++) {
    metricsArray[i].run = i + 1;
    const metric = metricsArray[i];
    // eslint-disable-next-line no-console
    console.info(metric.run, metric.TaskDuration, metric.ScriptDuration, metric.RecalcStyleDuration, metric.LayoutDuration);
  }
  const performanceDataFilePath = './performance/load-data.js';
  try {
    const oldDataString = fs.readFileSync(performanceDataFilePath, 'utf8');
    const oldData = JSON.parse(oldDataString.substring(17, oldDataString.length));
    // eslint-disable-next-line no-console
    console.log(oldData);
    const data = JSON.stringify(oldData.concat(metricsArray));
    fs.writeFileSync(performanceDataFilePath, 'const loadData = ' + data);
  } catch (err) {
    console.error(err);
  }
});
