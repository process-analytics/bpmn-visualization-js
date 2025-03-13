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

import type { BpmnVisualization } from '@lib/bpmn-visualization';

import {
  initializeBpmnVisualization,
  initializeBpmnVisualizationWithContainerId,
  initializeBpmnVisualizationWithHtmlElement,
  initializeBpmnVisualizationWithoutId,
} from './helpers/bpmn-visualization-initialization';
import {
  expectEndEventBpmnElement,
  expectIntermediateCatchEventBpmnElement,
  expectIntermediateThrowEventBpmnElement,
  expectParallelGatewayBpmnElement,
  expectPoolBpmnElement,
  expectSequenceFlowBpmnElement,
  expectServiceTaskBpmnElement,
  expectStartEventBpmnElement,
  expectTaskBpmnElement,
} from './helpers/semantic-with-svg-utilities';

import { FlowKind, ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '@lib/bpmn-visualization';
import { readFileSync } from '@test/shared/file-helper';

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
      it('Pass several existing ids', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['StartEvent_1', 'Flow_2']);
        expect(bpmnElements).toHaveLength(2);

        expectStartEventBpmnElement(bpmnElements[0], {
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
          id: 'StartEvent_1',
          name: 'Start Event 1',
          outgoing: ['Flow_1'],
          parentId: undefined,
        });
        expectSequenceFlowBpmnElement(bpmnElements[1], { id: 'Flow_2', source: 'Activity_1', target: 'EndEvent_1' });
      });

      it('Pass existing link intermediate event ids', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-2-lanes-link-intermediate-events.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['Event_1wihmdr', 'Event_1q818hp']);
        expect(bpmnElements).toHaveLength(2);

        expectIntermediateCatchEventBpmnElement(bpmnElements[0], {
          id: 'Event_1wihmdr',
          name: 'link catch intermediate',
          parentId: 'lane_02',
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
          outgoing: ['Flow_18jrbeb'],
          linkEventSourceIds: ['Event_1q818hp'],
        });

        expectIntermediateThrowEventBpmnElement(bpmnElements[1], {
          id: 'Event_1q818hp',
          name: 'link throw intermediate',
          parentId: 'lane_01',
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.LINK,
          incoming: ['sequenceFlow_lane_1_elt_1'],
          linkEventTargetId: 'Event_1wihmdr',
        });
      });

      it('Pass a single non existing id', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds('unknown');
        expect(bpmnElements).toHaveLength(0);
      });

      it('Pass existing and non existing ids', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['StartEvent_1', 'unknown', 'Flow_1', 'another_unknown']);
        expect(bpmnElements).toHaveLength(2);
      });

      it('Pass duplicated ids', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['StartEvent_1', 'Flow_1', 'StartEvent_1', 'Flow_1', 'Flow_1']);
        expect(bpmnElements).toHaveLength(2);
      });
    });

    describe('Get by kinds', () => {
      it('Pass a single kind related to a single existing element', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.TASK);
        expect(bpmnElements).toHaveLength(1);

        expectTaskBpmnElement(bpmnElements[0], { id: 'Activity_1', incoming: ['Flow_1'], name: 'Task 1', outgoing: ['Flow_2'], parentId: undefined });
      });

      it('Pass a single kind related to several existing elements', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(FlowKind.SEQUENCE_FLOW);
        expect(bpmnElements).toHaveLength(2);

        expectSequenceFlowBpmnElement(bpmnElements[0], { id: 'Flow_1', name: 'Sequence Flow 1', source: 'StartEvent_1', target: 'Activity_1' });
        expectSequenceFlowBpmnElement(bpmnElements[1], { id: 'Flow_2', source: 'Activity_1', target: 'EndEvent_1' });
      });

      it('No elements for this kind', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.SUB_PROCESS);
        expect(bpmnElements).toHaveLength(0);
      });

      it('Pass a several kinds that all match existing elements', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.POOL]);
        expect(bpmnElements).toHaveLength(3);

        expectEndEventBpmnElement(bpmnElements[0], {
          id: 'endEvent_terminate_1',
          name: 'terminate end 1',
          parentId: 'lane_01',
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.TERMINATE,
          incoming: ['sequenceFlow_lane_1_elt_6'],
        });
        expectEndEventBpmnElement(bpmnElements[1], {
          id: 'endEvent_message_1',
          name: 'message end 2',
          parentId: 'lane_02',
          eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
          incoming: ['Flow_09zytr1'],
        });
        expectPoolBpmnElement(bpmnElements[2], { id: 'Participant_1', name: 'Pool 1' });
      });

      it('Pass a several kinds that match existing and non-existing elements', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.TASK_SERVICE]);
        expect(bpmnElements).toHaveLength(2);

        expectServiceTaskBpmnElement(bpmnElements[0], {
          id: 'serviceTask_1_2',
          incoming: ['Flow_1ceafgv'],
          name: 'Service Task 1.2',
          outgoing: ['sequenceFlow_lane_1_elt_6'],
          parentId: 'lane_01',
        });
        expectServiceTaskBpmnElement(bpmnElements[1], {
          id: 'serviceTask_2_1',
          incoming: ['Flow_0i9h5sw'],
          name: 'Service Task 2.1',
          outgoing: ['Flow_1hvyo7b'],
          parentId: 'lane_02',
        });
      });

      it('Pass duplicated kinds', () => {
        bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
        const bpmnElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([
          ShapeBpmnElementKind.TASK,
          ShapeBpmnElementKind.GATEWAY_PARALLEL,
          ShapeBpmnElementKind.GATEWAY_PARALLEL,
          ShapeBpmnElementKind.TASK,
        ]);
        expect(bpmnElements).toHaveLength(2);

        expectTaskBpmnElement(bpmnElements[0], {
          id: 'task_1',
          incoming: ['sequenceFlow_lane_1_elt_2'],
          name: 'Task 1',
          outgoing: ['Flow_1noi0ay'],
          parentId: 'lane_01',
        });
        expectParallelGatewayBpmnElement(bpmnElements[1], {
          id: 'gateway_02_parallel',
          name: 'gateway 2',
          parentId: 'lane_02',
        });
      });
    });
  });
});
