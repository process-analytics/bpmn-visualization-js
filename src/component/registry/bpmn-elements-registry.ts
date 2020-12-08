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
import { ensureIsArray } from '../parser/json/converter/utils';
import { ShapeBpmnElementKind } from '../../model/bpmn/internal/shape';

export class BpmnElementsRegistry {
  // TODO move comments from HtmlElementRegistry here

  constructor(private containerId: string) {}

  getElementsByIds(bpmnElementIds: string | string[]): BpmnElement[] {
    const ids = ensureIsArray(bpmnElementIds);

    return [];
  }

  getElementsByKinds(kinds: ShapeBpmnElementKind | ShapeBpmnElementKind[]): BpmnElement[] {
    return [];
  }
}

export interface BpmnElement {
  htmlElement: HTMLElement;
  id: string;
  label: string;
  kind: ShapeBpmnElementKind;
}
