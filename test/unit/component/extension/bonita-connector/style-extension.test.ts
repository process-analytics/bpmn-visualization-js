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

import { bonitaConnectorStyleExtension } from '@lib/component/extension/bonita-connector/style-extension';
import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';
import Shape from '@lib/model/bpmn/internal/shape/Shape';
import ShapeBpmnElement from '@lib/model/bpmn/internal/shape/ShapeBpmnElement';

function newShape(hasConnector?: boolean): Shape {
  const shapeBpmnElement = new ShapeBpmnElement('id', 'name', ShapeBpmnElementKind.TASK_SERVICE);
  if (hasConnector !== undefined) {
    shapeBpmnElement.extensions.bonita = { hasConnector };
  }
  return new Shape('id', shapeBpmnElement);
}

describe('Bonita connector — style extension', () => {
  describe('enrichShapeStyle', () => {
    it('sets the style as a string when the element has a connector', () => {
      const styleValues = new Map<string, string | number>();

      bonitaConnectorStyleExtension.enrichShapeStyle(newShape(true), styleValues);

      expect(styleValues.get('bonita.hasConnector')).toBe('true');
      expect(styleValues.size).toBe(1);
    });

    it('does not set the style when the element has no connector', () => {
      const styleValues = new Map<string, string | number>();

      bonitaConnectorStyleExtension.enrichShapeStyle(newShape(false), styleValues);

      expect(styleValues.has('bonita.hasConnector')).toBeFalse();
      expect(styleValues.size).toBe(0);
    });

    it('does not set the style when the element has no Bonita extensions at all', () => {
      const styleValues = new Map<string, string | number>();

      bonitaConnectorStyleExtension.enrichShapeStyle(newShape(), styleValues);

      expect(styleValues.has('bonita.hasConnector')).toBeFalse();
      expect(styleValues.size).toBe(0);
    });
  });
});
