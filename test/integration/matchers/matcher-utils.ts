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

import type { ExpectedEdgeModelElement, ExpectedFont, ExpectedShapeModelElement } from '../helpers/model-expect';
import { bpmnVisualization } from '../helpers/model-expect';
import type { mxCell, mxGeometry, StyleMap } from 'mxgraph';
import type { MxGraphCustomOverlay, MxGraphCustomOverlayStyle } from '../../../src/component/mxgraph/overlay/custom-overlay';
import { Font } from '../../../src/model/bpmn/internal/Label';
import { getFontStyleValue as computeFontStyleValue } from '../../../src/component/mxgraph/renderer/StyleComputer';
import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

// Used for received view state, computed resolved style and expected style.
export interface BpmnCellStyle extends StyleMap {
  opacity: number;
  verticalAlign?: string;
  align?: string;
  strokeWidth?: number;
  strokeColor: string;
  strokeOpacity: number;
  fillColor: string;
  fillOpacity?: number;
  swimlaneFillColor?: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: number;
  fontOpacity: number;
  startArrow?: string;
  endArrow?: string;
  endSize?: number;
  shape?: string;
  horizontal?: number;
}

export interface ExpectedCell {
  value?: string;
  geometry?: mxGeometry;
  /** the Cell style property or a jest expect using a regexp. */
  styleRawFromModelOrJestExpect?: string;
  /**
   * The style of the Cell in the model where all properties have been resolved by also applying properties coming from the referenced styles.
   *
   * It involves the usage of `graph.getCellStyle`.
   */
  styleResolvedFromModel?: BpmnCellStyle;
  /**
   * Relates to the current style in the state view of the cell which is typically retrieved by calling `view.getState(cell).style` where `view` is `graph.getView()`.
   */
  styleViewState?: BpmnCellStyle;
  id?: string;
  edge?: boolean;
  vertex?: boolean;
  parent?: ExpectedCell;
  children?: ExpectedCell | ExpectedCell[];
  overlays?: ExpectedOverlay[];
}

export interface ExpectedOverlay {
  label?: string;
  horizontalAlign?: string;
  verticalAlign?: string;
  style?: MxGraphCustomOverlayStyle;
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
  buildReceivedCell: (cell: mxCell) => ExpectedCell,
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

export function getFontStyleValue(expectedFont: ExpectedFont): number {
  return (
    (expectedFont
      ? computeFontStyleValue(new Font(expectedFont.family, expectedFont.size, expectedFont.isBold, expectedFont.isItalic, expectedFont.isUnderline, expectedFont.isStrikeThrough))
      : 0) || undefined
  );
}

export function buildExpectedCellStyleWithCommonAttributes(expectedModelElt: ExpectedEdgeModelElement | ExpectedShapeModelElement): BpmnCellStyle {
  const font = expectedModelElt.font;

  return {
    opacity: expectedModelElt.opacity,
    strokeColor: expectedModelElt.stroke?.color ?? 'Black',
    strokeOpacity: expectedModelElt.stroke?.opacity,
    fillColor: 'White',
    fontFamily: font?.family ?? 'Arial, Helvetica, sans-serif',
    fontSize: font?.size ?? 11,
    fontColor: font?.color ?? 'Black',
    fontStyle: getFontStyleValue(font),
    fontOpacity: expectedModelElt.font?.opacity,
  };
}

/**
 * This function really gets style from the state of the cell in the graph view.
 * The functions that return BpmnCellStyle objects are in fact, returning a computed style by using the style properties from the model augmented with the properties resolved
 * from the styles referenced by the cell. The object isn't related to the cached value stored in the style property of the mxCell state stored in the mxGraphView.
 *
 * @param cell The Cell to consider to get the style in the state view
 * @param bv The instance of BpmnVisualization under test
 */
export function buildReceivedViewStateStyle(cell: mxCell, bv = bpmnVisualization): BpmnCellStyle {
  return toBpmnStyle(bv.graph.getView().getState(cell).style, cell.edge);
}

/**
 * This function uses `graph.getCellStyle` to retrieve the "resolved model style" of the cell.
 *
 * This mxGraph function mentions the following note in its documentation:
 * "You should try and get the cell state for the given cell and use the cached style in the state before using this method"
 * It returns the style + properties resolved from the referenced styleNames (generally at the beginning of the "cell.style" string) as computed by mxStylesheet.prototype.getCellStyle.
 *
 * @param cell The Cell to consider for the computation of the resolved style.
 */
function buildReceivedResolvedModelCellStyle(cell: mxCell): BpmnCellStyle {
  return toBpmnStyle(bpmnVisualization.graph.getCellStyle(cell), cell.edge);
}

function toBpmnStyle(rawStyle: StyleMap, isEdge: boolean): BpmnCellStyle {
  const style: BpmnCellStyle = {
    opacity: rawStyle.opacity,
    verticalAlign: rawStyle.verticalAlign,
    align: rawStyle.align,
    strokeWidth: rawStyle.strokeWidth,
    strokeColor: rawStyle.strokeColor,
    strokeOpacity: rawStyle.strokeOpacity,
    fillColor: rawStyle.fillColor,
    fontFamily: rawStyle.fontFamily,
    fontSize: rawStyle.fontSize,
    fontColor: rawStyle.fontColor,
    fontStyle: rawStyle.fontStyle,
    fontOpacity: rawStyle.textOpacity,
  };

  if (isEdge) {
    style.startArrow = rawStyle.startArrow;
    style.endArrow = rawStyle.endArrow;
    style.endSize = rawStyle.endSize;
  } else {
    style.shape = rawStyle.shape;
    style.horizontal = rawStyle.horizontal;
    style.swimlaneFillColor = rawStyle.swimlaneFillColor;
    style.fillOpacity = rawStyle.fillOpacity;
  }
  return style;
}

export function buildReceivedCellWithCommonAttributes(cell: mxCell): ExpectedCell {
  const receivedCell: ExpectedCell = {
    value: cell.value,
    styleRawFromModelOrJestExpect: cell.style,
    styleResolvedFromModel: buildReceivedResolvedModelCellStyle(cell),
    styleViewState: buildReceivedViewStateStyle(cell),
    id: cell.id,
    edge: cell.edge,
    vertex: cell.vertex,
    parent: { id: cell.parent.id },
  };

  const cellOverlays = bpmnVisualization.graph.getCellOverlays(cell) as MxGraphCustomOverlay[];
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
    if (children?.length > 0) {
      receivedCell.children = children.map(
        child =>
          <ExpectedCell>{
            value: child.value,
            styleRawFromModelOrJestExpect: child.style,
            id: child.id,
            vertex: child.vertex,
          },
      );
    }
  }

  return receivedCell;
}

export function getCell(received: string): mxCell {
  return bpmnVisualization.graph.model.getCell(received);
}
