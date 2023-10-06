/*
Copyright 2020 Bonitasoft S.A.

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

import type { BpmnModelRegistry } from './bpmn-model-registry';
import type { BpmnElement, BpmnSemantic, CssClassesRegistry, ElementsRegistry, Overlay, OverlaysRegistry, StyleRegistry, StyleUpdate } from './types';
import type { BpmnElementKind } from '../../model/bpmn/internal';
import type { BpmnGraph } from '../mxgraph/BpmnGraph';

import { ensureIsArray } from '../helpers/array-utils';
import { computeBpmnBaseClassName } from '../mxgraph/renderer/style-utils';

import { createNewCssRegistry, type CssClassesRegistryImpl } from './css-registry';
import { createNewOverlaysRegistry } from './overlays-registry';
import { BpmnQuerySelectors } from './query-selectors';
import { createNewStyleRegistry, type StyleRegistryImpl } from './style-registry';

/**
 * @internal
 */
export function createNewBpmnElementsRegistry(bpmnModelRegistry: BpmnModelRegistry, graph: BpmnGraph): BpmnElementsRegistry {
  return new BpmnElementsRegistry(
    bpmnModelRegistry,
    new HtmlElementRegistry(graph.container, new BpmnQuerySelectors()),
    createNewCssRegistry(graph),
    createNewOverlaysRegistry(graph),
    createNewStyleRegistry(graph),
  );
}

/**
 * `BpmnElementRegistry` is a public API that permits to find the BpmnElements present in the diagram.
 * How to access it:
 *
 * ```javascript
 * // 1. Initialize the BpmnVisualization.
 * const bpmnVisualization = new BpmnVisualization({ container: 'bpmn-container' });
 * // 2. Get diagram and load it.
 * const bpmn = 'BPMN diagram string - whether coming from bpmn.xml file or some API call';
 * bpmnVisualization.load(bpmn);
 * // 3. Access registry directly from bpmnVisualization.
 * bpmnVisualization.bpmnElementsRegistry
 * ```
 *
 * **WARN**: subject to change, feedback welcome.
 *
 *  @category Custom Behavior
 *  @experimental
 */
export class BpmnElementsRegistry implements CssClassesRegistry, ElementsRegistry, OverlaysRegistry, StyleRegistry {
  /**
   * @internal
   */
  constructor(
    private readonly bpmnModelRegistry: BpmnModelRegistry,
    private readonly htmlElementRegistry: HtmlElementRegistry,
    private readonly cssClassesRegistry: CssClassesRegistryImpl,
    private readonly overlaysRegistry: OverlaysRegistry,
    private readonly styleRegistry: StyleRegistryImpl,
  ) {
    this.bpmnModelRegistry.registerOnLoadCallback(() => {
      this.cssClassesRegistry.clearCache();
      this.styleRegistry.clearCache();
    });
  }

  getModelElementsByIds(bpmnElementIds: string | string[]): BpmnSemantic[] {
    return ensureIsArray<string>(bpmnElementIds)
      .map(id => this.bpmnModelRegistry.getBpmnSemantic(id))
      .filter(Boolean);
  }

  getElementsByIds(bpmnElementIds: string | string[]): BpmnElement[] {
    return this.getModelElementsByIds(bpmnElementIds).map(bpmnSemantic => ({
      bpmnSemantic: bpmnSemantic,
      htmlElement: this.htmlElementRegistry.getBpmnHtmlElement(bpmnSemantic.id),
    }));
  }

  getModelElementsByKinds(bpmnKinds: BpmnElementKind | BpmnElementKind[]): BpmnSemantic[] {
    return ensureIsArray<BpmnElementKind>(bpmnKinds)
      .flatMap(kind => this.htmlElementRegistry.getBpmnHtmlElements(kind))
      .map(htmlElement => this.getRelatedBpmnSemantic(htmlElement));
  }

  getElementsByKinds(bpmnKinds: BpmnElementKind | BpmnElementKind[]): BpmnElement[] {
    return ensureIsArray<BpmnElementKind>(bpmnKinds)
      .flatMap(kind => this.htmlElementRegistry.getBpmnHtmlElements(kind))
      .map(htmlElement => ({ htmlElement, bpmnSemantic: this.getRelatedBpmnSemantic(htmlElement) }));
  }

  private getRelatedBpmnSemantic(htmlElement: HTMLElement): BpmnSemantic {
    return this.bpmnModelRegistry.getBpmnSemantic(htmlElement.dataset.bpmnId);
  }

  addCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.cssClassesRegistry.addCssClasses(bpmnElementIds, classNames);
  }

  removeCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.cssClassesRegistry.removeCssClasses(bpmnElementIds, classNames);
  }

  removeAllCssClasses(bpmnElementIds?: string | string[]): void {
    this.cssClassesRegistry.removeAllCssClasses(bpmnElementIds);
  }

  toggleCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.cssClassesRegistry.toggleCssClasses(bpmnElementIds, classNames);
  }

  addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    this.overlaysRegistry.addOverlays(bpmnElementId, overlays);
  }

  removeAllOverlays(bpmnElementId: string): void {
    this.overlaysRegistry.removeAllOverlays(bpmnElementId);
  }

  updateStyle(bpmnElementIds: string | string[], styleUpdate: StyleUpdate): void {
    this.styleRegistry.updateStyle(bpmnElementIds, styleUpdate);
  }

  resetStyle(bpmnElementIds?: string | string[]): void {
    this.styleRegistry.resetStyle(bpmnElementIds);
  }
}

class HtmlElementRegistry {
  constructor(
    private container: HTMLElement,
    private querySelectors: BpmnQuerySelectors,
  ) {}

  /**
   * Returns `null` if no element is found.
   * @param bpmnElementId the id of the BPMN element represented by the searched Html Element.
   */
  getBpmnHtmlElement(bpmnElementId: string): HTMLElement | null {
    return this.container.querySelector<HTMLElement>(this.querySelectors.element(bpmnElementId));
  }

  getBpmnHtmlElements(bpmnElementKind: BpmnElementKind): HTMLElement[] {
    const selectors = this.querySelectors.elementsOfKind(computeBpmnBaseClassName(bpmnElementKind));
    return [...this.container.querySelectorAll<HTMLElement>(selectors)];
  }
}
