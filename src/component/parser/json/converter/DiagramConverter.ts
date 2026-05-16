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

import type { ConvertedElements } from './utils';
import type { Shapes } from '../../../../model/bpmn/internal/BpmnModel';
import type BpmnModel from '../../../../model/bpmn/internal/BpmnModel';
import type ShapeBpmnElement from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import type { BPMNDiagram, BPMNEdge, BPMNLabel, BPMNLabelStyle, BPMNShape } from '../../../../model/bpmn/json/bpmndi';
import type { Point } from '../../../../model/bpmn/json/dc';
import type { ParsingExtensionPoint } from '../../../extension/extension-points';
import type { ParsingMessageCollector } from '../../parsing-messages';

import { MessageVisibleKind, ShapeBpmnCallActivityKind, ShapeBpmnMarkerKind, ShapeUtil } from '../../../../model/bpmn/internal';
import Bounds from '../../../../model/bpmn/internal/Bounds';
import { Edge, Waypoint } from '../../../../model/bpmn/internal/edge/edge';
import Label, { Font } from '../../../../model/bpmn/internal/Label';
import Shape from '../../../../model/bpmn/internal/shape/Shape';
import { ShapeBpmnCallActivity, ShapeBpmnSubProcess } from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { bpmnInColorParsingExtension } from '../../../extension/bpmn-in-color/parsing-extension';
import { ensureIsArray } from '../../../helpers/array-utils';
import { EdgeUnknownBpmnElementWarning, LabelStyleMissingFontWarning, ShapeUnknownBpmnElementWarning } from '../warnings';

/**
 * @internal
 */
export default class DiagramConverter {
  constructor(
    private readonly convertedElements: ConvertedElements,
    private readonly parsingMessageCollector: ParsingMessageCollector,
  ) {}

  // The extension list is hardcoded on purpose: the extension mechanism is currently introduced internally
  // only; external injection (a public `bpmnExtensions` option) is deferred. See ADR 001 in
  // docs/contributors/adr/, section "Refactoring scope vs. follow-up work".
  private readonly parsingExtensions: ParsingExtensionPoint[] = [bpmnInColorParsingExtension];
  private readonly convertedFonts = new Map<string, Font>();

  deserialize(bpmnDiagrams: BPMNDiagram[] | BPMNDiagram): BpmnModel {
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

  private deserializeFonts(bpmnLabelStyle: BPMNLabelStyle[] | BPMNLabelStyle): void {
    for (const labelStyle of ensureIsArray(bpmnLabelStyle))
      for (const font of ensureIsArray(labelStyle.Font))
        this.convertedFonts.set(labelStyle.id, new Font(font.name, font.size, font.isBold, font.isItalic, font.isUnderline, font.isStrikeThrough));
  }

  private deserializeShapes(shapes: BPMNShape[] | BPMNShape): Shapes {
    const convertedShapes: Shapes = { flowNodes: [], lanes: [], pools: [] };

    for (const shape of ensureIsArray(shapes)) {
      // flow nodes
      if (this.deserializeShapeAndStoreIfFound(shape, convertedShapes.flowNodes, (bpmnElementId: string) => this.convertedElements.findFlowNode(bpmnElementId))) {
        continue;
      }
      // lane
      if (this.deserializeShapeAndStoreIfFound(shape, convertedShapes.lanes, (bpmnElementId: string) => this.convertedElements.findLane(bpmnElementId))) {
        continue;
      }
      // pool
      if (this.deserializeShapeAndStoreIfFound(shape, convertedShapes.pools, (bpmnElementId: string) => this.convertedElements.findPoolById(bpmnElementId))) {
        continue;
      }
      // not found
      this.parsingMessageCollector.warning(new ShapeUnknownBpmnElementWarning(shape.bpmnElement));
    }

    return convertedShapes;
  }

  private deserializeShapeAndStoreIfFound(shape: BPMNShape, storage: Shape[], findShapeElement: (bpmnElement: string) => ShapeBpmnElement): boolean {
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
      const bounds = deserializeBounds(bpmnShape);

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
      for (const extension of this.parsingExtensions) extension.onShapeDeserialized?.(shape, bpmnShape);

      return shape;
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
        for (const extension of this.parsingExtensions) extension.onEdgeDeserialized?.(edge, bpmnEdge);
        return edge;
      })
      .filter(Boolean);
  }

  private deserializeWaypoints(waypoints: Point[]): Waypoint[] {
    return ensureIsArray(waypoints).map(waypoint => new Waypoint(waypoint.x, waypoint.y));
  }

  private deserializeLabel(bpmnLabel: string | BPMNLabel, id: string): Label {
    if (bpmnLabel && typeof bpmnLabel === 'object') {
      const font = this.findFont(bpmnLabel.labelStyle, id);
      const bounds = deserializeBounds(bpmnLabel);
      const hasExtensionData = this.parsingExtensions.some(extension => extension.hasLabelExtensionData?.(bpmnLabel));
      if (font || bounds || hasExtensionData) {
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

function deserializeBounds(boundedElement: BPMNShape | BPMNLabel): Bounds {
  const bounds = boundedElement.Bounds;
  if (bounds) {
    return new Bounds(bounds.x, bounds.y, bounds.width, bounds.height);
  }
}
