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
  private convertedParticipantsByProcessRef: Map<string, Participant> = new Map();
  private convertedMessageFlows: Map<string, MessageFlow> = new Map();

  private convertedFlowNodeBpmnElements: Map<string, ShapeBpmnElement> = new Map();
  private convertedLaneBpmnElements: Map<string, ShapeBpmnElement> = new Map();
  private convertedProcessBpmnElements: Map<string, ShapeBpmnElement> = new Map();
  private convertedSequenceFlows: Map<string, SequenceFlow> = new Map();
  private convertedAssociationFlows: Map<string, AssociationFlow> = new Map();

  private defaultSequenceFlowIds: string[] = [];

  private findFlowNodeBpmnElement(id: string): ShapeBpmnElement {
    return this.convertedFlowNodeBpmnElements.get(id);
  }

  private findLaneBpmnElement(id: string): ShapeBpmnElement {
    return this.convertedLaneBpmnElements.get(id);
  }

  private findProcessBpmnElement(id: string): ShapeBpmnElement {
    return this.convertedProcessBpmnElements.get(id);
  }

  private findSequenceFlow(id: string): SequenceFlow {
    return this.convertedSequenceFlows.get(id);
  }

  private findAssociationFlow(id: string): AssociationFlow {
    return this.convertedAssociationFlows.get(id);
  }

  private eventDefinitionsOfDefinitions: Map<string, ShapeBpmnEventKind> = new Map();

  private globalTaskIds: string[] = [];

  private isGlobalTask(id: string): boolean {
    return this.globalTaskIds.includes(id);
  }

  private findEventDefinitionOfDefinitions(id: string): ShapeBpmnEventKind {
    return this.eventDefinitionsOfDefinitions.get(id);
  }

  private findProcessRefParticipant(id: string): Participant {
    return this.convertedParticipantsById.get(id);
  }

  findProcessRefParticipantByProcessRef(processRef: string): Participant {
    return this.convertedParticipantsByProcessRef.get(processRef);
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

  findMessageFlow(id: string): MessageFlow {
    return this.convertedMessageFlows.get(id);
  }
}
