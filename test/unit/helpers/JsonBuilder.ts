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
import type { TBoundaryEvent, TCatchEvent, TThrowEvent } from '../../../src/model/bpmn/json/baseElement/flowNode/event';
import type { TEventDefinition } from '../../../src/model/bpmn/json/baseElement/rootElement/eventDefinition';
import type { BpmnJsonModel, TDefinitions } from '../../../src/model/bpmn/json/BPMN20';
import type { TProcess } from '../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import type { TFlowNode } from '../../../src/model/bpmn/json/baseElement/flowElement';
import type { BPMNPlane, BPMNShape } from '../../../src/model/bpmn/json/BPMNDI';

type BPMNTEvent = TCatchEvent | TThrowEvent | TBoundaryEvent;
type BPMNEventDefinition = string | TEventDefinition | (string | TEventDefinition)[];

export enum EventDefinitionOn {
  NONE,
  EVENT,
  DEFINITIONS,
  BOTH,
}

export interface BuildEventParameter {
  index?: number;
  name?: string;
  isInterrupting?: boolean;
  attachedToRef?: string;
}

export interface BuildEventDefinitionParameter {
  eventDefinitionKind: string;
  eventDefinitionOn: EventDefinitionOn;
  eventDefinition?: BPMNEventDefinition;
  withDifferentDefinition?: boolean;
  withMultipleDefinitions?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getElementOfArray(object: any, processIndex = 0): any {
  if (Array.isArray(object)) {
    return object[processIndex];
  } else {
    return object;
  }
}

export function updateBpmnElement<T>(parentElement: T | T[], childElement: T, setValue: (value: T | T[]) => void): void {
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

export function addFlownode(jsonModel: BpmnJsonModel, bpmnKind: string, flowNode: TFlowNode, processIndex?: number): void {
  const process: TProcess = getElementOfArray(jsonModel.definitions.process, processIndex);
  updateBpmnElement(process[bpmnKind], flowNode, (value: TFlowNode | TFlowNode[]) => (process[bpmnKind] = value));
}

export function addShape(jsonModel: BpmnJsonModel, taskShape: BPMNShape, processIndex?: number): void {
  const bpmnPlane: BPMNPlane = getElementOfArray(jsonModel.definitions.BPMNDiagram, processIndex).BPMNPlane;
  updateBpmnElement(bpmnPlane.BPMNShape, taskShape, (value: BPMNShape | BPMNShape[]) => (bpmnPlane.BPMNShape = value));
}

export function addTask(jsonModel: BpmnJsonModel, processIndex?: number): void {
  const task = {
    id: 'task_id_0',
    name: 'task name',
  };
  addFlownode(jsonModel, 'task', task, processIndex);

  const taskShape = {
    id: 'shape_task_id_0',
    bpmnElement: 'task_id_0',
    Bounds: { x: 362, y: 232, width: 36, height: 45 },
  };
  addShape(jsonModel, taskShape, processIndex);
}

export function buildDefinitionsAndProcessWithTask(process: TProcess | TProcess[] = {}): BpmnJsonModel {
  const json: BpmnJsonModel = {
    definitions: {
      targetNamespace: '',
      process: process,
      BPMNDiagram: {
        name: 'process 0',
        BPMNPlane: {},
      },
    },
  };
  addTask(json);
  return json;
}

export function addEventDefinition(bpmnElement: TDefinitions | BPMNTEvent, eventDefinitionKind: string, eventDefinition: BPMNEventDefinition = ''): TProcess | BPMNTEvent {
  if (eventDefinitionKind !== 'none') {
    bpmnElement[`${eventDefinitionKind}EventDefinition`] = eventDefinition;
  }
  return bpmnElement;
}

export function addDifferentEventDefinition(
  bpmnElement: TDefinitions | BPMNTEvent,
  eventDefinitionKind: string,
  differentEventDefinition?: TEventDefinition,
): TProcess | BPMNTEvent {
  const otherEventDefinition = eventDefinitionKind === 'signal' ? 'message' : 'signal';
  return addEventDefinition(bpmnElement, otherEventDefinition, differentEventDefinition);
}

export function addEventDefinitions(
  event: BPMNTEvent,
  { eventDefinitionKind, eventDefinition, withDifferentDefinition = false }: BuildEventDefinitionParameter,
  differentEventDefinition?: TEventDefinition,
): void {
  addEventDefinition(event, eventDefinitionKind, eventDefinition);
  if (withDifferentDefinition) {
    addDifferentEventDefinition(event, eventDefinitionKind, differentEventDefinition);
  }
}

export function addEventDefinitionsOnDefinition(jsonModel: BpmnJsonModel, buildParameter: BuildEventDefinitionParameter, event: BPMNTEvent): void {
  if (buildParameter.withDifferentDefinition) {
    addEventDefinitions(jsonModel.definitions, { ...buildParameter, eventDefinition: { id: 'event_definition_id' } }, { id: 'other_event_definition_id' });
    (event.eventDefinitionRef as string[]) = ['event_definition_id', 'other_event_definition_id'];
  } else {
    let eventDefinition = buildParameter.eventDefinition;
    if (buildParameter.withMultipleDefinitions) {
      eventDefinition = eventDefinition ? eventDefinition : [{ id: 'event_definition_1_id' }, { id: 'event_definition_2_id' }];
    } else {
      eventDefinition = eventDefinition ? eventDefinition : { id: 'event_definition_id' };
    }
    addEventDefinitions(jsonModel.definitions, { ...buildParameter, eventDefinition });
    if (Array.isArray(eventDefinition)) {
      event.eventDefinitionRef = eventDefinition.map(eventDefinition => (typeof eventDefinition === 'string' ? eventDefinition : eventDefinition.id));
    } else {
      event.eventDefinitionRef = (eventDefinition as TEventDefinition).id;
    }
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

export function buildEvent({ index = 0, name, isInterrupting, attachedToRef }: BuildEventParameter = {}): BPMNTEvent {
  const event: BPMNTEvent = {
    id: `event_id_${index}`,
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

export function addEvent(
  jsonModel: BpmnJsonModel,
  bpmnKind: string,
  eventDefinitionParameter: BuildEventDefinitionParameter,
  eventParameter: BuildEventParameter,
  processIndex?: number,
): void {
  const event = buildEvent(eventParameter);
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

  const index = eventParameter.index ? eventParameter.index : 0;
  const eventShape = {
    id: `shape_event_id_${index}`,
    bpmnElement: `event_id_${index}`,
    Bounds: { x: 362, y: 232, width: 36, height: 45 },
  };
  addShape(jsonModel, eventShape, processIndex);
}
