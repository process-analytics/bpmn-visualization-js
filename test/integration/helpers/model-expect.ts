/**
 * Copyright 2020 Bonitasoft S.A.
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

import type {
  FlowKind,
  MessageVisibleKind,
  SequenceFlowKind,
  ShapeBpmnEventBasedGatewayKind,
  ShapeBpmnEventDefinitionKind,
  ShapeBpmnMarkerKind,
  ShapeBpmnSubProcessKind,
} from '../../../src/bpmn-visualization';
import { BpmnVisualization, ShapeBpmnElementKind } from '../../../src/bpmn-visualization';
import {
  toBeAssociationFlow,
  toBeBoundaryEvent,
  toBeBusinessRuleTask,
  toBeCallActivity,
  toBeCell,
  toBeCellWithParentAndGeometry,
  toBeEndEvent,
  toBeEventBasedGateway,
  toBeIntermediateCatchEvent,
  toBeIntermediateThrowEvent,
  toBeLane,
  toBeManualTask,
  toBeMessageFlow,
  toBePool,
  toBeReceiveTask,
  toBeScriptTask,
  toBeSendTask,
  toBeSequenceFlow,
  toBeServiceTask,
  toBeShape,
  toBeStartEvent,
  toBeSubProcess,
  toBeTask,
  toBeUserTask,
} from '../matchers';
import type { ArrowType, Cell, FilterFunction, VAlignValue } from '@maxgraph/core';
import type { Geometry } from '@maxgraph/core';
import type { ExpectedOverlay } from '../matchers/matcher-utils';
import { getCell } from '../matchers/matcher-utils';
import type { BPMNCellStyle } from '../../../src/component/mxgraph/renderer/StyleComputer';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeCell(): R;
      toBeCellWithParentAndGeometry(modelElement: ExpectedCellWithGeometry): R;
      toBeSequenceFlow(modelElement: ExpectedSequenceFlowModelElement): R;
      toBeMessageFlow(modelElement: ExpectedEdgeModelElement): R;
      toBeAssociationFlow(modelElement: ExpectedEdgeModelElement): R;
      toBeShape(modelElement: ExpectedShapeModelElement): R;
      toBeCallActivity(modelElement: ExpectedCallActivityModelElement): R;
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
      toBeSubProcess(modelElement: ExpectedSubProcessModelElement): R;
      toBePool(modelElement: ExpectedShapeModelElement): R;
      toBeLane(modelElement: ExpectedShapeModelElement): R;
    }
  }
}

expect.extend({
  toBeCell,
  toBeCellWithParentAndGeometry,
  toBeSequenceFlow,
  toBeMessageFlow,
  toBeAssociationFlow,
  toBeShape,
  toBeCallActivity,
  toBeTask,
  toBeServiceTask,
  toBeUserTask,
  toBeReceiveTask,
  toBeSendTask,
  toBeManualTask,
  toBeScriptTask,
  toBeBusinessRuleTask,
  toBeStartEvent,
  toBeEndEvent,
  toBeIntermediateThrowEvent,
  toBeIntermediateCatchEvent,
  toBeBoundaryEvent,
  toBeEventBasedGateway,
  toBeSubProcess,
  toBePool,
  toBeLane,
});

export interface ExpectedCellWithGeometry {
  parentId?: string;
  geometry: Geometry;
}

export interface ExpectedFont {
  name?: string;
  size?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikeThrough?: boolean;
}

export interface ExpectedShapeModelElement {
  label?: string;
  kind?: ShapeBpmnElementKind;
  font?: ExpectedFont;
  parentId?: string;
  /** Only needed when the BPMN shape doesn't exist yet (use an arbitrary shape until the final render is implemented) */
  styleShape?: string;
  verticalAlign?: string;
  align?: string;
  markers?: ShapeBpmnMarkerKind[];
  isInstantiating?: boolean;
  isHorizontal?: boolean;
  overlays?: ExpectedOverlay[];
}

export interface ExpectedEventModelElement extends ExpectedShapeModelElement {
  eventDefinitionKind: ShapeBpmnEventDefinitionKind;
}

export interface ExpectedSubProcessModelElement extends ExpectedShapeModelElement {
  subProcessKind: ShapeBpmnSubProcessKind;
}

export interface ExpectedCallActivityModelElement extends ExpectedShapeModelElement {
  globalTaskKind?: ShapeBpmnElementKind;
}

export interface ExpectedEdgeModelElement {
  label?: string;
  kind?: FlowKind;
  parentId?: string;
  font?: ExpectedFont;
  startArrow?: ArrowType;
  endArrow?: ArrowType;
  verticalAlign?: VAlignValue;
  messageVisibleKind?: MessageVisibleKind;
  overlays?: ExpectedOverlay[];
}

export interface ExpectedSequenceFlowModelElement extends ExpectedEdgeModelElement {
  sequenceFlowKind?: SequenceFlowKind;
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
const defaultParent = bpmnVisualization.graph.getDefaultParent();

export const getDefaultParentId = (): string => defaultParent.id;

const expectElementsInModel = (parentId: string, elementsNumber: number, filter: FilterFunction): void => {
  const model = bpmnVisualization.graph.model;
  const descendants = model.filterCells([getCell(parentId)], filter);
  expect(descendants).toHaveLength(elementsNumber);
};

export const expectPoolsInModel = (pools: number): void => {
  expectElementsInModel(undefined, pools, (cell: Cell): boolean => (cell.style as BPMNCellStyle).bpmn.kind == ShapeBpmnElementKind.POOL);
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
