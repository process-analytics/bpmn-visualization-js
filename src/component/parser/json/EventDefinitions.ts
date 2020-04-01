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
// TODO values must start with lower case to match the attribute name in the json model
export declare enum EventDefinition {
  CANCEL = 'CancelEventDefinition',
  COMPENSATION = 'CompensationEventDefinition',
  CONDITIONAL = 'ConditionalEventDefinition',
  ERROR = 'ErrorEventDefinition',
  ESCALATION = 'EscalationEventDefinition',
  LINK = 'LinkEventDefinition',
  MESSAGE = 'MessageEventDefinition',
  SIGNAL = 'SignalEventDefinition',
  TERMINATE = 'TerminateEventDefinition',
  TIMER = 'TimerEventDefinition',
}
