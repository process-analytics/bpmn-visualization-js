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
import type { TInputOutputSpecification } from '../../input-output';
import type { TLaneSet, TProperty } from '../../baseElement';
import type { TDataInputAssociation, TDataObject, TDataObjectReference, TDataOutputAssociation, TDataStoreReference } from '../../data';
import type { THumanPerformer, TPerformer, TPotentialOwner, TResourceRole } from '../../resource';
import type { TLoopCharacteristics, TMultiInstanceLoopCharacteristics, TStandardLoopCharacteristics } from '../../loopCharacteristics';
import type { TExpression } from '../../expression';
import type { TArtifact, TAssociation, TGroup, TTextAnnotation } from '../../artifact';
import type { TFlowElement, TFlowNode, TSequenceFlow } from '../../flowElement';
import type { TCallChoreography, TChoreographyTask, TSubChoreography } from '../choreographyActivity';
import type { TBoundaryEvent, TEndEvent, TEvent, TImplicitThrowEvent, TIntermediateCatchEvent, TIntermediateThrowEvent, TStartEvent } from '../event';
import type { TComplexGateway, TEventBasedGateway, TExclusiveGateway, TInclusiveGateway, TParallelGateway } from '../gateway';
import type { TBusinessRuleTask, TManualTask, TReceiveTask, TScriptTask, TSendTask, TServiceTask, TTask, TUserTask } from './task';

// abstract="true"
export interface TActivity extends TFlowNode {
  ioSpecification?: TInputOutputSpecification;
  property?: TProperty | TProperty[];
  dataInputAssociation?: TDataInputAssociation | TDataInputAssociation[];
  dataOutputAssociation?: TDataOutputAssociation | TDataOutputAssociation[];

  // resourceRole
  resourceRole?: TResourceRole | TResourceRole[];
  performer?: TPerformer | TPerformer[];
  humanPerformer?: THumanPerformer | THumanPerformer[];
  potentialOwner?: TPotentialOwner | TPotentialOwner[];

  // loopCharacteristics
  loopCharacteristics?: string | TLoopCharacteristics | (string | TLoopCharacteristics)[];
  multiInstanceLoopCharacteristics?: string | TMultiInstanceLoopCharacteristics | (string | TMultiInstanceLoopCharacteristics)[];
  standardLoopCharacteristics?: string | TStandardLoopCharacteristics | (string | TStandardLoopCharacteristics)[];

  isForCompensation?: boolean; // default="false"
  startQuantity?: number; // default="1"
  completionQuantity?: number; // default="1"
  default?: string;
}

export interface TCallActivity extends TActivity {
  calledElement?: string;
}

export interface TSubProcess extends TActivity {
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

  triggeredByEvent?: boolean; // default="false"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TAdHocSubProcess extends TSubProcess {
  completionCondition?: TExpression;
  cancelRemainingInstances?: boolean; // default="true"
  ordering?: tAdHocOrdering;
}

enum tAdHocOrdering {
  Parallel = 'Parallel',
  Sequential = 'Sequential',
}

export interface TTransaction extends TSubProcess {
  method?: tTransactionMethod; //default="##Compensate"
}

enum tTransactionMethod {
  Compensate = '##Compensate',
  Image = '##Image',
  Store = '##Store',
}
