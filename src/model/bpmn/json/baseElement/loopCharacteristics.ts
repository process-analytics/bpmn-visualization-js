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
import type { TExpression } from './expression';
import type { TDataInput, TDataOutput } from './data';
import type { TBaseElement, TComplexBehaviorDefinition } from './baseElement';

// abstract="true"
export type TLoopCharacteristics = TBaseElement;

export interface TMultiInstanceLoopCharacteristics extends TLoopCharacteristics {
  complexBehaviorDefinition?: TComplexBehaviorDefinition | TComplexBehaviorDefinition[];
  loopCardinality?: TExpression;
  loopDataInputRef?: string;
  loopDataOutputRef?: string;
  inputDataItem?: TDataInput;
  outputDataItem?: TDataOutput;
  completionCondition?: TExpression;
  isSequential?: boolean; // default="false"
  behavior?: tMultiInstanceFlowCondition; // default="All"
  oneBehaviorEventRef?: string;
  noneBehaviorEventRef?: string;
}

export interface TStandardLoopCharacteristics extends TLoopCharacteristics {
  loopCondition?: TExpression;
  testBefore?: boolean; // default="false"
  loopMaximum?: number;
}

export enum tMultiInstanceFlowCondition {
  None = 'None',
  One = 'One',
  All = 'All',
  Complex = 'Complex',
}
