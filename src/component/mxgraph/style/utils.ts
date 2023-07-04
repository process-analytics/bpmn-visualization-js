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

import { ensureOpacityValue, ensureStrokeWidthValue } from '../../helpers/validators';
import type { Fill, Font, ShapeStyleUpdate, Stroke, StyleUpdate } from '../../registry';
import { ShapeBpmnElementKind } from '../../../model/bpmn/internal';
import { BpmnStyleIdentifier } from './identifiers';

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

// TODO magraph@0.1.0 maxGraph "TS2748: Cannot access ambient const enums when the '--isolatedModules' flag is provided." constants.FONT
// TODO magraph@0.1.0 remove duplicated from maxGraph
export enum FONT {
  BOLD = 1,
  ITALIC = 2,
  UNDERLINE = 4,
  STRIKETHROUGH = 8,
}

const convertDefaultValue = (value: string): string | undefined => (value == 'default' ? undefined : value);

// TODO rebase fix update style functions
export const updateStroke = (cellStyle: string, stroke: Stroke): string => {
  if (stroke) {
    cellStyle = setStyle(cellStyle, mxConstants.STYLE_STROKECOLOR, stroke.color, convertDefaultValue);
    cellStyle = setStyle(cellStyle, mxConstants.STYLE_STROKE_OPACITY, stroke.opacity, ensureOpacityValue);
    cellStyle = setStyle(cellStyle, mxConstants.STYLE_STROKEWIDTH, stroke.width, ensureStrokeWidthValue);
  }
  return cellStyle;
};

export const setStyle = <T extends string | number>(cellStyle: string, key: string, value: T | undefined, converter: (value: T) => T | undefined = (value: T) => value): string => {
  return value == undefined ? cellStyle : mxUtils.setStyle(cellStyle, key, converter(value));
};

export const setStyleFlag = (cellStyle: string, key: string, flag: number, value: boolean | undefined): string =>
  value == undefined ? cellStyle : mxUtils.setStyleFlag(cellStyle, key, flag, value);

export const updateFont = (cellStyle: string, font: Font): string => {
  if (font) {
    cellStyle = setStyle(cellStyle, mxConstants.STYLE_FONTCOLOR, font.color, convertDefaultValue);
    cellStyle = setStyle(cellStyle, mxConstants.STYLE_FONTSIZE, font.size);
    cellStyle = setStyle(cellStyle, mxConstants.STYLE_FONTFAMILY, font.family);

    cellStyle = setStyleFlag(cellStyle, mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD, font.isBold);
    cellStyle = setStyleFlag(cellStyle, mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_ITALIC, font.isItalic);
    cellStyle = setStyleFlag(cellStyle, mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_UNDERLINE, font.isUnderline);
    cellStyle = setStyleFlag(cellStyle, mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_STRIKETHROUGH, font.isStrikeThrough);

    cellStyle = setStyle(cellStyle, mxConstants.STYLE_TEXT_OPACITY, font.opacity, ensureOpacityValue);
  }
  return cellStyle;
};

export const updateFill = (cellStyle: string, fill: Fill): string => {
  if (fill.color) {
    cellStyle = setStyle(cellStyle, mxConstants.STYLE_FILLCOLOR, fill.color, convertDefaultValue);

    if (cellStyle.includes(ShapeBpmnElementKind.POOL) || cellStyle.includes(ShapeBpmnElementKind.LANE)) {
      cellStyle = setStyle(cellStyle, mxConstants.STYLE_SWIMLANE_FILLCOLOR, fill.color, convertDefaultValue);
    }
  }

  cellStyle = setStyle(cellStyle, mxConstants.STYLE_FILL_OPACITY, fill.opacity, ensureOpacityValue);

  return cellStyle;
};

export const isShapeStyleUpdate = (style: StyleUpdate): style is ShapeStyleUpdate => {
  return style && typeof style === 'object' && 'fill' in style;
};
