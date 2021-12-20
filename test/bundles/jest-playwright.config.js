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

const configLog = require('debug')('bv:test:config:pw');

const computeBrowsersAndChannelConfiguration = () => {
  const rawBrowsers = (process.env.BROWSERS || 'chromium,firefox,webkit').split(',');
  configLog('Passed Browsers list', rawBrowsers);
  let browsers = [];
  let channel;

  if (rawBrowsers.includes('chrome')) {
    browsers.push('chromium');
    channel = 'chrome';
  } else if (rawBrowsers.includes('msedge')) {
    browsers.push('chromium');
    channel = 'msedge';
  } else {
    browsers = rawBrowsers;
  }

  const config = { browsers: browsers, channel: channel };
  configLog('Computed browsers and channel configuration', config);
  return config;
};

const isMacOs = () => {
  const isMacOS = process.platform.startsWith('darwin');
  configLog('platform: %s / isMacOS? %s', process.platform, isMacOS);
  return isMacOS;
};
// running on GitHub Actions: https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
const isRunningOnCi = () => {
  const isRunningOnCi = process.env.CI === 'true';
  configLog('isRunningOnCi?', isRunningOnCi);
  return isRunningOnCi;
};

configLog('Configuring jest-playwright settings');
/** @type {import('playwright-core/types/types').LaunchOptions} */
const launchOptions = {
  headless: process.env.HEADLESS !== 'false',
  slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
};
if (isRunningOnCi() && isMacOs()) {
  const timeoutInSeconds = 60;
  configLog('Overriding default playwright launch timeout to %s seconds', timeoutInSeconds);
  launchOptions.timeout = timeoutInSeconds * 1000; // default is 30 seconds
}

const browsersAndChannelConfig = computeBrowsersAndChannelConfiguration();
if (browsersAndChannelConfig.channel) {
  launchOptions.channel = browsersAndChannelConfig.channel;
}

module.exports = {
  launchOptions: launchOptions,
  browsers: browsersAndChannelConfig.browsers,
};
