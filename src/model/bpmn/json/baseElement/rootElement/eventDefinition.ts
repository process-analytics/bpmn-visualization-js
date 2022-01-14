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
import type { TRootElement } from './rootElement';
import type { TExpression } from '../expression';

// abstract="true"
export type TEventDefinition = TRootElement;

export interface TConditionalEventDefinition extends TEventDefinition {
  condition?: TExpression;
}

export interface TLinkEventDefinition extends TEventDefinition {
  source?: string | string[];
  target?: string;
  name: string;
}

export interface TMessageEventDefinition extends TEventDefinition {
  operationRef?: string;
  messageRef?: string;
}

export type TCancelEventDefinition = TEventDefinition;

export interface TCompensateEventDefinition extends TEventDefinition {
  waitForCompletion?: boolean;
  activityRef?: string;
}

export interface TErrorEventDefinition extends TEventDefinition {
  errorRef?: string;
}

export interface TEscalationEventDefinition extends TEventDefinition {
  escalationRef?: string;
}

export interface TSignalEventDefinition extends TEventDefinition {
  signalRef?: string;
}

export type TTerminateEventDefinition = TEventDefinition;

export interface TTimerEventDefinition extends TEventDefinition {
  timeDate?: TExpression;
  timeDuration?: TExpression;
  timeCycle?: TExpression;
}
