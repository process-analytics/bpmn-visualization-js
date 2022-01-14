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

import type { ZoomConfiguration } from '../options';

/**
 * @internal
 */
export function ensureInRange(value: number, min: number, max: number, defaultValue: number): number {
  let inRangeValue = value == undefined ? defaultValue : value;
  inRangeValue = Math.min(Math.max(inRangeValue, min), max);
  return inRangeValue;
}

/**
 * @internal
 */
export function ensurePositiveValue(input: number | undefined | null): number {
  return Math.max(input || 0, 0);
}

/**
 * Make sure the configuration parameters are defined and in range
 * @param config the {@link ZoomConfiguration} to make valid
 * @internal
 */
export function ensureValidZoomConfiguration(config: ZoomConfiguration): ZoomConfiguration {
  const validatedConfig = config ?? {};
  validatedConfig.debounceDelay = ensureInRange(validatedConfig.debounceDelay, 0, 100, 50);
  validatedConfig.throttleDelay = ensureInRange(validatedConfig.throttleDelay, 0, 100, 50);
  return validatedConfig;
}
