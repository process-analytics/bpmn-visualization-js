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
      toBeEdge(modelElement: ExpectedEdgeModelElement): R;
    }
  }
}

interface ExpectedStateStyle extends StyleMap {
  verticalAlign: string;
  align: string;
  strokeWidth: number;
  strokeColor: string;
  fillColor: string;
  rounded: number;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: number;
  startArrow: string;
  endArrow: string;
  endSize: number;
}

interface ExpectedCell {
  value?: string;
  geometry?: mxGeometry | mxGeometry[];
  style?: string;
  id?: string;
  edge?: boolean;
  vertex?: boolean;
  parent?: ExpectedCell;
  children?: ExpectedCell | ExpectedCell[];
  state?: {
    style: ExpectedStateStyle;
  };
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
  endArrow?: string;
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

// -------------------------- Convert objects to compare ---------------------------
function buildExpectedStateStyle(expectedModel: ExpectedEdgeModelElement): ExpectedStateStyle {
  const font = expectedModel.font;
  const fontStyle = font && (font.isBold || font.isItalic || font.isStrikeThrough || font.isUnderline) ? getFontStyleValue(font) : undefined;
  return {
    verticalAlign: 'top',
    align: 'center',
    strokeWidth: 1.5,
    strokeColor: 'Black',
    fillColor: 'White',
    rounded: 1,
    fontFamily: font?.name ? font.name : 'Arial, Helvetica, sans-serif',
    fontSize: font?.size ? font.size : 11,
    fontColor: 'Black',
    fontStyle: fontStyle,
    startArrow: expectedModel.startArrow,
    endArrow: expectedModel.endArrow,
    endSize: 12,
  };
}

function buildExpectedCell(id: string, expectedModel: ExpectedEdgeModelElement): ExpectedCell {
  const parentId = expectedModel.parentId;
  const expectedCell: ExpectedCell = {
    id,
    value: expectedModel.label,
    style: expect.stringContaining(expectedModel.kind),
    edge: true,
    parent: { id: parentId ? parentId : getDefaultParentId() },
    state: {
      style: buildExpectedStateStyle(expectedModel),
    },
  };

  if (expectedModel.messageVisibleKind && expectedModel.messageVisibleKind !== MessageVisibleKind.NONE) {
    expectedCell.children = [
      {
        value: undefined,
        style: `shape=${StyleIdentifier.BPMN_STYLE_MESSAGE_FLOW_ICON};${StyleIdentifier.BPMN_STYLE_IS_INITIATING}=${expectedModel.messageVisibleKind}`,
        id: `messageFlowIcon_of_${id}`,
        vertex: true,
      },
    ];
  }

  return expectedCell;
}

function buildReceivedStateStyle(cell: mxCell): ExpectedStateStyle {
  const stateStyle = bpmnVisualization.graph.getCellStyle(cell);
  return {
    verticalAlign: stateStyle.verticalAlign,
    align: stateStyle.align,
    strokeWidth: stateStyle.strokeWidth,
    strokeColor: stateStyle.strokeColor,
    fillColor: stateStyle.fillColor,
    rounded: stateStyle.rounded,
    fontFamily: stateStyle.fontFamily,
    fontSize: stateStyle.fontSize,
    fontColor: stateStyle.fontColor,
    fontStyle: stateStyle.fontStyle,
    startArrow: stateStyle.startArrow,
    endArrow: stateStyle.endArrow,
    endSize: stateStyle.endSize,
  };
}

function buildReceivedCell(cell: mxCell): ExpectedCell {
  const receivedCell: ExpectedCell = {
    value: cell.value,
    style: cell.style,
    id: cell.id,
    edge: cell.edge,
    parent: { id: cell.parent.id },
    state: { style: buildReceivedStateStyle(cell) },
  };

  const children = cell.children;
  if (children && children[0]) {
    receivedCell.children = children.map((child: mxCell) => {
      return {
        value: child.value,
        style: child.style,
        id: child.id,
        edge: child.edge,
        vertex: child.vertex,
      };
    });
  }

  return receivedCell;
}

// --------------------------------- Matchers --------------------------------------

const EXPECTED_LABEL = 'Expected in the mxGraph model';
const RECEIVED_LABEL = 'Received in the mxGraph model';

function getCellMatcherResult(pass: boolean, received: string): CustomMatcherResult {
  return {
    message: () => this.utils.matcherHint(`.${pass ? 'not.' : ''}toBeCell`) + '\n\n' + `Expected cell with id '${received}' ${pass ? 'not ' : ''}to be found in the mxGraph model`,
    pass,
  };
}

function getCell(received: string): mxCell {
  return bpmnVisualization.graph.model.getCell(received);
}

function toBeCell(this: MatcherContext, received: string): CustomMatcherResult {
  const pass = getCell(received) ? true : false;
  return getCellMatcherResult(pass, received);
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

function toBeEdge(this: MatcherContext, received: string, expected: ExpectedEdgeModelElement): CustomMatcherResult {
  const matcherName = 'toBeEdge';
  const options = {
    isNot: this.isNot,
    promise: this.promise,
  };
  const expectedCell = buildExpectedCell(received, expected);

  const cell = getCell(received);
  if (!cell) {
    return {
      message: () =>
        this.utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        this.utils.printDiffOrStringify(expectedCell, undefined, `${EXPECTED_LABEL}: Edge with id '${expectedCell.id}'`, `${RECEIVED_LABEL}`, isExpand(this.expand)),
      pass: false,
    };
  }

  const receivedCell = buildReceivedCell(cell);
  const pass = this.equals(receivedCell, expectedCell, [this.utils.iterableEquality, this.utils.subsetEquality]);
  const message = pass
    ? () =>
        this.utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        `${EXPECTED_LABEL}: Edge with id '${received}' not to be found with the configuration:\n` +
        `${this.utils.printExpected(expectedCell)}`
    : () =>
        this.utils.matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        this.utils.printDiffOrStringify(
          expectedCell,
          receivedCell,
          `${EXPECTED_LABEL}: Edge with id '${expectedCell.id}'`,
          `${RECEIVED_LABEL}: Edge with id '${received}'`,
          isExpand(this.expand),
        );
  return {
    message,
    pass,
  };
}

const isExpand = (expand: any) => expand !== false;

expect.extend({
  toBeCell,
  withGeometry,
  withFont,
  toBeEdge,
});

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

export function expectModelContainsSequenceFlow(cellId: string, modelElement: ExpectedSequenceFlowModelElement): void {
  expect(cellId).toBeEdge({ ...modelElement, kind: FlowKind.SEQUENCE_FLOW, endArrow: 'blockThin' });
  expect(getCell(cellId).style).toContain(modelElement.sequenceFlowKind);
}

export function expectModelContainsMessageFlow(cellId: string, modelElement: ExpectedEdgeModelElement): void {
  expect(cellId).toBeEdge({ ...modelElement, kind: FlowKind.MESSAGE_FLOW, startArrow: mxConstants.ARROW_OVAL, endArrow: 'blockThin' });
}

export function expectModelContainsAssociationFlow(cellId: string, modelElement: ExpectedEdgeModelElement): void {
  expect(cellId).toBeEdge({ ...modelElement, kind: FlowKind.ASSOCIATION_FLOW });
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
