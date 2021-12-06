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
import { BpmnVisualization, FlowKind, OverlayEdgePosition, OverlayShapePosition, ShapeBpmnElementKind } from '../../src/bpmn-visualization';
import { HtmlElementLookup } from './helpers/html-utils';
import { overlayEdgePositionValues, overlayShapePositionValues } from '../helpers/overlays';
import {
  expectEndEventBpmnElement,
  expectPoolBpmnElement,
  expectSequenceFlowBpmnElement,
  expectServiceTaskBpmnElement,
  expectStartEventBpmnElement,
  expectTaskBpmnElement,
} from './helpers/semantic-with-svg-utils';
import { mxgraph } from '../../src/component/mxgraph/initializer';
import { insertBpmnContainer } from './helpers/dom-utils';

beforeAll(() => {
  // Force usage of ForeignObject
  // By default, mxGraph detects no ForeignObject support when running tests in jsdom environment
  mxgraph.mxClient.NO_FO = false;
});

const bpmnVisualization = initializeBpmnVisualization();
const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

// use container id
function initializeBpmnVisualization(containerId?: string): BpmnVisualization {
  const bpmnContainerId = containerId ?? 'bpmn-visualization-container';
  insertBpmnContainer(bpmnContainerId);
  return new BpmnVisualization({ container: bpmnContainerId });
}

function initializeBpmnVisualizationWithHtmlElement(): BpmnVisualization {
  const containerDiv = insertBpmnContainer('bpmn-visualization-container-alternative');
  return new BpmnVisualization({ container: containerDiv });
}

describe.each`
  bv                                              | type
  ${bpmnVisualization}                            | ${'html id'}
  ${initializeBpmnVisualizationWithHtmlElement()} | ${'html element'}
`('Resulting DOM after diagram load - container set with "$type"', ({ bv }) => {
  const htmlElementLookup = new HtmlElementLookup(bv);

  it('DOM should contains BPMN elements when loading simple-start-task-end.bpmn', async () => {
    bv.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

    htmlElementLookup.expectStartEvent('StartEvent_1');
    htmlElementLookup.expectTask('Activity_1');
    htmlElementLookup.expectEndEvent('EndEvent_1');
  });

  it('DOM should contains BPMN elements when loading model-complete-semantic.bpmn', async () => {
    bv.load(readFileSync('../fixtures/bpmn/model-complete-semantic.bpmn'));

    htmlElementLookup.expectPool('participant_1_id');
    htmlElementLookup.expectLane('lane_4_1_id');

    htmlElementLookup.expectStartEvent('start_event_signal_id');
    htmlElementLookup.expectIntermediateThrowEvent('intermediate_throw_event_message_id');
  });
});

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

      // default classes
      htmlElementLookup.expectServiceTask('serviceTask_1_2', { label: 'Service Task 1.2' });
      htmlElementLookup.expectEndEvent('endEvent_message_1', { label: 'message end 2' });
      htmlElementLookup.expectSequenceFlow('Flow_1bewc4s', { label: 'link' });

      // add a single class to a single element
      bpmnVisualization.bpmnElementsRegistry.addCssClasses('serviceTask_1_2', 'class1');
      htmlElementLookup.expectServiceTask('serviceTask_1_2', { label: 'Service Task 1.2', additionalClasses: ['class1'] });

      // add several classes to several elements
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(['endEvent_message_1', 'serviceTask_1_2', 'Flow_1bewc4s'], ['class2', 'class3']);
      htmlElementLookup.expectServiceTask('serviceTask_1_2', { label: 'Service Task 1.2', additionalClasses: ['class1', 'class2', 'class3'] });
      htmlElementLookup.expectEndEvent('endEvent_message_1', { label: 'message end 2', additionalClasses: ['class2', 'class3'] });
      htmlElementLookup.expectSequenceFlow('Flow_1bewc4s', { label: 'link', additionalClasses: ['class2', 'class3'] });
    });

    it('BPMN element does not exist', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

      const nonExistingBpmnId = 'i-do-not-exist-for-add';
      htmlElementLookup.expectNoElement(nonExistingBpmnId);
      // this call ensures that there is not issue on the rendering part
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(nonExistingBpmnId, 'class1');
    });

    it('Css classes are cleaned between 2 diagram loads', () => {
      const bpmnVisualizationMultipleLoads = initializeBpmnVisualization('bpmn-container-multiple-loads');
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualizationMultipleLoads);

      const bpmnDiagramContent = readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn');
      const startEventId = 'StartEvent_1';

      // first load
      bpmnVisualizationMultipleLoads.load(bpmnDiagramContent);
      htmlElementLookup.expectStartEvent(startEventId);
      bpmnVisualizationMultipleLoads.bpmnElementsRegistry.addCssClasses(startEventId, 'class1-added-on-first-load');
      htmlElementLookup.expectStartEvent(startEventId, { additionalClasses: ['class1-added-on-first-load'] });

      // second load
      bpmnVisualizationMultipleLoads.load(bpmnDiagramContent);
      htmlElementLookup.expectStartEvent(startEventId);
      bpmnVisualizationMultipleLoads.bpmnElementsRegistry.addCssClasses(startEventId, 'class2-added-on-second-load');
      htmlElementLookup.expectStartEvent(startEventId, { additionalClasses: ['class2-added-on-second-load'] });
    });
  });

  describe('Remove classes', () => {
    it('Remove one or several classes to one or several BPMN elements', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      // default classes
      htmlElementLookup.expectUserTask('userTask_0', { label: 'User Task 0' });
      htmlElementLookup.expectLane('lane_01', { label: 'Lane 3' });

      // remove a single class from a single element
      bpmnVisualization.bpmnElementsRegistry.addCssClasses('userTask_0', 'class1');
      htmlElementLookup.expectUserTask('userTask_0', { label: 'User Task 0', additionalClasses: ['class1'] });
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses('userTask_0', 'class1');
      htmlElementLookup.expectUserTask('userTask_0', { label: 'User Task 0' });

      // remove several classes from several elements
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(['lane_01', 'userTask_0'], ['class1', 'class2', 'class3']);
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses(['lane_01', 'userTask_0'], ['class1', 'class3']);
      htmlElementLookup.expectLane('lane_01', { label: 'Lane 3', additionalClasses: ['class2'] });
      htmlElementLookup.expectUserTask('userTask_0', { label: 'User Task 0', additionalClasses: ['class2'] });
    });

    it('BPMN element does not exist', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

      const nonExistingBpmnId = 'i-do-not-exist-for-removal';
      htmlElementLookup.expectNoElement(nonExistingBpmnId);
      // this call ensures that there is not issue on the rendering part
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses(nonExistingBpmnId, 'class1');
    });
  });

  describe('Toggle classes', () => {
    it('Toggle one or several classes to one or several BPMN elements', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      // toggle a classes for a single element
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('gateway_01', 'class1');
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('gateway_01', ['class1', 'class2']);
      htmlElementLookup.expectExclusiveGateway('gateway_01', { label: 'gateway 1', additionalClasses: ['class2'] });

      // toggle a classes for several elements
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['lane_02', 'gateway_01'], ['class1', 'class2', 'class3']);
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['lane_02', 'gateway_01'], ['class1', 'class3', 'class4']);
      htmlElementLookup.expectLane('lane_02', { label: 'Lane 2', additionalClasses: ['class2', 'class4'] });
      htmlElementLookup.expectExclusiveGateway('gateway_01', { label: 'gateway 1', additionalClasses: ['class4'] });
    });

    it('BPMN element does not exist', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

      const nonExistingBpmnId = 'i-do-not-exist-for-toggle';
      htmlElementLookup.expectNoElement(nonExistingBpmnId);
      // this call ensures that there is not issue on the rendering part
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(nonExistingBpmnId, 'class1');
    });
  });

  describe('Classes for Message Flow element and icon', () => {
    it('Add one or several classes to message flows with and without icon', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/message-flows-with-and-without-icon.bpmn'));

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
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/message-flows-with-and-without-icon.bpmn'));

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
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/message-flows-with-and-without-icon.bpmn'));

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
      htmlElementLookup.expectServiceTask('serviceTask_1_2');

      // add a single overlay
      const overlayLabel = '123';
      bpmnVisualization.bpmnElementsRegistry.addOverlays('serviceTask_1_2', { label: overlayLabel, position: 'top-left' });

      htmlElementLookup.expectServiceTask('serviceTask_1_2', { overlayLabel });
    });

    it.each(overlayShapePositionValues)("Ensure no issue when adding one overlay at position '%s' to a BPMN Shape", (position: OverlayShapePosition) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/overlays/overlays.start.flow.task.gateway.bpmn'));
      htmlElementLookup.expectExclusiveGateway('Gateway_1');

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Gateway_1', { label: 'Yes', position: position });
      htmlElementLookup.expectExclusiveGateway('Gateway_1', { overlayLabel: 'Yes' });
    });

    it('Remove all overlays from a BPMN shape', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
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
      htmlElementLookup.expectSequenceFlow('Flow_1');

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Flow_1', { label: 'important', position: position });
      htmlElementLookup.expectSequenceFlow('Flow_1', { overlayLabel: 'important' });
    });
    it.each(overlayEdgePositionValues)("Ensure no issue when adding one overlay at position '%s' to a BPMN Edge with waypoints", (position: OverlayEdgePosition) => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/overlays/overlays.edges.associations.complex.paths.bpmn'));
      htmlElementLookup.expectAssociation('Association_3_waypoints');

      bpmnVisualization.bpmnElementsRegistry.addOverlays('Association_3_waypoints', { label: 'warning', position: position });
      htmlElementLookup.expectAssociation('Association_3_waypoints', { overlayLabel: 'warning' });
    });
  });
});
