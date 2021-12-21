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

const configLog = require('../helpers/config/jest-playwright').log;
const { browsers, launchOptions } = require('../helpers/config/jest-playwright').computeLaunchOptionsAndBrowsersConfiguration();

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

if (isRunningOnCi() && isMacOs()) {
  const timeoutInSeconds = 60;
  configLog('Overriding default playwright launchOptions timeout to %s seconds', timeoutInSeconds);
  launchOptions.timeout = timeoutInSeconds * 1000; // default is 30 seconds
}
configLog('Final launch options', launchOptions);

module.exports = {
  launchOptions: launchOptions,
  browsers: browsers,
};
