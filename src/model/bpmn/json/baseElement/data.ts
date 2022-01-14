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
import type { TAssignment, TBaseElement } from './baseElement';
import type { TRootElement } from './rootElement/rootElement';
import type { TFormalExpression } from './expression';
import type { TFlowElement } from './flowElement';

export type TDataInputAssociation = TDataAssociation;

export type TDataOutputAssociation = TDataAssociation;

export interface TDataState {
  name?: string;
}

export interface TDataObject extends TFlowElement {
  dataState?: TDataState;
  itemSubjectRef?: string;
  isCollection?: boolean; // default="false"
}

export interface TDataObjectReference extends TFlowElement {
  dataState?: TDataState;
  itemSubjectRef?: string;
  dataObjectRef?: string;
}

export interface TDataStoreReference extends TFlowElement {
  dataState?: TDataState;
  itemSubjectRef?: string;
  dataStoreRef?: string;
}

export interface TDataAssociation extends TBaseElement {
  assignment?: TAssignment | TAssignment[];
  sourceRef?: string | string[];
  targetRef: string;
  transformation?: TFormalExpression;
}

export interface TDataInput extends TBaseElement {
  dataState?: TDataState;
  name?: string;
  itemSubjectRef?: string;
  isCollection?: boolean; // default="false"
}

export interface TDataOutput extends TBaseElement {
  dataState?: TDataState;
  name?: string;
  itemSubjectRef?: string;
  isCollection?: boolean; // default="false"
}

export interface TDataStore extends TRootElement {
  dataState?: TDataState;
  name?: string;
  capacity?: number;
  isUnlimited?: boolean; // default="true"
  itemSubjectRef?: string;
}
