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

  test('Add CSS classes on Shape', () => {
    expect('userTask_2_2').toBeUserTask({
      // not under test
      parentId: 'lane_02',
      label: 'User Task 2.2',
    });
    bpmnVisualization.bpmnElementsRegistry.addCssClasses('userTask_2_2', ['class#1', 'class#2']);
    expect('userTask_2_2').toBeUserTask({
      extraCssClasses: ['class#1', 'class#2'],
      // not under test
      parentId: 'lane_02',
      label: 'User Task 2.2',
    });
  });

  test('Add CSS classes on Edge', () => {
    expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
      // not under test
      parentId: 'lane_03',
      verticalAlign: 'bottom',
    });
    bpmnVisualization.bpmnElementsRegistry.addCssClasses('sequenceFlow_lane_3_elt_3', ['class-1', 'class-2', 'class-3']);
    expect('sequenceFlow_lane_3_elt_3').toBeSequenceFlow({
      extraCssClasses: ['class-1', 'class-2', 'class-3'],
      // not under test
      parentId: 'lane_03',
      verticalAlign: 'bottom',
    });
  });
});
