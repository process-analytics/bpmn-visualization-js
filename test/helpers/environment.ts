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
import debug from 'debug';

export const log = debug('bv:test:config:pw');

export const isMacOS = (): boolean => {
  const isMacOS = process.platform.startsWith('darwin');
  log('platform: %s / isMacOS? %s', process.platform, isMacOS);
  return isMacOS;
};

export const isWindowsOS = (): boolean => {
  const isWindowsOS = process.platform.startsWith('win');
  log('platform: %s / isWindowsOS? %s', process.platform, isWindowsOS);
  return isWindowsOS;
};

// running on GitHub Actions: https://docs.github.com/en/actions/learn-github-actions/environment-variables#default-environment-variables
export const isRunningOnCi = (): boolean => {
  const isRunningOnCi = process.env.CI === 'true';
  log('isRunningOnCi?', isRunningOnCi);
  return isRunningOnCi;
};

export const isRunningOnCISlowOS = (): boolean => {
  return isRunningOnCi() && (isMacOS() || isWindowsOS());
};
