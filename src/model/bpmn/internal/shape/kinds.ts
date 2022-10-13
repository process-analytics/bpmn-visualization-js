/**
 * Copyright 2021 Bonitasoft S.A.
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
  // When adding support, uncomment related content in tests
  // test/unit/component/mxgraph/renderer/StyleComputer.test.ts
  // test/unit/component/parser/json/BpmnJsonParser.marker.test.ts (adhoc requires special checks as an additional marker should be present)
  // Generalize test/unit/component/parser/json/BpmnJsonParser.sub.process.test.ts
  // See also, ShapeBpmnSubProcessKind
  // SUB_PROCESS_AD_HOC = 'adHocSubProcess',
  // SUB_PROCESS_TRANSACTION = 'transaction',

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

  GROUP = 'group',
  TEXT_ANNOTATION = 'textAnnotation',

  GATEWAY_PARALLEL = 'parallelGateway',
  GATEWAY_EXCLUSIVE = 'exclusiveGateway',
  GATEWAY_INCLUSIVE = 'inclusiveGateway',
  GATEWAY_EVENT_BASED = 'eventBasedGateway',
  GATEWAY_COMPLEX = 'complexGateway',

  EVENT_START = 'startEvent',
  EVENT_END = 'endEvent',
  EVENT_INTERMEDIATE_CATCH = 'intermediateCatchEvent',
  EVENT_INTERMEDIATE_THROW = 'intermediateThrowEvent',
  EVENT_BOUNDARY = 'boundaryEvent',
}

/**
 * {@link ShapeBpmnElementKind} related to BPMN Events.
 * @category BPMN
 */
export type BpmnEventKind =
  | ShapeBpmnElementKind.EVENT_BOUNDARY
  | ShapeBpmnElementKind.EVENT_START
  | ShapeBpmnElementKind.EVENT_END
  | ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW
  | ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH;

/**
 * {@link ShapeBpmnElementKind} related to BPMN Global Tasks.
 * @category BPMN
 */
export type GlobalTaskKind =
  | ShapeBpmnElementKind.GLOBAL_TASK
  | ShapeBpmnElementKind.GLOBAL_TASK_MANUAL
  | ShapeBpmnElementKind.GLOBAL_TASK_SCRIPT
  | ShapeBpmnElementKind.GLOBAL_TASK_USER
  | ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE;

/**
 * @category BPMN
 */
export enum ShapeBpmnCallActivityKind {
  CALLING_PROCESS = 'process',
  CALLING_GLOBAL_TASK = 'global task',
}

/**
 * Values available for the `eventGatewayType` property in the BPMN specification.
 * @category BPMN
 */
export enum ShapeBpmnEventBasedGatewayKind {
  Exclusive = 'Exclusive',
  /** When no type is provided in the BPMN source. */
  None = 'None',
  Parallel = 'Parallel',
}

/**
 * Base name of the EventDefinition fields in the BPMN XSD for event kinds. In the xsd, the value is <enum_value>EventDefinition.
 *
 * For instance, TERMINATE --> terminateEventDefinition
 * @category BPMN
 */
export enum ShapeBpmnEventDefinitionKind {
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
 * @category BPMN
 */
export enum ShapeBpmnMarkerKind {
  ADHOC = 'adhoc',
  COMPENSATION = 'compensation',
  EXPAND = 'expand',
  LOOP = 'loop',
  MULTI_INSTANCE_PARALLEL = 'parallel multi instance',
  MULTI_INSTANCE_SEQUENTIAL = 'sequential multi instance',
}

/**
 * Base name of the BPMN specification for sub-process kinds.
 * @category BPMN
 */
export enum ShapeBpmnSubProcessKind {
  EMBEDDED = 'embedded',
  EVENT = 'event',
  // The following may be only needed for rendering, as we have special types for adHoc and transaction subprocess in ShapeBpmnElementKind
  TRANSACTION = 'transaction',
  // AD_HOC = 'ad_hoc',
}
