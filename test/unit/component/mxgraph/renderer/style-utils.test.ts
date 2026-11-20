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

import type { CellStyle } from '@maxgraph/core';

import { computeBpmnBaseClassName, computeAllBpmnClassNames } from '@lib/component/mxgraph/renderer/style-utils';
import { FlowKind, ShapeBpmnElementKind, ShapeBpmnEventBasedGatewayKind, ShapeBpmnEventDefinitionKind, ShapeBpmnSubProcessKind } from '@lib/model/bpmn/internal';

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
  `('$kind Bpmn base classname', ({ kind, expectedClassName }: { kind: string; expectedClassName: string }) => {
    expect(computeBpmnBaseClassName(kind)).toEqual(expectedClassName);
  });
});

describe('compute all css class names based on style input', () => {
  it.each`
    style                                                                                                                                    | isLabel  | expectedClassNames
    ${{ bvKind: ShapeBpmnElementKind.LANE }}                                                                                                 | ${true}  | ${['bpmn-type-container', 'bpmn-lane', 'bpmn-label']}
    ${{ bvKind: ShapeBpmnElementKind.POOL }}                                                                                                 | ${false} | ${['bpmn-type-container', 'bpmn-pool']}
    ${{ bvKind: ShapeBpmnElementKind.CALL_ACTIVITY }}                                                                                        | ${false} | ${['bpmn-type-activity', 'bpmn-call-activity']}
    ${{ bvKind: ShapeBpmnElementKind.CALL_ACTIVITY, bvGlobalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK }}                                    | ${false} | ${['bpmn-type-activity', 'bpmn-call-activity', 'bpmn-global-task']}
    ${{ bvKind: ShapeBpmnElementKind.CALL_ACTIVITY, bvGlobalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_MANUAL }}                             | ${true}  | ${['bpmn-type-activity', 'bpmn-call-activity', 'bpmn-global-manual-task', 'bpmn-label']}
    ${{ bvKind: ShapeBpmnElementKind.EVENT_BOUNDARY }}                                                                                       | ${true}  | ${['bpmn-type-event', 'bpmn-boundary-event', 'bpmn-label']}
    ${{ bvKind: ShapeBpmnElementKind.EVENT_BOUNDARY, bvEventDefinitionKind: ShapeBpmnEventDefinitionKind.CANCEL, bvIsInterrupting: true }}   | ${true}  | ${['bpmn-type-event', 'bpmn-boundary-event', 'bpmn-event-def-cancel', 'bpmn-label']}
    ${{ bvKind: ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW }}                                                                             | ${false} | ${['bpmn-type-event', 'bpmn-intermediate-throw-event']}
    ${{ bvKind: ShapeBpmnElementKind.EVENT_START, bvEventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER, bvIsInterrupting: false }}      | ${false} | ${['bpmn-type-event', 'bpmn-start-event', 'bpmn-event-def-timer']}
    ${{ bvKind: ShapeBpmnElementKind.GATEWAY_EVENT_BASED }}                                                                                  | ${true}  | ${['bpmn-type-gateway', 'bpmn-event-based-gateway', 'bpmn-label']}
    ${{ bvKind: ShapeBpmnElementKind.GATEWAY_EVENT_BASED, bvIsInstantiating: true, bvGatewayKind: ShapeBpmnEventBasedGatewayKind.Parallel }} | ${false} | ${['bpmn-type-gateway', 'bpmn-event-based-gateway', 'bpmn-gateway-kind-parallel']}
    ${{ bvKind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE }}                                                                                    | ${true}  | ${['bpmn-type-gateway', 'bpmn-exclusive-gateway', 'bpmn-label']}
    ${{ bvKind: ShapeBpmnElementKind.TASK }}                                                                                                 | ${true}  | ${['bpmn-type-activity', 'bpmn-type-task', 'bpmn-task', 'bpmn-label']}
    ${{ bvKind: ShapeBpmnElementKind.TASK_BUSINESS_RULE }}                                                                                   | ${false} | ${['bpmn-type-activity', 'bpmn-type-task', 'bpmn-business-rule-task']}
    ${{ bvKind: ShapeBpmnElementKind.SUB_PROCESS }}                                                                                          | ${false} | ${['bpmn-type-activity', 'bpmn-sub-process']}
    ${{ bvKind: ShapeBpmnElementKind.SUB_PROCESS, bvSubProcessKind: ShapeBpmnSubProcessKind.AD_HOC }}                                        | ${true}  | ${['bpmn-type-activity', 'bpmn-sub-process', 'bpmn-sub-process-adhoc', 'bpmn-label']}
    ${{ bvKind: ShapeBpmnElementKind.SUB_PROCESS, bvSubProcessKind: ShapeBpmnSubProcessKind.EMBEDDED }}                                      | ${false} | ${['bpmn-type-activity', 'bpmn-sub-process', 'bpmn-sub-process-embedded']}
    ${{ bvKind: ShapeBpmnElementKind.SUB_PROCESS, bvSubProcessKind: ShapeBpmnSubProcessKind.EVENT }}                                         | ${true}  | ${['bpmn-type-activity', 'bpmn-sub-process', 'bpmn-sub-process-event', 'bpmn-label']}
    ${{ bvKind: ShapeBpmnElementKind.SUB_PROCESS, bvSubProcessKind: ShapeBpmnSubProcessKind.TRANSACTION }}                                   | ${true}  | ${['bpmn-type-activity', 'bpmn-sub-process', 'bpmn-sub-process-transaction', 'bpmn-label']}
    ${{ bvKind: FlowKind.ASSOCIATION_FLOW }}                                                                                                 | ${true}  | ${['bpmn-type-flow', 'bpmn-association', 'bpmn-label']}
    ${{ bvKind: FlowKind.MESSAGE_FLOW }}                                                                                                     | ${false} | ${['bpmn-type-flow', 'bpmn-message-flow']}
    ${{ bvKind: FlowKind.SEQUENCE_FLOW }}                                                                                                    | ${false} | ${['bpmn-type-flow', 'bpmn-sequence-flow']}
    ${{ shape: 'bpmn.messageFlowIcon' }}                                                                                                     | ${false} | ${['bpmn-message-flow-icon']}
    ${{ shape: 'bpmn.messageFlowIcon', bvIsInitiating: false }}                                                                              | ${false} | ${['bpmn-message-flow-icon', 'bpmn-icon-non-initiating']}
    ${{ shape: 'bpmn.messageFlowIcon', bvIsInitiating: true }}                                                                               | ${true}  | ${['bpmn-message-flow-icon', 'bpmn-icon-initiating', 'bpmn-label']}
  `('style=$style / isLabel=$isLabel', ({ style, isLabel, expectedClassNames }: { style: CellStyle; isLabel: boolean; expectedClassNames: string[] }) => {
    expect(computeAllBpmnClassNames(style, isLabel)).toEqual(expectedClassNames);
  });
});
