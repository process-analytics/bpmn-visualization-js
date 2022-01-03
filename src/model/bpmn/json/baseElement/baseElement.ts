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
import type { TImplicitThrowEvent } from './flowNode/event';
import type { TDocumentation, TExtensionElements } from '../Semantic';
import type { TDataState } from './data';
import type { TExpression, TFormalExpression } from './expression';

// abstract="true"
// <xsd:anyAttribute namespace="##other" processContents="lax"/>
export interface TBaseElement {
  documentation?: TDocumentation | TDocumentation[];
  extensionElements?: TExtensionElements;
  id?: string;
}

// abstract="true" mixed="true"
// <xsd:anyAttribute namespace="##other" processContents="lax"/>
export interface TBaseElementWithMixedContent {
  documentation?: TDocumentation | TDocumentation[];
  extensionElements?: TExtensionElements;
  id?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TCategoryValue extends TBaseElement {
  value?: string;
}

export interface TAssignment extends TBaseElement {
  from: TExpression;
  to: TExpression;
}

export type TAuditing = TBaseElement;

export interface TMessageFlow extends TBaseElement {
  name?: string;
  sourceRef: string;
  targetRef: string;
  messageRef?: string;
}

export interface TMessageFlowAssociation extends TBaseElement {
  innerMessageFlowRef: string;
  outerMessageFlowRef: string;
}

export type TMonitoring = TBaseElement;

export interface TProperty extends TBaseElement {
  dataState?: TDataState;
  name?: string;
  itemSubjectRef?: string;
}

export interface TRelationship extends TBaseElement {
  source: string | string[];
  target: string | string[];
  type: string;
  direction?: tRelationshipDirection;
}

enum tRelationshipDirection {
  None = 'None',
  Forward = 'Forward',
  Backward = 'Backward',
  Both = 'Both',
}

export interface TComplexBehaviorDefinition extends TBaseElement {
  condition: TFormalExpression;
  event?: TImplicitThrowEvent;
}

export interface TLane extends TBaseElement {
  partitionElement?: TBaseElement;
  flowNodeRef?: string | string[];
  childLaneSet?: TLaneSet;
  name?: string;
  partitionElementRef?: string;
}

export interface TLaneSet extends TBaseElement {
  lane?: TLane | TLane[];
  name?: string;
}

export interface TOperation extends TBaseElement {
  inMessageRef: string;
  outMessageRef?: string;
  errorRef?: string | string[];
  name: string;
  implementationRef?: string;
}

export type TRendering = TBaseElement;
