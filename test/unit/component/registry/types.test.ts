/*
Copyright 2021 Bonitasoft S.A.

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

import type { Opacity } from '../../../../src/component/registry/types';

describe('Opacity', () => {
  it('should allow 0 as a valid value', () => {
    const opacity: Opacity = 0;
    expect(opacity).toBe(0);
  });

  it('should allow 100 as a valid value', () => {
    const opacity: Opacity = 100;
    expect(opacity).toBe(100);
  });

  it('should allow values between 0 and 100 as valid values', () => {
    const opacity1: Opacity = 50;
    expect(opacity1).toBe(50);

    const opacity2: Opacity = 25;
    expect(opacity2).toBe(25);

    const opacity3: Opacity = 75;
    expect(opacity3).toBe(75);
  });

  test('should not allow values less than 0', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const o: Opacity = -10;
  });

  test('should not allow values greater than 100', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const o: Opacity = 200;
  });

  test('should not allow string values', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const o: Opacity = '50';
  });
});
