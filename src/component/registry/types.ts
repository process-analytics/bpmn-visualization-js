/**
 * Copyright 2021 Bonitasoft S.A.
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

import { BpmnElementKind } from '../../model/bpmn/internal/api';

/**
 * @category Interaction
 */
export interface BpmnSemantic {
  id: string;
  name: string;
  /** `true` when relates to a BPMN Shape, `false` when relates to a BPMN Edge. */
  isShape: boolean;
  kind: BpmnElementKind;
}

/**
 * @category Interaction
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
   * <b>IMPORTANT</b>: this is currently not considered by the default Badge Overlay. See {@link https://github.com/process-analytics/bpmn-visualization-js/issues/1234 issue 1234}
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
   * <b>IMPORTANT</b>: this is currently not considered by the default Badge Overlay. See {@link https://github.com/process-analytics/bpmn-visualization-js/issues/1234 issue 1234}
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
