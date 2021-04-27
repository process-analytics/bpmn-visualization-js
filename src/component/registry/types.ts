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
import { mxgraph } from '../mxgraph/initializer';

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
 * @category Interaction
 */
export type OverlayShapePosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'middle-left' | 'middle-right';

/**
 * @category Interaction
 */
export type OverlayEdgePosition = 'start' | 'middle' | 'end';

/**
 * @category Interaction
 */
export type OverlayPosition = OverlayShapePosition | OverlayEdgePosition;

/**
 * @category Interaction
 */
export type OverlayShape = 'rectangle' | 'ellipse' | 'doubleEllipse' | 'rhombus' | 'image' | 'label' | 'cylinder' | 'actor' | 'cloud' | 'triangle' | 'hexagon';

/**
 * @category Interaction
 */
export interface OverlayStyle {
  font?: OverlayFont;
  fill?: OverlayFill;
  stroke?: OverlayStroke;
  shape?: OverlayShape;
}

/**
 * The font family is {@link StyleDefault.DEFAULT_FONT_FAMILY}.
 * @category Interaction
 */
export interface OverlayFont {
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FONT_COLOR} */
  color?: string;
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FONT_SIZE} */
  size?: number;
}

/**
 * @category Interaction
 */
export interface OverlayFill {
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FILL_COLOR} */
  color?: string;
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_FILL_OPACITY} */
  opacity?: number;
}

/**
 * @category Interaction
 */
export interface OverlayStroke {
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_STROKE_COLOR} */
  color?: string;
  /** @default {@link StyleDefault.DEFAULT_OVERLAY_STROKE_WIDTH} */
  width?: number;
}

/**
 * @category Interaction
 */
export interface Overlay {
  position: OverlayPosition;
  label?: string;
  style?: OverlayStyle;
}
