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
import ShapeBpmnElement, { ShapeBpmnEvent } from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind } from '../../../../model/bpmn/shape/ShapeBpmnElementKind';
import { Process } from '../Definitions';
import SequenceFlow from '../../../../model/bpmn/edge/SequenceFlow';
import Waypoint from '../../../../model/bpmn/edge/Waypoint';
import { ShapeBpmnEventKind, supportedBpmnEventKinds } from '../../../../model/bpmn/shape/ShapeBpmnEventKind';
import ShapeUtil from '../../../../model/bpmn/shape/ShapeUtil';

const convertedFlowNodeBpmnElements: ShapeBpmnElement[] = [];
const convertedLaneBpmnElements: ShapeBpmnElement[] = [];
const convertedProcessBpmnElements: ShapeBpmnElement[] = [];
const convertedSequenceFlows: SequenceFlow[] = [];

const flowNodeKinds = Object.values(ShapeBpmnElementKind).filter(kind => {
  return kind != ShapeBpmnElementKind.LANE;
});

const bpmnEventKinds = Object.values(ShapeBpmnEventKind).filter(kind => {
  return kind != ShapeBpmnEventKind.NONE;
});

export function findFlowNodeBpmnElement(id: string): ShapeBpmnElement {
  return convertedFlowNodeBpmnElements.find(i => i.id === id);
}

export function findLaneBpmnElement(id: string): ShapeBpmnElement {
  return convertedLaneBpmnElements.find(i => i.id === id);
}

export function findProcessBpmnElement(id: string): ShapeBpmnElement {
  return convertedProcessBpmnElements.find(i => i.id === id);
}

export function findSequenceFlow(id: string): SequenceFlow {
  return convertedSequenceFlows.find(i => i.id === id);
}

interface EventDefinition {
  kind: ShapeBpmnEventKind;
  counter: number;
}

@JsonConverter
export default class ProcessConverter extends AbstractConverter<Process> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(processes: Array<any> | any): Process {
    try {
      // Deletes everything in the array, which does hit other references. For better performance.
      convertedFlowNodeBpmnElements.length = 0;
      convertedLaneBpmnElements.length = 0;
      convertedProcessBpmnElements.length = 0;
      convertedSequenceFlows.length = 0;

      ensureIsArray(processes).forEach(process => this.parseProcess(process));

      return {};
    } catch (e) {
      // TODO error management
      console.error(e as Error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseProcess(process: { [index: string]: any }): void {
    const processId = process.id;
    convertedProcessBpmnElements.push(new ShapeBpmnElement(processId, process.name, ShapeBpmnElementKind.POOL));

    // flow nodes
    flowNodeKinds.forEach(kind => this.buildFlowNodeBpmnElements(processId, process[kind], kind));

    // containers
    this.buildLaneBpmnElements(processId, process[ShapeBpmnElementKind.LANE]);
    this.buildLaneSetBpmnElements(processId, process['laneSet']);

    // flows
    this.buildSequenceFlows(process['sequenceFlow']);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildFlowNodeBpmnElements(processId: string, bpmnElements: Array<any> | any, kind: ShapeBpmnElementKind): void {
    ensureIsArray(bpmnElements).forEach(bpmnElement => {
      if (ShapeUtil.isEvent(kind)) {
        const shapeBpmnEvent = this.buildShapeBpmnEvent(bpmnElement, kind, processId);
        if (shapeBpmnEvent) {
          convertedFlowNodeBpmnElements.push(shapeBpmnEvent);
        }
      } else {
        convertedFlowNodeBpmnElements.push(new ShapeBpmnElement(bpmnElement.id, bpmnElement.name, kind, processId));
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildShapeBpmnEvent(bpmnElement: any, elementKind: ShapeBpmnElementKind, processId: string): ShapeBpmnEvent | void {
    const eventDefinitions = this.getEventDefinitions(bpmnElement);
    const numberOfEventDefinitions = eventDefinitions.map(eventDefinition => eventDefinition.counter).reduce((counter, it) => counter + it, 0);

    // do we have a None Event?
    if (numberOfEventDefinitions == 0) {
      return new ShapeBpmnEvent(bpmnElement.id, bpmnElement.name, elementKind, ShapeBpmnEventKind.NONE, processId);
    }

    if (numberOfEventDefinitions == 1) {
      const eventDefinition = eventDefinitions.filter(eventDefinition => eventDefinition.counter == 1)[0];
      if (supportedBpmnEventKinds.includes(eventDefinition.kind)) {
        return new ShapeBpmnEvent(bpmnElement.id, bpmnElement.name, elementKind, eventDefinition.kind, processId);
      }
    }
  }

  /**
   * Get the list of eventDefinition hold by the Event bpmElement
   *
   * @param bpmnElement The BPMN element from the XML data which represents a BPMN Event
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getEventDefinitions(bpmnElement: any): EventDefinition[] {
    return bpmnEventKinds.map(eventKind => {
      // sometimes eventDefinition is simple and therefore it is parsed as empty string "", in that case eventDefinition will be converted to an empty object
      const eventDefinition = bpmnElement[eventKind + 'EventDefinition'];
      return { kind: eventKind, counter: ensureIsArray(eventDefinition, true).length };
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildLaneSetBpmnElements(processId: string, laneSet: any): void {
    if (laneSet) {
      this.buildLaneBpmnElements(processId, laneSet.lane);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildLaneBpmnElements(processId: string, lanes: Array<any> | any): void {
    ensureIsArray(lanes).forEach(lane => {
      const laneShape = new ShapeBpmnElement(lane.id, lane.name, ShapeBpmnElementKind.LANE, processId);
      convertedLaneBpmnElements.push(laneShape);
      this.assignParentOfLaneFlowNodes(lane);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private assignParentOfLaneFlowNodes(lane: any): void {
    ensureIsArray(lane.flowNodeRef).forEach(flowNodeRef => {
      const shapeBpmnElement = findFlowNodeBpmnElement(flowNodeRef);
      const laneId = lane.id;
      if (shapeBpmnElement) {
        shapeBpmnElement.parentId = laneId;
      } else {
        // TODO error management
        console.warn('Unable to assign lane %s as parent: flow node %s is not found', laneId, flowNodeRef);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildSequenceFlows(bpmnElements: Array<any> | any): void {
    const t = this.jsonConvert.deserializeArray(ensureIsArray(bpmnElements), SequenceFlow);
    convertedSequenceFlows.push(...t);
  }
}

@JsonConverter
export class SequenceFlowConverter extends AbstractConverter<SequenceFlow> {
  deserialize(data: string): SequenceFlow {
    return findSequenceFlow(data);
  }
}

@JsonConverter
export class WaypointConverter extends AbstractConverter<Waypoint[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(waypoints: any): Waypoint[] {
    return this.jsonConvert.deserializeArray(ensureIsArray(waypoints), Waypoint);
  }
}
