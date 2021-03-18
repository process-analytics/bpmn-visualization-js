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
import { BpmnMxGraph } from './BpmnMxGraph';
import { StyleIdentifier } from './StyleUtils';
import { Overlay } from '../registry';
import { BpmnOverlay } from './overlay/BpmnOverlay';
import { ensureIsArray } from '../helpers/array-utils';
import { OverlayConverter } from './overlay/OverlayConverter';

export function newMxGraphCellUpdater(graph: BpmnMxGraph): MxGraphCellUpdater {
  return new MxGraphCellUpdater(graph, new OverlayConverter());
}

export default class MxGraphCellUpdater {
  constructor(readonly graph: BpmnMxGraph, readonly overlayConverter: OverlayConverter) {}

  public updateAndRefreshCssClassesOfCell(bpmnElementId: string, cssClasses: string[]): void {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (!mxCell) {
      return;
    }
    const view = this.graph.getView();
    const state = view.getState(mxCell);
    state.style[StyleIdentifier.BPMN_STYLE_EXTRA_CSS_CLASSES] = cssClasses;
    state.shape.apply(state);
    state.shape.redraw();
  }

  public addOverlay(bpmnElementId: string, overlays: Overlay | Overlay[]): void {
    const mxCell = this.graph.getModel().getCell(bpmnElementId);
    if (!mxCell) {
      return;
    }

    // TODO: use mxGraph transaction
    ensureIsArray(overlays).forEach(overlay => {
      const bpmnOverlay = new BpmnOverlay(overlay.label, this.overlayConverter.convertPosition(overlay));
      this.graph.addCellOverlay(mxCell, bpmnOverlay);
    });
  }
}
