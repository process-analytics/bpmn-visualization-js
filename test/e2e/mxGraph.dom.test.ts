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
import { readFileSync } from '../helpers/file-helper';
import { BpmnElement, BpmnVisualization, ShapeBpmnElementKind } from '../../src/bpmn-visualization';
import { FlowKind } from '../../src/model/bpmn/internal/edge/FlowKind';
import { expectSvgEvent, expectSvgPool, expectSvgSequenceFlow, expectSvgTask, HtmlElementLookup } from './helpers/visu/html-utils';

const bpmnContainerId = 'bpmn-visualization-container';
const bpmnVisualization = initializeBpmnVisualization();

function initializeBpmnVisualization(): BpmnVisualization {
  // insert bpmn container
  const containerDiv = document.createElement('div');
  containerDiv.id = bpmnContainerId;
  document.body.insertBefore(containerDiv, document.body.firstChild);
  // initialize bpmn-visualization
  return new BpmnVisualization({ container: bpmnContainerId });
}

describe('DOM only checks', () => {
  it('DOM should contains BPMN elements when loading simple-start-task-end.bpmn', async () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

    const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);
    htmlElementLookup.expectStartEvent('StartEvent_1');
    htmlElementLookup.expectTask('Activity_1');
    htmlElementLookup.expectEndEvent('EndEvent_1');
  });
});

interface ExpectedBaseBpmnElement {
  id: string;
  name?: string;
}

function expectShapeBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  const bpmnSemantic = bpmnElement.bpmnSemantic;
  expect(bpmnSemantic.id).toEqual(expected.id);
  expect(bpmnSemantic.name).toEqual(expected.name);
  expect(bpmnSemantic.isShape).toBeTruthy();
}

function expectStartEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectShapeBpmnElement(bpmnElement, expected);
  expect(bpmnElement.bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.EVENT_START);

  expectSvgEvent(bpmnElement.htmlElement);
}

function expectEndEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectShapeBpmnElement(bpmnElement, expected);
  expect(bpmnElement.bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.EVENT_END);

  expectSvgEvent(bpmnElement.htmlElement);
}

function expectSequenceFlowBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  const bpmnSemantic = bpmnElement.bpmnSemantic;
  expect(bpmnSemantic.id).toEqual(expected.id);
  expect(bpmnSemantic.name).toEqual(expected.name);
  expect(bpmnSemantic.isShape).toBeFalsy();
  expect(bpmnSemantic.kind).toEqual(FlowKind.SEQUENCE_FLOW);

  expectSvgSequenceFlow(bpmnElement.htmlElement);
}

function expectTaskBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectShapeBpmnElement(bpmnElement, expected);
  expect(bpmnElement.bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.TASK);

  expectSvgTask(bpmnElement.htmlElement);
}

function expectServiceTaskBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectShapeBpmnElement(bpmnElement, expected);
  expect(bpmnElement.bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.TASK_SERVICE);

  expectSvgTask(bpmnElement.htmlElement);
}

function expectPoolBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectShapeBpmnElement(bpmnElement, expected);
  expect(bpmnElement.bpmnSemantic.kind).toEqual(ShapeBpmnElementKind.POOL);

  expectSvgPool(bpmnElement.htmlElement);
}

describe('Bpmn Elements registry', () => {
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

describe('Bpmn Elements registry - CSS class management', () => {
  it('Add classes', () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

    // default classes
    htmlElementLookup.expectServiceTask('serviceTask_1_2');
    htmlElementLookup.expectEndEvent('endEvent_message_1');

    // add a single class to a single element
    bpmnVisualization.bpmnElementsRegistry.addCssClasses('serviceTask_1_2', 'class1');
    htmlElementLookup.expectServiceTask('serviceTask_1_2', ['class1']);

    // add a several classes to a several elements
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(['endEvent_message_1', 'serviceTask_1_2'], ['class2', 'class3']);
    htmlElementLookup.expectServiceTask('serviceTask_1_2', ['class1', 'class2', 'class3']);
    htmlElementLookup.expectEndEvent('endEvent_message_1', ['class2', 'class3']);
  });

  it('No issue when element does not exist', () => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
    const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

    const nonExistingBpmnId = 'i-do-not-exist-for-sure';
    htmlElementLookup.expectNoElement(nonExistingBpmnId);
    // this call ensure that there is not issue on the rendering part
    bpmnVisualization.bpmnElementsRegistry.addCssClasses(nonExistingBpmnId, 'class1');
  });
});
