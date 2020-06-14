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
import Label, { Font } from '../../model/bpmn/Label';
import Bounds from '../../model/bpmn/Bounds';
import { ShapeBpmnElementKind } from '../../model/bpmn/shape/ShapeBpmnElementKind';

interface Coordinate {
  x: number;
  y: number;
}

export default class MxGraphRenderer {
  private mxConstants: typeof mxgraph.mxConstants = MxGraphFactoryService.getMxGraphProperty('mxConstants');
  private mxPoint: typeof mxgraph.mxPoint = MxGraphFactoryService.getMxGraphProperty('mxPoint');
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
      const parent = this.getParent(bpmnElement);
      const style = this.computeStyle(shape);

      const bounds = shape.bounds;
      // TODO temp to manage pool and lane label bounds later
      const labelBounds = bpmnElement.kind == ShapeBpmnElementKind.POOL || bpmnElement.kind == ShapeBpmnElementKind.LANE ? undefined : shape.label?.bounds;

      this.insertVertex(parent, bpmnElement.id, bpmnElement.name, bounds, labelBounds, style);
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

  // TODO to be tested + remove duplication with computeStyle
  private computeLabelStyle(styleName: string, label: Label): string {
    const styleValues = new Map<string, string | number>();

    const font = label?.font;
    if (font) {
      styleValues.set(this.mxConstants.STYLE_FONTFAMILY, font.name);
      styleValues.set(this.mxConstants.STYLE_FONTSIZE, font.size);
      styleValues.set(this.mxConstants.STYLE_FONTSTYLE, this.getFontStyleValue(font));
    }
    return [styleName] //
      .concat([...styleValues].filter(([, v]) => v).map(([key, value]) => key + '=' + value))
      .join(';');
  }

  private insertEdges(edges: Edge[]): void {
    edges.forEach(edge => {
      const bpmnElement = edge.bpmnElement;
      if (bpmnElement) {
        const parent = this.graph.getDefaultParent();
        const source = this.getCell(bpmnElement.sourceRefId);
        const target = this.getCell(bpmnElement.targetRefId);
        const style = this.computeStyle(edge);

        const labelBounds = edge.label?.bounds;
        const labelText = bpmnElement.name;
        const vertexLabel = labelBounds ? '' : labelText; // TODO test this code that manages label without provided bounds

        const mxEdge = this.graph.insertEdge(parent, bpmnElement.id, vertexLabel, source, target, style);
        this.insertWaypoints(edge.waypoints, mxEdge);

        // TODO duplicated with insertVertex
        // demonstrate how to set label position using a dedicate label shape associated to the vertex
        // label relative coordinates to the cell
        if (labelBounds) {
          const labelRelativeCoordinate = this.getRelativeCoordinates(parent, { x: labelBounds.x, y: labelBounds.y });
          // let mxgraph generate the id as it does not exist in the bpmn source
          this.graph.insertVertex(
            parent,
            null,
            labelText,
            labelRelativeCoordinate.x,
            labelRelativeCoordinate.y,
            labelBounds.width + 1, // increase arbitrarily to relax too small bounds (ref miwg-test-suite)
            labelBounds.height,
            this.computeLabelStyle(StyleConstant.BPMN_STYLE_LABEL, edge.label),
          );
        }
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

  private insertVertex(parent: mxgraph.mxCell, id: string | null, labelText: string, bounds: Bounds, labelBounds: Bounds, style?: string): mxgraph.mxCell {
    const vertexLabel = labelBounds ? '' : labelText; // TODO test this code that manages label without provided bounds

    const vertexRelativeCoordinate = this.getRelativeCoordinates(parent, { x: bounds.x, y: bounds.y });
    const vertex = this.graph.insertVertex(parent, id, vertexLabel, vertexRelativeCoordinate.x, vertexRelativeCoordinate.y, bounds.width, bounds.height, style);

    // demonstrate how to set label position using a dedicate label shape associated to the vertex
    // label relative coordinates to the cell
    if (labelBounds) {
      // let mxgraph generate the id as it does not exist in the bpmn source
      // TODO configure dedicated shape and style for bpmn label
      // const labelRelativeCoordinate = this.getRelativeCoordinates(vertex, { x: labelBounds.x, y: labelBounds.y });
      // this.graph.insertVertex(vertex, null, labelText, labelRelativeCoordinate.x, labelRelativeCoordinate.y, labelBounds.width, labelBounds.height);
      const labelRelativeCoordinate = this.getRelativeCoordinates(parent, { x: labelBounds.x, y: labelBounds.y });
      // TODO label style should contains font configuration (as done for edge)
      this.graph.insertVertex(parent, null, labelText, labelRelativeCoordinate.x, labelRelativeCoordinate.y, labelBounds.width, labelBounds.height, StyleConstant.BPMN_STYLE_LABEL);
    }
    return vertex;
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
