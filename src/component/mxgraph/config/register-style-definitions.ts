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

import type { AbstractCanvas2D, Cell, Point, Shape } from '@maxgraph/core';

import { ShapeBpmnElementKind } from '../../../model/bpmn/internal';
import { CellRenderer, mxgraph } from '../initializer';
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
import { BpmnStyleIdentifier, MarkerIdentifier } from '../style';

export const registerShapes = (): void => {
  // Inspired by the default shapes registration done in maxGraph
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- required by the signature of registerShape
  const shapesToRegister: [string, new (...arguments_: any) => Shape][] = [
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
    CellRenderer.registerShape(shapeName, shapeClass);
  }
};
// This implementation is adapted from the draw.io BPMN 'dash' marker
// https://github.com/jgraph/drawio/blob/f539f1ff362e76127dcc7e68b5a9d83dd7d4965c/src/main/webapp/js/mxgraph/Shapes.js#L2796
// prefix parameter name - common practice to acknowledge the fact that some parameter is unused (e.g. in TypeScript compiler)
const dashMarkerFactory = (
  c: AbstractCanvas2D,
  _shape: Shape,
  _type: string,
  pe: Point,
  unitX: number,
  unitY: number,
  size: number,
  _source: Cell,
  strokewidth: number,
  // eslint-disable-next-line unicorn/consistent-function-scoping -- Code from mxGraph example
): (() => void) => {
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
  mxgraph.mxMarker.addMarker(MarkerIdentifier.ARROW_DASH, dashMarkerFactory);
};
