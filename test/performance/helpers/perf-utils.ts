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
// import { Metrics } from 'puppeteer';
import { Page } from 'playwright';

export interface PerformanceMetric {
  run: number;
  TaskDuration: number;
  ScriptDuration: number;
  RecalcStyleDuration: number;
  LayoutDuration: number;
}

export interface ChartData {
  load: Array<PerformanceMetric>;
  zoom: Array<PerformanceMetric>;
}

export function calculateMetrics(metricsStart: any, metricsEnd: any): PerformanceMetric {
  return {
    run: new Date().getMilliseconds(),
    LayoutDuration: metricsEnd.LayoutDuration - metricsStart.LayoutDuration,
    RecalcStyleDuration: metricsEnd.RecalcStyleDuration - metricsStart.RecalcStyleDuration,
    ScriptDuration: metricsEnd.ScriptDuration - metricsStart.ScriptDuration,
    TaskDuration: metricsEnd.TaskDuration - metricsStart.TaskDuration,
  };
}

// TODO seems not useful here
// workaround for https://github.com/microsoft/playwright/issues/590
// inspired from https://github.com/microsoft/playwright/issues/2816#issuecomment-749269171
export async function getPageMetrics(
  page: Page,
): Promise<{
  format: 'PerformanceNavigationTiming' | 'PerformanceTiming';
  data: PerformanceNavigationTiming | PerformanceTiming;
}> {
  return JSON.parse(
    await page.evaluate(() => {
      const [timing] = performance.getEntriesByType('navigation');
      return JSON.stringify({
        format: timing ? 'PerformanceNavigationTiming' : 'PerformanceTiming',
        data: timing || window.performance.timing,
      });
    }),
  );
}
