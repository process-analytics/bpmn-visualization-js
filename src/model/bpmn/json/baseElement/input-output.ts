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
import type { TDataInput, TDataOutput } from './data';

export interface TInputOutputBinding extends TBaseElement {
  operationRef: string;
  inputDataRef: string;
  outputDataRef: string;
}

export interface TInputOutputSpecification extends TBaseElement {
  dataInput?: TDataInput | TDataInput[];
  dataOutput?: TDataOutput | TDataOutput[];
  inputSet: TInputSet | TInputSet[];
  outputSet: TOutputSet | TOutputSet[];
}

export interface TInputSet extends TBaseElement {
  dataInputRefs?: string | string[];
  optionalInputRefs?: string | string[];
  whileExecutingInputRefs?: string | string[];
  outputSetRefs?: string | string[];
  name?: string;
}

export interface TOutputSet extends TBaseElement {
  dataOutputRefs?: string | string[];
  optionalOutputRefs?: string | string[];
  whileExecutingOutputRefs?: string | string[];
  inputSetRefs?: string | string[];
  name?: string;
}
