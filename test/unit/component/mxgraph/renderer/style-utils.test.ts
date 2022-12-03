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
import type { BPMNCellStyle } from '../../../../../src/component/mxgraph/renderer/StyleComputer';
import { FlowKind, ShapeBpmnElementKind, ShapeBpmnEventBasedGatewayKind, ShapeBpmnEventDefinitionKind, ShapeBpmnSubProcessKind } from '../../../../../src/model/bpmn/internal';
import { computeBpmnBaseClassName, computeAllBpmnClassNames } from '../../../../../src/component/mxgraph/renderer/style-utils';

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
    ${ShapeBpmnElementKind.GROUP}                    | ${'bpmn-group'}
    ${ShapeBpmnElementKind.TEXT_ANNOTATION}          | ${'bpmn-text-annotation'}
  `('$kind Bpmn base classname', ({ kind, expectedClassName }) => {
    expect(computeBpmnBaseClassName(kind)).toEqual(expectedClassName);
  });
});

describe('compute all css class names based on style input', () => {
  it.each`
    style                                                                                                                                                 | isLabel  | expectedClassNames
    ${{ bpmn: { kind: ShapeBpmnElementKind.LANE } }}                                                                                                      | ${true}  | ${['bpmn-type-container', 'bpmn-lane', 'bpmn-label']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.POOL } }}                                                                                                      | ${false} | ${['bpmn-type-container', 'bpmn-pool']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY } }}                                                                                             | ${false} | ${['bpmn-type-activity', 'bpmn-call-activity']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY, globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK } }}                                           | ${false} | ${['bpmn-type-activity', 'bpmn-call-activity', 'bpmn-global-task']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.CALL_ACTIVITY, globalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_MANUAL } }}                                    | ${true}  | ${['bpmn-type-activity', 'bpmn-call-activity', 'bpmn-global-manual-task', 'bpmn-label']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.EVENT_BOUNDARY } }}                                                                                            | ${true}  | ${['bpmn-type-event', 'bpmn-boundary-event', 'bpmn-label']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.EVENT_BOUNDARY, eventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL } }}                                  | ${true}  | ${['bpmn-type-event', 'bpmn-boundary-event', 'bpmn-event-def-cancel', 'bpmn-label']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW } }}                                                                                  | ${false} | ${['bpmn-type-event', 'bpmn-intermediate-throw-event']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.EVENT_START, eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER, isInterrupting: false }, fontStyle: 2 }} | ${false} | ${['bpmn-type-event', 'bpmn-start-event', 'bpmn-event-def-timer']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.GATEWAY_EVENT_BASED } }}                                                                                       | ${true}  | ${['bpmn-type-gateway', 'bpmn-event-based-gateway', 'bpmn-label']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.GATEWAY_EVENT_BASED, isInstantiating: true, gatewayKind: ShapeBpmnEventBasedGatewayKind.Parallel } }}          | ${false} | ${['bpmn-type-gateway', 'bpmn-event-based-gateway', 'bpmn-gateway-kind-parallel']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE } }}                                                                                         | ${true}  | ${['bpmn-type-gateway', 'bpmn-exclusive-gateway', 'bpmn-label']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.TASK } }}                                                                                                      | ${true}  | ${['bpmn-type-activity', 'bpmn-type-task', 'bpmn-task', 'bpmn-label']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.TASK_BUSINESS_RULE } }}                                                                                        | ${false} | ${['bpmn-type-activity', 'bpmn-type-task', 'bpmn-business-rule-task']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.SUB_PROCESS } }}                                                                                               | ${false} | ${['bpmn-type-activity', 'bpmn-sub-process']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.SUB_PROCESS, subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED } }}                                             | ${false} | ${['bpmn-type-activity', 'bpmn-sub-process', 'bpmn-sub-process-embedded']}
    ${{ bpmn: { kind: ShapeBpmnElementKind.SUB_PROCESS, subProcessKind: ShapeBpmnSubProcessKind.EVENT } }}                                                | ${true}  | ${['bpmn-type-activity', 'bpmn-sub-process', 'bpmn-sub-process-event', 'bpmn-label']}
    ${{ bpmn: { kind: FlowKind.ASSOCIATION_FLOW } }}                                                                                                      | ${true}  | ${['bpmn-type-flow', 'bpmn-association', 'bpmn-label']}
    ${{ bpmn: { kind: FlowKind.MESSAGE_FLOW } }}                                                                                                          | ${false} | ${['bpmn-type-flow', 'bpmn-message-flow']}
    ${{ bpmn: { kind: FlowKind.SEQUENCE_FLOW } }}                                                                                                         | ${false} | ${['bpmn-type-flow', 'bpmn-sequence-flow']}
    ${{ shape: 'bpmn.message-flow-icon' }}                                                                                                                | ${false} | ${['bpmn-message-flow-icon']}
    ${{ bpmn: { isNonInitiating: true }, shape: 'bpmn.message-flow-icon' }}                                                                               | ${false} | ${['bpmn-message-flow-icon', 'bpmn-icon-non-initiating']}
    ${{ bpmn: { isNonInitiating: false }, shape: 'bpmn.message-flow-icon' }}                                                                              | ${true}  | ${['bpmn-message-flow-icon', 'bpmn-icon-initiating', 'bpmn-label']}
  `(
    // TODO find a way to correctly display the style object
    'style="$style" / isLabel=$isLabel',
    ({ style, isLabel, expectedClassNames }: { style: BPMNCellStyle; isLabel: boolean; expectedClassNames: string[] }) => {
      expect(computeAllBpmnClassNames(style, isLabel)).toEqual(expectedClassNames);
    },
  );
});
