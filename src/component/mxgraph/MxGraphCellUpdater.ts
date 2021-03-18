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
import { Overlay, OverlayPosition } from '../registry';
import { BpmnOverlay, BpmnOverlayOptions } from './overlay/BpmnOverlay';
import { ensureIsArray } from '../helpers/array-utils';
import { ShapeBpmnEventKind } from '../../model/bpmn/internal/shape';
import { PaintParameter } from './shape/render';

export default class MxGraphCellUpdater {
  constructor(readonly graph: BpmnMxGraph) {}

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
      const bpmnOverlay = new BpmnOverlay(overlay.label, this.overlayPositions.get(overlay.position));
      this.graph.addCellOverlay(mxCell, bpmnOverlay);
    });
  }

  private overlayPositions: Map<OverlayPosition, BpmnOverlayOptions> = new Map([
    // Edge
    ['start', { horizontalAlign: 'left', verticalAlign: 'top' }],
    ['middle', { horizontalAlign: 'center', verticalAlign: 'top' }],
    ['end', { horizontalAlign: 'right', verticalAlign: 'top' }],
    // Shape
    ['top-left', { horizontalAlign: 'left', verticalAlign: 'top' }],
    ['top-right', { horizontalAlign: 'right', verticalAlign: 'top' }],
    ['bottom-left', { horizontalAlign: 'left', verticalAlign: 'bottom' }],
    ['bottom-right', { horizontalAlign: 'right', verticalAlign: 'bottom' }],
  ]);
}
