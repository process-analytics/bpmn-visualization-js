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
    it.each([
      [
        [ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.LOOP],
        [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
      ],
      [
        [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
        [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND],
      ],
      [
        [ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL],
        [ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL, ShapeBpmnMarkerKind.EXPAND],
      ],
      [
        [ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
        [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
      ],
      [
        [ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.COMPENSATION],
        [ShapeBpmnMarkerKind.COMPENSATION, ShapeBpmnMarkerKind.EXPAND],
      ],
      [
        [ShapeBpmnMarkerKind.COMPENSATION, ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL],
        [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.COMPENSATION],
      ],
    ])(`order: %s)`, (markers: string[], expectedOrderedMarkers: string[]) => {
      expect(orderActivityMarkers(markers)).toEqual(expectedOrderedMarkers);
    });
  });

  describe('3 elements', () => {
    it.each([
      [
        [ShapeBpmnMarkerKind.COMPENSATION, ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.LOOP],
        [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.COMPENSATION, ShapeBpmnMarkerKind.EXPAND],
      ],
      [
        [ShapeBpmnMarkerKind.COMPENSATION, ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.EXPAND],
        [ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL, ShapeBpmnMarkerKind.COMPENSATION, ShapeBpmnMarkerKind.EXPAND],
      ],
    ])(`order: %s)`, (markers: string[], expectedOrderedMarkers: string[]) => {
      expect(orderActivityMarkers(markers)).toEqual(expectedOrderedMarkers);
    });
  });

  // adhoc can have compensation and expand only
  describe('adhoc marker', () => {
    it.each([
      [
        [ShapeBpmnMarkerKind.ADHOC, ShapeBpmnMarkerKind.EXPAND],
        [ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.ADHOC],
      ],
      [
        [ShapeBpmnMarkerKind.COMPENSATION, ShapeBpmnMarkerKind.ADHOC, ShapeBpmnMarkerKind.EXPAND],
        [ShapeBpmnMarkerKind.COMPENSATION, ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.ADHOC],
      ],
    ])(`order: %s)`, (markers: string[], expectedOrderedMarkers: string[]) => {
      expect(orderActivityMarkers(markers)).toEqual(expectedOrderedMarkers);
    });
  });

  // Support extensions that add markers
  describe('extra elements', () => {
    it.each([
      [
        ['extraAtStart', ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.LOOP, 'extraAtEnd'],
        [ShapeBpmnMarkerKind.LOOP, ShapeBpmnMarkerKind.EXPAND, 'extraAtStart', 'extraAtEnd'],
      ],
      [
        ['extraAtStart', ShapeBpmnMarkerKind.ADHOC, ShapeBpmnMarkerKind.EXPAND, 'extraAtEnd'],
        [ShapeBpmnMarkerKind.EXPAND, ShapeBpmnMarkerKind.ADHOC, 'extraAtStart', 'extraAtEnd'],
      ],
    ])(`order: %s)`, (markers: string[], expectedOrderedMarkers: string[]) => {
      expect(orderActivityMarkers(markers)).toEqual(expectedOrderedMarkers);
    });
  });
});
