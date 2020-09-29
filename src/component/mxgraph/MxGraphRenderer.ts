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
import InternalBPMNShape from '../../model/bpmn/internal/shape/InternalBPMNShape';
import InternalBPMNEdge from '../../model/bpmn/internal/edge/InternalBPMNEdge';
import InternalBPMNModel from '../../model/bpmn/internal/InternalBPMNModel';
import ShapeBaseElement from '../../model/bpmn/internal/shape/ShapeBaseElement';
import InternalBPMNShapeUtil from '../../model/bpmn/internal/shape/InternalBPMNShapeUtil';
import CoordinatesTranslator from './renderer/CoordinatesTranslator';
import StyleConfigurator from './config/StyleConfigurator';
import { MessageFlow } from '../../model/bpmn/internal/edge/Flow';
import { Bounds, Point } from '../../model/bpmn/json-xsd/DC';

export default class MxGraphRenderer {
  constructor(readonly graph: mxGraph, readonly coordinatesTranslator: CoordinatesTranslator, readonly styleConfigurator: StyleConfigurator) {}

  public render(bpmnModel: InternalBPMNModel): void {
    const model = this.graph.getModel();
    model.clear(); // ensure to remove manual changes or already loaded graphs
    model.beginUpdate();
    try {
      this.insertShapes(bpmnModel.pools);
      this.insertShapes(bpmnModel.lanes);
      this.insertShapes(bpmnModel.flowNodes.filter(shape => !InternalBPMNShapeUtil.isBoundaryEvent(shape.bpmnElement?.type)));
      this.insertShapes(bpmnModel.flowNodes.filter(shape => InternalBPMNShapeUtil.isBoundaryEvent(shape.bpmnElement?.type)));
      this.insertEdges(bpmnModel.edges);
    } finally {
      model.endUpdate();
    }
  }

  private insertShapes(shapes: InternalBPMNShape[]): void {
    shapes.forEach(shape => {
      this.insertShape(shape);
    });
  }

  private getParent(bpmnElement: ShapeBaseElement): mxCell {
    const bpmnElementParent = this.getCell(bpmnElement.parentId);
    if (bpmnElementParent) {
      return bpmnElementParent;
    }

    if (!InternalBPMNShapeUtil.isBoundaryEvent(bpmnElement.type)) {
      return this.graph.getDefaultParent();
    }
  }

  private insertShape(shape: InternalBPMNShape): void {
    const bpmnElement = shape.bpmnElement;
    if (bpmnElement) {
      const parent = this.getParent(bpmnElement);
      if (!parent) {
        // TODO error management
        console.warn('Not possible to insert shape %s: parent cell %s is not found', bpmnElement.id, bpmnElement.parentId);
        return;
      }
      const bounds = shape.bounds;
      let labelBounds = shape.label?.bounds;
      // pool/lane label bounds are not managed for now (use hard coded values)
      labelBounds = InternalBPMNShapeUtil.isPoolOrLane(bpmnElement.type) ? undefined : labelBounds;
      const style = this.styleConfigurator.computeStyle(shape, labelBounds);

      this.insertVertex(parent, bpmnElement.id, bpmnElement.name, bounds, labelBounds, style);
    }
  }

  private insertEdges(edges: InternalBPMNEdge[]): void {
    edges.forEach(edge => {
      const bpmnElement = edge.bpmnElement;
      if (bpmnElement) {
        const parent = this.graph.getDefaultParent();
        const source = this.getCell(bpmnElement.sourceRefId);
        const target = this.getCell(bpmnElement.targetRefId);
        const labelBounds = edge.label?.bounds;
        const style = this.styleConfigurator.computeStyle(edge, labelBounds);
        const mxEdge = this.graph.insertEdge(parent, bpmnElement.id, bpmnElement.name, source, target, style);
        this.insertWaypoints(edge.waypoints, mxEdge);

        if (labelBounds) {
          mxEdge.geometry.width = labelBounds.width;
          mxEdge.geometry.height = labelBounds.height;

          const edgeCenterCoordinate = this.coordinatesTranslator.computeEdgeCenter(mxEdge);
          if (edgeCenterCoordinate) {
            mxEdge.geometry.relative = false;

            const labelBoundsRelativeCoordinateFromParent = this.coordinatesTranslator.computeRelativeCoordinates(mxEdge.parent, new mxPoint(labelBounds.x, labelBounds.y));
            const relativeLabelX = labelBoundsRelativeCoordinateFromParent.x + labelBounds.width / 2 - edgeCenterCoordinate.x;
            const relativeLabelY = labelBoundsRelativeCoordinateFromParent.y - edgeCenterCoordinate.y;
            mxEdge.geometry.offset = new mxPoint(relativeLabelX, relativeLabelY);
          }
        }

        this.insertMessageFlowIconIfNeeded(edge, mxEdge);
      }
    });
  }

  private insertMessageFlowIconIfNeeded(edge: InternalBPMNEdge, mxEdge: mxCell): void {
    if (edge.bpmnElement instanceof MessageFlow && edge.messageVisibleKind) {
      const mxCell = this.graph.insertVertex(mxEdge, `messageFlowIcon_of_${mxEdge.id}`, undefined, 0, 0, 20, 14, this.styleConfigurator.computeMessageFlowIconStyle(edge));
      mxCell.geometry.relative = true;
      mxCell.geometry.offset = new mxPoint(-10, -7);
    }
  }

  private insertWaypoints(waypoints: Point[], mxEdge: mxCell): void {
    if (waypoints) {
      mxEdge.geometry.points = waypoints.map(waypoint => {
        return this.coordinatesTranslator.computeRelativeCoordinates(mxEdge.parent, new mxPoint(waypoint.x, waypoint.y));
      });
    }
  }

  private getCell(id: string): mxCell {
    return this.graph.getModel().getCell(id);
  }

  private insertVertex(parent: mxCell, id: string | null, value: string, bounds: Bounds, labelBounds: Bounds, style?: string): mxCell {
    const vertexCoordinates = this.coordinatesTranslator.computeRelativeCoordinates(parent, new mxPoint(bounds.x, bounds.y));
    const mxCell = this.graph.insertVertex(parent, id, value, vertexCoordinates.x, vertexCoordinates.y, bounds.width, bounds.height, style);

    if (labelBounds) {
      // label coordinates are relative in the cell referential coordinates
      const relativeLabelX = labelBounds.x - bounds.x;
      const relativeLabelY = labelBounds.y - bounds.y;
      mxCell.geometry.offset = new mxPoint(relativeLabelX, relativeLabelY);
    }
    return mxCell;
  }
}

export function defaultMxGraphRenderer(graph: mxGraph): MxGraphRenderer {
  return new MxGraphRenderer(graph, new CoordinatesTranslator(graph), new StyleConfigurator(graph));
}
