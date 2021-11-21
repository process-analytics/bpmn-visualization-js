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
import { computeBpmnBaseClassName } from '../mxgraph/renderer/style-utils';
import { CssRegistry } from './css-registry';
import MxGraphCellUpdater, { newMxGraphCellUpdater } from '../mxgraph/MxGraphCellUpdater';
import { BpmnQuerySelectors } from './query-selectors';
import { BpmnElement, Overlay } from './types';
import { BpmnModelRegistry } from './bpmn-model-registry';
import { BpmnElementKind } from '../../model/bpmn/internal';

export function newBpmnElementsRegistry(bpmnModelRegistry: BpmnModelRegistry, graph: BpmnMxGraph): BpmnElementsRegistry {
  return new BpmnElementsRegistry(bpmnModelRegistry, new HtmlElementRegistry(new BpmnQuerySelectors(graph.container?.id)), new CssRegistry(), newMxGraphCellUpdater(graph));
}

/**
 * @category Custom Behavior
 * @experimental subject to change, feedback welcome.
 *
 * > BpmnElementRegistry is a public API that permits to find the BpmnElements present in the diagram.
 * > How to access it:
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

  /**
   * Get all elements by ids. The returned array contains elements in the order of the `bpmnElementIds` parameter.
   *
   * Not found elements are not returned as undefined in the array, so the returned array contains at most as much elements as the `bpmnElementIds` parameter.
   *
   * ```javascript
   * ...
   * // Find all elements by specified id or ids
   * const bpmnElements1 = bpmnVisualization.bpmnElementsRegistry.getElementsByIds('userTask_1');
   * const bpmnElements2 = bpmnVisualization.bpmnElementsRegistry.getElementsByIds(['startEvent_3', 'userTask_2']);
   * // now you can do whatever you want with the elements
   * ...
   * ```
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
    this.mxGraphCellUpdater.addOverlays(bpmnElementId, overlays);
  }

  /**
   * Remove all overlays of a BPMN element.
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
    this.mxGraphCellUpdater.removeAllOverlays(bpmnElementId);
  }
}

class HtmlElementRegistry {
  constructor(private querySelectors: BpmnQuerySelectors) {}

  /**
   * Returns `null` if no element is found.
   * @param bpmnElementId the id of the BPMN element represented by the searched Html Element.
   */
  getBpmnHtmlElement(bpmnElementId: string): HTMLElement | null {
    return document.querySelector<HTMLElement>(this.querySelectors.element(bpmnElementId));
  }

  getBpmnHtmlElements(bpmnElementKind: BpmnElementKind): HTMLElement[] {
    const selectors = this.querySelectors.elementsOfKind(computeBpmnBaseClassName(bpmnElementKind));
    return [...document.querySelectorAll<HTMLElement>(selectors)];
  }
}
