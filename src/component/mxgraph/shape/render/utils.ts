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

import { ShapeBpmnMarkerKind } from '../../../../model/bpmn/internal/shape';

const referenceOrderedMarkers = [
  ShapeBpmnMarkerKind.LOOP,
  ShapeBpmnMarkerKind.MULTI_INSTANCE_PARALLEL,
  ShapeBpmnMarkerKind.MULTI_INSTANCE_SEQUENTIAL,
  ShapeBpmnMarkerKind.COMPENSATION,
  ShapeBpmnMarkerKind.EXPAND,
  ShapeBpmnMarkerKind.ADHOC,
];

/**
 * @internal
 */
export function orderActivityMarkers(markers: string[]): string[] {
  const orderedMarkers: string[] = [];

  referenceOrderedMarkers.filter(marker => markers.includes(marker)).forEach(marker => orderedMarkers.push(marker));

  // Put extra remaining at the end of the ordered markers, in the order they appear in the original array
  markers.filter(marker => !orderedMarkers.includes(marker)).forEach(marker => orderedMarkers.push(marker));

  return orderedMarkers;
}
