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

import { ensureIsArray } from '../helpers/array-utils';

export class CssRegistry {
  // TODO using a Set internally will prevent multi transformation (only when getting the class list)
  private classNamesByBPMNId = new Map<string, string[]>();

  /**
   * Get the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @return the registered CSS class names
   */
  getClassNames(bpmnElementId: string): string[] {
    return this.classNamesByBPMNId.get(bpmnElementId) || [];
  }

  /**
   * Register the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @param classNames the CSS class names to register
   * @return true if at least one class name from parameters has been added; false otherwise
   */
  addClassNames(bpmnElementId: string, classNames: string[]): boolean {
    const initialClassNames = new Set(this.classNamesByBPMNId.get(bpmnElementId));
    const resultingClassNames = new Set(initialClassNames);
    ensureIsArray(classNames).forEach(c => resultingClassNames.add(c));

    this.classNamesByBPMNId.set(bpmnElementId, Array.from(resultingClassNames));
    return resultingClassNames.size > initialClassNames.size;
  }

  // return `true` if at least one class has been removed
  removeClassNames(bpmnElementId: string, classNames: string[]): boolean {
    // TODO need review with addClassNames for consistency + decide to directly use Set
    const existingClassNames = this.classNamesByBPMNId.get(bpmnElementId);
    const remainingClasses = new Set(existingClassNames);

    let removed = false;
    ensureIsArray(classNames).forEach(c => (removed = remainingClasses.delete(c) || removed));

    this.classNamesByBPMNId.set(bpmnElementId, Array.from(remainingClasses));
    return removed;
  }
}
