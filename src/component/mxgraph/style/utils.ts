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
import { constants } from '@maxgraph/core';
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

const convertDefaultValue = (value: string): string | undefined => (value == 'default' ? undefined : value);

export const updateStroke = (cellStyle: CellStyle, stroke: Stroke): void => {
  if (stroke) {
    setStyle(cellStyle, 'strokeColor', stroke.color, convertDefaultValue);
    setStyle(cellStyle, 'strokeOpacity', stroke.opacity, ensureOpacityValue);
    setStyle(cellStyle, 'strokeWidth', stroke.width, ensureStrokeWidthValue);
  }
};

export const setStyle = <T extends string | number>(
  cellStyle: CellStyle,
  key: keyof CellStyle,
  value: T | undefined,
  converter: (value: T) => T | undefined = (value: T) => value,
): void => {
  if (value != undefined) {
    const convertedValue = converter(value);
    if (convertedValue == null) {
      // TODO maxgraph@0.1.0 - this is required for the effective cell style computation with the fix temporary used in bpmn-visualization (BpmnStylesheet)
      // if the value is undefined/or null, the value from the default style is not used!
      // remove the property to use the value from the "base styles" which provides the default value
      delete cellStyle[key];
    } else {
      // TODO maxgraph@0.1.0 - fix type - can we really ignore ts error?
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      cellStyle[key] = convertedValue;
    }
  }
};

export const setStyleFlag = (cellStyle: CellStyle, key: NumericCellStateStyleKeys, flag: number, value?: boolean): void => {
  // TODO maxGraph@0.1.0 - move this comment to the master branch
  // the mxGraph setStyleFlag function toggle the flag if the value if undefined is passed. In bpmn-visualization, we want to keep the value as it is instead in this case (there is no toggle feature)
  if (value == undefined) return;

  styleUtils.setStyleFlag(cellStyle, key, flag, value);
};

export const updateFont = (cellStyle: CellStyle, font: Font): void => {
  if (font) {
    setStyle(cellStyle, 'fontColor', font.color, convertDefaultValue);
    setStyle(cellStyle, 'fontSize', font.size);
    setStyle(cellStyle, 'fontFamily', font.family);

    setStyleFlag(cellStyle, 'fontStyle', constants.FONT.BOLD, font.isBold);
    setStyleFlag(cellStyle, 'fontStyle', constants.FONT.ITALIC, font.isItalic);
    setStyleFlag(cellStyle, 'fontStyle', constants.FONT.UNDERLINE, font.isUnderline);
    setStyleFlag(cellStyle, 'fontStyle', constants.FONT.STRIKETHROUGH, font.isStrikeThrough);

    setStyle(cellStyle, 'textOpacity', font.opacity, ensureOpacityValue);
  }
};

export const updateFill = (cellStyle: BPMNCellStyle, fill: Fill): void => {
  if (fill.color) {
    setStyle(cellStyle, 'fillColor', fill.color, convertDefaultValue);

    const kind = cellStyle.bpmn.kind;
    if (ShapeUtil.isPoolOrLane(kind)) {
      setStyle(cellStyle, 'swimlaneFillColor', fill.color, convertDefaultValue);
    }
  }

  setStyle(cellStyle, 'fillOpacity', fill.opacity, ensureOpacityValue);
};

export const isShapeStyleUpdate = (style: StyleUpdate): style is ShapeStyleUpdate => {
  return style && typeof style === 'object' && 'fill' in style;
};

export function setCssClasses(cellStyle: BPMNCellStyle, cssClasses: string[]): void {
  // TODO maxgraph@0.1.0 do we need to check if the parameter is not undefined - test pass without checking undefined
  if (cssClasses.length > 0) {
    cellStyle.bpmn.extraCssClasses = cssClasses;
  } else {
    // TODO maxgraph@0.1.0 - this is needed to make the integration tests pass - do we really do to it for a real usage?
    cellStyle.bpmn.extraCssClasses = undefined;
    // delete cellStyle.bpmn.extraCssClasses;
  }
}

// In model.setStyle, the processing is done only if the style parameter is not equal to the style of the cell
// If the style has been get from the cell, then modified, this is the same instance as in the cell, so the 2 objects are equal, so no processing is done
// in mxGraph, the style was a string, now it is an object. Modifying the returned style didn't modify the string of the style cell, so the 2 objects weren't equal and so processing was done.
//
// See https://github.com/maxGraph/maxGraph/issues/326
export const getCellStyleClone = (cell: Cell): CellStyle => cell.getClonedStyle();
