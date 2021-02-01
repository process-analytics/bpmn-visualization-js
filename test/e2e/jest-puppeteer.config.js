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

// TODO browser management
// get BROWSER env var
// if (product !== undefined && !['chrome', 'firefox'].includes(product))
// throw new Error(`Error: Invalid product value '${product}, must be one of '`)

module.exports = {
  server: {
    command: `npm run start -- --config-server-port 10002`,
    port: 10002,
    protocol: 'http', // if default or tcp, the test starts right await whereas the dev server is not available on http
    launchTimeout: 60000, // high value mainly for GitHub Workflows running on macOS (slow machines) and to build the bundle before start
    debug: true,
  },
  launch: {
    dumpio: true, // Make browser logs visible
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
    args: ['--disable-infobars', '--no-sandbox', '--disable-setuid-sandbox'],
    //product: 'firefox',
  },

  // first run
  // PUPPETEER_PRODUCT=firefox npm install puppeteer
  // then
  // PUPPETEER_PRODUCT=firefox HEADLESS=false npm run test:e2e

  // PUPPETEER_PRODUCT=firefox
  // https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#environment-variables
  // https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteerlaunchoptions
};
