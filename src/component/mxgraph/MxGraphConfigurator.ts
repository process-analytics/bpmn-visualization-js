import { mxgraph, mxgraphFactory } from 'ts-mxgraph';
import { ShapeBpmnElementKind } from '../../model/bpmn/shape/ShapeBpmnElementKind';

const { mxUtils, mxConstants, mxEdgeStyle, mxPerimeter } = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false,
});

export default class MxGraphConfigurator {
  constructor(readonly graph: mxgraph.mxGraph) {}

  public configureStyles(): void {
    this.configureDefaultVertexStyle();
    this.configureStartEventStyle();
  }

  private getStylesheet() {
    return this.graph.getStylesheet();
  }

  private getDefaultVertexStyle() {
    return this.getStylesheet().getDefaultVertexStyle();
  }

  private cloneDefaultVertexStyle(): any {
    const defaultStyle = this.getDefaultVertexStyle();
    return mxUtils.clone(defaultStyle);
  }

  private putCellStyle(name: ShapeBpmnElementKind, style: any) {
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
    style[mxConstants.STYLE_GRADIENT_DIRECTION] = 'east';
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
}
