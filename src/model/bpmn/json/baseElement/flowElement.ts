/*
Copyright 2020 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import type { TAuditing, TBaseElement, TMonitoring } from './baseElement';
import type { TExpression } from './expression';

export interface TFlowElement extends TBaseElement {
  auditing?: TAuditing;
  monitoring?: TMonitoring;
  categoryValueRef?: string | string[];
  name?: string;
}

// abstract="true"
export interface TFlowNode extends TFlowElement {
  incoming?: string | string[];
  outgoing?: string | string[];
}

export interface TSequenceFlow extends TFlowElement {
  conditionExpression?: TExpression;
  sourceRef: string;
  targetRef: string;
  isImmediate?: boolean;
}
