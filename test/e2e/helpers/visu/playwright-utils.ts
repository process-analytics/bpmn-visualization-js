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
import 'jest-playwright-preset';
import { Point } from '../test-utils';

export interface PanningOptions {
  originPoint: Point;
  destinationPoint: Point;
}

// workaround for https://github.com/microsoft/playwright/issues/1115 that only works with chromium
// inspired from https://github.com/microsoft/playwright/issues/2642#issuecomment-647846972
// https://github.com/microsoft/playwright/blob/v1.8.1/docs/src/api/class-cdpsession.md
export async function chromiumMouseZoom(x: number, y: number, deltaX: number): Promise<void> {
  // possible improvement to investigate: can we access to the chromium server directly?
  // page._channel Proxy where Target is an EventEmitter
  // server Mouse https://github.com/microsoft/playwright/blob/v1.8.0/src/server/input.ts#L171
  // chromium server RawMouse: https://github.com/microsoft/playwright/blob/v1.8.0/src/server/chromium/crInput.ts#L95
  // RawMouse as a _client field

  const client = await (page.context() as ChromiumBrowserContext).newCDPSession(<Page>page);
  // for troubleshooting, see playwright protocol debug logs
  // example when performing panning (set DEBUG=pw:protocol env var)
  await client.send('Input.dispatchMouseEvent', {
    x: x,
    y: y,
    type: 'mouseWheel',
    deltaX: deltaX,
    deltaY: 0,
    modifiers: 2, // CTRL
  });
  // TODO try to find a way to use the same session
  // detach is it not reused outside this function
  await client.detach();
}
