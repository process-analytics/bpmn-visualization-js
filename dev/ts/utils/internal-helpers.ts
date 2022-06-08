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

import { log } from './shared-helpers';

export function stringify(value: unknown): string {
  return JSON.stringify(value, undefined, 2);
}

export function _log(header: string, message: unknown, ...optionalParams: unknown[]): void {
  // eslint-disable-next-line no-console
  console.info(header + ' ' + message, ...optionalParams);
}

export function logStartup(message?: string, ...optionalParams: unknown[]): void {
  _log('[DEMO STARTUP]', message, ...optionalParams);
}

export function logErrorAndOpenAlert(error: unknown, alertMsg?: string): void {
  console.error(`[DEMO]`, error);
  window.alert(alertMsg ?? error);
}

export function logDownload(message?: unknown, ...optionalParams: unknown[]): void {
  _log('[DEMO DOWNLOAD]', message, ...optionalParams);
}

export function fetchBpmnContent(url: string): Promise<string> {
  log(`Fetching BPMN content from url ${url}`);
  return fetch(url).then(response => {
    if (!response.ok) {
      throw Error(String(response.status));
    }
    return response.text();
  });
}
