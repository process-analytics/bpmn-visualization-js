/**
 * @jest-environment jsdom
 */
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
import { IconStyleConfiguration, ShapeConfiguration, Size, computeScaledIconSize } from '../../../../../../src/component/mxgraph/shape/render';

describe('compute scaled icon size', () => {
  function newIconStyleConfiguration(strokeWidth = 0): IconStyleConfiguration {
    return {
      fillColor: 'do_not_care',
      isFilled: false,
      strokeColor: 'do_not_care',
      strokeWidth: strokeWidth,
      margin: 0,
    };
  }
  function newShapeConfiguration(w: number, h: number): ShapeConfiguration {
    return {
      x: -1, // not relevant here
      y: -1, // not relevant here
      width: w,
      height: h,
    };
  }
  // TODO add expect size helper function
  function expectSize(actual: Size, expected: Size): void {
    expect(actual.width).toEqual(expected.width);
    expect(actual.height).toEqual(expected.height);
  }

  describe('parent square dimension', () => {
    test('original square icon', () => {
      const size = computeScaledIconSize({ width: 100, height: 100 }, newIconStyleConfiguration(), newShapeConfiguration(50, 50), 0.25);
      expectSize(size, { width: 12.5, height: 12.5 }); // max 12.5 12.5
    });
    test('original icon - width larger than height', () => {
      const size = computeScaledIconSize({ width: 200, height: 100 }, newIconStyleConfiguration(), newShapeConfiguration(50, 50), 0.25);
      expectSize(size, { width: 12.5, height: 6.25 }); // max 12.5 12.5
    });
    test('original icon - height larger than width', () => {
      const size = computeScaledIconSize({ width: 100, height: 200 }, newIconStyleConfiguration(), newShapeConfiguration(50, 50), 0.25);
      expectSize(size, { width: 6.25, height: 12.5 }); // max 12.5 12.5
    });
    test('ratio equal to 1', () => {
      const size = computeScaledIconSize({ width: 100, height: 200 }, newIconStyleConfiguration(), newShapeConfiguration(50, 50), 1);
      expectSize(size, { width: 25, height: 50 }); // max 50 50
    });
    test('non zero stroke width', () => {
      const size = computeScaledIconSize({ width: 100, height: 100 }, newIconStyleConfiguration(5), newShapeConfiguration(50, 50), 0.25);
      expectSize(size, { width: 4.5, height: 4.5 }); // max 12.5 12.5
    });
  });

  describe('parent width larger than height', () => {
    test('original square icon', () => {
      const size = computeScaledIconSize({ width: 100, height: 100 }, newIconStyleConfiguration(), newShapeConfiguration(100, 80), 0.25);
      expectSize(size, { width: 20, height: 20 }); // max 25 20
    });
    test('original icon - width larger than height', () => {
      const size = computeScaledIconSize({ width: 200, height: 100 }, newIconStyleConfiguration(), newShapeConfiguration(100, 80), 0.25);
      expectSize(size, { width: 25, height: 12.5 }); // max 25 20
    });
    test('original icon - height larger than width', () => {
      const size = computeScaledIconSize({ width: 100, height: 200 }, newIconStyleConfiguration(), newShapeConfiguration(100, 80), 0.25);
      expectSize(size, { width: 10, height: 20 }); // max 25 20
    });
    test('ratio equal to 1', () => {
      const size = computeScaledIconSize({ width: 200, height: 100 }, newIconStyleConfiguration(), newShapeConfiguration(100, 80), 1);
      expectSize(size, { width: 100, height: 50 }); // max 100 80
    });
    test('non zero stroke width', () => {
      const size = computeScaledIconSize({ width: 200, height: 100 }, newIconStyleConfiguration(3), newShapeConfiguration(100, 80), 0.25);
      expectSize(size, { width: 21, height: 8.5 }); // max 25 20
    });
  });

  describe('parent height larger than width', () => {
    test('original square icon', () => {
      const size = computeScaledIconSize({ width: 100, height: 100 }, newIconStyleConfiguration(), newShapeConfiguration(80, 100), 0.25);
      expectSize(size, { width: 20, height: 20 }); // max 25 20
    });
    test('original icon - width larger than height', () => {
      const size = computeScaledIconSize({ width: 200, height: 100 }, newIconStyleConfiguration(), newShapeConfiguration(80, 100), 0.25);
      expectSize(size, { width: 20, height: 10 }); // max 25 20
    });
    test('original icon - height larger than width', () => {
      const size = computeScaledIconSize({ width: 100, height: 200 }, newIconStyleConfiguration(), newShapeConfiguration(80, 100), 0.25);
      expectSize(size, { width: 12.5, height: 25 }); // max 25 20
    });
    test('ratio equal to 1', () => {
      const size = computeScaledIconSize({ width: 50, height: 50 }, newIconStyleConfiguration(), newShapeConfiguration(80, 100), 1);
      expectSize(size, { width: 80, height: 80 }); // max 80 100
    });
    test('non zero stroke width', () => {
      const size = computeScaledIconSize({ width: 100, height: 200 }, newIconStyleConfiguration(1), newShapeConfiguration(80, 100), 0.25);
      expectSize(size, { width: 12.5, height: 25 }); // max 25 20
    });
  });
});
