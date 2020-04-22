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
import { ShapeBpmnElementKind } from './ShapeBpmnElementKind';

// TODO move to ShapeBpmnElementKind? and rename into ShapeBpmnElementKindUtil?
// TODO bpmnEventKinds and flowNodeKinds currently hosted in ProcessConverter may be hosted here
export default class ShapeUtil {
  private static readonly EVENTS_KIND = ShapeUtil.filterKind('Event');
  private static readonly GATEWAY_KINDS = ShapeUtil.filterKind('Gateway');

  private static filterKind(suffix: string): ShapeBpmnElementKind[] {
    return Object.values(ShapeBpmnElementKind).filter(kind => {
      return kind.endsWith(suffix);
    });
  }

  public static isEvent(kind: ShapeBpmnElementKind): boolean {
    return this.EVENTS_KIND.includes(kind);
  }

  // TODO should we clone the array to avoid modifications of this ref array by client code?
  // topLevelBpmnEventKinds to not mixed with the bpmnEventKinds that currently are the list of non None event subtypes
  public static topLevelBpmnEventKinds(): ShapeBpmnElementKind[] {
    return this.EVENTS_KIND;
  }
  public static topLevelBpmnGatewayKinds(): ShapeBpmnElementKind[] {
    return this.GATEWAY_KINDS;
  }
}
