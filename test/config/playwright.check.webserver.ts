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
import { FullConfig } from '@playwright/test';
import waitOn from 'wait-on';

const checkWebServer = (config: FullConfig): void => {
  const baseURL = config.projects[0].use.baseURL;

  if (baseURL) {
    const opts = {
      resources: [baseURL, `${baseURL}/diagram-navigation.html`, `${baseURL}/non-regression.html`, `${baseURL}/overlays.html`],
      timeout: config.webServer.timeout, // timeout in ms, default Infinity
      interval: 100, // poll interval in ms, default 250ms
    };

    waitOn(opts).catch(function (err: Error) {
      // Following https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/error/error, this constructor should exist.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new Error(`Server has taken more than ${config.webServer.timeout}ms to start.`, { cause: err });
    });
  }
};

export default checkWebServer;
