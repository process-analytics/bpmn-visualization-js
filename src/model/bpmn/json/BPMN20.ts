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
import type { BPMNDiagram } from './BPMNDI';
import type { TRelationship } from './baseElement/baseElement';
import type { TExtension } from './Semantic';
import type { TGlobalBusinessRuleTask, TGlobalManualTask, TGlobalScriptTask, TGlobalTask, TGlobalUserTask } from './baseElement/rootElement/globalTask';
import type { TCorrelationProperty } from './baseElement/correlation';
import type { TDataStore } from './baseElement/data';
import type {
  TCategory,
  TEndPoint,
  TError,
  TEscalation,
  TInterface,
  TItemDefinition,
  TMessage,
  TPartnerEntity,
  TPartnerRole,
  TProcess,
  TResource,
  TRootElement,
  TSignal,
} from './baseElement/rootElement/rootElement';
import type { TChoreography, TCollaboration, TGlobalChoreographyTask, TGlobalConversation } from './baseElement/rootElement/collaboration';
import type {
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
} from './baseElement/rootElement/eventDefinition';

export interface BpmnJsonModel {
  definitions: TDefinitions;
}

// <xsd:anyAttribute namespace="##other" processContents="lax"/>
export interface TDefinitions {
  import?: TImport | TImport[];
  extension?: TExtension | TExtension[];

  // rootElement
  category?: TCategory | TCategory[];
  choreography?: TChoreography | TChoreography[];
  collaboration?: string | TCollaboration | (string | TCollaboration)[];
  correlationProperty?: TCorrelationProperty | TCorrelationProperty[];
  dataStore?: TDataStore | TDataStore[];
  endPoint?: TEndPoint | TEndPoint[];
  error?: TError | TError[];
  escalation?: TEscalation | TEscalation[];
  globalBusinessRuleTask?: TGlobalBusinessRuleTask | TGlobalBusinessRuleTask[];
  globalChoreographyTask?: TGlobalChoreographyTask | TGlobalChoreographyTask[];
  globalConversation?: TGlobalConversation | TGlobalConversation[];
  globalManualTask?: TGlobalManualTask | TGlobalManualTask[];
  globalScriptTask?: TGlobalScriptTask | TGlobalScriptTask[];
  globalTask?: TGlobalTask | TGlobalTask[];
  globalUserTask?: TGlobalUserTask | TGlobalUserTask[];
  interface?: TInterface | TInterface[];
  itemDefinition?: TItemDefinition | TItemDefinition[];
  message?: TMessage | TMessage[];
  partnerEntity?: TPartnerEntity | TPartnerEntity[];
  partnerRole?: TPartnerRole | TPartnerRole[];
  process?: string | TProcess | (string | TProcess)[];
  resource?: TResource | TResource[];
  rootElement?: TRootElement | TRootElement[];
  signal?: TSignal | TSignal[];

  // eventDefinition
  eventDefinition?: string | TEventDefinition | (string | TEventDefinition)[];
  cancelEventDefinition?: string | TCancelEventDefinition | (string | TCancelEventDefinition)[];
  compensateEventDefinition?: string | TCompensateEventDefinition | (string | TCompensateEventDefinition)[];
  conditionalEventDefinition?: string | TConditionalEventDefinition | (string | TConditionalEventDefinition)[];
  errorEventDefinition?: string | TErrorEventDefinition | (string | TErrorEventDefinition)[];
  escalationEventDefinition?: string | TEscalationEventDefinition | (string | TEscalationEventDefinition)[];
  linkEventDefinition?: string | TLinkEventDefinition | (string | TLinkEventDefinition)[];
  messageEventDefinition?: string | TMessageEventDefinition | (string | TMessageEventDefinition)[];
  signalEventDefinition?: string | TSignalEventDefinition | (string | TSignalEventDefinition)[];
  terminateEventDefinition?: string | TTerminateEventDefinition | (string | TTerminateEventDefinition)[];
  timerEventDefinition?: string | TTimerEventDefinition | (string | TTimerEventDefinition)[];

  BPMNDiagram?: BPMNDiagram | BPMNDiagram[];
  relationship?: TRelationship | TRelationship[];
  id?: string;
  name?: string;
  targetNamespace: string;
  expressionLanguage?: string; // default="http://www.w3.org/1999/XPath"
  typeLanguage?: string; // default="http://www.w3.org/2001/XMLSchema"
  exporter?: string;
  exporterVersion?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TImport {
  namespace: string;
  location: string;
  importType: string;
}
