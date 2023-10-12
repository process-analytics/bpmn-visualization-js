/*
Copyright 2023 Bonitasoft S.A.

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

import type { BpmnSemantic, EdgeBpmnSemantic, ShapeBpmnSemantic } from '@lib/component/registry';

import { initializeBpmnVisualization } from './helpers/bpmn-visualization-initialization';
import { bpmnVisualization } from './helpers/model-expect';

import { type BpmnElementKind, FlowKind, ShapeBpmnCallActivityKind, ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind, ShapeBpmnSubProcessKind } from '@lib/model/bpmn/internal';
import { readFileSync } from '@test/shared/file-helper';
import {
  expectBoundaryEvent,
  expectCallActivity,
  expectEndEvent,
  expectIntermediateCatchEvent,
  expectParallelGateway,
  expectSequenceFlow,
  expectStartEvent,
  expectSubprocess,
  expectTask,
  expectUserTask,
} from '@test/shared/model/bpmn-semantic-utils';

describe('Registry API - retrieve Model Bpmn elements', () => {
  describe('Get by ids', () => {
    const bpmnElementsRegistry = bpmnVisualization.bpmnElementsRegistry;

    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-complete-semantic.bpmn'));
    });

    test('Pass a single existing id', () => {
      const modelElements = bpmnElementsRegistry.getModelElementsByIds('start_event_message_id');

      expect(modelElements).toHaveLength(1);

      expectStartEvent(modelElements[0] as ShapeBpmnSemantic, {
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        id: 'start_event_message_id',
        name: 'Message Start Event',
        outgoing: ['message_flow_initiating_message_id'],
        parentId: 'participant_1_id',
      });
    });

    test('Pass several existing ids', () => {
      const modelElements = bpmnElementsRegistry.getModelElementsByIds([
        'expanded_event_sub_process_with_loop_id',
        'sequence_flow_in_sub_process_1_id',
        'collapsed_embedded_sub_process_id',
        'expanded_call_activity_id',
        'call_activity_calling_global_task_id',
        'call_activity_calling_global_business_rule_task_id',
      ]);

      expect(modelElements).toHaveLength(6);

      expectSubprocess(modelElements[0] as ShapeBpmnSemantic, {
        id: 'expanded_event_sub_process_with_loop_id',
        name: 'Expanded Event Sub-Process With Loop',
        parentId: 'participant_1_id',
        subProcessKind: ShapeBpmnSubProcessKind.EVENT,
      });
      expectSequenceFlow(modelElements[1] as EdgeBpmnSemantic, {
        id: 'sequence_flow_in_sub_process_1_id',
        source: 'start_event_in_sub_process_id',
        target: 'task_in_sub_process_id',
      });
      expectSubprocess(modelElements[2] as ShapeBpmnSemantic, {
        id: 'collapsed_embedded_sub_process_id',
        name: 'Collapsed Embedded Sub-Process',
        parentId: 'participant_1_id',
        subProcessKind: ShapeBpmnSubProcessKind.EMBEDDED,
      });
      expectCallActivity(modelElements[3] as ShapeBpmnSemantic, {
        id: 'expanded_call_activity_id',
        name: 'Expanded Call Activity',
        parentId: 'participant_1_id',
        callActivityKind: ShapeBpmnCallActivityKind.CALLING_PROCESS,
      });
      expectCallActivity(modelElements[4] as ShapeBpmnSemantic, {
        id: 'call_activity_calling_global_task_id',
        name: 'Call Activity Calling Global Task',
        parentId: 'participant_1_id',
        callActivityKind: ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK,
        callActivityGlobalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK,
      });
      expectCallActivity(modelElements[5] as ShapeBpmnSemantic, {
        id: 'call_activity_calling_global_business_rule_task_id',
        name: 'Call Activity Calling Global Business Rule Task',
        parentId: 'participant_1_id',
        callActivityKind: ShapeBpmnCallActivityKind.CALLING_GLOBAL_TASK,
        callActivityGlobalTaskKind: ShapeBpmnElementKind.GLOBAL_TASK_BUSINESS_RULE,
      });
    });

    test('Pass a single non existing id', () => {
      expect(bpmnElementsRegistry.getModelElementsByIds('unknown')).toHaveLength(0);
    });

    test.each([null, undefined])('Pass nullish parameter: %s', (nullishResetParameter: string) => {
      expect(bpmnElementsRegistry.getModelElementsByIds(nullishResetParameter)).toHaveLength(0);
    });

    test('Pass existing and non existing ids', () => {
      const modelElements = bpmnElementsRegistry.getModelElementsByIds([
        'boundary_event_non_interrupting_signal_id',
        'unknown',
        'conditional_sequence_flow_from_activity_id',
        'another_unknown',
        'start_event_in_adHoc_sub_process_id',
        'boundary_event_interrupting_timer_id',
      ]);

      expect(modelElements).toHaveLength(4);

      expectBoundaryEvent(modelElements[0] as ShapeBpmnSemantic, {
        id: 'boundary_event_non_interrupting_signal_id',
        name: 'Non-interrupting Signal Boundary Intermediate Event',
        parentId: 'collapsed_call_activity_id',
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.SIGNAL,
      });
      expectSequenceFlow(modelElements[1] as EdgeBpmnSemantic, {
        id: 'conditional_sequence_flow_from_activity_id',
        source: 'task_with_flows_id',
        target: 'gateway_with_flows_id',
      });
      expectStartEvent(modelElements[2] as ShapeBpmnSemantic, {
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
        id: 'start_event_in_adHoc_sub_process_id',
        name: 'Start Event In AdHoc Sub-Process',
        outgoing: ['sequence_flow_in_adHoc_sub_process_1_id'],
        parentId: 'expanded_adHoc_sub_process_id',
      });
      expectBoundaryEvent(modelElements[3] as ShapeBpmnSemantic, {
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.TIMER,
        id: 'boundary_event_interrupting_timer_id',
        name: 'Interrupting Timer Boundary Intermediate Event',
        parentId: 'send_task_id',
      });
    });

    test('Pass duplicated ids', () => {
      const modelElements = bpmnElementsRegistry.getModelElementsByIds([
        'start_event_none_id',
        'conditional_sequence_flow_from_gateway_id',
        'conditional_sequence_flow_from_gateway_id',
        'start_event_none_id',
        'conditional_sequence_flow_from_gateway_id',
      ]);

      expect(modelElements).toHaveLength(2);

      expectStartEvent(modelElements[0] as ShapeBpmnSemantic, {
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
        id: 'start_event_none_id',
        name: 'None Start Event',
        parentId: 'participant_1_id',
      });
      expectSequenceFlow(modelElements[1] as EdgeBpmnSemantic, {
        id: 'conditional_sequence_flow_from_gateway_id',
        name: '',
        source: 'gateway_with_flows_id',
        target: 'task_with_flows_id',
      });
    });
  });

  describe('Get by ids - diagram including elements without pool', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
    });

    test('Pass several existing ids', () => {
      const bpmnElementsRegistry = bpmnVisualization.bpmnElementsRegistry;

      const modelElements = bpmnElementsRegistry.getModelElementsByIds(['StartEvent_1', 'Flow_1']);

      expect(modelElements).toHaveLength(2);

      expectStartEvent(modelElements[0] as ShapeBpmnSemantic, {
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
        id: 'StartEvent_1',
        name: 'Start Event 1',
        outgoing: ['Flow_1'],
        parentId: undefined,
      });
      expectSequenceFlow(modelElements[1] as EdgeBpmnSemantic, {
        id: 'Flow_1',
        name: 'Sequence Flow 1',
        source: 'StartEvent_1',
        target: 'Activity_1',
      });
    });
  });

  describe('Get by kinds', () => {
    const bv = initializeBpmnVisualization(null);
    const bpmnElementsRegistry = bv.bpmnElementsRegistry;

    beforeEach(() => {
      bv.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    });

    test('Pass a single kind with matching elements', () => {
      const modelElements = bpmnElementsRegistry.getModelElementsByKinds(ShapeBpmnElementKind.TASK_USER);

      expect(modelElements).toHaveLength(4);

      expectUserTask(modelElements[0] as ShapeBpmnSemantic, {
        id: 'userTask_0',
        name: 'User Task 0',
        incoming: ['sequenceFlow_lane_1_elt_1'],
        outgoing: ['sequenceFlow_lane_1_elt_2'],
        parentId: 'lane_01',
      });
      expectAllElementsWithKind(modelElements, ShapeBpmnElementKind.TASK_USER);
    });

    test('Pass a single kind without matching elements', () => {
      expect(bpmnElementsRegistry.getModelElementsByKinds(ShapeBpmnElementKind.TEXT_ANNOTATION)).toHaveLength(0);
    });

    test('Pass several kinds, with and without matching elements', () => {
      const modelElements = bpmnElementsRegistry.getModelElementsByKinds([
        ShapeBpmnElementKind.EVENT_END,
        ShapeBpmnElementKind.TEXT_ANNOTATION,
        ShapeBpmnElementKind.GATEWAY_PARALLEL,
        ShapeBpmnElementKind.GROUP,
        FlowKind.SEQUENCE_FLOW,
      ]);

      expect(modelElements).toHaveLength(17);

      expectEndEvent(modelElements[0] as ShapeBpmnSemantic, {
        id: 'endEvent_terminate_1',
        name: 'terminate end 1',
        parentId: 'lane_01',
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.TERMINATE,
        incoming: ['sequenceFlow_lane_1_elt_6'],
      });
      expectEndEvent(modelElements[1] as ShapeBpmnSemantic, {
        id: 'endEvent_message_1',
        name: 'message end 2',
        parentId: 'lane_02',
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        incoming: ['Flow_09zytr1'],
      });
      expectParallelGateway(modelElements[2] as ShapeBpmnSemantic, { id: 'gateway_02_parallel', name: 'gateway 2', parentId: 'lane_02' });
      expectSequenceFlow(modelElements[3] as EdgeBpmnSemantic, { id: 'Flow_1noi0ay', source: 'task_1', target: 'gateway_01' });
      // all remaining are sequence flows
      expectAllElementsWithKind(modelElements.slice(3), FlowKind.SEQUENCE_FLOW);
    });

    test.each([null, undefined])('Pass nullish parameter: %s', (nullishResetParameter: BpmnElementKind) => {
      expect(bpmnElementsRegistry.getModelElementsByKinds(nullishResetParameter)).toHaveLength(0);
    });

    test('Pass duplicated kinds', () => {
      const modelElements = bpmnElementsRegistry.getModelElementsByKinds([
        ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
        ShapeBpmnElementKind.TASK,
        ShapeBpmnElementKind.EVENT_INTERMEDIATE_CATCH,
        ShapeBpmnElementKind.TASK,
      ]);

      expect(modelElements).toHaveLength(2);

      expectIntermediateCatchEvent(modelElements[0] as ShapeBpmnSemantic, {
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        id: 'Event_1wihmdr',
        incoming: ['Flow_08z7uoy'],
        name: 'message catch intermediate 1',
        outgoing: ['sequenceFlow_lane_3_elt_3'],
        parentId: 'lane_03',
      });
      expectTask(modelElements[1] as ShapeBpmnSemantic, {
        id: 'task_1',
        incoming: ['sequenceFlow_lane_1_elt_2'],
        name: 'Task 1',
        outgoing: ['Flow_1noi0ay'],
        parentId: 'lane_01',
      });
    });
  });
});

function expectAllElementsWithKind(elements: BpmnSemantic[], kind: BpmnElementKind): void {
  const array: BpmnElementKind[] = [];
  array.length = elements.length;
  array.fill(kind);
  expect(elements.map(bpmnSemantic => bpmnSemantic.kind)).toIncludeSameMembers(array);
}
