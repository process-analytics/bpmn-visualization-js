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
import { ChromiumBrowserContext, Page } from 'playwright';
import { Protocol } from 'playwright/types/protocol';

// from https://github.com/puppeteer/puppeteer/blob/v7.0.4/src/common/Page.ts
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

export async function chromiumMetrics(page: Page): Promise<Metrics> {
  // TODO create a class an keep the client in a field + detach at the end
  const client = await (page.context() as ChromiumBrowserContext).newCDPSession(page);
  // TODO should be only be done once
  await client.send('Performance.enable');
  //client.on('Performance.metrics', (event) => this._emitMetrics(event));
  const response = await client.send('Performance.getMetrics');
  // await client.detach();
  return buildMetricsObject(response.metrics);
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

function buildMetricsObject(metrics?: Array<Protocol.Performance.Metric>): Metrics {
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
