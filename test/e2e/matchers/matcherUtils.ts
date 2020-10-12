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
import { bpmnVisualization, ExpectedFont } from '../ExpectModelUtils';

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
  startArrow?: string;
  endArrow?: string;
  endSize?: number;
  shape?: string;
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
  if (expectedFont) {
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
  }
  return value ? value : undefined;
}

function buildReceivedStateStyle(cell: mxCell): ExpectedStateStyle {
  const stateStyle = bpmnVisualization.graph.getCellStyle(cell);
  const expectedStateStyle: ExpectedStateStyle = {
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
  };

  if (cell.edge) {
    expectedStateStyle.startArrow = stateStyle.startArrow;
    expectedStateStyle.endArrow = stateStyle.endArrow;
    expectedStateStyle.endSize = stateStyle.endSize;
  } else {
    expectedStateStyle.shape = stateStyle.shape;
  }
  return expectedStateStyle;
}

export function buildReceivedCell(cell: mxCell): ExpectedCell {
  const receivedCell: ExpectedCell = {
    value: cell.value,
    style: cell.style,
    id: cell.id,
    edge: cell.edge,
    vertex: cell.vertex,
    parent: { id: cell.parent.id },
    state: { style: buildReceivedStateStyle(cell) },
  };

  if (cell.edge) {
    const children = cell.children;
    if (children && children[0]) {
      receivedCell.children = children.map((child: mxCell) => {
        return {
          value: child.value,
          style: child.style,
          id: child.id,
          vertex: child.vertex,
        };
      });
    }
  }

  return receivedCell;
}

export function getCell(received: string): mxCell {
  return bpmnVisualization.graph.model.getCell(received);
}
