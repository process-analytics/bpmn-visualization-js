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

import type ShapeBpmnElement from '../../../model/bpmn/internal/shape/ShapeBpmnElement';
import type { TFlowNode } from '../../../model/bpmn/json/baseElement/flowElement';
import type { TServiceTask } from '../../../model/bpmn/json/baseElement/flowNode/activity/task';
import type { ParsingExtensionPoint } from '../extension-points';

import './types';

import { ShapeBpmnElementKind } from '../../../model/bpmn/internal';

import { bonitaConnectorImplementation } from './identifiers';

function hasBonitaConnector(serviceTask: TServiceTask): boolean {
  // 'implementation' is typed with the 'tImplementation' enum, restricted to the values of the BPMN specification
  // ('##unspecified' and '##WebService'). Comparing it to the Bonita value requires widening it to string.
  return (serviceTask.implementation as string) === bonitaConnectorImplementation;
}

export const bonitaConnectorParsingExtension: ParsingExtensionPoint = {
  onFlowNodeConverted(shapeBpmnElement: ShapeBpmnElement, bpmnElement: TFlowNode): void {
    // Bonita only exports the connector information on service tasks, from Bonita 7.12 to 11.1 at least. The
    // 'bonitaConnector' namespace is not a usable signal: Bonita declares it on every export, even without connector.
    if (shapeBpmnElement.kind === ShapeBpmnElementKind.TASK_SERVICE && hasBonitaConnector(bpmnElement as TServiceTask)) {
      shapeBpmnElement.extensions.bonita = { hasConnector: true };
    }
  },
};
