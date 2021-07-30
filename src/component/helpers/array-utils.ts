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

/**
 * @internal
 *
 * Not possible to use **startWith** and **notStartWith** in the same time
 */
export interface FilterParameter {
  startingWith?: string;
  notStartingWith?: string;
  ignoreCase?: boolean;
}

function convertEmptyStringAndObject<T>(element: string | T, acceptEmptyString: boolean): T {
  if (element === '') {
    return acceptEmptyString ? ({} as T) : undefined;
  }
  return element as T;
}

/**
 * @internal
 */
export function ensureIsArray<T>(elements: (T | string)[] | T | string, acceptEmptyString = false): Array<T> {
  if (elements === undefined || elements === null) {
    return [];
  }

  let returnedArray;
  if (!Array.isArray(elements)) {
    returnedArray = [convertEmptyStringAndObject(elements, acceptEmptyString)];
  } else {
    returnedArray = elements.map(element => convertEmptyStringAndObject(element, acceptEmptyString));
  }
  return returnedArray.filter(value => value);
}

/**
 * @internal
 */
export function filter<T extends string>(arrayToFilter: Array<T>, suffix: string, options?: FilterParameter): Array<T> {
  let pattern = '';
  if (options?.startingWith) {
    pattern = pattern.concat(`^(${options.startingWith}).*`);
  } else if (options?.notStartingWith) {
    pattern = pattern.concat(`^(?!(${options.notStartingWith})).*`);
  }
  pattern = pattern.concat(`${suffix}$`);

  return arrayToFilter.filter(element => (options?.ignoreCase ? new RegExp(pattern, 'i').test(element) : new RegExp(pattern).test(element)));
}
