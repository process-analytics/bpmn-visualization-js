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

import type { mxCell } from 'mxgraph';

/**
 * Compute the all class names associated to a cell in an hyphen case form.
 *
 * @param cell the `mxCell` related to the BPMN element.
 * @param isLabel the boolean that indicates if class must be computed for label.
 * @internal
 */
export function computeAllBpmnClassNamesOfCell(cell: mxCell, isLabel: boolean): string[] {
  const style = cell.style.split(';')[0];
  return computeAllBpmnClassNames(style, isLabel);
}

/**
 * Compute the all class names associated to a given bpmn element in an hyphen case form.
 *
 * @param style the part of the mxCell style related to a {@link BpmnElementKind}. Message flow icon is a special case, as it is not related to `BpmnElementKind`.
 * @param isLabel the boolean that indicates if class must be computed for label.
 * @internal exported for testing purpose
 */
export function computeAllBpmnClassNames(style: string, isLabel: boolean): string[] {
  const classes: string[] = [];
  // shape=bpmn.message-flow-icon --> message-flow-icon
  const cleanedStyle = style.replace(/shape=bpmn./g, '');
  classes.push(computeBpmnBaseClassName(cleanedStyle));
  if (isLabel) {
    classes.push('bpmn-label');
  }
  return classes;
}

/**
 * Compute the class name in an hyphen case form.
 * For instance, `userTask` returns `bpmn-user-task`
 *
 * @param bpmnElementKind the string representation of a BPMN element kind i.e {@link ShapeBpmnElementKind} and {@link FlowKind}.
 * @internal
 */
export function computeBpmnBaseClassName(bpmnElementKind: string): string {
  return !bpmnElementKind ? '' : 'bpmn-' + bpmnElementKind.replace(/([A-Z])/g, g => '-' + g[0].toLowerCase());
}
