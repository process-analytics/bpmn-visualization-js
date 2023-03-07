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

import { initializeBpmnVisualizationWithContainerId } from './helpers/bpmn-visualization-initialization';
import { HtmlElementLookup } from './helpers/html-utils';
import { bpmnVisualization } from './helpers/model-expect';
import { readFileSync } from '../helpers/file-helper';
import type { ExpectedStateStyle } from './matchers/matcher-utils';
import { ShapeBpmnEventDefinitionKind } from '../../src/model/bpmn/internal';
import { StyleDefault } from '../../src/component/mxgraph/style';
import type { StyleUpdate } from '../../src/component/registry';

// This function really gets style from the state of the cell in the graph view.
// The functions that return ExpectedStateStyle objects are in fact, returning a computed style by using the style properties from the model augmented with the properties resolved
// from the styles referenced by the cell. The object isn't related to the cached value stored in the style property of the mxCell state stored in the mxGraphView.
//
// This function will be later reintegrated in the usual utility code managing model expected when the functions returning ExpectedStateStyle will be renamed for clarity.
const expectActualStateStyle = (bpmnElementId: string, expectedStateStyle: Partial<ExpectedStateStyle>, bv = bpmnVisualization): void => {
  const graph = bv.graph;
  const cell = graph.model.getCell(bpmnElementId);
  if (!cell) {
    throw new Error(`Unable to find cell in the model with id ${bpmnElementId}`);
  }
  const view = graph.getView();
  const state = view.getState(cell);
  const style = state.style;
  expect(style.strokeColor).toBe(expectedStateStyle.strokeColor ?? StyleDefault.DEFAULT_STROKE_COLOR);
};

describe('mxGraph model - update style', () => {
  describe('Shapes', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    });

    it('A single element', () => {
      const strokeColor = 'red';
      bpmnVisualization.bpmnElementsRegistry.updateStyle('userTask_2_2', { stroke: { color: strokeColor } });

      expectActualStateStyle('userTask_2_2', { strokeColor });
      expect('userTask_2_2').toBeUserTask({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
    });

    it('Several elements', () => {
      const strokeColor = 'pink';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['task_1', 'gateway_01'], { stroke: { color: strokeColor } });

      expectActualStateStyle('task_1', { strokeColor });
      expect('task_1').toBeTask({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        label: 'Task 1',
      });
      expectActualStateStyle('gateway_01', { strokeColor });
      expect('gateway_01').toBeExclusiveGateway({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        label: 'gateway 1',
        verticalAlign: 'top',
      });
    });

    it('Update the style twice - specify the property both times', () => {
      const strokeColor = 'yellow';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['endEvent_terminate_1'], { stroke: { color: 'to_override' } });
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['endEvent_terminate_1'], { stroke: { color: strokeColor } });

      expectActualStateStyle('endEvent_terminate_1', { strokeColor });
      expect('endEvent_terminate_1').toBeEndEvent({
        stroke: { color: strokeColor },
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.TERMINATE,
        parentId: 'lane_01',
        label: 'terminate end 1',
      });
    });

    it('Update the style twice - specify the property only the first time', () => {
      const strokeColor = 'green';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['endEvent_terminate_1'], { stroke: { color: strokeColor } });
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['endEvent_terminate_1'], {});

      expectActualStateStyle('endEvent_terminate_1', { strokeColor });
      expect('endEvent_terminate_1').toBeEndEvent({
        stroke: { color: strokeColor },
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.TERMINATE,
        parentId: 'lane_01',
        label: 'terminate end 1',
      });
    });
  });

  describe('Edges', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    });

    it('On a single element', () => {
      const strokeColor = 'pink';
      bpmnVisualization.bpmnElementsRegistry.updateStyle('sequenceFlow_lane_3_elt_3', { stroke: { color: strokeColor } });

      expectActualStateStyle('sequenceFlow_lane_3_elt_3', { strokeColor });
      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });

    it('Several elements', () => {
      const strokeColor = 'pink';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['sequenceFlow_lane_3_elt_3', 'sequenceFlow_lane_1_elt_1'], { stroke: { color: strokeColor } });

      expectActualStateStyle('sequenceFlow_lane_3_elt_3', { strokeColor });
      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
      expectActualStateStyle('sequenceFlow_lane_1_elt_1', { strokeColor });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });

    it('Update the style twice - specify the property both times', () => {
      const strokeColor = 'gray';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['sequenceFlow_lane_1_elt_1'], { stroke: { color: 'to_override' } });
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['sequenceFlow_lane_1_elt_1'], { stroke: { color: strokeColor } });

      expectActualStateStyle('sequenceFlow_lane_1_elt_1', { strokeColor });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });

    it('Update the style twice - specify the property only the first time', () => {
      const strokeColor = 'DarkBlue';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['sequenceFlow_lane_1_elt_1'], { stroke: { color: strokeColor } });
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['sequenceFlow_lane_1_elt_1'], {});

      expectActualStateStyle('sequenceFlow_lane_1_elt_1', { strokeColor });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });
  });

  describe('Both Edges and Shapes', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    });

    describe('Pass unset "update style" object', () => {
      // Validate that this doesn't break and keep default style
      // Only check for a shape, edges share the same implementation
      it.each`
        configName        | config
        ${'undefined'}    | ${undefined}
        ${'null'}         | ${null}
        ${'empty'}        | ${{}}
        ${'empty stroke'} | ${{ stroke: {} }}
      `(`$configName`, ({ styleUpdate }: { styleUpdate: StyleUpdate }) => {
        bpmnVisualization.bpmnElementsRegistry.updateStyle('userTask_2_2', styleUpdate);

        expectActualStateStyle('userTask_2_2', {});
        expect('userTask_2_2').toBeUserTask({
          // not under test
          parentId: 'lane_02',
          label: 'User Task 2.2',
        });
      });
    });

    it('Non existing elements', () => {
      // Check that there is no error
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['i_do_not_exist_1', 'i_do_not_exist_2'], { stroke: { color: 'green' } });
    });

    it('Several elements', () => {
      const strokeColor = 'orange';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['startEvent_lane_1', 'sequenceFlow_lane_1_elt_1'], { stroke: { color: strokeColor } });

      expectActualStateStyle('startEvent_lane_1', { strokeColor });
      expect('startEvent_lane_1').toBeStartEvent({
        stroke: { color: strokeColor },
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        parentId: 'lane_01',
        label: 'message start 1',
      });

      expectActualStateStyle('sequenceFlow_lane_1_elt_1', { strokeColor });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });
  });

  // Check that there is no bad interactions between the two features
  describe('Both style API update and CSS class', () => {
    // Create a dedicated instance with a DOM container as it is required by the CSS API.
    const bv = initializeBpmnVisualizationWithContainerId('bpmn-container-style-css-cross-tests');
    const htmlElementLookup = new HtmlElementLookup(bv);

    it.each(
      // We have a bug when the CSS classes are applied first, they are dropped after the call of the updateStyle method
      // See https://github.com/process-analytics/bpmn-visualization-js/issues/2561
      // When fixed, it.each should use [true, false]
      [true],
    )('Apply style update first %s', (isStyleUpdateAppliedFirst: boolean) => {
      bv.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      const bpmnElementId = 'endEvent_message_1';
      const strokeColor = 'pink';
      const cssClassName = ['class-1', 'class-2'];
      if (isStyleUpdateAppliedFirst) {
        bv.bpmnElementsRegistry.updateStyle(bpmnElementId, { stroke: { color: strokeColor } });
        bv.bpmnElementsRegistry.addCssClasses(bpmnElementId, cssClassName);
      } else {
        bv.bpmnElementsRegistry.addCssClasses(bpmnElementId, cssClassName);
        bv.bpmnElementsRegistry.updateStyle(bpmnElementId, { stroke: { color: strokeColor } });
      }

      // we cannot reuse the model expect functions here. They are using the shared bpmnVisualization that we cannot use here.
      // So use the minimal expect function. We only need to check a part of the data, the rest is already checked in details in other tests.
      expectActualStateStyle(bpmnElementId, { strokeColor }, bv);
      htmlElementLookup.expectEndEvent(bpmnElementId, ShapeBpmnEventDefinitionKind.MESSAGE, { label: 'message end 2', additionalClasses: ['class-1', 'class-2'] });
    });
  });
});
