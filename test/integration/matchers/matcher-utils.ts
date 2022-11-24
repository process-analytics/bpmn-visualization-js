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
import type { StyleMap } from 'mxgraph';
import type { Cell, CellStyle, Geometry } from '@maxgraph/core';
import { constants } from '@maxgraph/core';

import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

import type { ExpectedEdgeModelElement, ExpectedFont, ExpectedShapeModelElement } from '../helpers/model-expect';
import { bpmnVisualization } from '../helpers/model-expect';
import type { MaxGraphCustomOverlay, MaxGraphCustomOverlayStyle } from '../../../src/component/mxgraph/overlay/custom-overlay';

export interface ExpectedStateStyle extends StyleMap {
  verticalAlign?: string;
  align?: string;
  strokeWidth?: number;
  strokeColor: string;
  fillColor: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: number;
  startArrow?: string;
  endArrow?: string;
  endSize?: number;
  shape?: string;
  horizontal?: boolean;
}

export interface ExpectedCell {
  value?: string;
  geometry?: Geometry;
  style?: CellStyle;
  id?: string;
  edge?: boolean;
  vertex?: boolean;
  parent?: ExpectedCell;
  children?: ExpectedCell | ExpectedCell[];
  state?: {
    style: ExpectedStateStyle;
  };
  overlays?: ExpectedOverlay[];
}

export interface ExpectedOverlay {
  label?: string;
  horizontalAlign?: string;
  verticalAlign?: string;
  style?: MaxGraphCustomOverlayStyle;
}

export const EXPECTED_LABEL = 'Expected in the mxGraph model';
export const RECEIVED_LABEL = 'Received in the mxGraph model';

export function buildCellMatcher<R>(
  matcherName: string,
  matcherContext: MatcherContext,
  received: string,
  expected: R,
  cellKind: string,
  buildExpectedCell: (received: string, expected: R) => ExpectedCell,
  buildReceivedCell: (cell: Cell) => ExpectedCell,
): CustomMatcherResult {
  const options = {
    isNot: matcherContext.isNot,
    promise: matcherContext.promise,
  };
  const utils = matcherContext.utils;
  const expand = matcherContext.expand;
  const messagePrefix = utils.matcherHint(matcherName, undefined, undefined, options) + '\n\n';

  const expectedCell: ExpectedCell = buildExpectedCell(received, expected);

  const cell = getCell(received);
  if (!cell) {
    const message = (): string =>
      messagePrefix + utils.printDiffOrStringify(expectedCell, undefined, `${EXPECTED_LABEL}: ${cellKind} with id '${expectedCell.id}'`, `${RECEIVED_LABEL}`, expand);
    return { message, pass: false };
  }

  const receivedCell: ExpectedCell = buildReceivedCell(cell);
  const pass = matcherContext.equals(receivedCell, expectedCell, [utils.iterableEquality, utils.subsetEquality]);
  const messageSuffix = pass
    ? `${EXPECTED_LABEL}: ${cellKind} with id '${received}' not to be found with the configuration:\n` + `${utils.printExpected(expectedCell)}`
    : utils.printDiffOrStringify(
        expectedCell,
        receivedCell,
        `${EXPECTED_LABEL}: ${cellKind} with id '${expectedCell.id}'`,
        `${RECEIVED_LABEL}: ${cellKind} with id '${received}'`,
        expand,
      );
  return { message: (): string => messagePrefix + messageSuffix, pass };
}

// TODO test code duplicated from the code under test StyleComputer.getFontStyleValue
export function getFontStyleValue(expectedFont: ExpectedFont): number {
  let value = 0;
  if (expectedFont) {
    if (expectedFont.isBold) {
      value += constants.FONT_BOLD;
    }
    if (expectedFont.isItalic) {
      value += constants.FONT_ITALIC;
    }
    if (expectedFont.isStrikeThrough) {
      value += constants.FONT_STRIKETHROUGH;
    }
    if (expectedFont.isUnderline) {
      value += constants.FONT_UNDERLINE;
    }
  }
  return value ? value : undefined;
}

export function buildCommonExpectedStateStyle(expectedModel: ExpectedEdgeModelElement | ExpectedShapeModelElement): ExpectedStateStyle {
  const font = expectedModel.font;

  return {
    strokeColor: 'Black',
    fillColor: 'White',
    fontFamily: font?.name ? font.name : 'Arial, Helvetica, sans-serif',
    fontSize: font?.size ? font.size : 11,
    fontColor: 'Black',
    fontStyle: getFontStyleValue(font),
  };
}

function buildReceivedStateStyle(cell: Cell): ExpectedStateStyle {
  const stateStyle = bpmnVisualization.graph.getCellStyle(cell);
  const expectedStateStyle: ExpectedStateStyle = {
    verticalAlign: stateStyle.verticalAlign,
    align: stateStyle.align,
    strokeWidth: stateStyle.strokeWidth,
    strokeColor: stateStyle.strokeColor,
    fillColor: stateStyle.fillColor,
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
    expectedStateStyle.horizontal = stateStyle.horizontal;
  }
  return expectedStateStyle;
}

export function buildReceivedCellWithCommonAttributes(cell: Cell): ExpectedCell {
  const receivedCell: ExpectedCell = {
    value: cell.value,
    style: cell.style,
    id: cell.id,
    edge: cell.edge,
    vertex: cell.vertex,
    parent: { id: cell.parent.id },
    state: { style: buildReceivedStateStyle(cell) },
  };

  const cellOverlays = bpmnVisualization.graph.getCellOverlays(cell) as MaxGraphCustomOverlay[];
  if (cellOverlays) {
    receivedCell.overlays = cellOverlays.map(cellOverlay => ({
      label: cellOverlay.label,
      horizontalAlign: cellOverlay.align,
      verticalAlign: cellOverlay.verticalAlign,
      style: cellOverlay.style,
    }));
  } else {
    receivedCell.overlays = undefined;
  }

  if (cell.edge) {
    const children = cell.children;
    if (children && children[0]) {
      receivedCell.children = children.map((child: Cell) => ({
        value: child.value,
        style: child.style,
        id: child.id,
        vertex: child.vertex,
      }));
    }
  }

  return receivedCell;
}

export function getCell(received: string): Cell {
  return bpmnVisualization.graph.model.getCell(received);
}
