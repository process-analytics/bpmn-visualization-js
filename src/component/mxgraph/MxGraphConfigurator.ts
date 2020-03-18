import { mxgraph } from 'ts-mxgraph';
import { ShapeBpmnElementKind } from '../../model/bpmn/shape/ShapeBpmnElementKind';
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';

const { mxUtils, mxConstants, mxPerimeter } = MxGraphFactoryService.getInstance();

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Configure mxgraph
 * <ul>
 *     <li>styles
 *     <li>shapes
 */
export default class MxGraphConfigurator {
  constructor(readonly graph: mxgraph.mxGraph) {}

  public configureStyles(): void {
    this.configureDefaultVertexStyle();
    this.configureLaneStyle();
    this.configureStartEventStyle();
    this.configureUserTaskStyle();
    this.configureParallelGatewayStyle();
    this.configureExclusiveGatewayStyle();
  }

  private getStylesheet(): any {
    return this.graph.getStylesheet();
  }

  private getDefaultVertexStyle(): any {
    return this.getStylesheet().getDefaultVertexStyle();
  }

  private cloneDefaultVertexStyle(): any {
    const defaultStyle = this.getDefaultVertexStyle();
    return mxUtils.clone(defaultStyle);
  }

  private putCellStyle(name: ShapeBpmnElementKind, style: any): void {
    this.getStylesheet().putCellStyle(name, style);
  }

  private configureDefaultVertexStyle(): void {
    const style = this.getDefaultVertexStyle();
    style[mxConstants.STYLE_HORIZONTAL] = true;
    style[mxConstants.STYLE_FONTSIZE] = 15;
    style[mxConstants.STYLE_FILLCOLOR] = 'white';
    style[mxConstants.STYLE_FONTCOLOR] = 'black';
    style[mxConstants.STYLE_STROKECOLOR] = 'black';
    style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'none';
  }

  private configureLaneStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
    style[mxConstants.STYLE_HORIZONTAL] = false;
    style[mxConstants.STYLE_SWIMLANE_LINE] = 0; // hide the line between the title region and the content area

    this.graph.getStylesheet().putCellStyle(ShapeBpmnElementKind.LANE, style);
  }

  private configureStartEventStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = 'top';
    style[mxConstants.STYLE_STROKECOLOR] = '#62A928';
    style[mxConstants.STYLE_STROKEWIDTH] = 1.7;
    style[mxConstants.STYLE_GRADIENTCOLOR] = '#E9ECB1';
    this.putCellStyle(ShapeBpmnElementKind.EVENT_START, style);
  }

  private configureUserTaskStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = 'middle';
    style[mxConstants.STYLE_STROKECOLOR] = '#2C6DA3';
    style[mxConstants.STYLE_STROKEWIDTH] = 2;
    style[mxConstants.STYLE_ROUNDED] = true;
    this.putCellStyle(ShapeBpmnElementKind.TASK_USER, style);
  }

  private configureParallelGatewayStyle(): void {
    const style = this.cloneDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
    style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
    style[mxConstants.STYLE_VERTICAL_ALIGN] = 'top';
    style[mxConstants.STYLE_STROKECOLOR] = '#96A826';
    style[mxConstants.STYLE_STROKEWIDTH] = 1.7;

    style[mxConstants.STYLE_SPACING_TOP] = 55;
    style[mxConstants.STYLE_SPACING_RIGHT] = 110;
    style[mxConstants.STYLE_GRADIENTCOLOR] = '#E9ECB1';
    this.putCellStyle(ShapeBpmnElementKind.GATEWAY_PARALLEL, style);
  }

  private configureExclusiveGatewayStyle(): void {
    const style = mxUtils.clone(this.getStylesheet().getCellStyle(ShapeBpmnElementKind.GATEWAY_PARALLEL), this.getDefaultVertexStyle());
    style[mxConstants.STYLE_GRADIENTCOLOR] = '#DDA0DD';
    this.putCellStyle(ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, style);
  }
}
