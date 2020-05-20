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
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';
import ShapeUtil from '../../model/bpmn/shape/ShapeUtil';
import { SequenceFlowKind } from '../../model/bpmn/edge/SequenceFlowKind';
import { MarkerConstant } from './MarkerConfigurator';

export enum StyleConstant {
  STROKE_WIDTH_THIN = 2,
  STROKE_WIDTH_THICK = 5,
  BPMN_STYLE_EVENT_KIND = 'bpmn.eventKind',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class StyleConfigurator {
  private mxUtils: typeof mxgraph.mxUtils = MxGraphFactoryService.getMxGraphProperty('mxUtils');
  private mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');
  private mxPerimeter: typeof mxgraph.mxPerimeter = MxGraphFactoryService.getMxGraphProperty('mxPerimeter');

  constructor(private graph: mxgraph.mxGraph) {}

  public configureStyles(): void {
    this.mxConstants.RECTANGLE_ROUNDING_FACTOR = 0.1;
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
    return this.mxUtils.clone(defaultStyle);
  }

  private cloneDefaultEdgeStyle(): any {
    const defaultStyle = this.getDefaultEdgeStyle();
    return this.mxUtils.clone(defaultStyle);
  }

  private putCellStyle(name: ShapeBpmnElementKind, style: any): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    const style = this.getDefaultVertexStyle();
    style[this.mxConstants.STYLE_HORIZONTAL] = true;
    style[this.mxConstants.STYLE_FONTSIZE] = 15;
    style[this.mxConstants.STYLE_FILLCOLOR] = 'white';
    style[this.mxConstants.STYLE_FONTCOLOR] = 'black';
    style[this.mxConstants.STYLE_STROKECOLOR] = 'black';
    style[this.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
  }

  private configurePoolStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[this.mxConstants.STYLE_SHAPE] = this.mxConstants.SHAPE_SWIMLANE;
    style[this.mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
    style[this.mxConstants.STYLE_HORIZONTAL] = false;
    style[this.mxConstants.STYLE_FILLCOLOR] = '#d3d2d1';

    // TODO manage pool text area rendering
    // most of BPMN pool are ok when setting it to 30
    style[this.mxConstants.STYLE_STARTSIZE] = 30;

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.POOL, style);
  }

  private configureLaneStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[this.mxConstants.STYLE_SHAPE] = this.mxConstants.SHAPE_SWIMLANE;
    style[this.mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
    style[this.mxConstants.STYLE_HORIZONTAL] = false;
    style[this.mxConstants.STYLE_SWIMLANE_LINE] = 0; // hide the line between the title region and the content area

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureEventsStyle(): void {
    ShapeUtil.topLevelBpmnEventKinds().forEach(kind => {
      const style = this.cloneDefaultVertexStyle();
      style[this.mxConstants.STYLE_SHAPE] = kind;
      style[this.mxConstants.STYLE_PERIMETER] = this.mxPerimeter.EllipsePerimeter;
      style[this.mxConstants.STYLE_VERTICAL_LABEL_POSITION] = 'bottom';
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
      style[this.mxConstants.STYLE_SHAPE] = kind;
      style[this.mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
      this.putCellStyle(kind, style);
    });
  }

  private configureCallActivityStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[this.mxConstants.STYLE_SHAPE] = this.mxConstants.SHAPE_RECTANGLE;
    style[this.mxConstants.STYLE_PERIMETER] = this.mxPerimeter.RectanglePerimeter;
    style[this.mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
    style[this.mxConstants.STYLE_STROKECOLOR] = '#2C6DA3';
    style[this.mxConstants.STYLE_STROKEWIDTH] = 4;
    style[this.mxConstants.STYLE_ROUNDED] = true;
    this.putCellStyle(ShapeBpmnElementKind.CALL_ACTIVITY, style);
  }

  private configureGatewaysStyle(): void {
    ShapeUtil.gatewayKinds().forEach(kind => {
      const style = this.cloneDefaultVertexStyle();
      style[this.mxConstants.STYLE_SHAPE] = kind;
      style[this.mxConstants.STYLE_PERIMETER] = this.mxPerimeter.RhombusPerimeter;
      style[this.mxConstants.STYLE_VERTICAL_ALIGN] = 'top';

      // TODO to be removed when supporting label position
      // left just to not break current rendering
      style[this.mxConstants.STYLE_SPACING_TOP] = 55;
      style[this.mxConstants.STYLE_SPACING_RIGHT] = 110;

      this.putCellStyle(kind, style);
    });
  }

  private configureDefaultEdgeStyle(): void {
    const style = this.getDefaultEdgeStyle();
    style[this.mxConstants.STYLE_EDGE] = this.mxConstants.EDGESTYLE_SEGMENT;
    style[this.mxConstants.STYLE_ENDARROW] = this.mxConstants.ARROW_BLOCK_THIN;
    style[this.mxConstants.STYLE_ENDSIZE] = 12;
    style[this.mxConstants.STYLE_STROKECOLOR] = 'Black';
    style[this.mxConstants.STYLE_STROKEWIDTH] = 1.5;
    style[this.mxConstants.STYLE_ROUNDED] = 1;
    style[this.mxConstants.STYLE_ARCSIZE] = 5;

    style[this.mxConstants.STYLE_FONTSIZE] = 15;
    style[this.mxConstants.STYLE_FILLCOLOR] = 'White';
    style[this.mxConstants.STYLE_FONTCOLOR] = 'Black';
    style[this.mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
    style[this.mxConstants.STYLE_VERTICAL_ALIGN] = 'bottom';
  }

  private configureSequenceFlowsStyle(): void {
    this.configureNormalSequenceFlowStyle();
    this.configureDefaultSequenceFlowStyle();
    this.configureConditionalSequenceFlowFromActivityStyle();
    this.configureConditionalSequenceFlowFromGatewayStyle();
  }

  private configureNormalSequenceFlowStyle(): void {
    const style = this.cloneDefaultEdgeStyle();
    this.graph.getStylesheet().putCellStyle(SequenceFlowKind.NORMAL, style);
  }

  private configureDefaultSequenceFlowStyle(): void {
    const style = this.cloneDefaultEdgeStyle();
    style[this.mxConstants.STYLE_STARTARROW] = MarkerConstant.ARROW_DASH;
    this.graph.getStylesheet().putCellStyle(SequenceFlowKind.DEFAULT, style);
  }

  private configureConditionalSequenceFlowFromActivityStyle(): void {
    const style = this.cloneDefaultEdgeStyle();
    style[this.mxConstants.STYLE_STARTARROW] = this.mxConstants.ARROW_DIAMOND_THIN;
    style[this.mxConstants.STYLE_STARTSIZE] = 20;
    style[this.mxConstants.STYLE_STROKECOLOR] = 'Chartreuse';
    style[this.mxConstants.STYLE_VERTICAL_ALIGN] = 'bottom';
    this.graph.getStylesheet().putCellStyle(SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY, style);
  }

  private configureConditionalSequenceFlowFromGatewayStyle(): void {
    const style = this.cloneDefaultEdgeStyle();
    this.graph.getStylesheet().putCellStyle(SequenceFlowKind.CONDITIONAL_FROM_GATEWAY, style);
  }
}
