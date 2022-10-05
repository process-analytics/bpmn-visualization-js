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
import type { BpmnVisualization } from '../../src/bpmn-visualization';
import { FlowKind, ShapeBpmnElementKind } from '../../src/bpmn-visualization';
import {
  expectEndEventBpmnElement,
  expectPoolBpmnElement,
  expectSequenceFlowBpmnElement,
  expectServiceTaskBpmnElement,
  expectStartEventBpmnElement,
  expectTaskBpmnElement,
} from './helpers/semantic-with-svg-utils';
import {
  initializeBpmnVisualization,
  initializeBpmnVisualizationWithContainerId,
  initializeBpmnVisualizationWithHtmlElement,
  initializeBpmnVisualizationWithoutId,
} from './helpers/bpmn-visualization-initialization';
import { readFileSync } from '../helpers/file-helper';

describe('Bpmn Elements registry - retrieve BPMN elements', () => {
  describe.each`
    bpmnVisualization                               | type
    ${initializeBpmnVisualizationWithContainerId()} | ${'html id'}
    ${initializeBpmnVisualizationWithHtmlElement()} | ${'html element'}
    ${initializeBpmnVisualizationWithoutId()}       | ${'html element without id'}
    ${initializeBpmnVisualization('')}              | ${'html element with id set to empty string'}
    ${initializeBpmnVisualization(null)}            | ${'html element with id set to null'}
    ${initializeBpmnVisualization(undefined)}       | ${'html element with id set to undefined'}
  `('container set with "$type"', ({ bpmnVisualization }: { bpmnVisualization: BpmnVisualization }) => {
    describe('Get by ids', () => {
      it('Pass several existing ids', async () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['StartEvent_1', 'Flow_2']);
        expect(bpmnElements).toHaveLength(2);

        expectStartEventBpmnElement(bpmnElements[0], { id: 'StartEvent_1', name: 'Start Event 1' });
        expectSequenceFlowBpmnElement(bpmnElements[1], { id: 'Flow_2' });
      });

      it('Pass a single non existing id', async () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds('unknown');
        expect(bpmnElements).toHaveLength(0);
      });

      it('Pass existing and non existing ids', async () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['StartEvent_1', 'unknown', 'Flow_1', 'another_unknown']);
        expect(bpmnElements).toHaveLength(2);
      });
    });

    describe('Get by kinds', () => {
      it('Pass a single kind related to a single existing element', async () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.TASK);
        expect(bpmnElements).toHaveLength(1);

        expectTaskBpmnElement(bpmnElements[0], { id: 'Activity_1', name: 'Task 1' });
      });

      it('Pass a single kind related to several existing elements', async () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(FlowKind.SEQUENCE_FLOW);
        expect(bpmnElements).toHaveLength(2);

        expectSequenceFlowBpmnElement(bpmnElements[0], { id: 'Flow_1', name: 'Sequence Flow 1' });
        expectSequenceFlowBpmnElement(bpmnElements[1], { id: 'Flow_2' });
      });

      it('No elements for this kind', async () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.SUB_PROCESS);
        expect(bpmnElements).toHaveLength(0);
      });

      it('Pass a several kinds that all match existing elements', async () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.POOL]);
        expect(bpmnElements).toHaveLength(3);

        expectEndEventBpmnElement(bpmnElements[0], { id: 'endEvent_terminate_1', name: 'terminate end 1' });
        expectEndEventBpmnElement(bpmnElements[1], { id: 'endEvent_message_1', name: 'message end 2' });
        expectPoolBpmnElement(bpmnElements[2], { id: 'Participant_1', name: 'Pool 1' });
      });

      it('Pass a several kinds that match existing and non-existing elements', async () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.TASK_SERVICE]);
        expect(bpmnElements).toHaveLength(2);

        expectServiceTaskBpmnElement(bpmnElements[0], { id: 'serviceTask_1_2', name: 'Service Task 1.2' });
        expectServiceTaskBpmnElement(bpmnElements[1], { id: 'serviceTask_2_1', name: 'Service Task 2.1' });
      });
    });
  });
});
