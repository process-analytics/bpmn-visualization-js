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

/**
 * Base name of the EventDefinition fields in the BPMN XSD for event kinds. In the xsd, the value is <enum_value>EventDefinition.
 *
 * For instance, TERMINATE --> terminateEventDefinition
 * @category BPMN
 */
export enum ShapeBpmnEventKind {
  NONE = 'none',
  TERMINATE = 'terminate',
  CANCEL = 'cancel',
  COMPENSATION = 'compensate',
  CONDITIONAL = 'conditional',
  ERROR = 'error',
  ESCALATION = 'escalation',
  LINK = 'link',
  MESSAGE = 'message',
  SIGNAL = 'signal',
  TIMER = 'timer',
}

/**
 * Elements that are effectively used in BPMN diagram as base for eventDefinition i.e all {@link ShapeBpmnEventKind} elements except {@link ShapeBpmnEventKind.NONE}
 * @internal
 */
export const bpmnEventKinds = Object.values(ShapeBpmnEventKind).filter(kind => kind != ShapeBpmnEventKind.NONE);
