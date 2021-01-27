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
  private classNamesByBPMNId = new Map<string, Set<string>>();

  /**
   * Get the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @return the registered CSS class names
   */
  getClassNames(bpmnElementId: string): string[] {
    return Array.from(this.classNamesByBPMNId.get(bpmnElementId) || []);
  }

  /**
   * Register the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @param classNames the CSS class names to register
   * @return true if at least one class name from parameters has been added; false otherwise
   */
  addClassNames(bpmnElementId: string, classNames: string[]): boolean {
    const currentClassNames = this.getOrInitializeClassNames(bpmnElementId);
    const initialClassNamesNumber = currentClassNames.size;
    ensureIsArray(classNames).forEach(c => currentClassNames.add(c));
    return currentClassNames.size != initialClassNamesNumber;
  }

  private getOrInitializeClassNames(bpmnElementId: string): Set<string> {
    let classNames = this.classNamesByBPMNId.get(bpmnElementId);
    if (classNames == null) {
      classNames = new Set();
      this.classNamesByBPMNId.set(bpmnElementId, classNames);
    }
    return classNames;
  }

  // return `true` if at least one class has been removed
  removeClassNames(bpmnElementId: string, classNames: string[]): boolean {
    const currentClassNames = this.getOrInitializeClassNames(bpmnElementId);
    const initialClassNamesNumber = currentClassNames.size;
    ensureIsArray(classNames).forEach(c => currentClassNames.delete(c)); // TODO duplication with addClassNames (the method call on the set only differs)
    return currentClassNames.size != initialClassNamesNumber;
  }

  // return true if passed classes array has at least one element - as toggle will always trigger changes in that case
  toggleClasses(bpmnElementId: string, classNames: string[]): boolean {
    const currentClassNames = this.getOrInitializeClassNames(bpmnElementId);
    if (currentClassNames.size === 0) {
      this.addClassNames(bpmnElementId, classNames);
    } else {
      ensureIsArray(classNames).forEach(c => {
        currentClassNames.has(c) ? currentClassNames.delete(c) : currentClassNames.add(c);
      });
    }
    return classNames.length > 0;
  }
}
