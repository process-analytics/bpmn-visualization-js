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
import { CDPSession, ChromiumBrowserContext, Page } from 'playwright';

// Workarounds no Metrics API in Playwright: https://github.com/microsoft/playwright/issues/590
// inspired from https://github.com/puppeteer/puppeteer/blob/v7.0.4/src/common/Page.ts
// possible alternative: https://github.com/microsoft/playwright/issues/2816#issuecomment-749269171
export interface Metrics {
  Timestamp?: number;
  Documents?: number;
  Frames?: number;
  JSEventListeners?: number;
  Nodes?: number;
  LayoutCount?: number;
  RecalcStyleCount?: number;
  LayoutDuration?: number;
  RecalcStyleDuration?: number;
  ScriptDuration?: number;
  TaskDuration?: number;
  JSHeapUsedSize?: number;
  JSHeapTotalSize?: number;
}

/**
 * Run-time execution metric.
 *
 * Workaround: redefined here as the Protocol module, that defines the Performance.Metric interface, is no more exported in playwright@1.16.0
 */
interface Metric {
  /**
   * Metric name.
   */
  name: string;
  /**
   * Metric value.
   */
  value: number;
}

export class ChromiumMetricsCollector {
  private client: CDPSession;

  private constructor() {
    // ensure to use the factory method
  }

  static async create(page: Page): Promise<ChromiumMetricsCollector> {
    const collector = new ChromiumMetricsCollector();
    collector.client = await (page.context() as ChromiumBrowserContext).newCDPSession(page);
    // https://github.com/puppeteer/puppeteer/blob/v7.0.4/src/common/Page.ts#L492
    await collector.client.send('Performance.enable');
    return collector;
  }

  async metrics(): Promise<Metrics> {
    const response = await this.client.send('Performance.getMetrics');
    return buildMetricsObject(response.metrics);
  }

  async destroy(): Promise<void> {
    await this.client.detach();
  }
}

const supportedMetrics = new Set<string>([
  'Timestamp',
  'Documents',
  'Frames',
  'JSEventListeners',
  'Nodes',
  'LayoutCount',
  'RecalcStyleCount',
  'LayoutDuration',
  'RecalcStyleDuration',
  'ScriptDuration',
  'TaskDuration',
  'JSHeapUsedSize',
  'JSHeapTotalSize',
]);

function buildMetricsObject(metrics?: Array<Metric>): Metrics {
  const result: Metrics = {};
  for (const metric of metrics || []) {
    if (supportedMetrics.has(metric.name)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      result[metric.name] = metric.value;
    }
  }
  return result;
}
