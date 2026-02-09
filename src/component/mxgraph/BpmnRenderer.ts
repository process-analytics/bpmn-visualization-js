/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { BpmnGraph } from './BpmnGraph';
import type Bounds from '../../model/bpmn/internal/Bounds';
import type { Edge, Waypoint } from '../../model/bpmn/internal/edge/edge';
import type Shape from '../../model/bpmn/internal/shape/Shape';
import type ShapeBpmnElement from '../../model/bpmn/internal/shape/ShapeBpmnElement';
import type { RendererOptions } from '../options';
import type { RenderedModel } from '../registry/bpmn-model-registry';
import type { mxCell } from 'mxgraph';

import { MessageVisibleKind, ShapeUtil } from '../../model/bpmn/internal';
import { MessageFlow } from '../../model/bpmn/internal/edge/flows';

import { mxPoint } from './initializer';
import CoordinatesTranslator from './renderer/CoordinatesTranslator';
import StyleComputer from './renderer/StyleComputer';

/**
 * @internal
 */
export class BpmnRenderer {
  private readonly ignoreBpmnActivityLabelBounds: boolean;
  private readonly ignoreBpmnTaskLabelBounds: boolean;

  constructor(
    readonly graph: BpmnGraph,
    readonly coordinatesTranslator: CoordinatesTranslator,
    readonly styleComputer: StyleComputer,
    rendererOptions: RendererOptions,
  ) {
    this.ignoreBpmnActivityLabelBounds = rendererOptions?.ignoreBpmnActivityLabelBounds ?? false;
    this.ignoreBpmnTaskLabelBounds = rendererOptions?.ignoreBpmnTaskLabelBounds ?? false;
  }

  render(renderedModel: RenderedModel): void {
    this.insertShapesAndEdges(renderedModel);
  }

  private insertShapesAndEdges({ pools, lanes, subprocesses, otherFlowNodes, boundaryEvents, edges }: RenderedModel): void {
    this.graph.batchUpdate(() => {
      this.graph.getModel().clear(); // ensure to remove manual changes or already loaded graphs
      this.insertShapes(pools);
      this.insertShapes(lanes);
      this.insertShapes(subprocesses);
      this.insertShapes(otherFlowNodes);
      // last shape as the boundary event parent must be in the model (subprocess or activity)
      this.insertShapes(boundaryEvents);
      // at last as edge source and target must be present in the model prior insertion, otherwise they are not rendered
      this.insertEdges(edges);
    });
  }

  private insertShapes(shapes: Shape[]): void {
    for (const shape of shapes) this.insertShape(shape);
  }

  private getParent(bpmnElement: ShapeBpmnElement): mxCell {
    const bpmnElementParent = this.getCell(bpmnElement.parentId);
    return bpmnElementParent ?? this.graph.getDefaultParent();
  }

  private insertShape(shape: Shape): void {
    const bpmnElement = shape.bpmnElement;
    const parent = this.getParent(bpmnElement);
    const bounds = shape.bounds;
    const labelBounds = isLabelBoundsIgnored(shape, this.ignoreBpmnActivityLabelBounds, this.ignoreBpmnTaskLabelBounds) ? undefined : shape.label?.bounds;
    const style = this.styleComputer.computeStyle(shape, labelBounds);

    this.insertVertex(parent, bpmnElement.id, bpmnElement.name, bounds, labelBounds, style);
  }

  private insertEdges(edges: Edge[]): void {
    for (const internalEdge of edges) {
      const bpmnElement = internalEdge.bpmnElement;
      const parent = this.graph.getDefaultParent();
      const source = this.getCell(bpmnElement.sourceReferenceId);
      const target = this.getCell(bpmnElement.targetReferenceId);
      const labelBounds = internalEdge.label?.bounds;
      const style = this.styleComputer.computeStyle(internalEdge, labelBounds);
      const edge = this.graph.insertEdge(parent, bpmnElement.id, bpmnElement.name, source, target, style);
      this.insertWaypoints(internalEdge.waypoints, edge);

      if (labelBounds) {
        edge.geometry.width = labelBounds.width;
        edge.geometry.height = labelBounds.height;

        const edgeCenterCoordinate = this.coordinatesTranslator.computeEdgeCenter(edge);
        edge.geometry.relative = false;

        const labelBoundsRelativeCoordinateFromParent = this.coordinatesTranslator.computeRelativeCoordinates(edge.parent, new mxPoint(labelBounds.x, labelBounds.y));
        const relativeLabelX = labelBoundsRelativeCoordinateFromParent.x + labelBounds.width / 2 - edgeCenterCoordinate.x;
        const relativeLabelY = labelBoundsRelativeCoordinateFromParent.y - edgeCenterCoordinate.y;
        edge.geometry.offset = new mxPoint(relativeLabelX, relativeLabelY);
      }

      this.insertMessageFlowIconIfNeeded(internalEdge, edge);
    }
  }

  private insertMessageFlowIconIfNeeded(internalEdge: Edge, edge: mxCell): void {
    if (internalEdge.bpmnElement instanceof MessageFlow && internalEdge.messageVisibleKind !== MessageVisibleKind.NONE) {
      const cell = this.graph.insertVertex(edge, messageFlowIconId(edge.id), undefined, 0, 0, 20, 14, this.styleComputer.computeMessageFlowIconStyle(internalEdge));
      cell.geometry.relative = true;
      cell.geometry.offset = new mxPoint(-10, -7);
    }
  }

  private insertWaypoints(waypoints: Waypoint[], edge: mxCell): void {
    if (waypoints) {
      edge.geometry.points = waypoints.map(waypoint => this.coordinatesTranslator.computeRelativeCoordinates(edge.parent, new mxPoint(waypoint.x, waypoint.y)));
    }
  }

  private getCell(id: string): mxCell {
    return this.graph.getModel().getCell(id);
  }

  private insertVertex(parent: mxCell, id: string | null, value: string, bounds: Bounds, labelBounds: Bounds, style?: string): mxCell {
    const vertexCoordinates = this.coordinatesTranslator.computeRelativeCoordinates(parent, new mxPoint(bounds.x, bounds.y));
    const cell = this.graph.insertVertex(parent, id, value, vertexCoordinates.x, vertexCoordinates.y, bounds.width, bounds.height, style);

    if (labelBounds) {
      // label coordinates are relative in the cell referential coordinates
      const relativeLabelX = labelBounds.x - bounds.x;
      const relativeLabelY = labelBounds.y - bounds.y;
      cell.geometry.offset = new mxPoint(relativeLabelX, relativeLabelY);
    }
    return cell;
  }
}

/**
 * @internal
 */
export function isLabelBoundsIgnored(shape: Shape, ignoreBpmnActivityLabelBounds: boolean, ignoreBpmnTaskLabelBounds: boolean): boolean {
  const kind = shape.bpmnElement.kind;
  return (
    ShapeUtil.isPoolOrLane(kind) || // pool/lane label bounds are not managed for now (use hard coded values)
    (ignoreBpmnActivityLabelBounds && ShapeUtil.isActivity(kind)) ||
    (ignoreBpmnTaskLabelBounds && ShapeUtil.isTask(kind))
  );
}

/**
 * @internal
 */
export function newBpmnRenderer(graph: BpmnGraph, options: RendererOptions): BpmnRenderer {
  return new BpmnRenderer(graph, new CoordinatesTranslator(graph), new StyleComputer(options), options);
}

/**
 * @internal
 */
export function messageFlowIconId(messageFlowId: string): string {
  return `messageFlowIcon_of_${messageFlowId}`;
}
