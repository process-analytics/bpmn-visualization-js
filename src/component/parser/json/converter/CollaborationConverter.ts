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
import { Participant } from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { MessageFlow } from '../../../../model/bpmn/edge/Flow';
import { TCollaboration } from '../../xml/bpmn-json-model/baseElement/rootElement/collaboration';
import { TParticipant } from '../../xml/bpmn-json-model/baseElement/participant';
import { TMessageFlow } from '../../xml/bpmn-json-model/baseElement/baseElement';
import { ensureIsArray } from './ConverterUtil';

const convertedParticipantsById: Map<string, Participant> = new Map();
const convertedParticipantsByProcessRef: Map<string, Participant> = new Map();
const convertedMessageFlows: Map<string, MessageFlow> = new Map();

export function findProcessRefParticipant(id: string): Participant {
  return convertedParticipantsById.get(id);
}

export function findProcessRefParticipantByProcessRef(processRef: string): Participant {
  return convertedParticipantsByProcessRef.get(processRef);
}

export function findMessageFlow(id: string): MessageFlow {
  return convertedMessageFlows.get(id);
}

export default class CollaborationConverter {
  deserialize(collaborations: string | TCollaboration | (string | TCollaboration)[]): void {
    try {
      convertedParticipantsById.clear();
      convertedParticipantsByProcessRef.clear();
      convertedMessageFlows.clear();

      ensureIsArray(collaborations).forEach((collaboration) => this.parseCollaboration(collaboration));
    } catch (e) {
      // TODO error management
      console.error(e as Error);
    }
  }

  private parseCollaboration(collaboration: TCollaboration): void {
    this.buildParticipant(collaboration.participant);
    this.buildMessageFlows(collaboration.messageFlow);
  }

  private buildParticipant(bpmnElements: Array<TParticipant> | TParticipant): void {
    ensureIsArray(bpmnElements).forEach((participant) => {
      if (participant.processRef) {
        const convertedParticipant = new Participant(participant.id, participant.name, participant.processRef);
        convertedParticipantsById.set(participant.id, convertedParticipant);
        convertedParticipantsByProcessRef.set(participant.processRef, convertedParticipant);
      }
    });
  }

  private buildMessageFlows(bpmnElements: Array<TMessageFlow> | TMessageFlow): void {
    ensureIsArray(bpmnElements).forEach((messageFlow) => {
      const convertedMessageFlow = new MessageFlow(messageFlow.id, messageFlow.name, messageFlow.sourceRef, messageFlow.targetRef);
      convertedMessageFlows.set(messageFlow.id, convertedMessageFlow);
    });
  }
}
