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

import { ensureIsArray } from '../helpers/array-utils';
import type { BpmnGraph } from '../mxgraph/BpmnGraph';
import { computeBpmnBaseClassName } from '../mxgraph/renderer/style-utils';
import { CssRegistry } from './css-registry';
import type GraphCellUpdater from '../mxgraph/GraphCellUpdater';
import { newGraphCellUpdater } from '../mxgraph/GraphCellUpdater';
import { BpmnQuerySelectors } from './query-selectors';
import type { BpmnElement, Overlay, StyleUpdate } from './types';
import type { BpmnModelRegistry } from './bpmn-model-registry';
import type { BpmnElementKind } from '../../model/bpmn/internal';

/**
 * @internal
 */
export function newBpmnElementsRegistry(bpmnModelRegistry: BpmnModelRegistry, graph: BpmnGraph): BpmnElementsRegistry {
  const cssRegistry = new CssRegistry();
  return new BpmnElementsRegistry(bpmnModelRegistry, new HtmlElementRegistry(graph.container, new BpmnQuerySelectors()), cssRegistry, newGraphCellUpdater(graph, cssRegistry));
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
export class BpmnElementsRegistry {
  /**
   * @internal
   */
  constructor(
    private bpmnModelRegistry: BpmnModelRegistry,
    private htmlElementRegistry: HtmlElementRegistry,
    private cssRegistry: CssRegistry,
    private graphCellUpdater: GraphCellUpdater,
  ) {
    this.bpmnModelRegistry.registerOnLoadCallback(() => {
      this.cssRegistry.clear();
      this.graphCellUpdater.clear();
    });
  }

  /**
   * Get all elements by ids. The returned array contains elements in the order of the `bpmnElementIds` parameter.
   *
   * Not found elements are not returned as undefined in the array, so the returned array contains at most as many elements as the `bpmnElementIds` parameter.
   *
   * ```javascript
   * ...
   * // Find all elements by specified id or ids
   * const bpmnElements1 = bpmnVisualization.bpmnElementsRegistry.getElementsByIds('userTask_1');
   * const bpmnElements2 = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['startEvent_3', 'userTask_2']);
   * // now you can do whatever you want with the elements
   * ...
   * ```
   *
   * **WARNING**: this method is not designed to accept a large amount of ids. It does DOM lookup to retrieve the HTML elements relative to the BPMN elements.
   * Attempts to retrieve too many elements, especially on large BPMN diagram, may lead to performance issues.
   */
  getElementsByIds(bpmnElementIds: string | string[]): BpmnElement[] {
    return ensureIsArray<string>(bpmnElementIds)
      .map(id => this.bpmnModelRegistry.getBpmnSemantic(id))
      .filter(Boolean)
      .map(bpmnSemantic => ({ bpmnSemantic: bpmnSemantic, htmlElement: this.htmlElementRegistry.getBpmnHtmlElement(bpmnSemantic.id) }));
  }

  /**
   * Get all elements by kinds.
   *
   * ```javascript
   * ...
   * // Find all elements by desired type or types
   * const bpmnTaskElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds(ShapeBpmnElementKind.TASK);
   * const bpmnEndEventAndPoolElements = bpmnVisualization.bpmnElementsRegistry.getElementsByKinds([ShapeBpmnElementKind.EVENT_END, ShapeBpmnElementKind.POOL]);
   * // now you can do whatever you want with the elements
   * ...
   * ```
   *
   * **WARNING**: this method is not designed to accept a large amount of types. It does DOM lookup to retrieve the HTML elements relative to the BPMN elements.
   * Attempts to retrieve too many elements, especially on large BPMN diagrams, may lead to performance issues.
   */
  getElementsByKinds(bpmnKinds: BpmnElementKind | BpmnElementKind[]): BpmnElement[] {
    return ensureIsArray<BpmnElementKind>(bpmnKinds)
      .map(kind =>
        this.htmlElementRegistry.getBpmnHtmlElements(kind).map(htmlElement => ({
          htmlElement: htmlElement,
          bpmnSemantic: this.bpmnModelRegistry.getBpmnSemantic(htmlElement.getAttribute('data-bpmn-id')),
        })),
      )
      .reduce((accumulator, bpmnElements) => {
        accumulator.push(...bpmnElements);
        return accumulator;
      }, []);
  }

  /**
   * Add one or more CSS classes to one or more BPMN elements.
   *
   * **Notes**:
   *
   * - If an ID is passed that does not reference an existing BPMN element, its reference is retained in the registry, but no rendering changes are made.
   * - This method is intended to set CSS classes on specific elements, e.g. to hide or highlight them. During BPMN diagram rendering, `bpmn-visualization` sets specific CSS classes to all elements based on their types.
   * - To style all elements of a given type, use the default classes instead of adding new ones. The classes allow identification of elements of the same `family' and of the same specific type.
   * - For example, a BPMN Service Task is an `Activity` and a `Task`. So it has the `bpmn-type-activity` and the `bpmn-type-task` classes. It shares these classes with all types of `Tasks`.
   * - It also has the specific `bpmn-service-task` to distinguish it from a BPMN User Task which has a `bpmn-user-task`.
   * - In addition, labels also have the `bpmn-label` classes.
   *
   * See the repository providing the [examples of the `bpmn-visualization` TypeScript library](https://github.com/process-analytics/bpmn-visualization-examples/) for more details.
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
   * @param bpmnElementIds The BPMN ID of the element(s) to add the CSS classes to. Passing a nullish parameter or an empty array has no effect.
   * @param classNames The name of the class(es) to add to the BPMN element(s).
   *
   * @see {@link removeCssClasses} to remove specific CSS classes from a BPMN element.
   * @see {@link removeAllCssClasses} to remove all CSS classes from a BPMN element.
   * @see {@link toggleCssClasses} to toggle CSS classes on a BPMN element.
   * @see {@link updateStyle} to directly update the style of BPMN elements.
   */
  addCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.updateCssClasses(bpmnElementIds, classNames, this.cssRegistry.addClassNames);
  }

  /**
   * Remove one or more CSS classes that were previously added to one or more BPMN elements using the {@link addCssClasses} or the {@link toggleCssClasses} methods.
   *
   * **Note**: If you pass IDs that are not related to existing BPMN elements, they will be ignored and no changes will be made to the rendering.
   *
   * @example
   * ```javascript
   * // Remove 'highlight' from BPMN elements with ID: activity_1 and activity_2
   * bpmnVisualization.bpmnElementsRegistry.removeCssClasses(['activity_1', 'activity_2'], 'highlight');
   *
   * // Remove 'running' and 'additional-info' from BPMN element with ID: task_3
   * bpmnVisualization.bpmnElementsRegistry.removeCssClasses('task_3', ['running', 'additional-info']);
   * ```
   *
   * @param bpmnElementIds The BPMN ID of the element(s) from which to remove the CSS classes. Passing a nullish parameter or an empty array has no effect.
   * @param classNames The name of the class(es) to remove from the BPMN element(s).
   *
   * @see {@link removeAllCssClasses} to remove all CSS classes from a BPMN element.
   */
  removeCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.updateCssClasses(bpmnElementIds, classNames, this.cssRegistry.removeClassNames);
  }

  /**
   * Remove any CSS classes that were previously added to one or more BPMN elements using the {@link addCssClasses} or the {@link toggleCssClasses} methods.
   *
   * **Note**: If you pass IDs that are not related to existing BPMN elements, they will be ignored and no changes will be made to the rendering.
   *
   * @example
   * ```javascript
   * // Remove all CSS classes from all BPMN elements
   * bpmnVisualization.bpmnElementsRegistry.removeAllCssClasses();
   *
   * // Remove all CSS classes from BPMN elements with ID: activity_1 and activity_2
   * bpmnVisualization.bpmnElementsRegistry.removeAllCssClasses(['activity_1', 'activity_2']);
   *
   * // Remove all CSS classes from BPMN element with ID: task_3
   * bpmnVisualization.bpmnElementsRegistry.removeAllCssClasses('task_3');
   * ```
   *
   * @param bpmnElementIds The BPMN ID of the element(s) from which to remove all CSS classes.
   * When passing a nullish parameter, all CSS classes associated with all BPMN elements will be removed. Passing an empty array has no effect.
   *
   * @see {@link removeCssClasses} to remove specific classes from a BPMN element.
   * @since 0.34.0
   */
  removeAllCssClasses(bpmnElementIds?: string | string[]): void {
    if (bpmnElementIds) {
      ensureIsArray<string>(bpmnElementIds).forEach(bpmnElementId => {
        const isChanged = this.cssRegistry.removeAllClassNames(bpmnElementId);
        this.updateCellIfChanged(isChanged, bpmnElementId);
      });
    } else {
      const bpmnIds = this.cssRegistry.getBpmnIds();
      this.cssRegistry.clear();
      bpmnIds.forEach(bpmnElementId => this.updateCellIfChanged(true, bpmnElementId));
    }
  }

  /**
   * Toggle one or more CSS classes on one or more BPMN elements.
   *
   * **Note**: If an ID is passed that does not reference an existing BPMN element, its reference is retained in the registry, but no rendering changes are made.
   *
   * @example
   * ```javascript
   * // Toggle 'highlight' for BPMN elements with ID: activity_1 and activity_2
   * bpmnVisualization.bpmnElementsRegistry.toggleCssClasses(['activity_1', 'activity_2'], 'highlight');
   *
   * // Toggle 'running' and 'additional-info' for BPMN element with ID: task_3
   * bpmnVisualization.bpmnElementsRegistry.toggleCssClasses('task_3', ['running', 'additional-info']);
   * ```
   *
   * @param bpmnElementIds The BPMN ID of the element(s) on which to toggle the CSS classes. Passing a nullish parameter or an empty array has no effect.
   * @param classNames The name of the class(es) to toggle on the BPMN element(s).
   *
   * @see {@link removeCssClasses} to remove specific CSS classes from a BPMN element.
   * @see {@link removeAllCssClasses} to remove all CSS classes from a BPMN element.
   * @see {@link addCssClasses} to add CSS classes to a BPMN element.
   */
  toggleCssClasses(bpmnElementIds: string | string[], classNames: string | string[]): void {
    this.updateCssClasses(bpmnElementIds, classNames, this.cssRegistry.toggleClassNames);
  }

  private updateCssClasses(bpmnElementIds: string | string[], classNames: string | string[], updateClassNames: (bpmnElementId: string, classNames: string[]) => boolean): void {
    const arrayClassNames = ensureIsArray<string>(classNames);
    ensureIsArray<string>(bpmnElementIds).forEach(bpmnElementId => this.updateCellIfChanged(updateClassNames(bpmnElementId, arrayClassNames), bpmnElementId));
  }

  private updateCellIfChanged(updateCell: boolean, bpmnElementId: string): void {
    if (updateCell) {
      const allClassNames = this.cssRegistry.getClassNames(bpmnElementId);
      this.graphCellUpdater.updateAndRefreshCssClassesOfCell(bpmnElementId, allClassNames);
    }
  }

  /**
   * Add one/several overlays to a BPMN element.
   *
   * Notice that if you pass an id that is not related to an existing BPMN element, nothing happens on the rendering side.
   *
   * @example
   * ```javascript
   * // Add an overlay to BPMN elements with id 'task_1'
   * bpmnVisualization.bpmnElementsRegistry.addOverlays('task_1', {
   *    position: 'top-left',
   *    label: '40',
   *    style: {
   *      font: { color: 'Chartreuse', size: 8 },
   *      fill: { color: 'Pink', opacity: 50 },
   *      stroke: { color: 'DarkSeaGreen', width: 2 }
   *    }
   * });
   *
   * // Add several overlays to BPMN element with id 'task_3'
   * bpmnVisualization.bpmnElementsRegistry.addOverlays('task_3', [
   *    {
   *      position: 'bottom-right',
   *      label: '110',
   *      style: {
   *        font: { color: '#663399', size: 8 },
   *        fill: { color: '#FFDAB9', opacity: 50 },
   *        stroke: { color: 'DarkSeaGreen', width: 2 }
   *      }
   *    },
   *    {
   *      position: 'top-left',
   *      label: '40',
   *      style: {
   *        font: { color: 'MidnightBlue', size: 30 },
   *        fill: { color: 'Aquamarine', opacity: 70 },
   *        stroke: { color: '#4B0082', width: 1 }
   *      }
   *    }
   * ]);
   * ```
   *
   * @param bpmnElementId The BPMN id of the element where to add the overlays
   * @param overlays The overlays to add to the BPMN element
   */
  addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    this.graphCellUpdater.addOverlays(bpmnElementId, overlays);
  }

  /**
   * Remove all overlays of a BPMN element.
   *
   * Notice that if you pass an id that is not related to an existing BPMN element, nothing happens on the rendering side.
   *
   * <b>WARNING</b>: could be renamed when adding support for removal of one or several specific overlays.
   *
   * @example
   * ```javascript
   * //  all overlays of the BPMN element with id: activity_1
   * bpmnVisualization.bpmnElementsRegistry.removeAllOverlays('activity_1');
   * ```
   *
   * @param bpmnElementId The BPMN id of the element where to remove the overlays
   */
  removeAllOverlays(bpmnElementId: string): void {
    this.graphCellUpdater.removeAllOverlays(bpmnElementId);
  }

  /**
   * Update the style of one or several BPMN elements.
   *
   * @example
   * ```javascript
   * bpmnVisualization.bpmnElementsRegistry.updateStyle('activity_1', {
   *   stroke: {
   *     color: 'red',
   *   },
   * });
   * ```
   *
   * **Notes**:
   *
   * - This method is intended to update the style of specific elements, e.g. to update their colors. When rendering a BPMN diagram, `bpmn-visualization` applies style properties
   * to all elements according to their types.
   * So if you want to style all elements of a certain type, change the default configuration of the styles instead of updating the element afterwards. See the repository providing the
   * [examples of the `bpmn-visualization` TypeScript library](https://github.com/process-analytics/bpmn-visualization-examples/) for more details.
   * - If you pass IDs that are not related to existing BPMN elements, they will be ignored and no changes will be made to the rendering.
   *
   * @param bpmnElementIds The BPMN ID of the element(s) whose style must be updated.
   * @param styleUpdate The style properties to update.
   *
   * @see {@link resetStyle} to reset the style of one or several BPMN elements.
   * @see {@link addCssClasses} to add CSS classes to a BPMN element.
   * @see {@link removeCssClasses} to remove specific classes from a BPMN element.
   * @see {@link removeAllCssClasses} to remove all CSS classes from a BPMN element.
   * @see {@link toggleCssClasses} to toggle CSS classes on a BPMN element.
   * @since 0.33.0
   */
  updateStyle(bpmnElementIds: string | string[], styleUpdate: StyleUpdate): void {
    this.graphCellUpdater.updateStyle(bpmnElementIds, styleUpdate);
  }

  /**
   * Reset the style that were previously updated to one or more BPMN elements using the {@link updateStyle} method.
   *
   * @example
   * ```javascript
   * bpmnVisualization.bpmnElementsRegistry.resetStyle('activity_1');
   * ```
   *
   * **Notes**:
   *
   * - This method is intended to update the style of specific elements, e.g. to update their colors. When rendering a BPMN diagram, `bpmn-visualization` applies style properties
   * to all elements according to their types.
   * So if you want to style all elements of a certain type, change the default configuration of the styles instead of updating the element afterward. See the repository providing the
   * [examples of the `bpmn-visualization` TypeScript library](https://github.com/process-analytics/bpmn-visualization-examples/) for more details.
   * - If you pass IDs that are not related to existing BPMN elements, they will be ignored and no changes will be made to the rendering.
   *
   * @param bpmnElementIds The BPMN ID of the element(s) whose style must be reset.
   * When passing a nullish parameter, the style of all BPMN elements will be reset. Passing an empty array has no effect.
   *
   * @see {@link updateStyle} to update the style of one or several BPMN elements.
   * @see {@link addCssClasses} to add CSS classes to a BPMN element.
   * @see {@link removeCssClasses} to remove specific classes from a BPMN element.
   * @see {@link removeAllCssClasses} to remove all CSS classes from a BPMN element.
   * @see {@link toggleCssClasses} to toggle CSS classes on a BPMN element.
   * @since 0.37.0
   */
  resetStyle(bpmnElementIds?: string | string[]): void {
    this.graphCellUpdater.resetStyle(bpmnElementIds);
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
