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

const isMacOs = () => process.platform.startsWith('darwin');
// running on GitHub Actions: https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
const isRunningOnCi = () => process.env.CI;

/** @type {import('playwright-core/types/types').LaunchOptions} */
const launchOptions = {
  headless: process.env.HEADLESS !== 'false',
  slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
};
if (isMacOs() && isRunningOnCi()) {
  // TODO always fail on macOS to ensure this is considered on gh actions
  launchOptions.timeout = 5 * 1000; // default is 30 seconds
}

module.exports = {
  launchOptions: launchOptions,
  browsers: ['chromium', 'firefox', 'webkit'],
};
