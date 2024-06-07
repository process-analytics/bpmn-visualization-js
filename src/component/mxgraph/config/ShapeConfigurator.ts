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

import type { mxShape } from 'mxgraph';

import { ShapeBpmnElementKind } from '../../../model/bpmn/internal';
import { mxCellRenderer } from '../initializer';
import {
  BusinessRuleTaskShape,
  CallActivityShape,
  ManualTaskShape,
  ReceiveTaskShape,
  ScriptTaskShape,
  SendTaskShape,
  ServiceTaskShape,
  SubProcessShape,
  TaskShape,
  UserTaskShape,
} from '../shape/activity-shapes';
import { BpmnConnector } from '../shape/edges';
import { EndEventShape, EventShape, IntermediateEventShape, ThrowIntermediateEventShape } from '../shape/event-shapes';
import { MessageFlowIconShape } from '../shape/flow-shapes';
import { ComplexGatewayShape, EventBasedGatewayShape, ExclusiveGatewayShape, InclusiveGatewayShape, ParallelGatewayShape } from '../shape/gateway-shapes';
import { TextAnnotationShape } from '../shape/text-annotation-shapes';
import { BpmnStyleIdentifier } from '../style';

const registerShapes = (): void => {
  // Inspired by the default shapes registration done in maxGraph
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- required by the signature of registerShape
  const shapesToRegister: [string, new (...arguments_: any) => mxShape][] = [
    // events
    [ShapeBpmnElementKind.EVENT_END, EndEventShape],
    [ShapeBpmnElementKind.EVENT_START, EventShape],
    [ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW, ThrowIntermediateEventShape],
    [ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH, IntermediateEventShape],
    [ShapeBpmnElementKind.EVENT_BOUNDARY, IntermediateEventShape],
    // gateways
    [ShapeBpmnElementKind.GATEWAY_COMPLEX, ComplexGatewayShape],
    [ShapeBpmnElementKind.GATEWAY_EVENT_BASED, EventBasedGatewayShape],
    [ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, ExclusiveGatewayShape],
    [ShapeBpmnElementKind.GATEWAY_INCLUSIVE, InclusiveGatewayShape],
    [ShapeBpmnElementKind.GATEWAY_PARALLEL, ParallelGatewayShape],
    // activities
    [ShapeBpmnElementKind.SUB_PROCESS, SubProcessShape],
    [ShapeBpmnElementKind.CALL_ACTIVITY, CallActivityShape],
    // tasks
    [ShapeBpmnElementKind.TASK, TaskShape],
    [ShapeBpmnElementKind.TASK_SERVICE, ServiceTaskShape],
    [ShapeBpmnElementKind.TASK_USER, UserTaskShape],
    [ShapeBpmnElementKind.TASK_RECEIVE, ReceiveTaskShape],
    [ShapeBpmnElementKind.TASK_SEND, SendTaskShape],
    [ShapeBpmnElementKind.TASK_MANUAL, ManualTaskShape],
    [ShapeBpmnElementKind.TASK_SCRIPT, ScriptTaskShape],
    [ShapeBpmnElementKind.TASK_BUSINESS_RULE, BusinessRuleTaskShape],
    // artifacts
    [ShapeBpmnElementKind.TEXT_ANNOTATION, TextAnnotationShape],
    // shapes for flows
    [BpmnStyleIdentifier.EDGE, BpmnConnector],
    [BpmnStyleIdentifier.MESSAGE_FLOW_ICON, MessageFlowIconShape],
  ];
  for (const [shapeName, shapeClass] of shapesToRegister) {
    mxCellRenderer.registerShape(shapeName, shapeClass);
  }
};

/**
 * @internal
 */
export default class ShapeConfigurator {
  configureShapes(): void {
    registerShapes();
  }
}
