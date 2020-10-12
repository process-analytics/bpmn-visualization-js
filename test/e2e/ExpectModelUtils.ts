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
import { ShapeBpmnElementKind, ShapeBpmnEventKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from '../../src/model/bpmn/internal/shape';
import { FlowKind } from '../../src/model/bpmn/internal/edge/FlowKind';
import { MessageVisibleKind } from '../../src/model/bpmn/internal/edge/MessageVisibleKind';
import { SequenceFlowKind } from '../../src/model/bpmn/internal/edge/SequenceFlowKind';
import BpmnVisualization from '../../src/component/BpmnVisualization';
import { toBeCell, withGeometry, withFont, toBeSequenceFlow, toBeMessageFlow, toBeAssociationFlow } from './matchers';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeCell(): R;
      withGeometry(geometry: mxGeometry): R;
      withFont(font: ExpectedFont): R;
      toBeSequenceFlow(modelElement: ExpectedSequenceFlowModelElement): R;
      toBeMessageFlow(modelElement: ExpectedEdgeModelElement): R;
      toBeAssociationFlow(modelElement: ExpectedEdgeModelElement): R;
    }
  }
}

expect.extend({
  toBeCell,
  withGeometry,
  withFont,
  toBeSequenceFlow,
  toBeMessageFlow,
  toBeAssociationFlow,
});

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
  kind: ShapeBpmnElementKind;
  font?: ExpectedFont;
  parentId?: string;
  /** Only needed when the BPMN shape doesn't exist yet (use an arbitrary shape until the final render is implemented) */
  styleShape?: string;
  markers?: ShapeBpmnMarkerKind[];
  isInstantiating?: boolean;
  isHorizontal?: boolean;
}

export interface ExpectedEventModelElement extends ExpectedShapeModelElement {
  eventKind: ShapeBpmnEventKind;
}

// TODO find a way to not be forced to pass 'kind'
export interface ExpectedSubProcessModelElement extends ExpectedShapeModelElement {
  subProcessKind: ShapeBpmnSubProcessKind;
}

export interface ExpectedEdgeModelElement {
  label?: string;
  kind?: FlowKind;
  parentId?: string;
  font?: ExpectedFont;
  startArrow?: string;
  endArrow?: string;
  verticalAlign?: string;
  messageVisibleKind?: MessageVisibleKind;
}

export interface ExpectedSequenceFlowModelElement extends ExpectedEdgeModelElement {
  sequenceFlowKind?: SequenceFlowKind;
}

// TODO find a way to not be forced to pass 'kind'
export interface ExpectedBoundaryEventModelElement extends ExpectedEventModelElement {
  isInterrupting?: boolean;
}
export interface ExpectedStartEventModelElement extends ExpectedEventModelElement {
  isInterrupting?: boolean;
}

export const bpmnVisualization = new BpmnVisualization(null);

// ---------------------------- To convert to Jest extension ------------------------------------

export function expectModelNotContainCell(cellId: string): void {
  expect(cellId).not.toBeCell();
}

export function expectModelContainsCell(cellId: string): mxCell {
  expect(cellId).toBeCell();
  return bpmnVisualization.graph.model.getCell(cellId);
}

export function expectModelContainsShape(cellId: string, modelElement: ExpectedShapeModelElement): mxCell {
  const cell: mxCell = expectModelContainsCell(cellId);
  const parentId = modelElement.parentId;
  if (parentId) {
    expect(cell.parent.id).toEqual(parentId);
  }
  expect(cell.style).toContain(modelElement.kind);

  if (modelElement.markers?.length > 0) {
    expect(cell.style).toContain(`bpmn.markers=${modelElement.markers.join(',')}`);
  }

  if (modelElement.isInstantiating !== undefined) {
    expect(cell.style).toContain(`bpmn.isInstantiating=${modelElement.isInstantiating}`);
  }

  const state = bpmnVisualization.graph.getView().getState(cell);
  const styleShape = !modelElement.styleShape ? modelElement.kind : modelElement.styleShape;
  expect(state.style[mxConstants.STYLE_SHAPE]).toEqual(styleShape);
  expect(cell.value).toEqual(modelElement.label);
  expect(cell).withFont(modelElement.font);
  return cell;
}

export function expectModelContainsBpmnEvent(cellId: string, eventModelElement: ExpectedEventModelElement): mxCell {
  const cell = expectModelContainsShape(cellId, eventModelElement);
  expect(cell.style).toContain(`bpmn.eventKind=${eventModelElement.eventKind}`);
  return cell;
}

export function expectModelContainsBpmnBoundaryEvent(cellId: string, boundaryEventModelElement: ExpectedBoundaryEventModelElement): void {
  const cell = expectModelContainsBpmnEvent(cellId, { ...boundaryEventModelElement, kind: ShapeBpmnElementKind.EVENT_BOUNDARY });
  expect(cell.style).toContain(`bpmn.isInterrupting=${boundaryEventModelElement.isInterrupting}`);
}

export function expectModelContainsBpmnStartEvent(cellId: string, startEventModelElement: ExpectedStartEventModelElement): void {
  const cell = expectModelContainsBpmnEvent(cellId, { ...startEventModelElement, kind: ShapeBpmnElementKind.EVENT_START });
  expect(cell.style).toContain(`bpmn.isInterrupting=${startEventModelElement.isInterrupting}`);
}

export function expectModelContainsSubProcess(cellId: string, subProcessModelElement: ExpectedSubProcessModelElement): mxCell {
  const cell = expectModelContainsShape(cellId, {
    ...subProcessModelElement,
    kind: ShapeBpmnElementKind.SUB_PROCESS,
  });
  expect(cell.style).toContain(`bpmn.subProcessKind=${subProcessModelElement.subProcessKind}`);
  return cell;
}

export function expectModelContainsPool(cellId: string, modelElement: ExpectedShapeModelElement): void {
  const mxCell = expectModelContainsShape(cellId, { ...modelElement, kind: ShapeBpmnElementKind.POOL, styleShape: mxConstants.SHAPE_SWIMLANE });
  expect(mxCell.style).toContain(`${mxConstants.STYLE_HORIZONTAL}=${modelElement.isHorizontal ? '0' : '1'}`);
}

export function expectModelContainsLane(cellId: string, modelElement: ExpectedShapeModelElement): void {
  const mxCell = expectModelContainsShape(cellId, { ...modelElement, kind: ShapeBpmnElementKind.LANE, styleShape: mxConstants.SHAPE_SWIMLANE });
  expect(mxCell.style).toContain(`${mxConstants.STYLE_HORIZONTAL}=${modelElement.isHorizontal ? '0' : '1'}`);
}

export function expectModelContainsCellWithGeometry(cellId: string, parentId: string, geometry: mxGeometry): void {
  const cell = expectModelContainsCell(cellId);

  if (parentId) {
    expect(cell.parent.id).toEqual(parentId);
  } else {
    expect(cell.parent).toEqual(bpmnVisualization.graph.getDefaultParent());
  }

  expect(cell).withGeometry(geometry);
}

export function getDefaultParentId(): string {
  return bpmnVisualization.graph.getDefaultParent().id;
}
