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
import Flow from './Flow';
import { MessageVisibleKind } from '../../json-xsd/BPMNDI';
import { Point } from '../../json-xsd/DC';

export default class InternalBPMNEdge {
  constructor(readonly id?: string, readonly bpmnElement?: Flow, readonly waypoints?: Point[], readonly label?: Label, readonly messageVisibleKind?: MessageVisibleKind) {}
}
