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

import { bpmnVisualization } from './helpers/model-expect';

import { readFileSync } from '@test/shared/file-helper';

// Most of the test are done in dom.css.classes.test.ts
// The tests here check that the style of the cell in the mxGraph model includes the CSS classes
describe('mxGraph model - CSS API', () => {
  beforeEach(() => {
    bpmnVisualization.load(readFileSync('../fixtures/bpmn/registry/1-pool-3-lanes-message-start-end-intermediate-events.bpmn'));
  });

  const bpmnElementsRegistry = bpmnVisualization.bpmnElementsRegistry;

  test('Add CSS classes on Shape', () => {
    bpmnElementsRegistry.addCssClasses('userTask_2_2', ['class#1', 'class#2']);
    expect('userTask_2_2').toBeUserTask({
      extraCssClasses: ['class#1', 'class#2'],
      // not under test
      parentId: 'lane_02',
      label: 'User Task 2.2',
    });
  });

  test('Add CSS classes on Edge', () => {
    bpmnElementsRegistry.addCssClasses('sequenceFlow_lane_3_elt_3', ['class-1', 'class-2', 'class-3']);
    expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
      extraCssClasses: ['class-1', 'class-2', 'class-3'],
      // not under test
      parentId: 'lane_03',
      verticalAlign: 'bottom',
    });
  });

  describe('Remove CSS classes - special cases', () => {
    it.each([null, undefined, '', []])('Remove CSS classes with parameter: %s', (bpmnElementIds: string | string[]) => {
      // ensure we pass an empty array
      if (bpmnElementIds) {
        // eslint-disable-next-line jest/no-conditional-expect -- here we only validate the test parameter
        expect(bpmnElementIds).toBeArray();
        // eslint-disable-next-line jest/no-conditional-expect
        expect(bpmnElementIds).toHaveLength(0);
      }

      bpmnElementsRegistry.addCssClasses(['userTask_2_2', 'sequenceFlow_lane_3_elt_3'], ['class1', 'class2']);

      // should have no effect
      bpmnElementsRegistry.removeCssClasses(bpmnElementIds, ['class1', 'class3']);

      expect('userTask_2_2').toBeUserTask({
        extraCssClasses: ['class1', 'class2'],
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        extraCssClasses: ['class1', 'class2'],
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });
  });

  describe('Remove all CSS classes - special cases', () => {
    it.each([null, undefined])('Remove all CSS classes with a nullish parameter: %s', (nullishResetParameter: string) => {
      bpmnElementsRegistry.addCssClasses(['userTask_2_2', 'sequenceFlow_lane_3_elt_3'], ['class1', 'class2']);

      bpmnElementsRegistry.removeAllCssClasses(nullishResetParameter);

      expect('userTask_2_2').toBeUserTask({
        extraCssClasses: undefined,
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        extraCssClasses: undefined,
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });

    it.each(['', []])('Remove all CSS classes with an empty parameter: %s', (emptyParameter: string | string[]) => {
      bpmnElementsRegistry.addCssClasses(['userTask_2_2', 'sequenceFlow_lane_3_elt_3'], ['class#1', 'class#2']);

      // should have no effect
      bpmnElementsRegistry.removeAllCssClasses(emptyParameter);

      expect('userTask_2_2').toBeUserTask({
        extraCssClasses: ['class#1', 'class#2'],
        // not under test
        parentId: 'lane_02',
        label: 'User Task 2.2',
      });
      expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
        extraCssClasses: ['class#1', 'class#2'],
        // not under test
        parentId: 'lane_03',
        verticalAlign: 'bottom',
      });
    });
  });
});
