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

import { Participant } from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { MessageFlow } from '../../../../model/bpmn/internal/edge/Flow';
import { TCollaboration } from '../../../../model/bpmn/json/baseElement/rootElement/collaboration';
import { TParticipant } from '../../../../model/bpmn/json/baseElement/participant';
import { TMessageFlow } from '../../../../model/bpmn/json/baseElement/baseElement';
import { ConvertedElements } from './utils';
import { ensureIsArray } from '../../../helpers/array-utils';
import { TGroup } from '../../../../model/bpmn/json/baseElement/artifact';

/**
 * @internal
 */
export default class CollaborationConverter {
  constructor(private convertedElements: ConvertedElements) {}

  deserialize(collaborations: string | TCollaboration | (string | TCollaboration)[]): void {
    ensureIsArray(collaborations).forEach(collaboration => this.parseCollaboration(collaboration));
  }

  private parseCollaboration(collaboration: TCollaboration): void {
    this.buildParticipant(collaboration.participant);
    this.buildMessageFlows(collaboration.messageFlow);
    this.buildGroups(collaboration.group);
  }

  private buildParticipant(bpmnElements: Array<TParticipant> | TParticipant): void {
    ensureIsArray(bpmnElements).forEach(participant => {
      this.convertedElements.registerParticipant(new Participant(participant.id, participant.name, participant.processRef));
    });
  }

  private buildMessageFlows(bpmnElements: Array<TMessageFlow> | TMessageFlow): void {
    ensureIsArray(bpmnElements).forEach(messageFlow => {
      this.convertedElements.registerMessageFlow(new MessageFlow(messageFlow.id, messageFlow.name, messageFlow.sourceRef, messageFlow.targetRef));
    });
  }

  private buildGroups(bpmnElements: Array<TGroup> | TGroup): void {
    ensureIsArray(bpmnElements).forEach(groupBpmnElement => {
      const shapeBpmnElement = this.convertedElements.buildShapeBpmnGroup(groupBpmnElement);
      shapeBpmnElement && this.convertedElements.registerFlowNode(shapeBpmnElement);
    });
  }
}
