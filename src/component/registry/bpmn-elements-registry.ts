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
import { BpmnMxGraph } from '../mxgraph/BpmnMxGraph';
import { extractBpmnKindFromStyle } from '../mxgraph/style-helper';

/**
 * @experimental subject to change, feedback welcome
 */
export class BpmnElementsRegistry {
  private bpmnModelRegistry: BpmnModelRegistry;
  private htmlElementRegistry: HtmlElementRegistry;

  constructor(graph: BpmnMxGraph) {
    // TODO this should not be instantiate here but injected
    this.bpmnModelRegistry = new BpmnModelRegistry(graph);
    this.htmlElementRegistry = new HtmlElementRegistry(new BpmnQuerySelectors(graph.container?.id));
  }

  // TODO doc, not found elements are not present in the return array
  getElementsByIds(bpmnElementIds: string | string[]): BpmnElement[] {
    // TODO move ensureIsArray to helpers/arrays.ts and add dedicated tests
    const ids = ensureIsArray(bpmnElementIds) as string[];

    const bpmnElements: BpmnElement[] = [];
    ids.forEach(id => {
      const bpmnSemantic = this.bpmnModelRegistry.getBpmnSemantic(id);
      if (bpmnSemantic) {
        const bpmnHtmlElement = this.htmlElementRegistry.getBpmnHtmlElement(id);
        bpmnElements.push({ ...bpmnSemantic, htmlElement: bpmnHtmlElement });
      }
    });

    return bpmnElements;
  }

  // TODO we should also allow FlowKind
  // we probably to introduce something like 'type BpmnKind = ShapeBpmnElementKind | FlowKind'
  // getElementsByKinds(kinds: ShapeBpmnElementKind | ShapeBpmnElementKind[]): BpmnElement[] {
  //   return [];
  // }
}

interface BpmnSemantic {
  id: string;
  label: string;
  isShape: boolean;
  // TODO this would be more 'typed oriented' to use ShapeBpmnElementKind | FlowKind (as part of #929)
  kind: string;
}

export interface BpmnElement extends BpmnSemantic {
  htmlElement: HTMLElement;
}

// for now, we don't store the BpmnModel so we can use it, information are only available in the mxgraph model
class BpmnModelRegistry {
  constructor(private graph: BpmnMxGraph) {}

  getBpmnSemantic(bpmnElementId: string): BpmnSemantic | undefined {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (mxCell == null) {
      return undefined;
    }

    const label = mxCell.value;
    const isShape = mxCell.isVertex();
    const kind = extractBpmnKindFromStyle(mxCell);

    return { id: bpmnElementId, label: label, isShape: isShape, kind: kind };
  }
}

export class BpmnQuerySelectors {
  constructor(private containerId: string) {}

  /**
   * Once mxGraph is initialized at BpmnVisualization construction, prior loading a BPMN diagram, the DOM looks like:
   * ```html
   * <div id="bpmn-container" style="touch-action: none;">
   *   <svg style="left: 0px; top: 0px; width: 100%; height: 100%; display: block; min-width: 1px; min-height: 1px;">
   *     <g>
   *       <g></g>
   *       <g></g>
   *       <g></g>
   *       <g></g>
   *     </g>
   *   </svg>
   * </div>
   * ```
   *
   * After loading, the DOM looks like:
   * ```html
   * <div id="bpmn-container" style="touch-action: none;">
   *   <svg style="left: 0px; top: 0px; width: 100%; height: 100%; display: block; min-width: 900px; min-height: 181px;">
   *     <g>
   *       <g></g>
   *       <g>
   *         <g style="" class="pool" data-bpmn-id="Participant_1">....</g>
   *       </g>
   *       <g></g>
   *       <g></g>
   *     </g>
   *   </svg>
   * </div>
   * ```
   * In the 2nd 'g' node, children 'g' nodes with the 'data-cell-id' attribute (extra attribute generated by the lib) are only available when the rendering is done
   */

  // TODO do we make explicit that this is a svg group?
  firstAvailableElement(bpmnElementId?: string): string {
    if (!bpmnElementId) {
      return `#${this.containerId} > svg > g > g > g[data-bpmn-id]`;
    }
    // TODO use more precise selector
    return `#${this.containerId} svg g g[data-bpmn-id="${bpmnElementId}"]`;
  }

  labelOfFirstAvailableElement(bpmnElementId?: string): string {
    // TODO use more precise selector
    return `#${this.containerId} svg g g[data-bpmn-id="${bpmnElementId}"] g foreignObject`;
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
    return document.querySelector<HTMLElement>(this.selectors.firstAvailableElement(bpmnElementId));
  }
}
