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
 *         <g style="" class="bpmn-pool" data-bpmn-id="Participant_1">....</g>
 *       </g>
 *       <g>
 *         <g style="" class="overlay-badge" data-bpmn-id="Participant_1">...</g>
 *       </g>
 *       <g></g>
 *     </g>
 *   </svg>
 * </div>
 * ```
 * In the 2nd 'g' node, children 'g' nodes with the 'data-cell-id' attribute (extra attribute generated by the lib) are only available when the rendering is done
 */
export class BpmnQuerySelectors {
  constructor(private containerId: string) {}

  // TODO do we make explicit that this selector targets a SVG group?
  existingElement(): string {
    return `#${this.containerId} > svg > g > g > g[data-bpmn-id]`;
  }

  element(bpmnElementId: string): string {
    // TODO use more precise selector (use child combinator)
    return `#${this.containerId} svg g g[data-bpmn-id="${bpmnElementId}"]`;
  }

  labelOfElement(bpmnElementId?: string): string {
    return `#${this.containerId} > svg > g > g > g[data-bpmn-id="${bpmnElementId}"].bpmn-label > g > foreignObject`;
  }

  elementsOfKind(bpmnKindCssClassname: string): string {
    return `#${this.containerId} > svg > g > g > g.${bpmnKindCssClassname}:not(.bpmn-label)`;
  }
}
