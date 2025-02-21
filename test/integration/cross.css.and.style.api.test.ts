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

import type { ExpectedEdgeModelElement, ExpectedShapeModelElement } from './helpers/model-expect';
import type { mxCell } from 'mxgraph';

import { initializeBpmnVisualizationWithContainerId } from './helpers/bpmn-visualization-initialization';
import { HtmlElementLookup } from './helpers/html-utilities';
import { buildReceivedResolvedModelCellStyle, buildReceivedViewStateStyle } from './matchers/matcher-utilities';
import { buildExpectedEdgeCellStyle } from './matchers/toBeEdge';
import { buildExpectedShapeCellStyle } from './matchers/toBeShape';

import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';
import { readFileSync } from '@test/shared/file-helper';

// Here, we are checking both the model and the DOM.
// This fully ensures that the usage of both APIs have no impact on the model update and that the repaints are correctly done.

// We cannot reuse the shared model expect functions here. They are using the shared `bpmnVisualization` instance that we cannot use here because we need a dedicated instance to be able to check the DOM.
// So, we use the basic expect model functions. We only need to check a part of the data, the rest is already checked in details in other tests.

// Create a dedicated instance with a DOM container as it is required by the CSS API.
const bv = initializeBpmnVisualizationWithContainerId('bpmn-container-style-css-cross-tests');
const bpmnElementsRegistry = bv.bpmnElementsRegistry;

const getCell = (bpmnElementId: string): mxCell => {
  const graph = bv.graph;
  const cell = graph.model.getCell(bpmnElementId);
  if (!cell) {
    throw new Error(`Unable to find cell in the model with id ${bpmnElementId}`);
  }
  return cell;
};

const htmlElementLookup = new HtmlElementLookup(bv);
const checkFlowNode = (bpmnElementId: string, expectedModel: ExpectedShapeModelElement): void => {
  // check mxGraph model
  expect(buildReceivedResolvedModelCellStyle(getCell(bpmnElementId), bv)).toEqual(buildExpectedShapeCellStyle(expectedModel));
  expect(buildReceivedViewStateStyle(getCell(bpmnElementId), bv)).toEqual(buildExpectedShapeCellStyle(expectedModel));
  // check DOM
  const checks = { label: expectedModel.label, additionalClasses: expectedModel.extraCssClasses };
  const kind = expectedModel.kind;
  if (kind == ShapeBpmnElementKind.GATEWAY_EXCLUSIVE) {
    htmlElementLookup.expectExclusiveGateway(bpmnElementId, checks);
  } else if (kind == ShapeBpmnElementKind.TASK_USER) {
    htmlElementLookup.expectUserTask(bpmnElementId, checks);
  } else {
    htmlElementLookup.expectEndEvent(bpmnElementId, ShapeBpmnEventDefinitionKind.MESSAGE, checks);
  }
};

const checkSequenceFlow = (bpmnElementId: string, expectedModel: ExpectedEdgeModelElement): void => {
  expectedModel.endArrow = 'blockThin';
  expectedModel.verticalAlign = 'bottom'; // the element has a label
  // check mxGraph model
  expect(buildReceivedResolvedModelCellStyle(getCell(bpmnElementId), bv)).toEqual(buildExpectedEdgeCellStyle(expectedModel));
  expect(buildReceivedViewStateStyle(getCell(bpmnElementId), bv)).toEqual(buildExpectedEdgeCellStyle(expectedModel));
  // check DOM
  htmlElementLookup.expectSequenceFlow(bpmnElementId, { label: expectedModel.label, additionalClasses: expectedModel.extraCssClasses });
};

describe('Verify interaction between the CSS and style APIs', () => {
  beforeEach(() => {
    bv.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
  });

  describe('Both style API update and CSS class', () => {
    it.each([true, false])('Apply style update first %s', (isStyleUpdateAppliedFirst: boolean) => {
      const bpmnElementId = 'endEvent_message_1';
      const strokeColor = 'pink';
      const cssClassNames = ['class-1', 'class-2'];
      if (isStyleUpdateAppliedFirst) {
        bpmnElementsRegistry.updateStyle(bpmnElementId, { stroke: { color: strokeColor } });
        bpmnElementsRegistry.addCssClasses(bpmnElementId, cssClassNames);
      } else {
        bpmnElementsRegistry.addCssClasses(bpmnElementId, cssClassNames);
        bpmnElementsRegistry.updateStyle(bpmnElementId, { stroke: { color: strokeColor } });
      }

      checkFlowNode(bpmnElementId, {
        extraCssClasses: ['class-1', 'class-2'],
        kind: ShapeBpmnElementKind.EVENT_END,
        label: 'message end 2',
        stroke: { color: strokeColor },
        verticalAlign: 'top', // the element has a label
      } as ExpectedShapeModelElement);
    });
  });

  describe('Style API Reset and CSS class update', () => {
    it.each([true, false])('Reset style first %s', (isStyleResetFirst: boolean) => {
      const bpmnElementId = 'endEvent_message_1';
      const cssClassNames = ['class-1', 'class-2'];

      bpmnElementsRegistry.updateStyle(bpmnElementId, { stroke: { color: 'pink' } });

      if (isStyleResetFirst) {
        bpmnElementsRegistry.resetStyle(bpmnElementId);
        bpmnElementsRegistry.addCssClasses(bpmnElementId, cssClassNames);
      } else {
        bpmnElementsRegistry.addCssClasses(bpmnElementId, cssClassNames);
        bpmnElementsRegistry.resetStyle(bpmnElementId);
      }

      // Check that the style has been reset to default values for each element
      checkFlowNode(bpmnElementId, {
        extraCssClasses: ['class-1', 'class-2'],
        kind: ShapeBpmnElementKind.EVENT_END,
        label: 'message end 2',
        verticalAlign: 'top', // the element has a label
      } as ExpectedShapeModelElement);
    });
  });

  // Perform both "CSS classes" operations both before and after updating the style
  // This validates all possible interactions between the 2 APIS
  it('Style API update and reset + CSS class update', () => {
    bpmnElementsRegistry.addCssClasses(
      ['gateway_01', 'userTask_0', 'userTask_2_2', 'endEvent_message_1', 'endEvent_terminate_1', 'sequenceFlow_lane_1_elt_1', 'sequenceFlow_lane_1_elt_6'],
      ['class-1', 'class-2'],
    );
    bpmnElementsRegistry.updateStyle(['gateway_01', 'userTask_2_2', 'endEvent_terminate_1', 'sequenceFlow_lane_1_elt_1'], { stroke: { color: 'pink' } });
    bpmnElementsRegistry.addCssClasses(['gateway_01', 'userTask_0', 'endEvent_message_1', 'sequenceFlow_lane_1_elt_6'], 'class-11');
    bpmnElementsRegistry.removeCssClasses(['userTask_2_2'], 'class-1');

    // Check some elements
    checkFlowNode('gateway_01', {
      extraCssClasses: ['class-1', 'class-2', 'class-11'],
      kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
      label: 'gateway 1',
      verticalAlign: 'top', // the element has a label
      stroke: { color: 'pink' },
    } as ExpectedShapeModelElement);
    checkSequenceFlow('sequenceFlow_lane_1_elt_1', {
      extraCssClasses: ['class-1', 'class-2'],
      stroke: { color: 'pink' },
    } as ExpectedEdgeModelElement);

    // Reset style of some elements and check them afterward
    bpmnElementsRegistry.resetStyle(['gateway_01', 'sequenceFlow_lane_1_elt_1']);

    // Check that the style has been reset to default values for each element
    checkFlowNode('gateway_01', {
      extraCssClasses: ['class-1', 'class-2', 'class-11'],
      kind: ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
      label: 'gateway 1',
      verticalAlign: 'top', // the element has a label
    } as ExpectedShapeModelElement);
    checkSequenceFlow('sequenceFlow_lane_1_elt_1', {
      extraCssClasses: ['class-1', 'class-2'],
    } as ExpectedEdgeModelElement);

    // Reset the style of remaining elements with 'reset all'
    bpmnElementsRegistry.updateStyle(['endEvent_message_1'], { fill: { color: 'yellow' } });
    bpmnElementsRegistry.resetStyle();

    // Check that the style has been reset to default values for each element
    checkFlowNode('userTask_2_2', {
      extraCssClasses: ['class-2'],
      kind: ShapeBpmnElementKind.TASK_USER,
      label: 'User Task 2.2',
    } as ExpectedShapeModelElement);
    checkFlowNode('endEvent_message_1', {
      extraCssClasses: ['class-1', 'class-2', 'class-11'],
      kind: ShapeBpmnElementKind.EVENT_END,
      label: 'message end 2',
      verticalAlign: 'top', // the element has a label
    } as ExpectedShapeModelElement);

    // Check elements whose style were not updated prior calling 'reset all'
    checkFlowNode('userTask_0', {
      extraCssClasses: ['class-1', 'class-2', 'class-11'],
      kind: ShapeBpmnElementKind.TASK_USER,
      label: 'User Task 0',
    } as ExpectedShapeModelElement);
    checkSequenceFlow('sequenceFlow_lane_1_elt_6', {
      extraCssClasses: ['class-1', 'class-2', 'class-11'],
    } as ExpectedEdgeModelElement);
  });
});
