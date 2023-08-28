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

import type { CssClassesRegistry } from './types';
import { ensureIsArray } from '../helpers/array-utils';
import type { BpmnGraph } from '../mxgraph/BpmnGraph';
import { createNewCssClassesUpdater, type CssClassesUpdater } from '../mxgraph/style/css-classes-updater';

export function createNewCssRegistry(graph: BpmnGraph): CssClassesRegistryImpl {
  return new CssClassesRegistryImpl(createNewCssClassesUpdater(graph), new CssClassesCache());
}

export class CssClassesRegistryImpl implements CssClassesRegistry {
  constructor(
    private readonly cssClassesUpdater: CssClassesUpdater,
    private readonly cssClassesCache: CssClassesCache,
  ) {}

  clearCache(): void {
    this.cssClassesCache.clear();
  }

  addCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.updateCssClasses(bpmnElementIds, classNames, this.cssClassesCache.addClassNames);
  }

  removeCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.updateCssClasses(bpmnElementIds, classNames, this.cssClassesCache.removeClassNames);
  }

  removeAllCssClasses(bpmnElementIds?: string | string[]): void {
    if (bpmnElementIds) {
      ensureIsArray<string>(bpmnElementIds).forEach(bpmnElementId => {
        const isChanged = this.cssClassesCache.removeAllClassNames(bpmnElementId);
        this.updateCellIfChanged(isChanged, bpmnElementId);
      });
    } else {
      const bpmnIds = this.cssClassesCache.getBpmnIds();
      this.cssClassesCache.clear();
      bpmnIds.forEach(bpmnElementId => this.updateCellIfChanged(true, bpmnElementId));
    }
  }

  toggleCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.updateCssClasses(bpmnElementIds, classNames, this.cssClassesCache.toggleClassNames);
  }

  private updateCssClasses(bpmnElementIds: string | string[], classNames: string | string[], updateClassNames: (bpmnElementId: string, classNames: string[]) => boolean): void {
    const arrayClassNames = ensureIsArray<string>(classNames);
    ensureIsArray<string>(bpmnElementIds).forEach(bpmnElementId => this.updateCellIfChanged(updateClassNames(bpmnElementId, arrayClassNames), bpmnElementId));
  }

  private updateCellIfChanged(updateCell: boolean, bpmnElementId: string): void {
    if (updateCell) {
      const allClassNames = this.cssClassesCache.getClassNames(bpmnElementId);
      this.cssClassesUpdater.updateAndRefreshCssClassesOfCell(bpmnElementId, allClassNames);
    }
  }
}

/**
 * @internal
 */
export class CssClassesCache {
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
   * @param bpmnElementId the BPMN ID of the HTML element from the DOM
   * @return the registered CSS class names
   */
  getClassNames(bpmnElementId: string): string[] {
    return Array.from(this.classNamesByBpmnId.get(bpmnElementId) ?? []);
  }

  /**
   * Get all registered BPMN element IDs.
   *
   * @return an array representing the BPMN element IDs.
   */
  getBpmnIds(): string[] {
    return Array.from(this.classNamesByBpmnId.keys());
  }

  /**
   * Register the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN ID of the HTML element from the DOM
   * @param classNames the CSS class names to register
   * @return `true` if at least one class name from parameters has been added; `false` otherwise
   */
  addClassNames = (bpmnElementId: string, classNames: string[]): boolean =>
    this.updateClassNames(bpmnElementId, classNames, (currentClassNames, className) => currentClassNames.add(className));

  /**
   * Remove the CSS class names for a specific HTML element
   *
   * @param bpmnElementId the BPMN ID of the HTML element from the DOM
   * @param classNames the CSS class names to remove
   * @return `true` if at least one class name from parameters has been removed; `false` otherwise
   */
  removeClassNames = (bpmnElementId: string, classNames: string[]): boolean =>
    this.updateClassNames(bpmnElementId, classNames, (currentClassNames, className) => currentClassNames.delete(className));

  /**
   * Remove all CSS class names for specific HTML element
   *
   * @param bpmnElementId the BPMN ID of the HTML element from the DOM
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
   * @param bpmnElementId the BPMN ID of the HTML element from the DOM
   * @param classNames the CSS class names to toggle
   * @return `true` if `classNames` has at least one element - as toggle will always trigger changes in that case; `false` otherwise
   */
  toggleClassNames = (bpmnElementId: string, classNames: string[]): boolean => {
    this.updateClassNames(bpmnElementId, classNames, (currentClassNames, className) =>
      currentClassNames.has(className) ? currentClassNames.delete(className) : currentClassNames.add(className),
    );
    return classNames && classNames.length > 0;
  };

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
