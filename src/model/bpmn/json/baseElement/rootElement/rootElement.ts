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
import { TInputOutputBinding, TInputOutputSpecification } from '../input-output';
import { TAuditing, TBaseElement, TCategoryValue, TLaneSet, TMonitoring, TOperation, TProperty } from '../baseElement';
import { THumanPerformer, TPerformer, TPotentialOwner, TResourceParameter, TResourceRole } from '../resource';
import { TCorrelationSubscription } from '../correlation';
import { TArtifact, TAssociation, TGroup, TTextAnnotation } from '../artifact';
import { TFlowElement, TSequenceFlow } from '../flowElement';
import { TBoundaryEvent, TEndEvent, TEvent, TImplicitThrowEvent, TIntermediateCatchEvent, TIntermediateThrowEvent, TStartEvent } from '../flowNode/event';
import { TCallChoreography, TChoreographyTask, TSubChoreography } from '../flowNode/choreographyActivity';
import { TAdHocSubProcess, TCallActivity, TSubProcess, TTransaction } from '../flowNode/activity/activity';
import { TComplexGateway, TEventBasedGateway, TExclusiveGateway, TInclusiveGateway, TParallelGateway } from '../flowNode/gateway';
import { TDataObject, TDataObjectReference, TDataStoreReference } from '../data';
import { TBusinessRuleTask, TManualTask, TReceiveTask, TScriptTask, TSendTask, TServiceTask, TTask, TUserTask } from '../flowNode/activity/task';

// abstract="true"
export type TRootElement = TBaseElement;

export interface TCallableElement extends TRootElement {
  ioSpecification?: TInputOutputSpecification;
  ioBinding?: TInputOutputBinding[];
  supportedInterfaceRef?: string[];
  name?: string;
}

export interface TCategory extends TRootElement {
  categoryValue?: TCategoryValue | TCategoryValue[];
  name?: string;
}

export type TEndPoint = TRootElement;

export interface TError extends TRootElement {
  name?: string;
  errorCode?: string;
  structureRef?: string;
}

export interface TEscalation extends TRootElement {
  name?: string;
  escalationCode?: string;
  structureRef?: string;
}

export interface TItemDefinition extends TRootElement {
  structureRef?: string;
  isCollection?: boolean; // default="false"
  itemKind?: tItemKind; // default="Information"
}

enum tItemKind {
  Information = 'Information',
  Physical = 'Physical',
}

export interface TMessage extends TRootElement {
  name?: string;
  itemRef?: string;
}

export interface TInterface extends TRootElement {
  operation: TOperation[];
  name: string;
  implementationRef?: string;
}

export interface TPartnerEntity extends TRootElement {
  participantRef?: string[];
  name?: string;
}

export interface TPartnerRole extends TRootElement {
  participantRef?: string[];
  name?: string;
}

export interface TResource extends TRootElement {
  resourceParameter?: TResourceParameter[];
  name: string;
}

export interface TSignal extends TRootElement {
  name?: string;
  structureRef?: string;
}

export interface TProcess extends TCallableElement {
  auditing?: TAuditing;
  monitoring?: TMonitoring;
  property?: TProperty | TProperty[];
  laneSet?: TLaneSet | TLaneSet[];

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

  // artifact
  artifact?: TArtifact | TArtifact[];
  association?: TAssociation | TAssociation[];
  group?: TGroup | TGroup[];
  textAnnotation?: TTextAnnotation | TTextAnnotation[];

  // resourceRole
  resourceRole?: TResourceRole | TResourceRole[];
  performer?: TPerformer | TPerformer[];
  humanPerformer?: THumanPerformer | THumanPerformer[];
  potentialOwner?: TPotentialOwner | TPotentialOwner[];

  correlationSubscription?: TCorrelationSubscription | TCorrelationSubscription[];
  supports?: string | string[];
  processType?: tProcessType; // default="None"
  isClosed?: boolean; // default="false"
  isExecutable?: boolean;
  definitionalCollaborationRef?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export enum tProcessType {
  None = 'None',
  Public = 'Public',
  Private = 'Private',
}
