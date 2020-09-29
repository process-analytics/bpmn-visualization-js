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
import { ShapeBaseElementType } from './ShapeBaseElementType';

export type BaseElementEventType =
  | ShapeBaseElementType.EVENT_BOUNDARY
  | ShapeBaseElementType.EVENT_START
  | ShapeBaseElementType.EVENT_END
  | ShapeBaseElementType.EVENT_INTERMEDIATE_THROW
  | ShapeBaseElementType.EVENT_INTERMEDIATE_CATCH;

// TODO move to ShapeBpmnElementKind? and rename into ShapeBpmnElementKindUtil?
// TODO bpmnEventKinds currently hosted in ProcessConverter may be hosted here
export default class InternalBPMNShapeUtil {
  private static readonly EVENT_TYPES = InternalBPMNShapeUtil.filterType('Event');
  private static readonly GATEWAY_TYPES = InternalBPMNShapeUtil.filterType('Gateway');

  // TODO : To modify when we will support globalTask (They are not considered as Task in the BPMN Semantic)
  private static TASK_TYPES = InternalBPMNShapeUtil.filterType('Task', true);

  private static ACTIVITY_TYPES = [...InternalBPMNShapeUtil.TASK_TYPES, ShapeBaseElementType.CALL_ACTIVITY, ShapeBaseElementType.SUB_PROCESS];
  private static FLOWNODE_WITH_DEFAULT_SEQUENCE_FLOW_TYPES = [
    ...InternalBPMNShapeUtil.ACTIVITY_TYPES,
    ShapeBaseElementType.GATEWAY_EXCLUSIVE,
    ShapeBaseElementType.GATEWAY_INCLUSIVE,

    // TODO: Uncomment when complex gateway are supported
    // ShapeBpmnElementKind.GATEWAY_COMPLEX,
  ];

  private static filterType(suffix: string, ignoreCase = false): ShapeBaseElementType[] {
    return Object.values(ShapeBaseElementType).filter(type => {
      if (ignoreCase) {
        return type.endsWith(suffix) || type.toLowerCase().endsWith(suffix.toLowerCase());
      }
      return type.endsWith(suffix);
    });
  }

  public static isEvent(type: ShapeBaseElementType): boolean {
    return this.EVENT_TYPES.includes(type);
  }

  public static isCallActivity(type: ShapeBaseElementType): boolean {
    return ShapeBaseElementType.CALL_ACTIVITY === type;
  }

  public static isSubProcess(type: ShapeBaseElementType): boolean {
    return ShapeBaseElementType.SUB_PROCESS === type;
  }

  public static isBoundaryEvent(type: ShapeBaseElementType): boolean {
    return ShapeBaseElementType.EVENT_BOUNDARY === type;
  }

  public static isStartEvent(type: ShapeBaseElementType): boolean {
    return ShapeBaseElementType.EVENT_START === type;
  }

  public static canHaveNoneEvent(type: ShapeBaseElementType): boolean {
    return ShapeBaseElementType.EVENT_INTERMEDIATE_THROW === type || ShapeBaseElementType.EVENT_END === type || ShapeBaseElementType.EVENT_START === type;
  }

  public static isActivity(type: ShapeBaseElementType): boolean {
    return this.ACTIVITY_TYPES.includes(type);
  }

  public static isWithDefaultSequenceFlow(type: ShapeBaseElementType): boolean {
    return this.FLOWNODE_WITH_DEFAULT_SEQUENCE_FLOW_TYPES.includes(type);
  }

  // TODO should we clone the array to avoid modifications of this ref array by client code?
  // topLevelBpmnEventKinds to not mixed with the bpmnEventKinds that currently are the list of non None event subtypes
  public static topLevelBpmnEventTypes(): ShapeBaseElementType[] {
    return this.EVENT_TYPES;
  }

  public static activityTypes(): ShapeBaseElementType[] {
    return this.ACTIVITY_TYPES;
  }

  public static taskTypes(): ShapeBaseElementType[] {
    return this.TASK_TYPES;
  }

  public static gatewayTypes(): ShapeBaseElementType[] {
    return this.GATEWAY_TYPES;
  }

  public static flowNodeTypes(): ShapeBaseElementType[] {
    return Object.values(ShapeBaseElementType).filter(type => {
      return !InternalBPMNShapeUtil.isPoolOrLane(type);
    });
  }

  public static isPoolOrLane(type: ShapeBaseElementType): boolean {
    return type == ShapeBaseElementType.POOL || type == ShapeBaseElementType.LANE;
  }
}
