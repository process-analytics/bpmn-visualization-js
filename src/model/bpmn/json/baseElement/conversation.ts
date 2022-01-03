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
import type { TBaseElement } from './baseElement';
import type { TCorrelationKey } from './correlation';
import type { TParticipantAssociation } from './participant';

// abstract="true"
export interface TConversationNode extends TBaseElement {
  correlationKey?: TCorrelationKey[];
  participantRef?: string | string[];
  messageFlowRef?: string | string[];
  name?: string;
}

export interface TCallConversation extends TConversationNode {
  participantAssociation?: TParticipantAssociation | TParticipantAssociation[];
  calledCollaborationRef?: string;
}

export interface TSubConversation extends TConversationNode {
  // conversationNode
  conversationNode?: TConversationNode | TConversationNode[];
  callConversation?: TCallConversation | TCallConversation[];
  conversation?: TConversation[];
}

export type TConversation = TConversationNode;

export interface TConversationAssociation extends TBaseElement {
  innerConversationNodeRef: string;
  outerConversationNodeRef: string;
}

export interface TConversationLink extends TBaseElement {
  name?: string;
  sourceRef: string;
  targetRef: string;
}
