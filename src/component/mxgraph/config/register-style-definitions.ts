/*
Copyright 2025 Bonitasoft S.A.

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

import type { MarkerFactoryFunction, ShapeConstructor } from '@maxgraph/core';

import { EdgeMarkerRegistry, registerDefaultEdgeMarkers, registerDefaultPerimeters, ShapeRegistry, SwimlaneShape } from '@maxgraph/core';

import { ShapeBpmnElementKind } from '../../../model/bpmn/internal';
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
import { EndEventShape, EventShape, IntermediateEventShape, ThrowIntermediateEventShape } from '../shape/event-shapes';
import { MessageFlowIconShape } from '../shape/flow-shapes';
import { ComplexGatewayShape, EventBasedGatewayShape, ExclusiveGatewayShape, InclusiveGatewayShape, ParallelGatewayShape } from '../shape/gateway-shapes';
import { TextAnnotationShape } from '../shape/text-annotation-shapes';
import { BpmnStyleIdentifier, MarkerIdentifier } from '../style';

export const registerShapes = (): void => {
  const shapesToRegister: [string, ShapeConstructor][] = [
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
    [BpmnStyleIdentifier.MESSAGE_FLOW_ICON, MessageFlowIconShape],
    // maxGraph built-in shape: BaseGraph registers nothing, so the swimlane shape (pools and lanes) must be registered explicitly
    ['swimlane', SwimlaneShape],
  ];
  for (const [shapeName, shapeClass] of shapesToRegister) {
    ShapeRegistry.add(shapeName, shapeClass);
  }
};

// This implementation is adapted from the draw.io BPMN 'dash' marker
// https://github.com/jgraph/drawio/blob/f539f1ff362e76127dcc7e68b5a9d83dd7d4965c/src/main/webapp/js/mxgraph/Shapes.js#L2796
// prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
const dashMarkerFactory: MarkerFactoryFunction = (c, _shape, _type, pe, unitX, unitY, size, _source, strokewidth) => {
  const nx = unitX * (size + strokewidth + 4);
  const ny = unitY * (size + strokewidth + 4);

  return function () {
    c.begin();
    c.moveTo(pe.x - nx / 2 - ny / 2, pe.y - ny / 2 + nx / 2);
    c.lineTo(pe.x + ny / 2 - (3 * nx) / 2, pe.y - (3 * ny) / 2 - nx / 2);
    c.stroke();
  };
};

export const registerEdgeMarkers = (): void => {
  // maxGraph built-in markers: BaseGraph registers nothing, so the markers referenced by the BPMN edge styles
  // (blockThin, openThin, oval, diamondThin) must be registered explicitly.
  // TODO maxGraph@0.23.0 there are some edge markers in the maxGraph default that we do not use in bpmn-visualization. Register only the ones we need to reduce the bundle size.
  // See previous poc
  registerDefaultEdgeMarkers();
  EdgeMarkerRegistry.add(MarkerIdentifier.ARROW_DASH, dashMarkerFactory);
};

export const registerPerimeters = (): void => {
  // maxGraph built-in perimeters: BaseGraph registers nothing, so the ellipse/rectangle/rhombus perimeters
  // referenced by the BPMN vertex styles must be registered explicitly.
  // TODO maxGraph@0.23.0 there are some perimeters in the maxGraph default that we do not use in bpmn-visualization. Register only the ones we need to reduce the bundle size.
  // See previous poc
  registerDefaultPerimeters();
};
