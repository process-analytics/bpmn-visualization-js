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
import { CallActivityType } from './CallActivityType';
import { SubProcessType } from './SubProcessType';
import { MarkerType } from './MarkerType';
import { EventType } from './EventType';
import { BaseElementEventType } from './InternalBPMNShapeUtil';

export default class ShapeBaseElement {
  constructor(readonly id: string, readonly name: string, readonly type: ShapeBaseElementType, public parentId?: string, readonly instantiate: boolean = false) {}
}

export class ShapeBpmnActivity extends ShapeBaseElement {
  constructor(id: string, name: string, type: ShapeBaseElementType, parentId: string, instantiate?: boolean, readonly markers: MarkerType[] = []) {
    super(id, name, type, parentId, instantiate);
  }
}

export class ShapeBpmnCallActivity extends ShapeBpmnActivity {
  constructor(id: string, name: string, readonly callActivityType: CallActivityType, parentId: string, markers?: MarkerType[]) {
    super(id, name, ShapeBaseElementType.CALL_ACTIVITY, parentId, undefined, markers);
  }
}

export class ShapeBpmnSubProcess extends ShapeBpmnActivity {
  constructor(id: string, name: string, readonly subProcessType: SubProcessType, parentId: string, markers?: MarkerType[]) {
    super(id, name, ShapeBaseElementType.SUB_PROCESS, parentId, undefined, markers);
  }
}

export class ShapeBpmnEvent extends ShapeBaseElement {
  constructor(id: string, name: string, elementType: BaseElementEventType, readonly eventKind: EventType, parentId: string) {
    super(id, name, elementType, parentId);
  }
}

export class ShapeBpmnStartEvent extends ShapeBpmnEvent {
  constructor(id: string, name: string, eventType: EventType, parentId: string, readonly isInterrupting?: boolean) {
    super(id, name, ShapeBaseElementType.EVENT_START, eventType, parentId);
  }
}

export class ShapeBpmnBoundaryEvent extends ShapeBpmnEvent {
  constructor(id: string, name: string, eventType: EventType, parentId: string, readonly isInterrupting: boolean = true) {
    super(id, name, ShapeBaseElementType.EVENT_BOUNDARY, eventType, parentId);
  }
}

export class Participant {
  constructor(readonly id: string, readonly name?: string, public processRef?: string) {}
}
