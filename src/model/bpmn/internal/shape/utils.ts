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

import { ShapeBpmnElementKind, ShapeBpmnEventDefinitionKind } from './kinds';
import type { FilterParameter } from '../../../../component/helpers/array-utils';
import { filter } from '../../../../component/helpers/array-utils';

/**
 * Utils to simplify the management of {@link ShapeBpmnElementKind}.
 *
 * This class is mainly used for internal purpose. You may use it to customize the BPMN theme as proposed in the examples but be aware it is subject to change.
 *
 * @category BPMN
 * @experimental
 */
export class ShapeUtil {
  static isEvent(kind: ShapeBpmnElementKind | string): boolean {
    return isKindOf(EVENT_KINDS, kind);
  }

  static eventKinds(): ShapeBpmnElementKind[] {
    return [...EVENT_KINDS];
  }

  static isBoundaryEvent(kind: ShapeBpmnElementKind): boolean {
    return ShapeBpmnElementKind.EVENT_BOUNDARY === kind;
  }

  static isStartEvent(kind: ShapeBpmnElementKind): boolean {
    return ShapeBpmnElementKind.EVENT_START === kind;
  }

  static isCallActivity(kind: ShapeBpmnElementKind): boolean {
    return ShapeBpmnElementKind.CALL_ACTIVITY === kind;
  }

  static isSubProcess(kind: ShapeBpmnElementKind): boolean {
    return ShapeBpmnElementKind.SUB_PROCESS === kind;
  }

  static canHaveNoneEvent(kind: ShapeBpmnElementKind): boolean {
    return ShapeBpmnElementKind.EVENT_INTERMEDIATE_THROW === kind || ShapeBpmnElementKind.EVENT_END === kind || ShapeBpmnElementKind.EVENT_START === kind;
  }

  static isActivity(kind: ShapeBpmnElementKind | string): boolean {
    return isKindOf(ACTIVITY_KINDS, kind);
  }

  static activityKinds(): ShapeBpmnElementKind[] {
    return [...ACTIVITY_KINDS];
  }

  static isWithDefaultSequenceFlow(kind: ShapeBpmnElementKind): boolean {
    return FLOW_NODE_WITH_DEFAULT_SEQUENCE_FLOW_KINDS.includes(kind);
  }

  /**
   * Returns `true` if `kind` is related to a task, for instance {@link ShapeBpmnElementKind.TASK}, {@link ShapeBpmnElementKind.TASK_SERVICE}, but not a {@link ShapeBpmnElementKind.GLOBAL_TASK}.
   */
  static isTask(kind: ShapeBpmnElementKind | string): boolean {
    return isKindOf(TASK_KINDS, kind);
  }
  /**
   * Returns all kinds related to a task, for instance {@link ShapeBpmnElementKind.TASK}, {@link ShapeBpmnElementKind.TASK_SEND}, but not a {@link ShapeBpmnElementKind.GLOBAL_TASK}.
   */
  static taskKinds(): ShapeBpmnElementKind[] {
    return [...TASK_KINDS];
  }

  static gatewayKinds(): ShapeBpmnElementKind[] {
    return [...GATEWAY_KINDS];
  }

  static isGateway(kind: ShapeBpmnElementKind | string): boolean {
    return isKindOf(GATEWAY_KINDS, kind);
  }

  static flowNodeKinds(): ShapeBpmnElementKind[] {
    return Object.values(ShapeBpmnElementKind).filter(kind => !ShapeUtil.isPoolOrLane(kind));
  }

  static isPoolOrLane(kind: ShapeBpmnElementKind | string): boolean {
    return kind == ShapeBpmnElementKind.POOL || kind == ShapeBpmnElementKind.LANE;
  }
}

function filterKind(suffix: string, options?: FilterParameter): ShapeBpmnElementKind[] {
  return filter(Object.values(ShapeBpmnElementKind), suffix, options);
}

function isKindOf(referenceKinds: ShapeBpmnElementKind[], kind: ShapeBpmnElementKind | string): boolean {
  return Object.values(referenceKinds)
    .map(value => value as string)
    .includes(kind);
}

const EVENT_KINDS = filterKind('Event');
const GATEWAY_KINDS = filterKind('Gateway');

const TASK_KINDS = filterKind('Task', { ignoreCase: true, notStartingWith: 'global' });

const ACTIVITY_KINDS = [...TASK_KINDS, ShapeBpmnElementKind.CALL_ACTIVITY, ShapeBpmnElementKind.SUB_PROCESS];
const FLOW_NODE_WITH_DEFAULT_SEQUENCE_FLOW_KINDS = [
  ...ACTIVITY_KINDS,
  ShapeBpmnElementKind.GATEWAY_EXCLUSIVE,
  ShapeBpmnElementKind.GATEWAY_INCLUSIVE,
  ShapeBpmnElementKind.GATEWAY_COMPLEX,
];

/**
 * Elements that are effectively used in BPMN diagram as base for eventDefinition i.e all {@link ShapeBpmnEventDefinitionKind} elements except {@link ShapeBpmnEventDefinitionKind.NONE}
 * @internal
 */
export const eventDefinitionKinds = Object.values(ShapeBpmnEventDefinitionKind).filter(kind => kind != ShapeBpmnEventDefinitionKind.NONE);
