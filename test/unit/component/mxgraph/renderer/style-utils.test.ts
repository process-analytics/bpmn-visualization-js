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
import { FlowKind, ShapeBpmnElementKind } from '../../../../../src/model/bpmn/internal';
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
    style                                                                                | isLabel  | expectedClassNames
    ${ShapeBpmnElementKind.LANE}                                                         | ${true}  | ${['bpmn-type-container', 'bpmn-lane', 'bpmn-label']}
    ${ShapeBpmnElementKind.POOL}                                                         | ${false} | ${['bpmn-type-container', 'bpmn-pool']}
    ${ShapeBpmnElementKind.CALL_ACTIVITY}                                                | ${false} | ${['bpmn-type-activity', 'bpmn-call-activity']}
    ${'callActivity;bpmn.globalTaskKind=globalTask'}                                     | ${false} | ${['bpmn-type-activity', 'bpmn-call-activity', 'bpmn-global-task']}
    ${'callActivity;bpmn.globalTaskKind=globalManualTask'}                               | ${true}  | ${['bpmn-type-activity', 'bpmn-call-activity', 'bpmn-global-manual-task', 'bpmn-label']}
    ${ShapeBpmnElementKind.EVENT_BOUNDARY}                                               | ${true}  | ${['bpmn-type-event', 'bpmn-boundary-event', 'bpmn-label']}
    ${'boundaryEvent;bpmn.eventDefinitionKind=cancel;bpmn.isInterrupting=true'}          | ${true}  | ${['bpmn-type-event', 'bpmn-boundary-event', 'bpmn-event-def-cancel', 'bpmn-label']}
    ${ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW}                                     | ${false} | ${['bpmn-type-event', 'bpmn-intermediate-throw-event']}
    ${'startEvent;bpmn.eventDefinitionKind=timer;bpmn.isInterrupting=false;fontStyle=2'} | ${false} | ${['bpmn-type-event', 'bpmn-start-event', 'bpmn-event-def-timer']}
    ${ShapeBpmnElementKind.GATEWAY_EVENT_BASED}                                          | ${true}  | ${['bpmn-type-gateway', 'bpmn-event-based-gateway', 'bpmn-label']}
    ${'eventBasedGateway;bpmn.isInstantiating=true;bpmn.gatewayKind=Parallel'}           | ${false} | ${['bpmn-type-gateway', 'bpmn-event-based-gateway', 'bpmn-gateway-kind-parallel']}
    ${ShapeBpmnElementKind.GATEWAY_EXCLUSIVE}                                            | ${true}  | ${['bpmn-type-gateway', 'bpmn-exclusive-gateway', 'bpmn-label']}
    ${ShapeBpmnElementKind.TASK}                                                         | ${true}  | ${['bpmn-type-activity', 'bpmn-type-task', 'bpmn-task', 'bpmn-label']}
    ${ShapeBpmnElementKind.TASK_BUSINESS_RULE}                                           | ${false} | ${['bpmn-type-activity', 'bpmn-type-task', 'bpmn-business-rule-task']}
    ${ShapeBpmnElementKind.SUB_PROCESS}                                                  | ${false} | ${['bpmn-type-activity', 'bpmn-sub-process']}
    ${'subProcess;bpmn.subProcessKind=embedded'}                                         | ${false} | ${['bpmn-type-activity', 'bpmn-sub-process', 'bpmn-sub-process-embedded']}
    ${'subProcess;bpmn.subProcessKind=event'}                                            | ${true}  | ${['bpmn-type-activity', 'bpmn-sub-process', 'bpmn-sub-process-event', 'bpmn-label']}
    ${FlowKind.ASSOCIATION_FLOW}                                                         | ${true}  | ${['bpmn-type-flow', 'bpmn-association', 'bpmn-label']}
    ${FlowKind.MESSAGE_FLOW}                                                             | ${false} | ${['bpmn-type-flow', 'bpmn-message-flow']}
    ${'sequenceFlow;default;fontStyle=4'}                                                | ${false} | ${['bpmn-type-flow', 'bpmn-sequence-flow']}
    ${'shape=bpmn.message-flow-icon'}                                                    | ${false} | ${['bpmn-message-flow-icon']}
    ${'shape=bpmn.message-flow-icon;bpmn.isInitiating=non_initiating'}                   | ${false} | ${['bpmn-message-flow-icon', 'bpmn-icon-non-initiating']}
    ${'shape=bpmn.message-flow-icon;bpmn.isInitiating=initiating'}                       | ${true}  | ${['bpmn-message-flow-icon', 'bpmn-icon-initiating', 'bpmn-label']}
  `('style="$style" / isLabel=$isLabel', ({ style, isLabel, expectedClassNames }: { style: string; isLabel: boolean; expectedClassNames: string[] }) => {
    expect(computeAllBpmnClassNames(style, isLabel)).toEqual(expectedClassNames);
  });
});
