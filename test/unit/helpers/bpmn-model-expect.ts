/*
Copyright 2022 Bonitasoft S.A.

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

import type { GlobalTaskKind, ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';
import type BpmnModel from '@lib/model/bpmn/internal/BpmnModel';
import type { Edge, Waypoint } from '@lib/model/bpmn/internal/edge/edge';
import type Shape from '@lib/model/bpmn/internal/shape/Shape';
import type { EdgeExtensions, LabelExtensions, ShapeExtensions } from '@lib/model/bpmn/internal/types';
import type { TProcess } from '@lib/model/bpmn/json/baseElement/rootElement/rootElement';

import { FlowKind, MessageVisibleKind, SequenceFlowKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from '@lib/model/bpmn/internal';
import { SequenceFlow } from '@lib/model/bpmn/internal/edge/flows';
import { ShapeBpmnActivity, ShapeBpmnBoundaryEvent, ShapeBpmnCallActivity, ShapeBpmnEvent } from '@lib/model/bpmn/internal/shape/ShapeBpmnElement';

export interface ExpectedShape {
  shapeId: string;
  bpmnElementId: string;
  bpmnElementName: string;
  bpmnElementKind: ShapeBpmnElementKind;
  bpmnElementIncomingIds?: string[];
  bpmnElementOutgoingIds?: string[];
  parentId?: string;
  bounds?: ExpectedBounds;
  isHorizontal?: boolean;
  extensions?: ShapeExtensions;
}

export interface ExpectedActivityShape extends ExpectedShape {
  bpmnElementMarkers?: ShapeBpmnMarkerKind[];
}

export interface ExpectedCallActivityShape extends ExpectedActivityShape {
  bpmnElementGlobalTaskKind?: GlobalTaskKind;
  bpmnElementCallActivityKind: ShapeBpmnCallActivityKind;
}

export interface ExpectedEventShape extends ExpectedShape {
  eventDefinitionKind: ShapeBpmnEventDefinitionKind;
}

export interface ExpectedBoundaryEventShape extends ExpectedEventShape {
  isInterrupting?: boolean;
}

export interface ExpectedEdge {
  edgeId: string;
  bpmnElementId: string;
  bpmnElementName?: string;
  bpmnElementSourceRefId: string;
  bpmnElementTargetRefId: string;
  waypoints: Waypoint[];
  messageVisibleKind?: MessageVisibleKind;
  extensions?: EdgeExtensions;
}

export interface ExpectedSequenceEdge extends ExpectedEdge {
  bpmnElementSequenceFlowKind?: SequenceFlowKind;
}

export type ExpectedLabel = {
  bounds?: ExpectedBounds;
  extensions?: LabelExtensions;
  font?: ExpectedFont;
};

export interface ExpectedFont {
  name?: string;
  size?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikeThrough?: boolean;
}

export interface ExpectedBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const verifyShape = (
  shape: Shape,
  expectedShape: ExpectedShape | ExpectedActivityShape | ExpectedCallActivityShape | ExpectedEventShape | ExpectedBoundaryEventShape,
): void => {
  expect(shape.id).toEqual(expectedShape.shapeId);
  expect(shape.isHorizontal).toEqual(expectedShape.isHorizontal);

  const bpmnElement = shape.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedShape.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedShape.bpmnElementName);
  expect(bpmnElement.kind).toEqual(expectedShape.bpmnElementKind);
  expect(bpmnElement.parentId).toEqual(expectedShape.parentId);
  expect(bpmnElement.incomingIds).toEqual(expectedShape.bpmnElementIncomingIds ?? []);
  expect(bpmnElement.outgoingIds).toEqual(expectedShape.bpmnElementOutgoingIds ?? []);

  if ('bpmnElementMarkers' in expectedShape) {
    expect(bpmnElement instanceof ShapeBpmnActivity).toBeTruthy();
    // ignore marker order, which is only relevant when rendering the shape (it has its own order algorithm)
    expect((bpmnElement as ShapeBpmnActivity).markers.sort()).toEqual((expectedShape as ExpectedActivityShape).bpmnElementMarkers.sort());
  } else if (bpmnElement instanceof ShapeBpmnActivity) {
    expect(bpmnElement.markers).toHaveLength(0);
  }

  if ('bpmnElementCallActivityKind' in expectedShape && expectedShape.bpmnElementCallActivityKind) {
    expect(bpmnElement instanceof ShapeBpmnCallActivity).toBeTruthy();
    expect((bpmnElement as ShapeBpmnCallActivity).callActivityKind).toEqual(expectedShape.bpmnElementCallActivityKind);
    expect((bpmnElement as ShapeBpmnCallActivity).globalTaskKind).toEqual(expectedShape.bpmnElementGlobalTaskKind);
  }

  if ('eventDefinitionKind' in expectedShape) {
    expect(bpmnElement instanceof ShapeBpmnEvent).toBeTruthy();
    expect((bpmnElement as ShapeBpmnEvent).eventDefinitionKind).toEqual((expectedShape as ExpectedEventShape).eventDefinitionKind);
  }

  if ('isInterrupting' in expectedShape) {
    expect(bpmnElement instanceof ShapeBpmnBoundaryEvent).toBeTruthy();
    expect((bpmnElement as ShapeBpmnBoundaryEvent).isInterrupting).toEqual(expectedShape.isInterrupting);
  }

  const bounds = shape.bounds;
  const expectedBounds = expectedShape.bounds;
  if (!bounds) {
    expect(bounds).toBe(expectedBounds);
  } else {
    expect(bounds.x).toEqual(expectedBounds.x);
    expect(bounds.y).toEqual(expectedBounds.y);
    expect(bounds.width).toEqual(expectedBounds.width);
    expect(bounds.height).toEqual(expectedBounds.height);
  }

  expect(shape.extensions).toEqual(expectedShape.extensions ?? {});
};

export const getExpectedMarkers = (baseMarkers: ShapeBpmnMarkerKind[], testedBpmnElementType: keyof TProcess | ShapeBpmnSubProcessKind): ShapeBpmnMarkerKind[] => {
  if ((testedBpmnElementType == 'adHocSubProcess' || testedBpmnElementType == ShapeBpmnSubProcessKind.AD_HOC) && !baseMarkers.includes(ShapeBpmnMarkerKind.ADHOC)) {
    return [...baseMarkers, ShapeBpmnMarkerKind.ADHOC];
  }
  return baseMarkers;
};

export const verifyEdge = (edge: Edge, expectedValue: ExpectedEdge | ExpectedSequenceEdge): void => {
  expect(edge.id).toEqual(expectedValue.edgeId);
  expect(edge.waypoints).toEqual(expectedValue.waypoints);

  if (expectedValue.messageVisibleKind) {
    expect(edge.messageVisibleKind).toEqual(expectedValue.messageVisibleKind);
  } else {
    expect(edge.messageVisibleKind).toEqual(MessageVisibleKind.NONE);
  }

  const bpmnElement = edge.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedValue.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedValue.bpmnElementName);
  expect(bpmnElement.sourceReferenceId).toEqual(expectedValue.bpmnElementSourceRefId);
  expect(bpmnElement.targetReferenceId).toEqual(expectedValue.bpmnElementTargetRefId);

  if (bpmnElement instanceof SequenceFlow) {
    expect(edge.bpmnElement.kind).toEqual(FlowKind.SEQUENCE_FLOW);
    const sequenceEdge = expectedValue as ExpectedSequenceEdge;
    if (sequenceEdge.bpmnElementSequenceFlowKind) {
      expect(bpmnElement.sequenceFlowKind).toEqual(sequenceEdge.bpmnElementSequenceFlowKind);
    } else {
      expect(bpmnElement.sequenceFlowKind).toEqual(SequenceFlowKind.NORMAL);
    }
  }

  expect(edge.extensions).toEqual(expectedValue.extensions ?? {});
};

export const getPoolByBpmnElementId = (model: BpmnModel, id: string): Shape => model.pools.find(shape => shape.bpmnElement.id === id);

export const getLaneByBpmnElementId = (model: BpmnModel, id: string): Shape => model.lanes.find(shape => shape.bpmnElement.id === id);

export const getFlowNodeByBpmnElementId = (model: BpmnModel, id: string): Shape => model.flowNodes.find(shape => shape.bpmnElement.id === id);

export const getEdgeByBpmnElementId = (model: BpmnModel, id: string): Edge => model.edges.find(edge => edge.bpmnElement.id === id);
