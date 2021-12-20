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

const browsers = (process.env.BROWSERS || 'chromium').split(',');

// TODO duplication with bundle tests
const configLog = require('debug')('bv:test:config:pw');

const computeBrowsersAndChannelConfiguration = () => {
  const rawBrowsers = (process.env.BROWSERS || 'chromium,firefox,webkit').split(',');
  configLog('Passed Browsers list', rawBrowsers);
  let browsers;
  let channel;

  const isChromeIncluded = rawBrowsers.includes('chrome');
  if (isChromeIncluded || rawBrowsers.includes('msedge')) {
    browsers = ['chromium'];
    channel = isChromeIncluded ? 'chrome' : 'msedge';
  } else {
    browsers = rawBrowsers;
  }

  const config = { browsers: browsers, channel: channel };
  configLog('Computed browsers and channel configuration', config);
  return config;
};

/** @type {import('playwright-core/types/types').LaunchOptions} */
const launchOptions = {
  headless: process.env.HEADLESS !== 'false',
  slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
};

const browsersAndChannelConfig = computeBrowsersAndChannelConfiguration();
if (browsersAndChannelConfig.channel) {
  launchOptions.channel = browsersAndChannelConfig.channel;
}

module.exports = {
  serverOptions: {
    command: `npm run start -- --config-server-port 10002`,
    port: 10002,
    protocol: 'http', // if default or tcp, the test starts right await whereas the dev server is not available on http
    launchTimeout: 60000, // high value mainly for GitHub Workflows running on macOS (slow machines) and to build the bundle before start
    debug: true,
    usedPortAction: 'ignore', // your tests are executed, we assume that the server is already started
  },
  launchOptions: launchOptions,
  launchType: 'LAUNCH',
  contextOptions: {
    viewport: {
      width: 800,
      height: 600,
    },
  },
  browsers: browsersAndChannelConfig.browsers,
};
