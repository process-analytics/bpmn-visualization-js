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
import { getCell } from '../matcherUtils';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

export function toBeCell(this: MatcherContext, received: string): CustomMatcherResult {
  const pass = getCell(received) ? true : false;
  return {
    message: () => this.utils.matcherHint(`.${pass ? 'not.' : ''}toBeCell`) + '\n\n' + `Expected cell with id '${received}' ${pass ? 'not ' : ''}to be found in the mxGraph model`,
    pass,
  };
}
