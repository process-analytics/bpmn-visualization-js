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

import type { BpmnGraph } from './BpmnGraph';
import { BpmnStyleIdentifier } from './style';
import type { Overlay } from '../registry';
import { MaxGraphCustomOverlay } from './overlay/custom-overlay';
import { ensureIsArray } from '../helpers/array-utils';
import { OverlayConverter } from './overlay/OverlayConverter';
import { messageFowIconId } from './BpmnRenderer';

/**
 * @internal
 */
export function newGraphCellUpdater(graph: BpmnGraph): GraphCellUpdater {
  return new GraphCellUpdater(graph, new OverlayConverter());
}

/**
 * @internal
 */
export default class GraphCellUpdater {
  constructor(readonly graph: BpmnGraph, readonly overlayConverter: OverlayConverter) {}

  updateAndRefreshCssClassesOfCell(bpmnElementId: string, cssClasses: string[]): void {
    this.updateAndRefreshCssClassesOfElement(bpmnElementId, cssClasses);
    // special case: message flow icon is stored in a dedicated Cell, so it must be kept in sync
    this.updateAndRefreshCssClassesOfElement(messageFowIconId(bpmnElementId), cssClasses);
  }

  private updateAndRefreshCssClassesOfElement(elementId: string, cssClasses: string[]): void {
    const cell = this.graph.model.getCell(elementId);
    if (!cell) {
      return;
    }
    const view = this.graph.getView();
    const state = view.getState(cell);
    state.style[BpmnStyleIdentifier.EXTRA_CSS_CLASSES] = cssClasses;
    state.shape.redraw();
    // Ensure that label classes are also updated. When there is no label, state.text is null
    state.text?.redraw();
  }

  addOverlays(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    const cell = this.graph.model.getCell(bpmnElementId);
    if (!cell) {
      return;
    }
    ensureIsArray(overlays).forEach(overlay => {
      const bpmnOverlay = new MaxGraphCustomOverlay(overlay.label, this.overlayConverter.convert(overlay));
      this.graph.addCellOverlay(cell, bpmnOverlay);
    });
  }

  removeAllOverlays(bpmnElementId: string): void {
    const cell = this.graph.model.getCell(bpmnElementId);
    if (!cell) {
      return;
    }
    this.graph.removeCellOverlays(cell);
  }
}
