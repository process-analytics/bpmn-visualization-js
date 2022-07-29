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

import type { DiagramElement } from '../../../src/model/bpmn/json/DI';
import type { TBaseElement, TMessageFlow } from '../../../src/model/bpmn/json/baseElement/baseElement';
import type { TFlowElement } from '../../../src/model/bpmn/json/baseElement/flowElement';
import type { TFlowNode } from '../../../src/model/bpmn/json/baseElement/flowElement';
import type { TBoundaryEvent, TCatchEvent, TThrowEvent } from '../../../src/model/bpmn/json/baseElement/flowNode/event';
import type { TParticipant } from '../../../src/model/bpmn/json/baseElement/participant';
import type { TCollaboration } from '../../../src/model/bpmn/json/baseElement/rootElement/collaboration';
import type { TEventDefinition } from '../../../src/model/bpmn/json/baseElement/rootElement/eventDefinition';
import type { TProcess } from '../../../src/model/bpmn/json/baseElement/rootElement/rootElement';
import type { BpmnJsonModel } from '../../../src/model/bpmn/json/BPMN20';
import type { BPMNEdge, BPMNPlane, BPMNShape } from '../../../src/model/bpmn/json/BPMNDI';

type BuildFlownodeParameter = TFlowNode & {
  index: number;
  processIndex: number;
};

type BPMNTEvent = TCatchEvent | TThrowEvent | TBoundaryEvent;
type BPMNEventDefinition = string | TEventDefinition | (string | TEventDefinition)[];

export enum EventDefinitionOn {
  NONE,
  EVENT,
  DEFINITIONS,
  BOTH,
}

/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `event_id_${processIndex}_${index}`
 */
interface BuildEventParameter extends TFlowElement {
  eventDefinitionParameter: BuildEventDefinitionParameter;
}

interface BuildInterruptingEventParameter extends BuildEventParameter {
  isInterrupting?: boolean;
}

export type BuildEventsParameter = BuildOtherEventParameter | BuildStartEventParameter | BuildBoundaryEventParameter;

export type OtherBuildEventKind = 'endEvent' | 'intermediateCatchEvent' | 'intermediateThrowEvent';
interface BuildOtherEventParameter extends BuildEventParameter {
  bpmnKind: OtherBuildEventKind;
}

interface BuildStartEventParameter extends BuildInterruptingEventParameter {
  bpmnKind: 'startEvent';
}

interface BuildBoundaryEventParameter extends BuildInterruptingEventParameter {
  bpmnKind: 'boundaryEvent';
  attachedToRef: string;
}

export interface BuildEventDefinitionParameter {
  eventDefinitionKind?: string;
  eventDefinitionOn: EventDefinitionOn;
  eventDefinition?: BPMNEventDefinition;
  withDifferentDefinition?: boolean;
  withMultipleDefinitions?: boolean;
}

export type BuildTaskKind = 'task' | 'businessRuleTask' | 'manualTask' | 'receiveTask' | 'sendTask' | 'serviceTask' | 'scriptTask' | 'userTask';
/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `task_id_${processIndex}_${index}`
 */
export interface BuildTaskParameter extends TFlowElement {
  /** @default 'task' */
  bpmnKind?: BuildTaskKind;
}

/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `callActivity_id_${processIndex}_${index}`
 */
export interface BuildCallActivityParameter extends TFlowElement {
  calledElement: string;

  /** @default false */
  isExpanded?: boolean;
}

/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `subProcess_id_${processIndex}_${index}`
 */
export type BuildSubProcessParameter = TFlowElement;

export type BuildGatewayKind = 'complexGateway' | 'eventBasedGateway' | 'exclusiveGateway' | 'inclusiveGateway' | 'parallelGateway';
/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `exclusiveGateway_id_${processIndex}_${index}`
 */
export interface BuildGatewayParameter extends TFlowElement {
  bpmnKind: BuildGatewayKind;
}

export interface BuildProcessParameter {
  task?: BuildTaskParameter | BuildTaskParameter[];
  event?: BuildEventsParameter | BuildEventsParameter[];
  gateway?: BuildGatewayParameter | BuildGatewayParameter[];
  callActivity?: BuildCallActivityParameter | BuildCallActivityParameter[];
  subProcess?: BuildSubProcessParameter | BuildSubProcessParameter[];

  /**
   * - If `withParticipant` of `BuildDefinitionParameter` is false, it's corresponding to the id of the process.
   * - Otherwise, it's corresponding to the id of the participant.
   *
   * @example No participant
   * const json = buildDefinitions({
   *  withParticipant: false,
   *  process: {
   *    id: 'process_id_0',
   *  },
   * });
   *
   * Result:
   * {
   *  definitions: {
   *    targetNamespace: '',
   *    collaboration: {
   *      id: 'collaboration_id_0',
   *    },
   *    process: {
   *      id: 'process_id_0',
   *    },
   *    BPMNDiagram: {
   *      name: 'process 0',
   *      BPMNPlane: {},
   *    },
   *  },
   * }
   *
   * @example With participant
   * const json = buildDefinitions({
   *  withParticipant: true,
   *  process: {
   *    id: 'process_id_0',
   *  },
   * });
   *
   * Result:
   * {
   *  definitions: {
   *    targetNamespace: '',
   *    collaboration: {
   *      id: 'collaboration_id_0',
   *      participant: { id: 'participant_id_0', processRef: 'process_participant_id_0' },
   *    },
   *    process: {
   *      id: 'process_participant_id_0',
   *    },
   *    BPMNDiagram: {
   *      name: 'process 0',
   *      BPMNPlane: {
   *        BPMNShape: {
   *          id: 'shape_participant_id_0',
   *          bpmnElement: 'participant_id_0',
   *          Bounds: { x: 567, y: 345, width: 36, height: 45 },
   *        },
   *      },
   *    },
   *  },
   * }
   **/
  id?: string;

  /** @default false */
  withParticipant?: boolean;
}

export interface BuildMessageFlowParameter {
  id: string;
  name?: string;
  sourceRef: string;
  targetRef: string;
}

export interface BuildDefinitionParameter {
  process: BuildProcessParameter | BuildProcessParameter[];
  messageFlows?: BuildMessageFlowParameter | BuildMessageFlowParameter[];
}

export function buildDefinitions({ process, messageFlows }: BuildDefinitionParameter): BpmnJsonModel {
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

  if (Array.isArray(process) && process.filter(p => p.withParticipant).length > 0) {
    (json.definitions.collaboration as TCollaboration).participant = [];
  }
  (Array.isArray(process) ? process : [process]).forEach((processParameter, index) => addParticipantProcessAndElements(processParameter, json, index));

  if (messageFlows) {
    (Array.isArray(messageFlows) ? messageFlows : [messageFlows]).forEach(messageFlow => addMessageFlow(messageFlow, json));
  }
  return json;
}

function addParticipantProcessAndElements(processParameter: BuildProcessParameter, jsonModel: BpmnJsonModel, index: number): void {
  const id = processParameter.id ? processParameter.id : String(index);
  if (processParameter.withParticipant) {
    addParticipant(id, jsonModel);
  }
  updateBpmnElement(
    jsonModel.definitions.process as TProcess | TProcess[],
    { id: processParameter.withParticipant ? `process_${id}` : id },
    (value: TProcess | TProcess[]) => (jsonModel.definitions.process = value),
  );
  addElementsOnProcess(processParameter, jsonModel, index);
}

function addParticipant(id: string, jsonModel: BpmnJsonModel): void {
  const collaboration: TCollaboration = getElementOfArray<TProcess>(jsonModel.definitions.collaboration as TCollaboration);
  updateBpmnElement(collaboration.participant, { id: id, processRef: `process_${id}` }, (value: TParticipant | TParticipant[]) => (collaboration.participant = value));

  const shape = {
    id: `shape_${id}`,
    bpmnElement: id,
    Bounds: { x: 567, y: 345, width: 36, height: 45 },
  };
  addShape(jsonModel, shape);
}

function addMessageFlow(messageFlowParameter: BuildMessageFlowParameter, jsonModel: BpmnJsonModel): void {
  const messageFlow: TMessageFlow = messageFlowParameter;

  const collaboration: TCollaboration = getElementOfArray<TProcess>(jsonModel.definitions.collaboration as TCollaboration);
  updateBpmnElement(collaboration.messageFlow, messageFlow, (value: TMessageFlow | TMessageFlow[]) => (collaboration.messageFlow = value));

  addEdge(jsonModel, {
    bpmnElement: messageFlow.id,
    waypoint: [
      { x: 567, y: 345 },
      { x: 587, y: 345 },
    ],
  });
}

function addElementsOnProcess(processParameter: BuildProcessParameter, json: BpmnJsonModel, processIndex: number): void {
  if (processParameter.task) {
    (Array.isArray(processParameter.task) ? processParameter.task : [processParameter.task]).forEach(({ bpmnKind = 'task', ...rest }, index) =>
      addFlownodeAndShape(json, bpmnKind, { ...rest, index, processIndex }, { Bounds: { x: 362, y: 232, width: 36, height: 45 } }),
    );
  }
  if (processParameter.gateway) {
    (Array.isArray(processParameter.gateway) ? processParameter.gateway : [processParameter.gateway]).forEach(({ bpmnKind, ...rest }, index) =>
      addFlownodeAndShape(json, bpmnKind, { ...rest, index, processIndex }, { Bounds: { x: 567, y: 345, width: 25, height: 25 } }),
    );
  }
  if (processParameter.callActivity) {
    (Array.isArray(processParameter.callActivity) ? processParameter.callActivity : [processParameter.callActivity]).forEach(({ id, isExpanded = false, ...rest }, index) =>
      addFlownodeAndShape(json, 'callActivity', { id, ...rest, index, processIndex }, { Bounds: { x: 346, y: 856, width: 45, height: 56 }, isExpanded }),
    );
  }
  if (processParameter.subProcess) {
    (Array.isArray(processParameter.subProcess) ? processParameter.subProcess : [processParameter.subProcess]).forEach((subProcessParameter, index) =>
      addFlownodeAndShape(json, 'subProcess', { ...subProcessParameter, index, processIndex }, { Bounds: { x: 67, y: 23, width: 456, height: 123 } }),
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

function updateBpmnElement<T extends TBaseElement | DiagramElement>(parentElement: T | T[], childElement: T, setValue: (value: T | T[]) => void): void {
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

function addFlownodeAndShape(jsonModel: BpmnJsonModel, bpmnKind: keyof TProcess, flownodeParameter: BuildFlownodeParameter, bpmnShape: BPMNShape): void {
  const flowNode = addFlownode(jsonModel, bpmnKind, flownodeParameter);
  addShape(jsonModel, {
    bpmnElement: flowNode.id,
    ...bpmnShape,
  });
}

function addFlownode(jsonModel: BpmnJsonModel, bpmnKind: keyof TProcess, { id, name, index, processIndex, ...rest }: BuildFlownodeParameter): TFlowNode {
  const flowNode: TFlowNode = {
    id: id ? id : `${bpmnKind}_id_${processIndex}_${index}`,
    ...rest,
  };
  if (name) {
    flowNode.name = name;
  }

  const process: TProcess = getElementOfArray<TProcess>(jsonModel.definitions.process as TProcess | TProcess[], processIndex);
  updateBpmnElement(process[bpmnKind], flowNode, (value: TFlowNode | TFlowNode[]) => (process[bpmnKind] = value));
  return flowNode;
}

function addShape(jsonModel: BpmnJsonModel, shape: BPMNShape): void {
  const bpmnPlane: BPMNPlane = getElementOfArray(jsonModel.definitions.BPMNDiagram).BPMNPlane;
  updateBpmnElement(
    bpmnPlane.BPMNShape,
    {
      id: `shape_${shape.bpmnElement}`,
      ...shape,
    },
    (value: BPMNShape | BPMNShape[]) => (bpmnPlane.BPMNShape = value),
  );
}

function addEdge(jsonModel: BpmnJsonModel, edge: BPMNEdge): void {
  const bpmnPlane: BPMNPlane = getElementOfArray(jsonModel.definitions.BPMNDiagram).BPMNPlane;
  updateBpmnElement(
    bpmnPlane.BPMNEdge,
    {
      id: `edge_${edge.bpmnElement}`,
      ...edge,
    },
    (value: BPMNEdge | BPMNEdge[]) => (bpmnPlane.BPMNEdge = value),
  );
}

function addEventDefinitions(
  event: BPMNTEvent,
  { eventDefinitionKind, eventDefinition = '', withDifferentDefinition = false }: BuildEventDefinitionParameter,
  differentEventDefinition: TEventDefinition | string = '',
): void {
  if (eventDefinitionKind !== 'none') {
    event[`${eventDefinitionKind}EventDefinition`] = eventDefinition;
  }
  if (withDifferentDefinition) {
    const otherEventDefinition = eventDefinitionKind === 'signal' ? 'message' : 'signal';
    event[`${otherEventDefinition}EventDefinition`] = differentEventDefinition;
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

function buildEvent({
  id,
  name,
  index,
  processIndex,
  isInterrupting,
  attachedToRef,
}: {
  id: string;
  name: string;
  index: number;
  processIndex: number;
  isInterrupting?: boolean;
  attachedToRef?: string;
}): BPMNTEvent {
  const event: BPMNTEvent = {
    id: id ? id : `event_id_${processIndex}_${index}`,
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
  { id, bpmnKind, eventDefinitionParameter, name, ...rest }: BuildOtherEventParameter | BuildStartEventParameter | BuildBoundaryEventParameter,
  index: number,
  processIndex: number,
): void {
  const event = buildEvent({ id, name, index, processIndex, ...rest });
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

  addFlownodeAndShape(jsonModel, bpmnKind, { ...event, index, processIndex }, { Bounds: { x: 362, y: 232, width: 36, height: 45 } });
}
