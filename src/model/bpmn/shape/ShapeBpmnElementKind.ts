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
  The real name of the field in the BPMN XSD
 */
export enum ShapeBpmnElementKind {
  LANE = 'lane',
  POOL = 'pool',
  TASK_USER = 'userTask',
  TASK_SERVICE = 'serviceTask',
  TASK = 'task',
  GATEWAY_PARALLEL = 'parallelGateway',
  GATEWAY_EXCLUSIVE = 'exclusiveGateway',
  EVENT_START = 'startEvent',
  EVENT_END = 'endEvent',
  EVENT_INTERMEDIATE_CATCH = 'intermediateCatchEvent',
  EVENT_INTERMEDIATE_THROW = 'intermediateThrowEvent',
}
