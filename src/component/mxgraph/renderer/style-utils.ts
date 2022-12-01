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

import type { Cell } from '@maxgraph/core';

import { FlowKind, ShapeUtil } from '../../../model/bpmn/internal';
import type { BPMNCellStyle } from './StyleComputer';

/**
 * Compute the all class names associated to a cell in a hyphen case form.
 *
 * @param cell the `Cell` related to the BPMN element.
 * @param isLabel the boolean that indicates if class must be computed for label.
 * @internal
 */
export function computeAllBpmnClassNamesOfCell(cell: Cell, isLabel: boolean): string[] {
  return computeAllBpmnClassNames(cell.style as BPMNCellStyle, isLabel);
}

/**
 * Compute the all class names associated to a given bpmn element in a hyphen case form.
 *
 * @param style the part of the Cell style related to a {@link BpmnElementKind}. Message flow icon is a special case, as it is not related to `BpmnElementKind`.
 * @param isLabel the boolean that indicates if class must be computed for label.
 * @internal exported for testing purpose
 */
export function computeAllBpmnClassNames(style: BPMNCellStyle, isLabel: boolean): string[] {
  const classes: string[] = [];

  // TODO style.bpmn.kind could be omit by considering the first element of style.baseStyleNames (this would restore the previous behavior)
  const bpmnElementKind = style.bpmn.kind;
  // eslint-disable-next-line no-console
  console.info('computeAllBpmnClassNames - style', style);
  // eslint-disable-next-line no-console
  console.info('computeAllBpmnClassNames - bpmnElementKind', bpmnElementKind);

  const typeClasses = new Map<string, boolean>();
  typeClasses.set('bpmn-type-activity', ShapeUtil.isActivity(bpmnElementKind));
  typeClasses.set('bpmn-type-container', ShapeUtil.isPoolOrLane(bpmnElementKind));
  typeClasses.set('bpmn-type-event', ShapeUtil.isEvent(bpmnElementKind));
  typeClasses.set('bpmn-type-flow', isFlowKind(bpmnElementKind));
  typeClasses.set('bpmn-type-gateway', ShapeUtil.isGateway(bpmnElementKind));
  typeClasses.set('bpmn-type-task', ShapeUtil.isTask(bpmnElementKind));
  [...typeClasses].filter(([, isType]) => isType).forEach(([className]) => classes.push(className));

  classes.push(computeBpmnBaseClassName(bpmnElementKind));

  if (style.bpmn.eventDefinitionKind) {
    classes.push(`bpmn-event-def-${style.bpmn.eventDefinitionKind}`);
  }
  if (style.bpmn.gatewayKind) {
    classes.push(`bpmn-gateway-kind-${style.bpmn.gatewayKind.toLowerCase()}`);
  }
  if (style.bpmn.isNonInitiating !== undefined) {
    // message flow icon
    classes.push(style.bpmn.isNonInitiating ? 'bpmn-icon-non-initiating' : 'bpmn-icon-initiating');
  }
  if (style.bpmn.subProcessKind) {
    classes.push(`bpmn-sub-process-${style.bpmn.subProcessKind.toLowerCase()}`);
  }
  if (style.bpmn.globalTaskKind) {
    classes.push(computeBpmnBaseClassName(style.bpmn.globalTaskKind));
  }
  if (isLabel) {
    classes.push('bpmn-label');
  }
  // eslint-disable-next-line no-console
  console.info('computeAllBpmnClassNames - return', classes);
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
