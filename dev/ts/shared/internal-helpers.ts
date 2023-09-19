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

import { log } from './shared-helpers';

export function _log(header: string, message: string, ...optionalParameters: unknown[]): void {
  // eslint-disable-next-line no-console
  console.info(`${header} ${message}`, ...optionalParameters);
}

export function logStartup(message?: string, ...optionalParameters: unknown[]): void {
  _log('[DEMO STARTUP]', message, ...optionalParameters);
}

export function logErrorAndOpenAlert(error: string, alertMessage?: string): void {
  logError(error);
  window.alert(alertMessage ?? error);
}

export function logError(error: string): void {
  console.error(`[DEMO]`, error);
}

export function logDownload(message?: string, ...optionalParameters: unknown[]): void {
  _log('[DEMO DOWNLOAD]', message, ...optionalParameters);
}

export async function fetchBpmnContent(url: string): Promise<string> {
  log(`Fetching BPMN content from url ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw Error(`HTTP status ${response.status}`);
  }
  return await response.text();
}
