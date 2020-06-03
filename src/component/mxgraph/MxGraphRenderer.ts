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
import { StyleConstant } from './StyleConfigurator';
import { Font } from '../../model/bpmn/Label';

interface Coordinate {
  x: number;
  y: number;
}

export default class MxGraphRenderer {
  private mxPoint: typeof mxgraph.mxPoint = MxGraphFactoryService.getMxGraphProperty('mxPoint');
  private mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');
  constructor(readonly graph: mxgraph.mxGraph) {}

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
      const absoluteCoordinate = { x: bounds.x, y: bounds.y };
      const style = this.computeStyle(shape);
      this.insertVertexGivenAbsoluteCoordinates(parent, bpmnElement.id, bpmnElement.name, absoluteCoordinate, bounds.width, bounds.height, style);
    }
  }

  private computeStyle(bpmnCell: Shape | Edge): string {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const styleValues = new Map<string, any>();

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

    let style = bpmnElement.kind as string;
    styleValues.forEach((value, key) => {
      if (value) {
        style += ';' + key + '=' + value;
      }
    });

    return style;
  }

  private getFontStyleValue(font: Font): number {
    if (font.isBold) {
      return this.mxConstants.FONT_BOLD;
    } else if (font.isItalic) {
      return this.mxConstants.FONT_ITALIC;
    } else if (font.isStrikeThrough) {
      return this.mxConstants.FONT_STRIKETHROUGH;
    } else if (font.isUnderline) {
      return this.mxConstants.FONT_UNDERLINE;
    }
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
        const relativeCoordinate = this.getRelativeCoordinates(mxEdge.parent, { x: waypoint.x, y: waypoint.y });
        return new this.mxPoint(relativeCoordinate.x, relativeCoordinate.y);
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
    absoluteCoordinate: Coordinate,
    width: number,
    height: number,
    style?: string,
  ): mxgraph.mxCell {
    const relativeCoordinate = this.getRelativeCoordinates(parent, absoluteCoordinate);
    return this.graph.insertVertex(parent, id, value, relativeCoordinate.x, relativeCoordinate.y, width, height, style);
  }

  private getRelativeCoordinates(parent: mxgraph.mxCell, absoluteCoordinate: Coordinate): Coordinate {
    const translateForRoot = this.getTranslateForRoot(parent);
    const relativeX = absoluteCoordinate.x + translateForRoot.x;
    const relativeY = absoluteCoordinate.y + translateForRoot.y;
    return { x: relativeX, y: relativeY };
  }

  // Returns the translation to be applied to a cell whose mxGeometry x and y values are expressed with absolute coordinates
  // (i.e related to the graph default parent) you want to assign as parent to the cell passed as argument of this function.
  // That way, you will be able to express the cell coordinates as relative to its parent cell.
  //
  // The implementation taken from the example described in the documentation of mxgraph#getTranslateForRoot
  // The translation is generally negative
  private getTranslateForRoot(cell: mxgraph.mxCell): mxgraph.mxPoint {
    const model = this.graph.getModel();
    const offset = new this.mxPoint(0, 0);

    while (cell != null) {
      const geo = model.getGeometry(cell);
      if (geo != null) {
        offset.x -= geo.x;
        offset.y -= geo.y;
      }
      cell = model.getParent(cell);
    }

    return offset;
  }
}
