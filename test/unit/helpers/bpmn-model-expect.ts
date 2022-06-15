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
import type { GlobalTaskKind, MessageVisibleKind, SequenceFlowKind, ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnMarkerKind } from '../../../src/model/bpmn/internal';
import type { Waypoint } from '../../../src/model/bpmn/internal/edge/edge';
import type Shape from '../../../src/model/bpmn/internal/shape/Shape';
import { ShapeBpmnActivity, ShapeBpmnCallActivity } from '../../../src/model/bpmn/internal/shape/ShapeBpmnElement';

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

export const verifyShape = (shape: Shape, expectedShape: ExpectedShape | ExpectedActivityShape | ExpectedCallActivityShape): void => {
  expect(shape.id).toEqual(expectedShape.shapeId);
  expect(shape.isHorizontal).toEqual(expectedShape.isHorizontal);

  const bpmnElement = shape.bpmnElement;
  expect(bpmnElement.id).toEqual(expectedShape.bpmnElementId);
  expect(bpmnElement.name).toEqual(expectedShape.bpmnElementName);
  expect(bpmnElement.kind).toEqual(expectedShape.bpmnElementKind);
  expect(bpmnElement.parentId).toEqual(expectedShape.parentId);

  if (bpmnElement instanceof ShapeBpmnActivity) {
    const expectedActivityShape = expectedShape as ExpectedActivityShape;
    if (expectedActivityShape.bpmnElementMarkers) {
      expect(bpmnElement.markers).toEqual(expectedActivityShape.bpmnElementMarkers);
    } else {
      expect(bpmnElement.markers).toHaveLength(0);
    }

    if (bpmnElement instanceof ShapeBpmnCallActivity) {
      expect(bpmnElement.callActivityKind).toEqual((expectedActivityShape as ExpectedCallActivityShape).bpmnElementCallActivityKind);
      expect(bpmnElement.globalTaskKind).toEqual((expectedActivityShape as ExpectedCallActivityShape).bpmnElementGlobalTaskKind);
    }
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
