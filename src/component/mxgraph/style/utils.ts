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

import type { Cell, CellStyle, NumericCellStateStyleKeys } from '@maxgraph/core';
import { cloneUtils, styleUtils } from '@maxgraph/core';

import type { BPMNCellStyle } from '../renderer/StyleComputer';
import { ensureOpacityValue, ensureStrokeWidthValue } from '../../helpers/validators';
import type { Fill, Font, ShapeStyleUpdate, Stroke, StyleUpdate } from '../../registry';
import { ShapeUtil } from '../../../model/bpmn/internal';

/**
 * Store all rendering defaults used by `bpmn-visualization`.
 *
 * **WARN**: You may use it to customize the BPMN Theme as suggested in the examples. But be aware that the way the default BPMN theme can be modified is subject to change.
 *
 * @category BPMN Theme
 * @experimental
 */
export const StyleDefault = {
  STROKE_WIDTH_THIN: 2,
  STROKE_WIDTH_THICK: 5,
  SHAPE_ACTIVITY_BOTTOM_MARGIN: 7,
  SHAPE_ACTIVITY_TOP_MARGIN: 7,
  SHAPE_ACTIVITY_LEFT_MARGIN: 7,
  SHAPE_ACTIVITY_FROM_CENTER_MARGIN: 7,
  SHAPE_ACTIVITY_MARKER_ICON_MARGIN: 5,
  SHAPE_ACTIVITY_MARKER_ICON_SIZE: 20,
  POOL_LABEL_SIZE: 30, // most of BPMN pool are ok when setting it to 30
  POOL_LABEL_FILL_COLOR: 'none',
  LANE_LABEL_SIZE: 30, // most of BPMN lane are ok when setting it to 30
  LANE_LABEL_FILL_COLOR: 'none',
  SUB_PROCESS_TRANSACTION_INNER_RECT_OFFSET: 4,
  SUB_PROCESS_TRANSACTION_INNER_RECT_ARC_SIZE: 6,
  TEXT_ANNOTATION_BORDER_LENGTH: 10,
  TEXT_ANNOTATION_FILL_COLOR: 'none',
  GROUP_FILL_COLOR: 'none',
  // General
  DEFAULT_FILL_COLOR: 'White',
  DEFAULT_STROKE_COLOR: 'Black',
  DEFAULT_FONT_FAMILY: 'Arial, Helvetica, sans-serif', // define our own to not depend on eventual mxGraph default change
  DEFAULT_FONT_SIZE: 11,
  DEFAULT_FONT_COLOR: 'Black',
  DEFAULT_MARGIN: 0,
  // Shape defaults
  SHAPE_ARC_SIZE: 20,
  // Overlay defaults
  DEFAULT_OVERLAY_FILL_COLOR: 'White',
  DEFAULT_OVERLAY_FILL_OPACITY: 100,
  DEFAULT_OVERLAY_STROKE_COLOR: 'Black',
  DEFAULT_OVERLAY_STROKE_WIDTH: 1,
  DEFAULT_OVERLAY_FONT_SIZE: 11,
  DEFAULT_OVERLAY_FONT_COLOR: 'Black',
  // Edge
  SEQUENCE_FLOW_CONDITIONAL_FROM_ACTIVITY_MARKER_FILL_COLOR: 'White',
  MESSAGE_FLOW_MARKER_START_FILL_COLOR: 'White',
  MESSAGE_FLOW_MARKER_END_FILL_COLOR: 'White',
};

// TODO maxgraph@0.1.0 maxGraph "TS2748: Cannot access ambient const enums when the '--isolatedModules' flag is provided." constants.FONT
// TODO maxgraph@0.1.0 remove duplicated from maxGraph
export enum FONT {
  BOLD = 1,
  ITALIC = 2,
  UNDERLINE = 4,
  STRIKETHROUGH = 8,
}

const convertDefaultValue = (value: string): string | undefined => (value == 'default' ? undefined : value);

// TODO rebase fix update style functions - no need to return the CellStyle
export const updateStroke = (cellStyle: CellStyle, stroke: Stroke): CellStyle => {
  if (stroke) {
    cellStyle = setStyle(cellStyle, 'strokeColor', stroke.color, convertDefaultValue);
    cellStyle = setStyle(cellStyle, 'strokeOpacity', stroke.opacity, ensureOpacityValue);
    cellStyle = setStyle(cellStyle, 'strokeWidth', stroke.width, ensureStrokeWidthValue);
  }
  return cellStyle;
};

export const setStyle = <T extends string | number>(
  cellStyle: CellStyle,
  key: keyof CellStyle,
  value: T | undefined,
  converter: (value: T) => T | undefined = (value: T) => value,
): CellStyle => {
  if (value != undefined) {
    // TODO rebase fix type - can we really ignore ts error?
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cellStyle[key] = converter(value);
  }
  return cellStyle;
};

export const setStyleFlag = (cellStyle: CellStyle, key: NumericCellStateStyleKeys, flag: number, value?: boolean): CellStyle =>
  value == undefined ? cellStyle : styleUtils.setStyleFlag(cellStyle, key, flag, value);

export const updateFont = (cellStyle: CellStyle, font: Font): CellStyle => {
  if (font) {
    cellStyle = setStyle(cellStyle, 'fontColor', font.color, convertDefaultValue);
    cellStyle = setStyle(cellStyle, 'fontSize', font.size);
    cellStyle = setStyle(cellStyle, 'fontFamily', font.family);

    cellStyle = setStyleFlag(cellStyle, 'fontStyle', FONT.BOLD, font.isBold);
    cellStyle = setStyleFlag(cellStyle, 'fontStyle', FONT.ITALIC, font.isItalic);
    cellStyle = setStyleFlag(cellStyle, 'fontStyle', FONT.UNDERLINE, font.isUnderline);
    cellStyle = setStyleFlag(cellStyle, 'fontStyle', FONT.STRIKETHROUGH, font.isStrikeThrough);

    cellStyle = setStyle(cellStyle, 'textOpacity', font.opacity, ensureOpacityValue);
  }
  return cellStyle;
};

export const updateFill = (cellStyle: BPMNCellStyle, fill: Fill): CellStyle => {
  if (fill.color) {
    cellStyle = setStyle(cellStyle, 'fillColor', fill.color, convertDefaultValue);

    const kind = cellStyle.bpmn.kind;
    if (ShapeUtil.isPoolOrLane(kind)) {
      cellStyle = setStyle(cellStyle, 'swimlaneFillColor', fill.color, convertDefaultValue);
    }
  }

  cellStyle = setStyle(cellStyle, 'fillOpacity', fill.opacity, ensureOpacityValue);

  return cellStyle;
};

export const isShapeStyleUpdate = (style: StyleUpdate): style is ShapeStyleUpdate => {
  return style && typeof style === 'object' && 'fill' in style;
};

export function setCssClasses(cellStyle: BPMNCellStyle, cssClasses: string[]): void {
  // TODO maxgraph@0.1.0 do we need to check if the parameter is not undefined nor empty?
  // TODO maxgraph@0.1.0 do we need to keep this function
  cellStyle.bpmn.extraCssClasses = cssClasses;
}

// FIXME migration maxGraph 0.1.0 - in model.setStyle, the processing is done only if the style parameter is not equal to the style of the cell
// If the style has been get from the cell, then modified, this is the same instance as in the cell, so the 2 objects are equal, so no processing is done
// in mxGraph, the style was a string, now it is an object. Modifying the returned style didn't modified the string of the style cell, so the 2 objects weren't equal and so processing was done.
//
// See https://github.com/maxGraph/maxGraph/issues/326 (the method modified the style of the cell, so the 2 objects are equal, no processing is done)
export const getCellStyleClone = (cell: Cell): CellStyle => cloneUtils.clone(cell.getStyle());
