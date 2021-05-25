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
import { ChromiumBrowserContext, ElementHandle } from 'playwright-core';
import 'jest-playwright-preset';
import { Point } from '../test-utils';

export interface PanningOptions {
  containerElement: ElementHandle<SVGElement | HTMLElement>;
  originPoint: Point;
  destinationPoint: Point;
}

// workaround for https://github.com/microsoft/playwright/issues/1115 that only works with chromium
// inspired from https://github.com/microsoft/playwright/issues/2642#issuecomment-647846972
// https://github.com/microsoft/playwright/blob/v1.8.1/docs/src/api/class-cdpsession.md
export async function chromiumMouseWheel(x: number, y: number, deltaX: number): Promise<void> {
  // possible improvement to investigate: can we access to the chromium server directly?
  // page._channel Proxy where Target is an EventEmitter
  // server Mouse https://github.com/microsoft/playwright/blob/v1.8.0/src/server/input.ts#L171
  // chromium server RawMouse: https://github.com/microsoft/playwright/blob/v1.8.0/src/server/chromium/crInput.ts#L95
  // RawMouse as a _client field

  const client = await (page.context() as ChromiumBrowserContext).newCDPSession(page);
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

// TODO To remove when https://github.com/microsoft/playwright/issues/1094 is fixed
export async function webkitMousePanning(panningOptions: PanningOptions): Promise<void> {
  await page.evaluate(panningOptions => {
    function getMouseEventInit(point: Point): MouseEventInit {
      return {
        bubbles: true,
        cancelable: true,
        clientX: point.x,
        clientY: point.y,
        screenX: point.x,
        screenY: point.y,
        button: 0,
        buttons: 1,
      };
    }

    const originMouseEventInit = getMouseEventInit(panningOptions.originPoint);
    const destinationMouseEventInit = getMouseEventInit(panningOptions.destinationPoint);

    // simulate mouse panning
    const containerElement: SVGElement | HTMLElement = panningOptions.containerElement;
    containerElement.dispatchEvent(new MouseEvent('mousemove', originMouseEventInit));
    containerElement.dispatchEvent(new MouseEvent('mousedown', originMouseEventInit));
    setTimeout(() => {
      // Nothing to do
    }, 2000);
    containerElement.dispatchEvent(new MouseEvent('mousemove', destinationMouseEventInit));
    containerElement.dispatchEvent(new MouseEvent('mouseup', destinationMouseEventInit));

    return Promise.resolve({ x: destinationMouseEventInit.clientX, y: destinationMouseEventInit.clientY });
  }, panningOptions);
}
