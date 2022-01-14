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
import type { TExpression, TFormalExpression } from './expression';

export interface TResourceAssignmentExpression extends TBaseElement {
  // expression
  expression: TExpression;
  formalExpression: TFormalExpression;
}

export interface TResourceParameter extends TBaseElement {
  name?: string;
  type?: string;
  isRequired?: boolean;
}

export interface TResourceParameterBinding extends TBaseElement {
  // expression
  expression: TExpression;
  formalExpression: TFormalExpression;

  parameterRef: string;
}

export interface TResourceRole extends TBaseElement {
  resourceRef?: string;
  resourceParameterBinding?: TResourceParameterBinding | TResourceParameterBinding[];
  resourceAssignmentExpression?: TResourceAssignmentExpression | TResourceAssignmentExpression[];
  name?: string;
}

// ======================== Performer ========================
export type TPerformer = TResourceRole;

export type THumanPerformer = TPerformer;

export type TPotentialOwner = THumanPerformer;
