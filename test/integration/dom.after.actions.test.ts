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
import { BpmnElement, BpmnVisualization, FlowKind, OverlayEdgePosition, OverlayShapePosition, ShapeBpmnElementKind } from '../../src/bpmn-visualization';
import { expectSvgEvent, expectSvgPool, expectSvgSequenceFlow, expectSvgTask, HtmlElementLookup } from './helpers/html-utils';
import { ExpectedBaseBpmnElement, expectEndEvent, expectPool, expectSequenceFlow, expectServiceTask, expectStartEvent, expectTask } from '../unit/helpers/bpmn-semantic-utils';
import { overlayEdgePositionValues, overlayShapePositionValues } from '../helpers/overlays';

const bpmnVisualization = initializeBpmnVisualization();

// use container id
function initializeBpmnVisualization(containerId?: string): BpmnVisualization {
  const bpmnContainerId = containerId ?? 'bpmn-visualization-container';
  // insert bpmn container
  const containerDiv = document.createElement('div');
  containerDiv.id = bpmnContainerId;
  document.body.insertBefore(containerDiv, document.body.firstChild);
  // initialize bpmn-visualization
  return new BpmnVisualization({ container: bpmnContainerId });
}

function initializeBpmnVisualizationWithHtmlElement(): BpmnVisualization {
  // insert bpmn container
  const containerDiv = document.createElement('div');
  containerDiv.id = 'bpmn-visualization-container-alternative';
  document.body.insertBefore(containerDiv, document.body.firstChild);
  // initialize bpmn-visualization
  return new BpmnVisualization({ container: containerDiv });
}

describe.each`
  bv                                              | type
  ${bpmnVisualization}                            | ${'html id'}
  ${initializeBpmnVisualizationWithHtmlElement()} | ${'html element'}
`('Resulting DOM after diagram load - container set with "$type"', ({ bv }) => {
  it('DOM should contains BPMN elements when loading simple-start-task-end.bpmn', async () => {
    bv.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

    const htmlElementLookup = new HtmlElementLookup(bv);
    htmlElementLookup.expectStartEvent('StartEvent_1');
    htmlElementLookup.expectTask('Activity_1');
    htmlElementLookup.expectEndEvent('EndEvent_1');
  });

  it('DOM should contains BPMN elements when loading model-complete-semantic.bpmn', async () => {
    bv.load(readFileSync('../fixtures/bpmn/model-complete-semantic.bpmn'));

    const htmlElementLookup = new HtmlElementLookup(bv);
    htmlElementLookup.expectPool('participant_1_id');
    htmlElementLookup.expectLane('lane_4_1_id');

    htmlElementLookup.expectStartEvent('start_event_signal_id');
    htmlElementLookup.expectIntermediateThrowEvent('intermediate_throw_event_message_id');
  });
});

function expectStartEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectStartEvent(bpmnElement.bpmnSemantic, expected);
  expectSvgEvent(bpmnElement.htmlElement);
}

function expectEndEventBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectEndEvent(bpmnElement.bpmnSemantic, expected);
  expectSvgEvent(bpmnElement.htmlElement);
}

function expectSequenceFlowBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectSequenceFlow(bpmnElement.bpmnSemantic, expected);
  expectSvgSequenceFlow(bpmnElement.htmlElement);
}

function expectTaskBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectTask(bpmnElement.bpmnSemantic, expected);
  expectSvgTask(bpmnElement.htmlElement);
}

function expectServiceTaskBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectServiceTask(bpmnElement.bpmnSemantic, expected);
  expectSvgTask(bpmnElement.htmlElement);
}

function expectPoolBpmnElement(bpmnElement: BpmnElement, expected: ExpectedBaseBpmnElement): void {
  expectPool(bpmnElement.bpmnSemantic, expected);
  expectSvgPool(bpmnElement.htmlElement);
}

describe('Bpmn Elements registry - retrieve BPMN elements', () => {
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

describe('Bpmn Elements registry - CSS class management', () => {
  describe('Add classes', () => {
    it('Add one or several classes to one or several BPMN elements', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

      // default classes
      htmlElementLookup.expectServiceTask('serviceTask_1_2');
      htmlElementLookup.expectEndEvent('endEvent_message_1');

      // add a single class to a single element
      bpmnVisualization.bpmnElementsRegistry.addCssClasses('serviceTask_1_2', 'class1');
      htmlElementLookup.expectServiceTask('serviceTask_1_2', { additionalClasses: ['class1'] });

      // add several classes to several elements
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(['endEvent_message_1', 'serviceTask_1_2'], ['class2', 'class3']);
      htmlElementLookup.expectServiceTask('serviceTask_1_2', { additionalClasses: ['class1', 'class2', 'class3'] });
      htmlElementLookup.expectEndEvent('endEvent_message_1', { additionalClasses: ['class2', 'class3'] });
    });

    it('BPMN element does not exist', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

      const nonExistingBpmnId = 'i-do-not-exist-for-add';
      htmlElementLookup.expectNoElement(nonExistingBpmnId);
      // this call ensures that there is not issue on the rendering part
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(nonExistingBpmnId, 'class1');
    });
  });

  describe('Remove classes', () => {
    it('Remove one or several classes to one or several BPMN elements', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

      // default classes
      htmlElementLookup.expectUserTask('userTask_0');
      htmlElementLookup.expectLane('lane_01');

      // remove a single class from a single element
      bpmnVisualization.bpmnElementsRegistry.addCssClasses('userTask_0', 'class1');
      htmlElementLookup.expectUserTask('userTask_0', { additionalClasses: ['class1'] });
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses('userTask_0', 'class1');
      htmlElementLookup.expectUserTask('userTask_0');

      // remove several classes from several elements
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(['lane_01', 'userTask_0'], ['class1', 'class2', 'class3']);
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses(['lane_01', 'userTask_0'], ['class1', 'class3']);
      htmlElementLookup.expectLane('lane_01', { additionalClasses: ['class2'] });
      htmlElementLookup.expectUserTask('userTask_0', { additionalClasses: ['class2'] });
    });

    it('BPMN element does not exist', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

      const nonExistingBpmnId = 'i-do-not-exist-for-removal';
      htmlElementLookup.expectNoElement(nonExistingBpmnId);
      // this call ensures that there is not issue on the rendering part
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses(nonExistingBpmnId, 'class1');
    });
  });

  describe('Toggle classes', () => {
    it('Toggle one or several classes to one or several BPMN elements', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

      // toggle a classes for a single element
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('gateway_01', 'class1');
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('gateway_01', ['class1', 'class2']);
      htmlElementLookup.expectExclusiveGateway('gateway_01', { additionalClasses: ['class2'] });

      // toggle a classes for several elements
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['lane_02', 'gateway_01'], ['class1', 'class2', 'class3']);
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['lane_02', 'gateway_01'], ['class1', 'class3', 'class4']);
      htmlElementLookup.expectLane('lane_02', { additionalClasses: ['class2', 'class4'] });
      htmlElementLookup.expectExclusiveGateway('gateway_01', { additionalClasses: ['class4'] });
    });

    it('BPMN element does not exist', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

      const nonExistingBpmnId = 'i-do-not-exist-for-toggle';
      htmlElementLookup.expectNoElement(nonExistingBpmnId);
      // this call ensures that there is not issue on the rendering part
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(nonExistingBpmnId, 'class1');
    });
  });

  describe('Classes for Message Flow element and icon', () => {
    // NOTE: temporary use a dedicated `BpmnVisualization` instance in each test
    // Prevent bug to appear: classes are not purged from the internal CssRegistry on diagram load, so css classes added in a test are still present in the subsequent tests
    function generateContainerId(testNumber: number): string {
      return `bpmn-visualization-container-${testNumber}`;
    }

    it('Add one or several classes to message flows with and without icon', () => {
      const bpmnVisualization = initializeBpmnVisualization(generateContainerId(1));
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/message-flows-with-and-without-icon.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

      // default classes
      htmlElementLookup.expectMessageFlow('MessageFlow_1');
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', { hasIcon: true });
      htmlElementLookup.expectMessageFlow('MessageFlow_3_msgVisibilityKind_non_initiating', { hasIcon: true });

      // // add several classes to several message flows
      const additionalClasses = ['class1', 'class2'];
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(
        ['MessageFlow_1', 'MessageFlow_2_msgVisibilityKind_initiating', 'MessageFlow_3_msgVisibilityKind_non_initiating'],
        additionalClasses,
      );
      htmlElementLookup.expectMessageFlow('MessageFlow_1', { additionalClasses: additionalClasses });
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', { hasIcon: true, additionalClasses: additionalClasses });
      htmlElementLookup.expectMessageFlow('MessageFlow_3_msgVisibilityKind_non_initiating', { hasIcon: true, additionalClasses: additionalClasses });
    });

    it('Remove one or several classes to one or several message flows with icon', () => {
      const bpmnVisualization = initializeBpmnVisualization(generateContainerId(2));
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/message-flows-with-and-without-icon.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

      // remove a single class from a single element
      bpmnVisualization.bpmnElementsRegistry.addCssClasses('MessageFlow_1', 'class1');
      htmlElementLookup.expectMessageFlow('MessageFlow_1', { additionalClasses: ['class1'] });
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses('MessageFlow_1', 'class1');
      htmlElementLookup.expectMessageFlow('MessageFlow_1');

      // remove several classes from several elements
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(
        ['MessageFlow_2_msgVisibilityKind_initiating', 'MessageFlow_3_msgVisibilityKind_non_initiating'],
        ['class1', 'class2', 'class3'],
      );
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses(
        ['MessageFlow_2_msgVisibilityKind_initiating', 'MessageFlow_3_msgVisibilityKind_non_initiating'],
        ['class1', 'class3'],
      );
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', { hasIcon: true, additionalClasses: ['class2'] });
      htmlElementLookup.expectMessageFlow('MessageFlow_3_msgVisibilityKind_non_initiating', { hasIcon: true, additionalClasses: ['class2'] });
    });

    it('Toggle one or several classes to one or several message flows with icon', () => {
      const bpmnVisualization = initializeBpmnVisualization(generateContainerId(3));
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/message-flows-with-and-without-icon.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

      // toggle a classes for a single element
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('MessageFlow_2_msgVisibilityKind_initiating', 'class1');
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('MessageFlow_2_msgVisibilityKind_initiating', ['class1', 'class2']);
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', { hasIcon: true, additionalClasses: ['class2'] });

      // toggle a classes for several elements
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(
        ['MessageFlow_2_msgVisibilityKind_initiating', 'MessageFlow_3_msgVisibilityKind_non_initiating'],
        ['class1', 'class3', 'class4'],
      );
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', { hasIcon: true, additionalClasses: ['class2', 'class1', 'class3', 'class4'] });
      htmlElementLookup.expectMessageFlow('MessageFlow_3_msgVisibilityKind_non_initiating', { hasIcon: true, additionalClasses: ['class1', 'class3', 'class4'] });
    });
  });
});

describe('Bpmn Elements registry - Overlay management', () => {
  describe('BPMN Shape', () => {
    it('Add one overlay to a BPMN shape', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);
      htmlElementLookup.expectServiceTask('serviceTask_1_2');

      // add a single overlay
      const overlayLabel = '123';
      bpmnVisualization.bpmnElementsRegistry.addOverlays('serviceTask_1_2', { label: overlayLabel, position: 'top-left' });

      htmlElementLookup.expectServiceTask('serviceTask_1_2', { overlayLabel });
    });

    it.each(overlayShapePositionValues)("Ensure no issue when adding one overlay at position '%s' to a BPMN Shape", (position: OverlayShapePosition) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/overlays/overlays.start.flow.task.gateway.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);
      htmlElementLookup.expectExclusiveGateway('Gateway_1');

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Gateway_1', { label: 'Yes', position: position });
      htmlElementLookup.expectExclusiveGateway('Gateway_1', { overlayLabel: 'Yes' });
    });

    it('Remove all overlays from a BPMN shape', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);
      htmlElementLookup.expectServiceTask('serviceTask_1_2');

      // remove all overlays
      bpmnVisualization.bpmnElementsRegistry.addOverlays('serviceTask_1_2', { label: '8789', position: 'top-left' });
      bpmnVisualization.bpmnElementsRegistry.removeAllOverlays('serviceTask_1_2');

      htmlElementLookup.expectServiceTask('serviceTask_1_2');
    });
  });

  describe('BPMN Edge', () => {
    it.each(overlayEdgePositionValues)("Ensure no issue when adding one overlay at position '%s' to a BPMN Edge without waypoints", (position: OverlayEdgePosition) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/overlays/overlays.start.flow.task.gateway.no.waypoints.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);
      htmlElementLookup.expectSequenceFlow('Flow_1');

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Flow_1', { label: 'important', position: position });
      htmlElementLookup.expectSequenceFlow('Flow_1', { overlayLabel: 'important' });
    });
    it.each(overlayEdgePositionValues)("Ensure no issue when adding one overlay at position '%s' to a BPMN Edge with waypoints", (position: OverlayEdgePosition) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/overlays/overlays.edges.associations.complex.paths.bpmn'));
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);
      htmlElementLookup.expectAssociation('Association_3_waypoints');

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Association_3_waypoints', { label: 'warning', position: position });
      htmlElementLookup.expectAssociation('Association_3_waypoints', { overlayLabel: 'warning' });
    });
  });
});
