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
import { ensureInRange } from '../../../../src/component/helpers/validators';

describe('validate configuration', () => {
  it.each`
    input        | min     | max    | expected
    ${undefined} | ${-12}  | ${45}  | ${20}
    ${30}        | ${-12}  | ${45}  | ${30}
    ${-30}       | ${0}    | ${45}  | ${0}
    ${130}       | ${0}    | ${72}  | ${72}
    ${0}         | ${-100} | ${100} | ${0}
  `('Range number restriction: input ($input) min ($min) max ($max)', ({ input, min, max, expected }) => {
    expect(ensureInRange(input, min, max, 20)).toEqual(expected);
  });
});
