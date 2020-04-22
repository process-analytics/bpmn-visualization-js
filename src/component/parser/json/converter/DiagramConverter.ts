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
import { findFlowNodeBpmnElement, findLaneBpmnElement, findProcessBpmnElement } from './ProcessConverter';
import { findProcessRefParticipant, findProcessRefParticipantByProcessRef } from './CollaborationConverter';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(bpmnDiagram: Array<any> | any): BpmnModel {
    try {
      const plane = bpmnDiagram.BPMNPlane;

      const edges = { edges: this.deserializeEdges(plane.BPMNEdge) };
      const shapes = this.deserializeShapes(plane.BPMNShape);

      return { ...shapes, ...edges };
    } catch (e) {
      // TODO error management
      console.error(e as Error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private deserializeShapes(shapes: any): Shapes {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private deserializeShape(shape: any, findShapeElement: (bpmnElement: string) => ShapeBpmnElement): Shape | undefined {
    const bpmnElement = findShapeElement(shape.bpmnElement);
    if (bpmnElement) {
      const bounds = this.jsonConvert.deserializeObject(shape.Bounds, Bounds);

      if (bpmnElement.parentId) {
        const participant = findProcessRefParticipantByProcessRef(bpmnElement.parentId);
        if (participant) {
          bpmnElement.parentId = participant.id;
        }
      }

      return new Shape(shape.id, bpmnElement, bounds);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private deserializeEdges(edges: any): Edge[] {
    return this.jsonConvert.deserializeArray(ensureIsArray(edges), Edge);
  }
}
