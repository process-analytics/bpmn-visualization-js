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
import Shape from '../../model/bpmn/shape/Shape';
import Edge from '../../model/bpmn/edge/Edge';
import BpmnModel from '../../model/bpmn/BpmnModel';
import ShapeBpmnElement, { ShapeBpmnEvent } from '../../model/bpmn/shape/ShapeBpmnElement';
import { MxGraphFactoryService } from '../../service/MxGraphFactoryService';
import Waypoint from '../../model/bpmn/edge/Waypoint';
import { StyleConstant } from './StyleUtils';
import { Font } from '../../model/bpmn/Label';
import Bounds from '../../model/bpmn/Bounds';
import ShapeUtil from '../../model/bpmn/shape/ShapeUtil';

import CoordinatesTranslator from './extension/CoordinatesTranslator';

export default class MxGraphRenderer {
  private mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');

  private mxPoint: typeof mxgraph.mxPoint = MxGraphFactoryService.getMxGraphProperty('mxPoint');
  constructor(readonly graph: mxgraph.mxGraph, readonly coordinatesTranslator: CoordinatesTranslator) {}

  public render(bpmnModel: BpmnModel): void {
    const model = this.graph.getModel();
    model.clear(); // ensure to remove manual changes or already loaded graphs
    model.beginUpdate();
    try {
      this.insertShapes(bpmnModel.pools);
      this.insertShapes(bpmnModel.lanes);
      this.insertShapes(bpmnModel.flowNodes);
      this.insertEdges(bpmnModel.edges);
    } finally {
      model.endUpdate();
    }
  }

  private insertShapes(shapes: Shape[]): void {
    shapes.forEach(shape => {
      this.insertShape(shape);
    });
  }

  private getParent(bpmnElement: ShapeBpmnElement): mxgraph.mxCell {
    const bpmnElementParent = this.getCell(bpmnElement.parentId);
    if (bpmnElementParent) {
      return bpmnElementParent;
    }
    return this.graph.getDefaultParent();
  }

  private insertShape(shape: Shape): void {
    const bpmnElement = shape.bpmnElement;
    if (bpmnElement) {
      const parent = this.getParent(bpmnElement);

      const bounds = shape.bounds;
      let labelBounds = shape.label?.bounds;
      // TODO pool/lane not managed for now
      labelBounds = ShapeUtil.isPoolOrLane(bpmnElement.kind) ? undefined : labelBounds;
      const style = this.computeStyle(shape, labelBounds);

      this.insertVertex(parent, bpmnElement.id, bpmnElement.name, bounds, labelBounds, style);
    }
  }

  computeStyle(bpmnCell: Shape | Edge, labelBounds?: Bounds): string {
    const styleValues = new Map<string, string | number>();

    const font = bpmnCell.label?.font;
    if (font) {
      styleValues.set(this.mxConstants.STYLE_FONTFAMILY, font.name);
      styleValues.set(this.mxConstants.STYLE_FONTSIZE, font.size);
      styleValues.set(this.mxConstants.STYLE_FONTSTYLE, this.getFontStyleValue(font));
    }

    const bpmnElement = bpmnCell.bpmnElement;
    if (bpmnElement instanceof ShapeBpmnEvent) {
      styleValues.set(StyleConstant.BPMN_STYLE_EVENT_KIND, bpmnElement.eventKind);
    }

    if (labelBounds) {
      styleValues.set(this.mxConstants.STYLE_VERTICAL_ALIGN, this.mxConstants.ALIGN_TOP);
      styleValues.set(this.mxConstants.STYLE_ALIGN, this.mxConstants.ALIGN_MIDDLE);
      styleValues.set(this.mxConstants.STYLE_LABEL_BORDERCOLOR, 'red'); // TODO only for detection in this POC
      // erase eventual style configuration for BPMN element
      styleValues.set(this.mxConstants.STYLE_LABEL_POSITION, this.mxConstants.NONE);
      styleValues.set(this.mxConstants.STYLE_VERTICAL_LABEL_POSITION, this.mxConstants.NONE);
      styleValues.set(this.mxConstants.STYLE_LABEL_WIDTH, labelBounds.width); // TODO how do we manage height constraints?
      //styleValues.set(this.mxConstants.STYLE_LABEL_PADDING, 0); // todo adjust
      // only apply to vertex
      // style[this.mxConstants.STYLE_SPACING_TOP] = 55;
      // style[this.mxConstants.STYLE_SPACING_RIGHT] = 110;
    }

    return [bpmnElement.kind as string] //
      .concat([...styleValues].filter(([, v]) => v).map(([key, value]) => key + '=' + value))
      .join(';');
  }

  private getFontStyleValue(font: Font): number {
    let value = 0;
    if (font.isBold) {
      value += this.mxConstants.FONT_BOLD;
    }
    if (font.isItalic) {
      value += this.mxConstants.FONT_ITALIC;
    }
    if (font.isStrikeThrough) {
      value += this.mxConstants.FONT_STRIKETHROUGH;
    }
    if (font.isUnderline) {
      value += this.mxConstants.FONT_UNDERLINE;
    }
    return value;
  }

  private insertEdges(edges: Edge[]): void {
    edges.forEach(edge => {
      const bpmnElement = edge.bpmnElement;
      if (bpmnElement) {
        const parent = this.graph.getDefaultParent();
        const source = this.getCell(bpmnElement.sourceRefId);
        const target = this.getCell(bpmnElement.targetRefId);
        const style = this.computeStyle(edge);
        const mxEdge = this.graph.insertEdge(parent, bpmnElement.id, bpmnElement.name, source, target, style);
        this.insertWaypoints(edge.waypoints, mxEdge);
      }
    });
  }

  private insertWaypoints(waypoints: Waypoint[], mxEdge: mxgraph.mxCell): void {
    if (waypoints) {
      mxEdge.geometry.points = waypoints.map(waypoint => {
        return this.coordinatesTranslator.computeRelativeCoordinates(mxEdge.parent, new this.mxPoint(waypoint.x, waypoint.y));
      });
    }
  }

  private getCell(id: string): mxgraph.mxCell {
    return this.graph.getModel().getCell(id);
  }

  private insertVertex(parent: mxgraph.mxCell, id: string | null, value: string, bounds: Bounds, labelBounds: Bounds, style?: string): mxgraph.mxCell {
    const relativeCoordinate = this.coordinatesTranslator.computeRelativeCoordinates(parent, new this.mxPoint(bounds.x, bounds.y));
    const mxCell = this.graph.insertVertex(parent, id, value, relativeCoordinate.x, relativeCoordinate.y, bounds.width, bounds.height, style);

    // demonstrate how to set label position using the cell geometry offset
    // label relative coordinates to the cell
    if (labelBounds) {
      const relativeLabelX = labelBounds.x - bounds.x;
      const relativeLabelY = labelBounds.y - bounds.y;
      mxCell.geometry.offset = new this.mxPoint(relativeLabelX, relativeLabelY);
    }
    return mxCell;
  }
}

export function defaultMxGraphRenderer(graph: mxgraph.mxGraph): MxGraphRenderer {
  return new MxGraphRenderer(graph, new CoordinatesTranslator(graph));
}
