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
import type ShapeBpmnElement from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { ShapeBpmnCallActivity, ShapeBpmnSubProcess } from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { Edge, Waypoint } from '../../../../model/bpmn/internal/edge/edge';
import type { Shapes } from '../../../../model/bpmn/internal/BpmnModel';
import type BpmnModel from '../../../../model/bpmn/internal/BpmnModel';
import Label, { Font } from '../../../../model/bpmn/internal/Label';
import { MessageVisibleKind } from '../../../../model/bpmn/internal/edge/kinds';
import type { BPMNDiagram, BPMNEdge, BPMNLabel, BPMNLabelStyle, BPMNShape } from '../../../../model/bpmn/json/BPMNDI';
import type { Point } from '../../../../model/bpmn/json/DC';
import type { ConvertedElements } from './utils';
import { ShapeBpmnCallActivityKind, ShapeBpmnMarkerKind, ShapeUtil } from '../../../../model/bpmn/internal';
import { ensureIsArray } from '../../../helpers/array-utils';
import type { ParsingMessageCollector } from '../../parsing-messages';
import { EdgeUnknownBpmnElementWarning, LabelStyleMissingFontWarning, ShapeUnknownBpmnElementWarning } from '../warnings';

/**
 * @internal
 */
export default class DiagramConverter {
  constructor(private convertedElements: ConvertedElements, private parsingMessageCollector: ParsingMessageCollector) {}

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

    ensureIsArray(bpmnLabelStyle).forEach(labelStyle =>
      ensureIsArray(labelStyle.Font).forEach(font =>
        this.convertedFonts.set(labelStyle.id, new Font(font.name, font.size, font.isBold, font.isItalic, font.isUnderline, font.isStrikeThrough)),
      ),
    );
  }

  private deserializeShapes(shapes: Array<BPMNShape> | BPMNShape): Shapes {
    const convertedShapes: Shapes = { flowNodes: [], lanes: [], pools: [] };

    ensureIsArray(shapes).forEach(shape => {
      // flow nodes
      if (this.deserializeShapeAndStoreIfFound(shape, convertedShapes.flowNodes, (bpmnElementId: string) => this.convertedElements.findFlowNode(bpmnElementId))) {
        return;
      }
      // lane
      if (this.deserializeShapeAndStoreIfFound(shape, convertedShapes.lanes, (bpmnElementId: string) => this.convertedElements.findLane(bpmnElementId))) {
        return;
      }
      // pool
      if (this.deserializeShapeAndStoreIfFound(shape, convertedShapes.pools, (bpmnElementId: string) => this.convertedElements.findProcess(bpmnElementId))) {
        return;
      }
      // not found
      this.parsingMessageCollector.warning(new ShapeUnknownBpmnElementWarning(shape.bpmnElement));
    });

    return convertedShapes;
  }

  private deserializeShapeAndStoreIfFound(shape: BPMNShape, storage: Array<Shape>, findShapeElement: (bpmnElement: string) => ShapeBpmnElement): boolean {
    const element = this.deserializeShape(shape, findShapeElement);
    if (element) {
      storage.push(element);
      return true;
    }
    return false;
  }

  private deserializeShape(shape: BPMNShape, findShapeElement: (bpmnElement: string) => ShapeBpmnElement): Shape | undefined {
    const bpmnElement = findShapeElement(shape.bpmnElement);
    if (bpmnElement) {
      const bounds = DiagramConverter.deserializeBounds(shape);

      if (bpmnElement.parentId) {
        const participant = this.convertedElements.findParticipantByProcessRef(bpmnElement.parentId);
        if (participant) {
          bpmnElement.parentId = participant.id;
        }
      }

      if (
        (bpmnElement instanceof ShapeBpmnSubProcess ||
          (bpmnElement instanceof ShapeBpmnCallActivity && bpmnElement.callActivityKind === ShapeBpmnCallActivityKind.CALLING_PROCESS)) &&
        !shape.isExpanded
      ) {
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

  private static deserializeBounds(boundedElement: BPMNShape | BPMNLabel): Bounds {
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
          this.parsingMessageCollector.warning(new EdgeUnknownBpmnElementWarning(edge.bpmnElement));
          return;
        }

        const waypoints = this.deserializeWaypoints(edge.waypoint);
        const label = this.deserializeLabel(edge.BPMNLabel, edge.id);
        const messageVisibleKind = edge.messageVisibleKind ? (edge.messageVisibleKind as unknown as MessageVisibleKind) : MessageVisibleKind.NONE;

        return new Edge(edge.id, flow, waypoints, label, messageVisibleKind);
      })
      .filter(Boolean);
  }

  private deserializeWaypoints(waypoints: Point[]): Waypoint[] {
    return ensureIsArray(waypoints).map(waypoint => new Waypoint(waypoint.x, waypoint.y));
  }

  private deserializeLabel(bpmnLabel: string | BPMNLabel, id: string): Label {
    if (bpmnLabel && typeof bpmnLabel === 'object') {
      const font = this.findFont(bpmnLabel.labelStyle, id);
      const bounds = DiagramConverter.deserializeBounds(bpmnLabel);

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
        this.parsingMessageCollector.warning(new LabelStyleMissingFontWarning(id, labelStyle));
      }
    }

    return font;
  }
}
