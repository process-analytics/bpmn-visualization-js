/**
 * @jest-environment jsdom
 */
/*
Copyright 2025 Bonitasoft S.A.

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

import { isLabelBoundsIgnored } from '@lib/component/mxgraph/BpmnRenderer';
import { ShapeBpmnElementKind } from '@lib/model/bpmn/internal';
import Shape from '@lib/model/bpmn/internal/shape/Shape';
import ShapeBpmnElement from '@lib/model/bpmn/internal/shape/ShapeBpmnElement';

describe('isLabelBoundsIgnored', () => {
  describe('no specific option', () => {
    test.each([
      [ShapeBpmnElementKind.POOL, true],
      [ShapeBpmnElementKind.LANE, true],
      [ShapeBpmnElementKind.TASK_USER, false],
      [ShapeBpmnElementKind.CALL_ACTIVITY, false],
      [ShapeBpmnElementKind.EVENT_START, false],
      [ShapeBpmnElementKind.EVENT_END, false],
      [ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, false],
      [ShapeBpmnElementKind.GATEWAY_PARALLEL, false],
    ])('should ignore %s label bounds?  %s', (kind, expected) => {
      const shape = new Shape('id', new ShapeBpmnElement('id', 'name', kind));
      expect(isLabelBoundsIgnored(shape, false, false)).toBe(expected);
    });
  });

  describe('with ignoreBpmnActivityLabelBounds option', () => {
    describe.each([true, false])('with ignoreBpmnTaskLabelBounds option set to %s', (ignoreBpmnTaskLabelBounds: boolean) => {
      test.each([
        [ShapeBpmnElementKind.POOL, true],
        [ShapeBpmnElementKind.LANE, true],
        [ShapeBpmnElementKind.TASK_USER, true],
        [ShapeBpmnElementKind.TASK_SCRIPT, true],
        [ShapeBpmnElementKind.CALL_ACTIVITY, true],
        [ShapeBpmnElementKind.SUB_PROCESS, true],
        [ShapeBpmnElementKind.EVENT_START, false],
        [ShapeBpmnElementKind.EVENT_END, false],
        [ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, false],
        [ShapeBpmnElementKind.GATEWAY_PARALLEL, false],
      ])('should ignore %s label bounds?  %s', (kind, expected) => {
        const shape = new Shape('id', new ShapeBpmnElement('id', 'name', kind));
        expect(isLabelBoundsIgnored(shape, true, ignoreBpmnTaskLabelBounds)).toBe(expected);
      });
    });
  });

  describe('with ignoreBpmnTaskLabelBounds option', () => {
    test.each([
      [ShapeBpmnElementKind.POOL, true],
      [ShapeBpmnElementKind.LANE, true],
      [ShapeBpmnElementKind.TASK_USER, true],
      [ShapeBpmnElementKind.TASK_SCRIPT, true],
      [ShapeBpmnElementKind.CALL_ACTIVITY, false],
      [ShapeBpmnElementKind.SUB_PROCESS, false],
      [ShapeBpmnElementKind.EVENT_START, false],
      [ShapeBpmnElementKind.EVENT_END, false],
      [ShapeBpmnElementKind.GATEWAY_EXCLUSIVE, false],
      [ShapeBpmnElementKind.GATEWAY_PARALLEL, false],
    ])('should ignore %s label bounds?  %s', (kind, expected) => {
      const shape = new Shape('id', new ShapeBpmnElement('id', 'name', kind));
      expect(isLabelBoundsIgnored(shape, false, true)).toBe(expected);
    });
  });
});
