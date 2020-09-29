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
import { ShapeBpmnEventType } from './ShapeBpmnEventType';
import { BpmnEventType } from './ShapeUtil';
import { ShapeBpmnSubProcessKind } from './ShapeBpmnSubProcessKind';
import { ShapeBpmnMarkerType } from './ShapeBpmnMarkerType';
import { ShapeBpmnCallActivityType } from './ShapeBpmnCallActivityType';

export default class ShapeBpmnElement {
  constructor(readonly id: string, readonly name: string, readonly type: ShapeBpmnElementType, public parentId?: string, readonly instantiate: boolean = false) {}
}

export class ShapeBpmnActivity extends ShapeBpmnElement {
  constructor(id: string, name: string, type: ShapeBpmnElementType, parentId: string, instantiate?: boolean, readonly markers: ShapeBpmnMarkerType[] = []) {
    super(id, name, type, parentId, instantiate);
  }
}

export class ShapeBpmnCallActivity extends ShapeBpmnActivity {
  constructor(id: string, name: string, readonly callActivityType: ShapeBpmnCallActivityType, parentId: string, markers?: ShapeBpmnMarkerType[]) {
    super(id, name, ShapeBpmnElementType.CALL_ACTIVITY, parentId, undefined, markers);
  }
}

export class ShapeBpmnSubProcess extends ShapeBpmnActivity {
  constructor(id: string, name: string, readonly subProcessKind: ShapeBpmnSubProcessKind, parentId: string, markers?: ShapeBpmnMarkerType[]) {
    super(id, name, ShapeBpmnElementType.SUB_PROCESS, parentId, undefined, markers);
  }
}

export class ShapeBpmnEvent extends ShapeBpmnElement {
  constructor(id: string, name: string, elementType: BpmnEventType, readonly eventKind: ShapeBpmnEventType, parentId: string) {
    super(id, name, elementType, parentId);
  }
}

export class ShapeBpmnStartEvent extends ShapeBpmnEvent {
  constructor(id: string, name: string, eventType: ShapeBpmnEventType, parentId: string, readonly isInterrupting?: boolean) {
    super(id, name, ShapeBpmnElementType.EVENT_START, eventType, parentId);
  }
}

export class ShapeBpmnBoundaryEvent extends ShapeBpmnEvent {
  constructor(id: string, name: string, eventType: ShapeBpmnEventType, parentId: string, readonly isInterrupting: boolean = true) {
    super(id, name, ShapeBpmnElementType.EVENT_BOUNDARY, eventType, parentId);
  }
}

export class Participant {
  constructor(readonly id: string, readonly name?: string, public processRef?: string) {}
}
