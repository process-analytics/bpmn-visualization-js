/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { ChartData, PerformanceMetric } from './helpers/perf-utils';

import * as fs from 'node:fs';

import { performanceDataFilePath } from './helpers/file-utils';
import { ChromiumMetricsCollector } from './helpers/metrics-chromium';
import { calculateMetrics } from './helpers/perf-utils';

import { AvailableTestPages, PageTester } from '@test/shared/visu/bpmn-page-utils';

const metricsArray: PerformanceMetric[] = [];

let metricsCollector: ChromiumMetricsCollector;

beforeAll(async () => {
  metricsCollector = await ChromiumMetricsCollector.create(page);
});

describe('load performance', () => {
  const pageTester = new PageTester({ targetedPage: AvailableTestPages.DIAGRAM_NAVIGATION, diagramSubfolder: 'performance' }, page);
  const bpmnDiagramName = 'B.2.0';

  it.each([1, 2, 3, 4, 5])('run %s - file loading and displaying diagram with FitType.HorizontalVertical', async run => {
    const metricsStart = await metricsCollector.metrics();
    await pageTester.gotoPageAndLoadBpmnDiagram(bpmnDiagramName);
    const metricsEnd = await metricsCollector.metrics();

    const metric = { ...calculateMetrics(metricsStart, metricsEnd), run: run };
    metricsArray.push(metric);
    expect(true).toBeTrue();
  });
});

afterAll(async () => {
  await metricsCollector.destroy().then(() => {
    try {
      const oldDataString = fs.readFileSync(performanceDataFilePath, 'utf8');
      const oldData = JSON.parse(oldDataString.slice('const data = '.length)) as ChartData;
      const data = {
        zoom: oldData.zoom,
        load: [...oldData.load, ...metricsArray],
      };
      fs.writeFileSync(performanceDataFilePath, 'const data = ' + JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  });
});
