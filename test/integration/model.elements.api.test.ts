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

import type { EdgeBpmnSemantic, ShapeBpmnSemantic } from '@lib/component/registry';
import { readFileSync } from '@test/shared/file-helper';
import { expectBoundaryEvent, expectSequenceFlow, expectStartEvent, expectSubprocess } from '@test/shared/model/bpmn-semantic-utils';
import { bpmnVisualization } from './helpers/model-expect';

describe('Registry API - retrieve Model Bpmn elements', () => {
  bpmnVisualization.load(readFileSync('../fixtures/bpmn/model-complete-semantic.bpmn'));
  const bpmnElementsRegistry = bpmnVisualization.bpmnElementsRegistry;

  describe('Get by ids', () => {
    test('Pass a single existing id', () => {
      const modelElements = bpmnElementsRegistry.getModelElementsByIds('start_event_message_id');

      expect(modelElements).toHaveLength(1);

      expectStartEvent(modelElements[0] as ShapeBpmnSemantic, { id: 'start_event_message_id', name: 'Message Start Event', outgoing: ['message_flow_initiating_message_id'] });
    });

    test('Pass several existing ids', () => {
      const modelElements = bpmnElementsRegistry.getModelElementsByIds(['expanded_event_sub_process_with_loop_id', 'sequence_flow_in_sub_process_1_id']);

      expect(modelElements).toHaveLength(2);

      expectSubprocess(modelElements[0] as ShapeBpmnSemantic, { id: 'expanded_event_sub_process_with_loop_id', name: 'Expanded Event Sub-Process With Loop' });
      expectSequenceFlow(modelElements[1] as EdgeBpmnSemantic, {
        id: 'sequence_flow_in_sub_process_1_id',
        source: 'start_event_in_sub_process_id',
        target: 'task_in_sub_process_id',
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
      ]);

      expect(modelElements).toHaveLength(2);

      expectBoundaryEvent(modelElements[0] as ShapeBpmnSemantic, { id: 'boundary_event_non_interrupting_signal_id', name: 'Non-interrupting Signal Boundary Intermediate Event' });
      expectSequenceFlow(modelElements[1] as EdgeBpmnSemantic, {
        id: 'conditional_sequence_flow_from_activity_id',
        source: 'task_with_flows_id',
        target: 'gateway_with_flows_id',
      });
    });
  });
});
