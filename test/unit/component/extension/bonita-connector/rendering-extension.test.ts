/**
 * @jest-environment jsdom
 */
/*
Copyright 2026 Bonitasoft S.A.

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

import type { mxCellState, mxShape } from 'mxgraph';

import { bonitaConnectorRenderingExtension } from '@lib/component/extension/bonita-connector/rendering-extension';

const paintForeground = (): void => {
  // the original painting, not called in these tests
};

const paintTaskIcon = (): void => {
  // only its presence matters, it is how the task shapes are detected
};

function newTaskShape(): mxShape {
  return { paintForeground, paintTaskIcon } as unknown as mxShape;
}

function newNonTaskShape(): mxShape {
  return { paintForeground } as unknown as mxShape;
}

function newState(hasConnectorStyleValue?: string): mxCellState {
  return { style: hasConnectorStyleValue === undefined ? {} : { 'bonita.hasConnector': hasConnectorStyleValue } } as unknown as mxCellState;
}

describe('Bonita connector — rendering extension', () => {
  describe('onShapeCreated', () => {
    it('decorates the painting of a task shape whose style holds a connector', () => {
      const shape = newTaskShape();

      bonitaConnectorRenderingExtension.onShapeCreated(shape, newState('true'));

      expect(shape.paintForeground).not.toBe(paintForeground);
    });

    it.each([
      ['the style does not hold the property', undefined],
      ['the property is not true', 'false'],
    ])('leaves the painting of a task shape untouched when %s', (_name: string, styleValue: string) => {
      const shape = newTaskShape();

      bonitaConnectorRenderingExtension.onShapeCreated(shape, newState(styleValue));

      expect(shape.paintForeground).toBe(paintForeground);
    });

    it('leaves the painting of a non task shape untouched even when its style holds a connector', () => {
      const shape = newNonTaskShape();

      bonitaConnectorRenderingExtension.onShapeCreated(shape, newState('true'));

      expect(shape.paintForeground).toBe(paintForeground);
    });
  });
});
