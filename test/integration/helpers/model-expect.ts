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

import type {
  AssociationDirectionKind,
  Fill,
  FlowKind,
  GlobalTaskKind,
  MessageVisibleKind,
  Opacity,
  SequenceFlowKind,
  ShapeBpmnEventBasedGatewayKind,
  ShapeBpmnEventDefinitionKind,
  ShapeBpmnMarkerKind,
  ShapeBpmnSubProcessKind,
  Stroke,
} from '@lib/bpmn-visualization';
import { BpmnVisualization, ShapeBpmnElementKind } from '@lib/bpmn-visualization';
import {
  toBeAssociationFlow,
  toBeBoundaryEvent,
  toBeBusinessRuleTask,
  toBeCallActivity,
  toBeCell,
  toBeCellWithParentAndGeometry,
  toBeEndEvent,
  toBeEventBasedGateway,
  toBeExclusiveGateway,
  toBeGroup,
  toBeInclusiveGateway,
  toBeIntermediateCatchEvent,
  toBeIntermediateThrowEvent,
  toBeLane,
  toBeManualTask,
  toBeMessageFlow,
  toBeParallelGateway,
  toBePool,
  toBeReceiveTask,
  toBeScriptTask,
  toBeSendTask,
  toBeSequenceFlow,
  toBeServiceTask,
  toBeStartEvent,
  toBeSubProcess,
  toBeTask,
  toBeTextAnnotation,
  toBeUserTask,
} from '../matchers';
import type { AlignValue, StyleArrowValue, Cell, FilterFunction, Geometry, ShapeValue, VAlignValue } from '@maxgraph/core';
import type { ExpectedOverlay } from '../matchers/matcher-utils';
import { getCell } from '../matchers/matcher-utils';
import type { BpmnCellStyle } from '@lib/component/mxgraph/style/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeCell(): R;
      toBeCellWithParentAndGeometry(modelElement: ExpectedCellWithGeometry): R;
      toBeSequenceFlow(modelElement: ExpectedSequenceFlowModelElement): R;
      toBeMessageFlow(modelElement: ExpectedEdgeModelElement): R;
      toBeAssociationFlow(modelElement: ExpectedEdgeModelElement): R;
      toBeTask(modelElement: ExpectedShapeModelElement): R;
      toBeServiceTask(modelElement: ExpectedShapeModelElement): R;
      toBeUserTask(modelElement: ExpectedShapeModelElement): R;
      toBeReceiveTask(modelElement: ExpectedShapeModelElement): R;
      toBeSendTask(modelElement: ExpectedShapeModelElement): R;
      toBeManualTask(modelElement: ExpectedShapeModelElement): R;
      toBeScriptTask(modelElement: ExpectedShapeModelElement): R;
      toBeBusinessRuleTask(modelElement: ExpectedShapeModelElement): R;
      toBeStartEvent(modelElement: ExpectedStartEventModelElement): R;
      toBeEndEvent(modelElement: ExpectedEventModelElement): R;
      toBeIntermediateThrowEvent(modelElement: ExpectedEventModelElement): R;
      toBeIntermediateCatchEvent(modelElement: ExpectedEventModelElement): R;
      toBeBoundaryEvent(modelElement: ExpectedBoundaryEventModelElement): R;
      toBeEventBasedGateway(modelElement: ExpectedEventBasedGatewayModelElement): R;
      toBeExclusiveGateway(modelElement: ExpectedShapeModelElement): R;
      toBeInclusiveGateway(modelElement: ExpectedShapeModelElement): R;
      toBeParallelGateway(modelElement: ExpectedShapeModelElement): R;
      toBeCallActivity(modelElement: ExpectedCallActivityModelElement): R;
      toBeSubProcess(modelElement: ExpectedSubProcessModelElement): R;
      toBePool(modelElement: ExpectedShapeModelElement): R;
      toBeLane(modelElement: ExpectedShapeModelElement): R;
      toBeGroup(modelElement: ExpectedShapeModelElement): R;
      toBeTextAnnotation(modelElement: ExpectedShapeModelElement): R;
    }
  }
}

expect.extend({
  toBeCell,
  toBeCellWithParentAndGeometry,
  toBeSequenceFlow,
  toBeMessageFlow,
  toBeAssociationFlow,
  // tasks
  toBeTask,
  toBeServiceTask,
  toBeUserTask,
  toBeReceiveTask,
  toBeSendTask,
  toBeManualTask,
  toBeScriptTask,
  toBeBusinessRuleTask,
  // other activities
  toBeCallActivity,
  toBeSubProcess,
  // events
  toBeStartEvent,
  toBeEndEvent,
  toBeIntermediateThrowEvent,
  toBeIntermediateCatchEvent,
  toBeBoundaryEvent,
  // gateways
  toBeEventBasedGateway,
  toBeExclusiveGateway,
  toBeInclusiveGateway,
  toBeParallelGateway,
  // containers
  toBePool,
  toBeLane,
  // artifacts
  toBeGroup,
  toBeTextAnnotation,
});

export interface ExpectedCellWithGeometry {
  parentId?: string;
  geometry: Geometry;
}

export interface ExpectedFont {
  color?: string;
  family?: string;
  size?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikeThrough?: boolean;
  opacity?: Opacity;
}

type ExpectedModelElement = {
  align?: AlignValue;
  font?: ExpectedFont;
  label?: string;
  overlays?: ExpectedOverlay[];
  parentId?: string;
  stroke?: Stroke;
  verticalAlign?: VAlignValue;
  opacity?: number;
  // custom bpmn-visualization
  extraCssClasses?: string[];
};

export interface ExpectedShapeModelElement extends ExpectedModelElement {
  kind?: ShapeBpmnElementKind;
  /** Generally needed when the BPMN shape doesn't exist yet (use an arbitrary shape until the final render is implemented) */
  styleShape?: ShapeValue | string;
  markers?: ShapeBpmnMarkerKind[];
  isInstantiating?: boolean;
  /**
   * This is the value in the mxGraph model, not what is from the BPMN Shape. This applies to the labels so the value is inverted comparing to the BPMN model.
   * - Horizontal pool/lane --> false (the label is vertical)
   * - Vertical pool/lane --> true (the label is horizontal)
   **/
  isSwimLaneLabelHorizontal?: boolean;
  fill?: Fill;
}

export interface ExpectedEventModelElement extends ExpectedShapeModelElement {
  eventDefinitionKind: ShapeBpmnEventDefinitionKind;
}

export interface ExpectedSubProcessModelElement extends ExpectedShapeModelElement {
  subProcessKind: ShapeBpmnSubProcessKind;
}

export interface ExpectedCallActivityModelElement extends ExpectedShapeModelElement {
  globalTaskKind?: GlobalTaskKind;
}

export interface ExpectedEdgeModelElement extends ExpectedModelElement {
  kind?: FlowKind;
  startArrow?: StyleArrowValue;
  endArrow?: StyleArrowValue;
  messageVisibleKind?: MessageVisibleKind;
}

export interface ExpectedSequenceFlowModelElement extends ExpectedEdgeModelElement {
  sequenceFlowKind?: SequenceFlowKind;
}

export interface ExpectedAssociationFlowModelElement extends ExpectedEdgeModelElement {
  associationDirectionKind?: AssociationDirectionKind;
}

export interface ExpectedBoundaryEventModelElement extends ExpectedEventModelElement {
  isInterrupting?: boolean;
}
export interface ExpectedStartEventModelElement extends ExpectedEventModelElement {
  isInterrupting?: boolean;
}

export interface ExpectedEventBasedGatewayModelElement extends ExpectedShapeModelElement {
  gatewayKind?: ShapeBpmnEventBasedGatewayKind;
}

export const bpmnVisualization = new BpmnVisualization(null);
const getDefaultParent = (): Cell => bpmnVisualization.graph.getDefaultParent();

export const getDefaultParentId = (): string => getDefaultParent().id;

const expectElementsInModel = (parentId: string, elementsNumber: number, filter: FilterFunction): void => {
  const parentCell = parentId ? getCell(parentId) : getDefaultParent();
  const descendants = parentCell.filterDescendants(filter);
  expect(descendants).toHaveLength(elementsNumber);
};

export const expectPoolsInModel = (pools: number): void => {
  expectElementsInModel(undefined, pools, (cell: Cell): boolean => {
    return cell != getDefaultParent() && (cell.style as BpmnCellStyle).bpmn.kind == ShapeBpmnElementKind.POOL;
  });
};

export const expectShapesInModel = (parentId: string, shapesNumber: number): void => {
  expectElementsInModel(parentId, shapesNumber, (cell: Cell): boolean => {
    return cell.getId() != parentId && cell.isVertex();
  });
};

export const expectTotalShapesInModel = (shapesNumber: number): void => {
  expectShapesInModel(undefined, shapesNumber);
};

export const expectEdgesInModel = (parentId: string, edgesNumber: number): void => {
  expectElementsInModel(parentId, edgesNumber, (cell: Cell): boolean => {
    return cell.isEdge();
  });
};

export const expectTotalEdgesInModel = (edgesNumber: number): void => {
  expectEdgesInModel(undefined, edgesNumber);
};
