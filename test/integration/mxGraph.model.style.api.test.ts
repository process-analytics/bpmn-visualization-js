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
import type { ExpectedShapeModelElement, VerticalAlign } from './helpers/model-expect';
import { bpmnVisualization } from './helpers/model-expect';
import { buildReceivedResolvedModelCellStyle, buildReceivedViewStateStyle } from './matchers/matcher-utils';
import { buildExpectedShapeCellStyle } from './matchers/toBeShape';
import { readFileSync } from '@test/shared/file-helper';
import { MessageVisibleKind, ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from '@lib/model/bpmn/internal';
import type { EdgeStyleUpdate, Fill, Font, Stroke, StyleUpdate } from '@lib/component/registry';
import type { Cell } from '@maxgraph/core';

// Create a dedicated instance with a DOM container as it is required by the CSS API.
const bv = initializeBpmnVisualizationWithContainerId('bpmn-container-style-css-cross-tests');
const htmlElementLookup = new HtmlElementLookup(bv);

const getCell = (bpmnElementId: string): Cell => {
  const graph = bv.graph;
  const cell = graph.getDataModel().getCell(bpmnElementId);
  if (!cell) {
    throw new Error(`Unable to find cell in the model with id ${bpmnElementId}`);
  }
  return cell;
};

// we cannot reuse the model expect functions here. They are using the shared bpmnVisualization that we cannot use here.
// So use the minimal expect function. We only need to check a part of the data, the rest is already checked in details in other tests.
const checkViewStateStyle = (bpmnElementId: string, expectedModel: ExpectedShapeModelElement): void => {
  expect(buildReceivedViewStateStyle(getCell(bpmnElementId), bv)).toEqual(buildExpectedShapeCellStyle(expectedModel));
};

const checkModelStyle = (bpmnElementId: string, expectedModel: ExpectedShapeModelElement): void => {
  expect(buildReceivedResolvedModelCellStyle(getCell(bpmnElementId), bv)).toEqual(buildExpectedShapeCellStyle(expectedModel));
};

describe('mxGraph model - update style', () => {
  describe('Shapes', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    });

    // All properties are tested on a single element.
    // Tests involving several elements only check one or few properties to ensure all elements are updated, considering that the rest is covered by the
    // "single element" test.
    it('A single element', () => {
      const stroke: Stroke = { color: 'red', opacity: 72, width: 7 };
      const font: Font = {
        color: 'chartreuse',
        opacity: 40,
        size: 25,
        family: 'Times New Roman',
        isBold: true,
        isItalic: true,
        isUnderline: true,
        isStrikeThrough: true,
      };
      const opacity = 84;
      const fill: Fill = { color: 'gold', opacity: 55 };
      bpmnVisualization.bpmnElementsRegistry.updateStyle('userTask_2_2', { stroke, font, opacity, fill });

      // FIXME migration maxgraph@0.1.0 it seems there is an issue in the fontStyle computation, we expect 15 and we got 14
      expect('userTask_2_2').toBeUserTask({
        stroke,
        font,
        opacity,
        fill,
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
    });

    it('Several elements', () => {
      const strokeColor = 'pink';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['task_1', 'gateway_01'], { stroke: { color: strokeColor } });

      expect('task_1').toBeTask({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        label: 'Task 1',
      });
      expect('gateway_01').toBeExclusiveGateway({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        label: 'gateway 1',
      });
    });

    it('Update the style twice - specify the property both times', () => {
      const strokeColor = 'yellow';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['endEvent_terminate_1'], { stroke: { color: 'to_override' } });
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['endEvent_terminate_1'], { stroke: { color: strokeColor } });

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

      expect('endEvent_terminate_1').toBeEndEvent({
        stroke: { color: strokeColor },
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.TERMINATE,
        parentId: 'lane_01',
        label: 'terminate end 1',
      });
    });

    it('Font style already set and no font style as api parameter', () => {
      const font: Font = {
        isBold: true,
        isItalic: true,
        isUnderline: true,
        isStrikeThrough: true,
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle('userTask_2_2', { font });
      expect('userTask_2_2').toBeUserTask({
        font,
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });

      // this doesn't change the style as the font property is empty
      bpmnVisualization.bpmnElementsRegistry.updateStyle('userTask_2_2', { font: {} });

      expect('userTask_2_2').toBeUserTask({
        font,
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
    });

    it('Font style already set and update only the specified font styles', () => {
      bpmnVisualization.bpmnElementsRegistry.updateStyle('userTask_2_2', {
        font: {
          isBold: true,
          isItalic: true,
          isUnderline: true,
          isStrikeThrough: true,
        },
      });
      expect('userTask_2_2').toBeUserTask({
        font: {
          isBold: true,
          isItalic: false,
          isUnderline: false,
          isStrikeThrough: true,
        },
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
      bpmnVisualization.bpmnElementsRegistry.updateStyle('userTask_2_2', { font: { isItalic: false, isUnderline: false } });

      expect('userTask_2_2').toBeUserTask({
        font: {
          isBold: true,
          isItalic: false,
          isUnderline: false,
          isStrikeThrough: true,
        },
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
    });

    it('Update the fill style of a lane', () => {
      const fill = { color: 'gold' };
      bpmnVisualization.bpmnElementsRegistry.updateStyle('lane_02', { fill });

      expect('lane_02').toBeLane({
        fill,
        // not under test
        parentId: 'Participant_1',
        label: 'Lane 2',
      });
    });

    it('Update the fill style of a pool', () => {
      const fill = { color: 'gold' };
      bpmnVisualization.bpmnElementsRegistry.updateStyle('Participant_1', { fill });

      expect('Participant_1').toBePool({
        fill,
        // not under test
        label: 'Pool 1',
      });
    });

    it('Update all opacity properties with wrong value', () => {
      bpmnVisualization.bpmnElementsRegistry.updateStyle('userTask_2_2', {
        stroke: { opacity: -72 },
        font: { opacity: 140 },
        opacity: -84,
        fill: { opacity: 255 },
      });

      expect('userTask_2_2').toBeUserTask({
        stroke: { opacity: 0 },
        font: { opacity: 100 },
        opacity: 0,
        fill: { opacity: 100 },
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
    });

    describe('Update the properties of a single element to restore its default values', () => {
      // not lane or pool
      it('Common shape', () => {
        // Check that the element uses default values
        expect('serviceTask_1_2').toBeServiceTask({
          // not under test
          parentId: 'lane_01',
          label: 'Service Task 1.2',
        });

        const font: Font = {
          // Other font properties may be set in BPMN diagram LabelStyle, so only some properties can be reset to default
          color: 'pink',
          opacity: 40,
        };
        const fill: Fill = {
          color: 'yellow',
          opacity: 48,
        };
        const opacity = 90;
        const stroke: Stroke = {
          color: 'red',
          opacity: 55,
          width: 4,
        };
        bpmnVisualization.bpmnElementsRegistry.updateStyle('serviceTask_1_2', {
          fill,
          font,
          opacity,
          stroke,
        });

        // Check that the style has been updated
        expect('serviceTask_1_2').toBeServiceTask({
          fill,
          font,
          opacity,
          stroke,
          // not under test
          parentId: 'lane_01',
          label: 'Service Task 1.2',
        });

        // Reset the style by passing special values
        bpmnVisualization.bpmnElementsRegistry.updateStyle('serviceTask_1_2', {
          fill: {
            color: 'default',
            opacity: 'default',
          },
          font: {
            color: 'default',
            opacity: 'default',
          },
          opacity: 'default',
          stroke: {
            color: 'default',
            opacity: 'default',
            width: 'default',
          },
        });

        // The properties should have been reset to use the default values
        expect('serviceTask_1_2').toBeServiceTask({
          // not under test
          parentId: 'lane_01',
          label: 'Service Task 1.2',
        });
      });

      // For container (lane or pool), mainly check the fill property as there is a special setting in such elements
      it('Lane', () => {
        // Check that the element uses default values
        expect('lane_03').toBeLane({
          // not under test
          parentId: 'Participant_1',
          label: 'Lane 3',
        });

        const fill: Fill = { color: 'blue', opacity: 66 };
        bpmnVisualization.bpmnElementsRegistry.updateStyle('lane_03', { fill });
        // Check that the style has been updated
        expect('lane_03').toBeLane({
          fill,
          // not under test
          parentId: 'Participant_1',
          label: 'Lane 3',
        });

        // Reset the style by passing special values
        bpmnVisualization.bpmnElementsRegistry.updateStyle('lane_03', {
          fill: {
            color: 'default',
            opacity: 'default',
          },
        });
        // The properties should have been reset to use the default values
        expect('lane_03').toBeLane({
          // not under test
          parentId: 'Participant_1',
          label: 'Lane 3',
        });
      });

      it('Pool', () => {
        // Check that the element uses default values
        expect('Participant_1').toBePool({
          // not under test
          label: 'Pool 1',
        });

        const fill: Fill = { color: 'orange', opacity: 90 };
        bpmnVisualization.bpmnElementsRegistry.updateStyle('Participant_1', { fill });
        // Check that the style has been updated
        expect('Participant_1').toBePool({
          fill,
          // not under test
          label: 'Pool 1',
        });

        // Reset the style by passing special values
        bpmnVisualization.bpmnElementsRegistry.updateStyle('Participant_1', {
          fill: {
            color: 'default',
            opacity: 'default',
          },
        });
        // The properties should have been reset to use the default values
        expect('Participant_1').toBePool({
          // not under test
          label: 'Pool 1',
        });
      });
    });
  });

  describe('Edges', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    });

    // All properties are tested on a single element.
    // Tests involving several elements only check one or few properties to ensure all elements are updated, considering that the rest is covered by the
    // "single element" test.
    it('On a single element', () => {
      const stroke: Stroke = { color: 'pink', opacity: 72, width: 7 };
      const font: Font = {
        color: 'chartreuse',
        opacity: 40,
        size: 25,
        family: 'Times New Roman',
        isBold: true,
        isItalic: true,
        isUnderline: true,
        isStrikeThrough: true,
      };
      const opacity = 84;
      bpmnVisualization.bpmnElementsRegistry.updateStyle('sequenceFlow_lane_3_elt_3', { stroke, font, opacity });

      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        stroke,
        font,
        opacity,
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });

    it('Several elements', () => {
      const strokeColor = 'pink';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['sequenceFlow_lane_3_elt_3', 'sequenceFlow_lane_1_elt_1'], { stroke: { color: strokeColor } });

      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
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

      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });

    it('Font style already set and no font style as api parameter', () => {
      const font = {
        isBold: true,
        isItalic: true,
        isUnderline: true,
        isStrikeThrough: true,
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle('sequenceFlow_lane_3_elt_3', { font });
      // this doesn't change the style as the font property is empty
      bpmnVisualization.bpmnElementsRegistry.updateStyle('sequenceFlow_lane_3_elt_3', { font: {} });

      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        font,
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });

    it('Font style already set and update only the specified font styles', () => {
      bpmnVisualization.bpmnElementsRegistry.updateStyle('sequenceFlow_lane_3_elt_3', {
        font: {
          isBold: true,
          isItalic: true,
          isUnderline: true,
          isStrikeThrough: true,
        },
      });
      bpmnVisualization.bpmnElementsRegistry.updateStyle('sequenceFlow_lane_3_elt_3', { font: { isItalic: false, isUnderline: false } });

      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        font: {
          isBold: true,
          isItalic: false,
          isUnderline: false,
          isStrikeThrough: true,
        },
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });

    it('Update all opacity properties with wrong value', () => {
      bpmnVisualization.bpmnElementsRegistry.updateStyle('sequenceFlow_lane_3_elt_3', {
        stroke: { opacity: -72 },
        font: { opacity: 140 },
        opacity: -84,
      });

      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        stroke: { opacity: 0 },
        font: { opacity: 100 },
        opacity: 0,
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });

    it('Update the properties of a single edge to restore its default values', () => {
      // Check that the element uses default values
      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });

      // Other font properties may be set in BPMN diagram LabelStyle, so only some properties can be reset to default
      const font: Font = {
        color: 'darkBlue',
        opacity: 60,
      };
      const opacity = 80;
      const stroke: Stroke = {
        color: 'brown',
        opacity: 95,
        width: 6,
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle('sequenceFlow_lane_3_elt_3', {
        font,
        opacity,
        stroke,
      });

      // Check that the style has been updated
      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        stroke,
        font,
        opacity,
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });

      // Reset the style by passing special values
      bpmnVisualization.bpmnElementsRegistry.updateStyle('sequenceFlow_lane_3_elt_3', <EdgeStyleUpdate>{
        font: {
          color: 'default',
          opacity: 'default',
        },
        opacity: 'default',
        stroke: {
          color: 'default',
          opacity: 'default',
          width: 'default',
        },
      });

      // The properties should have been reset to use the default values
      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });
  });

  describe('Message flow icons', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/message-flows-with-and-without-icon.bpmn'));
    });

    const stroke: Stroke = { color: 'pink', opacity: 72, width: 7 };
    const opacity = 84;

    test('Update the style of a message flow without icon', () => {
      bpmnVisualization.bpmnElementsRegistry.updateStyle('MessageFlow_1', { opacity, stroke });
      expect('MessageFlow_1').toBeMessageFlow({
        messageVisibleKind: MessageVisibleKind.NONE,
        opacity,
        stroke,
        // not under test
        verticalAlign: 'bottom',
      });
    });

    test('Update the style of a message flow with icon (initiating)', () => {
      bpmnVisualization.bpmnElementsRegistry.updateStyle('MessageFlow_2_msgVisibilityKind_initiating', { opacity, stroke });
      expect('MessageFlow_2_msgVisibilityKind_initiating').toBeMessageFlow({
        messageVisibleKind: MessageVisibleKind.INITIATING,
        stroke,
        opacity,
        // not under test
        verticalAlign: 'bottom',
      });
    });

    test('Update the properties of a message flow with icon (non initiating) and restore its default values', () => {
      // Other font properties may be set in BPMN diagram LabelStyle, so only some properties can be reset to default
      const font: Font = {
        color: 'Yellow',
        opacity: 90,
      };
      // Check that the element uses default values
      expect('MessageFlow_3_msgVisibilityKind_non_initiating').toBeMessageFlow({
        messageVisibleKind: MessageVisibleKind.NON_INITIATING,
        // not under test
        verticalAlign: 'bottom',
      });

      bpmnVisualization.bpmnElementsRegistry.updateStyle('MessageFlow_3_msgVisibilityKind_non_initiating', {
        font,
        opacity,
        stroke,
      });

      // Check that the style has been updated
      expect('MessageFlow_3_msgVisibilityKind_non_initiating').toBeMessageFlow({
        messageVisibleKind: MessageVisibleKind.NON_INITIATING,
        font,
        opacity,
        stroke,
        // not under test
        verticalAlign: 'bottom',
      });

      // Reset the style by passing special values
      bpmnVisualization.bpmnElementsRegistry.updateStyle('MessageFlow_3_msgVisibilityKind_non_initiating', <EdgeStyleUpdate>{
        font: {
          color: 'default',
          opacity: 'default',
        },
        opacity: 'default',
        stroke: {
          color: 'default',
          opacity: 'default',
          width: 'default',
        },
      });

      // The properties should have been reset to use the default values
      expect('MessageFlow_3_msgVisibilityKind_non_initiating').toBeMessageFlow({
        messageVisibleKind: MessageVisibleKind.NON_INITIATING,
        // not under test
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
        ${'empty stroke'} | ${{ font: {} }}
      `(`$configName`, ({ styleUpdate }: { styleUpdate: StyleUpdate }) => {
        bpmnVisualization.bpmnElementsRegistry.updateStyle('userTask_2_2', styleUpdate);

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

      expect('startEvent_lane_1').toBeStartEvent({
        stroke: { color: strokeColor },
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        parentId: 'lane_01',
        label: 'message start 1',
      });

      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });

    it('style is cleaned between 2 diagram loads', () => {
      // First load
      // Check that the style has the default values for each element
      expect('startEvent_lane_1').toBeStartEvent({
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        parentId: 'lane_01',
        label: 'message start 1',
      });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });

      // Apply custom style
      const customStyle = {
        stroke: { color: 'orange' },
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['startEvent_lane_1', 'sequenceFlow_lane_1_elt_1'], customStyle);

      // Check that the style has the updated values for each element
      expect('startEvent_lane_1').toBeStartEvent({
        stroke: { color: 'orange' },
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        parentId: 'lane_01',
        label: 'message start 1',
      });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        stroke: { color: 'orange' },
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });

      // Second load
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events-with-different_ids.bpmn'));
      bpmnVisualization.bpmnElementsRegistry.resetStyle();

      // Check that the style has the default values for each element
      expect('startEvent_lane_1').toBeStartEvent({
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.NONE,
        parentId: 'lane_03',
        label: 'start 2',
      });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        // not under test
        parentId: 'lane_03',
        label: 'link',
        verticalAlign: 'bottom',
      });
    });
  });

  // Check that there is no bad interactions between the two features
  describe('Both style API update and CSS class', () => {
    it.each([true, false])('Apply style update first %s', (isStyleUpdateAppliedFirst: boolean) => {
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

      const expectedModel = {
        extraCssClasses: ['class-1', 'class-2'],
        kind: ShapeBpmnElementKind.EVENT_END,
        stroke: { color: strokeColor },
        verticalAlign: <VerticalAlign>'top', // when events have a label
      };
      checkModelStyle(bpmnElementId, expectedModel);
      checkViewStateStyle(bpmnElementId, expectedModel);
      htmlElementLookup.expectEndEvent(bpmnElementId, ShapeBpmnEventDefinitionKind.MESSAGE, { label: 'message end 2', additionalClasses: ['class-1', 'class-2'] });
    });
  });
});

describe('mxGraph model - reset style', () => {
  describe('Shapes', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    });

    // All properties are tested on a single element.
    // Tests involving several elements only check one or few properties to ensure all elements are updated, considering that the rest is covered by the
    // "single element" test.
    it('A single element', () => {
      const elementId = 'userTask_2_2';

      // Apply custom style
      const customStyle = {
        stroke: { color: 'red', opacity: 72, width: 7 },
        font: {
          color: 'chartreuse',
          opacity: 40,
          size: 25,
          family: 'Times New Roman',
          isBold: true,
          isItalic: true,
          isUnderline: true,
          isStrikeThrough: true,
        },
        opacity: 84,
        fill: { color: 'gold', opacity: 55 },
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle(elementId, customStyle);

      // Reset style
      bpmnVisualization.bpmnElementsRegistry.resetStyle(elementId);

      // Check that the style has been reset to default values
      expect('userTask_2_2').toBeUserTask({
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
    });

    it('Several elements', () => {
      const elementIds = ['task_1', 'gateway_01'];

      // Apply custom style
      const customStyle = {
        stroke: { color: 'pink' },
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle(elementIds, customStyle);

      // Reset style
      bpmnVisualization.bpmnElementsRegistry.resetStyle(elementIds);

      // Check that the style has been reset to default values for each element
      expect('task_1').toBeTask({
        // not under test
        parentId: 'lane_01',
        label: 'Task 1',
      });
      expect('gateway_01').toBeExclusiveGateway({
        // not under test
        parentId: 'lane_01',
        label: 'gateway 1',
        verticalAlign: 'top',
      });
    });

    it('Reset the style twice', () => {
      const elementIds = ['endEvent_terminate_1'];

      // Apply custom style
      const customStyle = {
        stroke: { color: 'green' },
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle(elementIds, customStyle);

      // Reset style
      bpmnVisualization.bpmnElementsRegistry.resetStyle(elementIds);
      bpmnVisualization.bpmnElementsRegistry.resetStyle(elementIds);

      // Check that the style has been reset to default values
      expect('endEvent_terminate_1').toBeEndEvent({
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.TERMINATE,
        parentId: 'lane_01',
        label: 'terminate end 1',
      });
    });

    it('Reset the fill style of a lane', () => {
      const elementId = 'lane_02';

      // Apply custom style
      bpmnVisualization.bpmnElementsRegistry.updateStyle(elementId, { fill: { color: 'gold' } });

      // Reset style
      bpmnVisualization.bpmnElementsRegistry.resetStyle(elementId);

      // Check that the style has been reset to default values
      expect('lane_02').toBeLane({
        // not under test
        parentId: 'Participant_1',
        label: 'Lane 2',
      });
    });

    it('Reset the fill style of a pool', () => {
      const elementId = 'Participant_1';

      // Apply custom style
      bpmnVisualization.bpmnElementsRegistry.updateStyle(elementId, { fill: { color: 'gold' } });

      // Reset style
      bpmnVisualization.bpmnElementsRegistry.resetStyle(elementId);

      // Check that the style has been reset to default values
      expect('Participant_1').toBePool({
        // not under test
        label: 'Pool 1',
      });
    });
  });

  describe('Edges', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    });

    // All properties are tested on a single element.
    // Tests involving several elements only check one or few properties to ensure all elements are updated, considering that the rest is covered by the
    // "single element" test.
    it('On a single element', () => {
      const elementId = 'sequenceFlow_lane_3_elt_3';

      // Apply custom style
      const customStyle = {
        stroke: { color: 'red', opacity: 72, width: 7 },
        font: {
          color: 'chartreuse',
          opacity: 40,
          size: 25,
          family: 'Times New Roman',
          isBold: true,
          isItalic: true,
          isUnderline: true,
          isStrikeThrough: true,
        },
        opacity: 84,
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle(elementId, customStyle);

      // Reset style
      bpmnVisualization.bpmnElementsRegistry.resetStyle(elementId);

      // Check that the style has been reset to default values
      expect(elementId).toBeSequenceFlow({
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });

    it('Several elements', () => {
      const elementIds = ['sequenceFlow_lane_3_elt_3', 'sequenceFlow_lane_1_elt_1'];

      // Apply custom style
      const customStyle = {
        stroke: { color: 'pink' },
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle(elementIds, customStyle);

      // Reset style
      bpmnVisualization.bpmnElementsRegistry.resetStyle(elementIds);

      // Check that the style has been reset to default values for each element
      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });

    it('Reset the style twice', () => {
      const strokeColor = 'DarkBlue';
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['sequenceFlow_lane_1_elt_1'], { stroke: { color: strokeColor } });
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['sequenceFlow_lane_1_elt_1'], {});

      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        stroke: { color: strokeColor },
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });
  });

  describe('Message flow icons', () => {
    test('Update the style of a message flow with icon (initiating) and the reset the style', () => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/message-flows-with-and-without-icon.bpmn'));
      const stroke: Stroke = { color: 'green', opacity: 99, width: 4 };
      const opacity = 45;

      bpmnVisualization.bpmnElementsRegistry.updateStyle('MessageFlow_2_msgVisibilityKind_initiating', { opacity, stroke });
      expect('MessageFlow_2_msgVisibilityKind_initiating').toBeMessageFlow({
        messageVisibleKind: MessageVisibleKind.INITIATING,
        stroke,
        opacity,
        // not under test
        verticalAlign: 'bottom',
      });

      bpmnVisualization.bpmnElementsRegistry.resetStyle('MessageFlow_2_msgVisibilityKind_initiating');
      expect('MessageFlow_2_msgVisibilityKind_initiating').toBeMessageFlow({
        messageVisibleKind: MessageVisibleKind.INITIATING,
        // not under test
        verticalAlign: 'bottom',
      });
    });
  });

  describe('Both Edges and Shapes', () => {
    beforeEach(() => {
      bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
    });

    it('Non existing elements', () => {
      // Check that there is no error
      bpmnVisualization.bpmnElementsRegistry.resetStyle(['i_do_not_exist_1', 'i_do_not_exist_2']);
    });

    it('Several elements', () => {
      const elementIds = ['startEvent_lane_1', 'sequenceFlow_lane_1_elt_1'];

      // Apply custom style
      const customStyle = {
        stroke: { color: 'orange' },
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle(elementIds, customStyle);

      // Reset style
      bpmnVisualization.bpmnElementsRegistry.resetStyle(elementIds);

      // Check that the style has been reset to default values for each element
      expect('startEvent_lane_1').toBeStartEvent({
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        parentId: 'lane_01',
        label: 'message start 1',
      });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });

    it('All elements', () => {
      // Apply custom style
      const customStyle = {
        stroke: { color: 'orange' },
      };
      bpmnVisualization.bpmnElementsRegistry.updateStyle(['startEvent_lane_1', 'sequenceFlow_lane_1_elt_1'], customStyle);

      // Reset style
      bpmnVisualization.bpmnElementsRegistry.resetStyle();

      // Check that the style has been reset to default values for each element
      expect('startEvent_lane_1').toBeStartEvent({
        // not under test
        eventDefinitionKind: ShapeBpmnEventDefinitionKind.MESSAGE,
        parentId: 'lane_01',
        label: 'message start 1',
      });
      expect('sequenceFlow_lane_1_elt_1').toBeSequenceFlow({
        // not under test
        parentId: 'lane_01',
        verticalAlign: 'bottom',
      });
    });
  });

  // Check that there is no bad interactions between the two features
  describe('Style API Reset and CSS class update', () => {
    it.each([true, false])('Reset style first %s', (isStyleResetFirst: boolean) => {
      bv.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));

      const bpmnElementId = 'endEvent_message_1';
      const cssClassName = ['class-1', 'class-2'];

      bv.bpmnElementsRegistry.updateStyle(bpmnElementId, { stroke: { color: 'pink' } });

      if (isStyleResetFirst) {
        bv.bpmnElementsRegistry.resetStyle(bpmnElementId);
        bv.bpmnElementsRegistry.addCssClasses(bpmnElementId, cssClassName);
      } else {
        bv.bpmnElementsRegistry.addCssClasses(bpmnElementId, cssClassName);
        bv.bpmnElementsRegistry.resetStyle(bpmnElementId);
      }

      // Check that the style has been reset to default values for each element
      const expectedModel = {
        extraCssClasses: ['class-1', 'class-2'],
        kind: ShapeBpmnElementKind.EVENT_END,
        verticalAlign: 'top' as VerticalAlign, // when events have a label
      };
      checkModelStyle(bpmnElementId, expectedModel);
      checkViewStateStyle(bpmnElementId, expectedModel);
      htmlElementLookup.expectEndEvent(bpmnElementId, ShapeBpmnEventDefinitionKind.MESSAGE, { label: 'message end 2', additionalClasses: ['class-1', 'class-2'] });
    });
  });
});
