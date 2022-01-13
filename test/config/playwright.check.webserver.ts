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
import { FullConfig } from '@playwright/test';
import waitOn from 'wait-on';

const checkWebServer = async (config: FullConfig): Promise<void> => {
  // we need sync code here to block playwright prior test can start
  try {
    const baseURL = config.projects[0].use.baseURL;

    if (baseURL) {
      // const timeout = 1_000;
      const timeout = config.webServer.timeout;
      const opts: waitOn.WaitOnOptions = {
        resources: [baseURL, `${baseURL}/diagram-navigation.html`, `${baseURL}/non-regression.html`, `${baseURL}/overlays.html`],
        timeout: timeout,
        verbose: false, // set to true to trace requests
        log: true,
      };

      await waitOn(opts);
      // once here, all resources are available
    }
  } catch (err: unknown) {
    throw new Error(`The webserver takes more than ${timeout}ms to start. ${err}`);
  }
};

export default checkWebServer;
