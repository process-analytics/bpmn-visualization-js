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


/**
 * Store all rendering defaults used by `bpmn-visualization`.
 *
 * **WARN**: You may use it to customize the BPMN Theme as suggested in the examples. But be aware that the way the default BPMN theme can be modified is subject to change.
 *
 * @category BPMN Theme
 * @experimental
 */
export enum StyleDefault {
  STROKE_WIDTH_THIN = 2,
  STROKE_WIDTH_THICK = 5,
  SHAPE_ACTIVITY_BOTTOM_MARGIN = 7,
  SHAPE_ACTIVITY_TOP_MARGIN = 7,
  SHAPE_ACTIVITY_LEFT_MARGIN = 7,
  SHAPE_ACTIVITY_FROM_CENTER_MARGIN = 7,
  SHAPE_ACTIVITY_MARKER_ICON_MARGIN = 5,
  SHAPE_ACTIVITY_MARKER_ICON_SIZE = 20,
  POOL_LABEL_SIZE = 30, // most of BPMN pool are ok when setting it to 30
  POOL_LABEL_FILL_COLOR = 'none',
  LANE_LABEL_SIZE = 30, // most of BPMN lane are ok when setting it to 30
  LANE_LABEL_FILL_COLOR = 'none',
  TEXT_ANNOTATION_BORDER_LENGTH = 10,
  TEXT_ANNOTATION_FILL_COLOR = 'none',
  GROUP_FILL_COLOR = 'none',
  // General
  DEFAULT_FILL_COLOR = 'White',
  DEFAULT_STROKE_COLOR = 'Black',
  DEFAULT_FONT_FAMILY = 'Arial, Helvetica, sans-serif', // define our own to not depend on eventual mxGraph default change
  DEFAULT_FONT_SIZE = 11,
  DEFAULT_FONT_COLOR = 'Black',
  DEFAULT_MARGIN = 0,
  // Shape defaults
  SHAPE_ARC_SIZE = 20,
  // Overlay defaults
  DEFAULT_OVERLAY_FILL_COLOR = DEFAULT_FILL_COLOR,
  DEFAULT_OVERLAY_FILL_OPACITY = 100,
  DEFAULT_OVERLAY_STROKE_COLOR = DEFAULT_STROKE_COLOR,
  DEFAULT_OVERLAY_STROKE_WIDTH = 1,
  DEFAULT_OVERLAY_FONT_SIZE = DEFAULT_FONT_SIZE,
  DEFAULT_OVERLAY_FONT_COLOR = DEFAULT_FONT_COLOR,
  // Edge
  SEQUENCE_FLOW_CONDITIONAL_FROM_ACTIVITY_MARKER_FILL_COLOR = 'White',
  MESSAGE_FLOW_MARKER_START_FILL_COLOR = 'White',
  MESSAGE_FLOW_MARKER_END_FILL_COLOR = 'White',
}

