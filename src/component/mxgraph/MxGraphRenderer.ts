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
import Shape from '../../model/bpmn/shape/Shape';
import Edge from '../../model/bpmn/edge/Edge';
import BpmnModel from '../../model/bpmn/BpmnModel';
import ShapeBpmnElement from '../../model/bpmn/shape/ShapeBpmnElement';
import Waypoint from '../../model/bpmn/edge/Waypoint';
import Bounds from '../../model/bpmn/Bounds';
import ShapeUtil from '../../model/bpmn/shape/ShapeUtil';
import CoordinatesTranslator from './renderer/CoordinatesTranslator';
import StyleConfigurator from './config/StyleConfigurator';
import { MessageFlow } from '../../model/bpmn/edge/Flow';
import { MessageVisibleKind } from '../../model/bpmn/edge/MessageVisibleKind';
import Logger from '../Logger';
import { RendererOptions } from '../BpmnVisualizationOptions';

export default class MxGraphRenderer {
  private logger: Logger = new Logger('Renderer');
  private config: RendererOptions;

  constructor(readonly graph: mxGraph, readonly coordinatesTranslator: CoordinatesTranslator, readonly styleConfigurator: StyleConfigurator) {}

  configure(config: RendererOptions): this {
    this.config = config;
    this.logger.info(`Configured Renderer: ${JSON.stringify(this.config, undefined, 2)}`);
    return this;
  }

  public render(bpmnModel: BpmnModel): void {
    const model = this.graph.getModel();
    model.clear(); // ensure to remove manual changes or already loaded graphs
    model.beginUpdate();
    try {
      this.insertShapes(bpmnModel.pools);
      this.insertShapes(bpmnModel.lanes);
      this.insertShapes(bpmnModel.flowNodes.filter(shape => !ShapeUtil.isBoundaryEvent(shape.bpmnElement?.kind)));
      this.insertShapes(bpmnModel.flowNodes.filter(shape => ShapeUtil.isBoundaryEvent(shape.bpmnElement?.kind)));
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

  private getParent(bpmnElement: ShapeBpmnElement): mxCell {
    const bpmnElementParent = this.getCell(bpmnElement.parentId);
    if (bpmnElementParent) {
      return bpmnElementParent;
    }

    if (!ShapeUtil.isBoundaryEvent(bpmnElement.kind)) {
      return this.graph.getDefaultParent();
    }
  }

  private computeStyle(bpmnCell: Shape | Edge, labelBounds: Bounds): string {
    return this.styleConfigurator.computeStyle(bpmnCell, labelBounds, this.config?.label);
  }

  private insertShape(shape: Shape): void {
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
      labelBounds = ShapeUtil.isPoolOrLane(bpmnElement.kind) ? undefined : labelBounds;
      const style = this.computeStyle(shape, labelBounds);

      this.insertVertex(parent, bpmnElement.id, bpmnElement.name, bounds, labelBounds, style);
    }
  }

  private insertEdges(edges: Edge[]): void {
    edges.forEach(edge => {
      const bpmnElement = edge.bpmnElement;
      if (bpmnElement) {
        const parent = this.graph.getDefaultParent();
        const source = this.getCell(bpmnElement.sourceRefId);
        const target = this.getCell(bpmnElement.targetRefId);
        const labelBounds = edge.label?.bounds;
        const style = this.computeStyle(edge, labelBounds);
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

  private insertMessageFlowIconIfNeeded(edge: Edge, mxEdge: mxCell): void {
    if (edge.bpmnElement instanceof MessageFlow && edge.messageVisibleKind !== MessageVisibleKind.NONE) {
      const mxCell = this.graph.insertVertex(mxEdge, `messageFlowIcon_of_${mxEdge.id}`, undefined, 0, 0, 20, 14, this.styleConfigurator.computeMessageFlowIconStyle(edge));
      mxCell.geometry.relative = true;
      mxCell.geometry.offset = new mxPoint(-10, -7);
    }
  }

  private insertWaypoints(waypoints: Waypoint[], mxEdge: mxCell): void {
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
