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

import type { TFlowNode } from '@lib/model/bpmn/json/baseElement/flowElement';

import { bonitaConnectorParsingExtension } from '@lib/component/extension/bonita-connector/parsing-extension';
import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';
import ShapeBpmnElement from '@lib/model/bpmn/internal/shape/ShapeBpmnElement';

function newShapeBpmnElement(kind: ShapeBpmnElementKind): ShapeBpmnElement {
  return new ShapeBpmnElement('id', 'name', kind);
}

function newFlowNode(implementation?: string): TFlowNode {
  return { id: 'id', implementation } as TFlowNode;
}

describe('Bonita connector — parsing extension', () => {
  describe('onFlowNodeConverted', () => {
    it('detects a connector on a service task with the Bonita implementation', () => {
      const shapeBpmnElement = newShapeBpmnElement(ShapeBpmnElementKind.TASK_SERVICE);

      bonitaConnectorParsingExtension.onFlowNodeConverted(shapeBpmnElement, newFlowNode('BonitaConnector'));

      expect(shapeBpmnElement.extensions.bonita.hasConnector).toBeTrue();
    });

    it('does not detect a connector on a service task with another implementation', () => {
      const shapeBpmnElement = newShapeBpmnElement(ShapeBpmnElementKind.TASK_SERVICE);

      bonitaConnectorParsingExtension.onFlowNodeConverted(shapeBpmnElement, newFlowNode('##WebService'));

      expect(shapeBpmnElement.extensions.bonita).toBeUndefined();
    });

    it('does not detect a connector on a service task without the implementation attribute', () => {
      const shapeBpmnElement = newShapeBpmnElement(ShapeBpmnElementKind.TASK_SERVICE);

      bonitaConnectorParsingExtension.onFlowNodeConverted(shapeBpmnElement, newFlowNode());

      expect(shapeBpmnElement.extensions.bonita).toBeUndefined();
    });

    // Bonita only exports the connector information on service tasks
    it.each([ShapeBpmnElementKind.TASK, ShapeBpmnElementKind.TASK_USER, ShapeBpmnElementKind.TASK_SCRIPT, ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.EVENT_START])(
      'does not detect a connector on a %s holding the Bonita implementation',
      (kind: ShapeBpmnElementKind) => {
        const shapeBpmnElement = newShapeBpmnElement(kind);

        bonitaConnectorParsingExtension.onFlowNodeConverted(shapeBpmnElement, newFlowNode('BonitaConnector'));

        expect(shapeBpmnElement.extensions.bonita).toBeUndefined();
      },
    );

    it('does not pollute extensions when there is no connector', () => {
      const shapeBpmnElement = newShapeBpmnElement(ShapeBpmnElementKind.TASK_SERVICE);

      bonitaConnectorParsingExtension.onFlowNodeConverted(shapeBpmnElement, newFlowNode());

      expect(Object.hasOwn(shapeBpmnElement.extensions, 'bonita')).toBeFalse();
    });
  });
});
