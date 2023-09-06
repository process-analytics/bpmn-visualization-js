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

import type { ConvertedElements } from './utils';
import type { TGroup } from '../../../../model/bpmn/json/baseElement/artifact';
import type { TMessageFlow } from '../../../../model/bpmn/json/baseElement/baseElement';
import type { TParticipant } from '../../../../model/bpmn/json/baseElement/participant';
import type { TCollaboration } from '../../../../model/bpmn/json/baseElement/rootElement/collaboration';
import type { ParsingMessageCollector } from '../../parsing-messages';

import { ShapeBpmnElementKind } from '../../../../model/bpmn/internal';
import { MessageFlow } from '../../../../model/bpmn/internal/edge/flows';
import ShapeBpmnElement from '../../../../model/bpmn/internal/shape/ShapeBpmnElement';
import { ensureIsArray } from '../../../helpers/array-utils';

import { buildShapeBpmnGroup } from './utils';

/**
 * @internal
 */
export default class CollaborationConverter {
  constructor(
    private convertedElements: ConvertedElements,
    private parsingMessageCollector: ParsingMessageCollector,
  ) {}

  deserialize(collaborations: string | TCollaboration | (string | TCollaboration)[]): void {
    ensureIsArray(collaborations).forEach(collaboration => this.parseCollaboration(collaboration));
  }

  private parseCollaboration(collaboration: TCollaboration): void {
    this.buildParticipant(collaboration.participant);
    this.buildMessageFlows(collaboration.messageFlow);
    this.buildGroups(collaboration.group);
  }

  private buildParticipant(bpmnElements: TParticipant[] | TParticipant): void {
    ensureIsArray(bpmnElements).forEach(participant =>
      this.convertedElements.registerPool(new ShapeBpmnElement(participant.id, participant.name, ShapeBpmnElementKind.POOL), participant.processRef),
    );
  }

  private buildMessageFlows(bpmnElements: TMessageFlow[] | TMessageFlow): void {
    ensureIsArray(bpmnElements).forEach(messageFlow =>
      this.convertedElements.registerMessageFlow(new MessageFlow(messageFlow.id, messageFlow.name, messageFlow.sourceRef, messageFlow.targetRef)),
    );
  }

  private buildGroups(bpmnElements: TGroup[] | TGroup): void {
    ensureIsArray(bpmnElements).forEach(groupBpmnElement => {
      const shapeBpmnElement = buildShapeBpmnGroup(this.convertedElements, this.parsingMessageCollector, groupBpmnElement);
      shapeBpmnElement && this.convertedElements.registerFlowNode(shapeBpmnElement);
    });
  }
}
