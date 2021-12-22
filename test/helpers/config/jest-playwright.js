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

const log = require('debug')('bv:test:config:pw');

const isMacOS = () => {
  const isMacOS = process.platform.startsWith('darwin');
  log('platform: %s / isMacOS? %s', process.platform, isMacOS);
  return isMacOS;
};
const isWindowsOS = () => {
  const isWindowsOS = process.platform.startsWith('win');
  log('platform: %s / isWindowsOS? %s', process.platform, isWindowsOS);
  return isWindowsOS;
};
// running on GitHub Actions: https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
const isRunningOnCi = () => {
  const isRunningOnCi = process.env.CI === 'true';
  log('isRunningOnCi?', isRunningOnCi);
  return isRunningOnCi;
};
const isRunningOnCISlowOS = () => {
  return isRunningOnCi() && (isMacOS() || isWindowsOS());
};

const computeBrowsersAndChannelConfiguration = defaultBrowsers => {
  log('Default browsers list', defaultBrowsers);
  const rawBrowsers = (process.env.BROWSERS || defaultBrowsers).split(',');
  log('Raw browsers list', rawBrowsers);
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
  log('Computed browsers and channel configuration', config);
  return config;
};

const computeLaunchOptionsAndBrowsersConfiguration = (defaultBrowsers = 'chromium,firefox,webkit') => {
  log('Computing launchOptions and browsers configuration');

  /** @type {import('playwright-core/types/types').LaunchOptions} */
  const launchOptions = {
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
  };

  const browsersAndChannelConfig = computeBrowsersAndChannelConfiguration(defaultBrowsers);
  if (browsersAndChannelConfig.channel) {
    launchOptions.channel = browsersAndChannelConfig.channel;
  }

  if (isRunningOnCISlowOS()) {
    const timeoutInSeconds = 60;
    log('Overriding default playwright launchOptions timeout to %s seconds', timeoutInSeconds);
    launchOptions.timeout = timeoutInSeconds * 1000; // default is 30 seconds
  }

  const config = { launchOptions: launchOptions, browsers: browsersAndChannelConfig.browsers };
  log('Computed launchOptions and browsers configuration', config);
  return config;
};

const computeServerOptions = () => {
  log('Computing serverOptions');
  const options = {
    command: `npm run start -- --config-server-port 10002`,
    port: 10002,
    protocol: 'http', // if default or tcp, the test starts right await whereas the dev server is not available on http
    launchTimeout: 60000, // high value mainly for GitHub Workflows running on macOS (slow machines) and to build the bundle before start
    debug: true,
    usedPortAction: 'ignore', // your tests are executed, we assume that the server is already started
  };
  log('Computed serverOptions', options);
  return options;
};

const computeConfigurationForStaticUsage = () => {
  const { browsers, launchOptions } = computeLaunchOptionsAndBrowsersConfiguration();
  return {
    launchOptions: launchOptions,
    browsers: browsers,
  };
};

const computeConfigurationForDevServerUsage = defaultBrowsers => {
  const { browsers, launchOptions } = computeLaunchOptionsAndBrowsersConfiguration(defaultBrowsers);
  return {
    serverOptions: computeServerOptions(),
    launchOptions: launchOptions,
    launchType: 'LAUNCH',
    contextOptions: {
      viewport: {
        width: 800,
        height: 600,
      },
    },
    browsers: browsers,
  };
};

exports.computeConfigurationForStaticUsage = computeConfigurationForStaticUsage;
exports.computeConfigurationForDevServerUsage = computeConfigurationForDevServerUsage;
