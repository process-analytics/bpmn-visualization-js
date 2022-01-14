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
import type { TCorrelationKey } from '../correlation';
import type { TParticipantAssociation } from '../participant';
import type { TArtifact, TAssociation, TGroup, TTextAnnotation } from '../artifact';
import type { TFlowElement, TFlowNode, TSequenceFlow } from '../flowElement';
import type { TAdHocSubProcess, TCallActivity, TSubProcess, TTransaction } from './activity/activity';
import type { TDataObject, TDataObjectReference, TDataStoreReference } from '../data';
import type { TBoundaryEvent, TEndEvent, TEvent, TImplicitThrowEvent, TIntermediateCatchEvent, TIntermediateThrowEvent, TStartEvent } from './event';
import type { TComplexGateway, TEventBasedGateway, TExclusiveGateway, TInclusiveGateway, TParallelGateway } from './gateway';
import type { TBusinessRuleTask, TManualTask, TReceiveTask, TScriptTask, TSendTask, TServiceTask, TTask, TUserTask } from './activity/task';

// abstract="true"
export interface TChoreographyActivity extends TFlowNode {
  correlationKey?: TCorrelationKey | TCorrelationKey[];
  participantRef: string | string[];
  initiatingParticipantRef: string;
  loopType?: tChoreographyLoopType; // default="None"
}

export interface TCallChoreography extends TChoreographyActivity {
  participantAssociation?: TParticipantAssociation | TParticipantAssociation[];
  calledChoreographyRef?: string;
}

export interface TChoreographyTask extends TChoreographyActivity {
  messageFlowRef: string | string[];
}

export interface TSubChoreography extends TChoreographyActivity {
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
}

enum tChoreographyLoopType {
  None = 'None',
  Standard = 'Standard',
  MultiInstanceSequential = 'MultiInstanceSequential',
  MultiInstanceParallel = 'MultiInstanceParallel',
}
