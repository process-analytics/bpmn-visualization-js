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
  private convertedParticipantsById: Map<string, Participant> = new Map();
  private findProcessRefParticipant(id: string): Participant {
    return this.convertedParticipantsById.get(id);
  }

  private convertedParticipantsByProcessRef: Map<string, Participant> = new Map();
  findProcessRefParticipantByProcessRef(processRef: string): Participant {
    return this.convertedParticipantsByProcessRef.get(processRef);
  }

  registerParticipant(participant: Participant): void {
    this.convertedParticipantsById.set(participant.id, participant);
    if (participant.processRef) {
      this.convertedParticipantsByProcessRef.set(participant.processRef, participant);
    }
  }

  private convertedMessageFlows: Map<string, MessageFlow> = new Map();
  findMessageFlow(id: string): MessageFlow {
    return this.convertedMessageFlows.get(id);
  }
  registerMessageFlow(messageFlow: MessageFlow): void {
    this.convertedMessageFlows.set(messageFlow.id, messageFlow);
  }

  private convertedFlowNodeBpmnElements: Map<string, ShapeBpmnElement> = new Map();
  findFlowNodeBpmnElement(id: string): ShapeBpmnElement {
    return this.convertedFlowNodeBpmnElements.get(id);
  }
  registerFlowNode(flowNode: ShapeBpmnElement): void {
    this.convertedFlowNodeBpmnElements.set(flowNode.id, flowNode);
  }

  private convertedLaneBpmnElements: Map<string, ShapeBpmnElement> = new Map();
  findLaneBpmnElement(id: string): ShapeBpmnElement {
    return this.convertedLaneBpmnElements.get(id);
  }
  registerLane(lane: ShapeBpmnElement): void {
    this.convertedLaneBpmnElements.set(lane.id, lane);
  }

  private convertedProcessBpmnElements: Map<string, ShapeBpmnElement> = new Map();
  findProcessBpmnElement(id: string): ShapeBpmnElement {
    return this.convertedProcessBpmnElements.get(id);
  }
  registerProcess(process: ShapeBpmnElement): void {
    this.convertedProcessBpmnElements.set(process.id, process);
  }

  private convertedSequenceFlows: Map<string, SequenceFlow> = new Map();
  findSequenceFlow(id: string): SequenceFlow {
    return this.convertedSequenceFlows.get(id);
  }
  registerSequenceFlow(sequenceFlow: SequenceFlow): void {
    this.convertedSequenceFlows.set(sequenceFlow.id, sequenceFlow);
  }

  private convertedAssociationFlows: Map<string, AssociationFlow> = new Map();
  findAssociationFlow(id: string): AssociationFlow {
    return this.convertedAssociationFlows.get(id);
  }
  registerSAssociationFlow(associationFlow: AssociationFlow): void {
    this.convertedAssociationFlows.set(associationFlow.id, associationFlow);
  }

  private eventDefinitionsOfDefinitions: Map<string, ShapeBpmnEventKind> = new Map();

  private globalTaskIds: string[] = [];
  isGlobalTask(id: string): boolean {
    return this.globalTaskIds.includes(id);
  }
  registerGlobalTask(id: string): void {
    this.globalTaskIds.push(id);
  }

  private findEventDefinitionOfDefinitions(id: string): ShapeBpmnEventKind {
    return this.eventDefinitionsOfDefinitions.get(id);
  }

  findProcessElement(participantId: string): ShapeBpmnElement | undefined {
    const participant = this.findProcessRefParticipant(participantId);
    if (participant) {
      const originalProcessBpmnElement = this.findProcessBpmnElement(participant.processRef);
      if (originalProcessBpmnElement) {
        const name = participant.name || originalProcessBpmnElement.name;
        return new ShapeBpmnElement(participant.id, name, originalProcessBpmnElement.kind, originalProcessBpmnElement.parentId);
      }
      // black box pool
      return new ShapeBpmnElement(participant.id, participant.name, ShapeBpmnElementKind.POOL);
    }
  }
}
