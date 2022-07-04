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

import type { TParticipant } from '../../../src/model/bpmn/json/baseElement/participant';
import type { TMessageFlow } from '../../../src/model/bpmn/json/baseElement/baseElement';
import type { TCollaboration } from '../../../src/model/bpmn/json/baseElement/rootElement/collaboration';
import type { TBoundaryEvent, TCatchEvent, TThrowEvent } from '../../../src/model/bpmn/json/baseElement/flowNode/event';
import type { TEventDefinition } from '../../../src/model/bpmn/json/baseElement/rootElement/eventDefinition';
import type { BpmnJsonModel, TDefinitions } from '../../../src/model/bpmn/json/BPMN20';
import type { TProcess } from '../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import type { TFlowNode } from '../../../src/model/bpmn/json/baseElement/flowElement';
import type { BPMNEdge, BPMNPlane, BPMNShape } from '../../../src/model/bpmn/json/BPMNDI';

type BPMNTEvent = TCatchEvent | TThrowEvent | TBoundaryEvent;
type BPMNEventDefinition = string | TEventDefinition | (string | TEventDefinition)[];

export enum EventDefinitionOn {
  NONE,
  EVENT,
  DEFINITIONS,
  BOTH,
}

export interface BuildEventParameter {
  bpmnKind: string;
  name?: string;
  isInterrupting?: boolean;
  attachedToRef?: string;
  eventDefinitionParameter: BuildEventDefinitionParameter;
}

export interface BuildEventDefinitionParameter {
  eventDefinitionKind?: string;
  eventDefinitionOn: EventDefinitionOn;
  eventDefinition?: BPMNEventDefinition;
  withDifferentDefinition?: boolean;
  withMultipleDefinitions?: boolean;
}

export interface BuildTaskParameter {
  id?: string;
}

export interface BuildCallActivityParameter {
  id?: string;
}

export interface BuildExclusiveGatewayParameter {
  id?: string;
}

export interface BuildProcessParameter {
  task?: BuildTaskParameter | BuildTaskParameter[];
  event?: BuildEventParameter | BuildEventParameter[];
  exclusiveGateway?: BuildExclusiveGatewayParameter | BuildExclusiveGatewayParameter[];
  callActivity?: BuildCallActivityParameter | BuildCallActivityParameter[];
  id?: string;
}

export interface BuildMessageFlowParameter {
  id: string;
  name?: string;
  sourceRef: string;
  targetRef: string;
}

export interface BuildDefinitionParameter {
  process: BuildProcessParameter | BuildProcessParameter[];
  withParticipant?: boolean;
  messageFlows?: BuildMessageFlowParameter | BuildMessageFlowParameter[];
}

export function buildDefinitions({ process, withParticipant, messageFlows }: BuildDefinitionParameter): BpmnJsonModel {
  const json: BpmnJsonModel = {
    definitions: {
      targetNamespace: '',
      collaboration: {
        id: 'collaboration_id_0',
      },
      process: Array.isArray(process) ? [] : undefined,
      BPMNDiagram: {
        name: 'process 0',
        BPMNPlane: {},
      },
    },
  };

  if (withParticipant) {
    (json.definitions.collaboration as TCollaboration).participant = Array.isArray(process) ? [] : undefined;
  }
  (Array.isArray(process) ? process : [process]).forEach((processParameter, index) => addParticipantProcessAndElements(processParameter, withParticipant, json, index));

  if (messageFlows) {
    (Array.isArray(messageFlows) ? messageFlows : [messageFlows]).forEach(messageFlow => addMessageFlow(messageFlow, json));
  }
  return json;
}

function addParticipantProcessAndElements(processParameter: BuildProcessParameter, withParticipant = false, jsonModel: BpmnJsonModel, index: number): void {
  const id = processParameter.id ? processParameter.id : String(index);
  if (withParticipant) {
    addParticipant(id, jsonModel, index);
  }
  updateBpmnElement(
    jsonModel.definitions.process as TProcess | TProcess[],
    { id: withParticipant ? `process_${id}` : id },
    (value: TProcess | TProcess[]) => (jsonModel.definitions.process = value),
  );
  addElementsOnProcess(processParameter, jsonModel, index);
}

function addParticipant(id: string, jsonModel: BpmnJsonModel, index: number): void {
  const collaboration: TCollaboration = getElementOfArray<TProcess>(jsonModel.definitions.collaboration as TCollaboration);

  updateBpmnElement(collaboration.participant, { id: id, processRef: `process_${id}` }, (value: TParticipant | TParticipant[]) => (collaboration.participant = value));

  const shape = {
    id: `shape_${id}`,
    bpmnElement: id,
    Bounds: { x: 567, y: 345, width: 36, height: 45 },
  };
  addShape(jsonModel, shape);
}

function addMessageFlow(messageFlow: BuildMessageFlowParameter, jsonModel: BpmnJsonModel): void {
  const collaboration: TCollaboration = getElementOfArray<TProcess>(jsonModel.definitions.collaboration as TCollaboration);
  updateBpmnElement(collaboration.messageFlow, messageFlow, (value: TMessageFlow | TMessageFlow[]) => (collaboration.messageFlow = value));

  const edge = {
    id: `edge_${messageFlow.id}`,
    bpmnElement: messageFlow.id,
    Bounds: { x: 567, y: 345, width: 36, height: 45 },
    waypoint: [
      { x: 567, y: 345 },
      { x: 587, y: 345 },
    ],
  };
  addEdge(jsonModel, edge);
}

function addElementsOnProcess(processParameter: BuildProcessParameter, json: BpmnJsonModel, processIndex: number): void {
  if (processParameter.task) {
    (Array.isArray(processParameter.task) ? processParameter.task : [processParameter.task]).forEach((taskParameter, index) => addTask(json, taskParameter, index, processIndex));
  }
  if (processParameter.exclusiveGateway) {
    (Array.isArray(processParameter.exclusiveGateway) ? processParameter.exclusiveGateway : [processParameter.exclusiveGateway]).forEach((exclusiveGatewayParameter, index) =>
      addExclusiveGateway(json, exclusiveGatewayParameter, index, processIndex),
    );
  }
  if (processParameter.callActivity) {
    (Array.isArray(processParameter.callActivity) ? processParameter.callActivity : [processParameter.callActivity]).forEach((callActivityParameter, index) =>
      addCallActivity(json, callActivityParameter, index, processIndex),
    );
  }
  if (processParameter.event) {
    (Array.isArray(processParameter.event) ? processParameter.event : [processParameter.event]).forEach((eventParameter, index) =>
      addEvent(json, eventParameter, index, processIndex),
    );
  }
}

function getElementOfArray<T>(object: T | T[], index = 0): T {
  if (Array.isArray(object)) {
    return object[index];
  } else {
    return object;
  }
}

function updateBpmnElement<T>(parentElement: T | T[], childElement: T, setValue: (value: T | T[]) => void): void {
  if (parentElement) {
    if (!Array.isArray(parentElement)) {
      setValue([parentElement, childElement]);
    } else {
      parentElement.push(childElement);
    }
  } else {
    setValue(childElement);
  }
}

function addFlownode(jsonModel: BpmnJsonModel, bpmnKind: string, flowNode: TFlowNode, processIndex?: number): void {
  const process: TProcess = getElementOfArray<TProcess>(jsonModel.definitions.process as TProcess | TProcess[], processIndex);
  updateBpmnElement(process[bpmnKind], flowNode, (value: TFlowNode | TFlowNode[]) => (process[bpmnKind] = value));
}

function addShape(jsonModel: BpmnJsonModel, taskShape: BPMNShape): void {
  const bpmnPlane: BPMNPlane = getElementOfArray(jsonModel.definitions.BPMNDiagram).BPMNPlane;
  updateBpmnElement(bpmnPlane.BPMNShape, taskShape, (value: BPMNShape | BPMNShape[]) => (bpmnPlane.BPMNShape = value));
}

function addEdge(jsonModel: BpmnJsonModel, edge: BPMNEdge): void {
  const bpmnPlane: BPMNPlane = getElementOfArray(jsonModel.definitions.BPMNDiagram).BPMNPlane;
  updateBpmnElement(bpmnPlane.BPMNEdge, edge, (value: BPMNEdge | BPMNEdge[]) => (bpmnPlane.BPMNEdge = value));
}

function addTask(jsonModel: BpmnJsonModel, taskParameter: BuildTaskParameter, index: number, processIndex: number): void {
  const task = {
    id: taskParameter.id ? taskParameter.id : `task_id_${processIndex}_${index}`,
    name: 'task name',
  };
  addFlownode(jsonModel, 'task', task, processIndex);

  const taskShape = {
    id: `shape_${task.id}`,
    bpmnElement: task.id,
    Bounds: { x: 362, y: 232, width: 36, height: 45 },
  };
  addShape(jsonModel, taskShape);
}

function addExclusiveGateway(jsonModel: BpmnJsonModel, exclusiveGatewayParameter: BuildExclusiveGatewayParameter, index: number, processIndex?: number): void {
  const exclusiveGateway = {
    id: exclusiveGatewayParameter.id ? exclusiveGatewayParameter.id : `exclusiveGateway_id_${processIndex}_${index}`,
    name: 'exclusiveGateway name',
  };
  addFlownode(jsonModel, 'exclusiveGateway', exclusiveGateway, processIndex);

  const shape = {
    id: `shape_${exclusiveGateway.id}`,
    bpmnElement: exclusiveGateway.id,
    Bounds: { x: 567, y: 345, width: 25, height: 25 },
  };
  addShape(jsonModel, shape);
}

function addCallActivity(jsonModel: BpmnJsonModel, callActivityParameter: BuildCallActivityParameter, index: number, processIndex: number): void {
  const callActivity = {
    id: callActivityParameter.id ? callActivityParameter.id : `callActivity_id_${processIndex}_${index}`,
    name: 'callActivity name',
  };
  addFlownode(jsonModel, 'callActivity', callActivity, processIndex);

  const shape = {
    id: `shape_${callActivity.id}`,
    bpmnElement: callActivity.id,
    Bounds: { x: 346, y: 856, width: 45, height: 56 },
  };
  addShape(jsonModel, shape);
}

function addEventDefinition(bpmnElement: TDefinitions | BPMNTEvent, eventDefinitionKind: string, eventDefinition: BPMNEventDefinition = ''): TProcess | BPMNTEvent {
  if (eventDefinitionKind !== 'none') {
    bpmnElement[`${eventDefinitionKind}EventDefinition`] = eventDefinition;
  }
  return bpmnElement;
}

function addDifferentEventDefinition(bpmnElement: TDefinitions | BPMNTEvent, eventDefinitionKind: string, differentEventDefinition?: TEventDefinition): TProcess | BPMNTEvent {
  const otherEventDefinition = eventDefinitionKind === 'signal' ? 'message' : 'signal';
  return addEventDefinition(bpmnElement, otherEventDefinition, differentEventDefinition);
}

function addEventDefinitions(
  event: BPMNTEvent,
  { eventDefinitionKind, eventDefinition, withDifferentDefinition = false }: BuildEventDefinitionParameter,
  differentEventDefinition?: TEventDefinition,
): void {
  addEventDefinition(event, eventDefinitionKind, eventDefinition);
  if (withDifferentDefinition) {
    addDifferentEventDefinition(event, eventDefinitionKind, differentEventDefinition);
  }
}

function addEventDefinitionsOnDefinition(jsonModel: BpmnJsonModel, buildParameter: BuildEventDefinitionParameter, event: BPMNTEvent): void {
  if (buildParameter.withDifferentDefinition) {
    addEventDefinitions(jsonModel.definitions, { ...buildParameter, eventDefinition: { id: 'event_definition_id' } }, { id: 'other_event_definition_id' });
    (event.eventDefinitionRef as string[]) = ['event_definition_id', 'other_event_definition_id'];
  } else {
    const eventDefinition = buildParameter.eventDefinition
      ? buildParameter.eventDefinition
      : buildParameter.withMultipleDefinitions
      ? [{ id: 'event_definition_1_id' }, { id: 'event_definition_2_id' }]
      : { id: 'event_definition_id' };
    addEventDefinitions(jsonModel.definitions, { ...buildParameter, eventDefinition });
    event.eventDefinitionRef = Array.isArray(eventDefinition)
      ? eventDefinition.map(eventDefinition => (typeof eventDefinition === 'string' ? eventDefinition : eventDefinition.id))
      : (event.eventDefinitionRef = (eventDefinition as TEventDefinition).id);
  }
}

function addEventDefinitionsOnEvent(event: TCatchEvent | TThrowEvent | TBoundaryEvent, buildParameter: BuildEventDefinitionParameter): void {
  if (buildParameter.withMultipleDefinitions) {
    const eventDefinition = ['', {}];
    addEventDefinitions(event, { ...buildParameter, eventDefinition });
  } else {
    addEventDefinitions(event, buildParameter);
  }
}

function buildEvent(index: number, processIndex: number, name?: string, isInterrupting?: boolean, attachedToRef?: string): BPMNTEvent {
  const event: BPMNTEvent = {
    id: `event_id_${processIndex}_${index}`,
    name: name,
  };

  if (isInterrupting !== undefined) {
    event.cancelActivity = isInterrupting;
  }
  if (attachedToRef) {
    event.attachedToRef = attachedToRef;
  }
  return event;
}

function addEvent(
  jsonModel: BpmnJsonModel,
  { bpmnKind, eventDefinitionParameter, name, isInterrupting, attachedToRef }: BuildEventParameter,
  index: number,
  processIndex: number,
): void {
  const event = buildEvent(index, processIndex, name, isInterrupting, attachedToRef);
  switch (eventDefinitionParameter.eventDefinitionOn) {
    case EventDefinitionOn.BOTH:
      addEventDefinitionsOnEvent(event, eventDefinitionParameter);
      addEventDefinitionsOnDefinition(jsonModel, eventDefinitionParameter, event);
      break;
    case EventDefinitionOn.DEFINITIONS:
      addEventDefinitionsOnDefinition(jsonModel, eventDefinitionParameter, event);
      break;
    case EventDefinitionOn.EVENT:
      addEventDefinitionsOnEvent(event, eventDefinitionParameter);
      break;
    case EventDefinitionOn.NONE:
      break;
  }
  addFlownode(jsonModel, bpmnKind, event, processIndex);

  const eventShape = {
    id: `shape_${event.id}`,
    bpmnElement: event.id,
    Bounds: { x: 362, y: 232, width: 36, height: 45 },
  };
  addShape(jsonModel, eventShape);
}
