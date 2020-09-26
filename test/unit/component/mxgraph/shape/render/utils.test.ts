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

import { orderActivityMarkers } from '../../../../../../src/component/mxgraph/shape/render/utils';
import { ShapeBpmnMarkerKind } from '../../../../../../src/model/bpmn/shape';

describe('enforce activity markers order', () => {
  describe('1 element', () => {
    it.each(Object.values(ShapeBpmnMarkerKind))(`1 element - %s`, (marker: string) => {
      const markers = [marker];
      expect(orderActivityMarkers(markers)).toEqual(markers);
    });
  });

  describe('2 elements', () => {
    const input1: string[] = [ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.LOOP];
    it(`2 elements - order: ${input1}`, () => {
      expect(orderActivityMarkers(input1)).toEqual([ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND]);
    });
    const input2: string[] = [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND];
    it(`2 elements - order: ${input2}`, () => {
      expect(orderActivityMarkers(input2)).toEqual([ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND]);
    });
    const input3: string[] = [ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL];
    it(`2 elements - order: ${input3}`, () => {
      expect(orderActivityMarkers(input3)).toEqual([ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND]);
    });
    const input4: string[] = [ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL];
    it(`2 elements - order: ${input4}`, () => {
      expect(orderActivityMarkers(input4)).toEqual([ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND]);
    });
  });

  // describe('3 elements', () => {});

  // describe('4 elements', () => {});

  // To support extensions that add markers
  describe('extra elements', () => {
    const input1: string[] = ['extraAtStart', ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.LOOP, 'extraAtEnd'];
    it(`extra elements - order: ${input1}`, () => {
      expect(orderActivityMarkers(input1)).toEqual([ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND, 'extraAtStart', 'extraAtEnd']);
    });
  });
});
