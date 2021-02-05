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
import { FlowKind } from '../../../../src/model/bpmn/internal/edge/FlowKind';
import { ShapeBpmnElementKind } from '../../../../src/model/bpmn/internal/shape';
import { computeBpmnBaseClassName, computeAllBpmnClassNames } from '../../../../src/component/g6/style-helper';

describe('compute base css class names of BPMN elements', () => {
  it.each`
    kind                                             | expectedClassName
    ${undefined}                                     | ${''}
    ${null}                                          | ${''}
    ${''}                                            | ${''}
    ${FlowKind.ASSOCIATION_FLOW}                     | ${'bpmn-association'}
    ${FlowKind.MESSAGE_FLOW}                         | ${'bpmn-message-flow'}
    ${FlowKind.SEQUENCE_FLOW}                        | ${'bpmn-sequence-flow'}
    ${ShapeBpmnElementKind.CALL_ACTIVITY}            | ${'bpmn-call-activity'}
    ${ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH} | ${'bpmn-intermediate-catch-event'}
    ${ShapeBpmnElementKind.EVENT_START}              | ${'bpmn-start-event'}
    ${ShapeBpmnElementKind.GATEWAY_EVENT_BASED}      | ${'bpmn-event-based-gateway'}
    ${ShapeBpmnElementKind.GATEWAY_PARALLEL}         | ${'bpmn-parallel-gateway'}
    ${ShapeBpmnElementKind.SUB_PROCESS}              | ${'bpmn-sub-process'}
    ${ShapeBpmnElementKind.TASK}                     | ${'bpmn-task'}
    ${ShapeBpmnElementKind.TASK_BUSINESS_RULE}       | ${'bpmn-business-rule-task'}
    ${ShapeBpmnElementKind.TASK_SERVICE}             | ${'bpmn-service-task'}
  `('$kind Bpmn base classname', ({ kind, expectedClassName }) => {
    expect(computeBpmnBaseClassName(kind)).toEqual(expectedClassName);
  });
});

describe('compute all css class names of BPMN elements', () => {
  it.each`
    kind                                       | isLabel  | expectedClassName
    ${FlowKind.ASSOCIATION_FLOW}               | ${true}  | ${['bpmn-association', 'bpmn-label']}
    ${FlowKind.MESSAGE_FLOW}                   | ${false} | ${['bpmn-message-flow']}
    ${ShapeBpmnElementKind.CALL_ACTIVITY}      | ${true}  | ${['bpmn-call-activity', 'bpmn-label']}
    ${ShapeBpmnElementKind.TASK_BUSINESS_RULE} | ${false} | ${['bpmn-business-rule-task']}
  `('$kind all classes when isLabel $isLabel', ({ kind, isLabel, expectedClassName }) => {
    expect(computeAllBpmnClassNames(kind, isLabel)).toEqual(expectedClassName);
  });
});
