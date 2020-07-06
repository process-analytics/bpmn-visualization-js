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
import { JsonConverter } from 'json2typescript';
import { AbstractConverter, ensureIsArray } from './AbstractConverter';
import { Participant } from '../../../../model/bpmn/shape/ShapeBpmnElement';
import { Collaboration } from '../Definitions';
import { MessageFlow } from '../../../../model/bpmn/edge/Flow';
import { FlowKind } from '../../../../model/bpmn/edge/FlowKind';

const convertedProcessRefParticipants: Participant[] = [];
const convertedMessageFlows: MessageFlow[] = [];

export function findProcessRefParticipant(id: string): Participant {
  return convertedProcessRefParticipants.find(i => i.id === id);
}

export function findProcessRefParticipantByProcessRef(processRef: string): Participant {
  return convertedProcessRefParticipants.find(i => i.processRef === processRef);
}

export function findMessageFlow(id: string): MessageFlow {
  return convertedMessageFlows.find(i => i.id === id);
}

@JsonConverter
export default class CollaborationConverter extends AbstractConverter<Collaboration> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deserialize(collaboration: any): Collaboration {
    try {
      // Deletes everything in the array, which does hit other references. For better performance.
      convertedProcessRefParticipants.length = 0;
      convertedMessageFlows.length = 0;

      this.buildParticipant(collaboration['participant']);
      this.buildMessageFlows(collaboration[FlowKind.MESSAGE_FLOW]);

      return {};
    } catch (e) {
      // TODO error management
      console.error(e as Error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildParticipant(bpmnElements: Array<any> | any): void {
    ensureIsArray(bpmnElements).forEach(participant => {
      if (participant.processRef) {
        convertedProcessRefParticipants.push(new Participant(participant.id, participant.name, participant.processRef));
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private buildMessageFlows(bpmnElements: Array<any> | any): void {
    ensureIsArray(bpmnElements).forEach(messageFlow => {
      const convertedMessageFlow = new MessageFlow(messageFlow.id, messageFlow.name, messageFlow.sourceRef, messageFlow.targetRef);
      convertedMessageFlows.push(convertedMessageFlow);
    });
  }
}
