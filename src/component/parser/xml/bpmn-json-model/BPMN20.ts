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
import { BPMNDiagram } from './BPMNDI';
import { TRelationship } from './baseElement/baseElement';
import { TExtension } from './Semantic';
import { TGlobalBusinessRuleTask, TGlobalManualTask, TGlobalScriptTask, TGlobalTask, TGlobalUserTask } from './baseElement/rootElement/globalTask';
import { TCorrelationProperty } from './baseElement/correlation';
import { TDataStore } from './baseElement/data';
import {
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
import { TChoreography, TCollaboration, TGlobalChoreographyTask, TGlobalConversation } from './baseElement/rootElement/collaboration';
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
} from './baseElement/rootElement/eventDefinition';

// <xsd:anyAttribute namespace="##other" processContents="lax"/>
export interface TDefinitions {
  import?: TImport | TImport[];
  extension?: TExtension | TExtension[];

  // rootElement
  category?: TCategory | TCategory[];
  choreography?: TChoreography | TChoreography[];
  collaboration?: TCollaboration | TCollaboration[];
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
  process?: string | TProcess | TProcess[];
  resource?: TResource | TResource[];
  rootElement?: TRootElement | TRootElement[];
  signal?: TSignal | TSignal[];

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

  BPMNDiagram?: BPMNDiagram | BPMNDiagram[];
  relationship?: TRelationship | TRelationship[];
  id?: string;
  name?: string;
  targetNamespace: string;
  expressionLanguage?: string; // default="http://www.w3.org/1999/XPath"
  typeLanguage?: string; // default="http://www.w3.org/2001/XMLSchema"
  exporter?: string;
  exporterVersion?: string;
}

export interface TImport {
  namespace: string;
  location: string;
  importType: string;
}
