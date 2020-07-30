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
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import ShapeBpmnElement, { ShapeBpmnBoundaryEvent, ShapeBpmnEvent, ShapeBpmnSubProcess } from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { ShapeBpmnElementKind } from '../../../../model/bpmn/shape/ShapeBpmnElementKind';
import { AssociationFlow, SequenceFlow } from '../../../../model/bpmn/edge/Flow';
import { ShapeBpmnEventKind, supportedBpmnEventKinds } from '../../../../model/bpmn/shape/ShapeBpmnEventKind';
import ShapeUtil, { BpmnEventKind } from '../../../../model/bpmn/shape/ShapeUtil';
import { SequenceFlowKind } from '../../../../model/bpmn/edge/SequenceFlowKind';
import { ShapeBpmnSubProcessKind } from '../../../../model/bpmn/shape/ShapeBpmnSubProcessKind';
import { FlowKind } from '../../../../model/bpmn/edge/FlowKind';
import { TProcess } from '../../xml/bpmn-json-model/baseElement/rootElement/rootElement';
import { TBoundaryEvent, TCatchEvent, TEvent, TThrowEvent } from '../../xml/bpmn-json-model/baseElement/flowNode/event';
import { TSubProcess } from '../../xml/bpmn-json-model/baseElement/flowNode/activity/activity';
import { TLane, TLaneSet } from '../../xml/bpmn-json-model/baseElement/baseElement';
import { TSequenceFlow } from '../../xml/bpmn-json-model/baseElement/flowElement';
import { TAssociation } from '../../xml/bpmn-json-model/baseElement/artifact';
import { AssociationDirectionKind } from '../../../../model/bpmn/edge/AssociationDirectionKind';

// only define a type to fill data used to build the BpmnModel
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Process {}

const convertedFlowNodeBpmnElements: ShapeBpmnElement[] = [];
const convertedLaneBpmnElements: ShapeBpmnElement[] = [];
const convertedProcessBpmnElements: ShapeBpmnElement[] = [];
const convertedSequenceFlows: SequenceFlow[] = [];
const convertedAssociationFlows: AssociationFlow[] = [];
const defaultSequenceFlowIds: string[] = [];

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

export function findAssociationFlow(id: string): AssociationFlow {
  return convertedAssociationFlows.find(i => i.id === id);
}

interface EventDefinition {
  kind: ShapeBpmnEventKind;
  counter: number;
}

export default class ProcessConverter extends AbstractConverter<Process> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(processes: string | TProcess | (string | TProcess)[]): Process {
    try {
      // Deletes everything in the array, which does hit other references. For better performance.
      convertedFlowNodeBpmnElements.length = 0;
      convertedLaneBpmnElements.length = 0;
      convertedProcessBpmnElements.length = 0;
      convertedSequenceFlows.length = 0;
      convertedAssociationFlows.length = 0;
      defaultSequenceFlowIds.length = 0;

      ensureIsArray(processes).forEach(process => this.parseProcess(process));

      return {};
    } catch (e) {
      // TODO error management
      console.error(e as Error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseProcess(process: TProcess): void {
    const processId = process.id;
    convertedProcessBpmnElements.push(new ShapeBpmnElement(processId, process.name, ShapeBpmnElementKind.POOL));

    // flow nodes
    ShapeUtil.flowNodeKinds()
      .filter(kind => kind != ShapeBpmnElementKind.EVENT_BOUNDARY)
      .forEach(kind => this.buildFlowNodeBpmnElements(processId, process[kind], kind));
    // process boundary events afterwards as we need its parent activity to be available when building it
    this.buildFlowNodeBpmnElements(processId, process.boundaryEvent, ShapeBpmnElementKind.EVENT_BOUNDARY);

    // containers
    this.buildLaneBpmnElements(processId, process[ShapeBpmnElementKind.LANE]);
    this.buildLaneSetBpmnElements(processId, process['laneSet']);

    // flows
    this.buildSequenceFlows(process[FlowKind.SEQUENCE_FLOW]);
    this.buildAssociationFlows(process[FlowKind.ASSOCIATION_FLOW]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildFlowNodeBpmnElements(processId: string, bpmnElements: Array<any> | any, kind: ShapeBpmnElementKind): void {
    ensureIsArray(bpmnElements).forEach(bpmnElement => {
      let shapeBpmnElement;

      if (ShapeUtil.isEvent(kind)) {
        shapeBpmnElement = this.buildShapeBpmnEvent(bpmnElement, kind as BpmnEventKind, processId);
      } else if (ShapeUtil.isSubProcess(kind)) {
        shapeBpmnElement = this.buildShapeBpmnSubProcess(bpmnElement, processId);
      } else {
        const name = kind === ShapeBpmnElementKind.TEXT_ANNOTATION ? bpmnElement.text : bpmnElement.name;
        shapeBpmnElement = new ShapeBpmnElement(bpmnElement.id, name, kind, processId, bpmnElement.instantiate);
      }

      if (ShapeUtil.isWithDefaultSequenceFlow(kind) && bpmnElement.default) {
        defaultSequenceFlowIds.push(bpmnElement.default);
      }

      if (shapeBpmnElement) {
        convertedFlowNodeBpmnElements.push(shapeBpmnElement);
      }
    });
  }

  private buildShapeBpmnEvent(bpmnElement: TCatchEvent | TThrowEvent, elementKind: BpmnEventKind, processId: string): ShapeBpmnEvent {
    const eventDefinitions = this.getEventDefinitions(bpmnElement);
    const numberOfEventDefinitions = eventDefinitions.map(eventDefinition => eventDefinition.counter).reduce((counter, it) => counter + it, 0);

    // do we have a None Event?
    if (numberOfEventDefinitions == 0 && ShapeUtil.canHaveNoneEvent(elementKind)) {
      return new ShapeBpmnEvent(bpmnElement.id, bpmnElement.name, elementKind, ShapeBpmnEventKind.NONE, processId);
    }

    if (numberOfEventDefinitions == 1) {
      const eventKind = eventDefinitions[0].kind;
      if (supportedBpmnEventKinds.includes(eventKind)) {
        if (ShapeUtil.isBoundaryEvent(elementKind)) {
          return this.buildShapeBpmnBoundaryEvent(bpmnElement as TBoundaryEvent, eventKind);
        }
        return new ShapeBpmnEvent(bpmnElement.id, bpmnElement.name, elementKind, eventKind, processId);
      }
    }
  }

  private buildShapeBpmnBoundaryEvent(bpmnElement: TBoundaryEvent, eventKind: ShapeBpmnEventKind): ShapeBpmnBoundaryEvent {
    const parent = findFlowNodeBpmnElement(bpmnElement.attachedToRef);

    if (ShapeUtil.isActivity(parent?.kind)) {
      return new ShapeBpmnBoundaryEvent(bpmnElement.id, bpmnElement.name, eventKind, bpmnElement.attachedToRef, bpmnElement.cancelActivity);
    } else {
      // TODO error management
      console.warn('A boundary event must be attach to an activity, and not to %s', parent?.kind);
    }
  }

  /**
   * Get the list of eventDefinitions hold by the Event bpmElement
   *
   * @param bpmnElement The BPMN element from the XML data which represents a BPMN Event
   */
  private getEventDefinitions(bpmnElement: TEvent): EventDefinition[] {
    return bpmnEventKinds
      .map(eventKind => {
        // sometimes eventDefinition is simple and therefore it is parsed as empty string "", in that case eventDefinition will be converted to an empty object
        const eventDefinition = bpmnElement[eventKind + 'EventDefinition'];
        return { kind: eventKind, counter: ensureIsArray(eventDefinition, true).length };
      })
      .filter(eventDefinition => {
        return eventDefinition.counter > 0;
      });
  }

  private buildShapeBpmnSubProcess(bpmnElement: TSubProcess, processId: string): ShapeBpmnSubProcess {
    if (!bpmnElement.triggeredByEvent) {
      return new ShapeBpmnSubProcess(bpmnElement.id, bpmnElement.name, ShapeBpmnSubProcessKind.EMBEDDED, processId);
    }
    return new ShapeBpmnSubProcess(bpmnElement.id, bpmnElement.name, ShapeBpmnSubProcessKind.EVENT, processId);
  }

  private buildLaneSetBpmnElements(processId: string, laneSets: Array<TLaneSet> | TLaneSet): void {
    ensureIsArray(laneSets).forEach(laneSet => {
      this.buildLaneBpmnElements(processId, laneSet.lane);
    });
  }

  private buildLaneBpmnElements(processId: string, lanes: Array<TLane> | TLane): void {
    ensureIsArray(lanes).forEach(lane => {
      const laneShape = new ShapeBpmnElement(lane.id, lane.name, ShapeBpmnElementKind.LANE, processId);
      convertedLaneBpmnElements.push(laneShape);
      this.assignParentOfLaneFlowNodes(lane);
    });
  }

  private assignParentOfLaneFlowNodes(lane: TLane): void {
    ensureIsArray<string>(lane.flowNodeRef).forEach(flowNodeRef => {
      const shapeBpmnElement = findFlowNodeBpmnElement(flowNodeRef);
      const laneId = lane.id;
      if (shapeBpmnElement) {
        if (!ShapeUtil.isBoundaryEvent(shapeBpmnElement.kind)) {
          shapeBpmnElement.parentId = laneId;
        }
      } else {
        // TODO error management
        console.warn('Unable to assign lane %s as parent: flow node %s is not found', laneId, flowNodeRef);
      }
    });
  }

  private buildSequenceFlows(bpmnElements: Array<TSequenceFlow> | TSequenceFlow): void {
    ensureIsArray(bpmnElements).forEach(sequenceFlow => {
      const kind = this.getSequenceFlowKind(sequenceFlow);
      const convertedSequenceFlow = new SequenceFlow(sequenceFlow.id, sequenceFlow.name, sequenceFlow.sourceRef, sequenceFlow.targetRef, kind);
      convertedSequenceFlows.push(convertedSequenceFlow);
    });
  }

  private buildAssociationFlows(bpmnElements: Array<TAssociation> | TAssociation): void {
    ensureIsArray(bpmnElements).forEach(association => {
      // TODO Remove associationDirection conversion type when we merge/simplify internal model with BPMN json model
      const direction = (association.associationDirection as unknown) as AssociationDirectionKind;
      const convertedAssociationFlow = new AssociationFlow(association.id, undefined, association.sourceRef, association.targetRef, direction);
      convertedAssociationFlows.push(convertedAssociationFlow);
    });
  }

  private getSequenceFlowKind(sequenceFlow: TSequenceFlow): SequenceFlowKind {
    if (defaultSequenceFlowIds.includes(sequenceFlow.id)) {
      return SequenceFlowKind.DEFAULT;
    } else {
      const sourceShapeBpmnElement = findFlowNodeBpmnElement(sequenceFlow.sourceRef);
      if (sourceShapeBpmnElement && ShapeUtil.isWithDefaultSequenceFlow(sourceShapeBpmnElement.kind) && sequenceFlow.conditionExpression) {
        if (ShapeUtil.isActivity(sourceShapeBpmnElement.kind)) {
          return SequenceFlowKind.CONDITIONAL_FROM_ACTIVITY;
        } else {
          return SequenceFlowKind.CONDITIONAL_FROM_GATEWAY;
        }
      }
    }
    return SequenceFlowKind.NORMAL;
  }
}
