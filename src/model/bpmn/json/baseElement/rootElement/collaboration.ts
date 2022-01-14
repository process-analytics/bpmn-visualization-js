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
import type { TRootElement } from './rootElement';
import type { TCallConversation, TConversation, TConversationAssociation, TConversationLink, TConversationNode, TSubConversation } from '../conversation';
import type { TMessageFlow, TMessageFlowAssociation } from '../baseElement';
import type { TParticipant, TParticipantAssociation } from '../participant';
import type { TArtifact, TAssociation, TGroup, TTextAnnotation } from '../artifact';
import type { TCorrelationKey } from '../correlation';
import type { TFlowElement, TSequenceFlow } from '../flowElement';
import type { TCallChoreography, TChoreographyTask, TSubChoreography } from '../flowNode/choreographyActivity';
import type { TAdHocSubProcess, TCallActivity, TSubProcess, TTransaction } from '../flowNode/activity/activity';
import type { TDataObject, TDataObjectReference, TDataStoreReference } from '../data';
import type { TBoundaryEvent, TEndEvent, TEvent, TImplicitThrowEvent, TIntermediateCatchEvent, TIntermediateThrowEvent, TStartEvent } from '../flowNode/event';
import type { TComplexGateway, TEventBasedGateway, TExclusiveGateway, TInclusiveGateway, TParallelGateway } from '../flowNode/gateway';
import type { TBusinessRuleTask, TManualTask, TReceiveTask, TScriptTask, TSendTask, TServiceTask, TTask, TUserTask } from '../flowNode/activity/task';

export interface TCollaboration extends TRootElement {
  participant?: TParticipant | TParticipant[];
  messageFlow?: TMessageFlow | TMessageFlow[];

  // artifact
  artifact?: TArtifact | TArtifact[];
  association?: TAssociation | TAssociation[];
  group?: TGroup | TGroup[];
  textAnnotation?: TTextAnnotation | TTextAnnotation[];

  // conversationNode
  conversationNode?: TConversationNode | TConversationNode[];
  callConversation?: TCallConversation | TCallConversation[];
  conversation?: TConversation | TConversation[];
  subConversation?: TSubConversation | TSubConversation[];

  conversationAssociation?: TConversationAssociation | TConversationAssociation[];
  participantAssociation?: TParticipantAssociation | TParticipantAssociation[];
  messageFlowAssociation?: TMessageFlowAssociation | TMessageFlowAssociation[];
  correlationKey?: TCorrelationKey | TCorrelationKey[];
  choreographyRef?: string | string[];
  conversationLink?: TConversationLink | TConversationLink[];
  name?: string;
  isClosed?: boolean; // default="false"
}

export type TGlobalConversation = TCollaboration;

export interface TChoreography extends TCollaboration {
  // flowElement
  flowElement?: TFlowElement | TFlowElement[];
  sequenceFlow?: TSequenceFlow | TSequenceFlow[];
  callChoreography?: TCallChoreography | TCallChoreography[];
  choreographyTask?: TChoreographyTask | TChoreographyTask[];
  subChoreography?: TSubChoreography | TSubChoreography[];
  callActivity?: TCallActivity | TCallActivity[];

  // dataObject
  dataObject?: TDataObject | TDataObject[];
  dataObjectReference?: TDataObjectReference | TDataObjectReference[];
  dataStoreReference?: TDataStoreReference | TDataStoreReference[];

  // event
  event?: TEvent | TEvent[];
  intermediateCatchEvent?: TIntermediateCatchEvent | TIntermediateCatchEvent[];
  boundaryEvent?: TBoundaryEvent | TBoundaryEvent[];
  startEvent?: TStartEvent | TStartEvent[];
  implicitThrowEvent?: TImplicitThrowEvent | TImplicitThrowEvent[];
  intermediateThrowEvent?: TIntermediateThrowEvent | TIntermediateThrowEvent[];
  endEvent?: TEndEvent | TEndEvent[];

  // sub process
  subProcess?: TSubProcess | TSubProcess[];
  adHocSubProcess?: TAdHocSubProcess | TAdHocSubProcess[];
  transaction?: TTransaction | TTransaction[];

  // gateway
  complexGateway?: TComplexGateway | TComplexGateway[];
  eventBasedGateway?: TEventBasedGateway | TEventBasedGateway[];
  exclusiveGateway?: TExclusiveGateway | TExclusiveGateway[];
  inclusiveGateway?: TInclusiveGateway | TInclusiveGateway[];
  parallelGateway?: TParallelGateway | TParallelGateway[];

  // task
  task?: TTask | TTask[];
  businessRuleTask?: TBusinessRuleTask | TBusinessRuleTask[];
  manualTask?: TManualTask | TManualTask[];
  receiveTask?: TReceiveTask | TReceiveTask[];
  sendTask?: TSendTask | TSendTask[];
  serviceTask?: TServiceTask | TServiceTask[];
  scriptTask?: TScriptTask | TScriptTask[];
  userTask?: TUserTask | TUserTask[];
}

export interface TGlobalChoreographyTask extends TChoreography {
  initiatingParticipantRef?: string;
}
