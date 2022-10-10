/**
 * Copyright 2021 Bonitasoft S.A.
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
import { initializeBpmnVisualizationWithContainerId } from './helpers/bpmn-visualization-initialization';
import { HtmlElementLookup } from './helpers/html-utils';
import { ShapeBpmnEventDefinitionKind } from '../../src/model/bpmn/internal';

describe('Bpmn Elements registry - CSS class management', () => {
  const bpmnVisualization = initializeBpmnVisualizationWithContainerId();
  const htmlElementLookup = new HtmlElementLookup(bpmnVisualization);

  describe('Add classes', () => {
    it('Add one or several classes to one or several BPMN elements', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      // default classes
      htmlElementLookup.expectServiceTask('serviceTask_1_2', { label: 'Service Task 1.2' });
      htmlElementLookup.expectEndEvent('endEvent_message_1', ShapeBpmnEventDefinitionKind.MESSAGE, { label: 'message end 2' });
      htmlElementLookup.expectSequenceFlow('Flow_1bewc4s', { label: 'link' });

      // add a single class to a single element
      bpmnVisualization.bpmnElementsRegistry.addCssClasses('serviceTask_1_2', 'class1');
      htmlElementLookup.expectServiceTask('serviceTask_1_2', { label: 'Service Task 1.2', additionalClasses: ['class1'] });

      // add several classes to several elements
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(['endEvent_message_1', 'serviceTask_1_2', 'Flow_1bewc4s'], ['class2', 'class3']);
      htmlElementLookup.expectServiceTask('serviceTask_1_2', { label: 'Service Task 1.2', additionalClasses: ['class1', 'class2', 'class3'] });
      htmlElementLookup.expectEndEvent('endEvent_message_1', ShapeBpmnEventDefinitionKind.MESSAGE, { label: 'message end 2', additionalClasses: ['class2', 'class3'] });
      htmlElementLookup.expectSequenceFlow('Flow_1bewc4s', { label: 'link', additionalClasses: ['class2', 'class3'] });

      // add several classes by passing classes in a single string separated with spaces
      // not documented in the API but this is working
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(['endEvent_message_1'], ['extra-class1 extra-class2 extra-class3']);
      htmlElementLookup.expectEndEvent('endEvent_message_1', ShapeBpmnEventDefinitionKind.MESSAGE, {
        additionalClasses: ['class2', 'class3', 'extra-class1', 'extra-class2', 'extra-class3'],
      });
    });

    it('BPMN element does not exist', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn'));

      const nonExistingBpmnId = 'i-do-not-exist-for-add';
      htmlElementLookup.expectNoElement(nonExistingBpmnId);
      // this call ensures that there is not issue on the rendering part
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(nonExistingBpmnId, 'class1');
    });

    it('Css classes are cleaned between 2 diagram loads', () => {
      const bpmnVisualizationMultipleLoads = initializeBpmnVisualizationWithContainerId('bpmn-container-multiple-loads');
      const htmlElementLookup = new HtmlElementLookup(bpmnVisualizationMultipleLoads);

      const bpmnDiagramContent = readFileSync('../fixtures/bpmn/simple-start-task-end.bpmn');
      const startEventId = 'StartEvent_1';

      // first load
      bpmnVisualizationMultipleLoads.load(bpmnDiagramContent);
      htmlElementLookup.expectStartEvent(startEventId, ShapeBpmnEventDefinitionKind.NONE);
      bpmnVisualizationMultipleLoads.bpmnElementsRegistry.addCssClasses(startEventId, 'class1-added-on-first-load');
      htmlElementLookup.expectStartEvent(startEventId, ShapeBpmnEventDefinitionKind.NONE, { additionalClasses: ['class1-added-on-first-load'] });

      // second load
      bpmnVisualizationMultipleLoads.load(bpmnDiagramContent);
      htmlElementLookup.expectStartEvent(startEventId, ShapeBpmnEventDefinitionKind.NONE);
      bpmnVisualizationMultipleLoads.bpmnElementsRegistry.addCssClasses(startEventId, 'class2-added-on-second-load');
      htmlElementLookup.expectStartEvent(startEventId, ShapeBpmnEventDefinitionKind.NONE, { additionalClasses: ['class2-added-on-second-load'] });
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

      // remove several classes by passing classes in a single string separated with spaces
      // this is not working (remember this is working for 'add css classes')
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(['userTask_0'], ['extra-class1', 'extra-class2', 'extra-class3']);
      htmlElementLookup.expectUserTask('userTask_0', { additionalClasses: ['class2', 'extra-class1', 'extra-class2', 'extra-class3'] });
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses(['userTask_0'], ['extra-class1 extra-class2 extra-class3']);
      htmlElementLookup.expectUserTask('userTask_0', { additionalClasses: ['class2', 'extra-class1', 'extra-class2', 'extra-class3'] });

      // add the class with spaces and remove them with spaces
      const extraClassNamesToAddThenRemove = ['extra-class1 extra-class2 extra-class3'];
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(['lane_01'], extraClassNamesToAddThenRemove);
      htmlElementLookup.expectLane('lane_01', { additionalClasses: ['class2', 'extra-class1', 'extra-class2', 'extra-class3'] });
      bpmnVisualization.bpmnElementsRegistry.removeCssClasses(['lane_01'], extraClassNamesToAddThenRemove);
      htmlElementLookup.expectLane('lane_01', { additionalClasses: ['class2'] });
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

      // toggle several classes by passing classes in a single string separated with spaces
      // this is not working (remember this is working for 'add css classes')
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['gateway_01'], ['extra-class1', 'extra-class2']);
      htmlElementLookup.expectExclusiveGateway('gateway_01', { additionalClasses: ['class4', 'extra-class1', 'extra-class2'] });
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['gateway_01'], ['extra-class1 extra-class2']);
      htmlElementLookup.expectExclusiveGateway('gateway_01', { additionalClasses: ['class4', 'extra-class1', 'extra-class2', 'extra-class1', 'extra-class2'] });

      // add the class with spaces and remove them with spaces
      const extraClassNamesToAddThenRemove = ['extra-class1 extra-class3'];
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['lane_02'], extraClassNamesToAddThenRemove);
      htmlElementLookup.expectLane('lane_02', { additionalClasses: ['class2', 'class4', 'extra-class1', 'extra-class3'] });
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['lane_02'], extraClassNamesToAddThenRemove);
      htmlElementLookup.expectLane('lane_02', { additionalClasses: ['class2', 'class4'] });
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
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', { hasIcon: true, isInitiatingIcon: true });
      htmlElementLookup.expectMessageFlow('MessageFlow_3_msgVisibilityKind_non_initiating', { hasIcon: true, isInitiatingIcon: false });

      // add several classes to several message flows
      const additionalClasses = ['class1', 'class2'];
      bpmnVisualization.bpmnElementsRegistry.addCssClasses(
        ['MessageFlow_1', 'MessageFlow_2_msgVisibilityKind_initiating', 'MessageFlow_3_msgVisibilityKind_non_initiating'],
        additionalClasses,
      );
      htmlElementLookup.expectMessageFlow('MessageFlow_1', { additionalClasses: additionalClasses });
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', { hasIcon: true, isInitiatingIcon: true, additionalClasses: additionalClasses });
      htmlElementLookup.expectMessageFlow('MessageFlow_3_msgVisibilityKind_non_initiating', { hasIcon: true, isInitiatingIcon: false, additionalClasses: additionalClasses });
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
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', { hasIcon: true, isInitiatingIcon: true, additionalClasses: ['class2'] });
      htmlElementLookup.expectMessageFlow('MessageFlow_3_msgVisibilityKind_non_initiating', { hasIcon: true, isInitiatingIcon: false, additionalClasses: ['class2'] });
    });

    it('Toggle one or several classes to one or several message flows with icon', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/message-flows-with-and-without-icon.bpmn'));

      // toggle a classes for a single element
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('MessageFlow_2_msgVisibilityKind_initiating', 'class1');
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('MessageFlow_2_msgVisibilityKind_initiating', ['class1', 'class2']);
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', { hasIcon: true, isInitiatingIcon: true, additionalClasses: ['class2'] });

      // toggle a classes for several elements
      bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(
        ['MessageFlow_2_msgVisibilityKind_initiating', 'MessageFlow_3_msgVisibilityKind_non_initiating'],
        ['class1', 'class3', 'class4'],
      );
      htmlElementLookup.expectMessageFlow('MessageFlow_2_msgVisibilityKind_initiating', {
        hasIcon: true,
        isInitiatingIcon: true,
        additionalClasses: ['class2', 'class1', 'class3', 'class4'],
      });
      htmlElementLookup.expectMessageFlow('MessageFlow_3_msgVisibilityKind_non_initiating', {
        hasIcon: true,
        isInitiatingIcon: false,
        additionalClasses: ['class1', 'class3', 'class4'],
      });
    });
  });
});
