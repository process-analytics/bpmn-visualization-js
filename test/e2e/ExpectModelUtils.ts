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
import { StyleDefault, StyleIdentifier } from '../../src/bpmn-visualization';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeCell(): R;
      withGeometry(geometry: mxGeometry): R;
      withFont(font: ExpectedFont): R;
    }
  }
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

function toBeCell(this: MatcherContext, received: string): CustomMatcherResult {
  const cell = bpmnVisualization.graph.model.getCell(received);
  const pass = cell ? true : false;
  return {
    message: () => this.utils.matcherHint(`.${pass ? 'not.' : ''}toBeCell`) + '\n\n' + `Expected cell with id '${received}' ${pass ? 'not ' : ''}to be found in the mxGraph model`,
    pass,
  };
}

function withGeometry(this: MatcherContext, received: mxCell, expected: mxGeometry): CustomMatcherResult {
  const cellGeometry = received.getGeometry();
  const receivedGeometry = { x: cellGeometry.x, y: cellGeometry.y, width: cellGeometry.width, height: cellGeometry.height, points: cellGeometry.points };

  const pass =
    receivedGeometry.x === expected.x &&
    receivedGeometry.y === expected.y &&
    receivedGeometry.width === expected.width &&
    receivedGeometry.height === expected.height &&
    // Need to do this, because the most time, there is no 'points' variable in 'expected', but 'points' is equals to 'null' in 'receivedGeometry'
    JSON.stringify(receivedGeometry.points) === JSON.stringify(expected.points);

  return {
    message: pass
      ? () =>
          this.utils.matcherHint('.not.withGeometry') +
          '\n\n' +
          `Expected geometry of the cell with id '${received.id}' not to be equals to:\n` +
          `  ${this.utils.printExpected(expected)}\n` +
          `Received:\n` +
          `  ${this.utils.printReceived(receivedGeometry)}`
      : () => {
          const diffString = this.utils.diff(expected, receivedGeometry, {
            expand: this.expand,
          });
          return (
            this.utils.matcherHint('.withGeometry') +
            '\n\n' +
            `Expected geometry of the cell with id '${received.id}' to be equals to:\n` +
            `  ${this.utils.printExpected(expected)}\n` +
            `Received:\n` +
            `  ${this.utils.printReceived(receivedGeometry)}` +
            (diffString ? `\n\nDifference:\n\n${diffString}` : '')
          );
        },
    pass,
  };
}

function withFont(this: MatcherContext, received: mxCell, expected: ExpectedFont): CustomMatcherResult {
  const style = bpmnVisualization.graph.getView().getState(received).style;
  const receivedFont = { fontStyle: style[mxConstants.STYLE_FONTSTYLE], fontFamily: style[mxConstants.STYLE_FONTFAMILY], fontSize: style[mxConstants.STYLE_FONTSIZE] };

  let expectedFont: unknown;
  if (expected) {
    expectedFont = { fontStyle: getFontStyleValue(expected), fontFamily: expected.name, fontSize: expected.size };
  } else {
    expectedFont = { fontStyle: undefined, fontFamily: StyleDefault.DEFAULT_FONT_FAMILY, fontSize: StyleDefault.DEFAULT_FONT_SIZE };
  }

  const pass = JSON.stringify(receivedFont) === JSON.stringify(expectedFont);
  return {
    message: pass
      ? () =>
          this.utils.matcherHint('.not.withFont') +
          '\n\n' +
          `Expected font of the cell with id '${received.id}' not to be equals to:\n` +
          `  ${this.utils.printExpected(expectedFont)}\n` +
          `Received:\n` +
          `  ${this.utils.printReceived(receivedFont)}`
      : () => {
          const diffString = this.utils.diff(expectedFont, receivedFont, {
            expand: this.expand,
          });
          return (
            this.utils.matcherHint('.withFont') +
            '\n\n' +
            `Expected font of the cell with id '${received.id}' to be equals to:\n` +
            `  ${this.utils.printExpected(expectedFont)}\n` +
            `Received:\n` +
            `  ${this.utils.printReceived(receivedFont)}` +
            (diffString ? `\n\nDifference:\n\n${diffString}` : '')
          );
        },
    pass,
  };
}

function getFontStyleValue(expectedFont: ExpectedFont): number {
  let value = 0;
  if (expectedFont.isBold) {
    value += mxConstants.FONT_BOLD;
  }
  if (expectedFont.isItalic) {
    value += mxConstants.FONT_ITALIC;
  }
  if (expectedFont.isStrikeThrough) {
    value += mxConstants.FONT_STRIKETHROUGH;
  }
  if (expectedFont.isUnderline) {
    value += mxConstants.FONT_UNDERLINE;
  }
  return value;
}

expect.extend({
  toBeCell,
  withGeometry,
  withFont,
});

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

export function expectModelContainsEdge(cellId: string, modelElement: ExpectedEdgeModelElement): mxCell {
  const cell = expectModelContainsCell(cellId);
  expect(cell.style).toContain(modelElement.kind);
  const parentId = modelElement.parentId;
  if (parentId) {
    expect(cell.parent.id).toEqual(parentId);
  }

  if (modelElement.messageVisibleKind === MessageVisibleKind.NON_INITIATING || modelElement.messageVisibleKind === MessageVisibleKind.INITIATING) {
    const messageCell = expectModelContainsCell(`messageFlowIcon_of_${cellId}`);
    expect(messageCell.style).toContain(`shape=${StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON};${StyleIdentifier.BPMN_STYLE_IS_INITIATING}=${modelElement.messageVisibleKind}`);
  }

  if (modelElement.startArrow || modelElement.font) {
    const state = bpmnVisualization.graph.getView().getState(cell);
    expect(state.style[mxConstants.STYLE_STARTARROW]).toEqual(modelElement.startArrow);
    expect(cell).withFont(modelElement.font);
  }

  expect(cell.value).toEqual(modelElement.label);
  return cell;
}

export function expectModelContainsSequenceFlow(cellId: string, modelElement: ExpectedSequenceFlowModelElement): mxCell {
  const cell = expectModelContainsEdge(cellId, { ...modelElement, kind: FlowKind.SEQUENCE_FLOW });
  expect(cell.style).toContain(modelElement.sequenceFlowKind);
  return cell;
}

export function expectModelContainsMessageFlow(cellId: string, modelElement: ExpectedEdgeModelElement): mxCell {
  return expectModelContainsEdge(cellId, { ...modelElement, kind: FlowKind.MESSAGE_FLOW });
}

export function expectModelContainsAssociationFlow(cellId: string, modelElement: ExpectedEdgeModelElement): mxCell {
  return expectModelContainsEdge(cellId, { ...modelElement, kind: FlowKind.ASSOCIATION_FLOW });
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
