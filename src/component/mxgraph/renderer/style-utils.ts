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

import type { Cell, CellStyle } from '@maxgraph/core';
import { FlowKind, ShapeUtil } from '../../../model/bpmn/internal';
import { MessageVisibleKind } from '../../../model/bpmn/internal/edge/kinds';
import { BpmnStyleIdentifier } from '../style/identifiers';

/**
 * Compute the all class names associated to a cell in a hyphen case form.
 *
 * @param cell the `Cell` related to the BPMN element.
 * @param isLabel the boolean that indicates if class must be computed for label.
 * @internal
 */
export function computeAllBpmnClassNamesOfCell(cell: Cell, isLabel: boolean): string[] {
  return computeAllBpmnClassNames(cell.style, isLabel);
}

/**
 * Compute the all class names associated to a given bpmn element in a hyphen case form.
 *
 * @param style the part of the Cell style related to a {@link BpmnElementKind}. Message flow icon is a special case, as it is not related to `BpmnElementKind`.
 * @param isLabel the boolean that indicates if class must be computed for label.
 * @internal exported for testing purpose
 */
export function computeAllBpmnClassNames(style: CellStyle, isLabel: boolean): string[] {
  const classes: string[] = [];

  const styleElements = style.split(';');
  const pseudoBpmnElementKind = styleElements[0];
  // shape=bpmn.message-flow-icon --> message-flow-icon
  const bpmnElementKind = pseudoBpmnElementKind.replace(/shape=bpmn./g, '');

  const typeClasses = new Map<string, boolean>();
  typeClasses.set('bpmn-type-activity', ShapeUtil.isActivity(bpmnElementKind));
  typeClasses.set('bpmn-type-container', ShapeUtil.isPoolOrLane(bpmnElementKind));
  typeClasses.set('bpmn-type-event', ShapeUtil.isEvent(bpmnElementKind));
  typeClasses.set('bpmn-type-flow', isFlowKind(bpmnElementKind));
  typeClasses.set('bpmn-type-gateway', ShapeUtil.isGateway(bpmnElementKind));
  typeClasses.set('bpmn-type-task', ShapeUtil.isTask(bpmnElementKind));
  [...typeClasses].filter(([, isType]) => isType).forEach(([className]) => classes.push(className));

  classes.push(computeBpmnBaseClassName(bpmnElementKind));

  styleElements
    .map(entry => {
      const elements = entry.split('=');
      return [elements[0], elements[1]];
    })
    .forEach(([key, value]) => {
      switch (key) {
        case BpmnStyleIdentifier.EVENT_DEFINITION_KIND:
          classes.push(`bpmn-event-def-${value}`);
          break;
        case BpmnStyleIdentifier.EVENT_BASED_GATEWAY_KIND:
          classes.push(`bpmn-gateway-kind-${value.toLowerCase()}`);
          break;
        case BpmnStyleIdentifier.IS_INITIATING: // message flow icon
          classes.push(value == MessageVisibleKind.NON_INITIATING ? 'bpmn-icon-non-initiating' : 'bpmn-icon-initiating');
          break;
        case BpmnStyleIdentifier.SUB_PROCESS_KIND:
          classes.push(`bpmn-sub-process-${value.toLowerCase()}`);
          break;
        case BpmnStyleIdentifier.GLOBAL_TASK_KIND:
          classes.push(computeBpmnBaseClassName(value));
          break;
      }
    });

  if (isLabel) {
    classes.push('bpmn-label');
  }
  return classes;
}

function isFlowKind(kind: string): boolean {
  return Object.values(FlowKind)
    .map(value => value as string)
    .includes(kind);
}

/**
 * Compute the class name in a hyphen case form.
 * For instance, `userTask` returns `bpmn-user-task`
 *
 * @param bpmnElementKind usually, the string representation of a BPMN element kind i.e {@link ShapeBpmnElementKind} and {@link FlowKind}.
 * @internal
 */
export function computeBpmnBaseClassName(bpmnElementKind: string): string {
  return !bpmnElementKind ? '' : 'bpmn-' + bpmnElementKind.replace(/([A-Z])/g, g => '-' + g[0].toLowerCase());
}
