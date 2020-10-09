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
import ShapeBpmnElement, { Participant } from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { AssociationFlow, MessageFlow, SequenceFlow } from '../../../../model/bpmn/internal/edge/Flow';
import { ShapeBpmnElementKind, ShapeBpmnEventKind } from '../../../../model/bpmn/internal/shape';

function convertEmptyStringAndObject<T>(element: string | T, acceptEmptyString: boolean): T {
  if (element === '') {
    return acceptEmptyString ? ({} as T) : undefined;
  }
  return element as T;
}

export function ensureIsArray<T>(elements: (T | string)[] | T | string, acceptEmptyString = false): Array<T> {
  if (elements === undefined || elements === null) {
    return [];
  }

  let returnedArray;
  if (!Array.isArray(elements)) {
    returnedArray = [convertEmptyStringAndObject(elements, acceptEmptyString)];
  } else {
    returnedArray = elements.map(element => convertEmptyStringAndObject(element, acceptEmptyString));
  }
  return returnedArray.filter(value => value);
}

export class ConvertedElements {
  private participantsById: Map<string, Participant> = new Map();
  private findParticipantById(id: string): Participant {
    return this.participantsById.get(id);
  }

  private participantsByProcessRef: Map<string, Participant> = new Map();
  findParticipantByProcessRef(processRef: string): Participant {
    return this.participantsByProcessRef.get(processRef);
  }

  registerParticipant(participant: Participant): void {
    this.participantsById.set(participant.id, participant);
    if (participant.processRef) {
      this.participantsByProcessRef.set(participant.processRef, participant);
    }
  }

  private processes: Map<string, ShapeBpmnElement> = new Map();
  private findProcess(id: string): ShapeBpmnElement {
    return this.processes.get(id);
  }
  registerProcess(process: ShapeBpmnElement): void {
    this.processes.set(process.id, process);
  }

  findProcessElement(participantId: string): ShapeBpmnElement | undefined {
    const participant = this.findParticipantById(participantId);
    if (participant) {
      const process = this.findProcess(participant.processRef);
      if (process) {
        const name = participant.name || process.name;
        return new ShapeBpmnElement(participant.id, name, process.kind, process.parentId);
      }
      // black box pool
      return new ShapeBpmnElement(participant.id, participant.name, ShapeBpmnElementKind.POOL);
    }
  }

  private messageFlows: Map<string, MessageFlow> = new Map();
  findMessageFlow(id: string): MessageFlow {
    return this.messageFlows.get(id);
  }
  registerMessageFlow(messageFlow: MessageFlow): void {
    this.messageFlows.set(messageFlow.id, messageFlow);
  }

  private flowNodes: Map<string, ShapeBpmnElement> = new Map();
  findFlowNodeBpmnElement(id: string): ShapeBpmnElement {
    return this.flowNodes.get(id);
  }
  registerFlowNode(flowNode: ShapeBpmnElement): void {
    this.flowNodes.set(flowNode.id, flowNode);
  }

  private lanes: Map<string, ShapeBpmnElement> = new Map();
  findLaneBpmnElement(id: string): ShapeBpmnElement {
    return this.lanes.get(id);
  }
  registerLane(lane: ShapeBpmnElement): void {
    this.lanes.set(lane.id, lane);
  }

  private sequenceFlows: Map<string, SequenceFlow> = new Map();
  findSequenceFlow(id: string): SequenceFlow {
    return this.sequenceFlows.get(id);
  }
  registerSequenceFlow(sequenceFlow: SequenceFlow): void {
    this.sequenceFlows.set(sequenceFlow.id, sequenceFlow);
  }

  private associationFlows: Map<string, AssociationFlow> = new Map();
  findAssociationFlow(id: string): AssociationFlow {
    return this.associationFlows.get(id);
  }
  registerSAssociationFlow(associationFlow: AssociationFlow): void {
    this.associationFlows.set(associationFlow.id, associationFlow);
  }

  private eventDefinitionsOfDefinitions: Map<string, ShapeBpmnEventKind> = new Map();
  findEventDefinitionOfDefinitions(id: string): ShapeBpmnEventKind {
    return this.eventDefinitionsOfDefinitions.get(id);
  }
  registerEventDefinitionsOfDefinitions(id: string, eventDefinition: ShapeBpmnEventKind): void {
    this.eventDefinitionsOfDefinitions.set(id, eventDefinition);
  }

  private globalTaskIds: string[] = [];
  isGlobalTask(id: string): boolean {
    return this.globalTaskIds.includes(id);
  }
  registerGlobalTask(id: string): void {
    this.globalTaskIds.push(id);
  }
}
