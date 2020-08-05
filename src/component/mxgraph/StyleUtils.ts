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
import { ShapeBpmnEventKind } from '../../model/bpmn/shape/ShapeBpmnEventKind';
import { ShapeBpmnSubProcessKind } from '../../model/bpmn/shape/ShapeBpmnSubProcessKind';
import { ShapeBpmnMarkerKind } from '../../model/bpmn/shape/ShapeBpmnMarkerKind';

export enum MarkerIdentifier {
  ARROW_DASH = 'bpmn.dash',
}

export enum StyleDefault {
  STROKE_WIDTH_THIN = 2,
  STROKE_WIDTH_THICK = 5,
  SHAPE_ACTIVITY_BOTTOM_MARGIN = 7,
  SHAPE_ACTIVITY_FROM_CENTER_MARGIN = 7,
  DEFAULT_FILL_COLOR = 'White',
  DEFAULT_STROKE_COLOR = 'Black',
  DEFAULT_FONT_FAMILY = 'Arial, Helvetica, sans-serif', // define our own to not depend on eventual mxGraph default change
  DEFAULT_FONT_SIZE = 11,
  DEFAULT_FONT_COLOR = 'Black',
  DEFAULT_MARGIN = 0,
  DEFAULT_DASHED = 0, // it means 'false'
  DEFAULT_FIX_DASH = 0, // it means 'false'
  DEFAULT_DASH_PATTERN = '3 3',
}

export enum StyleIdentifier {
  BPMN_STYLE_EVENT_KIND = 'bpmn.eventKind',
  BPMN_STYLE_SUB_PROCESS_KIND = 'bpmn.subProcessKind',
  BPMN_STYLE_IS_INTERRUPTING = 'bpmn.isInterrupting',
  BPMN_STYLE_IS_EXPANDED = 'bpmn.isExpanded',
  BPMN_STYLE_MARKERS = 'bpmn.markers',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class StyleUtils {
  public static getFillColor(style: any): string {
    return mxUtils.getValue(style, mxConstants.STYLE_FILLCOLOR, StyleDefault.DEFAULT_FILL_COLOR);
  }

  public static getStrokeColor(style: any): string {
    return mxUtils.getValue(style, mxConstants.STYLE_STROKECOLOR, StyleDefault.DEFAULT_STROKE_COLOR);
  }

  public static getStrokeWidth(style: any): number {
    return mxUtils.getValue(style, mxConstants.STYLE_STROKEWIDTH, StyleDefault.STROKE_WIDTH_THIN);
  }

  public static getMargin(style: any): number {
    return mxUtils.getValue(style, mxConstants.STYLE_MARGIN, StyleDefault.DEFAULT_MARGIN);
  }

  public static isDashed(style: any): boolean {
    return mxUtils.getValue(style, mxConstants.STYLE_DASHED, StyleDefault.DEFAULT_DASHED);
  }

  public static isFixDash(style: any): boolean {
    return mxUtils.getValue(style, mxConstants.STYLE_FIX_DASH, StyleDefault.DEFAULT_FIX_DASH);
  }

  public static getDashPattern(style: any): string {
    return mxUtils.getValue(style, mxConstants.STYLE_DASH_PATTERN, StyleDefault.DEFAULT_DASH_PATTERN);
  }

  public static getBpmnEventKind(style: any): ShapeBpmnEventKind {
    return mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_EVENT_KIND, ShapeBpmnEventKind.NONE);
  }

  public static getBpmnSubProcessKind(style: any): ShapeBpmnSubProcessKind {
    return mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_SUB_PROCESS_KIND, undefined);
  }

  public static getBpmnIsInterrupting(style: any): string {
    return mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_IS_INTERRUPTING, undefined);
  }

  public static getBpmnIsExpanded(style: any): string {
    return mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_IS_EXPANDED, 'false');
  }

  public static getBpmnMarker(style: any): ShapeBpmnMarkerKind {
    return mxUtils.getValue(style, StyleIdentifier.BPMN_STYLE_MARKERS, undefined);
  }
}
