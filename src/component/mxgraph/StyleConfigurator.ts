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
import { mxgraph } from 'ts-mxgraph';
import { ShapeBpmnElementKind } from '../../model/bpmn/shape/ShapeBpmnElementKind';
import ShapeUtil from '../../model/bpmn/shape/ShapeUtil';
import { SequenceFlowKind } from '../../model/bpmn/edge/SequenceFlowKind';
import { MarkerConstant } from './MarkerConfigurator';
import { StyleConstant } from './StyleUtils';

declare const mxUtils: typeof mxgraph.mxUtils;
declare const mxConstants: typeof mxgraph.mxConstants;
declare const mxPerimeter: typeof mxgraph.mxPerimeter;

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class StyleConfigurator {
  private specificEdgeStyles: Map<SequenceFlowKind, (style: any) => void> = new Map([
    [
      SequenceFlowKind.DEFAULT,
      (style: any) => {
        style[mxConstants.STYLE_STARTARROW] = MarkerConstant.ARROW_DASH;
      },
    ],
    [
      SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY,
      (style: any) => {
        style[mxConstants.STYLE_STARTARROW] = mxConstants.ARROW_DIAMOND_THIN;
        style[mxConstants.STYLE_STARTSIZE] = 18;
        style[mxConstants.STYLE_STARTFILL] = 0;
      },
    ],
  ]);

  constructor(private graph: mxgraph.mxGraph) {}

  public configureStyles(): void {
    mxConstants.RECTANGLE_ROUNDING_FACTOR = 0.1;
    this.configureDefaultVertexStyle();

    this.configurePoolStyle();
    this.configureLaneStyle();

    this.configureActivitiesStyle();
    this.configureEventsStyle();
    this.configureGatewaysStyle();

    this.configureDefaultEdgeStyle();
    this.configureSequenceFlowsStyle();
  }

  private getStylesheet(): any {
    return this.graph.getStylesheet();
  }

  private getDefaultVertexStyle(): any {
    return this.getStylesheet().getDefaultVertexStyle();
  }

  private getDefaultEdgeStyle(): any {
    return this.getStylesheet().getDefaultEdgeStyle();
  }

  private cloneDefaultVertexStyle(): any {
    const defaultStyle = this.getDefaultVertexStyle();
    return mxUtils.clone(defaultStyle);
  }

  private cloneDefaultEdgeStyle(): any {
    const defaultStyle = this.getDefaultEdgeStyle();
    return mxUtils.clone(defaultStyle);
  }

  private putCellStyle(name: ShapeBpmnElementKind, style: any): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    const style = this.getDefaultVertexStyle();
    this.configureCommonDefaultStyle(style);
  }

  private configurePoolStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_HORIZONTAL] = false;
    style[mxConstants.STYLE_FILLCOLOR] = '#d3d2d1';
    // TODO check pool fill color (none or fill, relevant for image export)
    style[mxConstants.STYLE_SWIMLANE_FILLCOLOR] = StyleConstant.DEFAULT_FILL_COLOR;

    // TODO manage pool text area rendering
    // most of BPMN pool are ok when setting it to 30
    style[mxConstants.STYLE_STARTSIZE] = 30;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
    style[mxConstants.STYLE_HORIZONTAL] = false;
    style[mxConstants.STYLE_SWIMLANE_LINE] = 0; // hide the line between the title region and the content area
    // TODO check lane fill color (none or fill, relevant for image export)
    // const fillColor = 'none'; // StyleConstant.DEFAULT_FILL_COLOR
    style[mxConstants.STYLE_FILLCOLOR] = 'swimlane';
    // style[this.mxConstants.STYLE_SWIMLANE_FILLCOLOR] = StyleConstant.DEFAULT_FILL_COLOR;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventsStyle(): void {
    ShapeUtil.topLevelBpmnEventKinds().forEach(kind => {
      const style = this.cloneDefaultVertexStyle();
      style[mxConstants.STYLE_SHAPE] = kind;
      style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
      style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_BOTTOM;
      this.putCellStyle(kind, style);
    });
  }

  private configureActivitiesStyle(): void {
    this.configureTasksStyle();
    this.configureCallActivityStyle();
  }

  private configureTasksStyle(): void {
    ShapeUtil.taskKinds().forEach(kind => {
      const style = this.cloneDefaultVertexStyle();
      style[mxConstants.STYLE_SHAPE] = kind;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
      this.putCellStyle(kind, style);
    });
  }

  private configureCallActivityStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
    style[mxConstants.STYLE_STROKECOLOR] = '#2C6DA3';
    style[mxConstants.STYLE_STROKEWIDTH] = 4;
    style[mxConstants.STYLE_ROUNDED] = true;
    this.putCellStyle(ShapeBpmnElementKind.CALL_ACTIVITY, style);
  }

  private configureGatewaysStyle(): void {
    ShapeUtil.gatewayKinds().forEach(kind => {
      const style = this.cloneDefaultVertexStyle();
      style[mxConstants.STYLE_SHAPE] = kind;
      style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
      style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;

      // Default positioning in case there is no BPMN LabelStyle
      style[mxConstants.STYLE_LABEL_POSITION] = mxConstants.ALIGN_LEFT;
      style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_TOP;

      this.putCellStyle(kind, style);
    });
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getDefaultEdgeStyle();
    style[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_SEGMENT;
    style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_BLOCK_THIN;
    style[mxConstants.STYLE_ENDSIZE] = 12;
    style[mxConstants.STYLE_STROKEWIDTH] = 1.5;
    style[mxConstants.STYLE_ROUNDED] = 1;
    style[mxConstants.STYLE_ARCSIZE] = 5;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_BOTTOM;

    this.configureCommonDefaultStyle(style);
  }

  private configureCommonDefaultStyle(style: any): void {
    style[mxConstants.STYLE_FONTFAMILY] = StyleConstant.DEFAULT_FONT_FAMILY;
    style[mxConstants.STYLE_FONTSIZE] = StyleConstant.DEFAULT_FONT_SIZE;
    style[mxConstants.STYLE_FONTCOLOR] = StyleConstant.DEFAULT_FONT_COLOR;
    style[mxConstants.STYLE_FILLCOLOR] = StyleConstant.DEFAULT_FILL_COLOR;
    style[mxConstants.STYLE_STROKECOLOR] = StyleConstant.DEFAULT_STROKE_COLOR;
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = mxConstants.NONE;

    // only works with html labels (enabled by MxGraphConfigurator)
    style[mxConstants.STYLE_WHITE_SPACE] = 'wrap';
  }

  private configureSequenceFlowsStyle(): void {
    Object.values(SequenceFlowKind).forEach(kind => {
      const style = this.cloneDefaultEdgeStyle();
      const updateEdgeStyle =
        this.specificEdgeStyles.get(kind) ||
        (() => {
          // Do nothing
        });
      updateEdgeStyle(style);
      this.graph.getStylesheet().putCellStyle(kind, style);
    });
  }
}
