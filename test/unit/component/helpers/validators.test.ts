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

import { ensureInRange, ensureOpacityValue, ensurePositiveValue, ensureStrokeWidthValue, ensureValidZoomConfiguration } from '../../../../src/component/helpers/validators';

describe('helper functions', () => {
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

  it.each`
    input        | expected
    ${undefined} | ${0}
    ${null}      | ${0}
    ${-30}       | ${0}
    ${130}       | ${130}
    ${0}         | ${0}
  `('Ensure positive values: input ($input)', ({ input, expected }) => {
    expect(ensurePositiveValue(input)).toEqual(expected);
  });
});

describe('validate configuration', () => {
  it.each`
    input                                         | expected
    ${undefined}                                  | ${{ debounceDelay: 50, throttleDelay: 50 }}
    ${{ throttleDelay: 12 }}                      | ${{ debounceDelay: 50, throttleDelay: 12 }}
    ${{ debounceDelay: 72 }}                      | ${{ debounceDelay: 72, throttleDelay: 50 }}
    ${{ debounceDelay: 172, throttleDelay: -50 }} | ${{ debounceDelay: 100, throttleDelay: 0 }}
  `('zoom configuration: input ($input)', ({ input, expected }) => {
    expect(ensureValidZoomConfiguration(input)).toEqual(expected);
  });
});

describe('validate opacity', () => {
  it.each`
    input        | expected
    ${undefined} | ${100}
    ${12}        | ${12}
    ${172}       | ${100}
    ${-50}       | ${0}
    ${'default'} | ${undefined}
  `('opacity: $input', ({ input, expected }) => {
    expect(ensureOpacityValue(input)).toEqual(expected);
  });
});

describe('validate stroke width', () => {
  it.each`
    input        | expected
    ${undefined} | ${1}
    ${12}        | ${12}
    ${-50}       | ${1}
    ${67}        | ${50}
  `('opacity: $input', ({ input, expected }) => {
    expect(ensureStrokeWidthValue(input)).toEqual(expected);
  });
});
