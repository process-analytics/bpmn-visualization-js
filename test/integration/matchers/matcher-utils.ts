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

import type { Cell, Geometry } from '@maxgraph/core';

import MatcherContext = jest.MatcherContext;
import CustomMatcherResult = jest.CustomMatcherResult;

import type { ExpectedEdgeModelElement, ExpectedFont, ExpectedShapeModelElement, HorizontalAlign, VerticalAlign } from '../helpers/model-expect';
import { bpmnVisualization } from '../helpers/model-expect';
import type { Opacity } from '@lib/component/registry';
import type { MxGraphCustomOverlay, MxGraphCustomOverlayStyle } from '@lib/component/mxgraph/overlay/custom-overlay';
import { getFontStyleValue as computeFontStyleValue } from '@lib/component/mxgraph/renderer/StyleComputer';
import { Font } from '@lib/model/bpmn/internal/Label';
import type { BPMNCellStyle } from '@lib/component/mxgraph/renderer/StyleComputer';

// TODO maxgraph@0.1.0 remove this type
// TODO should be remove and use BPMNCellStyle instead
// TODO rebase make it work
export interface BpmnCellStyle {
  opacity: Opacity;
  verticalAlign?: VerticalAlign;
  align?: HorizontalAlign;
  strokeWidth?: 'default' | number;
  strokeColor: string;
  strokeOpacity: Opacity;
  fillColor: string;
  fillOpacity?: Opacity;
  swimlaneFillColor?: string;
  fontColor: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: number;
  fontOpacity: Opacity;
  startArrow?: string;
  endArrow?: string;
  endSize?: number;
  shape?: string;
  horizontal?: number;
  // custom bpmn-visualization
  extraCssClasses?: string[];
  isInitiating?: boolean;
  markers?: string[];
}

export interface ExpectedCell {
  value?: string;
  geometry?: Geometry;
  /** the Cell style property or a jest expect using a regexp. */
  styleRawFromModelOrJestExpect?: BPMNCellStyle;
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

export function getFontStyleValue(expectedFont: ExpectedFont): number {
  return (
    (expectedFont
      ? computeFontStyleValue(new Font(expectedFont.family, expectedFont.size, expectedFont.isBold, expectedFont.isItalic, expectedFont.isUnderline, expectedFont.isStrikeThrough))
      : 0) || undefined
  );
}

export function buildExpectedCellStyleWithCommonAttributes(expectedModelElt: ExpectedEdgeModelElement | ExpectedShapeModelElement): BpmnCellStyle {
  const font = expectedModelElt.font;

  // Here are the default values as defined in StyleDefault
  return {
    opacity: expectedModelElt.opacity,
    strokeColor: expectedModelElt.stroke?.color ?? 'Black',
    strokeOpacity: expectedModelElt.stroke?.opacity,
    strokeWidth: expectedModelElt.stroke?.width,
    fillColor: 'White',
    fontFamily: font?.family ?? 'Arial, Helvetica, sans-serif',
    fontSize: font?.size ?? 11,
    fontColor: font?.color ?? 'Black',
    fontStyle: getFontStyleValue(font),
    fontOpacity: expectedModelElt.font?.opacity,
    // custom bpmn-visualization
    extraCssClasses: expectedModelElt.extraCssClasses,
    // TODO maxgraph@0.1.0 set basic information when removing the custom processing in buildReceivedStateStyle
    // bpmn: { xxxx },
  };
}

// TODO maxgraph@0.1.0 why building ExpectedStateStyle now maxGraph manage style in object. We should use 'stateStyle' directly (and remove this function)
// TODO maxgraph@0.1.0 rename into 'receivedStateStyle' (in master branch)
/**
 * This function really gets style from the state of the cell in the graph view.
 * The functions that return BpmnCellStyle objects are in fact, returning a computed style by using the style properties from the model augmented with the properties resolved
 * from the styles referenced by the cell. The object isn't related to the cached value stored in the style property of the mxCell state stored in the mxGraphView.
 *
 * @param cell The Cell to consider to get the style in the state view
 * @param bv The instance of BpmnVisualization under test
 */
export function buildReceivedViewStateStyle(cell: Cell, bv = bpmnVisualization): BpmnCellStyle {
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
 * @param bv The instance of BpmnVisualization under test
 */
export function buildReceivedResolvedModelCellStyle(cell: Cell, bv = bpmnVisualization): BpmnCellStyle {
  return toBpmnStyle(bv.graph.getCellStyle(cell), cell.edge);
}

function toBpmnStyle(rawStyle: BPMNCellStyle, isEdge: boolean): BpmnCellStyle {
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
    // custom bpmn-visualization
    // extraCssClasses: rawStyle[BpmnStyleIdentifier.EXTRA_CSS_CLASSES]?.split(','),
    extraCssClasses: rawStyle.bpmn?.extra?.css?.classes,
    // ignore marker order, which is only relevant when rendering the shape (it has its own order algorithm)
    markers: rawStyle.bpmn?.markers?.sort(),
    // for message flow icon (value in rawStyle are string)
    isInitiating: rawStyle.bpmn?.isNonInitiating == undefined ? undefined : !rawStyle.bpmn.isNonInitiating,
    // 'bpmn.isInitiating': rawStyle[BpmnStyleIdentifier.IS_INITIATING] ? rawStyle[BpmnStyleIdentifier.IS_INITIATING] == 'true' : undefined,
    // isInitiating
  };

  if (isEdge) {
    style.startArrow = rawStyle.startArrow;
    style.endArrow = rawStyle.endArrow;
    style.endSize = rawStyle.endSize;
  } else {
    style.shape = rawStyle.shape;
    // TODO rebase horizontal check
    // why is it needed in maxgraph , explain why
    // stateStyle.horizontal && (expectedStateStyle.horizontal = stateStyle.horizontal);
    style.horizontal = rawStyle.horizontal == true ? 1 : 0;
    style.swimlaneFillColor = rawStyle.swimlaneFillColor;
    style.fillOpacity = rawStyle.fillOpacity;
  }
  return style;
}

function buildBaseReceivedExpectedCell(cell: Cell): ExpectedCell {
  return {
    value: cell.value,
    styleRawFromModelOrJestExpect: cell.style,
    styleResolvedFromModel: buildReceivedResolvedModelCellStyle(cell),
    styleViewState: buildReceivedViewStateStyle(cell),
    id: cell.id,
    edge: cell.edge,
    vertex: cell.vertex,
    parent: { id: cell.parent.id },
  };
}

export function buildReceivedCellWithCommonAttributes(cell: Cell): ExpectedCell {
  const receivedCell = buildBaseReceivedExpectedCell(cell);

  // the maxGraph API returns an empty array when there is no overlays
  const cellOverlays = bpmnVisualization.graph.getCellOverlays(cell) as MxGraphCustomOverlay[];
  if (cellOverlays.length > 0) {
    receivedCell.overlays = cellOverlays.map(cellOverlay => ({
      label: cellOverlay.label,
      horizontalAlign: cellOverlay.align,
      verticalAlign: cellOverlay.verticalAlign,
      style: cellOverlay.style,
    }));
  } else {
    receivedCell.overlays = undefined;
  }

  // The cell of the "message flow icon" is defined as a child of the "message flow" cell
  if (cell.edge) {
    const children = cell.children;
    if (children?.length > 0) {
      receivedCell.children = children.map(child => buildBaseReceivedExpectedCell(child));
    }
  }

  return receivedCell;
}

export function getCell(received: string): Cell {
  return bpmnVisualization.graph.model.getCell(received);
}
