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

import { MessageFlow } from '../../../../model/bpmn/internal/edge/flows';
import type { TCollaboration } from '../../../../model/bpmn/json/baseElement/rootElement/collaboration';
import type { TParticipant } from '../../../../model/bpmn/json/baseElement/participant';
import type { TMessageFlow } from '../../../../model/bpmn/json/baseElement/baseElement';
import { type ConvertedElements, Participant } from './utils';
import { ensureIsArray } from '../../../helpers/array-utils';
import type { TGroup } from '../../../../model/bpmn/json/baseElement/artifact';

/**
 * @internal
 */
export default class CollaborationConverter {
  constructor(private convertedElements: ConvertedElements) {}

  deserializeElementsOnWhichProcessDepends(collaborations: string | TCollaboration | (string | TCollaboration)[]): void {
    ensureIsArray(collaborations).forEach(collaboration => {
      this.buildParticipant(collaboration.participant);
      this.buildGroups(collaboration.group);
    });
  }

  deserializeElementsDependentOnProcess(collaborations: string | TCollaboration | (string | TCollaboration)[]): void {
    ensureIsArray(collaborations).forEach(collaboration => this.buildMessageFlows(collaboration.messageFlow));
  }

  private buildParticipant(bpmnElements: Array<TParticipant> | TParticipant): void {
    ensureIsArray(bpmnElements).forEach(participant => this.convertedElements.registerParticipant(new Participant(participant.id, participant.name, participant.processRef)));
  }

  private buildMessageFlows(bpmnElements: Array<TMessageFlow> | TMessageFlow): void {
    ensureIsArray(bpmnElements).forEach(messageFlow => {
      const convertedSource = this.convertedElements.findFlowNode(messageFlow.sourceRef) || this.convertedElements.findProcess(messageFlow.sourceRef);
      const convertedTarget = this.convertedElements.findFlowNode(messageFlow.targetRef) || this.convertedElements.findProcess(messageFlow.targetRef);
      this.convertedElements.registerMessageFlow(new MessageFlow(messageFlow.id, messageFlow.name, convertedSource, convertedTarget));
    });
  }

  private buildGroups(bpmnElements: Array<TGroup> | TGroup): void {
    ensureIsArray(bpmnElements).forEach(groupBpmnElement => {
      const shapeBpmnElement = this.convertedElements.buildShapeBpmnGroup(groupBpmnElement);
      shapeBpmnElement && this.convertedElements.registerFlowNode(shapeBpmnElement);
    });
  }
}
