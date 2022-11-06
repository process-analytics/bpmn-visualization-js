/**
 * Copyright 2021 Bonitasoft S.A.
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
import { BpmnQuerySelectors } from '../../src/component/registry/query-selectors';

export class BpmnQuerySelectorsForTests extends BpmnQuerySelectors {
  /**
   * This targets a SVG Group
   */
  existingElement(): string {
    return `svg > g > g > g[data-bpmn-id]`;
  }

  labelLastDiv(bpmnElementId: string): string {
    // * is for 'foreignObject'
    // Using 'foreignObject' do not work anymore with jest@28 (jsdom bump for 16.6 to 19)
    return `${this.labelSvgGroup(bpmnElementId)} > g > * > div > div > div`;
  }

  labelSvgGroup(bpmnElementId: string): string {
    return `svg > g > g > g[data-bpmn-id="${bpmnElementId}"].bpmn-label`;
  }

  /**
   * This targets a SVG Group
   */
  overlays(bpmnElementId: string): string {
    return `svg > g > g:nth-child(3) > g[data-bpmn-id="${bpmnElementId}"]`;
  }
}
