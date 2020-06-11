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
import CoordinatesTranslator from './extension/CoordinatesTranslator';

export default class MxGraphRenderer {
  private mxPoint: typeof mxgraph.mxPoint = MxGraphFactoryService.getMxGraphProperty('mxPoint');
  private mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');

  private readonly coordinatesTranslator: CoordinatesTranslator;

  constructor(readonly graph: mxgraph.mxGraph) {
    // TODO temp prior injection
    this.coordinatesTranslator = new CoordinatesTranslator(graph);
  }

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
      const bounds = shape.bounds;
      const parent = this.getParent(bpmnElement);
      const absoluteCoordinate = new this.mxPoint(bounds.x, bounds.y);
      const style = this.computeStyle(shape);
      this.insertVertexGivenAbsoluteCoordinates(parent, bpmnElement.id, bpmnElement.name, absoluteCoordinate, bounds.width, bounds.height, style);
    }
  }

  computeStyle(bpmnCell: Shape | Edge): string {
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

  private insertVertexGivenAbsoluteCoordinates(
    parent: mxgraph.mxCell,
    id: string | null,
    value: string,
    absoluteCoordinate: mxgraph.mxPoint,
    width: number,
    height: number,
    style?: string,
  ): mxgraph.mxCell {
    const relativeCoordinate = this.coordinatesTranslator.computeRelativeCoordinates(parent, absoluteCoordinate);
    return this.graph.insertVertex(parent, id, value, relativeCoordinate.x, relativeCoordinate.y, width, height, style);
  }
}
