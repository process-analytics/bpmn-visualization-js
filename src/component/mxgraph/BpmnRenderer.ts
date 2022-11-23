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

import type { Edge, Waypoint } from '../../model/bpmn/internal/edge/edge';
import { MessageFlow } from '../../model/bpmn/internal/edge/flows';
import type Shape from '../../model/bpmn/internal/shape/Shape';
import type ShapeBpmnElement from '../../model/bpmn/internal/shape/ShapeBpmnElement';
import type Bounds from '../../model/bpmn/internal/Bounds';
import { MessageVisibleKind, ShapeUtil } from '../../model/bpmn/internal';
import CoordinatesTranslator from './renderer/CoordinatesTranslator';
import StyleComputer from './renderer/StyleComputer';
import type { BpmnGraph } from './BpmnGraph';
import type { FitOptions } from '../options';
import type { RenderedModel } from '../registry/bpmn-model-registry';
import type { mxCell } from 'mxgraph';

/**
 * @internal
 */
export class BpmnRenderer {
  constructor(readonly graph: BpmnGraph, readonly coordinatesTranslator: CoordinatesTranslator, readonly styleComputer: StyleComputer) {}

  render(renderedModel: RenderedModel, fitOptions?: FitOptions): void {
    this.insertShapesAndEdges(renderedModel);
    this.graph.customFit(fitOptions);
  }

  private insertShapesAndEdges({ pools, lanes, subprocesses, otherFlowNodes, boundaryEvents, edges }: RenderedModel): void {
    const model = this.graph.getModel();
    model.clear(); // ensure to remove manual changes or already loaded graphs
    model.beginUpdate();
    try {
      this.insertShapes(pools);
      this.insertShapes(lanes);
      this.insertShapes(subprocesses);
      this.insertShapes(otherFlowNodes);
      // last shape as the boundary event parent must be in the model (subprocess or activity)
      this.insertShapes(boundaryEvents);
      // at last as edge source and target must be present in the model prior insertion, otherwise they are not rendered
      this.insertEdges(edges);
    } finally {
      model.endUpdate();
    }
  }

  private insertShapes(shapes: Shape[]): void {
    shapes.forEach(shape => this.insertShape(shape));
  }

  private getParent(bpmnElement: ShapeBpmnElement): mxCell {
    const bpmnElementParent = this.getCell(bpmnElement.parentId);
    return bpmnElementParent ?? this.graph.getDefaultParent();
  }

  private insertShape(shape: Shape): void {
    const bpmnElement = shape.bpmnElement;
    const parent = this.getParent(bpmnElement);
    const bounds = shape.bounds;
    let labelBounds = shape.label?.bounds;
    // pool/lane label bounds are not managed for now (use hard coded values)
    labelBounds = ShapeUtil.isPoolOrLane(bpmnElement.kind) ? undefined : labelBounds;
    const style = this.styleComputer.computeStyle(shape, labelBounds);

    this.insertVertex(parent, bpmnElement.id, bpmnElement.name, bounds, labelBounds, style);
  }

  private insertEdges(edges: Edge[]): void {
    edges.forEach(edge => {
      const bpmnElement = edge.bpmnElement;
      const parent = this.graph.getDefaultParent();
      const source = this.getCell(bpmnElement.sourceRefId);
      const target = this.getCell(bpmnElement.targetRefId);
      const labelBounds = edge.label?.bounds;
      const style = this.styleComputer.computeStyle(edge, labelBounds);
      const mxEdge = this.graph.insertEdge(parent, bpmnElement.id, bpmnElement.name, source, target, style);
      this.insertWaypoints(edge.waypoints, mxEdge);

      if (labelBounds) {
        mxEdge.geometry.width = labelBounds.width;
        mxEdge.geometry.height = labelBounds.height;

        const edgeCenterCoordinate = this.coordinatesTranslator.computeEdgeCenter(mxEdge);
        if (edgeCenterCoordinate) {
          mxEdge.geometry.relative = false;

          const labelBoundsRelativeCoordinateFromParent = this.coordinatesTranslator.computeRelativeCoordinates(mxEdge.parent, new mxgraph.mxPoint(labelBounds.x, labelBounds.y));
          const relativeLabelX = labelBoundsRelativeCoordinateFromParent.x + labelBounds.width / 2 - edgeCenterCoordinate.x;
          const relativeLabelY = labelBoundsRelativeCoordinateFromParent.y - edgeCenterCoordinate.y;
          mxEdge.geometry.offset = new mxgraph.mxPoint(relativeLabelX, relativeLabelY);
        }
      }

      this.insertMessageFlowIconIfNeeded(edge, mxEdge);
    });
  }

  private insertMessageFlowIconIfNeeded(edge: Edge, mxEdge: mxCell): void {
    if (edge.bpmnElement instanceof MessageFlow && edge.messageVisibleKind !== MessageVisibleKind.NONE) {
      const cell = this.graph.insertVertex(mxEdge, messageFowIconId(mxEdge.id), undefined, 0, 0, 20, 14, this.styleComputer.computeMessageFlowIconStyle(edge));
      cell.geometry.relative = true;
      cell.geometry.offset = new mxgraph.mxPoint(-10, -7);
    }
  }

  private insertWaypoints(waypoints: Waypoint[], mxEdge: mxCell): void {
    if (waypoints) {
      mxEdge.geometry.points = waypoints.map(waypoint => this.coordinatesTranslator.computeRelativeCoordinates(mxEdge.parent, new mxgraph.mxPoint(waypoint.x, waypoint.y)));
    }
  }

  private getCell(id: string): mxCell {
    return this.graph.getModel().getCell(id);
  }

  private insertVertex(parent: mxCell, id: string | null, value: string, bounds: Bounds, labelBounds: Bounds, style?: string): mxCell {
    const vertexCoordinates = this.coordinatesTranslator.computeRelativeCoordinates(parent, new mxgraph.mxPoint(bounds.x, bounds.y));
    const cell = this.graph.insertVertex(parent, id, value, vertexCoordinates.x, vertexCoordinates.y, bounds.width, bounds.height, style);

    if (labelBounds) {
      // label coordinates are relative in the cell referential coordinates
      const relativeLabelX = labelBounds.x - bounds.x;
      const relativeLabelY = labelBounds.y - bounds.y;
      cell.geometry.offset = new mxgraph.mxPoint(relativeLabelX, relativeLabelY);
    }
    return cell;
  }
}

/**
 * @internal
 */
export function newBpmnRenderer(graph: BpmnGraph): BpmnRenderer {
  return new BpmnRenderer(graph, new CoordinatesTranslator(graph), new StyleComputer());
}

/**
 * @internal
 */
export function messageFowIconId(messageFlowId: string): string {
  return `messageFlowIcon_of_${messageFlowId}`;
}
