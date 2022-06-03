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
import * as fs from 'node:fs';
import type { Page } from 'playwright';
import { delay } from '../e2e/helpers/test-utils';
import type { Point } from '../e2e/helpers/visu/bpmn-page-utils';
import { AvailableTestPages, PageTester } from '../e2e/helpers/visu/bpmn-page-utils';
import { ChromiumMetricsCollector } from './helpers/metrics-chromium';
import type { ChartData, PerformanceMetric } from './helpers/perf-utils';
import { calculateMetrics } from './helpers/perf-utils';
import { ZoomType } from '../../src/component/options';
import { performanceDataFilePath } from './helpers/file-utils';

const metricsArray: Array<PerformanceMetric> = [];

let metricsCollector: ChromiumMetricsCollector;
beforeAll(async () => {
  metricsCollector = await ChromiumMetricsCollector.create(<Page>page);
});
describe('Mouse wheel zoom performance', () => {
  const pageTester = new PageTester({ targetedPage: AvailableTestPages.DIAGRAM_NAVIGATION, diagramSubfolder: 'performance' }, <Page>page);

  const bpmnDiagramName = 'B.2.0';
  let containerCenter: Point;

  beforeEach(async () => {
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);
    containerCenter = await pageTester.getContainerCenter();
  });

  const xTimes = 30;
  it.each([1, 2, 3, 4, 5])(`run %s - zoom in and zoom out [${xTimes} times]`, async run => {
    const metricsStart = await metricsCollector.metrics();

    for (let i = 0; i < xTimes; i++) {
      await pageTester.mouseZoomNoDelay({ x: containerCenter.x + 200, y: containerCenter.y }, ZoomType.In);
      if (i % 5 === 0) {
        await delay(30);
      }
    }
    await delay(100);
    for (let i = 0; i < xTimes; i++) {
      await pageTester.mouseZoomNoDelay({ x: containerCenter.x + 200, y: containerCenter.y }, ZoomType.Out);
      if (i % 5 === 0) {
        await delay(30);
      }
    }
    await delay(100);
    const metricsEnd = await metricsCollector.metrics();

    const metric = { ...calculateMetrics(metricsStart, metricsEnd), run: run };
    metricsArray.push(metric);
    expect(true).toBe(true);
  });
});
afterAll(() => {
  metricsCollector.destroy();
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
