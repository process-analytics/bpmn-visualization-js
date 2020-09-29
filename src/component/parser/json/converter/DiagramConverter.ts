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
import InternalBPMNShape from '../../../../model/bpmn/internal/shape/InternalBPMNShape';
import ShapeBaseElement, { ShapeBpmnCallActivity, ShapeBpmnSubProcess } from '../../../../model/bpmn/internal/shape/ShapeBaseElement';
import InternalBPMNEdge from '../../../../model/bpmn/internal/edge/InternalBPMNEdge';
import InternalBPMNModel, { InternalBPMNShapes } from '../../../../model/bpmn/internal/InternalBPMNModel';
import { findAssociationFlow, findFlowNodeBpmnElement, findLaneBpmnElement, findProcessBpmnElement, findSequenceFlow } from './ProcessConverter';
import { findMessageFlow, findProcessRefParticipant, findProcessRefParticipantByProcessRef } from './CollaborationConverter';
import Label from '../../../../model/bpmn/internal/Label';
import { BPMNDiagram, BPMNEdge, BPMNLabel, BPMNLabelStyle, BPMNShape } from '../../../../model/bpmn/json-xsd/BPMNDI';
import { Font } from '../../../../model/bpmn/json-xsd/DC';
import { ensureIsArray } from './ConverterUtil';
import { ShapeBaseElementType, MarkerType } from '../../../../model/bpmn/internal/shape';
import InternalBPMNShapeUtil from '../../../../model/bpmn/internal/shape/InternalBPMNShapeUtil';

function findProcessElement(participantId: string): ShapeBaseElement | undefined {
  const participant = findProcessRefParticipant(participantId);
  if (participant) {
    const originalProcessBpmnElement = findProcessBpmnElement(participant.processRef);
    if (originalProcessBpmnElement) {
      const name = participant.name || originalProcessBpmnElement.name;
      return new ShapeBaseElement(participant.id, name, originalProcessBpmnElement.type, originalProcessBpmnElement.parentId);
    }
    // black box pool
    return new ShapeBaseElement(participant.id, participant.name, ShapeBaseElementType.POOL);
  }
}

export default class DiagramConverter {
  private convertedFonts: Map<string, Font> = new Map();

  deserialize(bpmnDiagrams: Array<BPMNDiagram> | BPMNDiagram): InternalBPMNModel {
    const flowNodes: InternalBPMNShape[] = [];
    const lanes: InternalBPMNShape[] = [];
    const pools: InternalBPMNShape[] = [];
    const edges: InternalBPMNEdge[] = [];

    const bpmnDiagram = ensureIsArray(bpmnDiagrams)[0];
    if (bpmnDiagram) {
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
    }
    return { flowNodes, lanes, pools, edges };
  }

  private deserializeFonts(bpmnLabelStyle: Array<BPMNLabelStyle> | BPMNLabelStyle): void {
    this.convertedFonts = new Map();

    ensureIsArray(bpmnLabelStyle).forEach(labelStyle => {
      ensureIsArray(labelStyle.Font).forEach(font => {
        this.convertedFonts.set(labelStyle.id, font);
      });
    });
  }

  private deserializeShapes(shapes: Array<BPMNShape> | BPMNShape): InternalBPMNShapes {
    // TODO find a way to avoid shape management duplication
    // common pattern:
    //    deserialize  shape base on custom function to find a bpmn element
    //    if found push in an array and process next element
    const convertedShapes: InternalBPMNShapes = { flowNodes: [], lanes: [], pools: [] };

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

  private deserializeShape(shape: BPMNShape, findShapeElement: (bpmnElement: string) => ShapeBaseElement): InternalBPMNShape | undefined {
    const bpmnElement = findShapeElement(shape.bpmnElement);
    if (bpmnElement) {
      if (bpmnElement.parentId) {
        const participant = findProcessRefParticipantByProcessRef(bpmnElement.parentId);
        if (participant) {
          bpmnElement.parentId = participant.id;
        }
      }

      if ((bpmnElement instanceof ShapeBpmnSubProcess || bpmnElement instanceof ShapeBpmnCallActivity) && !shape.isExpanded) {
        bpmnElement.markers.push(MarkerType.EXPAND);
      }

      let isHorizontal;
      if (InternalBPMNShapeUtil.isPoolOrLane(bpmnElement.type)) {
        isHorizontal = shape.isHorizontal !== undefined ? shape.isHorizontal : true;
      }

      const label = this.deserializeLabel(shape.BPMNLabel, shape.id);
      return new InternalBPMNShape(shape.id, bpmnElement, shape.Bounds, label, isHorizontal);
    }
  }

  private deserializeEdges(edges: BPMNEdge | BPMNEdge[]): InternalBPMNEdge[] {
    return ensureIsArray(edges).map(edge => {
      const flow = findSequenceFlow(edge.bpmnElement) || findMessageFlow(edge.bpmnElement) || findAssociationFlow(edge.bpmnElement);
      const label = this.deserializeLabel(edge.BPMNLabel, edge.id);
      return new InternalBPMNEdge(edge.id, flow, edge.waypoint, label, edge.messageVisibleKind);
    });
  }

  private deserializeLabel(bpmnLabel: string | BPMNLabel, id: string): Label {
    if (bpmnLabel && typeof bpmnLabel === 'object') {
      const font = this.findFont(bpmnLabel.labelStyle, id);
      const bounds = bpmnLabel.Bounds;

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
