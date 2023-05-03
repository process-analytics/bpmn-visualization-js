/*
Copyright 2021 Bonitasoft S.A.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { ensureIsArray } from '../helpers/array-utils';

/**
 * @internal
 */
export class CssRegistry {
  private classNamesByBpmnId = new Map<string, Set<string>>();

  /**
   * Clear all classes that were registered.
   */
  clear = (): void => {
    this.classNamesByBpmnId.clear();
  };

  /**
   * Get the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @return the registered CSS class names
   */
  getClassNames(bpmnElementId: string): string[] {
    return Array.from(this.classNamesByBpmnId.get(bpmnElementId) ?? []);
  }

  /**
   * Register the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @param classNames the CSS class names to register
   * @return `true` if at least one class name from parameters has been added; `false` otherwise
   */
  addClassNames(bpmnElementId: string, classNames: string[]): boolean {
    return this.updateClassNames(bpmnElementId, classNames, (currentClassNames, className) => currentClassNames.add(className));
  }

  /**
   * Remove the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @param classNames the CSS class names to remove
   * @return `true` if at least one class name from parameters has been removed; `false` otherwise
   */
  removeClassNames(bpmnElementId: string, classNames: string[]): boolean {
    return this.updateClassNames(bpmnElementId, classNames, (currentClassNames, className) => currentClassNames.delete(className));
  }

  /**
   * Remove all CSS class names for specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @return `true` if at least one class name has been removed; `false` otherwise
   */
  removeAllClassNames(bpmnElementId: string): boolean {
    const currentClassNames = this.getOrInitializeClassNames(bpmnElementId);
    const initialClassNamesNumber = currentClassNames.size;
    currentClassNames.clear();
    return currentClassNames.size < initialClassNamesNumber;
  }

  /**
   * Toggle the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN id of the HTML element from the DOM
   * @param classNames the CSS class names to toggle
   * @return `true` if `classNames` has at least one element - as toggle will always trigger changes in that case; `false` otherwise
   */
  toggleClassNames(bpmnElementId: string, classNames: string[]): boolean {
    this.updateClassNames(bpmnElementId, classNames, (currentClassNames, className) =>
      currentClassNames.has(className) ? currentClassNames.delete(className) : currentClassNames.add(className),
    );
    return classNames && classNames.length > 0;
  }

  private updateClassNames(bpmnElementId: string, classNames: string[], manageClassNames: (currentClassNames: Set<string>, className: string) => void): boolean {
    const currentClassNames = this.getOrInitializeClassNames(bpmnElementId);
    const initialClassNamesNumber = currentClassNames.size;
    ensureIsArray(classNames).forEach(className => manageClassNames(currentClassNames, className));
    return currentClassNames.size != initialClassNamesNumber;
  }

  private getOrInitializeClassNames(bpmnElementId: string): Set<string> {
    let classNames = this.classNamesByBpmnId.get(bpmnElementId);
    if (classNames == null) {
      classNames = new Set();
      this.classNamesByBpmnId.set(bpmnElementId, classNames);
    }
    return classNames;
  }
}
