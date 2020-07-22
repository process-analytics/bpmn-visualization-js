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
import { TProperty } from '../baseElement';
import { TDataInput, TDataInputAssociation, TDataOutput, TDataOutputAssociation } from '../data';
import { TInputSet, TOutputSet } from '../input-output';
import {
  TCancelEventDefinition,
  TCompensateEventDefinition,
  TConditionalEventDefinition,
  TErrorEventDefinition,
  TEscalationEventDefinition,
  TEventDefinition,
  TLinkEventDefinition,
  TMessageEventDefinition,
  TSignalEventDefinition,
  TTerminateEventDefinition,
  TTimerEventDefinition,
} from '../rootElement/eventDefinition';
import { TFlowNode } from '../flowElement';

// abstract="true"
export interface TEvent extends TFlowNode {
  property?: TProperty | TProperty[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
// ======================== Catch event ========================
// abstract="true"
export interface TCatchEvent extends TEvent {
  dataOutput?: TDataOutput | TDataOutput[];
  dataOutputAssociation?: TDataOutputAssociation | TDataOutputAssociation[];
  outputSet?: TOutputSet;

  // eventDefinition
  eventDefinition?: string | TEventDefinition | TEventDefinition[];
  cancelEventDefinition?: string | TCancelEventDefinition | TCancelEventDefinition[];
  compensateEventDefinition?: string | TCompensateEventDefinition | TCompensateEventDefinition[];
  conditionalEventDefinition?: string | TConditionalEventDefinition | TConditionalEventDefinition[];
  errorEventDefinition?: string | TErrorEventDefinition | TErrorEventDefinition[];
  escalationEventDefinition?: string | TEscalationEventDefinition | TEscalationEventDefinition[];
  linkEventDefinition?: string | TLinkEventDefinition | TLinkEventDefinition[];
  messageEventDefinition?: string | TMessageEventDefinition | TMessageEventDefinition[];
  signalEventDefinition?: string | TSignalEventDefinition | TSignalEventDefinition[];
  terminateEventDefinition?: string | TTerminateEventDefinition | TTerminateEventDefinition[];
  timerEventDefinition?: string | TTimerEventDefinition | TTimerEventDefinition[];

  eventDefinitionRef?: string | string[];
  parallelMultiple?: boolean; // default="false"

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type TIntermediateCatchEvent = TCatchEvent;

export interface TBoundaryEvent extends TCatchEvent {
  cancelActivity?: boolean; // default="true"
  attachedToRef: string;
}

export interface TStartEvent extends TCatchEvent {
  isInterrupting?: boolean; // default="true"
}

// ======================== Throw event ========================
// abstract="true"
export interface TThrowEvent extends TEvent {
  dataInput?: TDataInput | TDataInput[];
  dataInputAssociation?: TDataInputAssociation | TDataInputAssociation[];
  inputSet?: TInputSet;

  // eventDefinition
  eventDefinition?: string | TEventDefinition | TEventDefinition[];
  cancelEventDefinition?: string | TCancelEventDefinition | TCancelEventDefinition[];
  compensateEventDefinition?: string | TCompensateEventDefinition | TCompensateEventDefinition[];
  conditionalEventDefinition?: string | TConditionalEventDefinition | TConditionalEventDefinition[];
  errorEventDefinition?: string | TErrorEventDefinition | TErrorEventDefinition[];
  escalationEventDefinition?: string | TEscalationEventDefinition | TEscalationEventDefinition[];
  linkEventDefinition?: string | TLinkEventDefinition | TLinkEventDefinition[];
  messageEventDefinition?: string | TMessageEventDefinition | TMessageEventDefinition[];
  signalEventDefinition?: string | TSignalEventDefinition | TSignalEventDefinition[];
  terminateEventDefinition?: string | TTerminateEventDefinition | TTerminateEventDefinition[];
  timerEventDefinition?: string | TTimerEventDefinition | TTimerEventDefinition[];

  eventDefinitionRef?: string | string[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TImplicitThrowEvent extends TThrowEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TIntermediateThrowEvent extends TThrowEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TEndEvent extends TThrowEvent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
