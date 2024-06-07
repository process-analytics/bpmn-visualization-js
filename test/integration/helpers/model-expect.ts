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

import type { ExpectedOverlay } from '../matchers/matcher-utils';
import type {
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
import type { mxCell, mxGeometry } from 'mxgraph';

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
import { getCell } from '../matchers/matcher-utils';

import { BpmnVisualization, ShapeBpmnElementKind } from '@lib/bpmn-visualization';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Since we are overriding an existing interface in Jest, it is not possible to convert it to a type.
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
      toBeIntermediateThrowEvent(modelElement: ExpectedIntermediateThrowEventModelElement): R;
      toBeIntermediateCatchEvent(modelElement: ExpectedIntermediateCatchEventModelElement): R;
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

export type ExpectedCellWithGeometry = {
  parentId?: string;
  geometry: mxGeometry;
};

export type ExpectedFont = {
  color?: string;
  family?: string;
  size?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  isStrikeThrough?: boolean;
  opacity?: Opacity;
};

export type HorizontalAlign = 'center' | 'left' | 'right';
export type VerticalAlign = 'bottom' | 'middle' | 'top';

type ExpectedModelElement = {
  align?: HorizontalAlign;
  font?: ExpectedFont;
  label?: string;
  overlays?: ExpectedOverlay[];
  parentId?: string;
  stroke?: Stroke;
  verticalAlign?: VerticalAlign;
  opacity?: number;
  // custom bpmn-visualization
  extraCssClasses?: string[];
};

export type ExpectedFill = {
  color?: string;
  opacity?: Opacity;
};

export type ExpectedDirection = 'west' | 'east' | 'north' | 'south';

export type ExpectedGradient = {
  color: string;
  direction?: ExpectedDirection;
};

export type ExpectedShapeModelElement = {
  kind?: ShapeBpmnElementKind;
  /** Generally needed when the BPMN shape doesn't exist yet (use an arbitrary shape until the final render is implemented) */
  styleShape?: string;
  markers?: ShapeBpmnMarkerKind[];
  isInstantiating?: boolean;
  /**
   * This is the value in the mxGraph model, not what is from the BPMN Shape. This applies to the labels so the value is inverted comparing to the BPMN model.
   * - Horizontal pool/lane --> false (the label is vertical)
   * - Vertical pool/lane --> true (the label is horizontal)
   **/
  isSwimLaneLabelHorizontal?: boolean;
  fill?: ExpectedFill;
  gradient?: ExpectedGradient;
} & ExpectedModelElement;

export type ExpectedEventModelElement = {
  eventDefinitionKind: ShapeBpmnEventDefinitionKind;
} & ExpectedShapeModelElement;
export type ExpectedIntermediateCatchEventModelElement = {
  sourceIds?: string[];
} & ExpectedEventModelElement;
export type ExpectedIntermediateThrowEventModelElement = {
  targetId?: string;
} & ExpectedEventModelElement;
export type ExpectedBoundaryEventModelElement = {
  isInterrupting?: boolean;
} & ExpectedEventModelElement;
export type ExpectedStartEventModelElement = {
  isInterrupting?: boolean;
} & ExpectedEventModelElement;

export type ExpectedSubProcessModelElement = {
  subProcessKind: ShapeBpmnSubProcessKind;
} & ExpectedShapeModelElement;

export type ExpectedCallActivityModelElement = {
  globalTaskKind?: GlobalTaskKind;
} & ExpectedShapeModelElement;

export type ExpectedEdgeModelElement = {
  kind?: FlowKind;
  startArrow?: string;
  endArrow?: string;
  messageVisibleKind?: MessageVisibleKind;
} & ExpectedModelElement;

export type ExpectedSequenceFlowModelElement = {
  sequenceFlowKind?: SequenceFlowKind;
} & ExpectedEdgeModelElement;

export type ExpectedEventBasedGatewayModelElement = {
  gatewayKind?: ShapeBpmnEventBasedGatewayKind;
} & ExpectedShapeModelElement;

export const bpmnVisualization = new BpmnVisualization(null);
const defaultParent = bpmnVisualization.graph.getDefaultParent();

export const getDefaultParentId = (): string => defaultParent.id;

const expectElementsInModel = (parentId: string, elementsNumber: number, filter: (cell: mxCell) => boolean): void => {
  const model = bpmnVisualization.graph.model;
  const descendants = model.filterDescendants(filter, getCell(parentId));
  expect(descendants).toHaveLength(elementsNumber);
};

export const expectPoolsInModel = (pools: number): void => {
  expectElementsInModel(undefined, pools, (cell: mxCell): boolean => {
    return cell.style?.startsWith(ShapeBpmnElementKind.POOL);
  });
};

export const expectShapesInModel = (parentId: string, shapesNumber: number): void => {
  expectElementsInModel(parentId, shapesNumber, (cell: mxCell): boolean => {
    return cell.getId() != parentId && cell.isVertex();
  });
};

export const expectTotalShapesInModel = (shapesNumber: number): void => {
  expectShapesInModel(undefined, shapesNumber);
};

export const expectEdgesInModel = (parentId: string, edgesNumber: number): void => {
  expectElementsInModel(parentId, edgesNumber, (cell: mxCell): boolean => {
    return cell.isEdge();
  });
};

export const expectTotalEdgesInModel = (edgesNumber: number): void => {
  expectEdgesInModel(undefined, edgesNumber);
};
