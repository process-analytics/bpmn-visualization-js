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

import { mxCell } from 'mxgraph'; // for types

/**
 * Compute the all class names associated to a given bpmn element kind in an hyphen case form.
 *
 * @param bpmnElementKind the string representation of a BPMN element kind i.e {@link ShapeBpmnElementKind} and {@link FlowKind}.
 * @param isLabel the boolean that indicates if class must be computed for label.
 * @internal
 */
export function computeAllBpmnClassNames(bpmnElementKind: string, isLabel: boolean): string[] {
  const classes: string[] = [];
  classes.push(computeBpmnBaseClassName(bpmnElementKind));
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

/**
 * Extract the BPMN kind from the style of the cell. It is the string representation of the BPMN element kind i.e {@link ShapeBpmnElementKind} and {@link FlowKind}.
 * @param cell the mxCell whose style is checked.
 * @internal
 */
export function extractBpmnKindFromStyle(cell: mxCell): string {
  return cell.style.split(';')[0];
}
