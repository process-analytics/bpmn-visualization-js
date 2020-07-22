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
import { JsonConverter } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import Shape from '../../../../model/bpmn/shape/Shape';
import Bounds from '../../../../model/bpmn/Bounds';
import ShapeBpmnElement from '../../../../model/bpmn/shape/ShapeBpmnElement';
import Edge from '../../../../model/bpmn/edge/Edge';
import BpmnModel, { Shapes } from '../../../../model/bpmn/BpmnModel';
import { findAssociationFlow, findFlowNodeBpmnElement, findLaneBpmnElement, findProcessBpmnElement, findSequenceFlow } from './ProcessConverter';
import { findMessageFlow, findProcessRefParticipant, findProcessRefParticipantByProcessRef } from './CollaborationConverter';
import Waypoint from '../../../../model/bpmn/edge/Waypoint';
import Label, { Font } from '../../../../model/bpmn/Label';
import { MessageVisibleKind } from '../../../../model/bpmn/edge/MessageVisibleKind';
import { BPMNDiagram, BPMNEdge, BPMNLabel, BPMNLabelStyle, BPMNShape } from '../../xml/bpmn-json-model/BPMNDI';
import { Point } from '../../xml/bpmn-json-model/DC';

function findProcessElement(participantId: string): ShapeBpmnElement {
  const participant = findProcessRefParticipant(participantId);
  if (participant) {
    const originalProcessBpmnElement = findProcessBpmnElement(participant.processRef);
    const name = participant.name || originalProcessBpmnElement.name;
    return new ShapeBpmnElement(participant.id, name, originalProcessBpmnElement.kind, originalProcessBpmnElement.parentId);
  }
}

@JsonConverter
export default class DiagramConverter extends AbstractConverter<BpmnModel> {
  private convertedFonts: Map<string, Font> = new Map();

  deserialize(bpmnDiagrams: Array<BPMNDiagram> | BPMNDiagram): BpmnModel {
    const flowNodes: Shape[] = [];
    const lanes: Shape[] = [];
    const pools: Shape[] = [];
    const edges: Edge[] = [];

    ensureIsArray(bpmnDiagrams).map(bpmnDiagram => {
      try {
        // Need to be done before deserialization of Shape and Edge, to link the converted fonts to them
        this.deserializeFonts(bpmnDiagram.BPMNLabelStyle);

        const plane = bpmnDiagram.BPMNPlane;
        const convertedEdges = this.deserializeEdges(plane.BPMNEdge);
        const convertedShapes = this.deserializeShapes(plane.BPMNShape);

        flowNodes.push(...convertedShapes.flowNodes);
        lanes.push(...convertedShapes.lanes);
        pools.push(...convertedShapes.pools);
        edges.push(...convertedEdges);
      } catch (e) {
        // TODO error management
        console.error(e as Error);
      }
    });
    return { flowNodes, lanes, pools, edges };
  }

  private deserializeFonts(bpmnLabelStyle: Array<BPMNLabelStyle> | BPMNLabelStyle): void {
    this.convertedFonts = new Map();

    ensureIsArray(bpmnLabelStyle).forEach(labelStyle => {
      const font = labelStyle.Font;
      if (font) {
        this.convertedFonts.set(labelStyle.id, new Font(font.name, font.size, font.isBold, font.isItalic, font.isUnderline, font.isStrikeThrough));
      }
    });
  }

  private deserializeShapes(shapes: Array<BPMNShape> | BPMNShape): Shapes {
    // TODO find a way to avoid shape management duplication
    // common pattern:
    //    deserialize  shape base on custom function to find a bpmn element
    //    if found push in an array and process next element
    const convertedShapes: Shapes = { flowNodes: [], lanes: [], pools: [] };

    shapes = ensureIsArray(shapes);

    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      const flowNode = this.deserializeShape(shape, (bpmnElement: string) => findFlowNodeBpmnElement(bpmnElement));
      if (flowNode) {
        convertedShapes.flowNodes.push(flowNode);
        continue;
      }

      const lane = this.deserializeShape(shape, (bpmnElement: string) => findLaneBpmnElement(bpmnElement));
      if (lane) {
        convertedShapes.lanes.push(lane);
        continue;
      }

      const pool = this.deserializeShape(shape, (bpmnElement: string) => findProcessElement(bpmnElement));
      if (pool) {
        convertedShapes.pools.push(pool);
        continue;
      }

      // TODO error management
      console.warn('Shape json deserialization: unable to find bpmn element with id %s', shape.bpmnElement);
    }

    return convertedShapes;
  }

  private deserializeShape(shape: BPMNShape, findShapeElement: (bpmnElement: string) => ShapeBpmnElement): Shape | undefined {
    const bpmnElement = findShapeElement(shape.bpmnElement);
    if (bpmnElement) {
      const bounds = this.deserializeBounds(shape);

      if (bpmnElement.parentId) {
        const participant = findProcessRefParticipantByProcessRef(bpmnElement.parentId);
        if (participant) {
          bpmnElement.parentId = participant.id;
        }
      }

      const label = this.deserializeLabel(shape.BPMNLabel, shape.id);
      return new Shape(shape.id, bpmnElement, bounds, label, shape.isExpanded);
    }
  }

  private deserializeBounds(boundedElement: BPMNShape | BPMNLabel): Bounds {
    const bounds = boundedElement.Bounds;
    if (bounds) {
      return this.jsonConvert.deserializeObject(bounds, Bounds);
    }
  }

  private deserializeEdges(edges: BPMNEdge): Edge[] {
    return ensureIsArray(edges).map(edge => {
      const flow = findSequenceFlow(edge.bpmnElement) || findMessageFlow(edge.bpmnElement) || findAssociationFlow(edge.bpmnElement);
      const waypoints = this.deserializeWaypoints(edge.waypoint);
      const label = this.deserializeLabel(edge.BPMNLabel, edge.id);
      const messageVisibleKind = edge.messageVisibleKind ? edge.messageVisibleKind : MessageVisibleKind.NONE;
      return new Edge(edge.id, flow, waypoints, label, messageVisibleKind);
    });
  }

  private deserializeWaypoints(waypoint: Point[]): Waypoint[] {
    if (waypoint) {
      return this.jsonConvert.deserializeArray(ensureIsArray(waypoint), Waypoint);
    }
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
        // TODO error management
        console.warn('Unable to assign font from style %s to shape/edge %s', labelStyle, id);
      }
    }

    return font;
  }
}
