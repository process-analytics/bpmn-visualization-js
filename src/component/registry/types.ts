/*
Copyright 2021 Bonitasoft S.A.

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

import type { BpmnElementKind } from '../../model/bpmn/internal';

/**
 * @category Custom Behavior
 */
export interface BaseBpmnSemantic {
  id: string;
  name: string;
  /** `true` when relates to a BPMN Shape, `false` when relates to a BPMN Edge. */
  isShape: boolean;
  kind: BpmnElementKind;
}

/**
 * Extended properties available when {@link BaseBpmnSemantic.isShape} is `false`.
 * @category Custom Behavior
 */
export interface EdgeBpmnSemantic extends BaseBpmnSemantic {
  sourceRefId: string;
  targetRefId: string;
}

/**
 * Extended properties available when {@link BaseBpmnSemantic.isShape} is `true`.
 * @category Custom Behavior
 */
export interface ShapeBpmnSemantic extends BaseBpmnSemantic {
  incomingIds: string[];
  outgoingIds: string[];
}

/**
 * @category Custom Behavior
 */
export type BpmnSemantic = EdgeBpmnSemantic | ShapeBpmnSemantic;

/**
 * @category Custom Behavior
 */
export interface BpmnElement {
  bpmnSemantic: BpmnSemantic;
  htmlElement: HTMLElement;
}

/**
 * @category Overlays
 */
export type OverlayShapePosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'middle-left' | 'middle-right';
/**
 * @category Overlays
 */
export type OverlayEdgePosition = 'start' | 'middle' | 'end';
/**
 * @category Overlays
 */
export type OverlayPosition = OverlayShapePosition | OverlayEdgePosition;

/**
 * @category Overlays
 */
export interface OverlayStyle {
  font?: OverlayFont;
  fill?: OverlayFill;
  stroke?: OverlayStroke;
}

/**
 * The font family is {@link StyleDefault.DEFAULT_FONT_FAMILY}.
 * @category Overlays
 */
export interface OverlayFont {
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FONT_COLOR} */
  color?: string;
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FONT_SIZE} */
  size?: number;
}

/**
 * @category Overlays
 */
export interface OverlayFill {
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FILL_COLOR} */
  color?: string;
  /**
   * A number between `0` (transparent) and `100` (opaque).
   *
   * **IMPORTANT**: this property is currently not taken into account by the default Overlay. See https://github.com/process-analytics/bpmn-visualization-js/issues/1234
   * @default {@link StyleDefault.DEFAULT_OVERLAY_FILL_OPACITY}
   */
  opacity?: number;
}

/**
 * @category Overlays
 */
export interface OverlayStroke {
  /**
   * If you don't want to display a stroke, you can set the color to
   *   * `transparent`
   *   * the same value as for the fill color. This increases the padding/margin.
   *
   * @default {@link StyleDefault.DEFAULT_OVERLAY_STROKE_COLOR}
   * */
  color?: string;
  /**
   * **IMPORTANT**: this property is currently not taken into account by the default Overlay. See https://github.com/process-analytics/bpmn-visualization-js/issues/1234
   * @default {@link StyleDefault.DEFAULT_OVERLAY_STROKE_WIDTH}
   */
  width?: number;
}

/**
 * @category Overlays
 */
export interface Overlay {
  position: OverlayPosition;
  label?: string;
  style?: OverlayStyle;
}

/**
 * @category Element Style
 */
export type StyleUpdate = EdgeStyleUpdate | ShapeStyleUpdate;

/**
 * @category Element Style
 */
export type EdgeStyleUpdate = StyleWithOpacity & {
  stroke?: Stroke;
  font?: Font;
};

/**
 * @category Element Style
 */
export type ShapeStyleUpdate = EdgeStyleUpdate & { fill?: Fill };

/**
 * @category Element Style
 *
 * @warning Changing the stroke width of Activities may be misleading as the default stroke widths have a meaning according to the BPMN Specification.
 *
 * For example, updating the stroke width of a task using the same value as the default stroke width of a Call Activity can be confusing. In this case, you should also change another property such as the stroke color to allow the user to differentiate between them.
 */
export type Stroke = StyleWithOpacity & {
  /**
   * Possible values are all HTML color names or HEX codes, as well as special keywords such as:
   * - `default` to use the color defined in the BPMN element default style
   * - `none` for no color
   */
  color?: 'default' | 'none' | string;

  /**
   * Defines the stroke width in pixels.
   *
   * The value must be between 1 and 50.
   *
   * If the set value is less than 1, the used value is 1.
   * If the set value is greater than 50, the used value is 50.
   *
   * To hide the stroke, set the `color` property to `'none'`.
   */
  width?: 'default' | number;
};

/**
 * Note about properties that can be reset to default values.
 *
 * Except for color, all style properties can be set in the BPMN diagram via LabelStyle and can then override the default values. Currently, there is no way to know if
 * they are overridden. So it is not possible to reset each property with the "Update Style" API.
 *
 * @category Element Style
 */
export type Font = StyleWithOpacity & {
  /**
   * Possible values are all HTML color names or HEX codes, as well as special keywords such as:
   * - `default` to use the color defined in the BPMN element default style
   */
  color?: 'default' | string;

  /**
   *  The type of the value is int (in px).
   */
  size?: number;

  family?: string;

  /**
   *  @default false
   */
  isBold?: boolean;

  /**
   *  @default false
   */
  isItalic?: boolean;

  /**
   *  @default false
   */
  isUnderline?: boolean;

  /**
   *  @default false
   */
  isStrikeThrough?: boolean;
};

/**
 * @category Element Style
 */
export type Fill = StyleWithOpacity & {
  /**
   * Possible values are all HTML color names or HEX codes, as well as special keywords such as:
   * - `default` to use the color defined in the BPMN element default style
   * - `none` for no color
   */
  color?: 'default' | 'none' | string;
};

type StyleWithOpacity = {
  /**
   * The value must be between 0 and 100:
   * - If the set value is less than 0, the used value is 0.
   * - If the set value is greater than 100, the used value is 100.
   *
   * The special `default` value is to use the color defined in the BPMN element default style
   */
  opacity?: Opacity;
};

/**
 *  @category Element Style
 */
export type Opacity = 'default' | number;
