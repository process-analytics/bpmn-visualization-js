/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
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

/**
 * Make sure the opacity parameter is in range
 *
 * @param opacity the property of {@link StyleWithOpacity} to make valid
 * @internal
 */
export function ensureOpacityValue(opacity: number | 'default'): number | undefined {
  return opacity == 'default' ? undefined : ensureInRange(opacity, 0, 100, 100);
}

/**
 * Validates the provided stroke width value to ensure it is between 1 and 50, and returns the default value (1) if the value is not provided.
 *
 * @param strokeWidth - The stroke width value to validate.
 * @returns The validated stroke width value.
 *
 * @internal
 */
export function ensureStrokeWidthValue(strokeWidth: number | 'default'): number | undefined {
  return strokeWidth == 'default' ? undefined : ensureInRange(strokeWidth, 1, 50, 1);
}
