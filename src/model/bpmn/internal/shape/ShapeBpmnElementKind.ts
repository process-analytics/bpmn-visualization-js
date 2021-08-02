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
 * The real name of the field in the BPMN XSD.
 * @category BPMN
 */
export enum ShapeBpmnElementKind {
  LANE = 'lane',
  POOL = 'pool',
  CALL_ACTIVITY = 'callActivity',
  SUB_PROCESS = 'subProcess',

  TASK = 'task',
  TASK_USER = 'userTask',
  TASK_SERVICE = 'serviceTask',
  TASK_RECEIVE = 'receiveTask',
  TASK_SEND = 'sendTask',
  TASK_MANUAL = 'manualTask',
  TASK_SCRIPT = 'scriptTask',
  TASK_BUSINESS_RULE = 'businessRuleTask',

  GLOBAL_TASK = 'globalTask',
  GLOBAL_TASK_USER = 'globalUserTask',
  GLOBAL_TASK_MANUAL = 'globalManualTask',
  GLOBAL_TASK_SCRIPT = 'globalScriptTask',
  GLOBAL_TASK_BUSINESS_RULE = 'globalBusinessRuleTask',

  TEXT_ANNOTATION = 'textAnnotation',

  GATEWAY_PARALLEL = 'parallelGateway',
  GATEWAY_EXCLUSIVE = 'exclusiveGateway',
  GATEWAY_INCLUSIVE = 'inclusiveGateway',
  GATEWAY_EVENT_BASED = 'eventBasedGateway',

  // TODO: Uncomment corresponding test in test/unit/component/parser/json/BpmnJsonParser.sequenceFlow.default.test.ts
  // TODO: Uncomment corresponding test in test/unit/component/parser/json/BpmnJsonParser.sequenceFlow.conditional.test.ts
  // TODO : Uncomment corresponding line in src/model/bpmn/shape/ShapeUtil.ts
  // TODO: Uncomment corresponding test in test/unit/component/parser/json/BpmnJsonParser.flowNode.test.ts
  // TODO: Uncomment corresponding test in test/unit/component/parser/json/BpmnJsonParser.label.bounds.test.ts
  // TODO: Uncomment corresponding test in test/unit/component/parser/json/BpmnJsonParser.label.font.test.ts
  // TODO: Uncomment corresponding test in test/unit/component/parser/json/BpmnJsonParser.label.test.ts
  // GATEWAY_COMPLEX = 'complexGateway',

  EVENT_START = 'startEvent',
  EVENT_END = 'endEvent',
  EVENT_INTERMEDIATE_CATCH = 'intermediateCatchEvent',
  EVENT_INTERMEDIATE_THROW = 'intermediateThrowEvent',
  EVENT_BOUNDARY = 'boundaryEvent',
}
