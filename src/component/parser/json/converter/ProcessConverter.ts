/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import ShapeBaseElement, {
  ShapeBpmnActivity,
  ShapeBpmnBoundaryEvent,
  ShapeBpmnCallActivity,
  ShapeBpmnEvent,
  ShapeBpmnStartEvent,
  ShapeBpmnSubProcess,
} from '../../../../model/bpmn/internal/shape/ShapeBaseElement';
import { ShapeBaseElementType, CallActivityType, MarkerType, SubProcessType, EventType, supportedBpmnEventKinds } from '../../../../model/bpmn/internal/shape';
import { AssociationFlow, SequenceFlow } from '../../../../model/bpmn/internal/edge/Flow';
import InternalBPMNShapeUtil, { BaseElementEventType } from '../../../../model/bpmn/internal/shape/InternalBPMNShapeUtil';
import { SequenceFlowType } from '../../../../model/bpmn/internal/edge/SequenceFlowType';
import { FlowType } from '../../../../model/bpmn/internal/edge/FlowType';
import { TProcess } from '../../../../model/bpmn/json/baseElement/rootElement/rootElement';
import { TBoundaryEvent, TCatchEvent, TThrowEvent } from '../../../../model/bpmn/json/baseElement/flowNode/event';
import { TActivity, TCallActivity, TSubProcess } from '../../../../model/bpmn/json/baseElement/flowNode/activity/activity';
import { TLane, TLaneSet } from '../../../../model/bpmn/json/baseElement/baseElement';
import { TFlowNode, TSequenceFlow } from '../../../../model/bpmn/json/baseElement/flowElement';
import { TAssociation, TTextAnnotation } from '../../../../model/bpmn/json/baseElement/artifact';
import { bpmnEventTypes, findEventDefinitionOfDefinitions } from './EventDefinitionConverter';
import { ensureIsArray } from './ConverterUtil';
import { TEventBasedGateway } from '../../../../model/bpmn/json/baseElement/flowNode/gateway';
import { TReceiveTask } from '../../../../model/bpmn/json/baseElement/flowNode/activity/task';
import { isGlobalTask } from './GlobalTaskConverter';

const convertedFlowNodeBpmnElements: Map<string, ShapeBaseElement> = new Map();
const convertedLaneBpmnElements: Map<string, ShapeBaseElement> = new Map();
const convertedProcessBpmnElements: Map<string, ShapeBaseElement> = new Map();
const convertedSequenceFlows: Map<string, SequenceFlow> = new Map();
const convertedAssociationFlows: Map<string, AssociationFlow> = new Map();

const defaultSequenceFlowIds: string[] = [];

export function findFlowNodeBpmnElement(id: string): ShapeBaseElement {
  return convertedFlowNodeBpmnElements.get(id);
}

export function findLaneBpmnElement(id: string): ShapeBaseElement {
  return convertedLaneBpmnElements.get(id);
}

export function findProcessBpmnElement(id: string): ShapeBaseElement {
  return convertedProcessBpmnElements.get(id);
}

export function findSequenceFlow(id: string): SequenceFlow {
  return convertedSequenceFlows.get(id);
}

export function findAssociationFlow(id: string): AssociationFlow {
  return convertedAssociationFlows.get(id);
}

interface EventDefinition {
  type: EventType;
  counter: number;
}

type FlowNode = TFlowNode | TActivity | TReceiveTask | TEventBasedGateway | TTextAnnotation;

export default class ProcessConverter {
  deserialize(processes: string | TProcess | (string | TProcess)[]): void {
    try {
      convertedFlowNodeBpmnElements.clear();
      convertedLaneBpmnElements.clear();
      convertedProcessBpmnElements.clear();
      convertedSequenceFlows.clear();
      convertedAssociationFlows.clear();

      // Deletes everything in the array, which does hit other references. For better performance.
      defaultSequenceFlowIds.length = 0;

      ensureIsArray(processes).forEach(process => this.parseProcess(process));
    } catch (e) {
      // TODO error management
      console.error(e as Error);
    }
  }

  private parseProcess(process: TProcess): void {
    const processId = process.id;
    convertedProcessBpmnElements.set(processId, new ShapeBaseElement(processId, process.name, ShapeBaseElementType.POOL));
    this.buildProcessInnerElements(process);
  }

  private buildProcessInnerElements(process: TProcess | TSubProcess): void {
    const processId = process.id;

    // flow nodes
    InternalBPMNShapeUtil.flowNodeTypes()
      .filter(type => type != ShapeBaseElementType.EVENT_BOUNDARY)
      .forEach(type => this.buildFlowNodeBpmnElements(processId, process[type], type));
    // process boundary events afterwards as we need its parent activity to be available when building it
    this.buildFlowNodeBpmnElements(processId, process.boundaryEvent, ShapeBaseElementType.EVENT_BOUNDARY);

    // containers
    this.buildLaneBpmnElements(processId, process[ShapeBaseElementType.LANE]);
    this.buildLaneSetBpmnElements(processId, process['laneSet']);

    // flows
    this.buildSequenceFlows(process[FlowType.SEQUENCE_FLOW]);
    this.buildAssociationFlows(process[FlowType.ASSOCIATION_FLOW]);
  }

  private buildFlowNodeBpmnElements(processId: string, bpmnElements: Array<FlowNode> | FlowNode, type: ShapeBaseElementType): void {
    ensureIsArray(bpmnElements).forEach(bpmnElement => {
      let shapeBpmnElement;

      if (InternalBPMNShapeUtil.isEvent(type)) {
        shapeBpmnElement = this.buildShapeBpmnEvent(bpmnElement, type as BaseElementEventType, processId);
      } else if (InternalBPMNShapeUtil.isActivity(type)) {
        shapeBpmnElement = this.buildShapeBpmnActivity(bpmnElement, type, processId);
      } else {
        // @ts-ignore We know that the text & name fields are not on all types, but it's already tested
        const name = type === ShapeBaseElementType.TEXT_ANNOTATION ? bpmnElement.text : bpmnElement.name;
        // @ts-ignore We know that the instantiate field is not on all types, but it's already tested
        shapeBpmnElement = new ShapeBaseElement(bpmnElement.id, name, type, processId, bpmnElement.instantiate);
      }

      // @ts-ignore We know that the default field is not on all types, but it's already tested
      const defaultFlow = bpmnElement.default;
      if (InternalBPMNShapeUtil.isWithDefaultSequenceFlow(type) && defaultFlow) {
        defaultSequenceFlowIds.push(defaultFlow);
      }

      if (shapeBpmnElement) {
        convertedFlowNodeBpmnElements.set(shapeBpmnElement.id, shapeBpmnElement);
      }
    });
  }

  private buildShapeBpmnActivity(bpmnElement: TActivity, type: ShapeBaseElementType, processId: string): ShapeBpmnActivity {
    const markers = this.buildMarkers(bpmnElement);

    if (InternalBPMNShapeUtil.isSubProcess(type)) {
      return this.buildShapeBpmnSubProcess(bpmnElement, processId, markers);
    }

    if (!InternalBPMNShapeUtil.isCallActivity(type)) {
      // @ts-ignore
      return new ShapeBpmnActivity(bpmnElement.id, bpmnElement.name, type, processId, bpmnElement.instantiate, markers);
    }

    if (!isGlobalTask((bpmnElement as TCallActivity).calledElement)) {
      return new ShapeBpmnCallActivity(bpmnElement.id, bpmnElement.name, CallActivityType.CALLING_PROCESS, processId, markers);
    }
  }

  private buildMarkers(bpmnElement: TActivity): MarkerType[] {
    const markers: MarkerType[] = [];
    // @ts-ignore We know that the standardLoopCharacteristics field is not on all types, but it's already tested
    const standardLoopCharacteristics = bpmnElement.standardLoopCharacteristics;
    // @ts-ignore We know that the multiInstanceLoopCharacteristics field is not on all types, but it's already tested
    const multiInstanceLoopCharacteristics = ensureIsArray(bpmnElement.multiInstanceLoopCharacteristics, true)[0];
    if (standardLoopCharacteristics || standardLoopCharacteristics === '') {
      markers.push(MarkerType.LOOP);
    } else if (multiInstanceLoopCharacteristics && multiInstanceLoopCharacteristics.isSequential) {
      markers.push(MarkerType.MULTI_INSTANCE_SEQUENTIAL);
    } else if ((multiInstanceLoopCharacteristics && !multiInstanceLoopCharacteristics.isSequential) || multiInstanceLoopCharacteristics === '') {
      markers.push(MarkerType.MULTI_INSTANCE_PARALLEL);
    }
    return markers;
  }

  private buildShapeBpmnEvent(bpmnElement: TCatchEvent | TThrowEvent, elementType: BaseElementEventType, processId: string): ShapeBpmnEvent {
    const eventDefinitions = this.getEventDefinitions(bpmnElement);
    const numberOfEventDefinitions = eventDefinitions.map(eventDefinition => eventDefinition.counter).reduce((counter, it) => counter + it, 0);

    // do we have a None Event?
    if (numberOfEventDefinitions == 0 && InternalBPMNShapeUtil.canHaveNoneEvent(elementType)) {
      return new ShapeBpmnEvent(bpmnElement.id, bpmnElement.name, elementType, EventType.NONE, processId);
    }

    if (numberOfEventDefinitions == 1) {
      const eventKind = eventDefinitions[0].type;
      if (supportedBpmnEventKinds.includes(eventKind)) {
        if (InternalBPMNShapeUtil.isBoundaryEvent(elementType)) {
          return this.buildShapeBpmnBoundaryEvent(bpmnElement as TBoundaryEvent, eventKind);
        }
        if (InternalBPMNShapeUtil.isStartEvent(elementType)) {
          return new ShapeBpmnStartEvent(bpmnElement.id, bpmnElement.name, eventKind, processId, bpmnElement.isInterrupting);
        }
        return new ShapeBpmnEvent(bpmnElement.id, bpmnElement.name, elementType, eventKind, processId);
      }
    }
  }

  private buildShapeBpmnBoundaryEvent(bpmnElement: TBoundaryEvent, eventKind: EventType): ShapeBpmnBoundaryEvent {
    const parent = findFlowNodeBpmnElement(bpmnElement.attachedToRef);

    if (InternalBPMNShapeUtil.isActivity(parent?.type)) {
      return new ShapeBpmnBoundaryEvent(bpmnElement.id, bpmnElement.name, eventKind, bpmnElement.attachedToRef, bpmnElement.cancelActivity);
    } else {
      // TODO error management
      console.warn('The boundary event %s must be attach to an activity, and not to %s', bpmnElement.id, parent?.type);
    }
  }

  /**
   * Get the list of eventDefinitions hold by the Event bpmElement
   *
   * @param bpmnElement The BPMN element from the XML data which represents a BPMN Event
   */
  private getEventDefinitions(bpmnElement: TCatchEvent | TThrowEvent): EventDefinition[] {
    const eventDefinitions = new Map<EventType, number>();

    bpmnEventTypes.forEach(eventType => {
      // sometimes eventDefinition is simple and therefore it is parsed as empty string "", in that case eventDefinition will be converted to an empty object
      const eventDefinition = bpmnElement[eventType + 'EventDefinition'];
      const counter = ensureIsArray(eventDefinition, true).length;
      eventDefinitions.set(eventType, counter);
    });

    ensureIsArray<string>(bpmnElement.eventDefinitionRef).forEach(eventDefinitionRef => {
      const type = findEventDefinitionOfDefinitions(eventDefinitionRef);
      eventDefinitions.set(type, eventDefinitions.get(type) + 1);
    });

    return Array.from(eventDefinitions.keys())
      .map(type => {
        return { type, counter: eventDefinitions.get(type) };
      })
      .filter(eventDefinition => {
        return eventDefinition.counter > 0;
      });
  }

  private buildShapeBpmnSubProcess(bpmnElement: TSubProcess, processId: string, markers: MarkerType[]): ShapeBpmnSubProcess {
    this.buildSubProcessInnerElements(bpmnElement);
    if (!bpmnElement.triggeredByEvent) {
      return new ShapeBpmnSubProcess(bpmnElement.id, bpmnElement.name, SubProcessType.EMBEDDED, processId, markers);
    }
    return new ShapeBpmnSubProcess(bpmnElement.id, bpmnElement.name, SubProcessType.EVENT, processId, markers);
  }

  private buildSubProcessInnerElements(subProcess: TSubProcess): void {
    this.buildProcessInnerElements(subProcess);
  }

  private buildLaneSetBpmnElements(processId: string, laneSets: Array<TLaneSet> | TLaneSet): void {
    ensureIsArray(laneSets).forEach(laneSet => {
      this.buildLaneBpmnElements(processId, laneSet.lane);
    });
  }

  private buildLaneBpmnElements(processId: string, lanes: Array<TLane> | TLane): void {
    ensureIsArray(lanes).forEach(lane => {
      const laneShape = new ShapeBaseElement(lane.id, lane.name, ShapeBaseElementType.LANE, processId);
      convertedLaneBpmnElements.set(lane.id, laneShape);
      this.assignParentOfLaneFlowNodes(lane);
      if (lane.childLaneSet?.lane) {
        this.buildLaneBpmnElements(lane.id, lane.childLaneSet.lane);
      }
    });
  }

  private assignParentOfLaneFlowNodes(lane: TLane): void {
    ensureIsArray<string>(lane.flowNodeRef).forEach(flowNodeRef => {
      const shapeBpmnElement = findFlowNodeBpmnElement(flowNodeRef);
      const laneId = lane.id;
      if (shapeBpmnElement) {
        if (!InternalBPMNShapeUtil.isBoundaryEvent(shapeBpmnElement.type)) {
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
      const type = this.getSequenceFlowType(sequenceFlow);
      const convertedSequenceFlow = new SequenceFlow(sequenceFlow.id, sequenceFlow.name, sequenceFlow.sourceRef, sequenceFlow.targetRef, type);
      convertedSequenceFlows.set(sequenceFlow.id, convertedSequenceFlow);
    });
  }

  private buildAssociationFlows(bpmnElements: Array<TAssociation> | TAssociation): void {
    ensureIsArray(bpmnElements).forEach(association => {
      const convertedAssociationFlow = new AssociationFlow(association.id, undefined, association.sourceRef, association.targetRef, association.associationDirection);
      convertedAssociationFlows.set(association.id, convertedAssociationFlow);
    });
  }

  private getSequenceFlowType(sequenceFlow: TSequenceFlow): SequenceFlowType {
    if (defaultSequenceFlowIds.includes(sequenceFlow.id)) {
      return SequenceFlowType.DEFAULT;
    } else {
      const sourceShapeBpmnElement = findFlowNodeBpmnElement(sequenceFlow.sourceRef);
      if (sourceShapeBpmnElement && InternalBPMNShapeUtil.isWithDefaultSequenceFlow(sourceShapeBpmnElement.type) && sequenceFlow.conditionExpression) {
        if (InternalBPMNShapeUtil.isActivity(sourceShapeBpmnElement.type)) {
          return SequenceFlowType.CONDITIONAL_FROM_ACTIVITY;
        } else {
          return SequenceFlowType.CONDITIONAL_FROM_GATEWAY;
        }
      }
    }
    return SequenceFlowType.NORMAL;
  }
}
