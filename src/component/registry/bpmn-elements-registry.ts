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

import { ensureIsArray } from '../helpers/array-utils';
import { BpmnMxGraph } from '../mxgraph/BpmnMxGraph';
import { computeBpmnBaseClassName } from '../mxgraph/style-helper';
import { CssRegistry } from './css-registry';
import MxGraphCellUpdater from '../mxgraph/MxGraphCellUpdater';
import { BpmnQuerySelectors } from './query-selectors';
import { BpmnElement } from './types';
import { BpmnModelRegistry } from './bpmn-model-registry';
import { BpmnElementKind } from '../../model/bpmn/internal/api';

export function newBpmnElementsRegistry(bpmnModelRegistry: BpmnModelRegistry, graph: BpmnMxGraph): BpmnElementsRegistry {
  return new BpmnElementsRegistry(bpmnModelRegistry, new HtmlElementRegistry(new BpmnQuerySelectors(graph.container?.id)), new CssRegistry(), new MxGraphCellUpdater(graph));
}

/**
 * @category Interaction
 * @experimental subject to change, feedback welcome.
 *
 * > BpmnElementRegistry is a public API that permits to find the BpmnElements present in the diagram.
 * > How to access it:
 *
 * ```javascript
 * // 1. Initialize the BpmnVisualization.
 * const bpmnVisualization = new bpmnvisu.BpmnVisualization(document.getElementById('bpmn-container'));
 * // 2. Get diagram and load it.
 * const bpmn = 'BPMN diagram string - whether coming from bpmn.xml file or some API call';
 * bpmnVisualization.load(bpmn);
 * // 3. Access registry directly from bpmnVisualization.
 * bpmnVisualization.bpmnElementsRegistry
 * ```
 */
export class BpmnElementsRegistry {
  /**
   * @internal
   */
  constructor(
    private bpmnModelRegistry: BpmnModelRegistry,
    private htmlElementRegistry: HtmlElementRegistry,
    private cssRegistry: CssRegistry,
    private mxGraphCellUpdater: MxGraphCellUpdater,
  ) {}

  // TODO doc, not found elements are not present in the return array
  /**
   * Get all elements by ids.
   *
   * ```javascript
   * ...
   * // Find all elements by specified id or ids
   * const bpmnElementsSet1 = bpmnVisualization.bpmnElementsRegistry.getElementsByIds('userTask_1');
   * const bpmnElementsSet2 = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['startEvent_3', 'userTask_2']);
   * // now you can do whatever you want with the elements
   * ...
   * ```
   */
  getElementsByIds(bpmnElementIds: string | string[]): BpmnElement[] {
    return ensureIsArray<string>(bpmnElementIds)
      .map(id => this.bpmnModelRegistry.getBpmnSemantic(id))
      .filter(e => e)
      .map(bpmnSemantic => ({ bpmnSemantic: bpmnSemantic, htmlElement: this.htmlElementRegistry.getBpmnHtmlElement(bpmnSemantic.id) }));
  }

  /**
   * Get all elements by kinds.
   *
   * ```javascript
   * ...
   * // Find all elements by desired type or types
   * const bpmnTaskElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(bpmnvisu.ShapeBpmnElementKind.TASK);
   * const bpmnEndEventAndPoolElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([bpmnvisu.ShapeBpmnElementKind.EVENT_END, bpmnvisu.ShapeBpmnElementKind.POOL]);
   * // now you can do whatever you want with the elements
   * ...
   * ```
   */
  getElementsByKinds(bpmnKinds: BpmnElementKind | BpmnElementKind[]): BpmnElement[] {
    const bpmnElements: BpmnElement[] = [];
    ensureIsArray<BpmnElementKind>(bpmnKinds)
      .map(kind =>
        // TODO when implementing #953, use the model to search for Bpmn elements matching kinds instead of css selectors
        this.htmlElementRegistry.getBpmnHtmlElements(kind).map(
          htmlElement =>
            ({
              htmlElement: htmlElement,
              bpmnSemantic: this.bpmnModelRegistry.getBpmnSemantic(htmlElement.getAttribute('data-bpmn-id')),
            } as BpmnElement),
        ),
      )
      // We will be able to use flatmap instead when targeting es2019+
      .forEach(innerBpmnElements => bpmnElements.push(...innerBpmnElements));

    return bpmnElements;
  }

  /**
   * Add one/several CSS class(es) to one/several BPMN element(s).
   *
   * Notice that if you pass ids that are not related to existing BPMN elements, their reference will be kept within the registry but nothing happens on the rendering side.
   *
   * @example
   * ```javascript
   * // Add 'success-path' to BPMN elements with id: flow_1 and flow_5
   * bpmnVisualization.bpmnElementsRegistry.addCssClasses(['flow_1', 'flow_5'], 'success-path');
   *
   * // Add 'suspicious-path' and 'additional-info' to BPMN element with id: task_3
   * bpmnVisualization.bpmnElementsRegistry.addCssClasses('task_3', ['suspicious-path', 'additional-info']);
   * ```
   *
   * @param bpmnElementIds The BPMN id of the element(s) where to add the CSS classes
   * @param classNames The name of the class(es) to add to the BPMN element(s)
   */
  addCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.updateCssClasses(bpmnElementIds, classNames, this.cssRegistry.addClassNames.bind(this.cssRegistry));
  }

  /**
   * Remove one/several CSS class(es) from one/several BPMN element(s).
   *
   * @example
   * ```javascript
   * // Remove 'highlight' from BPMN elements with id: activity_1 and activity_2
   * bpmnVisualization.bpmnElementsRegistry.removeCssClasses(['activity_1', 'activity_2'], 'highlight');
   *
   * // Remove 'running' and 'additional-info' from BPMN element with id: task_3
   * bpmnVisualization.bpmnElementsRegistry.removeCssClasses('task_3', ['running', 'additional-info']);
   * ```
   *
   * @param bpmnElementIds The BPMN id of the element(s) where to remove the CSS classes
   * @param classNames The name of the class(es) to remove from the BPMN element(s)
   */
  removeCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.updateCssClasses(bpmnElementIds, classNames, this.cssRegistry.removeClassNames.bind(this.cssRegistry));
  }

  /**
   * Toggle one/several CSS class(es) for one/several BPMN element(s).
   * Notice that if you pass ids that are not related to existing BPMN elements, their reference will be kept within the registry but nothing happens on the rendering side.
   *
   * @example
   * ```javascript
   * // Toggle 'highlight' for BPMN elements with id: activity_1 and activity_2
   * bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['activity_1', 'activity_2'], 'highlight');
   *
   * // Toggle 'running' and 'additional-info' for BPMN element with id: task_3
   * bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('task_3', ['running', 'additional-info']);
   * ```
   *
   * @param bpmnElementIds The BPMN id of the element(s) where to remove the CSS classes
   * @param classNames The name of the class(es) to remove from the BPMN element(s)
   */
  toggleCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.updateCssClasses(bpmnElementIds, classNames, this.cssRegistry.toggleClassNames.bind(this.cssRegistry));
  }

  private updateCssClasses(bpmnElementIds: string | string[], classNames: string | string[], updateClassNames: (bpmnElementId: string, classNames: string[]) => boolean): void {
    const arrayClassNames = ensureIsArray<string>(classNames);
    ensureIsArray<string>(bpmnElementIds).forEach(bpmnElementId => this.updateCellIfChanged(updateClassNames(bpmnElementId, arrayClassNames), bpmnElementId));
  }

  private updateCellIfChanged(updateCell: boolean, bpmnElementId: string): void {
    if (updateCell) {
      const allClassNames = this.cssRegistry.getClassNames(bpmnElementId);
      this.mxGraphCellUpdater.updateAndRefreshCssClassesOfCell(bpmnElementId, allClassNames);
    }
  }
}

class HtmlElementRegistry {
  constructor(private selectors: BpmnQuerySelectors) {}

  /**
   * Returns `null` if no element is found.
   * @param bpmnElementId the id of the BPMN element represented by the searched Html Element.
   */
  getBpmnHtmlElement(bpmnElementId: string): HTMLElement | null {
    // TODO error management, for now we return null
    return document.querySelector<HTMLElement>(this.selectors.element(bpmnElementId));
  }

  getBpmnHtmlElements(bpmnElementKind: BpmnElementKind): HTMLElement[] {
    const selectors = this.selectors.elementsOfKind(computeBpmnBaseClassName(bpmnElementKind));
    return [...document.querySelectorAll<HTMLElement>(selectors)];
  }
}
