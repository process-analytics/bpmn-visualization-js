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

import { ShapeBpmnEventBasedGatewayKind, ShapeBpmnEventKind, ShapeBpmnSubProcessKind } from '../../model/bpmn/internal/shape';
import { MessageVisibleKind } from '../../model/bpmn/internal/edge/MessageVisibleKind';
import { mxgraph } from './initializer';
import { GlobalTaskKind } from '../../model/bpmn/internal/shape/ShapeUtil';

export enum MarkerIdentifier {
  ARROW_DASH = 'bpmn.dash',
}

/**
 * Store all rendering defaults used by `bpmn-visualization`.
 * @experimental The way we store and allow to change the defaults in the current form is subject to change without prior any notice.
 */
export enum StyleDefault {
  STROKE_WIDTH_THIN = 2,
  STROKE_WIDTH_THICK = 5,
  SHAPE_ACTIVITY_BOTTOM_MARGIN = 7,
  SHAPE_ACTIVITY_TOP_MARGIN = 7,
  SHAPE_ACTIVITY_LEFT_MARGIN = 7,
  SHAPE_ACTIVITY_FROM_CENTER_MARGIN = 7,
  SHAPE_ACTIVITY_MARKER_ICON_MARGIN = 5,
  SHAPE_ACTIVITY_MARKER_ICON_SIZE = 20, //TODO: this may be adjusted once #465 will be implemented see @https://github.com/process-analytics/bpmn-visualization-js/issues/465
  POOL_LABEL_SIZE = 30, // most of BPMN pool are ok when setting it to 30
  POOL_LABEL_FILL_COLOR = 'none',
  LANE_LABEL_SIZE = 30, // most of BPMN lane are ok when setting it to 30
  LANE_LABEL_FILL_COLOR = 'none',
  TEXT_ANNOTATION_FILL_COLOR = 'none',
  // General
  DEFAULT_FILL_COLOR = 'White',
  DEFAULT_STROKE_COLOR = 'Black',
  DEFAULT_FONT_FAMILY = 'Arial, Helvetica, sans-serif', // define our own to not depend on eventual mxGraph default change
  DEFAULT_FONT_SIZE = 11,
  DEFAULT_FONT_COLOR = 'Black',
  DEFAULT_MARGIN = 0,
  DEFAULT_DASHED = 0, // it means 'false'
  DEFAULT_FIX_DASH = 0, // it means 'false'
  DEFAULT_DASH_PATTERN = '3 3',
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

export enum StyleIdentifier {
  BPMN_STYLE_EVENT_KIND = 'bpmn.eventKind',
  BPMN_STYLE_SUB_PROCESS_KIND = 'bpmn.subProcessKind',
  BPMN_STYLE_IS_INTERRUPTING = 'bpmn.isInterrupting',
  BPMN_STYLE_MARKERS = 'bpmn.markers',
  BPMN_STYLE_INSTANTIATING = 'bpmn.isInstantiating',
  BPMN_STYLE_IS_INITIATING = 'bpmn.isInitiating',
  BPMN_STYLE_MESSAGE_FLOW_ICON = 'bpmn.messageFlowIcon',
  BPMN_STYLE_EVENT_BASED_GATEWAY_KIND = 'bpmn.gatewayKind',
  BPMN_STYLE_EXTRA_CSS_CLASSES = 'bpmn.extra.css.classes',
  BPMN_STYLE_GLOBAL_TASK_KIND = 'bpmn.globalTaskKind',

  // for edge
  EDGE = 'bpmn.edge',
  EDGE_START_FILL_COLOR = 'bpmn.edge.startFillColor',
  EDGE_END_FILL_COLOR = 'bpmn.edge.endFillColor',
}

/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
export default class StyleUtils {
  public static getFillColor(style: any): string {
    return mxgraph.mxUtils.getValue(style, mxgraph.mxConstants.STYLE_FILLCOLOR, StyleDefault.DEFAULT_FILL_COLOR);
  }

  public static getStrokeColor(style: any): string {
    return mxgraph.mxUtils.getValue(style, mxgraph.mxConstants.STYLE_STROKECOLOR, StyleDefault.DEFAULT_STROKE_COLOR);
  }

  public static getStrokeWidth(style: any): number {
    return mxgraph.mxUtils.getValue(style, mxgraph.mxConstants.STYLE_STROKEWIDTH, StyleDefault.STROKE_WIDTH_THIN);
  }

  public static getMargin(style: any): number {
    return mxgraph.mxUtils.getValue(style, mxgraph.mxConstants.STYLE_MARGIN, StyleDefault.DEFAULT_MARGIN);
  }

  public static isDashed(style: any): boolean {
    return mxgraph.mxUtils.getValue(style, mxgraph.mxConstants.STYLE_DASHED, StyleDefault.DEFAULT_DASHED);
  }

  public static isFixDash(style: any): boolean {
    return mxgraph.mxUtils.getValue(style, mxgraph.mxConstants.STYLE_FIX_DASH, StyleDefault.DEFAULT_FIX_DASH);
  }

  public static getDashPattern(style: any): string {
    return mxgraph.mxUtils.getValue(style, mxgraph.mxConstants.STYLE_DASH_PATTERN, StyleDefault.DEFAULT_DASH_PATTERN);
  }

  public static getBpmnEventKind(style: any): ShapeBpmnEventKind {
    return mxgraph.mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_EVENT_KIND, ShapeBpmnEventKind.NONE);
  }

  public static getBpmnSubProcessKind(style: any): ShapeBpmnSubProcessKind {
    return mxgraph.mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_SUB_PROCESS_KIND, undefined);
  }

  public static getBpmnIsInterrupting(style: any): string {
    return mxgraph.mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_IS_INTERRUPTING, undefined);
  }

  public static getBpmnMarkers(style: any): string {
    return mxgraph.mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_MARKERS, undefined);
  }

  public static getBpmnIsInstantiating(style: any): boolean {
    return JSON.parse(mxgraph.mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_INSTANTIATING, false));
  }

  public static getBpmnIsInitiating(style: any): MessageVisibleKind {
    return mxgraph.mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_IS_INITIATING, undefined);
  }

  public static getBpmnIsParallelEventBasedGateway(style: any): boolean {
    return (
      mxgraph.mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_EVENT_BASED_GATEWAY_KIND, ShapeBpmnEventBasedGatewayKind.Exclusive) == ShapeBpmnEventBasedGatewayKind.Parallel
    );
  }

  public static getBpmnGlobalTaskKind(style: any): GlobalTaskKind {
    return mxgraph.mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_GLOBAL_TASK_KIND, undefined);
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
