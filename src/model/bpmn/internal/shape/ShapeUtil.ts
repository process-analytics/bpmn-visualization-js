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
import { ShapeBpmnElementType } from './ShapeBpmnElementType';

export type BpmnEventType =
  | ShapeBpmnElementType.EVENT_BOUNDARY
  | ShapeBpmnElementType.EVENT_START
  | ShapeBpmnElementType.EVENT_END
  | ShapeBpmnElementType.EVENT_INTERMEDIATE_THROW
  | ShapeBpmnElementType.EVENT_INTERMEDIATE_CATCH;

// TODO move to ShapeBpmnElementKind? and rename into ShapeBpmnElementKindUtil?
// TODO bpmnEventKinds currently hosted in ProcessConverter may be hosted here
export default class ShapeUtil {
  private static readonly EVENT_TYPES = ShapeUtil.filterType('Event');
  private static readonly GATEWAY_TYPES = ShapeUtil.filterType('Gateway');

  // TODO : To modify when we will support globalTask (They are not considered as Task in the BPMN Semantic)
  private static TASK_TYPES = ShapeUtil.filterType('Task', true);

  private static ACTIVITY_TYPES = [...ShapeUtil.TASK_TYPES, ShapeBpmnElementType.CALL_ACTIVITY, ShapeBpmnElementType.SUB_PROCESS];
  private static FLOWNODE_WITH_DEFAULT_SEQUENCE_FLOW_TYPES = [
    ...ShapeUtil.ACTIVITY_TYPES,
    ShapeBpmnElementType.GATEWAY_EXCLUSIVE,
    ShapeBpmnElementType.GATEWAY_INCLUSIVE,

    // TODO: Uncomment when complex gateway are supported
    // ShapeBpmnElementKind.GATEWAY_COMPLEX,
  ];

  private static filterType(suffix: string, ignoreCase = false): ShapeBpmnElementType[] {
    return Object.values(ShapeBpmnElementType).filter(type => {
      if (ignoreCase) {
        return type.endsWith(suffix) || type.toLowerCase().endsWith(suffix.toLowerCase());
      }
      return type.endsWith(suffix);
    });
  }

  public static isEvent(type: ShapeBpmnElementType): boolean {
    return this.EVENT_TYPES.includes(type);
  }

  public static isCallActivity(type: ShapeBpmnElementType): boolean {
    return ShapeBpmnElementType.CALL_ACTIVITY === type;
  }

  public static isSubProcess(type: ShapeBpmnElementType): boolean {
    return ShapeBpmnElementType.SUB_PROCESS === type;
  }

  public static isBoundaryEvent(type: ShapeBpmnElementType): boolean {
    return ShapeBpmnElementType.EVENT_BOUNDARY === type;
  }

  public static isStartEvent(type: ShapeBpmnElementType): boolean {
    return ShapeBpmnElementType.EVENT_START === type;
  }

  public static canHaveNoneEvent(type: ShapeBpmnElementType): boolean {
    return ShapeBpmnElementType.EVENT_INTERMEDIATE_THROW === type || ShapeBpmnElementType.EVENT_END === type || ShapeBpmnElementType.EVENT_START === type;
  }

  public static isActivity(type: ShapeBpmnElementType): boolean {
    return this.ACTIVITY_TYPES.includes(type);
  }

  public static isWithDefaultSequenceFlow(type: ShapeBpmnElementType): boolean {
    return this.FLOWNODE_WITH_DEFAULT_SEQUENCE_FLOW_TYPES.includes(type);
  }

  // TODO should we clone the array to avoid modifications of this ref array by client code?
  // topLevelBpmnEventKinds to not mixed with the bpmnEventKinds that currently are the list of non None event subtypes
  public static topLevelBpmnEventTypes(): ShapeBpmnElementType[] {
    return this.EVENT_TYPES;
  }

  public static activityTypes(): ShapeBpmnElementType[] {
    return this.ACTIVITY_TYPES;
  }

  public static taskTypes(): ShapeBpmnElementType[] {
    return this.TASK_TYPES;
  }

  public static gatewayTypes(): ShapeBpmnElementType[] {
    return this.GATEWAY_TYPES;
  }

  public static flowNodeTypes(): ShapeBpmnElementType[] {
    return Object.values(ShapeBpmnElementType).filter(type => {
      return !ShapeUtil.isPoolOrLane(type);
    });
  }

  public static isPoolOrLane(type: ShapeBpmnElementType): boolean {
    return type == ShapeBpmnElementType.POOL || type == ShapeBpmnElementType.LANE;
  }
}
