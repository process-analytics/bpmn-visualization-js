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

import Label from '../Label';
import { Flow } from './flows';
import { MessageVisibleKind } from './kinds';

/**
 * @internal
 */
export class Edge {
  constructor(
    readonly id: string,
    readonly bpmnElement: Flow,
    readonly waypoints?: Waypoint[],
    readonly label?: Label,
    readonly messageVisibleKind: MessageVisibleKind = MessageVisibleKind.NONE,
  ) {}
}

/**
 * @internal
 */
export class Waypoint {
  constructor(readonly x: number, readonly y: number) {}
}
