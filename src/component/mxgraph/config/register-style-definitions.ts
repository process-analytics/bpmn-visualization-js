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

import type { MarkerFactoryFunction, PerimeterFunction, PerimeterValue, ShapeConstructor, StyleArrowValue } from '@maxgraph/core';

import { EdgeMarker, EdgeMarkerRegistry, Perimeter, PerimeterRegistry, ShapeRegistry, SwimlaneShape } from '@maxgraph/core';

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
  const markersToRegister: [StyleArrowValue, MarkerFactoryFunction][] = [
    // maxGraph built-in markers used in bpmn-visualization: BaseGraph registers nothing, so only the markers referenced
    // by the BPMN edge styles are registered explicitly (instead of registerDefaultEdgeMarkers()) to reduce the bundle size.
    // See https://github.com/maxGraph/maxGraph/blob/0a18ab1479f0235087c7763dafc098f12cd5f0c9/packages/core/src/view/style/register.ts#L139
    ['blockThin', EdgeMarker.createArrow(3)],
    ['openThin', EdgeMarker.createOpenArrow(3)],
    ['oval', EdgeMarker.oval],
    ['diamondThin', EdgeMarker.diamond],
    // BPMN specific marker used for associations
    [MarkerIdentifier.ARROW_DASH, dashMarkerFactory],
  ];
  for (const [type, factory] of markersToRegister) {
    EdgeMarkerRegistry.add(type, factory);
  }
};

export const registerPerimeters = (): void => {
  // maxGraph built-in perimeters used in bpmn-visualization: BaseGraph registers nothing, so only the perimeters
  // referenced by the BPMN vertex styles are registered explicitly (instead of registerDefaultPerimeters()) to reduce the bundle size.
  // See https://github.com/maxGraph/maxGraph/blob/0a18ab1479f0235087c7763dafc098f12cd5f0c9/packages/core/src/view/style/register.ts#L74
  const perimetersToRegister: [PerimeterValue, PerimeterFunction][] = [
    ['ellipsePerimeter', Perimeter.EllipsePerimeter],
    ['rectanglePerimeter', Perimeter.RectanglePerimeter],
    ['rhombusPerimeter', Perimeter.RhombusPerimeter],
  ];
  for (const [name, perimeter] of perimetersToRegister) {
    PerimeterRegistry.add(name, perimeter);
  }
};
