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
import { MessageVisibleKind } from '../../../src/model/bpmn/internal/edge/MessageVisibleKind';
import { StyleIdentifier } from '../../../src/component/mxgraph/StyleUtils';
import { bpmnVisualization, ExpectedEdgeModelElement, ExpectedFont, ExpectedSequenceFlowModelElement, getDefaultParentId } from '../ExpectModelUtils';

export interface ExpectedStateStyle extends StyleMap {
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

export interface ExpectedCell {
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

export const EXPECTED_LABEL = 'Expected in the mxGraph model';
export const RECEIVED_LABEL = 'Received in the mxGraph model';

export function getFontStyleValue(expectedFont: ExpectedFont): number {
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

function buildExpectedStateStyle(expectedModel: ExpectedEdgeModelElement): ExpectedStateStyle {
  const font = expectedModel.font;
  const fontStyle = font && (font.isBold || font.isItalic || font.isStrikeThrough || font.isUnderline) ? getFontStyleValue(font) : undefined;
  return {
    verticalAlign: expectedModel.verticalAlign ? expectedModel.verticalAlign : 'top',
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

export function buildExpectedCell(id: string, expectedModel: ExpectedEdgeModelElement | ExpectedSequenceFlowModelElement): ExpectedCell {
  const parentId = expectedModel.parentId;
  const styleRegexp = expectedModel.kind + 'sequenceFlowKind' in expectedModel ? ` | ${(expectedModel as ExpectedSequenceFlowModelElement).sequenceFlowKind}` : '';
  const expectedCell: ExpectedCell = {
    id,
    value: expectedModel.label,
    style: expect.stringMatching(styleRegexp),
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
        edge: false,
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

export function buildReceivedCell(cell: mxCell): ExpectedCell {
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

export function getCell(received: string): mxCell {
  return bpmnVisualization.graph.model.getCell(received);
}
