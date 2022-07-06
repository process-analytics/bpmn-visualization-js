/**
 * Copyright 2022 Bonitasoft S.A.
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

import type { GlobalTaskKind, ShapeBpmnCallActivityKind, ShapeBpmnMarkerKind, ShapeBpmnElementKind } from '../../../src/model/bpmn/internal';
import type { Edge, Waypoint } from '../../../src/model/bpmn/internal/edge/edge';
import type Shape from '../../../src/model/bpmn/internal/shape/Shape';
import { ShapeBpmnActivity, ShapeBpmnBoundaryEvent, ShapeBpmnCallActivity } from '../../../src/model/bpmn/internal/shape/ShapeBpmnElement';
import { SequenceFlow } from '../../../src/model/bpmn/internal/edge/flows';
import { FlowKind, MessageVisibleKind, SequenceFlowKind } from '../../../src/model/bpmn/internal';

export interface ExpectedShape {
  shapeId: string;
  bpmnElementId: string;
  bpmnElementName: string;
  bpmnElementKind: ShapeBpmnElementKind;
  parentId?: string;
  bounds?: ExpectedBounds;
  isHorizontal?: boolean;
}

export interface ExpectedActivityShape extends ExpectedShape {
  bpmnElementMarkers?: ShapeBpmnMarkerKind[];
}

export interface ExpectedCallActivityShape extends ExpectedActivityShape {
  bpmnElementGlobalTaskKind?: GlobalTaskKind;
  bpmnElementCallActivityKind?: ShapeBpmnCallActivityKind;
}

export interface ExpectedEventShape extends ExpectedShape {
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
}

export interface ExpectedSequenceEdge extends ExpectedEdge {
  bpmnElementSequenceFlowKind?: SequenceFlowKind;
}

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

export const verifyShape = (shape: Shape, expectedShape: ExpectedShape | ExpectedActivityShape | ExpectedCallActivityShape | ExpectedEventShape): void => {
  expect(shape.id).toEqual(expectedShape.shapeId);
  expect(shape.isHorizontal).toEqual(expectedShape.isHorizontal);

  const bpmnElement = shape.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedShape.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedShape.bpmnElementName);
  expect(bpmnElement.kind).toEqual(expectedShape.bpmnElementKind);
  expect(bpmnElement.parentId).toEqual(expectedShape.parentId);

  if ('bpmnElementMarkers' in expectedShape) {
    expect(bpmnElement instanceof ShapeBpmnActivity).toBeTruthy();
    expect((bpmnElement as ShapeBpmnActivity).markers).toEqual((expectedShape as ExpectedActivityShape).bpmnElementMarkers);
  } else if (bpmnElement instanceof ShapeBpmnActivity) {
    expect(bpmnElement.markers).toHaveLength(0);
  }

  if ('callActivityKind' in expectedShape || 'globalTaskKind' in expectedShape) {
    expect(bpmnElement instanceof ShapeBpmnCallActivity).toBeTruthy();
    expect((bpmnElement as ShapeBpmnCallActivity).callActivityKind).toEqual((expectedShape as ExpectedCallActivityShape).bpmnElementCallActivityKind);
    expect((bpmnElement as ShapeBpmnCallActivity).globalTaskKind).toEqual((expectedShape as ExpectedCallActivityShape).bpmnElementGlobalTaskKind);
  }

  if ('isInterrupting' in expectedShape) {
    expect(bpmnElement instanceof ShapeBpmnBoundaryEvent).toBeTruthy();
    expect((bpmnElement as ShapeBpmnBoundaryEvent).isInterrupting).toEqual((expectedShape as ExpectedEventShape).isInterrupting);
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
  expect(bpmnElement.sourceRefId).toEqual(expectedValue.bpmnElementSourceRefId);
  expect(bpmnElement.targetRefId).toEqual(expectedValue.bpmnElementTargetRefId);

  if (bpmnElement instanceof SequenceFlow) {
    expect(edge.bpmnElement.kind).toEqual(FlowKind.SEQUENCE_FLOW);
    const sequenceEdge = expectedValue as ExpectedSequenceEdge;
    if (sequenceEdge.bpmnElementSequenceFlowKind) {
      expect(bpmnElement.sequenceFlowKind).toEqual(sequenceEdge.bpmnElementSequenceFlowKind);
    } else {
      expect(bpmnElement.sequenceFlowKind).toEqual(SequenceFlowKind.NORMAL);
    }
  }
};
