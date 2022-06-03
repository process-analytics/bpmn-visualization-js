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

import type { BpmnEventKind, GlobalTaskKind, ShapeBpmnCallActivityKind, ShapeBpmnEventDefinitionKind, ShapeBpmnMarkerKind, ShapeBpmnSubProcessKind } from './kinds';
import { ShapeBpmnElementKind, ShapeBpmnEventBasedGatewayKind } from './kinds';

/**
 * @internal
 */
export default class ShapeBpmnElement {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly kind: ShapeBpmnElementKind,
    public parent?: ShapeBpmnElement | Participant,
    readonly instantiate: boolean = false,
  ) {}
}

/**
 * @internal
 */
export class ShapeBpmnActivity extends ShapeBpmnElement {
  constructor(id: string, name: string, kind: ShapeBpmnElementKind, parent: ShapeBpmnElement, instantiate?: boolean, readonly markers: ShapeBpmnMarkerKind[] = []) {
    super(id, name, kind, parent, instantiate);
  }
}

/**
 * @internal
 */
export class ShapeBpmnCallActivity extends ShapeBpmnActivity {
  constructor(
    id: string,
    name: string,
    readonly callActivityKind: ShapeBpmnCallActivityKind,
    parent: ShapeBpmnElement,
    markers?: ShapeBpmnMarkerKind[],
    readonly globalTaskKind?: GlobalTaskKind,
  ) {
    super(id, name, ShapeBpmnElementKind.CALL_ACTIVITY, parent, undefined, markers);
  }
}

/**
 * @internal
 */
export class ShapeBpmnSubProcess extends ShapeBpmnActivity {
  constructor(id: string, name: string, readonly subProcessKind: ShapeBpmnSubProcessKind, parent: ShapeBpmnElement, markers?: ShapeBpmnMarkerKind[]) {
    super(id, name, ShapeBpmnElementKind.SUB_PROCESS, parent, undefined, markers);
  }
}

/**
 * @internal
 */
export class ShapeBpmnEvent extends ShapeBpmnElement {
  constructor(id: string, name: string, elementKind: BpmnEventKind, readonly eventDefinitionKind: ShapeBpmnEventDefinitionKind, parent: ShapeBpmnElement) {
    super(id, name, elementKind, parent);
  }
}

/**
 * @internal
 */
export class ShapeBpmnStartEvent extends ShapeBpmnEvent {
  constructor(id: string, name: string, eventDefinitionKind: ShapeBpmnEventDefinitionKind, parent: ShapeBpmnElement, readonly isInterrupting?: boolean) {
    super(id, name, ShapeBpmnElementKind.EVENT_START, eventDefinitionKind, parent);
  }
}

/**
 * @internal
 */
export class ShapeBpmnBoundaryEvent extends ShapeBpmnEvent {
  constructor(id: string, name: string, eventDefinitionKind: ShapeBpmnEventDefinitionKind, parent: ShapeBpmnElement, readonly isInterrupting: boolean = true) {
    super(id, name, ShapeBpmnElementKind.EVENT_BOUNDARY, eventDefinitionKind, parent);
  }
}

/**
 * @internal
 */
export class ShapeBpmnEventBasedGateway extends ShapeBpmnElement {
  constructor(id: string, name: string, parent: ShapeBpmnElement, instantiate?: boolean, readonly gatewayKind = ShapeBpmnEventBasedGatewayKind.None) {
    super(id, name, ShapeBpmnElementKind.GATEWAY_EVENT_BASED, parent, instantiate);
  }
}

/**
 * @internal
 */
export class Participant {
  constructor(readonly id: string, readonly name?: string, public processRef?: string) {}
}
