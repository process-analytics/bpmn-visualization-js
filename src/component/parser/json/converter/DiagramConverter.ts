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

import Shape from '../../../../model/bpmn/internal/shape/Shape';
import Bounds from '../../../../model/bpmn/internal/Bounds';
import type ShapeBpmnElement from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { ShapeBpmnCallActivity, ShapeBpmnSubProcess } from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { Edge, Waypoint } from '../../../../model/bpmn/internal/edge/edge';
import type { Shapes } from '../../../../model/bpmn/internal/BpmnModel';
import type BpmnModel from '../../../../model/bpmn/internal/BpmnModel';
import Label, { Font } from '../../../../model/bpmn/internal/Label';
import { MessageVisibleKind, ShapeBpmnCallActivityKind, ShapeBpmnMarkerKind, ShapeUtil } from '../../../../model/bpmn/internal';
import type { BPMNDiagram, BPMNEdge, BPMNLabel, BPMNLabelStyle, BPMNShape } from '../../../../model/bpmn/json/BPMNDI';
import type { Point } from '../../../../model/bpmn/json/DC';
import type { ConvertedElements } from './utils';
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
      if (this.deserializeShapeAndStoreIfFound(shape, convertedShapes.pools, (bpmnElementId: string) => this.convertedElements.findPoolById(bpmnElementId))) {
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

  private deserializeShape(bpmnShape: BPMNShape, findShapeElement: (bpmnElement: string) => ShapeBpmnElement): Shape | undefined {
    const bpmnElement = findShapeElement(bpmnShape.bpmnElement);
    if (bpmnElement) {
      const bounds = DiagramConverter.deserializeBounds(bpmnShape);

      if (
        (bpmnElement instanceof ShapeBpmnSubProcess ||
          (bpmnElement instanceof ShapeBpmnCallActivity && bpmnElement.callActivityKind === ShapeBpmnCallActivityKind.CALLING_PROCESS)) &&
        !bpmnShape.isExpanded
      ) {
        bpmnElement.markers.push(ShapeBpmnMarkerKind.EXPAND);
      }

      let isHorizontal;
      if (ShapeUtil.isPoolOrLane(bpmnElement.kind)) {
        isHorizontal = bpmnShape.isHorizontal ?? true;
      }

      const bpmnLabel = bpmnShape.BPMNLabel;
      const label = this.deserializeLabel(bpmnLabel, bpmnShape.id);
      const shape = new Shape(bpmnShape.id, bpmnElement, bounds, label, isHorizontal);
      DiagramConverter.setColorExtensionsOnShape(shape, bpmnShape);

      return shape;
    }
  }

  // 'BPMN in Color' extensions with fallback to bpmn.io colors
  private static setColorExtensionsOnShape(shape: Shape, bpmnShape: BPMNShape): void {
    if ('background-color' in bpmnShape) {
      shape.extensions.fillColor = <string>bpmnShape['background-color'];
    } else if ('fill' in bpmnShape) {
      shape.extensions.fillColor = <string>bpmnShape['fill'];
    }
    if ('border-color' in bpmnShape) {
      shape.extensions.strokeColor = <string>bpmnShape['border-color'];
    } else if ('stroke' in bpmnShape) {
      shape.extensions.strokeColor = <string>bpmnShape['stroke'];
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
      .map(bpmnEdge => {
        const flow =
          this.convertedElements.findSequenceFlow(bpmnEdge.bpmnElement) ||
          this.convertedElements.findMessageFlow(bpmnEdge.bpmnElement) ||
          this.convertedElements.findAssociationFlow(bpmnEdge.bpmnElement);

        if (!flow) {
          this.parsingMessageCollector.warning(new EdgeUnknownBpmnElementWarning(bpmnEdge.bpmnElement));
          return;
        }

        const waypoints = this.deserializeWaypoints(bpmnEdge.waypoint);
        const label = this.deserializeLabel(bpmnEdge.BPMNLabel, bpmnEdge.id);
        const messageVisibleKind = bpmnEdge.messageVisibleKind ? (bpmnEdge.messageVisibleKind as unknown as MessageVisibleKind) : MessageVisibleKind.NONE;

        const edge = new Edge(bpmnEdge.id, flow, waypoints, label, messageVisibleKind);
        DiagramConverter.setColorExtensionsOnEdge(edge, bpmnEdge);
        return edge;
      })
      .filter(Boolean);
  }

  // 'BPMN in Color' extensions  with fallback to bpmn.io colors
  private static setColorExtensionsOnEdge(edge: Edge, bpmnEdge: BPMNEdge): void {
    if ('border-color' in bpmnEdge) {
      edge.extensions.strokeColor = <string>bpmnEdge['border-color'];
    } else if ('stroke' in bpmnEdge) {
      edge.extensions.strokeColor = <string>bpmnEdge['stroke'];
    }
  }

  private deserializeWaypoints(waypoints: Point[]): Waypoint[] {
    return ensureIsArray(waypoints).map(waypoint => new Waypoint(waypoint.x, waypoint.y));
  }

  private deserializeLabel(bpmnLabel: string | BPMNLabel, id: string): Label {
    if (bpmnLabel && typeof bpmnLabel === 'object') {
      const font = this.findFont(bpmnLabel.labelStyle, id);
      const bounds = DiagramConverter.deserializeBounds(bpmnLabel);
      const label = new Label(font, bounds);
      if ('color' in bpmnLabel) {
        label.extensions.color = <string>bpmnLabel.color;
        return label;
      }
      if (font || bounds) {
        return label;
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
