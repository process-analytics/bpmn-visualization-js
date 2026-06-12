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

import type { Fill, Font, ShapeStyleUpdate, Stroke, StyleUpdate, GradientDirection, FillColorGradient } from '../../registry';
import type { BpmnCellStateStyle, BpmnCellStyle } from './types';
import type { CellStyle, DirectionValue, NumericCellStateStyleKeys } from '@maxgraph/core';

import { constants, styleUtils } from '@maxgraph/core';

import { ShapeUtil } from '../../../model/bpmn/internal';
import { ensureOpacityValue, ensureStrokeWidthValue } from '../../helpers/validators';

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
  /** Margin between the bottom of markers and the bottom of the activity. */
  SHAPE_ACTIVITY_BOTTOM_MARGIN: 7,
  /** Margin between the top of icon and the top of the activity. */
  SHAPE_ACTIVITY_TOP_MARGIN: 7,
  /** Margin between the left of icon and the left of the activity. */
  SHAPE_ACTIVITY_LEFT_MARGIN: 7,
  /** Spacing between 2 markers. */
  SHAPE_ACTIVITY_MARKER_ICON_MARGIN: 5,
  /** Theoretical width of a marker. Used to position the markers when there are several markers. */
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
  DEFAULT_FONT_FAMILY: 'Arial, Helvetica, sans-serif', // define our own to not depend on eventual maxGraph default change
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

/**
 * Get the BPMN 'instantiate' information from the style.
 * @param style the maxGraph cell state style
 * @internal
 * @private
 */
export const getBpmnIsInstantiating = (style: BpmnCellStateStyle): boolean => style.bpmn?.isInstantiating ?? false;

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
  if (value == undefined) return;
  (cellStyle as Record<string, unknown>)[key] = converter(value);
};

export const setStyleFlag = (cellStyle: CellStyle, key: NumericCellStateStyleKeys, flag: number, value?: boolean): void => {
  // The maxGraph setStyleFlag function toggles the flag when undefined is passed. In bpmn-visualization, we want to
  // keep the value as it is in that case (there is no toggle feature), so we guard against undefined.
  if (value == undefined) return;

  styleUtils.setStyleFlag(cellStyle, key, flag, value);
};

export const updateFont = (cellStyle: CellStyle, font: Font): void => {
  if (font) {
    setStyle(cellStyle, 'fontColor', font.color, convertDefaultValue);
    setStyle(cellStyle, 'fontSize', font.size);
    setStyle(cellStyle, 'fontFamily', font.family);

    setStyleFlag(cellStyle, 'fontStyle', constants.FONT_STYLE_MASK.BOLD, font.isBold);
    setStyleFlag(cellStyle, 'fontStyle', constants.FONT_STYLE_MASK.ITALIC, font.isItalic);
    setStyleFlag(cellStyle, 'fontStyle', constants.FONT_STYLE_MASK.UNDERLINE, font.isUnderline);
    setStyleFlag(cellStyle, 'fontStyle', constants.FONT_STYLE_MASK.STRIKETHROUGH, font.isStrikeThrough);

    setStyle(cellStyle, 'textOpacity', font.opacity, ensureOpacityValue);
  }
};

const convertDirection = (direction: GradientDirection): DirectionValue => {
  switch (direction) {
    case 'right-to-left': {
      return 'west';
    }
    case 'bottom-to-top': {
      return 'north';
    }
    case 'top-to-bottom': {
      return 'south';
    }
    default: {
      return 'east';
    }
  }
};

export const updateFill = (cellStyle: BpmnCellStyle, fill: Fill): void => {
  const color = fill.color;
  if (color) {
    const isGradient = isFillColorGradient(color);

    const fillColor = isGradient ? color.startColor : color;
    setStyle(cellStyle, 'fillColor', fillColor, convertDefaultValue);

    if (isGradient) {
      // The values of the color are mandatory. So, no need to check if it's undefined.
      cellStyle.gradientColor = color.endColor;
      cellStyle.gradientDirection = convertDirection(color.direction);
    } else if (color === 'default') {
      delete cellStyle.gradientColor;
      delete cellStyle.gradientDirection;
    }

    const kind = cellStyle.bpmn?.kind;
    if (kind && ShapeUtil.isPoolOrLane(kind)) {
      setStyle(cellStyle, 'swimlaneFillColor', fillColor, convertDefaultValue);
    }
  }

  setStyle(cellStyle, 'fillOpacity', fill.opacity, ensureOpacityValue);
};

export const isShapeStyleUpdate = (style: StyleUpdate): style is ShapeStyleUpdate => {
  return style && typeof style === 'object' && 'fill' in style;
};

/**
 * Set the extra CSS classes on the BPMN part of a {@link CellStyle}, deleting the property when there are none.
 * @internal
 */
export function setCssClasses(cellStyle: BpmnCellStyle, cssClasses: string[]): void {
  cellStyle.bpmn ??= {};
  if (cssClasses.length > 0) {
    cellStyle.bpmn.extraCssClasses = cssClasses;
  } else {
    delete cellStyle.bpmn.extraCssClasses;
  }
}

const isFillColorGradient = (color: string | FillColorGradient): color is FillColorGradient => {
  return color && typeof color === 'object';
};
