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

import Shape from '../../../../model/bpmn/internal/shape/Shape';
import Bounds from '../../../../model/bpmn/internal/Bounds';
import ShapeBpmnElement, { ShapeBpmnCallActivity, ShapeBpmnSubProcess } from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import Edge from '../../../../model/bpmn/internal/edge/Edge';
import BpmnModel, { Shapes } from '../../../../model/bpmn/internal/BpmnModel';
import Waypoint from '../../../../model/bpmn/internal/edge/Waypoint';
import Label, { Font } from '../../../../model/bpmn/internal/Label';
import { MessageVisibleKind } from '../../../../model/bpmn/internal/edge/MessageVisibleKind';
import { BPMNDiagram, BPMNEdge, BPMNLabel, BPMNLabelStyle, BPMNShape } from '../../../../model/bpmn/json/BPMNDI';
import { Point } from '../../../../model/bpmn/json/DC';
import { ConvertedElements } from './utils';
import { ShapeBpmnMarkerKind } from '../../../../model/bpmn/internal/shape';
import ShapeUtil from '../../../../model/bpmn/internal/shape/ShapeUtil';
import { ensureIsArray } from '../../../helpers/array-utils';

/**
 * @internal
 */
export default class DiagramConverter {
  constructor(readonly convertedElements: ConvertedElements) {}

  private convertedFonts: Map<string, Font> = new Map();

  deserialize(bpmnDiagrams: Array<BPMNDiagram> | BPMNDiagram): BpmnModel {
    const flowNodes: Shape[] = [];
    const lanes: Shape[] = [];
    const pools: Shape[] = [];
    const edges: Edge[] = [];

    const bpmnDiagram = ensureIsArray(bpmnDiagrams)[0];
    if (bpmnDiagram) {
      // Need to be done before deserialization of Shape and Edge, to link the converted fonts to them
      this.deserializeFonts(bpmnDiagram.BPMNLabelStyle);

      const plane = bpmnDiagram.BPMNPlane;
      const convertedEdges = this.deserializeEdges(plane.BPMNEdge);
      const convertedShapes = this.deserializeShapes(plane.BPMNShape);

      flowNodes.push(...convertedShapes.flowNodes);
      lanes.push(...convertedShapes.lanes);
      pools.push(...convertedShapes.pools);
      edges.push(...convertedEdges);
    }
    return { flowNodes, lanes, pools, edges };
  }

  private deserializeFonts(bpmnLabelStyle: Array<BPMNLabelStyle> | BPMNLabelStyle): void {
    this.convertedFonts = new Map();

    ensureIsArray(bpmnLabelStyle).forEach(labelStyle => {
      ensureIsArray(labelStyle.Font).forEach(font => {
        this.convertedFonts.set(labelStyle.id, new Font(font.name, font.size, font.isBold, font.isItalic, font.isUnderline, font.isStrikeThrough));
      });
    });
  }

  private deserializeShapes(shapes: Array<BPMNShape> | BPMNShape): Shapes {
    // TODO find a way to avoid shape management duplication
    // common pattern:
    //    deserialize  shape base on custom function to find a bpmn element
    //    if found push in an array and process next element
    const convertedShapes: Shapes = { flowNodes: [], lanes: [], pools: [] };

    ensureIsArray(shapes).forEach(shape => {
      const flowNode = this.deserializeShape(shape, (bpmnElement: string) => this.convertedElements.findFlowNode(bpmnElement));
      if (flowNode) {
        convertedShapes.flowNodes.push(flowNode);
        return;
      }

      const lane = this.deserializeShape(shape, (bpmnElement: string) => this.convertedElements.findLane(bpmnElement));
      if (lane) {
        convertedShapes.lanes.push(lane);
        return;
      }

      const pool = this.deserializeShape(shape, (bpmnElement: string) => this.convertedElements.findProcess(bpmnElement));
      if (pool) {
        convertedShapes.pools.push(pool);
        return;
      }

      // TODO decide how to manage elements not found during parsing as part of #35
      console.warn('Shape json deserialization: unable to find bpmn element with id %s', shape.bpmnElement);
    });

    return convertedShapes;
  }

  private deserializeShape(shape: BPMNShape, findShapeElement: (bpmnElement: string) => ShapeBpmnElement): Shape | undefined {
    const bpmnElement = findShapeElement(shape.bpmnElement);
    if (bpmnElement) {
      const bounds = this.deserializeBounds(shape);

      if (bpmnElement.parentId) {
        const participant = this.convertedElements.findParticipantByProcessRef(bpmnElement.parentId);
        if (participant) {
          bpmnElement.parentId = participant.id;
        }
      }

      if ((bpmnElement instanceof ShapeBpmnSubProcess || bpmnElement instanceof ShapeBpmnCallActivity) && !shape.isExpanded) {
        bpmnElement.markers.push(ShapeBpmnMarkerKind.EXPAND);
      }

      let isHorizontal;
      if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
        isHorizontal = shape.isHorizontal !== undefined ? shape.isHorizontal : true;
      }

      const label = this.deserializeLabel(shape.BPMNLabel, shape.id);
      return new Shape(shape.id, bpmnElement, bounds, label, isHorizontal);
    }
  }

  private deserializeBounds(boundedElement: BPMNShape | BPMNLabel): Bounds {
    const bounds = boundedElement.Bounds;
    if (bounds) {
      return new Bounds(bounds.x, bounds.y, bounds.width, bounds.height);
    }
  }

  private deserializeEdges(edges: BPMNEdge | BPMNEdge[]): Edge[] {
    return ensureIsArray(edges)
      .map(edge => {
        const flow =
          this.convertedElements.findSequenceFlow(edge.bpmnElement) ||
          this.convertedElements.findMessageFlow(edge.bpmnElement) ||
          this.convertedElements.findAssociationFlow(edge.bpmnElement);

        if (!flow) {
          // TODO decide how to manage elements not found during parsing as part of #35
          console.warn('Edge json deserialization: unable to find bpmn element with id %s', edge.bpmnElement);
          return;
        }

        const waypoints = this.deserializeWaypoints(edge.waypoint);
        const label = this.deserializeLabel(edge.BPMNLabel, edge.id);

        // TODO Remove messageVisibleKind conversion type when we merge/simplify internal model with BPMN json model
        const messageVisibleKind = edge.messageVisibleKind ? (edge.messageVisibleKind as unknown as MessageVisibleKind) : MessageVisibleKind.NONE;

        return new Edge(edge.id, flow, waypoints, label, messageVisibleKind);
      })
      .filter(edge => edge);
  }

  private deserializeWaypoints(waypoints: Point[]): Waypoint[] {
    return ensureIsArray(waypoints).map(waypoint => new Waypoint(waypoint.x, waypoint.y));
  }

  private deserializeLabel(bpmnLabel: string | BPMNLabel, id: string): Label {
    if (bpmnLabel && typeof bpmnLabel === 'object') {
      const font = this.findFont(bpmnLabel.labelStyle, id);
      const bounds = this.deserializeBounds(bpmnLabel);

      if (font || bounds) {
        return new Label(font, bounds);
      }
    }
  }

  private findFont(labelStyle: string, id: string): Font {
    let font;
    if (labelStyle) {
      font = this.convertedFonts.get(labelStyle);

      if (!font) {
        // TODO decide how to manage elements not found during parsing as part of #35
        console.warn('Unable to assign font from style %s to shape/edge %s', labelStyle, id);
      }
    }

    return font;
  }
}
