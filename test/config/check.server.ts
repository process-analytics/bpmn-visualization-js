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
import { chromium, expect, FullConfig, Page } from '@playwright/test';

async function waitFor200Response(page: Page, url: string, maxTimeout: number): Promise<void> {
  const response = await page.goto(url);
  if (response.status() !== 200 && maxTimeout > 0) {
    await page.waitForTimeout(100); // 100ms
    await waitFor200Response(page, url, maxTimeout - 100);
  } else {
    expect(response.status()).toBe(200);
  }
}

//  globalSetup file must export a single function.
const checkServer = async (config: FullConfig): Promise<void> => {
  const baseURL = config.projects[0].use.baseURL;

  if (baseURL) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await waitFor200Response(page, baseURL, config.webServer.timeout);
    await browser.close();
  }
};

export default checkServer;
