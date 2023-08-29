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

import type { TTextAnnotation } from '@lib/model/bpmn/json/baseElement/artifact';
import type { TGlobalTask } from '@lib/model/bpmn/json/baseElement/rootElement/globalTask';
import type { TArtifact } from '@lib/model/bpmn/json/baseElement/artifact';
import type { TAssociation } from '@lib/model/bpmn/json/baseElement/artifact';
import type { DiagramElement } from '@lib/model/bpmn/json/di';
import type { TBaseElement, TLane, TLaneSet, TMessageFlow } from '@lib/model/bpmn/json/baseElement/baseElement';
import type { TFlowElement } from '@lib/model/bpmn/json/baseElement/flowElement';
import type { TFlowNode } from '@lib/model/bpmn/json/baseElement/flowElement';
import type { TBoundaryEvent, TCatchEvent, TThrowEvent } from '@lib/model/bpmn/json/baseElement/flowNode/event';
import type { TCollaboration } from '@lib/model/bpmn/json/baseElement/rootElement/collaboration';
import type { TEventDefinition } from '@lib/model/bpmn/json/baseElement/rootElement/eventDefinition';
import type { TProcess } from '@lib/model/bpmn/json/baseElement/rootElement/rootElement';
import type { BpmnJsonModel, TDefinitions } from '@lib/model/bpmn/json/bpmn20';
import type { BPMNEdge, BPMNPlane, BPMNShape } from '@lib/model/bpmn/json/bpmndi';

type BuildProcessElementParameter = (Pick<TFlowNode, 'id' | 'name'> | Pick<TArtifact, 'id'>) & {
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
type BuildEventParameter = {
  eventDefinitionParameter: BuildEventDefinitionParameter;
} & TFlowNode;

type BuildInterruptingEventParameter = {
  isInterrupting?: boolean;
} & BuildEventParameter;

export type BuildEventsParameter = BuildOtherEventParameter | BuildStartEventParameter | BuildBoundaryEventParameter;

export type OtherBuildEventKind = 'endEvent' | 'intermediateCatchEvent' | 'intermediateThrowEvent';
type BuildOtherEventParameter = {
  bpmnKind: OtherBuildEventKind;
} & BuildEventParameter;

type BuildStartEventParameter = {
  bpmnKind: 'startEvent';
} & BuildInterruptingEventParameter;

type BuildBoundaryEventParameter = {
  bpmnKind: 'boundaryEvent';
  attachedToRef: string;
} & BuildInterruptingEventParameter;

export type BuildEventDefinitionParameter = {
  eventDefinitionKind?: string;
  eventDefinitionOn: EventDefinitionOn;
  eventDefinition?: BPMNEventDefinition;
  withDifferentDefinition?: boolean;
  withMultipleDefinitions?: boolean;
};

export type BuildTaskKind = 'task' | 'businessRuleTask' | 'manualTask' | 'receiveTask' | 'sendTask' | 'serviceTask' | 'scriptTask' | 'userTask';
/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `task_id_${processIndex}_${index}`
 */
export type BuildTaskParameter = {
  /** @default 'task' */
  bpmnKind?: BuildTaskKind;
} & TFlowNode;

/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `callActivity_id_${processIndex}_${index}`
 */
export type BuildCallActivityParameter = {
  calledElement: string;

  /** @default false */
  isExpanded?: boolean;
} & TFlowNode;

/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `subProcess_id_${processIndex}_${index}`
 */
export type BuildSubProcessParameter = TFlowNode & {
  triggeredByEvent?: boolean;

  /** @default undefined */
  isExpanded?: boolean;
};

export type BuildGatewayKind = 'complexGateway' | 'eventBasedGateway' | 'exclusiveGateway' | 'inclusiveGateway' | 'parallelGateway';
/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `exclusiveGateway_id_${processIndex}_${index}`
 */
export type BuildGatewayParameter = {
  bpmnKind: BuildGatewayKind;
} & TFlowNode;

/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `lane_id_${processIndex}_${index}`
 */
export type BuildLaneParameter = TFlowElement;

/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `sequence_flow_id_${processIndex}_${index}`
 */
export type BuildSequenceFlowParameter = {
  sourceRef: string;
  targetRef: string;
} & TFlowElement;

/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `association_id_${processIndex}_${index}`
 */
export type BuildAssociationParameter = Pick<TAssociation, 'id' | 'sourceRef' | 'targetRef' | 'associationDirection'>;

/**
 * If the id field is set, the default id is override.
 * Otherwise, the id has the format: `textAnnotation_id_${processIndex}_${index}`
 */
export type BuildTextAnnotationParameter = Pick<TTextAnnotation, 'id' | 'text'>;

export type BuildProcessParameter = {
  lane?: BuildLaneParameter | BuildLaneParameter[];
  task?: BuildTaskParameter | BuildTaskParameter[];
  event?: BuildEventsParameter | BuildEventsParameter[];
  gateway?: BuildGatewayParameter | BuildGatewayParameter[];
  callActivity?: BuildCallActivityParameter | BuildCallActivityParameter[];
  subProcess?: BuildSubProcessParameter | BuildSubProcessParameter[];
  transaction?: BuildSubProcessParameter | BuildSubProcessParameter[];
  adHocSubProcess?: BuildSubProcessParameter | BuildSubProcessParameter[];
  sequenceFlow?: BuildSequenceFlowParameter | BuildSequenceFlowParameter[];
  association?: BuildAssociationParameter | BuildAssociationParameter[];
  textAnnotation?: BuildTextAnnotationParameter | BuildTextAnnotationParameter[];

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
};

export type BuildMessageFlowParameter = {
  id: string;
  name?: string;
  sourceRef: string;
  targetRef: string;
};

export type BpmnGlobalTaskKind = keyof Pick<TDefinitions, 'globalTask' | 'globalBusinessRuleTask' | 'globalManualTask' | 'globalScriptTask' | 'globalUserTask'>;
export type BuildGlobalTaskParameter = {
  id?: string;

  /** @default 'globalTask' */
  bpmnKind?: BpmnGlobalTaskKind;
};

export type BuildDefinitionParameter = {
  process: BuildProcessParameter | BuildProcessParameter[];
  messageFlows?: BuildMessageFlowParameter | BuildMessageFlowParameter[];
  globalTask?: BuildGlobalTaskParameter | BuildGlobalTaskParameter[];
};

export function buildDefinitions({ process, messageFlows, globalTask }: BuildDefinitionParameter): BpmnJsonModel {
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

  if (globalTask) {
    (Array.isArray(globalTask) ? globalTask : [globalTask]).forEach((task, index) => addGlobalTask(task, json, index));
  }
  return json;
}

function addParticipantProcessAndElements(processParameter: BuildProcessParameter, jsonModel: BpmnJsonModel, index: number): void {
  const id = processParameter.id ? processParameter.id : String(index);
  if (processParameter.withParticipant) {
    addParticipant(id, jsonModel);
  }
  jsonModel.definitions.process = enrichBpmnElement(jsonModel.definitions.process as TProcess | TProcess[], { id: processParameter.withParticipant ? `process_${id}` : id });
  addElementsOnProcess(processParameter, jsonModel, index);
}

function addParticipant(id: string, jsonModel: BpmnJsonModel): void {
  const collaboration: TCollaboration = getElementOfArray<TProcess>(jsonModel.definitions.collaboration as TCollaboration);
  collaboration.participant = enrichBpmnElement(collaboration.participant, { id: id, processRef: `process_${id}` });

  const shape = {
    id: `shape_${id}`,
    bpmnElement: id,
    Bounds: { x: 567, y: 345, width: 36, height: 45 },
  };
  addShape(jsonModel, shape);
}

function addMessageFlow(messageFlowParameter: BuildMessageFlowParameter, jsonModel: BpmnJsonModel): void {
  const messageFlow: TMessageFlow = messageFlowParameter;

  const collaboration: TCollaboration = getElementOfArray<TCollaboration>(jsonModel.definitions.collaboration as TCollaboration);
  collaboration.messageFlow = enrichBpmnElement(collaboration.messageFlow, messageFlow);

  addEdge(jsonModel, {
    bpmnElement: messageFlow.id,
    waypoint: [
      { x: 567, y: 345 },
      { x: 587, y: 345 },
    ],
  });
}

const addGlobalTask = ({ id, bpmnKind = 'globalTask', ...rest }: BuildGlobalTaskParameter, jsonModel: BpmnJsonModel, index: number): void => {
  const globalTask: TGlobalTask = {
    id: id ? id : `${bpmnKind}_id_${index}`,
    ...rest,
  };

  const definitions = jsonModel.definitions;
  definitions[bpmnKind] = enrichBpmnElement(definitions[bpmnKind], globalTask);
};

function addElementsOnProcess(processParameter: BuildProcessParameter, json: BpmnJsonModel, processIndex: number): void {
  if (processParameter.lane) {
    addProcessElement(json, 'laneSet', { index: 0, processIndex });

    (Array.isArray(processParameter.lane) ? processParameter.lane : [processParameter.lane]).forEach((laneParameter, index) => {
      addLane(json, laneParameter, index, processIndex);
    });
  }
  if (processParameter.task) {
    (Array.isArray(processParameter.task) ? processParameter.task : [processParameter.task]).forEach(({ bpmnKind = 'task', ...rest }, index) =>
      addProcessElementWithShape(json, bpmnKind, { ...rest, index, processIndex }, { Bounds: { x: 362, y: 232, width: 36, height: 45 } }),
    );
  }
  if (processParameter.gateway) {
    (Array.isArray(processParameter.gateway) ? processParameter.gateway : [processParameter.gateway]).forEach(({ bpmnKind, ...rest }, index) =>
      addProcessElementWithShape(json, bpmnKind, { ...rest, index, processIndex }, { Bounds: { x: 567, y: 345, width: 25, height: 25 } }),
    );
  }
  if (processParameter.callActivity) {
    (Array.isArray(processParameter.callActivity) ? processParameter.callActivity : [processParameter.callActivity]).forEach(({ id, isExpanded = false, ...rest }, index) =>
      addProcessElementWithShape(json, 'callActivity', { id, ...rest, index, processIndex }, { Bounds: { x: 346, y: 856, width: 45, height: 56 }, isExpanded }),
    );
  }
  if (processParameter.subProcess) {
    (Array.isArray(processParameter.subProcess) ? processParameter.subProcess : [processParameter.subProcess]).forEach(({ isExpanded, ...rest }, index) =>
      addProcessElementWithShape(json, 'subProcess', { ...rest, index, processIndex }, { Bounds: { x: 67, y: 23, width: 456, height: 123 }, isExpanded }),
    );
  }
  if (processParameter.transaction) {
    (Array.isArray(processParameter.transaction) ? processParameter.transaction : [processParameter.transaction]).forEach(({ isExpanded, ...rest }, index) =>
      addProcessElementWithShape(json, 'transaction', { ...rest, index, processIndex }, { Bounds: { x: 167, y: 123, width: 456, height: 123 }, isExpanded }),
    );
  }
  if (processParameter.adHocSubProcess) {
    (Array.isArray(processParameter.adHocSubProcess) ? processParameter.adHocSubProcess : [processParameter.adHocSubProcess]).forEach(({ isExpanded, ...rest }, index) =>
      addProcessElementWithShape(json, 'adHocSubProcess', { ...rest, index, processIndex }, { Bounds: { x: 267, y: 223, width: 456, height: 123 }, isExpanded }),
    );
  }
  if (processParameter.event) {
    (Array.isArray(processParameter.event) ? processParameter.event : [processParameter.event]).forEach((eventParameter, index) =>
      addEvent(json, eventParameter, index, processIndex),
    );
  }
  if (processParameter.sequenceFlow) {
    (Array.isArray(processParameter.sequenceFlow) ? processParameter.sequenceFlow : [processParameter.sequenceFlow]).forEach((sequenceFlowParameter, index) =>
      addProcessElementWithEdge(
        json,
        'sequenceFlow',
        { ...sequenceFlowParameter, index, processIndex },
        {
          waypoint: [
            { x: 45, y: 78 },
            { x: 51, y: 78 },
          ],
        },
      ),
    );
  }
  if (processParameter.association) {
    (Array.isArray(processParameter.association) ? processParameter.association : [processParameter.association]).forEach((associationParameter, index) =>
      addProcessElementWithEdge(
        json,
        'association',
        { ...associationParameter, index, processIndex },
        {
          waypoint: [
            { x: 45, y: 78 },
            { x: 51, y: 78 },
          ],
        },
      ),
    );
  }
  if (processParameter.textAnnotation) {
    (Array.isArray(processParameter.textAnnotation) ? processParameter.textAnnotation : [processParameter.textAnnotation]).forEach((textAnnotationParameter, index) =>
      addProcessElementWithShape(json, 'textAnnotation', { ...textAnnotationParameter, index, processIndex }, { Bounds: { x: 456, y: 23, width: 78, height: 54 } }),
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

function enrichBpmnElement<T extends TBaseElement | DiagramElement>(currentElement: T | T[], elementToAdd: T): T | T[] {
  if (!currentElement) {
    return elementToAdd;
  }

  if (Array.isArray(currentElement)) {
    currentElement.push(elementToAdd);
    return currentElement;
  }

  return [currentElement, elementToAdd];
}

function addLane(jsonModel: BpmnJsonModel, { id, name, ...rest }: BuildLaneParameter, index: number, processIndex: number): void {
  const lane: TLane = {
    id: id ? id : `lane_id_${processIndex}_${index}`,
    ...rest,
  };
  if (name) {
    lane.name = name;
  }

  const laneSet = getElementOfArray<TProcess>(jsonModel.definitions.process as TProcess | TProcess[], processIndex).laneSet as TLaneSet;
  laneSet.lane = enrichBpmnElement(laneSet.lane, lane);

  const shape = {
    id: `shape_${lane.id}`,
    bpmnElement: lane.id,
    Bounds: { x: 45, y: 6, width: 456, height: 234 },
  };
  addShape(jsonModel, shape);
}

function addProcessElementWithShape(jsonModel: BpmnJsonModel, bpmnKind: keyof TProcess, processElementParameter: BuildProcessElementParameter, bpmnShape: BPMNShape): void {
  const flowNode = addProcessElement(jsonModel, bpmnKind, processElementParameter);
  addShape(jsonModel, {
    bpmnElement: flowNode.id,
    ...bpmnShape,
  });
}

function addProcessElementWithEdge(jsonModel: BpmnJsonModel, bpmnKind: keyof TProcess, processElementParameter: BuildProcessElementParameter, bpmnEdge: BPMNEdge): void {
  const flowNode = addProcessElement(jsonModel, bpmnKind, processElementParameter);
  addEdge(jsonModel, {
    bpmnElement: flowNode.id,
    ...bpmnEdge,
  });
}

function addProcessElement(jsonModel: BpmnJsonModel, bpmnKind: keyof TProcess, { id, index, processIndex, ...rest }: BuildProcessElementParameter): TFlowNode | TArtifact {
  const processElement: TFlowElement | TArtifact = {
    id: id ? id : `${bpmnKind}_id_${processIndex}_${index}`,
    ...rest,
  };

  const process: TProcess = getElementOfArray<TProcess>(jsonModel.definitions.process as TProcess | TProcess[], processIndex);
  (process[bpmnKind] as TFlowElement | TArtifact | TFlowNode[] | TArtifact[]) = enrichBpmnElement<TFlowElement | TArtifact>(
    process[bpmnKind] as TFlowElement | TArtifact | TFlowNode[] | TArtifact[],
    processElement,
  );
  return processElement;
}

function addShape(jsonModel: BpmnJsonModel, shape: BPMNShape): void {
  const bpmnPlane: BPMNPlane = getElementOfArray(jsonModel.definitions.BPMNDiagram).BPMNPlane;
  bpmnPlane.BPMNShape = enrichBpmnElement(bpmnPlane.BPMNShape, {
    id: `shape_${shape.bpmnElement}`,
    ...shape,
  });
}

function addEdge(jsonModel: BpmnJsonModel, edge: BPMNEdge): void {
  const bpmnPlane: BPMNPlane = getElementOfArray(jsonModel.definitions.BPMNDiagram).BPMNPlane;
  bpmnPlane.BPMNEdge = enrichBpmnElement(bpmnPlane.BPMNEdge, {
    id: `edge_${edge.bpmnElement}`,
    ...edge,
  });
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
  incoming,
  outgoing,
}: {
  id: string;
  name: string;
  index: number;
  processIndex: number;
  isInterrupting?: boolean;
  attachedToRef?: string;
  incoming?: string | string[];
  outgoing?: string | string[];
}): BPMNTEvent {
  const event: BPMNTEvent = {
    id: id ? id : `event_id_${processIndex}_${index}`,
    name: name,
    incoming,
    outgoing,
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

  addProcessElementWithShape(jsonModel, bpmnKind, { ...event, index, processIndex }, { Bounds: { x: 362, y: 232, width: 36, height: 45 } });
}
